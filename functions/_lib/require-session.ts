/**
 * require-session.ts — Faz-2 oturum geçidi (Google girişi zorunlu).
 *
 * Tüm write/read-protected endpoint'ler `pz_session` cookie'si gerektirir.
 * Legacy key/HMAC yolu (Faz A/B) kaldırıldı.
 *
 *   1. requireSession           — pz_session cookie'sini verifySession ile doğrular.
 *   2. requireWriteAuthOrSession — geriye uyumluluk için korunan isim;
 *                                  artık sadece session kontrol eder.
 */
import { verifySession, parseCookies } from './session';
import { SESSION_COOKIE } from '../../src/storefront/auth/config';

/** Oturum sahibinin kimliği — Google `sub` zorunlu, `email` opsiyonel. */
export interface SessionPayload {
  sub: string;
  email?: string;
}

export interface SessionEnv {
  STORE_WRITE_KEY?: string;
}

function json(obj: unknown, status: number): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/**
 * pz_session cookie'sini doğrular.
 * Geçerliyse SessionPayload, geçersiz/yok/secret-eksik ise 401 Response döner.
 *
 * @param nowSec Test edilebilirlik için dışarıdan verilen unix saniye.
 */
export async function requireSession(
  request: Request,
  env: SessionEnv,
  nowSec: number,
): Promise<SessionPayload | Response> {
  const secret = env.STORE_WRITE_KEY;
  if (!secret) return json({ error: 'Unauthorized' }, 401);

  const cookies = parseCookies(request.headers.get('cookie'));
  const token = cookies[SESSION_COOKIE];
  if (!token) return json({ error: 'Unauthorized' }, 401);

  const payload = await verifySession(token, secret, nowSec);
  if (!payload) return json({ error: 'Unauthorized' }, 401);

  return { sub: payload.sub, email: payload.email };
}

/**
 * Session gate (Faz-2): pz_session cookie zorunlu. Legacy key/HMAC yolu kaldırıldı.
 *
 * `bodyText` parametresi geriye uyumluluk için korundu (çağrı tarafları değişmez);
 * artık kullanılmıyor.
 *
 * @param nowSec Test edilebilirlik için dışarıdan verilen unix saniye.
 */
export async function requireWriteAuthOrSession(
  request: Request,
  env: SessionEnv,
  nowSec: number,
  bodyText: string = '',
): Promise<{ kind: 'session'; session: SessionPayload } | Response> {
  const sessionResult = await requireSession(request, env, nowSec);
  if (!(sessionResult instanceof Response)) {
    return { kind: 'session', session: sessionResult };
  }
  return sessionResult;
}
