/**
 * render.ts — Framework-free HTML renderer for P2 (Cloudflare Pages Functions).
 * Pure TypeScript; no Astro, no DOM. Reuses pure helpers from ./manifest.
 * All user-provided strings are HTML-escaped to prevent XSS.
 */

import type { Manifest, Product, StoreInfo } from './types';
import type { FitmentOptions } from './manifest';
import { mt } from './marketplace-i18n';
import type { TaxonomyService } from './taxonomy/service';
import { renderAppHeader, renderAppFooter, renderEmptyState } from './app-shell';
import { categoryBreadcrumb, resolveCategoryName } from './taxonomy/category-resolve';
import { buildFaqEntries, faqHeading } from './storefront-faq';
import {
  resolveLocalized,
  formatPrice,
  groupProductsByCategory,
  groupProductsByPartType,
  encodeFitment,
  fitmentFilterOptions,
  uniqueProductSlugs,
  stockLabel,
  whatsappHref,
  socialHref,
  mapHref,
  storeUrl,
  productUrl,
  productWhatsappHref,
  specRows,
  shippingText,
} from './manifest';

function mkFormatDetailPrice(price: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(price);
  } catch {
    return `${price.toFixed(2)} ${currency}`;
  }
}

/**
 * Round a price to its currency's minor units for clean JSON-LD output
 * (USD/EUR → 2 decimals, JPY/KRW → 0). Currency conversion can leave long
 * floats (181.35373…) that look unprofessional and break Merchant feeds.
 */
function roundPrice(price: number, currency: string): number {
  let digits = 2;
  try {
    digits =
      new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions()
        .maximumFractionDigits ?? 2;
  } catch {
    /* unknown currency → keep 2 */
  }
  const f = 10 ** digits;
  return Math.round(price * f) / f;
}

// ── XSS protection ────────────────────────────────────────────────────────────

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escape a URL for use inside an HTML attribute (href="…"). */
function escapeAttr(url: string): string {
  return escapeHtml(url);
}

// ── Currency / language config ─────────────────────────────────────────────────

/** Currencies offered in the visitor-facing switcher. Base is always included. */
export const SWITCHER_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'TRY', 'JPY', 'CNY',
  'AED', 'SAR', 'RUB', 'BRL', 'INR', 'CAD', 'AUD',
];

export const LANG_NAMES: Record<string, string> = {
  en: 'English', tr: 'Türkçe', de: 'Deutsch', es: 'Español',
  pt: 'Português', ja: '日本語', ko: '한국어', zh: '中文',
  ar: 'العربية', fa: 'فارسی', ur: 'اردو', hi: 'हिन्दी',
};

// ── Stock class helper ────────────────────────────────────────────────────────

function stockClass(product: Product): string {
  if (product.inStock === false || product.stockQty === 0) return 'sf-stock--out';
  if (typeof product.stockQty === 'number' && product.stockQty <= 5) return 'sf-stock--low';
  return 'sf-stock--in';
}

// ── Price block ─────────────────────────────────────────────────────────────────

/**
 * Renders a price block. Each amount carries data-sf-amount / data-sf-currency
 * so the client currency switcher can convert it. The server-rendered text is
 * the base currency, so no-JS visitors still see a correct price.
 * Optional stock label/class renders inline next to the price.
 */
function renderPriceBlock(
  product: Product,
  locale: string,
  fallbackCurrency: string,
  stockInfo?: { label: string; cls: string },
): string {
  const currency = product.currency ?? fallbackCurrency;
  const price = formatPrice(product.price, currency, locale);

  let html = '<div class="sf-card__price">\n';
  if (price) {
    html += `  <span class="sf-card__amount sf-price" data-sf-amount="${product.price}" data-sf-currency="${escapeHtml(currency)}" data-sf-orig="${escapeHtml(price)}">${escapeHtml(price)}</span>\n`;
  } else {
    html += `  <span class="sf-card__contact">${escapeHtml(mt(locale, 'contactForPrice'))}</span>\n`;
  }
  if (stockInfo) {
    html += `  <span class="sf-stock ${escapeHtml(stockInfo.cls)}">${escapeHtml(stockInfo.label)}</span>\n`;
  }
  html += '</div>\n';
  return html;
}

// ── Media (with empty-state placeholder) ────────────────────────────────────────

function renderCardMedia(image: string, alt: string, soldOut: boolean, locale: string): string {
  let html = '    <div class="sf-card__media">\n';
  if (image) {
    html += `      <img src="${escapeAttr(image)}" alt="${escapeHtml(alt)}" loading="lazy" width="800" height="800" />\n`;
  } else {
    html += '      <div class="sf-card__media-empty" aria-hidden="true">📷</div>\n';
  }
  if (soldOut) {
    html += `      <span class="sf-card__badge">${escapeHtml(mt(locale, 'soldOut'))}</span>\n`;
  }
  html += '    </div>\n';
  return html;
}

// ── Visitor controls (currency + language switcher) ─────────────────────────────

function renderControls(
  locale: string,
  baseCurrency: string,
  languages: string[],
  langHref: (lang: string) => string,
): string {
  const currencyLabel = mt(locale, 'currency');
  const languageLabel = mt(locale, 'language');
  const note = mt(locale, 'rateNote');

  // Currency options — ensure the store's base currency is present.
  const currencies = SWITCHER_CURRENCIES.includes(baseCurrency)
    ? SWITCHER_CURRENCIES
    : [baseCurrency, ...SWITCHER_CURRENCIES];

  let html = '<div class="sf-controls">\n';

  // Language switcher (only when the store has more than one language).
  const langs = languages.filter((l) => LANG_NAMES[l] || l);
  if (langs.length > 1) {
    html += `  <label class="sf-control">\n    <span class="sf-control__label">${escapeHtml(languageLabel)}</span>\n`;
    html += '    <select class="sf-select" data-sf-lang aria-label="' + escapeHtml(languageLabel) + '">\n';
    for (const l of langs) {
      const sel = l === locale ? ' selected' : '';
      const name = LANG_NAMES[l] ?? l;
      html += `      <option value="${escapeAttr(langHref(l))}"${sel}>${escapeHtml(name)}</option>\n`;
    }
    html += '    </select>\n  </label>\n';
  }

  // Currency switcher.
  html += `  <label class="sf-control">\n    <span class="sf-control__label">${escapeHtml(currencyLabel)}</span>\n`;
  html += `    <select class="sf-select" data-sf-currency data-sf-base="${escapeHtml(baseCurrency)}" aria-label="${escapeHtml(currencyLabel)}">\n`;
  for (const c of currencies) {
    const sel = c === baseCurrency ? ' selected' : '';
    html += `      <option value="${escapeHtml(c)}"${sel}>${escapeHtml(c)}</option>\n`;
  }
  html += '    </select>\n  </label>\n';

  html += `  <span class="sf-rate-note" data-sf-rate-note hidden>${escapeHtml(note)}</span>\n`;
  html += '</div>\n';
  return html;
}

// ── renderStoreHeader ────────────────────────────────────────────────────────

function renderStoreHeader(manifest: Manifest, locale: string, defaultLang: string): string {
  const store = manifest.store;
  const tagline = resolveLocalized(store.tagline, locale);
  const c = store.contact;
  const locationText = [store.location?.city, store.location?.country].filter(Boolean).join(', ');
  const map = mapHref(store.location);
  const contactLabel = mt(locale, 'contact');

  const buttons: { label: string; href: string; cls: string }[] = [];
  if (c.whatsapp) buttons.push({ label: 'WhatsApp', href: whatsappHref(c.whatsapp), cls: 'sf-btn sf-btn--wa' });
  if (c.phone) buttons.push({ label: mt(locale, 'call'), href: `tel:${c.phone}`, cls: 'sf-btn sf-btn--ghost' });
  if (c.email) buttons.push({ label: 'E-mail', href: `mailto:${c.email}`, cls: 'sf-btn sf-btn--ghost' });
  for (const s of c.social ?? []) {
    buttons.push({ label: escapeHtml(s.type), href: socialHref(s.type, s.value), cls: 'sf-btn sf-btn--ghost' });
  }

  let html = '<header class="sf-header">\n';

  if (store.logo) {
    html += `  <img class="sf-header__logo" src="${escapeAttr(store.logo)}" alt="${escapeHtml(store.displayName)}" width="96" height="96" />\n`;
  }

  html += `  <h1 class="sf-header__name">${escapeHtml(store.displayName)}</h1>\n`;

  if (tagline) {
    html += `  <p class="sf-header__tagline">${escapeHtml(tagline)}</p>\n`;
  }

  if (locationText) {
    if (map) {
      html += `  <a class="sf-header__location sf-header__location--link" href="${escapeAttr(map)}" target="_blank" rel="noopener noreferrer">📍 ${escapeHtml(locationText)}</a>\n`;
    } else {
      html += `  <p class="sf-header__location">📍 ${escapeHtml(locationText)}</p>\n`;
    }
  }

  if (buttons.length > 0) {
    html += `  <nav class="sf-header__contact" aria-label="${escapeHtml(contactLabel)}">\n`;
    for (const b of buttons) {
      const external = !/^(tel:|mailto:)/.test(b.href);
      const extras = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      html += `    <a class="${b.cls}" href="${escapeAttr(b.href)}"${extras}>${escapeHtml(b.label)}</a>\n`;
    }
    html += '  </nav>\n';
  }

  html += '</header>\n';

  return html;
}

// ── renderProductCard ────────────────────────────────────────────────────────

function renderProductCard(
  product: Product,
  locale: string,
  currency: string,
  storeSlug: string,
  defaultLang: string,
  pSlug: string,
): string {
  const title = resolveLocalized(product.title, locale);
  const description = resolveLocalized(product.description, locale);
  const image = product.images[0] ?? '';
  const soldOut = product.inStock === false;
  const href = productUrl(storeSlug, pSlug, locale, defaultLang);
  const stock = stockLabel(product, locale);
  const sc = stockClass(product);
  const haystack = [title, description, ...(product.tags ?? [])].join(' ').toLowerCase();

  const favLabel = mt(locale, 'favorite');
  const fitmentEncoded = encodeFitment(product.fitment);
  const fitmentAttr = fitmentEncoded ? ` data-sf-fitment="${escapeAttr(fitmentEncoded)}"` : '';
  let html = `<a class="sf-card-link" href="${escapeAttr(href)}" data-sf-search="${escapeHtml(haystack)}"${fitmentAttr}>\n`;
  html += '  <article class="sf-card">\n';
  html += renderCardMedia(image, title, soldOut, locale);
  html += `    <button type="button" class="sf-fav" data-sf-fav="${escapeAttr(pSlug)}" aria-label="${escapeHtml(favLabel)}" title="${escapeHtml(favLabel)}">♥</button>\n`;
  html += '    <div class="sf-card__body">\n';
  html += `      <h3 class="sf-card__title">${escapeHtml(title)}</h3>\n`;
  // Açıklama grid kartında gösterilmez (Apple-style sade kart); `description` yalnız aramada kullanılır.
  const stockInfo = stock ? { label: stock, cls: sc } : undefined;
  html += renderPriceBlock(product, locale, currency, stockInfo).replace(/^/gm, '    ').trimStart();
  html += '    </div>\n';
  html += '  </article>\n';
  html += '</a>\n';

  return html;
}

// ── Toolbar (search + category jump nav) ─────────────────────────────────────────

function renderToolbar(
  groups: { category: { id: string; name: Record<string, string> } | null; products: Product[] }[],
  locale: string,
): string {
  const searchPlaceholder = mt(locale, 'searchPlaceholder');
  const catsLabel = mt(locale, 'categories');
  const noResults = mt(locale, 'noResults');

  let html = '<div class="sf-toolbar">\n';
  html += `  <input type="search" class="sf-search" data-sf-search-input placeholder="${escapeHtml(searchPlaceholder)}" aria-label="${escapeHtml(searchPlaceholder)}" />\n`;

  if (groups.length > 1) {
    const allLabel = mt(locale, 'allCategories');
    const totalCount = groups.reduce((n, g) => n + g.products.length, 0);
    html += `  <nav class="sf-catnav" aria-label="${escapeHtml(catsLabel)}">\n`;
    html += `    <button type="button" class="sf-catnav__link sf-catnav__link--active" data-sf-cat="all">${escapeHtml(allLabel)} <span class="sf-catnav__count">${totalCount}</span></button>\n`;
    for (const group of groups) {
      const id = group.category ? `cat-${group.category.id}` : 'cat-other';
      const name = group.category
        ? resolveLocalized(group.category.name, locale)
        : mt(locale, 'other');
      html += `    <button type="button" class="sf-catnav__link" data-sf-cat="${escapeAttr(id)}">${escapeHtml(name)} <span class="sf-catnav__count">${group.products.length}</span></button>\n`;
    }
    html += '  </nav>\n';
  }

  html += `  <p class="sf-no-results" data-sf-no-results hidden>${escapeHtml(noResults)}</p>\n`;
  html += '</div>\n';
  return html;
}

// ── Currency + search client script (shared) ─────────────────────────────────────

function controlsScript(locale: string): string {
  return `<script>
(function () {
  var locale = ${JSON.stringify(locale)};

  // ---- Language switcher: navigate on change ----
  var langSel = document.querySelector('[data-sf-lang]');
  if (langSel) langSel.addEventListener('change', function () {
    if (this.value) window.location.href = this.value;
  });

  // ---- Currency switcher ----
  var curSel = document.querySelector('[data-sf-currency]');
  var note = document.querySelector('[data-sf-rate-note]');
  if (curSel) {
    var base = curSel.getAttribute('data-sf-base') || 'USD';
    var stored = null;
    try { stored = localStorage.getItem('sf-currency'); } catch (e) {}
    if (stored && stored !== curSel.value) {
      var has = false;
      for (var i = 0; i < curSel.options.length; i++) if (curSel.options[i].value === stored) has = true;
      if (has) curSel.value = stored;
    }

    var ratesCache = null;

    function fmt(amount, currency) {
      try { return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(amount); }
      catch (e) { return amount.toFixed(2) + ' ' + currency; }
    }

    // Does converting to target require rates? Only if some item is in another currency.
    function needsRates(target) {
      var els = document.querySelectorAll('[data-sf-amount]');
      for (var i = 0; i < els.length; i++) {
        var from = els[i].getAttribute('data-sf-currency') || base;
        if (from !== target) return true;
      }
      return false;
    }

    // Convert EVERY price to the target currency. Items already in the target keep their original
    // formatting; others are cross-converted (amount / rate[from] * rate[target]).
    function applyCurrency(target, rates) {
      var anyConverted = false;
      document.querySelectorAll('[data-sf-amount]').forEach(function (el) {
        var amount = parseFloat(el.getAttribute('data-sf-amount'));
        var from = el.getAttribute('data-sf-currency') || base;
        var orig = el.getAttribute('data-sf-orig') || '';
        if (isNaN(amount)) return;
        if (from === target || !rates || !rates[from] || !rates[target]) {
          el.textContent = orig;
          return;
        }
        var converted = (amount / rates[from]) * rates[target];
        el.textContent = '≈ ' + fmt(converted, target);
        anyConverted = true;
      });
      if (note) note.hidden = !anyConverted;
    }

    function onChange() {
      var target = curSel.value;
      try { localStorage.setItem('sf-currency', target); } catch (e) {}
      if (!needsRates(target)) { applyCurrency(target, null); return; }
      if (ratesCache) { applyCurrency(target, ratesCache); return; }
      fetch('/api/rates/' + encodeURIComponent(base))
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.rates) { ratesCache = data.rates; applyCurrency(target, ratesCache); }
        })
        .catch(function () {});
    }

    curSel.addEventListener('change', onChange);
    // Normalize all prices to the selected currency on load (fixes mixed-currency stores).
    onChange();
  }

  // ---- Product search filter ----
  var input = document.querySelector('[data-sf-search-input]');
  if (input) {
    var noRes = document.querySelector('[data-sf-no-results]');
    input.addEventListener('input', function () {
      var q = this.value.trim().toLowerCase();
      var anyVisible = false;
      document.querySelectorAll('.sf-card-link').forEach(function (card) {
        var hay = card.getAttribute('data-sf-search') || '';
        var match = !q || hay.indexOf(q) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) anyVisible = true;
      });
      document.querySelectorAll('.sf-section').forEach(function (sec) {
        var visible = sec.querySelector('.sf-card-link:not([style*="display: none"])');
        sec.style.display = visible ? '' : 'none';
      });
      if (noRes) noRes.hidden = anyVisible || !q;
    });
  }

  // ---- Category filter: clicking a chip shows only that category's products ----
  var catChips = document.querySelectorAll('.sf-catnav__link');
  if (catChips.length) {
    catChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var cat = chip.getAttribute('data-sf-cat');
        document.querySelectorAll('.sf-section').forEach(function (sec) {
          var match = sec.getAttribute('data-sf-cat') === cat;
          sec.style.display = (cat === 'all' || match) ? '' : 'none';
          // Tek kategori seçilince tam grid (alta doğru, hepsi); Tümü'de yatay şerit.
          sec.classList.toggle('sf-section--expanded', cat !== 'all' && match);
        });
        for (var i = 0; i < catChips.length; i++) {
          catChips[i].classList.toggle('sf-catnav__link--active', catChips[i] === chip);
        }
        if (input) input.value = '';
      });
    });
  }
})();
</script>\n`;
}

// ── renderStoreBody ───────────────────────────────────────────────────────────

/**
 * Renders the full store page body as an HTML string.
 * Mirrors StorePage.astro → StoreHeader + Toolbar + CategorySection(s) + StoreFooter.
 */
/**
 * Araç-uyumu filtresinin client davranışı (vanilla JS, no-build). Make seçilince
 * model dropdown'ı `data-sf-models`'ten dolar; her ikisi de `data-sf-fitment`'lı
 * kartları o bölümde gösterir/gizler ve boşalan part-type alt başlıklarını saklar.
 * No-JS fallback = tüm ürünler görünür (kartlar varsayılan display).
 */
function fitmentFilterScript(): string {
  return `  <script>
(function(){
  document.querySelectorAll('[data-sf-fitment-filter]').forEach(function(ctrl){
    var section = ctrl.closest('.sf-section'); if(!section) return;
    var models = {}; try { models = JSON.parse(ctrl.getAttribute('data-sf-models')||'{}'); } catch(e){}
    var makeSel = ctrl.querySelector('[data-sf-fitment-make]');
    var modelSel = ctrl.querySelector('[data-sf-fitment-model]');
    var allModels = modelSel.options[0] ? modelSel.options[0].textContent : '';
    function rebuild(){
      var make = makeSel.value; modelSel.innerHTML='';
      var first=document.createElement('option'); first.value=''; first.textContent=allModels; modelSel.appendChild(first);
      (models[make]||[]).forEach(function(m){ var o=document.createElement('option'); o.value=m; o.textContent=m; modelSel.appendChild(o); });
      modelSel.disabled = !make;
    }
    function apply(){
      var make=makeSel.value, model=modelSel.value;
      section.querySelectorAll('[data-sf-fitment]').forEach(function(card){
        var ok=true;
        if(make){ var fits=[]; try{ fits=JSON.parse(card.getAttribute('data-sf-fitment')||'[]'); }catch(e){}
          ok = fits.some(function(f){ return f[0]===make && (!model || f[1]===model); }); }
        card.style.display = ok ? '' : 'none';
      });
      section.querySelectorAll('.sf-subsection__title').forEach(function(h){
        var grid=h.nextElementSibling; if(!grid) return;
        var any=Array.prototype.some.call(grid.querySelectorAll('.sf-card-link'),function(c){return c.style.display!=='none';});
        h.style.display = any ? '' : 'none';
      });
    }
    makeSel.addEventListener('change', function(){ rebuild(); apply(); });
    modelSel.addEventListener('change', apply);
    rebuild();
  });
})();
  </script>\n`;
}

function renderProductGrid(
  products: Product[],
  locale: string,
  currency: string,
  storeSlug: string,
  defaultLang: string,
  slugMap: Map<string, string>,
): string {
  let html = '  <div class="sf-grid">\n';
  for (const product of products) {
    const pSlug = slugMap.get(product.id) ?? product.id;
    html += renderProductCard(product, locale, currency, storeSlug, defaultLang, pSlug);
  }
  html += '  </div>\n';
  return html;
}

/**
 * Araç-uyumu (katman 3) filtre kontrolü: make→model daraltan iki dropdown.
 * Make seçenekleri sunucuda pre-render; model'ler `data-sf-models` JSON'ından
 * client tarafında doldurulur. Hiç fitment yoksa boş döner.
 */
function renderFitmentFilter(options: FitmentOptions, locale: string): string {
  if (!options.makes.length) return '';
  const label = mt(locale, 'fitsVehicle');
  const allMakes = mt(locale, 'allMakes');
  const allModels = mt(locale, 'allModels');
  const makeOpts = options.makes
    .map((m) => `<option value="${escapeAttr(m)}">${escapeHtml(m)}</option>`)
    .join('');
  const modelsJson = escapeAttr(JSON.stringify(options.modelsByMake));
  let html = `  <div class="sf-fitment-filter" data-sf-fitment-filter data-sf-models="${modelsJson}">\n`;
  html += `    <span class="sf-fitment-filter__label">${escapeHtml(label)}</span>\n`;
  html += `    <select class="sf-fitment-filter__sel" data-sf-fitment-make aria-label="${escapeAttr(label)}"><option value="">${escapeHtml(allMakes)}</option>${makeOpts}</select>\n`;
  html += `    <select class="sf-fitment-filter__sel" data-sf-fitment-model aria-label="${escapeAttr(allModels)}" disabled><option value="">${escapeHtml(allModels)}</option></select>\n`;
  html += '  </div>\n';
  return html;
}

/**
 * Bir kategorinin ürünlerini render eder. Üründe part-type varsa (otomotiv,
 * katman 2) part-type'a göre alt-başlıklı gruplar; yoksa mevcut düz grid korunur.
 * Üründe araç-uyumu varsa (katman 3) en üste make/model filtresi eklenir.
 */
function renderCategoryProducts(
  products: Product[],
  locale: string,
  currency: string,
  storeSlug: string,
  defaultLang: string,
  slugMap: Map<string, string>,
): string {
  const hasPartTypes = products.some((p) => p.partTypeKey);
  let html = renderFitmentFilter(fitmentFilterOptions(products), locale);
  if (!hasPartTypes) {
    return html + renderProductGrid(products, locale, currency, storeSlug, defaultLang, slugMap);
  }
  for (const ptGroup of groupProductsByPartType(products)) {
    const heading = ptGroup.label ? resolveLocalized(ptGroup.label, locale) : mt(locale, 'other');
    html += `  <h3 class="sf-subsection__title">${escapeHtml(heading)} <span class="sf-subsection__count">${ptGroup.products.length}</span></h3>\n`;
    html += renderProductGrid(ptGroup.products, locale, currency, storeSlug, defaultLang, slugMap);
  }
  return html;
}

export function renderStoreBody(
  manifest: Manifest,
  locale: string,
  defaultLang: string,
  svc?: TaxonomyService,
): string {
  const { store } = manifest;
  const groups = groupProductsByCategory(manifest);
  const slugMap = uniqueProductSlugs(manifest.products, defaultLang);

  // Ortak sticky üst header (store + market birebir aynı). Para birimi + dil
  // kontrolleri sağ kümede; mağaza kimliği (logo/isim) aşağıda hero olarak kalır.
  const controls = renderControls(locale, store.currency, store.languages ?? [], (l) => storeUrl(store.slug, l, defaultLang));
  let html = renderAppHeader({ locale, controlsHtml: controls });
  html += '<div class="sf-store app-has-header">\n';
  html += renderStoreHeader(manifest, locale, defaultLang);
  html += renderToolbar(groups, locale);

  for (const group of groups) {
    // svc varsa taxonomy label'ına fallback yapar; yoksa mevcut davranış korunur.
    const heading = svc
      ? resolveCategoryName(group.category?.id, group.category?.name, locale, svc)
      : (group.category ? resolveLocalized(group.category.name, locale) : mt(locale, 'other'));
    const id = group.category ? `cat-${group.category.id}` : 'cat-other';

    html += `<section class="sf-section" id="${escapeAttr(id)}" data-sf-cat="${escapeAttr(id)}">\n`;
    html += `  <h2 class="sf-section__title">${escapeHtml(heading)} <span class="sf-section__count">${group.products.length}</span></h2>\n`;
    html += renderCategoryProducts(group.products, locale, store.currency, store.slug, defaultLang, slugMap);
    html += '</section>\n';
  }

  // Mağazada hiç ürün yoksa: boş bölüm yerine şık boş durum.
  if (groups.length === 0) {
    html += renderEmptyState({ icon: '🛍️', title: mt(locale, 'noResults'), ctaHref: '/market', ctaLabel: mt(locale, 'backToMarket') });
  }

  html += renderAppFooter({
    locale,
    reportHref: `mailto:abuse@photozseo.com?subject=${encodeURIComponent('Report store: ' + store.slug)}`,
    reportLabelKey: 'reportStore',
  });

  html += '</div>\n';
  if (manifest.products.some((p) => p.fitment?.length)) html += fitmentFilterScript();
  html += controlsScript(locale);
  html += '  <script src="/storefront-buyer.js?v=8" defer></script>\n';
  html += '  <script src="https://accounts.google.com/gsi/client" async></script>\n';
  html += '  <script src="/auth.js?v=9" defer></script>\n';
  return html;
}

// ── renderGallery ────────────────────────────────────────────────────────────

function renderGallery(images: string[], alt: string): string {
  const escapedAlt = escapeHtml(alt);

  // Empty state — no broken button, just a placeholder.
  if (!images.length) {
    return '<div class="sf-gallery"><div class="sf-gallery__empty" aria-hidden="true">📷</div></div>\n';
  }

  const hasMultiple = images.length > 1;

  // Safely JSON-encode images for the inline data script.
  const imagesJson = JSON.stringify(images).replace(/<\/script>/gi, '<\\/script>');

  let html = '<div class="sf-gallery" data-sf-gallery>\n';

  // Main image button
  html += `  <button class="sf-gallery__main" data-sf-open aria-label="${escapedAlt} görselini görüntüle">\n`;
  html += `    <img src="${escapeAttr(images[0] ?? '')}" alt="${escapedAlt}" width="800" height="800" loading="eager" />\n`;
  html += '  </button>\n';

  // Thumbs
  if (hasMultiple) {
    html += '  <div class="sf-gallery__thumbs" role="list">\n';
    images.forEach((src, i) => {
      html += `    <button class="sf-gallery__thumb" data-sf-index="${i}" aria-label="Görsel ${i + 1} / ${images.length}" role="listitem">\n`;
      html += `      <img src="${escapeAttr(src)}" alt="${escapedAlt} ${i + 1}" width="64" height="64" loading="lazy" />\n`;
      html += '    </button>\n';
    });
    html += '  </div>\n';
  }

  // Lightbox overlay
  html += '  <div class="sf-lightbox" data-sf-lightbox role="dialog" aria-modal="true" aria-label="Image lightbox" hidden>\n';
  html += '    <button class="sf-lightbox__close" data-sf-close aria-label="Close">&#x2715;</button>\n';
  html += '    <button class="sf-lightbox__prev" data-sf-prev aria-label="Previous">&#x2039;</button>\n';
  html += `    <img class="sf-lightbox__img" data-sf-lightbox-img src="" alt="${escapedAlt}" />\n`;
  html += '    <button class="sf-lightbox__next" data-sf-next aria-label="Next">&#x203a;</button>\n';
  html += '    <span class="sf-lightbox__counter" data-sf-counter></span>\n';
  html += '  </div>\n';

  // Inline image data for the script
  html += `  <script type="application/json" data-sf-images>${imagesJson}</script>\n`;

  html += '</div>\n';

  // Inline vanilla JS (self-contained; copied from ProductGallery.astro logic)
  html += `<script>
(function () {
  var root = document.querySelector('[data-sf-gallery]');
  if (!root) return;
  var jsonEl = root.querySelector('[data-sf-images]');
  if (!jsonEl) return;
  var images = JSON.parse(jsonEl.textContent || '[]');
  if (!images.length) return;

  var lightbox = root.querySelector('[data-sf-lightbox]');
  if (lightbox && lightbox.parentElement !== document.body) {
    document.body.appendChild(lightbox);
  }
  var lightboxImg = lightbox ? lightbox.querySelector('[data-sf-lightbox-img]') : null;
  var counter = lightbox ? lightbox.querySelector('[data-sf-counter]') : null;
  var mainBtn = root.querySelector('[data-sf-open]');
  var mainImg = mainBtn ? mainBtn.querySelector('img') : null;

  var current = 0;

  function open(index) {
    current = ((index % images.length) + images.length) % images.length;
    update();
    if (lightbox) { lightbox.hidden = false; lightbox.classList.add('is-open'); }
    document.body.style.overflow = 'hidden';
    if (lightboxImg) lightboxImg.focus();
  }

  function close() {
    if (lightbox) { lightbox.hidden = true; lightbox.classList.remove('is-open'); }
    document.body.style.overflow = '';
    if (mainBtn) mainBtn.focus();
  }

  function update() {
    if (lightboxImg) lightboxImg.src = images[current] || '';
    if (counter) counter.textContent = (current + 1) + ' / ' + images.length;
    root.querySelectorAll('[data-sf-index]').forEach(function (btn) {
      var idx = parseInt(btn.dataset.sfIndex || '0', 10);
      btn.classList.toggle('sf-gallery__thumb--active', idx === current);
    });
    if (mainImg) mainImg.src = images[current] || '';
  }

  function prev() { current = ((current - 1) + images.length) % images.length; update(); }
  function next() { current = (current + 1) % images.length; update(); }

  if (mainBtn) mainBtn.addEventListener('click', function () { open(current); });

  root.querySelectorAll('[data-sf-index]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      current = parseInt(btn.dataset.sfIndex || '0', 10);
      update();
    });
  });

  if (lightbox) {
    var closeBtn = lightbox.querySelector('[data-sf-close]');
    var prevBtn = lightbox.querySelector('[data-sf-prev]');
    var nextBtn = lightbox.querySelector('[data-sf-next]');
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  });

  update();
})();
</script>\n`;

  return html;
}

// ── renderProductBody ────────────────────────────────────────────────────────

/**
 * Renders the product detail page body as an HTML string.
 * Mirrors ProductDetail.astro + ProductGallery.astro.
 */
export function renderProductBody(
  manifest: Manifest,
  product: Product,
  locale: string,
  defaultLang: string,
  svc?: TaxonomyService,
): string {
  const { store } = manifest;
  const slugMap = uniqueProductSlugs(manifest.products, defaultLang);
  const pSlug = slugMap.get(product.id) ?? product.id;
  const title = resolveLocalized(product.title, locale);
  const description = resolveLocalized(product.description, locale);
  const stock = stockLabel(product, locale);
  const sc = stockClass(product);
  const backHref = storeUrl(store.slug, locale, defaultLang);
  const backLabel = mt(locale, 'backToStore');
  const phone = store.contact.whatsapp ?? store.contact.phone;
  const waHref = phone ? productWhatsappHref(phone, title, locale) : null;
  const waLabel = mt(locale, 'orderViaWhatsApp');
  const specsHeading = mt(locale, 'productDetails');
  const rows = specRows(product, locale);
  const ship = shippingText(product.shipping, locale);

  // Renk swatchları için tag renk listesi oluştur
  const colorTags = (product.tags ?? []).filter((t) =>
    /^#[0-9a-fA-F]{3,6}$/.test(t) || ['red','blue','green','black','white','yellow','orange','purple','pink','navy','teal','gray','brown'].includes(t.toLowerCase())
  );

  // Ortak sticky üst header (dil/kur kontrolleri sağ kümede); geri linki içerikte kalır.
  const controls = renderControls(locale, store.currency, store.languages ?? [], (l) => productUrl(store.slug, pSlug, l, defaultLang));
  let html = renderAppHeader({ locale, controlsHtml: controls });
  html += '<div class="sf-store app-has-header">\n';
  html += '  <div class="sf-detail-top">\n';
  html += `    <a class="sf-back" href="${escapeAttr(backHref)}">← ${escapeHtml(backLabel)}</a>\n`;
  html += '  </div>\n';
  html += '  <div class="sf-detail">\n';

  // Gallery
  html += '    <div class="sf-detail__gallery">\n';
  html += renderGallery(product.images, title);
  html += '    </div>\n';

  // Info panel
  html += '    <div class="sf-detail__info">\n';

  // Breadcrumb (D5=B: #cat-<id> anchor bağlantıları; svc yoksa veya çözülemezse gizlenir)
  if (svc) {
    const segs = categoryBreadcrumb(product.categoryId, locale, svc);
    if (segs && segs.length) {
      html += '      <nav class="sf-breadcrumb" aria-label="breadcrumb">\n';
      html += `        <a href="${escapeAttr(storeUrl(store.slug, locale, defaultLang))}">${escapeHtml(store.displayName)}</a>\n`;
      for (const seg of segs) {
        const href = `${storeUrl(store.slug, locale, defaultLang)}#cat-${encodeURIComponent(seg.id)}`;
        html += `        <span class="sf-breadcrumb__sep">›</span><a href="${escapeAttr(href)}">${escapeHtml(seg.label)}</a>\n`;
      }
      html += '      </nav>\n';
    }
  }

  // Seller chip
  const sellerInitial = escapeHtml(store.displayName.charAt(0).toUpperCase());
  html += `      <div class="sf-seller-chip">\n`;
  html += `        <span class="sf-seller-chip__avatar">${sellerInitial}</span>\n`;
  html += `        <span class="sf-seller-chip__name">${escapeHtml(store.displayName)}</span>\n`;
  html += `        <span class="sf-seller-chip__verified" aria-label="Verified">✓</span>\n`;
  html += `      </div>\n`;

  html += `      <h1 class="sf-detail__title">${escapeHtml(title)}</h1>\n`;

  // Price block — new design
  const currency = product.currency ?? store.currency;
  const formattedPrice = product.price != null ? mkFormatDetailPrice(product.price, currency, locale) : null;
  if (formattedPrice) {
    html += '      <div class="sf-detail__price-row">\n';
    html += `        <span class="sf-detail__price">${escapeHtml(formattedPrice)}</span>\n`;
    if (stock) {
      html += `        <span class="sf-stock ${escapeHtml(sc)}">${escapeHtml(stock)}</span>\n`;
    }
    html += '      </div>\n';
  }

  // SKU
  if (product.sku) {
    html += `      <p class="sf-detail__sku">SKU: ${escapeHtml(product.sku)}</p>\n`;
  }

  // Color swatches
  if (colorTags.length > 0) {
    html += '      <p class="sf-swatches-label">Select Style</p>\n';
    html += '      <div class="sf-swatches">\n';
    colorTags.forEach((tag, i) => {
      const color = tag.startsWith('#') ? tag : tag;
      const sel = i === 0 ? ' sf-swatch--selected' : '';
      html += `        <button type="button" class="sf-swatch${sel}" style="background:${escapeHtml(color)}" aria-label="${escapeHtml(tag)}"></button>\n`;
    });
    html += '      </div>\n';
  }

  // Buy Now + Add to Cart
  const addLabel = mt(locale, 'addToCart');
  html += '      <div class="sf-btn-group">\n';
  if (waHref) {
    html += `        <a class="sf-btn sf-btn--buy" href="${escapeAttr(waHref)}" target="_blank" rel="noopener noreferrer">Buy Now</a>\n`;
  }
  html += `        <button type="button" class="sf-btn sf-btn--cart" data-mk-add="${escapeAttr(product.id)}" data-mk-title="${escapeAttr(title)}" data-mk-price="${escapeAttr(product.price != null ? String(product.price) : '')}" data-mk-currency="${escapeAttr(currency)}">${escapeHtml(addLabel)}</button>\n`;
  html += '      </div>\n';

  // The Narrative (description)
  if (description) {
    html += '      <div class="sf-narrative">\n';
    html += '        <p class="sf-narrative__heading">The Narrative</p>\n';
    html += `        <p class="sf-narrative__text">${escapeHtml(description)}</p>\n`;
    html += '      </div>\n';
  }

  // Specs
  if (rows.length > 0) {
    html += '      <div class="sf-specs-section">\n';
    html += `        <h2 class="sf-specs-heading">${escapeHtml(specsHeading)}</h2>\n`;
    html += '        <dl class="sf-specs">\n';
    for (const row of rows) {
      html += '          <div>\n';
      html += `            <dt>${escapeHtml(row.label)}</dt>\n`;
      html += `            <dd>${escapeHtml(row.value)}</dd>\n`;
      html += '          </div>\n';
    }
    html += '        </dl>\n';
    html += '      </div>\n';
  }

  // Shipping
  if (ship) {
    html += `      <p class="sf-detail__ship">📦 ${escapeHtml(ship)}</p>\n`;
  }

  // Tags
  const displayTags = (product.tags ?? []).filter((t) => !colorTags.includes(t));
  if (displayTags.length > 0) {
    html += '      <div class="sf-tags">\n';
    for (const tag of displayTags) {
      html += `        <span class="sf-tag">#${escapeHtml(tag)}</span>\n`;
    }
    html += '      </div>\n';
  }

  // Seller Reviews placeholder (static — real reviews need backend)
  html += '      <div class="sf-reviews">\n';
  html += `        <h2 class="sf-reviews__heading">Seller Reviews</h2>\n`;
  html += '        <div class="sf-reviews__summary">\n';
  html += '          <span class="sf-reviews__stars">★★★★★</span>\n';
  html += `          <span>${escapeHtml(store.displayName)}</span>\n`;
  html += '        </div>\n';
  html += '      </div>\n';

  // Platform-mechanism FAQ — visible content backing the FAQPage JSON-LD.
  // Conditional on real store data (order/payment/contact); never invented.
  const faqEntries = buildFaqEntries(store, locale);
  if (faqEntries.length > 0) {
    html += '      <section class="sf-faq">\n';
    html += `        <h2 class="sf-faq__heading">${escapeHtml(faqHeading(locale))}</h2>\n`;
    for (const e of faqEntries) {
      html += '        <details class="sf-faq__item">\n';
      html += `          <summary class="sf-faq__q">${escapeHtml(e.question)}</summary>\n`;
      html += `          <p class="sf-faq__a">${escapeHtml(e.answer)}</p>\n`;
      html += '        </details>\n';
    }
    html += '      </section>\n';
  }

  // Marketplace cart (store-scoped)
  const wa = store.contact.whatsapp ?? store.contact.phone ?? '';
  const pay = store.payment;
  const sendLabel = mt(locale, 'sendCart');
  const nameL = mt(locale, 'name');
  const phoneL = mt(locale, 'phone');
  const addrL = mt(locale, 'address');
  const noteL = mt(locale, 'note');
  const reqL = mt(locale, 'required');
  const refL = mt(locale, 'orderRef');
  const payL = mt(locale, 'payByTransfer');

  html += `      <div class="sf-cart" data-mk-cart-root data-mk-slug="${escapeAttr(store.slug)}" data-mk-whatsapp="${escapeAttr(wa)}">\n`;
  html += '        <ul class="sf-cart__list" data-mk-cart-list></ul>\n';
  html += `        <p class="sf-cart__total">${escapeHtml(mt(locale, 'total'))}: <span data-mk-total>0.00</span></p>\n`;
  html += '        <form class="sf-cart__form" data-mk-order-form novalidate>\n';
  html += `          <label>${escapeHtml(nameL)}<input name="name" required /></label><span data-mk-err="name" hidden class="sf-cart__err">${escapeHtml(reqL)}</span>\n`;
  html += `          <label>${escapeHtml(phoneL)}<input name="phone" type="tel" required /></label><span data-mk-err="phone" hidden class="sf-cart__err">${escapeHtml(reqL)}</span>\n`;
  html += `          <label>${escapeHtml(addrL)}<textarea name="address" required></textarea></label><span data-mk-err="address" hidden class="sf-cart__err">${escapeHtml(reqL)}</span>\n`;
  html += `          <label>${escapeHtml(noteL)}<textarea name="note"></textarea></label>\n`;
  html += `          <button type="submit" class="sf-btn sf-btn--order">${escapeHtml(sendLabel)}</button>\n`;
  html += '        </form>\n';
  html += '        <div class="sf-cart__payment" data-mk-payment hidden>\n';
  html += `          <p>${escapeHtml(refL)}: <strong data-mk-ref></strong></p>\n`;
  html += `          <p>${escapeHtml(payL)}</p>\n`;
  if (pay?.bankName) {
    html += `          <p>${escapeHtml(mt(locale, 'bankName'))}: <strong>${escapeHtml(pay.bankName)}</strong></p>\n`;
  }
  if (pay?.iban) {
    html += `          <p>IBAN: <strong>${escapeHtml(pay.iban)}</strong></p>\n`;
  }
  if (pay?.ibanName) {
    html += `          <p>${escapeHtml(mt(locale, 'ibanName'))}: <strong>${escapeHtml(pay.ibanName)}</strong></p>\n`;
  }
  if (pay?.swift) {
    html += `          <p>SWIFT/BIC: <strong>${escapeHtml(pay.swift)}</strong></p>\n`;
  }
  if (pay?.currencyCode) {
    html += `          <p>${escapeHtml(mt(locale, 'currency'))}: <strong>${escapeHtml(pay.currencyCode)}</strong></p>\n`;
  }
  html += `          <p>${escapeHtml(mt(locale, 'paymentDesc'))}: <strong data-mk-paydesc></strong></p>\n`;
  html += '        </div>\n';
  html += '      </div>\n';
  html += '      <script src="/marketplace-cart.js" defer></script>\n';
  html += '      <script src="/storefront-buyer.js?v=8" defer></script>\n';
  html += '      <script src="https://accounts.google.com/gsi/client" async></script>\n';
  html += '      <script src="/auth.js?v=9" defer></script>\n';

  // AI chat bar (placeholder)
  html += '      <div class="sf-ai-chat">\n';
  html += '        <input class="sf-ai-chat__input" type="text" placeholder="Ask AI about size or fit..." />\n';
  html += '        <button class="sf-ai-chat__btn" type="button" aria-label="Send">↑</button>\n';
  html += '      </div>\n';

  html += '    </div>\n'; // sf-detail__info
  html += '  </div>\n'; // sf-detail
  html += renderAppFooter({
    locale,
    reportHref: `mailto:abuse@photozseo.com?subject=${encodeURIComponent('Report store: ' + store.slug)}`,
    reportLabelKey: 'reportStore',
  });
  html += '</div>\n'; // sf-store
  html += controlsScript(locale);

  return html;
}

// ── JSON-LD builders (SEO structured data) ───────────────────────────────────────

/** Strip empty values so the JSON-LD stays clean. */
function compact<T extends Record<string, unknown>>(obj: T): T {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) delete obj[k];
  }
  return obj;
}

export function buildStoreJsonLd(manifest: Manifest, locale: string, canonical: string): string {
  const store = manifest.store;
  const loc = store.location;

  // Yerel SEO: lat/lng varsa GeoCoordinates (Store, schema.org'da LocalBusiness alt-tipi).
  const geo =
    loc && typeof loc.lat === 'number' && typeof loc.lng === 'number'
      ? { '@type': 'GeoCoordinates', latitude: loc.lat, longitude: loc.lng }
      : undefined;

  // Doğrulanmış sosyal profiller → marka entity birleştirme (sameAs).
  const sameAs = (store.contact.social ?? [])
    .map((s) => socialHref(s.type, s.value))
    .filter((u) => /^https?:\/\//.test(u));

  const ld = compact({
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: store.displayName,
    description: resolveLocalized(store.tagline, locale),
    url: canonical,
    image: store.logo,
    address: loc
      ? compact({
          '@type': 'PostalAddress',
          addressLocality: loc.city,
          addressCountry: loc.country,
        })
      : undefined,
    geo,
    areaServed: loc?.country,
    telephone: store.contact.phone,
    email: store.contact.email,
    sameAs,
  });
  return JSON.stringify(ld);
}

export function buildProductJsonLd(
  manifest: Manifest,
  product: Product,
  locale: string,
  canonical: string,
): string {
  const currency = product.currency ?? manifest.store.currency;
  const availability =
    product.inStock === false || product.stockQty === 0
      ? 'https://schema.org/OutOfStock'
      : 'https://schema.org/InStock';

  const offers =
    product.price != null
      ? compact({
          '@type': 'Offer',
          price: roundPrice(product.price, currency),
          priceCurrency: currency,
          availability,
          itemCondition: 'https://schema.org/NewCondition',
          url: canonical,
        })
      : undefined;

  const attr = product.attributes;
  const color = attr?.color ? resolveLocalized(attr.color, locale) : undefined;
  const material = attr?.material ? resolveLocalized(attr.material, locale) : undefined;
  const size = attr?.size ? resolveLocalized(attr.size, locale) : undefined;

  // gender/ageGroup → schema.org/PeopleAudience (yalnızca veri varsa).
  const gender = attr?.gender ? resolveLocalized(attr.gender, locale) : undefined;
  const ageGroup = attr?.ageGroup ? resolveLocalized(attr.ageGroup, locale) : undefined;
  const audience =
    gender || ageGroup
      ? compact({ '@type': 'PeopleAudience', suggestedGender: gender, suggestedAge: ageGroup })
      : undefined;

  // weightGrams → kilogram QuantitativeValue (UN/CEFACT KGM).
  const grams = product.shipping?.weightGrams;
  const weight =
    typeof grams === 'number' && grams > 0
      ? { '@type': 'QuantitativeValue', value: grams / 1000, unitCode: 'KGM' }
      : undefined;

  const ld = compact({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: resolveLocalized(product.title, locale),
    description: resolveLocalized(product.description, locale),
    image: product.images,
    sku: product.sku,
    gtin: product.attributes?.barcode,
    color,
    material,
    size,
    audience,
    weight,
    countryOfOrigin: attr?.countryOfOrigin,
    brand: manifest.store.displayName
      ? { '@type': 'Brand', name: manifest.store.displayName }
      : undefined,
    offers,
  });
  return JSON.stringify(ld);
}

/**
 * BreadcrumbList JSON-LD for a product page: Store home → (category trail) → product.
 * `svc` is optional — without it the trail gracefully degrades to Home → Product.
 */
export function buildBreadcrumbJsonLd(
  manifest: Manifest,
  product: Product,
  locale: string,
  origin: string,
  svc: TaxonomyService | undefined,
  defaultLang = 'en',
): string {
  const store = manifest.store;
  const slugMap = uniqueProductSlugs(manifest.products, defaultLang);
  const pSlug = slugMap.get(product.id) ?? product.id;

  const items: Array<Record<string, unknown>> = [];
  items.push({
    '@type': 'ListItem',
    position: 1,
    name: store.displayName,
    item: origin + storeUrl(store.slug, locale, defaultLang),
  });

  if (svc) {
    const segs = categoryBreadcrumb(product.categoryId, locale, svc);
    if (segs) {
      for (const seg of segs) {
        // Kategori derin-link'i yok; anchor'lı mağaza URL'i kullan (görünür breadcrumb ile aynı).
        items.push({
          '@type': 'ListItem',
          position: items.length + 1,
          name: seg.label,
          item: `${origin}${storeUrl(store.slug, locale, defaultLang)}#cat-${encodeURIComponent(seg.id)}`,
        });
      }
    }
  }

  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: resolveLocalized(product.title, locale),
    item: origin + productUrl(store.slug, pSlug, locale, defaultLang),
  });

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  });
}

/**
 * Organization entity for the store — builds brand identity for AI/LLM search (GEO)
 * and links verified social profiles via sameAs.
 */
export function buildOrganizationJsonLd(
  manifest: Manifest,
  origin: string,
  defaultLang = 'en',
): string {
  const store = manifest.store;
  const sameAs = (store.contact.social ?? [])
    .map((s) => socialHref(s.type, s.value))
    .filter((u) => /^https?:\/\//.test(u));

  const ld = compact({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: store.displayName,
    url: origin + storeUrl(store.slug, defaultLang, defaultLang),
    logo: store.logo,
    sameAs,
  });
  return JSON.stringify(ld);
}

/**
 * FAQPage JSON-LD from the conditional platform-mechanism FAQ. Returns '' when
 * there are no entries so the caller can skip emitting an empty block.
 */
export function buildFaqJsonLd(store: StoreInfo, locale: string): string {
  const entries = buildFaqEntries(store, locale);
  if (entries.length === 0) return '';
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: e.question,
      acceptedAnswer: { '@type': 'Answer', text: e.answer },
    })),
  });
}

/**
 * WebSite entity — gives AI engines a canonical site reference for the store.
 */
export function buildWebSiteJsonLd(
  manifest: Manifest,
  origin: string,
  defaultLang = 'en',
): string {
  const store = manifest.store;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: store.displayName,
    url: origin + storeUrl(store.slug, defaultLang, defaultLang),
  });
}
