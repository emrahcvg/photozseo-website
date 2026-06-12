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
import type { BreadcrumbSegment } from './taxonomy/category-resolve';
import { renderAppHeader, renderAppFooter, renderEmptyState } from './app-shell';
import { idToSlug } from './taxonomy/slug-resolve';

/** Router'dan inject edilen label çözücü (svc.label sarmalı). */
export type LabelOf = (id: string, locale: string) => string;

/** Varsayılan: id'yi insanileştir (tire→boşluk + Title Case) — ham slug sızdırma. */
const identityLabel: LabelOf = (id) =>
  id
    .split('-')
    .map((w) => (w ? w.charAt(0).toLocaleUpperCase() + w.slice(1) : w))
    .join(' ');

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

// ── Inline SVG icon set (currentColor stroke, app-header dili) ────────────────
// Static markup only — no dynamic values inside.

type MkIconName = 'search' | 'sliders' | 'store' | 'heart' | 'cart' | 'photo';

const MK_ICON_PATHS: Record<MkIconName, string> = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/>',
  sliders:
    '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>' +
    '<line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>' +
    '<line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>' +
    '<line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  store:
    '<path d="m3 9 1.7-5.1A1.3 1.3 0 0 1 5.9 3h12.2a1.3 1.3 0 0 1 1.2.9L21 9"/>' +
    '<path d="M4 9v10.7c0 .7.6 1.3 1.3 1.3h13.4c.7 0 1.3-.6 1.3-1.3V9"/>' +
    '<path d="M3 9h18"/><path d="M9 21v-6h6v6"/>',
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
  cart:
    '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
    '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  photo:
    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
};

function mkIcon(name: MkIconName, small = false): string {
  const cls = small ? 'mk-icon mk-icon--sm' : 'mk-icon';
  return (
    `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ` +
    'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    MK_ICON_PATHS[name] +
    '</svg>'
  );
}

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

/** A marketplace product card linking to its store product page.
 * `opts.eager` — LCP adayı kartlar için loading="eager" + fetchpriority="high" (geri uyumlu). */
export function renderProductCard(p: ProductRow, locale: string, opts?: { eager?: boolean }): string {
  const title = escapeHtml(p.title);
  const price = mkFormatPrice(p.price, p.currency, locale);
  const soldOut = p.stock === 0;
  const href = escapeAttr(p.product_path);
  const sellerName = p.store_name ?? p.store_slug.replace(/-/g, ' ');
  const loadAttrs = opts?.eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';

  let html = `<a class="mk-card-link" href="${href}">\n`;
  html += '  <article class="mk-card">\n';
  html += '    <div class="mk-card__media">\n';
  if (p.image_url) {
    html += `      <img src="${escapeAttr(p.image_url)}" alt="${title}" ${loadAttrs} decoding="async" width="600" height="600" />\n`;
  } else {
    html += `      <div class="mk-card__media-empty" aria-hidden="true">${mkIcon('photo')}</div>\n`;
  }
  if (soldOut) {
    html += `      <span class="mk-card__badge mk-card__badge--out">${escapeHtml(mt(locale, 'soldOut'))}</span>\n`;
  }
  html += '    </div>\n';
  html += '    <div class="mk-card__body">\n';
  html += `      <h3 class="mk-card__title">${title}</h3>\n`;
  if (price) {
    html += `      <span class="mk-card__price" data-mk-amount="${p.price != null ? p.price.toFixed(2) : ''}" data-mk-currency="${escapeAttr(p.currency)}" data-mk-orig="${escapeHtml(price)}">${escapeHtml(price)}</span>\n`;
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
  labelOf: LabelOf = identityLabel,
): string {
  let html = `<nav class="mk-chips" aria-label="${escapeHtml(mt(locale, 'categories'))}">\n`;
  html += `  <a class="mk-chip mk-chip--all" href="/market/search">${escapeHtml(mt(locale, 'allCategories'))}</a>\n`;
  for (const c of categories) {
    if (c.count === 0) continue; // hayalet kasaba: ürünsüz kategori chip'i basılmaz
    const href = `/market/c/${idToSlug(c.id)}`;
    const name = escapeHtml(labelOf(c.id, locale));
    html += `  <a class="mk-chip" href="${escapeAttr(href)}">${name} <span class="mk-chip__count">${c.count}</span></a>\n`;
  }
  html += '</nav>\n';
  return html;
}

/** Tek mağaza kartı — harf avatar + ad + konum (emoji yok). */
function renderStoreItem(s: StoreRow): string {
  const loc = [s.city, s.country].filter(Boolean).join(', ');
  const initial = (s.name.trim().charAt(0) || '?').toLocaleUpperCase();
  let html = `  <a class="mk-store" role="listitem" href="/store/${escapeAttr(encodeURIComponent(s.slug))}">\n`;
  html += `    <span class="mk-store__avatar" aria-hidden="true">${escapeHtml(initial)}</span>\n`;
  html += `    <span class="mk-store__name">${escapeHtml(s.name)}</span>\n`;
  if (loc) html += `    <span class="mk-store__loc">${escapeHtml(loc)}</span>\n`;
  html += '  </a>\n';
  return html;
}

/** Horizontal store directory strip. Each item → existing /store/<slug>. */
export function renderStoreStrip(stores: StoreRow[], locale: string): string {
  let html = `<div class="mk-stores" role="list" aria-label="${escapeHtml(mt(locale, 'stores'))}">\n`;
  for (const s of stores) html += renderStoreItem(s);
  html += '</div>\n';
  return html;
}

/** Stores sayfası grid varyantı (1→3 kolon dikey liste kartları). */
function renderStoreGrid(stores: StoreRow[], locale: string): string {
  let html = `<div class="mk-stores mk-stores--grid" role="list" aria-label="${escapeHtml(mt(locale, 'stores'))}">\n`;
  for (const s of stores) html += renderStoreItem(s);
  html += '</div>\n';
  return html;
}

function renderSearchBar(locale: string): string {
  const ph = escapeHtml(mt(locale, 'searchPlaceholder'));
  return (
    '<form class="mk-searchbar" action="/market/search" method="get" role="search">\n' +
    `  <input type="search" name="q" class="mk-searchbar__input" placeholder="${ph}" aria-label="${ph}" list="mk-suggest" autocomplete="off" data-mk-suggest />\n` +
    '  <datalist id="mk-suggest"></datalist>\n' +
    `  <button type="submit" class="mk-searchbar__btn" aria-label="${ph}">${mkIcon('search', true)}</button>\n` +
    '</form>\n'
  );
}

function renderTrustBadge(locale: string): string {
  return `<p class="mk-trust">${escapeHtml(mt(locale, 'trustBadge'))}</p>\n`;
}

/** Footer: ortak app-shell footer'ı (güven rozeti + marka + şikâyet). */
export function renderMarketFooter(locale: string): string {
  const reportHref = `mailto:support@photozseo.com?subject=${encodeURIComponent('Report marketplace listing')}`;
  return renderAppFooter({ locale, reportHref, reportLabelKey: 'report' });
}

type MkTabId = 'discover' | 'stores' | 'favorites' | 'cart' | 'none';

function renderBottomTabBar(locale: string, active: MkTabId = 'discover'): string {
  const tabs: { id: MkTabId; href: string; icon: MkIconName; label: string }[] = [
    { id: 'discover', href: '/market', icon: 'search', label: mt(locale, 'discover') },
    { id: 'stores', href: '/market/stores', icon: 'store', label: mt(locale, 'stores') },
    { id: 'favorites', href: '/market/favorites', icon: 'heart', label: mt(locale, 'myFavorites') },
    { id: 'cart', href: '/market/cart', icon: 'cart', label: mt(locale, 'myCart') },
  ];
  let html = `<nav class="mk-tab-bar" aria-label="${escapeHtml(mt(locale, 'marketTitle'))}">\n`;
  for (const t of tabs) {
    const cls = t.id === active ? 'mk-tab-bar__item mk-tab-bar__item--active' : 'mk-tab-bar__item';
    const current = t.id === active ? ' aria-current="page"' : '';
    html += `  <a class="${cls}" href="${escapeAttr(t.href)}"${current}>\n`;
    html += `    <span class="mk-tab-bar__icon">${mkIcon(t.icon)}</span>\n`;
    html += `    <span class="mk-tab-bar__label">${escapeHtml(t.label)}</span>\n`;
    html += '  </a>\n';
  }
  html += '</nav>\n';
  return html;
}

/** Amazon tarzı sol menü ağacı düğümü — 2 seviye (L1 + L2). */
export interface CategoryTreeNode {
  id: string;
  label: string;
  children: CategoryTreeNode[];
}

/**
 * Amazon tarzı sol kategori menüsü.
 * - Alt kategorisi olan L1 → <details> accordion (ilk link = "All <label>")
 * - Alt kategorisi olmayan L1 → düz <a>
 * Tüm etiketler escapeHtml'd, href'ler encodeURIComponent + escapeAttr ile güvenli.
 */
export function renderCategorySidebar(tree: CategoryTreeNode[], locale: string): string {
  const heading = escapeHtml(mt(locale, 'categories'));
  let html = `<aside class="mk-sidebar" aria-label="${heading}">\n`;
  // Dış details: server-side `open` — masaüstünde açık gelir; mobilde JS kapatır
  // (CSS ::details-content hilesine bağımlılık yok).
  html += '  <details class="mk-sidebar__all" open>\n';
  html += `    <summary class="mk-sidebar__heading">${heading}<span class="mk-sidebar__all-chevron" aria-hidden="true">▾</span></summary>\n`;
  html += '  <nav class="mk-sidebar__nav">\n';

  for (const node of tree) {
    const safeLabel = escapeHtml(node.label);
    if (node.children.length > 0) {
      const topHref = escapeAttr(`/market/c/${idToSlug(node.id)}`);
      html += '    <details class="mk-sidebar__group">\n';
      html += `      <summary class="mk-sidebar__summary">${safeLabel}<span class="mk-sidebar__chevron" aria-hidden="true">▸</span></summary>\n`;
      html += '      <ul class="mk-sidebar__list">\n';
      // "All <label>" bağlantısı — L1 kategorisinin kendisi
      const allLabel = escapeHtml(mt(locale, 'allCategories') + ' ' + node.label);
      html += `        <li class="mk-sidebar__item mk-sidebar__item--all"><a class="mk-sidebar__link" href="${topHref}">${allLabel}</a></li>\n`;
      for (const child of node.children) {
        const childHref = escapeAttr(`/market/c/${idToSlug(child.id)}`);
        html += `        <li class="mk-sidebar__item"><a class="mk-sidebar__link" href="${childHref}">${escapeHtml(child.label)}</a></li>\n`;
      }
      html += '      </ul>\n';
      html += '    </details>\n';
    } else {
      const href = escapeAttr(`/market/c/${idToSlug(node.id)}`);
      html += `    <a class="mk-sidebar__link mk-sidebar__link--top" href="${href}">${safeLabel}</a>\n`;
    }
  }

  html += '  </nav>\n';
  html += '  </details>\n';
  html += '</aside>\n';
  return html;
}

/** Kategori görsel kartı rayı — kare foto + altında ad (overlay yok).
 * Sadece görseli bulunabilen (ürünü eşleşen) kategoriler basılır; hiç yoksa ray atlanır. */
function renderCategoryRail(
  categories: { id: string; count: number }[],
  products: ProductRow[],
  locale: string,
  labelOf: LabelOf,
): string {
  const cards: { id: string; image: string }[] = [];
  for (const c of categories) {
    if (cards.length >= 6) break;
    const catProduct = products.find((p) => p.category_id === c.id && p.image_url);
    if (!catProduct) continue;
    cards.push({ id: c.id, image: catProduct.image_url });
  }
  if (cards.length === 0) return '';

  let html = '<section class="mk-section">\n';
  html += `  <h2 class="mk-section__title">${escapeHtml(mt(locale, 'categories'))}</h2>\n`;
  html += '  <div class="mk-rail">\n';
  for (const c of cards) {
    const href = escapeAttr(`/market/c/${idToSlug(c.id)}`);
    const cLabel = escapeHtml(labelOf(c.id, locale));
    html += `    <a class="mk-cat-card" href="${href}">\n`;
    html += `      <img class="mk-cat-card__img" src="${escapeAttr(c.image)}" alt="${cLabel}" loading="lazy" decoding="async" />\n`;
    html += `      <span class="mk-cat-card__name">${cLabel}</span>\n`;
    html += '    </a>\n';
  }
  html += '  </div>\n';
  html += '</section>\n';
  return html;
}

export function renderMarketHome(args: {
  products: ProductRow[];
  stores: StoreRow[];
  categories: { id: string; count: number }[];
  locale: string;
  labelOf?: LabelOf;
  categoryTree?: CategoryTreeNode[];
}): string {
  const { products, stores, categories, locale } = args;
  const labelOf = args.labelOf ?? identityLabel;
  // Featured: stoklu (sold-out olmayan) ürünlerden ilk 8 — yalnızca toplam ürün > 8 ise.
  // Toplam ≤8 iken tek grid yeterli (dublikasyon yok); sold-out ürünler grid'de kalır.
  const showFeatured = products.length > 8;
  const featured = showFeatured ? products.filter((p) => p.stock !== 0).slice(0, 8) : [];
  const featuredIds = new Set(featured.map((p) => p.id));
  const gridProducts = featured.length ? products.filter((p) => !featuredIds.has(p.id)) : products;
  const hasSidebar = Array.isArray(args.categoryTree) && args.categoryTree.length > 0;

  // Ortak sticky üst header (app-shell) — store ile birebir aynı kabuk.
  let html = renderAppHeader({ locale, controlsHtml: renderLangSwitcher(locale) });
  html += '<div class="mk">\n';

  // Sidebar varsa: .mk-layout açılır; yoksa içerik doğrudan devam eder (geri uyumlu)
  // İçerik gövdesi <main> landmark'ı — sayfada tek main (header/footer/tab-bar main dışında).
  if (hasSidebar) {
    html += '<div class="mk-layout">\n';
    html += renderCategorySidebar(args.categoryTree!, locale);
    html += '<main class="mk-main">\n';
  }

  // Hero: büyük başlık + sakin değer önerisi alt başlığı + tek geniş arama alanı
  const ph = escapeHtml(mt(locale, 'searchPlaceholder'));
  html += '<div class="mk-hero">\n';
  html += `  <h1 class="mk-hero__title">${escapeHtml(mt(locale, 'marketTitle'))}</h1>\n`;
  html += `  <p class="mk-hero__sub">${escapeHtml(mt(locale, 'trustBadge'))}</p>\n`;
  html += '  <form class="mk-hero__form" action="/market/search" method="get" role="search">\n';
  html += `    <input class="mk-hero__input" name="q" type="search" placeholder="${ph}" aria-label="${ph}" list="mk-suggest" autocomplete="off" data-mk-suggest />\n`;
  html += '    <datalist id="mk-suggest"></datalist>\n';
  html += `    <button type="submit" class="mk-hero__btn" aria-label="${ph}">${mkIcon('search')}</button>\n`;
  html += '  </form>\n';
  html += '</div>\n';

  // Kategori chip satırı — taksonomi üst kategorileri, ürün olmasa da her zaman görünür.
  if (categories.length) {
    html += renderCategoryChips(categories, locale, labelOf);
  }

  // Hiç ürün yoksa: çirkin boşluk yerine şık boş durum + mağazalara yönlendir.
  if (products.length === 0) {
    html += renderEmptyState({ icon: mkIcon('photo'), title: mt(locale, 'noResults'), ctaHref: '/market/stores', ctaLabel: mt(locale, 'stores') });
  }

  // Featured rayı — standart ürün kartı, yatay snap scroll.
  // LCP: ilk rayın ilk 4 görseli eager + fetchpriority=high.
  if (featured.length) {
    html += '<section class="mk-section">\n';
    html += `  <h2 class="mk-section__title">${escapeHtml(mt(locale, 'featured'))}</h2>\n`;
    html += '  <div class="mk-rail">\n';
    featured.forEach((p, i) => { html += renderProductCard(p, locale, { eager: i < 4 }); });
    html += '  </div>\n';
    html += '</section>\n';
  }

  // Kategori rayı — kare foto kartlar
  if (categories.length) {
    html += renderCategoryRail(categories, products, locale, labelOf);
  }

  // Products grid — featured'a girenler tekrar basılmaz (kalanlardan devam).
  if (gridProducts.length) {
    html += '<section class="mk-section">\n';
    html += `  <h2 class="mk-section__title">${escapeHtml(mt(locale, 'newProducts'))}</h2>\n`;
    html += '  <div class="mk-grid">\n';
    gridProducts.forEach((p, i) => { html += renderProductCard(p, locale, { eager: featured.length === 0 && i < 4 }); });
    html += '  </div>\n</section>\n';
  }

  // Stores strip
  if (stores.length) {
    html += '<section class="mk-section">\n';
    html += `  <h2 class="mk-section__title">${escapeHtml(mt(locale, 'stores'))}</h2>\n`;
    html += renderStoreStrip(stores, locale);
    html += '</section>\n';
  }

  // Sidebar layout kapatma
  if (hasSidebar) {
    html += '</main>\n'; // .mk-main
    html += '</div>\n'; // .mk-layout
  }

  html += renderMarketFooter(locale);
  html += '</div>\n';
  html += renderBottomTabBar(locale, 'discover');
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

function renderSortChips(current: string | undefined, locale: string): string {
  const active = current ?? 'new';
  const options = [
    { value: 'new', label: mt(locale, 'sortNew') },
    { value: 'price_asc', label: mt(locale, 'sortPriceAsc') },
    { value: 'price_desc', label: mt(locale, 'sortPriceDesc') },
  ];
  let html = `<div class="mk-sort-chips" role="group" aria-label="${escapeHtml(mt(locale, 'sortLabel'))}">\n`;
  for (const o of options) {
    const cls = o.value === active ? ' mk-sort-chip--active' : '';
    html += `  <button type="submit" name="sort" value="${escapeAttr(o.value)}" class="mk-sort-chip${cls}">${escapeHtml(o.label)}</button>\n`;
  }
  html += '</div>\n';
  return html;
}

function renderFacets(facets: Facets, q: SearchQuery, locale: string, labelOf: LabelOf = identityLabel): string {
  let h = `<aside class="mk-facets" id="mk-facets-panel" data-mk-facets aria-label="${escapeHtml(mt(locale, 'filters'))}">\n`;
  h += '  <div class="mk-facets-handle" aria-hidden="true"></div>\n';

  // Categories
  if (facets.categories.length) {
    h += `  <fieldset class="mk-facet"><legend>${escapeHtml(mt(locale, 'categories'))}</legend>\n`;
    for (const c of facets.categories) {
      const checked = q.categoryId === c.id ? ' checked' : '';
      h += `    <label class="mk-facet__opt"><input type="radio" name="categoryId" value="${escapeAttr(c.id)}"${checked} /> ${escapeHtml(labelOf(c.id, locale))} <span class="mk-facet__count">${c.count}</span></label>\n`;
    }
    h += '  </fieldset>\n';
  }

  // Price range — styled dual inputs
  const minLabel = escapeHtml(mt(locale, 'min'));
  const maxLabel = escapeHtml(mt(locale, 'max'));
  h += `  <fieldset class="mk-facet"><legend>${escapeHtml(mt(locale, 'price'))}</legend>\n`;
  h += '    <div class="mk-price-range">\n';
  h += `      <input class="mk-price-input" type="number" name="minPrice" inputmode="decimal" placeholder="${minLabel}" aria-label="${minLabel}" value="${q.minPrice != null ? q.minPrice : ''}" />\n`;
  h += `      <input class="mk-price-input" type="number" name="maxPrice" inputmode="decimal" placeholder="${maxLabel}" aria-label="${maxLabel}" value="${q.maxPrice != null ? q.maxPrice : ''}" />\n`;
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
  h += `    <label class="mk-toggle"><input type="checkbox" name="inStock" value="1"${inStockChecked} aria-label="${escapeHtml(mt(locale, 'inStock'))}" /><span class="mk-toggle__track"></span><span class="mk-toggle__thumb"></span></label>\n`;
  h += '  </div>\n';

  h += `  <div class="mk-facet__actions"><button type="submit" class="mk-btn mk-btn--apply">${escapeHtml(mt(locale, 'apply'))}</button> <a class="mk-btn mk-btn--ghost" href="/market/search">${escapeHtml(mt(locale, 'clear'))}</a></div>\n`;
  h += '</aside>\n';
  return h;
}

export function renderSearchPage(args: {
  items: ProductRow[];
  facets: Facets;
  total: number;
  locale: string;
  query: SearchQuery;
  labelOf?: LabelOf;
}): string {
  const { items, facets, total, locale, query, labelOf } = args;
  const ph = escapeHtml(mt(locale, 'searchPlaceholder'));

  // Ortak sticky üst header (arama formunun dışında, full-bleed)
  let html = renderAppHeader({ locale, controlsHtml: renderLangSwitcher(locale) });
  html += '<div class="mk mk--search">\n';
  // A11y: sayfanın görünür başlığı yok — ekran okuyucular için sr-only H1 (tek h1).
  html += `<h1 class="mk-sr-only">${escapeHtml(mt(locale, 'marketTitle'))}</h1>\n`;
  html += '<form class="mk-searchwrap" action="/market/search" method="get" role="search">\n';

  // Arama satırı (marka artık ortak app-header'da)
  html += '  <div class="mk-searchrow">\n';
  html += `    <input type="search" name="q" class="mk-searchbar__input" placeholder="${ph}" aria-label="${ph}" value="${escapeAttr(query.q ?? '')}" list="mk-suggest" autocomplete="off" data-mk-suggest />\n`;
  html += '    <datalist id="mk-suggest"></datalist>\n';
  html += `    <button type="button" class="mk-filter-toggle" data-mk-filter-toggle aria-expanded="false" aria-controls="mk-facets-panel">${mkIcon('sliders', true)}<span>${escapeHtml(mt(locale, 'filters'))}</span></button>\n`;
  html += '  </div>\n';

  // Sıralama + sonuç sayısı
  html += '  <div class="mk-resultbar">\n';
  html += `    <span class="mk-resultbar__count">${total} ${escapeHtml(mt(locale, 'results'))}</span>\n`;
  html += '  </div>\n';
  html += renderSortChips(query.sort, locale);

  // Body: backdrop + facets + results
  html += '  <div class="mk-search-body">\n';
  html += '  <div class="mk-sheet-backdrop" data-mk-backdrop aria-hidden="true"></div>\n';
  html += renderFacets(facets, query, locale, labelOf);

  html += '    <section class="mk-results">\n';
  if (items.length === 0) {
    html += renderEmptyState({ icon: mkIcon('search'), title: mt(locale, 'noResults'), ctaHref: '/market', ctaLabel: mt(locale, 'browseAll') });
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
  html += renderBottomTabBar(locale, 'discover');
  return html;
}

export function renderStoresPage(args: { stores: StoreRow[]; total: number; locale: string }): string {
  const { stores, locale } = args;
  let html = renderAppHeader({ locale, controlsHtml: renderLangSwitcher(locale) });
  html += '<div class="mk">\n';
  html += '<section class="mk-section">\n';
  html += `  <h1 class="mk-page-title">${escapeHtml(mt(locale, 'stores'))}</h1>\n`;
  html += renderStoreGrid(stores, locale);
  html += '</section>\n';
  html += renderMarketFooter(locale);
  html += '</div>\n';
  html += renderBottomTabBar(locale, 'stores');
  return html;
}

export function renderCategoryPage(args: {
  categoryId: string;
  items: ProductRow[];
  total: number;
  locale: string;
  breadcrumb?: BreadcrumbSegment[] | null;
}): string {
  const { categoryId, items, locale, breadcrumb } = args;
  const segments = breadcrumb ?? null;
  const h1 = segments && segments.length ? segments[segments.length - 1].label : categoryId;
  const sep = ' <span class="mk-breadcrumb__sep" aria-hidden="true">›</span> ';

  let html = renderAppHeader({ locale, controlsHtml: renderLangSwitcher(locale) });
  html += '<div class="mk">\n';
  html += `<div class="mk-searchrow mk-searchrow--cat">${renderSearchBar(locale)}</div>\n`;

  html += `<nav class="mk-breadcrumb" aria-label="breadcrumb"><a href="/market">${escapeHtml(mt(locale, 'marketTitle'))}</a>`;
  if (segments && segments.length) {
    segments.forEach((seg, i) => {
      const last = i === segments.length - 1;
      if (last) {
        html += `${sep}<span>${escapeHtml(seg.label)}</span>`;
      } else {
        html += `${sep}<a href="/market/c/${idToSlug(seg.id)}">${escapeHtml(seg.label)}</a>`;
      }
    });
  } else {
    html += `${sep}<span>${escapeHtml(categoryId)}</span>`;
  }
  html += '</nav>\n';

  html += '<section class="mk-section">\n';
  html += `  <h1 class="mk-page-title">${escapeHtml(h1)}</h1>\n`;
  if (items.length === 0) {
    html += renderEmptyState({ icon: mkIcon('search'), title: mt(locale, 'noResults'), ctaHref: '/market', ctaLabel: mt(locale, 'browseAll') });
  } else {
    html += '  <div class="mk-grid">\n';
    for (const p of items) html += renderProductCard(p, locale);
    html += '  </div>\n';
  }
  html += '</section>\n';
  html += renderMarketFooter(locale);
  html += '</div>\n';
  html += renderBottomTabBar(locale, 'discover');
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

/** BreadcrumbList JSON-LD — /market/c/<id> segmentlerinden. JSON string (escape edilmemiş). */
export function buildBreadcrumbJsonLd(segments: BreadcrumbSegment[], origin: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: segments.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.label,
      item: `${origin}/market/c/${idToSlug(s.id)}`,
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

// ── Sipariş geçmişi sayfası (/market/orders) ──────────────────────────────────

/** Sipariş kaydı (functions/_lib/orders.ts'ten mirror — döngüsel import önlemek için yerel tanım). */
export interface OrderRow {
  id: string;
  owner_key: string;
  store_slug: string;
  store_name?: string;
  items: { productSlug: string; qty: number; title?: string; price?: number; currency?: string }[];
  item_count: number;
  total?: number;
  currency?: string;
  status: string;
  created_at: string;
}

/** Sipariş durumu rozeti: "sent" → gönderildi vb. */
function renderStatusBadge(status: string, locale: string): string {
  // Basit eşleme; ileride genişletilir (i18n key seti sabit olduğundan ham status gösterilir).
  void locale;
  const label = status === 'sent' ? 'Sent' : status;
  return `<span class="mk-orders__badge mk-orders__badge--${escapeAttr(status)}">${escapeHtml(label)}</span>`;
}

/**
 * /market/orders sayfasını render eder.
 * Giriş yapmış kullanıcı: sipariş listesi. Giriş yapılmamış: "Henüz siparişin yok / Giriş yap" mesajı.
 */
export function renderOrdersPage(args: {
  orders: OrderRow[];
  locale: string;
  loggedIn: boolean;
}): string {
  const { orders, locale, loggedIn } = args;

  // Ortak sticky üst header (hesap menüsünü auth.js doldurur)
  let html = renderAppHeader({ locale, controlsHtml: renderLangSwitcher(locale) });
  html += '<div class="mk">\n';

  // Sayfa başlığı
  html += '<main class="mk-orders">\n';
  html += `  <h1 class="mk-orders__title mk-page-title">${escapeHtml(mt(locale, 'myOrders'))}</h1>\n`;

  if (!loggedIn && orders.length === 0) {
    // Giriş yapılmamış ve sipariş yok → giriş daveti
    const signin = `  <button type="button" class="app-acct__btn" id="pz-signin-btn-orders" aria-label="${escapeHtml(mt(locale, 'signIn'))}">${escapeHtml(mt(locale, 'signIn'))}</button>\n`;
    html += renderEmptyState({ icon: '🧾', title: mt(locale, 'noOrders'), extraHtml: signin });
  } else if (orders.length === 0) {
    // Giriş yapılmış ama sipariş yok
    html += renderEmptyState({ icon: '🧾', title: mt(locale, 'noOrders'), ctaHref: '/market', ctaLabel: mt(locale, 'backToMarket') });
  } else {
    html += '  <ul class="mk-orders__list" role="list">\n';
    for (const order of orders) {
      const storeName = escapeHtml(order.store_name ?? order.store_slug.replace(/-/g, ' '));
      const date = escapeHtml(new Date(order.created_at).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' }));
      const itemsSummary = order.items
        .slice(0, 3)
        .map((it) => escapeHtml((it.title ?? it.productSlug) + ' ×' + it.qty))
        .join(', ');
      const moreItems = order.items.length > 3 ? ` +${order.items.length - 3}` : '';

      html += '    <li class="mk-orders__card" role="listitem">\n';
      html += '      <div class="mk-orders__card-head">\n';
      html += `        <span class="mk-orders__store">${storeName}</span>\n`;
      html += renderStatusBadge(order.status, locale);
      html += '      </div>\n';
      html += '      <div class="mk-orders__card-body">\n';
      html += `        <p class="mk-orders__ref">${escapeHtml(mt(locale, 'orderRef'))}: <strong>${escapeHtml(order.id)}</strong></p>\n`;
      html += `        <p class="mk-orders__date">${date}</p>\n`;
      html += `        <p class="mk-orders__items-count">${escapeHtml(mt(locale, 'orderItems'))}: ${order.item_count}</p>\n`;
      if (itemsSummary) {
        html += `        <p class="mk-orders__items-summary">${itemsSummary}${moreItems}</p>\n`;
      }
      if (order.total != null && order.currency) {
        const totalFormatted = mkFormatPrice(order.total, order.currency, locale);
        html += `        <p class="mk-orders__total">${escapeHtml(mt(locale, 'total'))}: ${escapeHtml(totalFormatted)}</p>\n`;
      }
      html += '      </div>\n';
      html += `      <a class="mk-orders__store-link" href="/store/${escapeAttr(encodeURIComponent(order.store_slug))}">${escapeHtml(mt(locale, 'visitStore'))}</a>\n`;
      html += '    </li>\n';
    }
    html += '  </ul>\n';
  }

  html += '</main>\n';
  html += renderMarketFooter(locale);
  html += '</div>\n';
  html += renderBottomTabBar(locale, 'none');
  return html;
}

// ── Favori / Sepet kullanıcı sayfaları (/market/favorites, /market/cart) ──────

/** functions/_lib/buyer.ts BuyerItem mirror — döngüsel import önlemek için yerel tanım. */
export interface BuyerCardItem {
  storeSlug: string;
  productSlug: string;
  title: string | null;
  price: number | null;
  currency: string | null;
  stock: number | null;
  imageUrl: string | null;
  productPath: string | null;
  qty?: number;
}

/** functions/_lib/buyer.ts BuyerStoreGroup mirror. */
export interface BuyerGroup {
  storeSlug: string;
  storeName: string;
  items: BuyerCardItem[];
}

/** Market hesap sayfalarının üst barı — ortak app-shell header'ı. */
function renderAccountHeader(locale: string): string {
  return renderAppHeader({ locale, controlsHtml: renderLangSwitcher(locale) });
}

/** Tek favori/sepet kartı; ürün sayfasına link + (sepet) adet kontrolü / (favori) kaldır. */
function renderBuyerCard(item: BuyerCardItem, locale: string, mode: 'favorites' | 'cart'): string {
  const title = escapeHtml(item.title ?? item.productSlug);
  const price = mkFormatPrice(item.price, item.currency ?? 'USD', locale);
  const href = item.productPath ? escapeAttr(item.productPath) : `/store/${escapeAttr(encodeURIComponent(item.storeSlug))}`;
  const ds = escapeAttr(item.storeSlug);
  const dp = escapeAttr(item.productSlug);

  const priceAttr = item.price != null ? ` data-price="${item.price}" data-currency="${escapeAttr(item.currency ?? 'USD')}"` : '';
  let html = `  <li class="mk-acct-card" data-store="${ds}" data-product="${dp}"${priceAttr}>\n`;
  html += `    <a class="mk-acct-card__link" href="${href}">\n`;
  if (item.imageUrl) {
    html += `      <img class="mk-acct-card__img" src="${escapeAttr(item.imageUrl)}" alt="${title}" loading="lazy" decoding="async" width="120" height="120" />\n`;
  } else {
    html += `      <span class="mk-acct-card__img mk-acct-card__img--empty" aria-hidden="true">${mkIcon('photo', true)}</span>\n`;
  }
  html += '      <span class="mk-acct-card__info">\n';
  html += `        <span class="mk-acct-card__title">${title}</span>\n`;
  if (price) {
    html += `        <span class="mk-acct-card__price">${escapeHtml(price)}</span>\n`;
  } else {
    html += `        <span class="mk-acct-card__price mk-acct-card__price--contact">${escapeHtml(mt(locale, 'contactForPrice'))}</span>\n`;
  }
  if (item.stock === 0) {
    html += `        <span class="mk-acct-card__stock mk-acct-card__stock--out">${escapeHtml(mt(locale, 'soldOut'))}</span>\n`;
  }
  html += '      </span>\n';
  html += '    </a>\n';

  if (mode === 'cart') {
    const qty = item.qty ?? 1;
    const qtyLabel = escapeHtml(mt(locale, 'qty'));
    html += '    <div class="mk-acct-card__controls">\n';
    html += `      <div class="mk-acct-card__qty" role="group" aria-label="${qtyLabel}">\n`;
    html += `        <button type="button" class="mk-acct-card__qty-btn" data-mk-cart-dec aria-label="− ${qtyLabel}">−</button>\n`;
    html += `        <span class="mk-acct-card__qty-val" data-mk-cart-qty>${qty}</span>\n`;
    html += `        <button type="button" class="mk-acct-card__qty-btn" data-mk-cart-inc aria-label="+ ${qtyLabel}">+</button>\n`;
    html += '      </div>\n';
    html += `      <button type="button" class="mk-acct-card__remove" data-mk-cart-remove>${escapeHtml(mt(locale, 'remove'))}</button>\n`;
    html += '    </div>\n';
  } else {
    html += `    <button type="button" class="mk-acct-card__remove" data-mk-fav-remove aria-label="${escapeHtml(mt(locale, 'remove'))}">${escapeHtml(mt(locale, 'remove'))}</button>\n`;
  }
  html += '  </li>\n';
  return html;
}

/** Bir mağaza grubunun toplamı; tüm kalemlerde fiyat+aynı para birimi varsa döner, yoksa null. */
function groupTotal(items: BuyerCardItem[]): { total: number; currency: string } | null {
  let currency: string | null = null;
  let total = 0;
  for (const it of items) {
    if (it.price == null || it.currency == null) return null;
    if (currency == null) currency = it.currency;
    else if (currency !== it.currency) return null;
    total += it.price * (it.qty ?? 1);
  }
  return currency == null ? null : { total, currency };
}

/**
 * /market/favorites — tüm mağazalardaki favoriler, mağazaya göre gruplu.
 * Giriş yoksa cihaz UUID'sine bağlı; backend boşsa "Henüz favorin yok" + Giriş yap.
 */
export function renderFavoritesPage(args: { groups: BuyerGroup[]; locale: string; loggedIn: boolean }): string {
  const { groups, locale, loggedIn } = args;
  let html = renderAccountHeader(locale);
  html += '<div class="mk">\n';
  html += '<main class="mk-acct-page">\n';
  html += `  <h1 class="mk-acct-page__title mk-page-title">${escapeHtml(mt(locale, 'myFavorites'))}</h1>\n`;

  if (groups.length === 0) {
    const signin = loggedIn ? '' : `  <button type="button" class="app-acct__btn" id="pz-signin-btn-acct" aria-label="${escapeHtml(mt(locale, 'signIn'))}">${escapeHtml(mt(locale, 'signIn'))}</button>\n`;
    html += renderEmptyState({ icon: mkIcon('heart'), title: mt(locale, 'emptyFavorites'), extraHtml: signin, ctaHref: '/market', ctaLabel: mt(locale, 'browseAll') });
  } else {
    for (const g of groups) {
      html += '  <section class="mk-acct-group">\n';
      html += `    <h2 class="mk-acct-group__store"><a href="/store/${escapeAttr(encodeURIComponent(g.storeSlug))}">${escapeHtml(g.storeName)}</a></h2>\n`;
      html += '    <ul class="mk-acct-list" role="list">\n';
      for (const it of g.items) html += renderBuyerCard(it, locale, 'favorites');
      html += '    </ul>\n';
      html += '  </section>\n';
    }
  }

  html += '</main>\n';
  html += renderMarketFooter(locale);
  html += '</div>\n';
  html += renderBottomTabBar(locale, 'favorites');
  return html;
}

/**
 * /market/cart — tüm mağazalardaki sepet, mağazaya göre gruplu.
 * Her grubun altında toplam + "WhatsApp ile sipariş" (mevcut /store/<slug> sipariş akışına yönlendirir).
 */
export function renderCartPage(args: { groups: BuyerGroup[]; locale: string; loggedIn: boolean }): string {
  const { groups, locale, loggedIn } = args;
  let html = renderAccountHeader(locale);
  html += '<div class="mk">\n';
  html += '<main class="mk-acct-page">\n';
  html += `  <h1 class="mk-acct-page__title mk-page-title">${escapeHtml(mt(locale, 'myCart'))}</h1>\n`;

  if (groups.length === 0) {
    const signin = loggedIn ? '' : `  <button type="button" class="app-acct__btn" id="pz-signin-btn-acct" aria-label="${escapeHtml(mt(locale, 'signIn'))}">${escapeHtml(mt(locale, 'signIn'))}</button>\n`;
    html += renderEmptyState({ icon: mkIcon('cart'), title: mt(locale, 'emptyCart'), extraHtml: signin, ctaHref: '/market', ctaLabel: mt(locale, 'browseAll') });
  } else {
    for (const g of groups) {
      const sum = groupTotal(g.items);
      html += `  <section class="mk-acct-group" data-store="${escapeAttr(g.storeSlug)}">\n`;
      html += `    <h2 class="mk-acct-group__store"><a href="/store/${escapeAttr(encodeURIComponent(g.storeSlug))}">${escapeHtml(g.storeName)}</a></h2>\n`;
      html += '    <ul class="mk-acct-list" role="list">\n';
      for (const it of g.items) html += renderBuyerCard(it, locale, 'cart');
      html += '    </ul>\n';
      html += '    <div class="mk-acct-group__foot">\n';
      if (sum) {
        html += `      <span class="mk-acct-group__total">${escapeHtml(mt(locale, 'total'))}: ${escapeHtml(mkFormatPrice(sum.total, sum.currency, locale))}</span>\n`;
      }
      html += `      <a class="mk-btn mk-acct-group__order" href="/store/${escapeAttr(encodeURIComponent(g.storeSlug))}#cart">${escapeHtml(mt(locale, 'submitOrder'))}</a>\n`;
      html += '    </div>\n';
      html += '  </section>\n';
    }
  }

  html += '</main>\n';
  html += renderMarketFooter(locale);
  html += '</div>\n';
  html += renderBottomTabBar(locale, 'cart');
  return html;
}
