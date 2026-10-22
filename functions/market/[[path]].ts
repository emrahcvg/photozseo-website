/**
 * GET /market/*
 *   /market                 → hybrid home
 *   /market/search?q&…      → faceted search
 *   /market/stores          → store directory
 *   /market/c/<id>          → category listing
 *
 * Pure handler `handleMarket` is unit-testable with injected lib deps; the Pages
 * onRequestGet wires the real D1/AI bindings + P1 functions/_lib/marketplace.ts.
 *
 * P1 deviation: P1's searchProducts returns Facets as Record maps + priceMin/priceMax;
 * the render layer (src/storefront/marketplace.ts) wants count arrays + priceRange.
 * `adaptFacets` bridges the two so the renderer stays framework-free + testable.
 */

import { htmlResponse } from '../_lib/html-response';
import {
  searchProducts as realSearch,
  listNewProducts as realListNew,
  listStores as realListStores,
  suggestProducts as realSuggest,
  getProductById as realGetProductById,
  type Facets as LibFacets,
  type ProductDetailRow,
} from '../_lib/marketplace';
import type { AiBinding } from '../_lib/translate';
import {
  renderMarketHome,
  renderSearchPage,
  renderStoresPage,
  renderCategoryPage,
  renderOrdersPage,
  renderFavoritesPage,
  renderCartPage,
  renderProductPage,
  buildItemListJsonLd,
  buildBreadcrumbJsonLd,
  buildStoreDirectoryJsonLd,
  buildProductJsonLd,
  type Facets,
  type SearchQuery,
  type LabelOf,
  type CategoryTreeNode,
} from '../../src/storefront/marketplace';
import { resolveOwnerKey } from '../_lib/buyer-owner';
import { listOrders } from '../_lib/orders';
import { listAllFavorites, listAllCart } from '../_lib/buyer';
import { mt, MK_LOCALES } from '../../src/storefront/marketplace-i18n';
import { renderDocument, type AlternateLink } from '../../src/storefront/document';
/** Market arayüz dilleri (15) — mağaza içerik dilleri (manifest SUPPORTED_LOCALES, 12) ayrı tutulur. */
const SUPPORTED_LOCALES: readonly string[] = MK_LOCALES;
import { getTaxonomyService } from '../../src/storefront/taxonomy/load-local';
import { categoryBreadcrumb } from '../../src/storefront/taxonomy/category-resolve';
import { UNCATEGORIZED } from '../../src/storefront/taxonomy/legacy-map';
import { idToSlug, slugToId } from '../../src/storefront/taxonomy/slug-resolve';

const DEFAULT_LANG = 'en';

/** Arama metni üst sınırı — uzun sorgular AI çevirisi + Orama CPU maliyetini şişirmesin. */
const MAX_QUERY_LEN = 100;
/** Autocomplete: 2–64 karakter arası; altı/üstü boş liste döner. */
const SUGGEST_MIN = 2;
const SUGGEST_MAX = 64;

const MARKET_CSS = ['/marketplace.css?v=9'];
const GSI = 'https://accounts.google.com/gsi/client';
const BASE_SCRIPTS = [GSI, '/auth.js?v=11', '/marketplace-enhance.js?v=10', '/cart-badge.js?v=1'];
const PDP_SCRIPTS = [GSI, '/auth.js?v=11', '/marketplace-enhance.js?v=10', '/marketplace-cart.js?v=2', '/cart-badge.js?v=1'];
const ACCOUNT_SCRIPTS = [GSI, '/auth.js?v=11', '/marketplace-enhance.js?v=10', '/market-account.js?v=8', '/cart-badge.js?v=1'];

/** Sonlu ve negatif olmayan sayı; değilse undefined (NaN/"abc"/boş → filtre yok). */
function parsePrice(raw: string | null): number | undefined {
  if (raw === null || raw.trim() === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function clampQuery(raw: string | null): string | undefined {
  const q = (raw ?? '').trim().slice(0, MAX_QUERY_LEN);
  return q || undefined;
}

export interface MarketDeps {
  url: string;
  lang: string;
  db: D1Database;
  ai: AiBinding | undefined;
  searchProducts: typeof realSearch;
  listNewProducts: typeof realListNew;
  listStores: typeof realListStores;
  /** Autocomplete önerileri (opsiyonel — eski test deps'leri kırılmasın). */
  suggestProducts?: typeof realSuggest;
  getProductById?: typeof realGetProductById;
  request?: Request;
  storeWriteKey?: string;
}

/**
 * Adapt P1's Facets (Record<string,number> maps + priceMin/priceMax) to the
 * render layer's count-array shape. Already-adapted (render-shape) inputs pass
 * through unchanged so injected test deps that return the render shape work too.
 */
function adaptFacets(f: LibFacets | Facets): Facets {
  if (Array.isArray((f as Facets).categories)) return f as Facets;
  const lib = f as LibFacets;
  const categories = Object.entries(lib.categories ?? {})
    .filter(([id]) => id !== UNCATEGORIZED) // sentinel'i facet listesinde gösterme
    .map(([id, count]) => ({ id, count }));
  const cities = Object.entries(lib.cities ?? {}).map(([value, count]) => ({ value, count }));
  return {
    categories,
    cities,
    priceRange: { min: lib.priceMin ?? 0, max: lib.priceMax ?? 0 },
    inStockCount: lib.inStockCount ?? 0,
  };
}

function buildAlternates(origin: string, path: string): AlternateLink[] {
  // Default dil (en) parametresiz URL'de yaşar; diğer diller ?lang=xx.
  // x-default da en'i (parametresiz URL) gösterir → canonical ile çelişmez.
  const alts: AlternateLink[] = SUPPORTED_LOCALES.map((l) => ({
    lang: l,
    href: l === DEFAULT_LANG ? `${origin}${path}` : `${origin}${path}?lang=${l}`,
  }));
  alts.push({ lang: 'x-default', href: `${origin}${path}` });
  return alts;
}

/** Self-referencing canonical: en → parametresiz URL, diğer diller → kendi ?lang=xx URL'i. */
function buildCanonical(origin: string, path: string, locale: string): string {
  return locale === DEFAULT_LANG ? `${origin}${path}` : `${origin}${path}?lang=${locale}`;
}

/** WebSite + SearchAction JSON-LD (/market home head'i için, sitelinks search box). */
function buildWebSiteJsonLd(origin: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'photoZseo Market',
    url: `${origin}/market`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${origin}/market/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });
}


export async function handleMarket(parts: string[], deps: MarketDeps): Promise<Response> {
  const u = new URL(deps.url);
  const origin = u.origin;
  const locale = SUPPORTED_LOCALES.includes(deps.lang) ? deps.lang : DEFAULT_LANG;

  // Taxonomy servisi graceful — yüklenemezse svc=undefined, labelOf id döner
  let svc: Awaited<ReturnType<typeof getTaxonomyService>> | undefined;
  try { svc = await getTaxonomyService(locale); } catch { svc = undefined; }
  const labelOf: LabelOf = (id, loc) => (svc ? svc.label(id, loc) : id);

  // /market
  if (parts.length === 0) {
    const [newP, stores] = await Promise.all([
      deps.listNewProducts(deps.db, { limit: 20 }),
      deps.listStores(deps.db, { limit: 12 }),
    ]);
    // L1 ata rollup: her ürünün category_id'sini kök L1'e indirge, sayısını topla
    const l1 = new Map<string, number>();
    for (const p of newP.items) {
      if (!p.category_id || p.category_id === UNCATEGORIZED) continue; // sentinel'i chip'te gösterme
      const root = svc ? (svc.ancestors(p.category_id)[0]?.id ?? p.category_id) : p.category_id;
      l1.set(root, (l1.get(root) ?? 0) + 1);
    }
    // Üst kategorileri taksonomiden çek → boş olsa DA hepsi görünür; ürün sayıları bindirilir.
    const roots = svc ? svc.children(null) : [];
    const cats = roots.length
      ? roots.map((n) => ({ id: n.id, count: l1.get(n.id) ?? 0 }))
      : [...l1.entries()].map(([id, count]) => ({ id, count }));
    // L1+L2 kategori ağacı → sol sidebar
    const categoryTree: CategoryTreeNode[] = svc
      ? svc.children(null).map((root) => ({
          id: root.id,
          label: svc!.label(root.id, locale),
          children: svc!.children(root.id).map((c) => ({
            id: c.id,
            label: svc!.label(c.id, locale),
            children: [],
          })),
        }))
      : [];
    const body = renderMarketHome({ products: newP.items, stores: stores.items, categories: cats, locale, labelOf, categoryTree });
    const canonical = buildCanonical(origin, '/market', locale);
    const homeOgImage = newP.items.find((p) => p.image_url)?.image_url ?? `${origin}/og-image.png`;
    return htmlResponse(renderDocument({
      title: mt(locale, 'marketTitle') + ' — photoZseo',
      description: 'photoZseo marketplace — find and buy products worldwide.',
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, '/market'),
      ogImage: homeOgImage,
      preloadImage: newP.items[0]?.image_url,
      // Boş pazar yeri ince içerik sayılır; ilk mağaza listelenince otomatik index'e döner.
      ...(stores.items.length === 0 ? { robots: 'noindex, follow' } : {}),
      jsonLd: [buildItemListJsonLd(newP.items, origin), buildWebSiteJsonLd(origin)],
      stylesheets: MARKET_CSS,
      bodyScripts: BASE_SCRIPTS,
    }));
  }

  // /market/api/suggest?q=… — arama kutusu autocomplete (JSON, kısa cache)
  if (parts[0] === 'api' && parts[1] === 'suggest' && parts.length === 2) {
    const q = (u.searchParams.get('q') ?? '').trim();
    const suggestions = q.length >= SUGGEST_MIN && q.length <= SUGGEST_MAX && deps.suggestProducts
      ? await deps.suggestProducts(deps.db, q, 6)
      : [];
    return new Response(JSON.stringify({ suggestions }), {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=60',
      },
    });
  }

  // /market/search
  if (parts[0] === 'search' && parts.length === 1) {
    const rawSort = u.searchParams.get('sort');
    const sort: SearchQuery['sort'] =
      rawSort === 'price_asc' || rawSort === 'price_desc' ? rawSort : 'new';
    const q: SearchQuery = {
      q: clampQuery(u.searchParams.get('q')),
      sort,
      categoryId: u.searchParams.get('categoryId')?.slice(0, 64) || undefined,
      city: u.searchParams.get('city')?.slice(0, 80) || undefined,
      minPrice: parsePrice(u.searchParams.get('minPrice')),
      maxPrice: parsePrice(u.searchParams.get('maxPrice')),
      inStock: u.searchParams.get('inStock') === '1',
    };
    const result = await deps.searchProducts(deps.db, deps.ai as AiBinding, {
      q: q.q, lang: locale, categoryId: q.categoryId, minPrice: q.minPrice, maxPrice: q.maxPrice,
      city: q.city, inStock: q.inStock, sort: q.sort, limit: 40, offset: 0,
    });
    const body = renderSearchPage({ items: result.items, facets: adaptFacets(result.facets), total: result.total, locale, query: q, labelOf });
    const canonical = `${origin}/market/search`;
    const searchDesc = q.q
      ? `Search results for "${q.q}" — photoZseo marketplace`
      : 'photoZseo marketplace — find and buy products worldwide.';
    const searchOgImage = result.items.find((p) => p.image_url)?.image_url ?? `${origin}/og-image.png`;
    return htmlResponse(renderDocument({
      title: (q.q ? q.q + ' — ' : '') + mt(locale, 'marketTitle'),
      description: searchDesc,
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, '/market/search'),
      ogImage: searchOgImage,
      jsonLd: buildItemListJsonLd(result.items, origin),
      stylesheets: MARKET_CSS,
      bodyScripts: BASE_SCRIPTS,
      // Faceted/arama sonuç sayfaları indexlenmesin (sonsuz parametre kombinasyonu → crawl israfı/duplicate).
      robots: 'noindex, follow',
    }));
  }

  // /market/p/:id — ürün detay sayfası
  if (parts[0] === 'p' && parts.length === 2) {
    const productId = decodeURIComponent(parts[1]);
    const getter = deps.getProductById ?? realGetProductById;
    const product = await getter(deps.db, productId);
    if (!product) {
      return htmlResponse(renderDocument({
        title: 'Product not found — photoZseo', description: '', lang: locale,
        body: '<div class="mk"><p style="padding:2rem;text-align:center">Product not found</p></div>',
        stylesheets: MARKET_CSS,
      }), 404);
    }
    const pdpUrl = `/market/p/${encodeURIComponent(product.id)}`;
    const canonical = buildCanonical(origin, pdpUrl, locale);
    const body = renderProductPage(product, locale);
    return htmlResponse(renderDocument({
      title: `${product.title} — photoZseo`,
      description: product.description ? product.description.slice(0, 160) : `${product.title} — photoZseo marketplace`,
      lang: locale, body, canonical,
      ogImage: product.image_url || `${origin}/og-image.png`,
      preloadImage: product.image_url || undefined,
      jsonLd: buildProductJsonLd(product, origin),
      stylesheets: MARKET_CSS,
      bodyScripts: PDP_SCRIPTS,
    }));
  }

  // /market/stores
  if (parts[0] === 'stores' && parts.length === 1) {
    const stores = await deps.listStores(deps.db, { limit: 100 });
    const body = renderStoresPage({ stores: stores.items, total: stores.total, locale });
    const canonical = buildCanonical(origin, '/market/stores', locale);
    return htmlResponse(renderDocument({
      title: mt(locale, 'stores') + ' — photoZseo',
      description: 'Browse all seller stores on photoZseo marketplace.',
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, '/market/stores'),
      ogImage: `${origin}/og-image.png`,
      ...(stores.items.length === 0 ? { robots: 'noindex, follow' } : {}),
      jsonLd: buildStoreDirectoryJsonLd(stores.items, origin),
      stylesheets: MARKET_CSS,
      bodyScripts: BASE_SCRIPTS,
    }));
  }

  // /market/c/<slug-or-id>
  if (parts[0] === 'c' && parts.length === 2) {
    const segment = decodeURIComponent(parts[1]);
    // Numeric ID → 301 permanent redirect to slug URL (old bookmarks / external links)
    if (/^\d+$/.test(segment)) {
      const slug = idToSlug(segment);
      const target = locale === DEFAULT_LANG
        ? `${origin}/market/c/${slug}`
        : `${origin}/market/c/${slug}?lang=${locale}`;
      return new Response(null, {
        status: 301,
        headers: { Location: target, 'Cache-Control': 'public, max-age=31536000' },
      });
    }
    // Slug → resolve to numeric ID for DB query; unknown segment stays as-is
    const resolved = slugToId(segment);
    // Taksonomi yüklüyken bilinmeyen segment → gerçek 404 (soft-404 / sonsuz indexlenebilir URL olmasın).
    if (!resolved && svc && !svc.node(segment) && segment !== UNCATEGORIZED) {
      return htmlResponse(renderDocument({
        title: 'Not found — photoZseo', description: '', lang: locale, robots: 'noindex',
        body: '<div class="mk"><p style="padding:2rem;text-align:center">Not found</p></div>',
        stylesheets: MARKET_CSS,
      }), 404);
    }
    const categoryId = resolved ?? segment;
    const slugPath = `/market/c/${idToSlug(categoryId)}`;
    const result = await deps.searchProducts(deps.db, deps.ai as AiBinding, { categoryId, lang: locale, sort: 'new', limit: 40 });
    const breadcrumb = svc ? categoryBreadcrumb(categoryId, locale, svc) : null;
    const body = renderCategoryPage({ categoryId, items: result.items, total: result.total, locale, breadcrumb });
    const leaf = breadcrumb && breadcrumb.length ? breadcrumb[breadcrumb.length - 1].label : categoryId;
    const itemListLd = buildItemListJsonLd(result.items, origin);
    const jsonLd: string | string[] = breadcrumb && breadcrumb.length
      ? [buildBreadcrumbJsonLd(breadcrumb, origin), itemListLd]
      : itemListLd;
    const canonical = buildCanonical(origin, slugPath, locale);
    const categoryOgImage = result.items.find((p) => p.image_url)?.image_url ?? `${origin}/og-image.png`;
    return htmlResponse(renderDocument({
      title: leaf + ' — ' + mt(locale, 'marketTitle'),
      description: `${leaf} — photoZseo marketplace`,
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, slugPath),
      ogImage: categoryOgImage,
      preloadImage: result.items[0]?.image_url,
      jsonLd,
      stylesheets: MARKET_CSS,
      bodyScripts: BASE_SCRIPTS,
    }));
  }

  // /market/orders — alıcı sipariş geçmişi (hesaba bağlı, özel sayfa)
  if (parts[0] === 'orders' && parts.length === 1) {
    const now = Math.floor(Date.now() / 1000);
    const owner = deps.request
      ? await resolveOwnerKey(deps.request, deps.storeWriteKey, now)
      : null;
    const orders = owner ? await listOrders(deps.db as unknown as Parameters<typeof listOrders>[0], owner) : [];
    const body = renderOrdersPage({ orders, locale, loggedIn: owner !== null });
    return htmlResponse(renderDocument({
      title: mt(locale, 'myOrders') + ' — photoZseo',
      description: '',
      lang: locale,
      body,
      robots: 'noindex',
      stylesheets: MARKET_CSS,
      bodyScripts: BASE_SCRIPTS,
    }), 200, { private: true });
  }

  // /market/favorites — alıcı favorileri (çapraz-mağaza, hesaba/cihaza bağlı)
  if (parts[0] === 'favorites' && parts.length === 1) {
    const now = Math.floor(Date.now() / 1000);
    const owner = deps.request ? await resolveOwnerKey(deps.request, deps.storeWriteKey, now) : null;
    const groups = owner ? await listAllFavorites(deps.db as unknown as Parameters<typeof listAllFavorites>[0], owner) : [];
    const body = renderFavoritesPage({ groups, locale, loggedIn: owner !== null });
    return htmlResponse(renderDocument({
      title: mt(locale, 'myFavorites') + ' — photoZseo',
      description: '', lang: locale, body, robots: 'noindex',
      stylesheets: MARKET_CSS,
      bodyScripts: ACCOUNT_SCRIPTS,
    }), 200, { private: true });
  }

  // /market/cart — alıcı sepeti (çapraz-mağaza, hesaba/cihaza bağlı)
  if (parts[0] === 'cart' && parts.length === 1) {
    const now = Math.floor(Date.now() / 1000);
    const owner = deps.request ? await resolveOwnerKey(deps.request, deps.storeWriteKey, now) : null;
    const groups = owner ? await listAllCart(deps.db as unknown as Parameters<typeof listAllCart>[0], owner) : [];
    const body = renderCartPage({ groups, locale, loggedIn: owner !== null });
    return htmlResponse(renderDocument({
      title: mt(locale, 'myCart') + ' — photoZseo',
      description: '', lang: locale, body, robots: 'noindex',
      stylesheets: MARKET_CSS,
      bodyScripts: ACCOUNT_SCRIPTS,
    }), 200, { private: true });
  }

  return htmlResponse(renderDocument({
    title: 'Not found — photoZseo', description: '', lang: locale,
    body: '<div class="mk"><p style="padding:2rem;text-align:center">Not found</p></div>',
    stylesheets: MARKET_CSS,
  }), 404);
}

interface Env {
  MARKET_DB: D1Database;
  AI?: AiBinding;
  STORE_WRITE_KEY?: string;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const raw = ctx.params.path;
  const rawPath = Array.isArray(raw) ? raw.join('/') : (raw ?? '');
  const parts = rawPath.split('/').filter(Boolean);
  const u = new URL(ctx.request.url);
  const lang = u.searchParams.get('lang') ?? DEFAULT_LANG;
  try {
    return await handleMarket(parts, {
      url: ctx.request.url, lang, db: ctx.env.MARKET_DB, ai: ctx.env.AI,
      searchProducts: realSearch, listNewProducts: realListNew, listStores: realListStores,
      suggestProducts: realSuggest, getProductById: realGetProductById,
      request: ctx.request, storeWriteKey: ctx.env.STORE_WRITE_KEY,
    });
  } catch (err) {
    // D1/AI geçici hatası: ham 500/1101 yerine markalı 503 + Retry-After.
    console.error('[market] handler error', err);
    const res = htmlResponse(renderDocument({
      title: 'Temporarily unavailable — photoZseo', description: '', lang: SUPPORTED_LOCALES.includes(lang) ? lang : DEFAULT_LANG,
      robots: 'noindex',
      body: '<div class="mk"><p style="padding:2rem;text-align:center">The marketplace is temporarily unavailable. Please try again in a minute.</p></div>',
      stylesheets: MARKET_CSS,
    }), 503);
    res.headers.set('retry-after', '60');
    res.headers.set('cache-control', 'no-store');
    return res;
  }
};
