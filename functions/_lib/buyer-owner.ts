/**
 * buyer-owner.ts — Sahip çözümleme: önce Google oturumu (b:<sub>), yoksa cihaz UUID (d:<uuid>).
 * Saf yardımcı; request + ortam değişkenleri alır, D1 bağlamı gerektirmez.
 */
import { parseCookies, verifySession } from './session';
import { SESSION_COOKIE } from '../../src/storefront/auth/config';
import { ownerKeyFromBuyer, ownerKeyFromDevice } from './buyer';

/**
 * İstek için sahip anahtarını çözümler.
 * 1) Geçerli `pz_session` cookie'si varsa → `b:<sub>` (Google girişi)
 * 2) Yoksa `x-device-id` header'ından → `d:<uuid>` (anonim cihaz)
 * 3) İkisi de geçersizse → null
 */
export async function resolveOwnerKey(
  request: Request,
  secret: string | undefined,
  nowSec: number,
): Promise<string | null> {
  // 1) Giriş yapmış kullanıcı?
  if (secret) {
    const cookies = parseCookies(request.headers.get('cookie'));
    const token = cookies[SESSION_COOKIE];
    if (token) {
      const sess = await verifySession(token, secret, nowSec);
      if (sess?.sub) return ownerKeyFromBuyer(sess.sub);
    }
  }
  // 2) Anonim cihaz
  return ownerKeyFromDevice(request.headers.get('x-device-id') ?? '');
}
