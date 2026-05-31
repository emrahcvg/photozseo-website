/**
 * marketplace.ts — photoZseo Marketplace veri çekirdeği (P1).
 *
 * Sorumluluk:
 *   - StoreRecord (KV manifest) → D1 kanonik satırlar (write-through).
 *   - index_version monoton sayaç (meta tablosu).
 *   - Orama bellek-içi full-text indeks (D1'den tembel kurulur, version damgasıyla cache).
 *   - Faceted arama / yeni ürün listesi / mağaza dizini sorguları.
 *
 * KV manifest render kaynağı kalır; burada D1 kanonik kopya tutulur.
 */

import type { StoreRecord } from './registry';
import type { Manifest } from '../../src/storefront/types';
import { resolveLocalized, uniqueProductSlugs, productUrl, SUPPORTED_LOCALES } from '../../src/storefront/manifest';
import { create, insertMultiple, search, type Orama } from '@orama/orama';
import type { AiBinding } from './translate';

const DEFAULT_LANG = 'en';

// ── Public tipler (P2 buna güvenir) ──────────────────────────────────────────

export interface ProductRow {
  id: string;
  store_slug: string;
  title: string;
  description: string;
  category_id: string;
  tags: string;          // CSV
  price: number | null;
  currency: string;
  stock: number;
  image_url: string;
  product_path: string;
  updated_at: string;
}

export interface StoreRow {
  slug: string;
  name: string;
  city: string;
  country: string;
  iban: string;
  iban_name: string;
  whatsapp: string;
  listed: number;
  lang: string;
  index_version: number | null;
  updated_at: string;
}

export interface Facets {
  categories: Record<string, number>;
  cities: Record<string, number>;
  priceMin: number | null;
  priceMax: number | null;
}

// Orama doc + indeks tipi.
interface OramaDoc {
  id: string;
  title: string;
  description: string;
  tags: string;
}

export interface OramaIndex {
  db: Orama<{ id: 'string'; title: 'string'; description: 'string'; tags: 'string' }>;
  version: number;
}

// ── Manifest → D1 satır eşleme (saf, test edilebilir) ────────────────────────

function canonicalLang(manifest: Manifest): string {
  return manifest.store.languages?.[0] ?? DEFAULT_LANG;
}

export function storeRecordToStoreFields(
  slug: string,
  record: StoreRecord,
  indexVersion: number,
): StoreRow {
  const s = record.manifest.store;
  return {
    slug,
    name: s.displayName ?? '',
    city: s.location?.city ?? '',
    country: s.location?.country ?? '',
    iban: s.payment?.iban ?? '',
    iban_name: s.payment?.ibanName ?? '',
    whatsapp: s.contact?.whatsapp ?? '',
    listed: s.marketplaceListed === true ? 1 : 0,
    lang: canonicalLang(record.manifest),
    index_version: indexVersion,
    updated_at: record.updatedAt ?? new Date().toISOString(),
  };
}

export function storeRecordToProductRows(slug: string, record: StoreRecord): ProductRow[] {
  const manifest = record.manifest;
  const lang = canonicalLang(manifest);
  const slugMap = uniqueProductSlugs(manifest.products, DEFAULT_LANG);
  const updatedAt = record.updatedAt ?? new Date().toISOString();

  return manifest.products.map((p) => {
    const pSlug = slugMap.get(p.id) ?? p.id;
    const stock = typeof p.stockQty === 'number' ? p.stockQty : (p.inStock ? 1 : 0);
    return {
      id: `${slug}:${pSlug}`,
      store_slug: slug,
      title: resolveLocalized(p.title, lang),
      description: resolveLocalized(p.description, lang),
      category_id: p.categoryId ?? '',
      tags: (p.tags ?? []).join(','),
      price: typeof p.price === 'number' ? p.price : null,
      currency: p.currency ?? manifest.store.currency ?? 'USD',
      stock,
      image_url: p.images?.[0] ?? '',
      product_path: productUrl(slug, pSlug, DEFAULT_LANG, DEFAULT_LANG),
      updated_at: updatedAt,
    };
  });
}

// ── index_version sayacı (meta tablosu) ───────────────────────────────────────

export async function getIndexVersion(db: D1Database): Promise<number> {
  const row = await db
    .prepare("SELECT value FROM meta WHERE key = ?")
    .bind('index_version')
    .first<{ value: number }>();
  return row?.value ?? 0;
}

export async function bumpIndexVersion(db: D1Database): Promise<number> {
  await db.prepare("UPDATE meta SET value = value + 1 WHERE key = ?").bind('index_version').run();
  return getIndexVersion(db);
}

// ── Write-through D1 yazma ─────────────────────────────────────────────────────

export async function upsertStoreToD1(db: D1Database, slug: string, record: StoreRecord): Promise<void> {
  const version = await getIndexVersion(db);
  const sf = storeRecordToStoreFields(slug, record, version);
  const rows = storeRecordToProductRows(slug, record);

  // 1) Store satırını upsert.
  await db.prepare(
    `INSERT OR REPLACE INTO stores
       (slug, name, city, country, iban, iban_name, whatsapp, listed, lang, index_version, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    sf.slug, sf.name, sf.city, sf.country, sf.iban, sf.iban_name,
    sf.whatsapp, sf.listed, sf.lang, sf.index_version, sf.updated_at,
  ).run();

  // 2) Bu mağazanın eski ürünlerini sil (replace semantiği).
  await db.prepare(`DELETE FROM products WHERE store_slug = ?`).bind(slug).run();

  // 3) Yeni ürünleri yaz.
  for (const r of rows) {
    await db.prepare(
      `INSERT OR REPLACE INTO products
         (id, store_slug, title, description, category_id, tags, price, currency, stock, image_url, product_path, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      r.id, r.store_slug, r.title, r.description, r.category_id, r.tags,
      r.price, r.currency, r.stock, r.image_url, r.product_path, r.updated_at,
    ).run();
  }
}

export async function removeStoreFromD1(db: D1Database, slug: string): Promise<void> {
  await db.prepare(`DELETE FROM products WHERE store_slug = ?`).bind(slug).run();
  await db.prepare(`DELETE FROM stores WHERE slug = ?`).bind(slug).run();
}

// ── Listeleme sorguları (D1'den çek, JS'te filtre/sırala/sayfala) ─────────────

async function fetchAllProducts(db: D1Database): Promise<ProductRow[]> {
  const { results } = await db.prepare(
    `SELECT id, store_slug, title, description, category_id, tags, price, currency, stock, image_url, product_path, updated_at
     FROM products`
  ).all<ProductRow>();
  return results ?? [];
}

async function fetchListedStores(db: D1Database): Promise<StoreRow[]> {
  const { results } = await db.prepare(
    `SELECT slug, name, city, country, iban, iban_name, whatsapp, listed, lang, index_version, updated_at
     FROM stores WHERE listed = 1`
  ).all<StoreRow>();
  return results ?? [];
}

function paginate<T>(items: T[], limit?: number, offset?: number): T[] {
  const start = offset ?? 0;
  const end = limit != null ? start + limit : undefined;
  return items.slice(start, end);
}

export async function listStores(
  db: D1Database,
  opts: { limit?: number; offset?: number },
): Promise<{ items: StoreRow[]; total: number }> {
  const all = await fetchListedStores(db);
  all.sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''));
  return { items: paginate(all, opts.limit, opts.offset), total: all.length };
}

export async function listNewProducts(
  db: D1Database,
  opts: { limit?: number; offset?: number; categoryId?: string },
): Promise<{ items: ProductRow[]; total: number }> {
  let all = await fetchAllProducts(db);
  if (opts.categoryId) all = all.filter((p) => p.category_id === opts.categoryId);
  all.sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''));
  return { items: paginate(all, opts.limit, opts.offset), total: all.length };
}

// ── Facet + filtre (saf) ──────────────────────────────────────────────────────

export interface SearchOpts {
  q?: string;
  lang?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  inStock?: boolean;
  sort?: 'new' | 'price_asc' | 'price_desc';
  limit?: number;
  offset?: number;
}

// Filtre/facet için store şehri lazım — products satırına city eklenmemiş olduğundan
// arama yolu products'ı stores ile JS'te birleştirir (aşağıda joinedRows).
interface JoinedRow extends ProductRow {
  city: string;
}

export function applyFilters(rows: JoinedRow[], opts: SearchOpts): JoinedRow[] {
  return rows.filter((r) => {
    if (opts.categoryId && r.category_id !== opts.categoryId) return false;
    if (opts.minPrice != null && (r.price == null || r.price < opts.minPrice)) return false;
    if (opts.maxPrice != null && (r.price == null || r.price > opts.maxPrice)) return false;
    if (opts.city && r.city !== opts.city) return false;
    if (opts.inStock === true && r.stock <= 0) return false;
    return true;
  });
}

export function computeFacets(rows: JoinedRow[]): Facets {
  const categories: Record<string, number> = {};
  const cities: Record<string, number> = {};
  let priceMin: number | null = null;
  let priceMax: number | null = null;
  for (const r of rows) {
    if (r.category_id) categories[r.category_id] = (categories[r.category_id] ?? 0) + 1;
    if (r.city) cities[r.city] = (cities[r.city] ?? 0) + 1;
    if (typeof r.price === 'number') {
      priceMin = priceMin == null ? r.price : Math.min(priceMin, r.price);
      priceMax = priceMax == null ? r.price : Math.max(priceMax, r.price);
    }
  }
  return { categories, cities, priceMin, priceMax };
}

// ── Orama indeks (tembel, modül-global cache, version damgası) ────────────────

let _oramaCache: OramaIndex | null = null;

async function buildOrama(db: D1Database, version: number): Promise<OramaIndex> {
  const products = await fetchAllProducts(db);
  const oramaDb = create({
    schema: { id: 'string', title: 'string', description: 'string', tags: 'string' },
  }) as OramaIndex['db'];
  const docs: OramaDoc[] = products.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    tags: p.tags.replace(/,/g, ' '),
  }));
  if (docs.length > 0) await insertMultiple(oramaDb, docs);
  return { db: oramaDb, version };
}

export async function getOrama(db: D1Database): Promise<OramaIndex> {
  const version = await getIndexVersion(db);
  if (_oramaCache && _oramaCache.version === version) return _oramaCache;
  _oramaCache = await buildOrama(db, version);
  return _oramaCache;
}

/** Test-only: modül-global Orama cache'ini sıfırlar. Production'da çağrılmaz. */
export function __resetOramaCache(): void {
  _oramaCache = null;
}
