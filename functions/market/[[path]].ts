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
  buildStoreDirectoryJsonLd,
  type Facets,
  type SearchQuery,
} from '../../src/storefront/marketplace';
import { mt } from '../../src/storefront/marketplace-i18n';
import { renderDocument, type AlternateLink } from '../../src/storefront/document';
import { SUPPORTED_LOCALES } from '../../src/storefront/manifest';

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
  const categories = Object.entries(lib.categories ?? {}).map(([id, count]) => ({ id, count }));
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

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60' },
  });
}

export async function handleMarket(parts: string[], deps: MarketDeps): Promise<Response> {
  const u = new URL(deps.url);
  const origin = u.origin;
  const locale = SUPPORTED_LOCALES.includes(deps.lang) ? deps.lang : DEFAULT_LANG;

  // /market
  if (parts.length === 0) {
    const [newP, stores] = await Promise.all([
      deps.listNewProducts(deps.db, { limit: 20 }),
      deps.listStores(deps.db, { limit: 12 }),
    ]);
    const cats: { id: string; count: number }[] = [];
    const seen = new Set<string>();
    for (const p of newP.items) {
      if (p.category_id && !seen.has(p.category_id)) { seen.add(p.category_id); cats.push({ id: p.category_id, count: 0 }); }
    }
    const body = renderMarketHome({ products: newP.items, stores: stores.items, categories: cats, locale });
    const canonical = `${origin}/market`;
    return htmlResponse(renderDocument({
      title: mt(locale, 'marketTitle') + ' — photoZseo',
      description: mt(locale, 'trustBadge'),
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, '/market'),
      jsonLd: buildItemListJsonLd(newP.items, origin),
      stylesheets: ['/marketplace.css'],
      bodyScripts: ['/marketplace-enhance.js'],
    }));
  }

  // /market/search
  if (parts[0] === 'search' && parts.length === 1) {
    const q: SearchQuery = {
      q: u.searchParams.get('q') ?? undefined,
      sort: (u.searchParams.get('sort') as SearchQuery['sort']) ?? 'new',
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
    const body = renderSearchPage({ items: result.items, facets: adaptFacets(result.facets), total: result.total, locale, query: q });
    const canonical = `${origin}/market/search`;
    return htmlResponse(renderDocument({
      title: (q.q ? q.q + ' — ' : '') + mt(locale, 'marketTitle'),
      description: mt(locale, 'trustBadge'),
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, '/market/search'),
      jsonLd: buildItemListJsonLd(result.items, origin),
      stylesheets: ['/marketplace.css'],
      bodyScripts: ['/marketplace-enhance.js'],
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
      stylesheets: ['/marketplace.css'],
      bodyScripts: ['/marketplace-enhance.js'],
    }));
  }

  // /market/c/<id>
  if (parts[0] === 'c' && parts.length === 2) {
    const categoryId = decodeURIComponent(parts[1]);
    const result = await deps.searchProducts(deps.db, deps.ai as AiBinding, { categoryId, lang: locale, sort: 'new', limit: 40 });
    const body = renderCategoryPage({ categoryId, items: result.items, total: result.total, locale });
    const canonical = `${origin}/market/c/${encodeURIComponent(categoryId)}`;
    return htmlResponse(renderDocument({
      title: categoryId + ' — ' + mt(locale, 'marketTitle'),
      description: mt(locale, 'trustBadge'),
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, `/market/c/${encodeURIComponent(categoryId)}`),
      jsonLd: buildItemListJsonLd(result.items, origin),
      stylesheets: ['/marketplace.css'],
      bodyScripts: ['/marketplace-enhance.js'],
    }));
  }

  return htmlResponse(renderDocument({
    title: 'Not found — photoZseo', description: '', lang: locale,
    body: '<div class="mk"><p style="padding:2rem;text-align:center">Not found</p></div>',
    stylesheets: ['/marketplace.css'],
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
