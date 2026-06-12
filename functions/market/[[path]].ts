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
import { mt } from '../../src/storefront/marketplace-i18n';
import { renderDocument, type AlternateLink } from '../../src/storefront/document';
import { SUPPORTED_LOCALES } from '../../src/storefront/manifest';
import { getTaxonomyService } from '../../src/storefront/taxonomy/load-local';
import { categoryBreadcrumb } from '../../src/storefront/taxonomy/category-resolve';
import { UNCATEGORIZED } from '../../src/storefront/taxonomy/legacy-map';
import { idToSlug, slugToId } from '../../src/storefront/taxonomy/slug-resolve';

const DEFAULT_LANG = 'en';

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
      jsonLd: [buildItemListJsonLd(newP.items, origin), buildWebSiteJsonLd(origin)],
      stylesheets: ['/marketplace.css?v=8'],
      bodyScripts: ['https://accounts.google.com/gsi/client', '/auth.js?v=11', '/marketplace-enhance.js?v=9', '/cart-badge.js?v=1'],
    }));
  }

  // /market/api/suggest?q=… — arama kutusu autocomplete (JSON, kısa cache)
  if (parts[0] === 'api' && parts[1] === 'suggest' && parts.length === 2) {
    const q = u.searchParams.get('q') ?? '';
    const suggestions = q.trim() && deps.suggestProducts
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
      q: u.searchParams.get('q') ?? undefined,
      sort,
      categoryId: u.searchParams.get('categoryId') ?? undefined,
      city: u.searchParams.get('city') ?? undefined,
      minPrice: u.searchParams.has('minPrice') ? Number(u.searchParams.get('minPrice')) : undefined,
      maxPrice: u.searchParams.has('maxPrice') ? Number(u.searchParams.get('maxPrice')) : undefined,
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
      stylesheets: ['/marketplace.css?v=8'],
      bodyScripts: ['https://accounts.google.com/gsi/client', '/auth.js?v=11', '/marketplace-enhance.js?v=9', '/cart-badge.js?v=1'],
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
        stylesheets: ['/marketplace.css?v=8'],
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
      stylesheets: ['/marketplace.css?v=8'],
      bodyScripts: ['https://accounts.google.com/gsi/client', '/auth.js?v=11', '/marketplace-enhance.js?v=9', '/marketplace-cart.js?v=1', '/cart-badge.js?v=1'],
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
      jsonLd: buildStoreDirectoryJsonLd(stores.items, origin),
      stylesheets: ['/marketplace.css?v=8'],
      bodyScripts: ['https://accounts.google.com/gsi/client', '/auth.js?v=11', '/marketplace-enhance.js?v=9', '/cart-badge.js?v=1'],
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
    const categoryId = slugToId(segment) ?? segment;
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
      stylesheets: ['/marketplace.css?v=8'],
      bodyScripts: ['https://accounts.google.com/gsi/client', '/auth.js?v=11', '/marketplace-enhance.js?v=9', '/cart-badge.js?v=1'],
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
      stylesheets: ['/marketplace.css?v=8'],
      bodyScripts: ['https://accounts.google.com/gsi/client', '/auth.js?v=11', '/marketplace-enhance.js?v=9', '/cart-badge.js?v=1'],
    }));
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
      stylesheets: ['/marketplace.css?v=8'],
      bodyScripts: ['https://accounts.google.com/gsi/client', '/auth.js?v=11', '/marketplace-enhance.js?v=9', '/market-account.js?v=8'],
    }));
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
      stylesheets: ['/marketplace.css?v=8'],
      bodyScripts: ['https://accounts.google.com/gsi/client', '/auth.js?v=11', '/marketplace-enhance.js?v=9', '/market-account.js?v=8'],
    }));
  }

  return htmlResponse(renderDocument({
    title: 'Not found — photoZseo', description: '', lang: locale,
    body: '<div class="mk"><p style="padding:2rem;text-align:center">Not found</p></div>',
    stylesheets: ['/marketplace.css?v=8'],
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
  return handleMarket(parts, {
    url: ctx.request.url, lang, db: ctx.env.MARKET_DB, ai: ctx.env.AI,
    searchProducts: realSearch, listNewProducts: realListNew, listStores: realListStores,
    suggestProducts: realSuggest, getProductById: realGetProductById,
    request: ctx.request, storeWriteKey: ctx.env.STORE_WRITE_KEY,
  });
};
