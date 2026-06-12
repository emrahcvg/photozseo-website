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
import { resolveLocalized, uniqueProductSlugs, productUrl } from '../../src/storefront/manifest';
import { create, insertMultiple, search, type Orama } from '@orama/orama';
import type { AiBinding } from './translate';
import legacyMap from '../../src/storefront/taxonomy/legacy-map.json';
import { mapLegacyId } from '../../src/storefront/taxonomy/legacy-map';
import { getTaxonomyService } from '../../src/storefront/taxonomy/load-local';

const DEFAULT_LANG = 'en';

// ── Public tipler (P2 buna güvenir) ──────────────────────────────────────────

export interface ProductRow {
  id: string;
  store_slug: string;
  store_name?: string;
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
  payment_json: string | null;
  whatsapp: string;
  owner_email: string | null;
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
  inStockCount: number;
}

// Orama doc + indeks tipi.
interface OramaDoc {
  id: string;
  title: string;
  description: string;
  tags: string;
  categoryPath: string;
}

export interface OramaIndex {
  db: Orama<{ id: 'string'; title: 'string'; description: 'string'; tags: 'string'; categoryPath: 'string' }>;
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
    payment_json: s.payment ? JSON.stringify(s.payment) : null,
    whatsapp: s.contact?.whatsapp ?? '',
    owner_email: s.contact?.email ?? null,
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
      store_name: manifest.store.displayName,
      title: resolveLocalized(p.title, lang),
      description: resolveLocalized(p.description, lang),
      category_id: mapLegacyId(p.categoryId, legacyMap as Record<string, string>),
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

// CONCURRENCY: P1 tek-yazar / düşük-trafik varsayımı. Bu fonksiyon atomik DEĞİL —
// (2) DELETE ile (3) INSERT arası kısa pencerede eşzamanlı bir getOrama, ürünleri
// silinmiş "stale-ama-tutarlı" bir index kurabilir; index_version bump (syncStoreToMarketplace
// sonunda) bu durumu bir sonraki sorguda düzeltir. P1 ölçeğinde kabul. Yüksek trafikte
// DELETE+INSERT'i tek db.batch([...]) (atomik) içine alıp bump'ı da batch'e ekle.
export async function upsertStoreToD1(db: D1Database, slug: string, record: StoreRecord): Promise<void> {
  const version = await getIndexVersion(db);
  const sf = storeRecordToStoreFields(slug, record, version);
  const rows = storeRecordToProductRows(slug, record);

  // 1) Store satırını upsert.
  await db.prepare(
    `INSERT OR REPLACE INTO stores
       (slug, name, city, country, iban, iban_name, payment_json, whatsapp, owner_email, listed, lang, index_version, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    sf.slug, sf.name, sf.city, sf.country, sf.iban, sf.iban_name, sf.payment_json,
    sf.whatsapp, sf.owner_email, sf.listed, sf.lang, sf.index_version, sf.updated_at,
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

// P1: full-scan + JS filtre kabul (küçük indeks, spec onaylı); N>~5k olunca
// SQL-side filtre/pagination'a (WHERE/LIMIT/OFFSET) geç.
async function fetchAllProducts(db: D1Database): Promise<ProductRow[]> {
  const { results } = await db.prepare(
    `SELECT id, store_slug, title, description, category_id, tags, price, currency, stock, image_url, product_path, updated_at
     FROM products`
  ).all<ProductRow>();
  return results ?? [];
}

async function fetchListedStores(db: D1Database): Promise<StoreRow[]> {
  const { results } = await db.prepare(
    `SELECT slug, name, city, country, iban, iban_name, payment_json, whatsapp, listed, lang, index_version, updated_at
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
  // Opt-in tutarlılığı: yalnız listed mağaza ürünleri görünür (joinedRows listed-only).
  let all = await joinedRows(db);
  if (opts.categoryId) all = all.filter((p) => p.category_id === opts.categoryId);
  all.sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''));
  const total = all.length;
  const items = paginate(all, opts.limit, opts.offset).map(({ city, ...rest }) => rest as ProductRow);
  return { items, total };
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
  const inStockCount = rows.filter((r) => r.stock > 0).length;
  return { categories, cities, priceMin, priceMax, inStockCount };
}

// ── Orama indeks (tembel, modül-global cache, version damgası) ────────────────

let _oramaCache: OramaIndex | null = null;

/** Kategori yolunun indeksleneceği diller — tüm desteklenen locale'ler.
 * Etiket tabloları lazy + cache'li (load-local.ts); "mutfak" gibi yerel
 * aramalar da kategori yolundan eşleşsin diye 12 dil birden indekslenir. */
const PATH_INDEX_LANGS = ['en', 'tr', 'de', 'es', 'pt', 'ja', 'ko', 'zh', 'ar', 'fa', 'hi', 'ur'];

async function buildOrama(db: D1Database, version: number): Promise<OramaIndex> {
  const products = await fetchAllProducts(db);
  const oramaDb = create({
    schema: { id: 'string', title: 'string', description: 'string', tags: 'string', categoryPath: 'string' },
  }) as OramaIndex['db'];

  // Kategori yolu etiketleri (graceful: yüklenemeyen dil atlanır).
  const services: { svc: Awaited<ReturnType<typeof getTaxonomyService>>; lang: string }[] = [];
  for (const lang of PATH_INDEX_LANGS) {
    try { services.push({ svc: await getTaxonomyService(lang), lang }); } catch { /* dil atla */ }
  }
  function multilingualPath(categoryId: string): string {
    const seen = new Set<string>();
    for (const { svc, lang } of services) {
      for (const label of svc.path(categoryId, lang)) seen.add(label);
    }
    return [...seen].join(' ');
  }

  const docs: OramaDoc[] = products.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    tags: p.tags.replace(/,/g, ' '),
    categoryPath: p.category_id ? multilingualPath(p.category_id) : '',
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

// ── Sorgu çevirisi (kanonik dile) ──────────────────────────────────────────────

const LANG_NAMES: Record<string, string> = {
  en: 'English', tr: 'Turkish', de: 'German', es: 'Spanish', pt: 'Portuguese',
  ja: 'Japanese', ko: 'Korean', zh: 'Chinese (Simplified)', ar: 'Arabic',
  fa: 'Persian', ur: 'Urdu', hi: 'Hindi',
};

// Kanonik dili D1 store satırlarından çıkar (çoğunluk / ilk listed store dili).
// LIMITATION: Her ürün KENDİ mağazasının languages[0]'ında saklanıyor, ama sorgu
// tek bir stores[0].lang'a çevriliyor. Karışık dilli pazaryerinde diğer dildeki
// ürünler full-text eşleşmeyebilir; ayrıca stores[0] deterministik sıralı değil
// (fetchListedStores ORDER BY yok). İleride çoğullu-dil sorgu çevirisi (P2).
async function inferCanonicalLang(db: D1Database): Promise<string> {
  const stores = await fetchListedStores(db);
  return stores[0]?.lang ?? DEFAULT_LANG;
}

async function translateQuery(ai: AiBinding, q: string, fromLang: string, toLang: string): Promise<string> {
  if (fromLang === toLang) return q;
  const src = LANG_NAMES[fromLang] ?? fromLang;
  const tgt = LANG_NAMES[toLang] ?? toLang;
  const system = `You are a search query translator. Translate the user's product search query from ${src} to ${tgt}. Output ONLY the translated query — no quotes, no notes.`;
  try {
    const res = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: q },
      ],
      max_tokens: 64,
      temperature: 0.1,
    });
    const out = (res.response ?? res.translated_text ?? '').trim();
    return out || q;
  } catch {
    return q; // graceful: çeviri başarısızsa orijinal sorgu
  }
}

// ── searchProducts ─────────────────────────────────────────────────────────────

async function joinedRows(db: D1Database): Promise<JoinedRow[]> {
  const products = await fetchAllProducts(db);
  const stores = await fetchListedStores(db);
  const cityBySlug = new Map(stores.map((s) => [s.slug, s.city]));
  const nameBySlug = new Map(stores.map((s) => [s.slug, s.name]));
  const listedSlugs = new Set(stores.map((s) => s.slug));
  // Sadece listed mağazaların ürünleri pazar yerinde görünür.
  return products
    .filter((p) => listedSlugs.has(p.store_slug))
    .map((p) => ({ ...p, city: cityBySlug.get(p.store_slug) ?? '', store_name: p.store_name ?? nameBySlug.get(p.store_slug) }));
}

function sortRows(rows: JoinedRow[], sort?: SearchOpts['sort']): JoinedRow[] {
  const r = [...rows];
  if (sort === 'price_asc') r.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  else if (sort === 'price_desc') r.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
  else r.sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? '')); // new
  return r;
}

export async function searchProducts(
  db: D1Database,
  ai: AiBinding,
  opts: SearchOpts,
): Promise<{ items: ProductRow[]; facets: Facets; total: number }> {
  let rows = await joinedRows(db);

  // 1) Full-text (Orama) — q varsa eşleşen id'lere indir.
  if (opts.q && opts.q.trim() !== '') {
    const canonical = await inferCanonicalLang(db);
    const queryLang = opts.lang ?? canonical;
    const term = await translateQuery(ai, opts.q.trim(), queryLang, canonical);
    const orama = await getOrama(db);
    // tolerance: 1 — tek karakterlik yazım hatalarını affet ("yga mat" → "yoga mat")
    const res = await search(orama.db, { term, limit: 1000, tolerance: 1 });
    const ids = new Set(res.hits.map((h) => String(h.document.id)));
    rows = rows.filter((r) => ids.has(r.id));
  }

  // 2) Yapısal filtreler.
  rows = applyFilters(rows, opts);

  // 3) Facet'ler filtrelenmiş küme üzerinden.
  const facets = computeFacets(rows);

  // 4) Sırala + sayfala.
  const sorted = sortRows(rows, opts.sort);
  const total = sorted.length;
  const items = paginate(sorted, opts.limit, opts.offset).map(({ city, ...rest }) => rest as ProductRow);

  return { items, facets, total };
}

/** Arama kutusu autocomplete önerileri — başlık bazlı, typo-toleranslı.
 * Hafif: facet/translate yok; yalnız Orama'dan ilk eşleşen benzersiz başlıklar. */
export async function suggestProducts(db: D1Database, q: string, limit = 6): Promise<string[]> {
  const term = q.trim();
  if (term === '') return [];
  const orama = await getOrama(db);
  const res = await search(orama.db, { term, limit: 50, tolerance: 1 });
  const seen = new Set<string>();
  for (const h of res.hits) {
    const title = String((h.document as { title?: unknown }).title ?? '').trim();
    if (title) seen.add(title);
    if (seen.size >= limit) break;
  }
  return [...seen];
}

// ── Write-through orkestratör (PUT/DELETE handler'larından çağrılır) ──────────

/**
 * Mağaza yayınlandığında çağrılır. marketplaceListed true ise D1'e upsert eder,
 * false (opt-out) ise D1'den düşürür. Her iki durumda index_version'ı artırır
 * (Orama'nın yeniden kurulmasını tetikler). best-effort: hata fırlatabilir,
 * çağıran graceful yakalar.
 */
export interface ProductDetailRow extends ProductRow {
  whatsapp: string | null;
  city: string | null;
  country: string | null;
}

/** Tek ürün + mağaza bilgisi — PDP için. */
export async function getProductById(db: D1Like, id: string): Promise<ProductDetailRow | null> {
  return db
    .prepare(
      `SELECT p.id, p.store_slug, p.title, p.description, p.category_id, p.tags,
              p.price, p.currency, p.stock, p.image_url, p.product_path, p.updated_at,
              COALESCE(s.name, p.store_slug) AS store_name,
              s.whatsapp, s.city, s.country
       FROM products p
       LEFT JOIN stores s ON s.slug = p.store_slug
       WHERE p.id = ?`,
    )
    .bind(id)
    .first<ProductDetailRow>();
}

export async function syncStoreToMarketplace(
  db: D1Database,
  slug: string,
  record: StoreRecord,
): Promise<void> {
  const listed = record.manifest.store.marketplaceListed === true;
  if (listed) {
    await upsertStoreToD1(db, slug, record);
  } else {
    await removeStoreFromD1(db, slug);
  }
  await bumpIndexVersion(db);
}
