/**
 * POST /api/auth/google — Google ID token doğrulama + imzalı oturum cookie ayarla.
 *
 * Gövde: JSON { credential: "<google-id-token-jwt>" }
 *        veya form alanı `credential`
 *
 * Başarılı: 200 { ok:true, email, name } + Set-Cookie: pz_session=...
 * Hata:     400 (credential yok) | 401 (geçersiz token/claim) | 503 (write key yok)
 */
import { signSession } from '../../_lib/session';
import { GOOGLE_CLIENT_ID, SESSION_COOKIE, SESSION_TTL_DAYS } from '../../../src/storefront/auth/config';
import { migrateOwner, ownerKeyFromDevice, ownerKeyFromBuyer, type D1Like } from '../../_lib/buyer';

interface Env {
  STORE_WRITE_KEY?: string;
  MARKET_DB?: D1Like;
}
type Ctx = { request: Request; env: Env };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const writeKey = ctx.env.STORE_WRITE_KEY;
  if (!writeKey) return json({ error: 'Auth service not configured' }, 503);

  // credential okuma: JSON veya form-data
  let credential: string | null = null;
  const ct = ctx.request.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    const body = await ctx.request.json().catch(() => null) as { credential?: string } | null;
    credential = body?.credential ?? null;
  } else {
    const form = await ctx.request.formData().catch(() => null);
    credential = form?.get('credential')?.toString() ?? null;
  }

  if (!credential) return json({ error: 'credential required' }, 400);

  // Google tokeninfo uç noktasına doğrulama isteği
  const res = await fetch(
    'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(credential),
  );
  if (!res.ok) return json({ error: 'Invalid Google token' }, 401);

  const claims = await res.json() as Record<string, string>;

  // Kitleye (aud) göre doğrulama
  if (claims.aud !== GOOGLE_CLIENT_ID) return json({ error: 'Token aud mismatch' }, 401);

  // Yayıncı (iss) doğrulaması
  const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
  if (!validIssuers.includes(claims.iss)) return json({ error: 'Token iss invalid' }, 401);

  // Süre (exp) kontrolü — claims.exp string saniye
  const tokenExp = parseInt(claims.exp, 10);
  const nowSec = Math.floor(Date.now() / 1000);
  if (isNaN(tokenExp) || tokenExp < nowSec) return json({ error: 'Token expired' }, 401);

  // email_verified kontrolü
  if (claims.email_verified !== true && claims.email_verified !== 'true') {
    return json({ error: 'Email not verified' }, 401);
  }

  // Oturum payload'ı oluştur
  const sessionTtl = SESSION_TTL_DAYS * 86400;
  const payload = {
    sub: claims.sub,
    email: claims.email,
    name: claims.name,
    picture: claims.picture, // Google profil fotoğrafı
    exp: nowSec + sessionTtl,
  };

  const signed = await signSession(payload, writeKey);

  // Anonim cihaz favori/sepetini hesaba taşı (best-effort; giriş asla bloklanmaz).
  // Cihaz kimliği auth.js'in gönderdiği x-device-id header'ından gelir.
  if (ctx.env.MARKET_DB) {
    const deviceKey = ownerKeyFromDevice(ctx.request.headers.get('x-device-id') ?? '');
    const buyerKey = ownerKeyFromBuyer(claims.sub);
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

  return new Response(JSON.stringify({ ok: true, email: claims.email, name: claims.name }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'set-cookie': cookieValue,
    },
  });
}
