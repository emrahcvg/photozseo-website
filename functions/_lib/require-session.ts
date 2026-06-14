/**
 * require-session.ts — B2 Faz B oturum geçidi (Seçenek A: Google girişi zorunlu).
 *
 * `team-session.ts:resolveMember` desenini genelleştirir ve Faz A'nın
 * `requireWriteAuth` (key/HMAC) geçidiyle GERİYE UYUMLU bir OR-gate kurar:
 *
 *   1. requireSession           — pz_session cookie'sini verifySession ile doğrular.
 *   2. requireWriteAuthOrSession — ÖNCE session, yoksa LEGACY key/HMAC dener (OR).
 *
 * Faz-1'de anonim/legacy yol AÇIK kalır; hiçbir şey 401'e zorlanmaz.
 * Faz C'de legacy yol kaldırılınca bu modül tek geçit olarak kalır.
 */
import { verifySession, parseCookies } from './session';
import { SESSION_COOKIE } from '../../src/storefront/auth/config';
import { requireWriteAuth, type WriteAuthEnv } from './auth';

/** Oturum sahibinin kimliği — Google `sub` zorunlu, `email` opsiyonel. */
export interface SessionPayload {
  sub: string;
  email?: string;
}

export interface SessionEnv extends WriteAuthEnv {
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
 * Combined OR-gate (Faz B): authorized when EITHER a valid pz_session cookie
 * exists (preferred, `kind:'session'`) OR the Faz A legacy key/HMAC gate passes
 * (`kind:'legacy'`). Returns a 401 Response only when BOTH fail.
 *
 * Legacy delegation kullanır Faz A'nın `requireWriteAuth` imza/davranışını
 * birebir (bodyText'in SHA-256 hash gereksinimi dahil — imzalı isteğin gövde
 * hash'i bodyText'ten türetilir). Bodyless istekler için bodyText '' olabilir.
 *
 * @param nowSec   Test edilebilirlik için dışarıdan verilen unix saniye.
 * @param bodyText İmzalı (HMAC) layer için gövde metni; varsayılan ''.
 */
export async function requireWriteAuthOrSession(
  request: Request,
  env: SessionEnv,
  nowSec: number,
  bodyText: string = '',
): Promise<{ kind: 'session'; session: SessionPayload } | { kind: 'legacy' } | Response> {
  // 1) Tercih edilen: geçerli oturum cookie'si.
  const sessionResult = await requireSession(request, env, nowSec);
  if (!(sessionResult instanceof Response)) {
    return { kind: 'session', session: sessionResult };
  }

  // 2) Geriye uyumlu yedek: Faz A key/HMAC geçidi (delege).
  const bodyBytes = new TextEncoder().encode(bodyText).buffer as ArrayBuffer;
  const denied = await requireWriteAuth(request, env, bodyBytes, nowSec);
  if (denied === null) {
    return { kind: 'legacy' };
  }

  // 3) İkisi de geçersiz → 401 (legacy geçidinin yanıtını aynen ilet).
  return denied;
}
