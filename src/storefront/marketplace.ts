/**
 * marketplace.ts — Framework-free render layer for the /market discovery surface.
 * Pure TypeScript; no DOM, no Astro. All user strings HTML-escaped (escapeHtml).
 * Local row interfaces mirror the P1 functions/_lib/marketplace.ts contract
 * so this file is unit-testable without the D1 binding.
 *
 * NOTE: P1's `Facets` uses Record<string,number> maps + priceMin/priceMax; this
 * render layer uses a count-array shape ({id,count}[]/{value,count}[] + priceRange).
 * The router (functions/market/[[path]].ts) adapts P1's facets to this shape.
 */

import { escapeHtml } from './render';
import { mt } from './marketplace-i18n';

// ── P1 contract mirror (render-layer view) ────────────────────────────────────
export interface ProductRow {
  id: string;
  store_slug: string;
  title: string;
  description: string;
  category_id: string;
  tags: string;
  price: number | null;
  currency: string;
  stock: number | null;
  image_url: string;
  product_path: string;
}
export interface StoreRow {
  slug: string;
  name: string;
  city: string;
  country: string;
  listed: number;
}
export interface Facets {
  categories: { id: string; count: number }[];
  priceRange: { min: number; max: number };
  cities: { value: string; count: number }[];
  inStockCount: number;
}

/** Escape a URL/attribute value (escapeHtml is sufficient for attribute context). */
function escapeAttr(s: string): string {
  return escapeHtml(s);
}

/** Parse a tags column that may be a JSON array string or a CSV string. */
export function parseTags(raw: string): string[] {
  const s = (raw ?? '').trim();
  if (!s) return [];
  if (s.startsWith('[')) {
    try {
      const arr = JSON.parse(s);
      if (Array.isArray(arr)) return arr.map((x) => String(x).trim()).filter(Boolean);
    } catch { /* fall through to CSV */ }
  }
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}

/** Format a price; empty string when null (card shows "contact" upstream). */
export function mkFormatPrice(price: number | null, currency: string, locale: string): string {
  if (price == null || Number.isNaN(price)) return '';
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(price);
  } catch {
    return `${price.toFixed(2)} ${currency}`;
  }
}

export { escapeAttr };

/** A marketplace product card linking to its store product page. */
export function renderProductCard(p: ProductRow, locale: string): string {
  const title = escapeHtml(p.title);
  const price = mkFormatPrice(p.price, p.currency, locale);
  const soldOut = p.stock === 0;
  const href = escapeAttr(p.product_path);

  let html = `<a class="mk-card-link" href="${href}">\n`;
  html += '  <article class="mk-card">\n';
  html += '    <div class="mk-card__media">\n';
  if (p.image_url) {
    html += `      <img src="${escapeAttr(p.image_url)}" alt="${title}" loading="lazy" decoding="async" width="600" height="600" />\n`;
  } else {
    html += '      <div class="mk-card__media-empty" aria-hidden="true">📷</div>\n';
  }
  if (soldOut) {
    html += `      <span class="mk-card__badge">${escapeHtml(mt(locale, 'soldOut'))}</span>\n`;
  }
  html += '    </div>\n';
  html += '    <div class="mk-card__body">\n';
  html += `      <h3 class="mk-card__title">${title}</h3>\n`;
  if (price) {
    html += `      <span class="mk-card__price">${escapeHtml(price)}</span>\n`;
  } else {
    html += `      <span class="mk-card__price mk-card__price--contact">${escapeHtml(mt(locale, 'contactForPrice'))}</span>\n`;
  }
  html += '    </div>\n';
  html += '  </article>\n';
  html += '</a>\n';
  return html;
}

/** Horizontal, thumb-friendly category chip row. "All" → /market/search. */
export function renderCategoryChips(
  categories: { id: string; count: number }[],
  locale: string,
): string {
  let html = `<nav class="mk-chips" aria-label="${escapeHtml(mt(locale, 'categories'))}">\n`;
  html += `  <a class="mk-chip mk-chip--all" href="/market/search">${escapeHtml(mt(locale, 'allCategories'))}</a>\n`;
  for (const c of categories) {
    const href = `/market/c/${encodeURIComponent(c.id)}`;
    html += `  <a class="mk-chip" href="${escapeAttr(href)}">${escapeHtml(c.id)} <span class="mk-chip__count">${c.count}</span></a>\n`;
  }
  html += '</nav>\n';
  return html;
}

/** Horizontal store directory strip. Each item → existing /store/<slug>. */
export function renderStoreStrip(stores: StoreRow[], locale: string): string {
  let html = `<div class="mk-stores" role="list" aria-label="${escapeHtml(mt(locale, 'stores'))}">\n`;
  for (const s of stores) {
    const loc = [s.city, s.country].filter(Boolean).join(', ');
    html += `  <a class="mk-store" role="listitem" href="/store/${escapeAttr(encodeURIComponent(s.slug))}">\n`;
    html += `    <span class="mk-store__name">${escapeHtml(s.name)}</span>\n`;
    if (loc) html += `    <span class="mk-store__loc">📍 ${escapeHtml(loc)}</span>\n`;
    html += '  </a>\n';
  }
  html += '</div>\n';
  return html;
}

function renderSearchBar(locale: string): string {
  const ph = escapeHtml(mt(locale, 'searchPlaceholder'));
  return (
    '<form class="mk-searchbar" action="/market/search" method="get" role="search">\n' +
    `  <input type="search" name="q" class="mk-searchbar__input" placeholder="${ph}" aria-label="${ph}" />\n` +
    `  <button type="submit" class="mk-searchbar__btn">${escapeHtml(mt(locale, 'marketTitle'))}</button>\n` +
    '</form>\n'
  );
}

function renderTrustBadge(locale: string): string {
  return `<p class="mk-trust">${escapeHtml(mt(locale, 'trustBadge'))}</p>\n`;
}

/** Footer: trust badge (repeat) + report link to the moderation/kill-switch channel. */
export function renderMarketFooter(locale: string): string {
  const reportHref = `mailto:support@photozseo.com?subject=${encodeURIComponent('Report marketplace listing')}`;
  let html = '<footer class="mk-footer">\n';
  html += `  <p class="mk-trust">${escapeHtml(mt(locale, 'trustBadge'))}</p>\n`;
  html += `  <a class="mk-footer__report" href="${escapeAttr(reportHref)}">${escapeHtml(mt(locale, 'report'))}</a>\n`;
  html += '</footer>\n';
  return html;
}

export function renderMarketHome(args: {
  products: ProductRow[];
  stores: StoreRow[];
  categories: { id: string; count: number }[];
  locale: string;
}): string {
  const { products, stores, categories, locale } = args;
  let html = '<div class="mk">\n';
  html += '<header class="mk-top">\n';
  html += `  <a class="mk-logo" href="/market">${escapeHtml(mt(locale, 'marketTitle'))}</a>\n`;
  html += renderSearchBar(locale);
  html += '</header>\n';
  html += renderCategoryChips(categories, locale);

  // Featured slot — reserved, empty for now (no products yet).
  html += '<section class="mk-featured" aria-label="' + escapeHtml(mt(locale, 'featured')) + '" hidden></section>\n';

  // New products grid
  html += '<section class="mk-section">\n';
  html += `  <h2 class="mk-section__title">${escapeHtml(mt(locale, 'newProducts'))}</h2>\n`;
  html += '  <div class="mk-grid">\n';
  for (const p of products) html += renderProductCard(p, locale);
  html += '  </div>\n';
  html += '</section>\n';

  // Stores strip
  html += '<section class="mk-section">\n';
  html += `  <h2 class="mk-section__title">${escapeHtml(mt(locale, 'stores'))}</h2>\n`;
  html += renderStoreStrip(stores, locale);
  html += '</section>\n';

  html += renderMarketFooter(locale);
  html += '</div>\n';
  return html;
}

export interface SearchQuery {
  q?: string;
  sort?: 'new' | 'price_asc' | 'price_desc';
  categoryId?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

function sortOption(value: string, label: string, current: string | undefined): string {
  const sel = value === (current ?? 'new') ? ' selected' : '';
  return `<option value="${escapeAttr(value)}"${sel}>${escapeHtml(label)}</option>`;
}

function renderFacets(facets: Facets, q: SearchQuery, locale: string): string {
  let h = '<aside class="mk-facets" data-mk-facets>\n';

  // Categories
  h += `  <fieldset class="mk-facet"><legend>${escapeHtml(mt(locale, 'categories'))}</legend>\n`;
  for (const c of facets.categories) {
    const checked = q.categoryId === c.id ? ' checked' : '';
    h += `    <label class="mk-facet__opt"><input type="radio" name="categoryId" value="${escapeAttr(c.id)}"${checked} /> ${escapeHtml(c.id)} <span class="mk-facet__count">${c.count}</span></label>\n`;
  }
  h += '  </fieldset>\n';

  // Price range
  h += `  <fieldset class="mk-facet"><legend>${escapeHtml(mt(locale, 'price'))}</legend>\n`;
  h += `    <input type="number" name="minPrice" inputmode="decimal" placeholder="${escapeHtml(mt(locale, 'min'))} (${facets.priceRange.min})" value="${q.minPrice != null ? q.minPrice : ''}" />\n`;
  h += `    <input type="number" name="maxPrice" inputmode="decimal" placeholder="${escapeHtml(mt(locale, 'max'))} (${facets.priceRange.max})" value="${q.maxPrice != null ? q.maxPrice : ''}" />\n`;
  h += '  </fieldset>\n';

  // Cities
  if (facets.cities.length) {
    h += `  <fieldset class="mk-facet"><legend>${escapeHtml(mt(locale, 'city'))}</legend>\n`;
    for (const c of facets.cities) {
      const checked = q.city === c.value ? ' checked' : '';
      h += `    <label class="mk-facet__opt"><input type="radio" name="city" value="${escapeAttr(c.value)}"${checked} /> ${escapeHtml(c.value)} <span class="mk-facet__count">${c.count}</span></label>\n`;
    }
    h += '  </fieldset>\n';
  }

  // In stock
  const inStockChecked = q.inStock ? ' checked' : '';
  h += `  <label class="mk-facet__opt mk-facet__instock"><input type="checkbox" name="inStock" value="1"${inStockChecked} /> ${escapeHtml(mt(locale, 'inStock'))} <span class="mk-facet__count">${facets.inStockCount}</span></label>\n`;

  h += `  <div class="mk-facet__actions"><button type="submit" class="mk-btn">${escapeHtml(mt(locale, 'apply'))}</button> <a class="mk-btn mk-btn--ghost" href="/market/search">${escapeHtml(mt(locale, 'clear'))}</a></div>\n`;
  h += '</aside>\n';
  return h;
}

export function renderSearchPage(args: {
  items: ProductRow[];
  facets: Facets;
  total: number;
  locale: string;
  query: SearchQuery;
}): string {
  const { items, facets, total, locale, query } = args;
  const ph = escapeHtml(mt(locale, 'searchPlaceholder'));

  let html = '<div class="mk mk--search">\n';
  html += '<form class="mk-searchwrap" action="/market/search" method="get" role="search">\n';

  // Top search bar
  html += '  <div class="mk-top">\n';
  html += `    <a class="mk-logo" href="/market">${escapeHtml(mt(locale, 'marketTitle'))}</a>\n`;
  html += `    <input type="search" name="q" class="mk-searchbar__input" placeholder="${ph}" aria-label="${ph}" value="${escapeAttr(query.q ?? '')}" />\n`;
  html += `    <button type="button" class="mk-filter-toggle" data-mk-filter-toggle aria-expanded="false">${escapeHtml(mt(locale, 'filters'))}</button>\n`;
  html += '  </div>\n';

  // Sort + result count bar
  html += '  <div class="mk-resultbar">\n';
  html += `    <span class="mk-resultbar__count">${total} ${escapeHtml(mt(locale, 'results'))}</span>\n`;
  html += `    <label class="mk-sort"><span>${escapeHtml(mt(locale, 'sortLabel'))}</span>\n`;
  html += '      <select name="sort" onchange="this.form.submit()">\n';
  html += '        ' + sortOption('new', mt(locale, 'sortNew'), query.sort) + '\n';
  html += '        ' + sortOption('price_asc', mt(locale, 'sortPriceAsc'), query.sort) + '\n';
  html += '        ' + sortOption('price_desc', mt(locale, 'sortPriceDesc'), query.sort) + '\n';
  html += '      </select>\n    </label>\n';
  html += '  </div>\n';

  // Body: facets + results
  html += '  <div class="mk-search-body">\n';
  html += renderFacets(facets, query, locale);

  html += '    <section class="mk-results">\n';
  if (items.length === 0) {
    html += `      <p class="mk-no-results">${escapeHtml(mt(locale, 'noResults'))}</p>\n`;
  } else {
    html += '      <div class="mk-grid">\n';
    for (const p of items) html += renderProductCard(p, locale);
    html += '      </div>\n';
  }
  html += '    </section>\n';
  html += '  </div>\n'; // mk-search-body

  html += '</form>\n';
  html += renderMarketFooter(locale);
  html += '</div>\n';
  return html;
}

export function renderStoresPage(args: { stores: StoreRow[]; total: number; locale: string }): string {
  const { stores, locale } = args;
  let html = '<div class="mk">\n';
  html += '<header class="mk-top">\n';
  html += `  <a class="mk-logo" href="/market">${escapeHtml(mt(locale, 'marketTitle'))}</a>\n`;
  html += '</header>\n';
  html += '<section class="mk-section">\n';
  html += `  <h1 class="mk-section__title">${escapeHtml(mt(locale, 'stores'))}</h1>\n`;
  html += renderStoreStrip(stores, locale);
  html += '</section>\n';
  html += renderMarketFooter(locale);
  html += '</div>\n';
  return html;
}

export function renderCategoryPage(args: { categoryId: string; items: ProductRow[]; total: number; locale: string }): string {
  const { categoryId, items, locale } = args;
  let html = '<div class="mk">\n';
  html += '<header class="mk-top">\n';
  html += `  <a class="mk-logo" href="/market">${escapeHtml(mt(locale, 'marketTitle'))}</a>\n`;
  html += renderSearchBar(locale);
  html += '</header>\n';
  html += '<section class="mk-section">\n';
  html += `  <h1 class="mk-section__title">${escapeHtml(categoryId)}</h1>\n`;
  if (items.length === 0) {
    html += `  <p class="mk-no-results">${escapeHtml(mt(locale, 'noResults'))}</p>\n`;
  } else {
    html += '  <div class="mk-grid">\n';
    for (const p of items) html += renderProductCard(p, locale);
    html += '  </div>\n';
  }
  html += '</section>\n';
  html += renderMarketFooter(locale);
  html += '</div>\n';
  return html;
}

/** ItemList JSON-LD for a product listing page. Returns a JSON string (NOT escaped). */
export function buildItemListJsonLd(items: ProductRow[], origin: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: origin + p.product_path,
      name: p.title,
    })),
  });
}

/** ItemList JSON-LD for the store directory. */
export function buildStoreDirectoryJsonLd(stores: StoreRow[], origin: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: stores.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${origin}/store/${s.slug}`,
      name: s.name,
    })),
  });
}

// Keep renderTrustBadge referenced (used by older surfaces / future slots).
export { renderTrustBadge };
