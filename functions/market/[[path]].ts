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
  type Facets as LibFacets,
} from '../_lib/marketplace';
import type { AiBinding } from '../_lib/translate';
import {
  renderMarketHome,
  renderSearchPage,
  renderStoresPage,
  renderCategoryPage,
  buildItemListJsonLd,
  buildBreadcrumbJsonLd,
  buildStoreDirectoryJsonLd,
  type Facets,
  type SearchQuery,
  type LabelOf,
} from '../../src/storefront/marketplace';
import { mt } from '../../src/storefront/marketplace-i18n';
import { renderDocument, type AlternateLink } from '../../src/storefront/document';
import { SUPPORTED_LOCALES } from '../../src/storefront/manifest';
import { getTaxonomyService } from '../../src/storefront/taxonomy/load-local';
import { categoryBreadcrumb } from '../../src/storefront/taxonomy/category-resolve';
import { UNCATEGORIZED } from '../../src/storefront/taxonomy/legacy-map';

const DEFAULT_LANG = 'en';

export interface MarketDeps {
  url: string;
  lang: string;
  db: D1Database;
  ai: AiBinding | undefined;
  searchProducts: typeof realSearch;
  listNewProducts: typeof realListNew;
  listStores: typeof realListStores;
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
  const alts: AlternateLink[] = SUPPORTED_LOCALES.map((l) => ({ lang: l, href: `${origin}${path}?lang=${l}` }));
  alts.push({ lang: 'x-default', href: `${origin}${path}` });
  return alts;
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
    const body = renderMarketHome({ products: newP.items, stores: stores.items, categories: cats, locale, labelOf });
    const canonical = `${origin}/market`;
    return htmlResponse(renderDocument({
      title: mt(locale, 'marketTitle') + ' — photoZseo',
      description: mt(locale, 'trustBadge'),
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, '/market'),
      jsonLd: buildItemListJsonLd(newP.items, origin),
      stylesheets: ['/marketplace.css?v=3'],
      bodyScripts: ['/marketplace-enhance.js'],
    }));
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
    return htmlResponse(renderDocument({
      title: (q.q ? q.q + ' — ' : '') + mt(locale, 'marketTitle'),
      description: mt(locale, 'trustBadge'),
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, '/market/search'),
      jsonLd: buildItemListJsonLd(result.items, origin),
      stylesheets: ['/marketplace.css?v=3'],
      bodyScripts: ['/marketplace-enhance.js'],
      // Faceted/arama sonuç sayfaları indexlenmesin (sonsuz parametre kombinasyonu → crawl israfı/duplicate).
      robots: 'noindex, follow',
    }));
  }

  // /market/stores
  if (parts[0] === 'stores' && parts.length === 1) {
    const stores = await deps.listStores(deps.db, { limit: 100 });
    const body = renderStoresPage({ stores: stores.items, total: stores.total, locale });
    const canonical = `${origin}/market/stores`;
    return htmlResponse(renderDocument({
      title: mt(locale, 'stores') + ' — photoZseo',
      description: mt(locale, 'trustBadge'),
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, '/market/stores'),
      jsonLd: buildStoreDirectoryJsonLd(stores.items, origin),
      stylesheets: ['/marketplace.css?v=3'],
      bodyScripts: ['/marketplace-enhance.js'],
    }));
  }

  // /market/c/<id>
  if (parts[0] === 'c' && parts.length === 2) {
    const categoryId = decodeURIComponent(parts[1]);
    const result = await deps.searchProducts(deps.db, deps.ai as AiBinding, { categoryId, lang: locale, sort: 'new', limit: 40 });
    const breadcrumb = svc ? categoryBreadcrumb(categoryId, locale, svc) : null;
    const body = renderCategoryPage({ categoryId, items: result.items, total: result.total, locale, breadcrumb });
    const leaf = breadcrumb && breadcrumb.length ? breadcrumb[breadcrumb.length - 1].label : categoryId;
    const itemListLd = buildItemListJsonLd(result.items, origin);
    const jsonLd: string | string[] = breadcrumb && breadcrumb.length
      ? [buildBreadcrumbJsonLd(breadcrumb, origin), itemListLd]
      : itemListLd;
    const canonical = `${origin}/market/c/${encodeURIComponent(categoryId)}`;
    return htmlResponse(renderDocument({
      title: leaf + ' — ' + mt(locale, 'marketTitle'),
      description: mt(locale, 'trustBadge'),
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, `/market/c/${encodeURIComponent(categoryId)}`),
      jsonLd,
      stylesheets: ['/marketplace.css?v=3'],
      bodyScripts: ['/marketplace-enhance.js'],
    }));
  }

  return htmlResponse(renderDocument({
    title: 'Not found — photoZseo', description: '', lang: locale,
    body: '<div class="mk"><p style="padding:2rem;text-align:center">Not found</p></div>',
    stylesheets: ['/marketplace.css?v=3'],
  }), 404);
}

interface Env {
  MARKET_DB: D1Database;
  AI?: AiBinding;
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
  });
};
