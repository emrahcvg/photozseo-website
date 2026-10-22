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
import { renderAppHeader, renderEmptyState } from './app-shell';
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
 * `index` — 0 = LCP adayı: loading="eager" fetchpriority="high"; >0 = loading="lazy". */
export function renderProductCard(p: ProductRow, locale: string, index = 0, opts?: { eager?: boolean }): string {
  const title = escapeHtml(p.title);
  const price = mkFormatPrice(p.price, p.currency, locale);
  const soldOut = p.stock === 0;
  const href = `/market/p/${encodeURIComponent(p.id)}`;
  const sellerName = p.store_name ?? p.store_slug.replace(/-/g, ' ');
  const isEager = index === 0 || opts?.eager;
  const loadAttrs = isEager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';

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

/** Site dillerinde hukuk sayfası yolu: en → /privacy, diğerleri → /<lang>/privacy. */
const SITE_LANGS = new Set(['tr', 'de', 'es', 'pt', 'fr', 'it', 'pl', 'ja', 'ko', 'zh', 'ar', 'fa', 'ur', 'hi']);
export function legalHref(page: string, locale: string): string {
  return SITE_LANGS.has(locale) ? `/${locale}/${page}` : `/${page}`;
}

/** Footer: bağımsız satıcı açıklaması + hukuk bağlantıları + şikâyet. */
export function renderMarketFooter(locale: string): string {
  const reportHref = `mailto:support@photozseo.com?subject=${encodeURIComponent('Report marketplace listing')}`;
  const links: [string, string][] = [
    [legalHref('marketplace-rules', locale), mt(locale, 'legalRules')],
    [legalHref('store-terms', locale), mt(locale, 'legalStoreTerms')],
    [legalHref('aup', locale), mt(locale, 'legalAup')],
    [legalHref('privacy', locale), mt(locale, 'legalPrivacy')],
    [legalHref('terms', locale), mt(locale, 'legalTerms')],
    [reportHref, mt(locale, 'report')],
  ];
  let html = '<footer class="app-footer mk-footer">\n';
  html += `  <p class="mk-footer__note">${escapeHtml(mt(locale, 'marketFooterNote'))}</p>\n`;
  html += `  <nav class="mk-footer__links" aria-label="${escapeAttr(mt(locale, 'legalRules'))}">\n`;
  for (const [href, label] of links) html += `    <a href="${escapeAttr(href)}">${escapeHtml(label)}</a>\n`;
  html += '  </nav>\n';
  html += '  <p class="mk-footer__brand"><a href="https://photozseo.com">photoZseo</a></p>\n';
  html += '</footer>\n';
  return html;
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

export function renderMarketHome(args: {
  products: ProductRow[];
  stores: StoreRow[];
  categories: { id: string; count: number }[];
  locale: string;
  labelOf?: LabelOf;
  /** Geriye uyum: v3 ana sayfası sidebar yerine kategori dizini kullanır; değer yok sayılır. */
  categoryTree?: CategoryTreeNode[];
}): string {
  const { products, stores, categories, locale } = args;
  const labelOf = args.labelOf ?? identityLabel;
  const isEmpty = products.length === 0;

  let html = renderAppHeader({ locale, controlsHtml: renderLangSwitcher(locale) });
  html += '<div class="mk mk--v3">\n';
  html += '<main class="mk-main">\n';

  html += renderHomeHero(locale);

  if (isEmpty) html += renderMarketVoid(stores.length, categories.length, locale);

  if (categories.length) html += renderCategoryIndex(categories, locale, labelOf);

  // Ürün ızgarası — LCP: ilk 4 kart eager + fetchpriority=high.
  if (!isEmpty) {
    html += '<section class="mk-section mk-section--rule" aria-labelledby="mk-new-title">\n';
    html += '  <div class="mk-sec-head">\n';
    html += `    <h2 class="mk-section__title" id="mk-new-title">${escapeHtml(mt(locale, 'newProducts'))}</h2>\n`;
    html += `    <p class="mk-sec-head__meta">${escapeHtml(mt(locale, 'rankingNote'))}</p>\n`;
    html += '  </div>\n';
    html += '  <div class="mk-grid">\n';
    products.forEach((p, i) => { html += renderProductCard(p, locale, i, { eager: i < 4 }); });
    html += '  </div>\n</section>\n';
  }

  html += renderOrderFlow(locale);

  if (stores.length) {
    html += '<section class="mk-section mk-section--rule" aria-labelledby="mk-stores-title">\n';
    html += '  <div class="mk-sec-head">\n';
    html += `    <h2 class="mk-section__title" id="mk-stores-title">${escapeHtml(mt(locale, 'stores'))}</h2>\n`;
    html += `    <a class="mk-more" href="/market/stores">${escapeHtml(mt(locale, 'browseAll'))}</a>\n`;
    html += '  </div>\n';
    html += renderStoreTable(stores, locale);
    html += '</section>\n';
  }

  html += renderSellCta(locale);

  html += '</main>\n';
  html += renderMarketFooter(locale);
  html += '</div>\n';
  html += renderBottomTabBar(locale, 'discover');
  return html;
}

/** Hero: iki tonlu başlık + değer önerisi + tek geniş arama + üç güven maddesi. */
function renderHomeHero(locale: string): string {
  const ph = escapeHtml(mt(locale, 'searchPlaceholder'));
  let html = '<section class="mk-hero">\n';
  html += '  <div class="mk-hero__grid">\n';
  html += `    <h1 class="mk-hero__title">${escapeHtml(mt(locale, 'heroTitle'))} <span class="mk-hero__muted">${escapeHtml(mt(locale, 'heroTitleMuted'))}</span></h1>\n`;
  html += `    <p class="mk-hero__sub">${escapeHtml(mt(locale, 'heroSub'))}</p>\n`;
  html += '  </div>\n';
  html += '  <form class="mk-hero__form" action="/market/search" method="get" role="search">\n';
  html += `    <input class="mk-hero__input" name="q" type="search" maxlength="100" placeholder="${ph}" aria-label="${ph}" list="mk-suggest" autocomplete="off" data-mk-suggest />\n`;
  html += '    <datalist id="mk-suggest"></datalist>\n';
  html += `    <button type="submit" class="mk-hero__btn" aria-label="${ph}">${mkIcon('search')}</button>\n`;
  html += '  </form>\n';
  html += '  <ul class="mk-facts">\n';
  for (const k of ['Pay', 'Reviews', 'Identity'] as const) {
    html += `    <li class="mk-fact"><b>${escapeHtml(mt(locale, `fact${k}Title`))}</b><span>${escapeHtml(mt(locale, `fact${k}Desc`))}</span></li>\n`;
  }
  html += '  </ul>\n';
  html += '</section>\n';
  return html;
}

/** Boş pazar yeri durumu — "Sonuç yok" yerine dürüst açılış bilgisi + sayılar. */
function renderMarketVoid(storeCount: number, categoryCount: number, locale: string): string {
  const fmt = (n: number) => new Intl.NumberFormat(locale).format(n);
  let html = '<section class="mk-void" aria-labelledby="mk-void-title">\n';
  html += '  <div class="mk-void__text">\n';
  html += `    <p class="mk-eyebrow">${escapeHtml(mt(locale, 'voidEyebrow'))}</p>\n`;
  html += `    <h2 class="mk-void__title" id="mk-void-title">${escapeHtml(mt(locale, 'voidTitle'))}</h2>\n`;
  html += `    <p class="mk-void__desc">${escapeHtml(mt(locale, 'voidDesc'))}</p>\n`;
  html += '  </div>\n';
  html += '  <dl class="mk-void__stats">\n';
  html += `    <div><dt>${escapeHtml(mt(locale, 'statStores'))}</dt><dd>${fmt(storeCount)}</dd></div>\n`;
  html += `    <div><dt>${escapeHtml(mt(locale, 'statProducts'))}</dt><dd>${fmt(0)}</dd></div>\n`;
  html += `    <div><dt>${escapeHtml(mt(locale, 'statCategories'))}</dt><dd>${fmt(categoryCount)}</dd></div>\n`;
  html += '  </dl>\n';
  html += '</section>\n';
  return html;
}

/** Kategori dizini — taksonomi kökleri; Google Product Taxonomy ID + ürün sayısı görünür. */
export function renderCategoryIndex(
  categories: { id: string; count: number }[],
  locale: string,
  labelOf: LabelOf = identityLabel,
): string {
  let html = `<section class="mk-section" aria-labelledby="mk-cat-title">\n`;
  html += '  <div class="mk-sec-head">\n';
  html += `    <h2 class="mk-section__title" id="mk-cat-title">${escapeHtml(mt(locale, 'categories'))}</h2>\n`;
  html += `    <p class="mk-sec-head__meta mk-mono">${escapeHtml(mt(locale, 'taxonomyNote'))}</p>\n`;
  html += '  </div>\n';
  html += '  <ul class="mk-cats">\n';
  const fmt = new Intl.NumberFormat(locale);
  for (const c of categories) {
    const href = escapeAttr(`/market/c/${idToSlug(c.id)}`);
    const empty = c.count === 0 ? ' mk-cat--empty' : '';
    html += `    <li><a class="mk-cat${empty}" href="${href}"><span class="mk-cat__id">${escapeHtml(c.id)}</span><span class="mk-cat__name">${escapeHtml(labelOf(c.id, locale))}</span><span class="mk-cat__n">${fmt.format(c.count)}</span></a></li>\n`;
  }
  html += '  </ul>\n';
  html += '</section>\n';
  return html;
}

/** Sipariş akışı — gerçek 3 adımlı süreç (sepet → WhatsApp → havale). */
function renderOrderFlow(locale: string): string {
  let html = '<section class="mk-section mk-section--rule mk-flow" aria-labelledby="mk-flow-title">\n';
  html += '  <div class="mk-flow__intro">\n';
  html += `    <p class="mk-eyebrow">${escapeHtml(mt(locale, 'flowEyebrow'))}</p>\n`;
  html += `    <h2 class="mk-section__title" id="mk-flow-title">${escapeHtml(mt(locale, 'flowTitle'))}</h2>\n`;
  html += `    <p>${escapeHtml(mt(locale, 'flowDesc'))}</p>\n`;
  html += '  </div>\n';
  html += '  <ol class="mk-steps">\n';
  for (const n of [1, 2, 3]) {
    html += `    <li><b>${escapeHtml(mt(locale, `step${n}Title`))}</b><span>${escapeHtml(mt(locale, `step${n}Desc`))}</span></li>\n`;
  }
  html += '  </ol>\n';
  html += '</section>\n';
  return html;
}

/** Mağaza dizini tablosu (ana sayfa). */
function renderStoreTable(stores: StoreRow[], locale: string): string {
  let html = '<div class="mk-table-wrap">\n<table class="mk-table">\n';
  html += `  <thead><tr><th scope="col">${escapeHtml(mt(locale, 'colStore'))}</th><th scope="col">${escapeHtml(mt(locale, 'colLocation'))}</th><th scope="col" class="mk-table__end"><span class="mk-sr-only">${escapeHtml(mt(locale, 'visitStore'))}</span></th></tr></thead>\n`;
  html += '  <tbody>\n';
  for (const st of stores) {
    const loc = [st.city, st.country].filter(Boolean).join(', ');
    const href = escapeAttr(`/store/${encodeURIComponent(st.slug)}`);
    html += `    <tr><td class="mk-table__name">${escapeHtml(st.name)}</td><td>${escapeHtml(loc)}</td><td class="mk-table__end"><a class="mk-table__go" href="${href}">${escapeHtml(mt(locale, 'visitStore'))} <span aria-hidden="true">→</span></a></td></tr>\n`;
  }
  html += '  </tbody>\n</table>\n</div>\n';
  return html;
}

/** Satıcı çağrısı — uygulama ana sayfasına (App Store linki yayın gününe kadar yok). */
function renderSellCta(locale: string): string {
  const home = locale === 'en' ? '/' : `/${locale}/`;
  let html = '<section class="mk-sell" aria-labelledby="mk-sell-title">\n';
  html += `  <h2 class="mk-sell__title" id="mk-sell-title">${escapeHtml(mt(locale, 'sellTitle'))}</h2>\n`;
  html += '  <div class="mk-sell__side">\n';
  html += `    <p>${escapeHtml(mt(locale, 'sellDesc'))}</p>\n`;
  html += `    <a class="mk-sell__cta" href="${escapeAttr(home)}">${escapeHtml(mt(locale, 'sellCta'))}</a>\n`;
  html += '  </div>\n';
  html += '</section>\n';
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

/** Sayfalama bilgisi — router hesaplar; renderer yalnız bağlantıları basar. */
export interface PagerInfo {
  page: number;
  pageSize: number;
  /** n. sayfanın göreli URL'i (1 → parametresiz). */
  hrefFor: (n: number) => string;
}

export function renderPager(total: number, pager: PagerInfo | undefined, locale: string): string {
  if (!pager) return '';
  const pages = Math.max(1, Math.ceil(total / pager.pageSize));
  if (pages <= 1) return '';
  const cur = Math.min(Math.max(1, pager.page), pages);
  let html = `<nav class="mk-pager" aria-label="${escapeAttr(mt(locale, 'pageLabel'))}">\n`;
  html += cur > 1
    ? `  <a class="mk-pager__link" rel="prev" href="${escapeAttr(pager.hrefFor(cur - 1))}">← ${escapeHtml(mt(locale, 'prevPage'))}</a>\n`
    : '  <span class="mk-pager__link mk-pager__link--off" aria-hidden="true"></span>\n';
  html += `  <span class="mk-pager__state">${escapeHtml(mt(locale, 'pageLabel'))} ${cur} / ${pages}</span>\n`;
  html += cur < pages
    ? `  <a class="mk-pager__link" rel="next" href="${escapeAttr(pager.hrefFor(cur + 1))}">${escapeHtml(mt(locale, 'nextPage'))} →</a>\n`
    : '  <span class="mk-pager__link mk-pager__link--off" aria-hidden="true"></span>\n';
  html += '</nav>\n';
  return html;
}

export function renderSearchPage(args: {
  items: ProductRow[];
  facets: Facets;
  total: number;
  locale: string;
  query: SearchQuery;
  labelOf?: LabelOf;
  pager?: PagerInfo;
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
    items.forEach((p, i) => { html += renderProductCard(p, locale, i); });
    html += '      </div>\n';
    html += renderPager(total, args.pager, locale);
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
  pager?: PagerInfo;
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
    items.forEach((p, i) => { html += renderProductCard(p, locale, i); });
    html += '  </div>\n';
    html += renderPager(args.total, args.pager, locale);
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
      url: `${origin}/store/${encodeURIComponent(s.slug)}`,
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
    html += renderEmptyState({ icon: mkIcon('cart'), title: mt(locale, 'noOrders'), extraHtml: signin });
  } else if (orders.length === 0) {
    // Giriş yapılmış ama sipariş yok
    html += renderEmptyState({ icon: mkIcon('cart'), title: mt(locale, 'noOrders'), ctaHref: '/market', ctaLabel: mt(locale, 'backToMarket') });
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

// ── Product Detail Page ───────────────────────────────────────────────────────

export interface ProductDetail extends ProductRow {
  whatsapp?: string | null;
  city?: string | null;
  country?: string | null;
}

export function renderProductPage(p: ProductDetail, locale: string): string {
  const title = escapeHtml(p.title);
  const price = mkFormatPrice(p.price, p.currency, locale);
  const soldOut = p.stock === 0;
  const sellerName = p.store_name ?? p.store_slug.replace(/-/g, ' ');
  const tags = parseTags(p.tags);

  let html = '<div class="mk">\n';
  html += renderAppHeader({ title: 'photoZseo Market', locale });
  html += '<main class="mk-pdp">\n';

  // Back link
  html += `  <a class="mk-pdp__back" href="/market">← ${escapeHtml(mt(locale, 'marketTitle'))}</a>\n`;

  html += '  <div class="mk-pdp__layout">\n';

  // Left: image
  html += '    <div class="mk-pdp__media">\n';
  if (p.image_url) {
    html += `      <img src="${escapeAttr(p.image_url)}" alt="${title}" loading="eager" fetchpriority="high" decoding="async" width="600" height="600" />\n`;
  } else {
    html += `      <div class="mk-pdp__media-empty" aria-hidden="true">${mkIcon('photo')}</div>\n`;
  }
  html += '    </div>\n';

  // Right: info
  html += '    <div class="mk-pdp__info">\n';
  html += `      <h1 class="mk-pdp__title">${title}</h1>\n`;

  // Seller
  const storeHref = `/store/${encodeURIComponent(p.store_slug)}`;
  html += `      <p class="mk-pdp__seller"><a href="${storeHref}">${escapeHtml(sellerName)}</a>`;
  if (p.city) html += ` · ${escapeHtml(p.city)}`;
  html += '</p>\n';

  // Price
  if (price) {
    html += `      <p class="mk-pdp__price" data-mk-amount="${p.price != null ? p.price.toFixed(2) : ''}" data-mk-currency="${escapeAttr(p.currency)}" data-mk-orig="${escapeHtml(price)}">${escapeHtml(price)}</p>\n`;
  } else {
    html += `      <p class="mk-pdp__price mk-pdp__price--contact">${escapeHtml(mt(locale, 'contactForPrice'))}</p>\n`;
  }

  // Stock badge
  if (soldOut) {
    html += `      <span class="mk-card__badge mk-card__badge--out">${escapeHtml(mt(locale, 'soldOut'))}</span>\n`;
  }

  // Add to cart
  if (!soldOut && p.price != null) {
    // id = "<storeSlug>:<productSlug>"; buyer API ürün slug'ını ister (iki nokta üst üste geçersiz).
    const pslug = p.id.includes(':') ? p.id.slice(p.id.indexOf(':') + 1) : p.id;
    html += `      <button class="mk-btn mk-pdp__add-btn"
        data-mk-add="${escapeAttr(p.id)}"
        data-mk-pslug="${escapeAttr(pslug)}"
        data-mk-added="${escapeAttr(mt(locale, 'addedToCart'))}"
        data-mk-title="${title}"
        data-mk-price="${p.price.toFixed(2)}"
        data-mk-currency="${escapeAttr(p.currency)}"
        data-mk-cart-root-slug="${escapeAttr(p.store_slug)}"
      >${escapeHtml(mt(locale, 'addToCart'))}</button>\n`;
  }

  // WhatsApp
  if (p.whatsapp) {
    const waNum = p.whatsapp.replace(/[^0-9]/g, '');
    const waText = encodeURIComponent(`Hi, I'm interested in: ${p.title}`);
    html += `      <a class="mk-btn mk-btn--wa mk-pdp__wa-btn" href="https://wa.me/${waNum}?text=${waText}" target="_blank" rel="noopener noreferrer">WhatsApp</a>\n`;
  }

  // Description
  if (p.description) {
    html += `      <p class="mk-pdp__desc">${escapeHtml(p.description)}</p>\n`;
  }

  // Tags
  if (tags.length) {
    html += '      <div class="mk-pdp__tags">\n';
    for (const tag of tags) {
      html += `        <a class="mk-chip" href="/market/search?q=${encodeURIComponent(tag)}">${escapeHtml(tag)}</a>\n`;
    }
    html += '      </div>\n';
  }

  html += '    </div>\n'; // .mk-pdp__info
  html += '  </div>\n'; // .mk-pdp__layout
  html += '</main>\n';
  html += renderMarketFooter(locale);
  html += '</div>\n';
  html += renderBottomTabBar(locale, 'discover');
  return html;
}

export function buildProductJsonLd(p: ProductDetail, origin: string): string {
  const url = `${origin}/market/p/${encodeURIComponent(p.id)}`;
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    url,
    description: p.description || undefined,
    image: p.image_url || undefined,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: p.currency,
      price: p.price ?? undefined,
      availability: p.stock === 0
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
    },
  };
  return JSON.stringify(obj);
}
