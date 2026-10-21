/**
 * POST /api/auth/apple — Sign in with Apple identity token doğrulama + imzalı oturum cookie.
 * (App Store Guideline 4.8 — Google girişine eşdeğer, gizlilik odaklı alternatif.)
 *
 * Gövde: JSON {
 *   identityToken: "<apple-jwt>",
 *   nonce: "<ham nonce>",              // istemci Apple'a sha256(nonce) gönderdi
 *   authorizationCode?: "<kod>",        // refresh token için (hesap silmede iptal edilir)
 *   name?: "<ad soyad>"                 // Apple adı YALNIZ ilk girişte verir
 * }
 *
 * Kimlik: sub = "apple_<apple sub>" (bkz. appleOwnerSub) — Google kullanıcılarıyla çakışmaz.
 *
 * Başarılı: 200 { ok:true, email, name } + Set-Cookie: pz_session=...
 * Hata:     400 (eksik alan) | 401 (geçersiz token / nonce tekrar) | 503 (write key yok)
 */
import { signSession } from '../../_lib/session';
import { SESSION_COOKIE, SESSION_TTL_DAYS } from '../../../src/storefront/auth/config';
import { migrateOwner, ownerKeyFromDevice, ownerKeyFromBuyer, type D1Like } from '../../_lib/buyer';
import {
  verifyAppleIdentityToken,
  appleOwnerSub,
  appleClientId,
  hasAppleKey,
  exchangeAuthorizationCode,
  sealToken,
  sha256Hex,
  appleKv,
  type AppleEnv,
  type JwksFetcher,
} from '../../_lib/apple-auth';

interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

interface Env extends AppleEnv {
  STORE_WRITE_KEY?: string;
  STORE_KV?: KV;
  MARKET_DB?: D1Like;
}
type Ctx = { request: Request; env: Env; fetchJwks?: JwksFetcher; fetchImpl?: typeof fetch };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const writeKey = ctx.env.STORE_WRITE_KEY;
  if (!writeKey) return json({ error: 'Auth service not configured' }, 503);

  const body = (await ctx.request.json().catch(() => null)) as {
    identityToken?: string;
    nonce?: string;
    authorizationCode?: string;
    name?: string;
  } | null;
  const identityToken = body?.identityToken;
  const rawNonce = body?.nonce;
  if (!identityToken || !rawNonce) return json({ error: 'identityToken and nonce required' }, 400);

  const nowSec = Math.floor(Date.now() / 1000);
  const claims = await verifyAppleIdentityToken(identityToken, {
    audience: appleClientId(ctx.env),
    rawNonce,
    nowSec,
    fetchJwks: ctx.fetchJwks,
  });
  if (!claims) return json({ error: 'Invalid Apple token' }, 401);

  const kv = ctx.env.STORE_KV;

  // Replay koruması: aynı nonce ikinci kez kabul edilmez (token ömrü ~10 dk).
  if (kv) {
    const nonceKey = appleKv.nonce(await sha256Hex(rawNonce));
    if (await kv.get(nonceKey)) return json({ error: 'Nonce already used' }, 401);
    await kv.put(nonceKey, '1', { expirationTtl: 900 });
  }

  const sub = appleOwnerSub(claims.sub);

  // Apple adı yalnız ilk girişte gönderir → KV profilinde sakla, sonraki girişlerde oradan oku.
  let name = body?.name?.trim().slice(0, 120) || undefined;
  let email = claims.email;
  if (kv) {
    const stored = await kv.get(appleKv.profile(sub));
    const prev = stored ? (JSON.parse(stored) as { name?: string; email?: string }) : {};
    name = name ?? prev.name;
    email = email ?? prev.email;
    if (name !== prev.name || email !== prev.email) {
      await kv.put(appleKv.profile(sub), JSON.stringify({ name, email }));
    }
  }

  // Refresh token (hesap silmede Apple'da iptal edilecek). Best-effort: giriş bloklanmaz.
  if (kv && body?.authorizationCode && hasAppleKey(ctx.env)) {
    try {
      const rt = await exchangeAuthorizationCode(ctx.env, body.authorizationCode, nowSec, ctx.fetchImpl);
      if (rt) await kv.put(appleKv.refreshToken(sub), await sealToken(rt, writeKey));
    } catch (e) {
      console.error('apple code exchange failed (non-fatal):', e);
    }
  }

  const sessionTtl = SESSION_TTL_DAYS * 86400;
  const signed = await signSession(
    { sub, email: email ?? '', name, exp: nowSec + sessionTtl },
    writeKey,
  );

  // Anonim cihaz favori/sepetini hesaba taşı (Google akışıyla aynı; best-effort).
  if (ctx.env.MARKET_DB) {
    const deviceKey = ownerKeyFromDevice(ctx.request.headers.get('x-device-id') ?? '');
    const buyerKey = ownerKeyFromBuyer(sub);
    if (deviceKey && buyerKey) {
      try {
        await migrateOwner(ctx.env.MARKET_DB, deviceKey, buyerKey);
      } catch (e) {
        console.error('owner migrate failed (non-fatal):', e);
      }
    }
  }

  const cookieValue =
    `${SESSION_COOKIE}=${signed}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${sessionTtl}`;

  return new Response(JSON.stringify({ ok: true, email: email ?? null, name: name ?? null }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'set-cookie': cookieValue },
  });
}
