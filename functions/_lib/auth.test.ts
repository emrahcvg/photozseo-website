import { describe, it, expect } from 'vitest';
import { requireWriteKey, requireWriteAuth, verifySignedRequest, SIGN_MAX_SKEW_SECONDS } from './auth';
import { requireSession, requireWriteAuthOrSession } from './require-session';
import { signSession } from './session';
import { SESSION_COOKIE } from '../../src/storefront/auth/config';

const SECRET = 'a'.repeat(64);

/** Geçerli pz_session cookie değeri üretir (Faz B oturum testleri için). */
async function makeSessionCookie(nowSec: number, sub = 'google-sub-123'): Promise<string> {
  const token = await signSession(
    { sub, email: 'seller@example.com', exp: nowSec + 3600 },
    SECRET,
  );
  return `${SESSION_COOKIE}=${token}`;
}

// --- test signer (mirrors the iOS client) ---

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sign(method: string, path: string, ts: string, body: string): Promise<string> {
  const enc = new TextEncoder();
  const bodyHash = toHex(await crypto.subtle.digest('SHA-256', enc.encode(body)));
  const canonical = `${method.toUpperCase()}\n${path}\n${ts}\n${bodyHash}`;
  const key = await crypto.subtle.importKey('raw', enc.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(canonical)));
}

function makeReq(opts: { method: string; url: string; headers?: Record<string, string>; body?: string }): Request {
  return new Request(opts.url, { method: opts.method, headers: opts.headers ?? {}, body: opts.body });
}

describe('requireWriteKey (legacy, unchanged)', () => {
  it('503 when secret missing', () => {
    const r = requireWriteKey(makeReq({ method: 'POST', url: 'https://x/a' }), {});
    expect(r?.status).toBe(503);
  });
  it('401 when key absent/wrong', () => {
    const r = requireWriteKey(makeReq({ method: 'POST', url: 'https://x/a', headers: { 'x-store-write-key': 'nope' } }), { STORE_WRITE_KEY: SECRET });
    expect(r?.status).toBe(401);
  });
  it('null (authorized) when key matches', () => {
    const r = requireWriteKey(makeReq({ method: 'POST', url: 'https://x/a', headers: { 'x-store-write-key': SECRET } }), { STORE_WRITE_KEY: SECRET });
    expect(r).toBeNull();
  });
});

describe('requireWriteAuth (OR: signed OR legacy)', () => {
  const now = 1_700_000_000;

  it('503 when secret missing', async () => {
    const r = await requireWriteAuth(makeReq({ method: 'POST', url: 'https://x/a' }), {}, new ArrayBuffer(0), now);
    expect(r?.status).toBe(503);
  });

  it('legacy key still accepted (backward compat)', async () => {
    const r = await requireWriteAuth(
      makeReq({ method: 'POST', url: 'https://x/api/store/claim', headers: { 'x-store-write-key': SECRET } }),
      { STORE_WRITE_KEY: SECRET }, new ArrayBuffer(0), now,
    );
    expect(r).toBeNull();
  });

  it('valid fresh signature accepted WITHOUT legacy header', async () => {
    const body = JSON.stringify({ desiredSlug: 'acme' });
    const ts = String(now);
    const sig = await sign('POST', '/api/store/claim', ts, body);
    const req = makeReq({ method: 'POST', url: 'https://x/api/store/claim', headers: { 'x-pz-ts': ts, 'x-pz-sign': sig }, body });
    const r = await requireWriteAuth(req, { STORE_WRITE_KEY: SECRET }, new TextEncoder().encode(body).buffer as ArrayBuffer, now);
    expect(r).toBeNull();
  });

  it('rejects when neither layer present', async () => {
    const r = await requireWriteAuth(makeReq({ method: 'POST', url: 'https://x/api/store/claim' }), { STORE_WRITE_KEY: SECRET }, new ArrayBuffer(0), now);
    expect(r?.status).toBe(401);
  });

  it('rejects a stale signature (replay window) but legacy still saves it if header present', async () => {
    const body = '';
    const ts = String(now - SIGN_MAX_SKEW_SECONDS - 1);
    const sig = await sign('DELETE', '/api/store/acme', ts, body);
    const stale = makeReq({ method: 'DELETE', url: 'https://x/api/store/acme', headers: { 'x-pz-ts': ts, 'x-pz-sign': sig } });
    expect((await requireWriteAuth(stale, { STORE_WRITE_KEY: SECRET }, new ArrayBuffer(0), now))?.status).toBe(401);
  });
});

describe('verifySignedRequest', () => {
  const now = 1_700_000_000;

  it('rejects tampered body (signature pinned to body hash)', async () => {
    const signedBody = JSON.stringify({ qty: 1 });
    const ts = String(now);
    const sig = await sign('POST', '/api/store/acme/buyers', ts, signedBody);
    const tamperedBody = JSON.stringify({ qty: 999 });
    const req = makeReq({ method: 'POST', url: 'https://x/api/store/acme/buyers', headers: { 'x-pz-ts': ts, 'x-pz-sign': sig }, body: tamperedBody });
    const ok = await verifySignedRequest(req, new TextEncoder().encode(tamperedBody).buffer as ArrayBuffer, SECRET, now);
    expect(ok).toBe(false);
  });

  it('rejects path mismatch (signature pinned to path)', async () => {
    const ts = String(now);
    const sig = await sign('DELETE', '/api/store/victim', ts, '');
    const req = makeReq({ method: 'DELETE', url: 'https://x/api/store/attacker', headers: { 'x-pz-ts': ts, 'x-pz-sign': sig } });
    expect(await verifySignedRequest(req, new ArrayBuffer(0), SECRET, now)).toBe(false);
  });

  it('rejects future-skewed timestamp', async () => {
    const ts = String(now + SIGN_MAX_SKEW_SECONDS + 1);
    const sig = await sign('POST', '/api/store/claim', ts, '');
    const req = makeReq({ method: 'POST', url: 'https://x/api/store/claim', headers: { 'x-pz-ts': ts, 'x-pz-sign': sig } });
    expect(await verifySignedRequest(req, new ArrayBuffer(0), SECRET, now)).toBe(false);
  });
});

describe('requireSession (Faz B pz_session gate)', () => {
  const now = 1_700_000_000;

  it('returns SessionPayload for a valid pz_session cookie', async () => {
    const cookie = await makeSessionCookie(now);
    const req = makeReq({ method: 'POST', url: 'https://x/api/store/claim', headers: { cookie } });
    const r = await requireSession(req, { STORE_WRITE_KEY: SECRET }, now);
    expect(r).not.toBeInstanceOf(Response);
    expect((r as { sub: string; email?: string }).sub).toBe('google-sub-123');
    expect((r as { sub: string; email?: string }).email).toBe('seller@example.com');
  });

  it('401 when no cookie present', async () => {
    const req = makeReq({ method: 'POST', url: 'https://x/api/store/claim' });
    const r = await requireSession(req, { STORE_WRITE_KEY: SECRET }, now);
    expect((r as Response).status).toBe(401);
  });

  it('401 when secret missing', async () => {
    const cookie = await makeSessionCookie(now);
    const req = makeReq({ method: 'POST', url: 'https://x/api/store/claim', headers: { cookie } });
    const r = await requireSession(req, {}, now);
    expect((r as Response).status).toBe(401);
  });
});

describe('requireWriteAuthOrSession (Faz-2: session zorunlu)', () => {
  const now = 1_700_000_000;

  it('valid session accepted → kind:session', async () => {
    const cookie = await makeSessionCookie(now);
    const req = makeReq({ method: 'POST', url: 'https://x/api/store/claim', headers: { cookie } });
    const r = await requireWriteAuthOrSession(req, { STORE_WRITE_KEY: SECRET }, now);
    expect(r).not.toBeInstanceOf(Response);
    expect((r as { kind: string }).kind).toBe('session');
    expect((r as { kind: 'session'; session: { sub: string } }).session.sub).toBe('google-sub-123');
  });

  it('no session + legacy key → 401 (legacy kaldırıldı)', async () => {
    const req = makeReq({ method: 'POST', url: 'https://x/api/store/claim', headers: { 'x-store-write-key': SECRET } });
    const r = await requireWriteAuthOrSession(req, { STORE_WRITE_KEY: SECRET }, now);
    expect((r as Response).status).toBe(401);
  });

  it('no session + valid HMAC signature → 401 (HMAC kaldırıldı)', async () => {
    const body = JSON.stringify({ desiredSlug: 'acme' });
    const ts = String(now);
    const sig = await sign('POST', '/api/store/claim', ts, body);
    const req = makeReq({ method: 'POST', url: 'https://x/api/store/claim', headers: { 'x-pz-ts': ts, 'x-pz-sign': sig }, body });
    const r = await requireWriteAuthOrSession(req, { STORE_WRITE_KEY: SECRET }, now, body);
    expect((r as Response).status).toBe(401);
  });

  it('no session, no key → 401', async () => {
    const req = makeReq({ method: 'POST', url: 'https://x/api/store/claim' });
    const r = await requireWriteAuthOrSession(req, { STORE_WRITE_KEY: SECRET }, now);
    expect((r as Response).status).toBe(401);
  });

  it('valid session + invalid key still accepted (session sole gate) → kind:session', async () => {
    const cookie = await makeSessionCookie(now);
    const req = makeReq({
      method: 'POST',
      url: 'https://x/api/store/claim',
      headers: { cookie, 'x-store-write-key': 'wrong-key' },
    });
    const r = await requireWriteAuthOrSession(req, { STORE_WRITE_KEY: SECRET }, now);
    expect(r).not.toBeInstanceOf(Response);
    expect((r as { kind: string }).kind).toBe('session');
  });
});
