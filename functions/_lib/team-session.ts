/**
 * team-session.ts — api/team/* endpoint'leri için ortak oturum köprüsü.
 * pz_session cookie'sini doğrular, üye kimliğini (sub/email/name) döner.
 */
import { verifySession, parseCookies, type SessionPayload } from './session';
import { SESSION_COOKIE } from '../../src/storefront/auth/config';

export interface TeamEnv {
  STORE_WRITE_KEY?: string;
}

/**
 * Geçerli oturum varsa payload döner; yoksa null.
 * @param nowSec Test edilebilirlik için dışarıdan verilen unix saniye.
 */
export async function resolveMember(
  request: Request,
  env: TeamEnv,
  nowSec: number,
): Promise<SessionPayload | null> {
  const secret = env.STORE_WRITE_KEY;
  if (!secret) return null;
  const cookies = parseCookies(request.headers.get('cookie'));
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;
  return verifySession(token, secret, nowSec);
}
