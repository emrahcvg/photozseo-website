import { describe, it, expect, beforeAll } from 'vitest';
import { onRequestPost } from './apple';
import { onRequestPost as deleteAccount } from '../account/delete';
import { verifySession } from '../../_lib/session';
import {
  bytesToB64url,
  sha256Hex,
  appleOwnerSub,
  makeClientSecret,
  sealToken,
  openToken,
  b64urlToBytes,
  appleKv,
  type AppleJwk,
} from '../../_lib/apple-auth';
import { makeFakeD1 } from '../../_lib/fakeD1';
import { createCompany, upsertMembership, getMembership, getCompany } from '../../_lib/team';
import { deleteTeamData } from '../../_lib/account-delete';

const SECRET = 'test-secret';
const AUD = 'com.emrah.photoZseo';
const APPLE_SUB = '001234.abcdef0123456789abcdef.0123';

let rsa: CryptoKeyPair;
let jwk: AppleJwk;
let ecPem: string;
let ecPublic: CryptoKey;

beforeAll(async () => {
  rsa = (await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify'],
  )) as CryptoKeyPair;
  const pub = (await crypto.subtle.exportKey('jwk', rsa.publicKey)) as JsonWebKey;
  jwk = { kty: 'RSA', kid: 'test-kid', n: pub.n!, e: pub.e! };

  const ec = (await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])) as CryptoKeyPair;
  ecPublic = ec.publicKey;
  const pkcs8 = new Uint8Array((await crypto.subtle.exportKey('pkcs8', ec.privateKey)) as ArrayBuffer);
  ecPem = `-----BEGIN PRIVATE KEY-----\n${btoa(String.fromCharCode(...pkcs8))}\n-----END PRIVATE KEY-----`;
});

function enc(obj: unknown): string {
  return bytesToB64url(new TextEncoder().encode(JSON.stringify(obj)));
}

async function appleToken(claims: Record<string, unknown>, kid = 'test-kid'): Promise<string> {
  const h = enc({ alg: 'RS256', kid });
  const p = enc(claims);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', rsa.privateKey, new TextEncoder().encode(`${h}.${p}`));
  return `${h}.${p}.${bytesToB64url(new Uint8Array(sig))}`;
}

async function validClaims(rawNonce: string, extra: Record<string, unknown> = {}) {
  const now = Math.floor(Date.now() / 1000);
  return {
    iss: 'https://appleid.apple.com', aud: AUD, iat: now, exp: now + 600,
    sub: APPLE_SUB, nonce: await sha256Hex(rawNonce), email: 'abc@privaterelay.appleid.com', ...extra,
  };
}

function makeKV() {
  const store = new Map<string, string>();
  return {
    store,
    async get(k: string) { return store.get(k) ?? null; },
    async put(k: string, v: string) { store.set(k, v); },
    async delete(k: string) { store.delete(k); },
    async list() { return { keys: [], list_complete: true }; },
  };
}

function post(body: unknown): Request {
  return new Request('https://x/api/auth/apple', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const fetchJwks = async () => [jwk];

function cookieFrom(res: Response): string {
  const m = (res.headers.get('set-cookie') ?? '').match(/pz_session=([^;]+)/);
  return m ? m[1] : '';
}

describe('appleOwnerSub', () => {
  it('nokta içermeyen, apple_ önekli, ownerKey-uyumlu kimlik üretir', () => {
    const s = appleOwnerSub(APPLE_SUB);
    expect(s).toBe('apple_001234-abcdef0123456789abcdef-0123');
    expect(/^[A-Za-z0-9_-]{1,128}$/.test(s)).toBe(true);
  });
});

describe('POST /api/auth/apple', () => {
  it('write key yoksa 503', async () => {
    const res = await onRequestPost({ request: post({}), env: {}, fetchJwks });
    expect(res.status).toBe(503);
  });

  it('eksik alan → 400', async () => {
    const res = await onRequestPost({ request: post({ identityToken: 'x' }), env: { STORE_WRITE_KEY: SECRET }, fetchJwks });
    expect(res.status).toBe(400);
  });

  it('geçerli token → 200 + apple_ önekli oturum', async () => {
    const kv = makeKV();
    const token = await appleToken(await validClaims('n-1'));
    const res = await onRequestPost({
      request: post({ identityToken: token, nonce: 'n-1', name: 'Ada Lovelace' }),
      env: { STORE_WRITE_KEY: SECRET, STORE_KV: kv }, fetchJwks,
    });
    expect(res.status).toBe(200);
    const session = await verifySession(cookieFrom(res), SECRET, Math.floor(Date.now() / 1000));
    expect(session?.sub).toBe(appleOwnerSub(APPLE_SUB));
    expect(session?.email).toBe('abc@privaterelay.appleid.com');
    expect(session?.name).toBe('Ada Lovelace');
  });

  it('ad yalnız ilk girişte gelir → sonraki girişte KV profilinden okunur', async () => {
    const kv = makeKV();
    const env = { STORE_WRITE_KEY: SECRET, STORE_KV: kv };
    await onRequestPost({ request: post({ identityToken: await appleToken(await validClaims('a')), nonce: 'a', name: 'Ada' }), env, fetchJwks });
    const res = await onRequestPost({ request: post({ identityToken: await appleToken(await validClaims('b')), nonce: 'b' }), env, fetchJwks });
    const session = await verifySession(cookieFrom(res), SECRET, Math.floor(Date.now() / 1000));
    expect(session?.name).toBe('Ada');
  });

  it('nonce eşleşmezse 401', async () => {
    const token = await appleToken(await validClaims('gercek'));
    const res = await onRequestPost({ request: post({ identityToken: token, nonce: 'baska' }), env: { STORE_WRITE_KEY: SECRET }, fetchJwks });
    expect(res.status).toBe(401);
  });

  it('aynı nonce ikinci kez → 401 (replay)', async () => {
    const kv = makeKV();
    const env = { STORE_WRITE_KEY: SECRET, STORE_KV: kv };
    const body = { identityToken: await appleToken(await validClaims('r')), nonce: 'r' };
    expect((await onRequestPost({ request: post(body), env, fetchJwks })).status).toBe(200);
    expect((await onRequestPost({ request: post(body), env, fetchJwks })).status).toBe(401);
  });

  it('yanlış aud / iss / süresi geçmiş / bilinmeyen kid → 401', async () => {
    const env = { STORE_WRITE_KEY: SECRET };
    const bad = [
      await appleToken(await validClaims('x', { aud: 'com.baska.app' })),
      await appleToken(await validClaims('x', { iss: 'https://evil.example' })),
      await appleToken(await validClaims('x', { exp: 1000 })),
      await appleToken(await validClaims('x'), 'baska-kid'),
    ];
    for (const t of bad) {
      expect((await onRequestPost({ request: post({ identityToken: t, nonce: 'x' }), env, fetchJwks })).status).toBe(401);
    }
  });

  it('imzası bozulmuş token → 401', async () => {
    const t = await appleToken(await validClaims('s'));
    const [h, , sig] = t.split('.');
    const forged = `${h}.${enc(await validClaims('s', { sub: 'saldirgan' }))}.${sig}`;
    const res = await onRequestPost({ request: post({ identityToken: forged, nonce: 's' }), env: { STORE_WRITE_KEY: SECRET }, fetchJwks });
    expect(res.status).toBe(401);
  });

  it('authorizationCode varsa refresh token şifreli saklanır', async () => {
    const kv = makeKV();
    const fetchImpl = (async () => new Response(JSON.stringify({ refresh_token: 'rt-123' }), { status: 200 })) as unknown as typeof fetch;
    const env = { STORE_WRITE_KEY: SECRET, STORE_KV: kv, APPLE_TEAM_ID: 'T', APPLE_KEY_ID: 'K', APPLE_PRIVATE_KEY: ecPem };
    await onRequestPost({
      request: post({ identityToken: await appleToken(await validClaims('c')), nonce: 'c', authorizationCode: 'code' }),
      env, fetchJwks, fetchImpl,
    });
    const sealed = kv.store.get(appleKv.refreshToken(appleOwnerSub(APPLE_SUB)))!;
    expect(sealed).toBeTruthy();
    expect(sealed).not.toContain('rt-123');
    expect(await openToken(sealed, SECRET)).toBe('rt-123');
  });
});

describe('makeClientSecret', () => {
  it('Apple REST için geçerli ES256 JWT üretir', async () => {
    const jwt = await makeClientSecret({ APPLE_TEAM_ID: 'TEAM', APPLE_KEY_ID: 'KEY', APPLE_PRIVATE_KEY: ecPem }, 1000);
    const [h, p, s] = jwt.split('.');
    expect(JSON.parse(new TextDecoder().decode(b64urlToBytes(h)))).toEqual({ alg: 'ES256', kid: 'KEY' });
    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(p)));
    expect(payload).toMatchObject({ iss: 'TEAM', aud: 'https://appleid.apple.com', sub: AUD, iat: 1000, exp: 1300 });
    const ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, ecPublic, b64urlToBytes(s), new TextEncoder().encode(`${h}.${p}`));
    expect(ok).toBe(true);
  });
});

describe('sealToken / openToken', () => {
  it('yanlış secret ile açılamaz', async () => {
    const sealed = await sealToken('gizli', SECRET);
    expect(await openToken(sealed, SECRET)).toBe('gizli');
    expect(await openToken(sealed, 'baska')).toBeNull();
  });
});

describe('POST /api/account/delete — Apple', () => {
  it('Apple kullanıcısı silinince refresh token Apple’da iptal edilir ve KV temizlenir', async () => {
    const kv = makeKV();
    const sub = appleOwnerSub(APPLE_SUB);
    kv.store.set(appleKv.refreshToken(sub), await sealToken('rt-xyz', SECRET));
    kv.store.set(appleKv.profile(sub), JSON.stringify({ name: 'Ada' }));

    const calls: string[] = [];
    const fetchImpl = (async (url: string, init: RequestInit) => {
      calls.push(`${url} ${String(init.body)}`);
      return new Response('', { status: 200 });
    }) as unknown as typeof fetch;

    // Apple oturumu ile giriş
    const login = await onRequestPost({
      request: post({ identityToken: await appleToken(await validClaims('d')), nonce: 'd' }),
      env: { STORE_WRITE_KEY: SECRET, STORE_KV: kv }, fetchJwks,
    });
    const req = new Request('https://x/api/account/delete', { method: 'POST', headers: { cookie: `pz_session=${cookieFrom(login)}` } });
    const res = await deleteAccount({
      request: req,
      env: { STORE_WRITE_KEY: SECRET, STORE_KV: kv, APPLE_TEAM_ID: 'T', APPLE_KEY_ID: 'K', APPLE_PRIVATE_KEY: ecPem },
      fetchImpl,
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { appleRevoked?: boolean };
    expect(body.appleRevoked).toBe(true);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain('https://appleid.apple.com/auth/revoke');
    expect(calls[0]).toContain('token=rt-xyz');
    expect(kv.store.has(appleKv.refreshToken(sub))).toBe(false);
    expect(kv.store.has(appleKv.profile(sub))).toBe(false);
  });
});

describe('deleteTeamData', () => {
  const now = '2026-10-05T00:00:00Z';
  const summary = () => ({
    stores: 0, products: 0, favorites: 0, cartItems: 0, orders: 0, b2bBuyers: 0, b2bTransactions: 0,
    consentsAnonymized: 0, companiesDeleted: 0, companiesTransferred: 0, membershipsRemoved: 0,
  });

  it('tek sahipli şirket tamamen silinir', async () => {
    const { db, tables } = makeFakeD1();
    await createCompany(db, { companyId: 'c:1', name: 'A', ownerSub: 'u1', email: 'o@x.com', ownerName: 'O', now });
    tables.team_activity_log.push({ id: 'al:1', company_id: 'c:1', actor_sub: 'u1', actor_email: 'o@x.com', created_at: now });
    const s = summary();
    await deleteTeamData(db, 'u1', s);
    expect(s.companiesDeleted).toBe(1);
    expect(await getCompany(db, 'c:1')).toBeNull();
    expect(tables.team_activity_log).toHaveLength(0);
  });

  it('başka üye varsa sahiplik en eski admin’e devredilir, üyelik silinir', async () => {
    const { db, tables } = makeFakeD1();
    await createCompany(db, { companyId: 'c:1', name: 'A', ownerSub: 'u1', email: 'o@x.com', ownerName: 'O', now });
    await upsertMembership(db, { companyId: 'c:1', userSub: 'emp', email: 'e@x.com', name: 'E', role: 'employee', now: '2026-01-01T00:00:00Z' });
    await upsertMembership(db, { companyId: 'c:1', userSub: 'adm', email: 'a@x.com', name: 'A', role: 'admin', now: '2026-02-01T00:00:00Z' });
    tables.team_activity_log.push({ id: 'al:1', company_id: 'c:1', actor_sub: 'u1', actor_email: 'o@x.com', created_at: now });
    const s = summary();
    await deleteTeamData(db, 'u1', s);
    expect(s.companiesTransferred).toBe(1);
    expect(s.membershipsRemoved).toBe(1);
    expect(await getMembership(db, 'c:1', 'u1')).toBeNull();
    expect((await getMembership(db, 'c:1', 'adm'))?.role).toBe('owner');
    expect((await getCompany(db, 'c:1'))?.owner_sub).toBe('adm');
    expect(tables.team_activity_log[0].actor_email).toBe('');
  });

  it('çalışan üyeliği silinir, şirket kalır', async () => {
    const { db } = makeFakeD1();
    await createCompany(db, { companyId: 'c:1', name: 'A', ownerSub: 'u1', email: 'o@x.com', ownerName: 'O', now });
    await upsertMembership(db, { companyId: 'c:1', userSub: 'emp', email: 'e@x.com', name: 'E', role: 'employee', now });
    const s = summary();
    await deleteTeamData(db, 'emp', s);
    expect(s.membershipsRemoved).toBe(1);
    expect(await getMembership(db, 'c:1', 'emp')).toBeNull();
    expect(await getCompany(db, 'c:1')).not.toBeNull();
  });
});
