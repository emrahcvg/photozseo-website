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

// ── Market seviyesi: çapraz-mağaza favori/sepet (mağazaya göre gruplu) ─────────

/** Ürün indeksinden zenginleştirilmiş favori/sepet kalemi. */
export interface BuyerItem {
  storeSlug: string;
  productSlug: string;
  title: string | null;
  price: number | null;
  currency: string | null;
  stock: number | null;
  imageUrl: string | null;
  productPath: string | null;
  qty?: number; // yalnız sepet kalemlerinde
}

/** Tek mağazaya ait kalem grubu. */
export interface BuyerStoreGroup {
  storeSlug: string;
  storeName: string;
  items: BuyerItem[];
}

interface FlatBuyerRow {
  store_slug: string;
  product_slug: string;
  store_name: string | null;
  title: string | null;
  price: number | null;
  currency: string | null;
  stock: number | null;
  image_url: string | null;
  product_path: string | null;
  qty?: number;
}

/** Düz JOIN satırlarını mağaza-ilk-görüldü sırasını koruyarak gruplar. */
function groupByStore(rows: FlatBuyerRow[]): BuyerStoreGroup[] {
  const order: string[] = [];
  const byStore = new Map<string, BuyerStoreGroup>();
  for (const r of rows) {
    let g = byStore.get(r.store_slug);
    if (!g) {
      g = {
        storeSlug: r.store_slug,
        storeName: r.store_name ?? r.store_slug.replace(/-/g, ' '),
        items: [],
      };
      byStore.set(r.store_slug, g);
      order.push(r.store_slug);
    }
    g.items.push({
      storeSlug: r.store_slug,
      productSlug: r.product_slug,
      title: r.title ?? null,
      price: r.price ?? null,
      currency: r.currency ?? null,
      stock: r.stock ?? null,
      imageUrl: r.image_url ?? null,
      productPath: r.product_path ?? null,
      ...(typeof r.qty === 'number' ? { qty: r.qty } : {}),
    });
  }
  return order.map((slug) => byStore.get(slug)!);
}

const FAV_SELECT =
  'SELECT f.store_slug AS store_slug, f.product_slug AS product_slug, ' +
  'p.title AS title, p.price AS price, p.currency AS currency, p.stock AS stock, ' +
  "p.image_url AS image_url, p.product_path AS product_path, s.name AS store_name " +
  'FROM favorites f ' +
  "LEFT JOIN products p ON p.id = f.store_slug || ':' || f.product_slug " +
  'LEFT JOIN stores s ON s.slug = f.store_slug ' +
  'WHERE f.owner_key = ? ORDER BY f.store_slug ASC, f.created_at DESC';

/** Sahibin tüm mağazalardaki favorilerini, ürün verisiyle zenginleştirip mağazaya göre gruplar. */
export async function listAllFavorites(db: D1Like, ownerKey: string): Promise<BuyerStoreGroup[]> {
  const { results } = await db.prepare(FAV_SELECT).bind(ownerKey).all<FlatBuyerRow>();
  return groupByStore(results);
}

const CART_SELECT =
  'SELECT c.store_slug AS store_slug, c.product_slug AS product_slug, c.qty AS qty, ' +
  'p.title AS title, p.price AS price, p.currency AS currency, p.stock AS stock, ' +
  "p.image_url AS image_url, p.product_path AS product_path, s.name AS store_name " +
  'FROM cart_items c ' +
  "LEFT JOIN products p ON p.id = c.store_slug || ':' || c.product_slug " +
  'LEFT JOIN stores s ON s.slug = c.store_slug ' +
  'WHERE c.owner_key = ? ORDER BY c.store_slug ASC, c.updated_at DESC';

/** Sahibin tüm mağazalardaki sepetini, ürün verisiyle zenginleştirip mağazaya göre gruplar. */
export async function listAllCart(db: D1Like, ownerKey: string): Promise<BuyerStoreGroup[]> {
  const { results } = await db.prepare(CART_SELECT).bind(ownerKey).all<FlatBuyerRow>();
  return groupByStore(results);
}

// ── Sahip taşıma: anonim cihaz (d:<uuid>) → giriş yapan alıcı (b:<sub>) ────────

/**
 * `fromKey` sahibinin favori + sepetini `toKey`'e taşır (giriş anında çağrılır).
 * - Favori/sepet kalemleri INSERT OR IGNORE ile kopyalanır: çakışmada **hedef korunur**
 *   (giriş öncesi anonim veri, hesapta zaten varsa ezmez). Sonra kaynak satırlar silinir.
 * - Kaynak satırlar silindiği için tekrar çağrılırsa no-op (idempotent).
 * - Saf veri katmanı; sahip-anahtarı doğrulamasını çağıran yapar.
 */
export async function migrateOwner(db: D1Like, fromKey: string, toKey: string): Promise<void> {
  if (!fromKey || !toKey || fromKey === toKey) return;

  // Favoriler
  const favs = await db
    .prepare('SELECT store_slug, product_slug, created_at FROM favorites WHERE owner_key = ?')
    .bind(fromKey)
    .all<{ store_slug: string; product_slug: string; created_at: string }>();
  for (const f of favs.results) {
    await addFavorite(db, toKey, f.store_slug, f.product_slug, f.created_at);
  }
  await db.prepare('DELETE FROM favorites WHERE owner_key = ?').bind(fromKey).run();

  // Sepet — INSERT OR IGNORE (çakışmada hedefteki adet korunur)
  const cart = await db
    .prepare('SELECT store_slug, product_slug, qty, updated_at FROM cart_items WHERE owner_key = ?')
    .bind(fromKey)
    .all<{ store_slug: string; product_slug: string; qty: number; updated_at: string }>();
  for (const c of cart.results) {
    await db
      .prepare('INSERT OR IGNORE INTO cart_items (owner_key, store_slug, product_slug, qty, updated_at) VALUES (?, ?, ?, ?, ?)')
      .bind(toKey, c.store_slug, c.product_slug, c.qty, c.updated_at)
      .run();
  }
  await db.prepare('DELETE FROM cart_items WHERE owner_key = ?').bind(fromKey).run();
}
