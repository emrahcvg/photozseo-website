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

import { escapeHtml, LANG_NAMES } from './render';
import { mt, MK_LOCALES } from './marketplace-i18n';

// ── P1 contract mirror (render-layer view) ────────────────────────────────────
export interface ProductRow {
  id: string;
  store_slug: string;
  store_name?: string;
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

function renderLangSwitcher(locale: string): string {
  const label = escapeHtml(mt(locale, 'language'));
  let html = `<label class="mk-lang-label" aria-label="${label}">\n`;
  html += `  <select class="mk-select" data-mk-lang aria-label="${label}">\n`;
  for (const l of MK_LOCALES) {
    const sel = l === locale ? ' selected' : '';
    const name = LANG_NAMES[l] ?? l;
    html += `    <option value="${escapeAttr(l)}"${sel}>${escapeHtml(name)}</option>\n`;
  }
  html += '  </select>\n</label>\n';
  return html;
}

/** A marketplace product card linking to its store product page. */
export function renderProductCard(p: ProductRow, locale: string): string {
  const title = escapeHtml(p.title);
  const price = mkFormatPrice(p.price, p.currency, locale);
  const stock = p.stock;
  const soldOut = stock === 0;
  const lowStock = stock != null && stock > 0 && stock <= 5;
  const inStock = stock != null && stock > 5;
  const href = escapeAttr(p.product_path);
  const sellerName = p.store_name ?? p.store_slug.replace(/-/g, ' ');

  let html = `<a class="mk-card-link" href="${href}">\n`;
  html += '  <article class="mk-card">\n';
  html += '    <div class="mk-card__media">\n';
  if (p.image_url) {
    html += `      <img src="${escapeAttr(p.image_url)}" alt="${title}" loading="lazy" decoding="async" width="600" height="600" />\n`;
  } else {
    html += '      <div class="mk-card__media-empty" aria-hidden="true">📷</div>\n';
  }
  if (soldOut) {
    html += `      <span class="mk-card__badge mk-card__badge--out">${escapeHtml(mt(locale, 'soldOut'))}</span>\n`;
  } else if (lowStock) {
    html += `      <span class="mk-card__badge mk-card__badge--low">Only ${stock} left!</span>\n`;
  } else if (inStock) {
    html += `      <span class="mk-card__badge mk-card__badge--in">In Stock</span>\n`;
  }
  html += '    </div>\n';
  html += '    <div class="mk-card__body">\n';
  html += `      <h3 class="mk-card__title">${title}</h3>\n`;
  if (price) {
    html += `      <span class="mk-card__price" data-mk-amount="${p.price ?? ''}" data-mk-currency="${escapeAttr(p.currency)}" data-mk-orig="${escapeHtml(price)}">${escapeHtml(price)}</span>\n`;
  } else {
    html += `      <span class="mk-card__price mk-card__price--contact">${escapeHtml(mt(locale, 'contactForPrice'))}</span>\n`;
  }
  html += `      <div class="mk-card__seller"><span class="mk-card__seller-name">${escapeHtml(sellerName)}</span></div>\n`;
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
    `  <button type="submit" class="mk-searchbar__btn" aria-label="${ph}">&#x1F50D;</button>\n` +
    '</form>\n'
  );
}

function renderTrustBadge(locale: string): string {
  return `<p class="mk-trust">${escapeHtml(mt(locale, 'trustBadge'))}</p>\n`;
}

/** Footer: trust badge + brand link + report link. */
export function renderMarketFooter(locale: string): string {
  const reportHref = `mailto:support@photozseo.com?subject=${encodeURIComponent('Report marketplace listing')}`;
  let html = '<footer class="mk-footer">\n';
  html += `  <p class="mk-footer__trust">${escapeHtml(mt(locale, 'trustBadge'))}</p>\n`;
  html += '  <div class="mk-footer__links">\n';
  html += '    <a class="mk-footer__brand" href="https://photozseo.com" target="_blank" rel="noopener noreferrer">photoZseo</a>\n';
  html += '    <span class="mk-footer__sep">·</span>\n';
  html += `    <a class="mk-footer__report" href="${escapeAttr(reportHref)}">${escapeHtml(mt(locale, 'report'))}</a>\n`;
  html += '  </div>\n';
  html += '</footer>\n';
  return html;
}

function renderBottomTabBar(locale: string): string {
  return (
    '<nav class="mk-tab-bar" aria-label="Navigation">\n' +
    `  <a class="mk-tab-bar__item mk-tab-bar__item--active" href="/market">\n` +
    '    <span class="mk-tab-bar__icon">🔍</span>\n' +
    `    <span class="mk-tab-bar__label">${escapeHtml(mt(locale, 'discover') || 'Discover')}</span>\n` +
    '  </a>\n' +
    '  <a class="mk-tab-bar__item" href="/market/stores">\n' +
    '    <span class="mk-tab-bar__icon">🏪</span>\n' +
    `    <span class="mk-tab-bar__label">${escapeHtml(mt(locale, 'stores'))}</span>\n` +
    '  </a>\n' +
    '  <a class="mk-tab-bar__item" href="/market/search">\n' +
    '    <span class="mk-tab-bar__icon">📦</span>\n' +
    `    <span class="mk-tab-bar__label">${escapeHtml(mt(locale, 'allCategories'))}</span>\n` +
    '  </a>\n' +
    '</nav>\n'
  );
}

function renderDiscCard(p: ProductRow, locale: string): string {
  const title = escapeHtml(p.title);
  const price = mkFormatPrice(p.price, p.currency, locale);
  let html = `<a class="mk-disc-card" href="${escapeAttr(p.product_path)}">\n`;
  if (p.image_url) {
    html += `  <img class="mk-disc-card__img" src="${escapeAttr(p.image_url)}" alt="${title}" loading="lazy" />\n`;
  } else {
    html += '  <div class="mk-disc-card__img-empty" aria-hidden="true">📷</div>\n';
  }
  html += '  <div class="mk-disc-card__body">\n';
  html += `    <p class="mk-disc-card__title">${title}</p>\n`;
  if (price) html += `    <p class="mk-disc-card__price">${escapeHtml(price)}</p>\n`;
  html += '  </div>\n';
  html += '  <span class="mk-disc-card__btn">View Details</span>\n';
  html += '</a>\n';
  return html;
}

export function renderMarketHome(args: {
  products: ProductRow[];
  stores: StoreRow[];
  categories: { id: string; count: number }[];
  locale: string;
}): string {
  const { products, stores, categories, locale } = args;
  const recommended = products.slice(0, 8);
  const trending = [...products].reverse().slice(0, 6);

  let html = '<div class="mk">\n';

  // Top bar with icon nav
  html += '<header class="mk-top">\n';
  html += `  <a class="mk-logo" href="/market">${escapeHtml(mt(locale, 'marketTitle'))}</a>\n`;
  html += renderLangSwitcher(locale);
  html += '  <a class="mk-top-icon" href="/market/search">\n';
  html += '    <span class="mk-top-icon__glyph">🤖</span>\n';
  html += '    <span><strong>My AI Assistant</strong><span class="mk-top-icon__sub">My AI Assistant</span></span>\n';
  html += '  </a>\n';
  html += '  <a class="mk-top-icon" href="/market">\n';
  html += '    <span class="mk-top-icon__glyph">👤</span>\n';
  html += '    <span><strong>Profile</strong></span>\n';
  html += '  </a>\n';
  html += '</header>\n';

  // Hero search
  html += '<div class="mk-hero">\n';
  html += '  <form class="mk-hero__form" action="/market/search" method="get" role="search">\n';
  html += '    <div class="mk-hero__mic" aria-hidden="true">🎙️</div>\n';
  html += '    <div class="mk-hero__right">\n';
  html += `      <p class="mk-hero__title">What are you looking for?</p>\n`;
  html += `      <input class="mk-hero__input" name="q" type="search" placeholder="Type or speak your request (e.g., 'Find eco-friendly running shoes for hiking')" aria-label="${escapeHtml(mt(locale, 'searchPlaceholder'))}" />\n`;
  html += '    </div>\n';
  html += '  </form>\n';
  html += '</div>\n';

  // Featured slot — reserved
  html += '<section class="mk-featured" hidden></section>\n';

  // 2-col Discovery grid
  html += '<div class="mk-discovery-grid">\n';

  // LEFT: Recommended for You + Trending in Your Area
  html += '  <div class="mk-discovery-col">\n';

  if (recommended.length) {
    html += '    <section class="mk-discovery">\n';
    html += '      <p class="mk-section__label">Discovery Flow</p>\n';
    html += '      <h2 class="mk-section__title">Recommended for You</h2>\n';
    html += '      <div class="mk-discovery-scroll">\n';
    for (const p of recommended) html += renderDiscCard(p, locale);
    html += '      </div>\n    </section>\n';
  }

  if (trending.length) {
    html += '    <section class="mk-discovery">\n';
    html += '      <p class="mk-section__label">Discovery Flow</p>\n';
    html += '      <h2 class="mk-section__title">Trending in Your Area</h2>\n';
    html += '      <div class="mk-trending-scroll">\n';
    for (const p of trending) {
      if (p.image_url) {
        html += `        <a class="mk-trending-item" href="${escapeAttr(p.product_path)}">\n`;
        html += `          <img src="${escapeAttr(p.image_url)}" alt="${escapeHtml(p.title)}" loading="lazy" />\n`;
        html += '        </a>\n';
      }
    }
    html += '      </div>\n    </section>\n';
  }

  html += '  </div>\n'; // discovery-col left

  // RIGHT: Curated Collections (tall portrait cards)
  if (categories.length) {
    html += '  <div class="mk-discovery-col">\n';
    html += '    <section class="mk-discovery">\n';
    html += '      <p class="mk-section__label">Discovery Flow</p>\n';
    html += '      <h2 class="mk-section__title">Curated Collections</h2>\n';
    html += '      <div class="mk-collection-scroll">\n';
    for (const c of categories.slice(0, 4)) {
      const catProduct = products.find((p) => p.category_id === c.id);
      const href = `/market/c/${encodeURIComponent(c.id)}`;
      html += `      <a class="mk-collection-card" href="${escapeAttr(href)}">\n`;
      if (catProduct?.image_url) {
        html += `        <img src="${escapeAttr(catProduct.image_url)}" alt="${escapeHtml(c.id)}" loading="lazy" />\n`;
      } else {
        html += '        <div class="mk-collection-card__empty"></div>\n';
      }
      html += '        <div class="mk-collection-card__overlay">\n';
      html += `          <span class="mk-collection-card__name">${escapeHtml(c.id)}</span>\n`;
      html += '        </div>\n      </a>\n';
    }
    html += '      </div>\n    </section>\n  </div>\n';
  }

  html += '</div>\n'; // discovery-grid

  // All products grid
  if (products.length) {
    html += '<section class="mk-section">\n';
    html += `  <h2 class="mk-section__title">${escapeHtml(mt(locale, 'allCategories'))}</h2>\n`;
    html += '  <div class="mk-grid">\n';
    for (const p of products) html += renderProductCard(p, locale);
    html += '  </div>\n</section>\n';
  }

  // Stores strip
  if (stores.length) {
    html += '<section class="mk-section">\n';
    html += `  <h2 class="mk-section__title">${escapeHtml(mt(locale, 'stores'))}</h2>\n`;
    html += renderStoreStrip(stores, locale);
    html += '</section>\n';
  }

  html += renderMarketFooter(locale);
  html += '</div>\n';
  html += renderBottomTabBar(locale);
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

function renderSortChips(current: string | undefined, locale: string): string {
  const active = current ?? 'new';
  const options = [
    { value: 'new', label: mt(locale, 'sortNew') },
    { value: 'price_asc', label: mt(locale, 'sortPriceAsc') },
    { value: 'price_desc', label: mt(locale, 'sortPriceDesc') },
  ];
  let html = '<div class="mk-sort-chips" role="group">\n';
  for (const o of options) {
    const cls = o.value === active ? ' mk-sort-chip--active' : '';
    html += `  <button type="submit" name="sort" value="${escapeAttr(o.value)}" class="mk-sort-chip${cls}">${escapeHtml(o.label)}</button>\n`;
  }
  html += '</div>\n';
  return html;
}

function renderFacets(facets: Facets, q: SearchQuery, locale: string): string {
  let h = '<aside class="mk-facets" data-mk-facets>\n';
  h += '  <div class="mk-facets-handle" aria-hidden="true"></div>\n';

  // Categories
  if (facets.categories.length) {
    h += `  <fieldset class="mk-facet"><legend>${escapeHtml(mt(locale, 'categories'))}</legend>\n`;
    for (const c of facets.categories) {
      const checked = q.categoryId === c.id ? ' checked' : '';
      h += `    <label class="mk-facet__opt"><input type="radio" name="categoryId" value="${escapeAttr(c.id)}"${checked} /> ${escapeHtml(c.id)} <span class="mk-facet__count">${c.count}</span></label>\n`;
    }
    h += '  </fieldset>\n';
  }

  // Price range — styled dual inputs
  h += `  <fieldset class="mk-facet"><legend>${escapeHtml(mt(locale, 'price'))}</legend>\n`;
  h += '    <div class="mk-price-range">\n';
  h += `      <input class="mk-price-input" type="number" name="minPrice" inputmode="decimal" placeholder="${escapeHtml(mt(locale, 'min'))} $0" value="${q.minPrice != null ? q.minPrice : ''}" />\n`;
  h += `      <input class="mk-price-input" type="number" name="maxPrice" inputmode="decimal" placeholder="${escapeHtml(mt(locale, 'max'))} $${facets.priceRange.max || 1000}" value="${q.maxPrice != null ? q.maxPrice : ''}" />\n`;
  h += '    </div>\n';
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

  // In-stock toggle
  const inStockChecked = q.inStock ? ' checked' : '';
  h += '  <div class="mk-toggle-row">\n';
  h += `    <span class="mk-toggle-label">${escapeHtml(mt(locale, 'inStock'))} <span class="mk-facet__count">(${facets.inStockCount})</span></span>\n`;
  h += `    <label class="mk-toggle"><input type="checkbox" name="inStock" value="1"${inStockChecked} /><span class="mk-toggle__track"></span><span class="mk-toggle__thumb"></span></label>\n`;
  h += '  </div>\n';

  h += `  <div class="mk-facet__actions"><button type="submit" class="mk-btn-apply">${escapeHtml(mt(locale, 'apply'))}</button> <a class="mk-btn mk-btn--ghost" href="/market/search">${escapeHtml(mt(locale, 'clear'))}</a></div>\n`;
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

  // Sort chips + result count
  html += '  <div class="mk-resultbar">\n';
  html += `    <span class="mk-resultbar__count">${total} ${escapeHtml(mt(locale, 'results'))}</span>\n`;
  html += renderLangSwitcher(locale);
  html += '  </div>\n';
  html += renderSortChips(query.sort, locale);

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
  html += renderBottomTabBar(locale);
  return html;
}

export function renderStoresPage(args: { stores: StoreRow[]; total: number; locale: string }): string {
  const { stores, locale } = args;
  let html = '<div class="mk">\n';
  html += '<header class="mk-top">\n';
  html += `  <a class="mk-logo" href="/market">${escapeHtml(mt(locale, 'marketTitle'))}</a>\n`;
  html += renderLangSwitcher(locale);
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
  html += renderLangSwitcher(locale);
  html += '</header>\n';
  html += `<nav class="mk-breadcrumb" aria-label="breadcrumb"><a href="/market">${escapeHtml(mt(locale, 'marketTitle'))}</a> › <span>${escapeHtml(categoryId)}</span></nav>\n`;
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
