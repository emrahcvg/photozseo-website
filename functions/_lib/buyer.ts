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

/** Giriş yapmış alıcı için owner_key. */
export function ownerKeyFromBuyer(buyerId: string): string | null {
  if (!buyerId || !/^[A-Za-z0-9_-]{1,128}$/.test(buyerId)) return null;
  return 'b:' + buyerId;
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

export interface CartItem {
  productSlug: string;
  qty: number;
}

/** Sahibin bir mağazadaki sepet kalemlerini döner. */
export async function getCart(db: D1Like, ownerKey: string, storeSlug: string): Promise<CartItem[]> {
  const { results } = await db
    .prepare('SELECT product_slug, qty FROM cart_items WHERE owner_key = ? AND store_slug = ?')
    .bind(ownerKey, storeSlug)
    .all<{ product_slug: string; qty: number }>();
  return results.map((r) => ({ productSlug: r.product_slug, qty: r.qty }));
}

/** Sepet kalemini ayarlar; qty<=0 ise kalemi siler, aksi halde upsert eder. */
export async function setCartItem(
  db: D1Like, ownerKey: string, storeSlug: string, productSlug: string, qty: number, now: string,
): Promise<void> {
  if (qty <= 0) {
    await db
      .prepare('DELETE FROM cart_items WHERE owner_key = ? AND store_slug = ? AND product_slug = ?')
      .bind(ownerKey, storeSlug, productSlug)
      .run();
    return;
  }
  await db
    .prepare('INSERT OR REPLACE INTO cart_items (owner_key, store_slug, product_slug, qty, updated_at) VALUES (?, ?, ?, ?, ?)')
    .bind(ownerKey, storeSlug, productSlug, qty, now)
    .run();
}

/** Sahibin bir mağazadaki tüm sepetini temizler. */
export async function clearCart(db: D1Like, ownerKey: string, storeSlug: string): Promise<void> {
  await db
    .prepare('DELETE FROM cart_items WHERE owner_key = ? AND store_slug = ?')
    .bind(ownerKey, storeSlug)
    .run();
}
