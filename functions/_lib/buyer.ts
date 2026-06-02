/**
 * buyer.ts — Alıcı (anonim) durumu için saf veri-erişim katmanı (P1).
 *
 * Sorumluluk: favori + sepet CRUD'u D1 üstünde; owner_key normalleştirme + girdi doğrulama.
 * owner_key: anonimde "d:<uuid>", ileride giriş gelince "b:<buyerId>".
 * Render/manifest katmanından bağımsızdır.
 */

export interface D1Like {
  prepare(sql: string): {
    bind(...args: unknown[]): {
      first<T = unknown>(col?: string): Promise<T | null>;
      all<T = unknown>(): Promise<{ results: T[] }>;
      run(): Promise<{ success: boolean }>;
    };
  };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z0-9-]+$/i;

/** Geçerli cihaz UUID'sinden "d:<uuid>" anahtarı üretir; geçersizse null. */
export function ownerKeyFromDevice(deviceId: string): string | null {
  if (!deviceId || !UUID_RE.test(deviceId)) return null;
  return 'd:' + deviceId.toLowerCase();
}

/** slug/product_slug için makul format kontrolü (path traversal + aşırı uzunluk engeli). */
export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length > 120) return false;
  return SLUG_RE.test(slug);
}
