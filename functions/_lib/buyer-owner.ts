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

/** Cihaz kimliği çerezi — tarayıcı localStorage 'sf-device-id' değerinin aynası (storefront-buyer.js / cart-badge.js yazar). */
export const DEVICE_COOKIE = 'pz_device';

/**
 * SALT-OKUMA sayfa render'ı için sahip çözümleme (sepet/favori/sipariş SSR).
 * Tarayıcı sayfa gezintisinde özel header gönderemediği için `x-device-id` yoksa
 * `pz_device` çerezine düşer. Durum değiştiren uçlar bunu KULLANMAMALI: orada
 * özel header zorunluluğu CSRF koruması işlevi görür.
 */
export async function resolvePageOwnerKey(
  request: Request,
  secret: string | undefined,
  nowSec: number,
): Promise<string | null> {
  const owner = await resolveOwnerKey(request, secret, nowSec);
  if (owner) return owner;
  const cookieDevice = parseCookies(request.headers.get('cookie'))[DEVICE_COOKIE] ?? '';
  return ownerKeyFromDevice(cookieDevice);
}
