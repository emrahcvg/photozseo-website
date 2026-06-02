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

/** Sahibin bir mağazadaki favori ürün slug'larını döner. */
export async function listFavorites(db: D1Like, ownerKey: string, storeSlug: string): Promise<string[]> {
  const { results } = await db
    .prepare('SELECT product_slug FROM favorites WHERE owner_key = ? AND store_slug = ?')
    .bind(ownerKey, storeSlug)
    .all<{ product_slug: string }>();
  return results.map((r) => r.product_slug);
}

/** Favori ekler (idempotent — varsa yok sayar). */
export async function addFavorite(
  db: D1Like, ownerKey: string, storeSlug: string, productSlug: string, now: string,
): Promise<void> {
  await db
    .prepare('INSERT OR IGNORE INTO favorites (owner_key, store_slug, product_slug, created_at) VALUES (?, ?, ?, ?)')
    .bind(ownerKey, storeSlug, productSlug, now)
    .run();
}

/** Favori siler. */
export async function removeFavorite(
  db: D1Like, ownerKey: string, storeSlug: string, productSlug: string,
): Promise<void> {
  await db
    .prepare('DELETE FROM favorites WHERE owner_key = ? AND store_slug = ? AND product_slug = ?')
    .bind(ownerKey, storeSlug, productSlug)
    .run();
}
