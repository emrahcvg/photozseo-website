/**
 * render.ts — Framework-free HTML renderer for P2 (Cloudflare Pages Functions).
 * Pure TypeScript; no Astro, no DOM. Reuses pure helpers from ./manifest.
 * All user-provided strings are HTML-escaped to prevent XSS.
 */

import type { Manifest, Product } from './types';
import {
  resolveLocalized,
  formatPrice,
  groupProductsByCategory,
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

const LANG_NAMES: Record<string, string> = {
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
 */
function renderPriceBlock(product: Product, locale: string, fallbackCurrency: string): string {
  const currency = product.currency ?? fallbackCurrency;
  const price = formatPrice(product.price, currency, locale);
  const compareAt = formatPrice(product.compareAtPrice, currency, locale);

  let html = '<div class="sf-card__price">\n';
  if (price) {
    html += `  <span class="sf-card__amount sf-price" data-sf-amount="${product.price}" data-sf-currency="${escapeHtml(currency)}" data-sf-orig="${escapeHtml(price)}">${escapeHtml(price)}</span>\n`;
    if (compareAt) {
      html += `  <span class="sf-card__compare sf-price" data-sf-amount="${product.compareAtPrice}" data-sf-currency="${escapeHtml(currency)}" data-sf-orig="${escapeHtml(compareAt)}">${escapeHtml(compareAt)}</span>\n`;
    }
  } else {
    const contactTxt = locale === 'tr' ? 'Fiyat için iletişime geç' : 'Contact for price';
    html += `  <span class="sf-card__contact">${escapeHtml(contactTxt)}</span>\n`;
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
    const badge = locale === 'tr' ? 'Tükendi' : 'Sold out';
    html += `      <span class="sf-card__badge">${escapeHtml(badge)}</span>\n`;
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
  const tr = locale === 'tr';
  const currencyLabel = tr ? 'Para birimi' : 'Currency';
  const languageLabel = tr ? 'Dil' : 'Language';
  const note = tr ? '≈ yaklaşık · kur günlük güncellenir' : '≈ approx · rates updated daily';

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
  const contactLabel = locale === 'tr' ? 'İletişim' : 'Contact';

  const buttons: { label: string; href: string }[] = [];
  if (c.whatsapp) buttons.push({ label: 'WhatsApp', href: whatsappHref(c.whatsapp) });
  if (c.phone) buttons.push({ label: locale === 'tr' ? 'Ara' : 'Call', href: `tel:${c.phone}` });
  if (c.email) buttons.push({ label: 'E-mail', href: `mailto:${c.email}` });
  for (const s of c.social ?? []) {
    buttons.push({ label: escapeHtml(s.type), href: socialHref(s.type, s.value) });
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
      html += `    <a class="sf-btn" href="${escapeAttr(b.href)}"${extras}>${escapeHtml(b.label)}</a>\n`;
    }
    html += '  </nav>\n';
  }

  html += renderControls(locale, store.currency, store.languages ?? [], (l) => storeUrl(store.slug, l, defaultLang));

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

  let html = `<a class="sf-card-link" href="${escapeAttr(href)}" data-sf-search="${escapeHtml(haystack)}">\n`;
  html += '  <article class="sf-card">\n';
  html += renderCardMedia(image, title, soldOut, locale);
  html += '    <div class="sf-card__body">\n';
  html += `      <h3 class="sf-card__title">${escapeHtml(title)}</h3>\n`;
  if (description) {
    html += `      <p class="sf-card__desc">${escapeHtml(description)}</p>\n`;
  }
  html += renderPriceBlock(product, locale, currency).replace(/^/gm, '    ').trimStart();
  if (stock) {
    html += `      <span class="sf-stock ${escapeHtml(sc)}">${escapeHtml(stock)}</span>\n`;
  }
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
  const tr = locale === 'tr';
  const searchPlaceholder = tr ? 'Ürün ara…' : 'Search products…';
  const catsLabel = tr ? 'Kategoriler' : 'Categories';
  const noResults = tr ? 'Sonuç bulunamadı' : 'No results found';

  let html = '<div class="sf-toolbar">\n';
  html += `  <input type="search" class="sf-search" data-sf-search-input placeholder="${escapeHtml(searchPlaceholder)}" aria-label="${escapeHtml(searchPlaceholder)}" />\n`;

  if (groups.length > 1) {
    html += `  <nav class="sf-catnav" aria-label="${escapeHtml(catsLabel)}">\n`;
    for (const group of groups) {
      const id = group.category ? `cat-${group.category.id}` : 'cat-other';
      const name = group.category
        ? resolveLocalized(group.category.name, locale)
        : (tr ? 'Diğer' : 'Other');
      html += `    <a class="sf-catnav__link" href="#${escapeAttr(id)}">${escapeHtml(name)}</a>\n`;
    }
    html += '  </nav>\n';
  }

  html += `  <p class="sf-no-results" data-sf-no-results hidden>${escapeHtml(noResults)}</p>\n`;
  html += '</div>\n';
  return html;
}

// ── renderStoreFooter ────────────────────────────────────────────────────────

function renderStoreFooter(slug: string, locale: string): string {
  const poweredBy = locale === 'tr'
    ? 'Bu mağaza photoZseo ile oluşturuldu'
    : 'This store was created with photoZseo';
  const reportLabel = locale === 'tr' ? 'Bu mağazayı şikayet et' : 'Report this store';
  const reportHref = `mailto:abuse@photozseo.com?subject=${encodeURIComponent('Report store: ' + slug)}`;

  return (
    '<footer class="sf-footer">\n' +
    `  <a class="sf-footer__brand" href="https://photozseo.com" target="_blank" rel="noopener noreferrer">${escapeHtml(poweredBy)}</a>\n` +
    '  <span class="sf-footer__sep">·</span>\n' +
    `  <a class="sf-footer__report" href="${escapeAttr(reportHref)}">${escapeHtml(reportLabel)}</a>\n` +
    '</footer>\n'
  );
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

    function applyCurrency(target, rates) {
      var els = document.querySelectorAll('[data-sf-amount]');
      els.forEach(function (el) {
        var amount = parseFloat(el.getAttribute('data-sf-amount'));
        var from = el.getAttribute('data-sf-currency') || base;
        var orig = el.getAttribute('data-sf-orig') || '';
        if (isNaN(amount)) return;
        if (target === from || !rates) { el.textContent = orig; return; }
        var rFrom = rates[from], rTo = rates[target];
        if (!rFrom || !rTo) { el.textContent = orig; return; }
        var converted = (amount / rFrom) * rTo;
        el.textContent = '≈ ' + fmt(converted, target);
      });
      if (note) note.hidden = !rates || target === base;
    }

    function onChange() {
      var target = curSel.value;
      try { localStorage.setItem('sf-currency', target); } catch (e) {}
      if (target === base) { applyCurrency(target, null); return; }
      if (ratesCache) { applyCurrency(target, ratesCache); return; }
      fetch('/api/rates/' + encodeURIComponent(base))
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.rates) { ratesCache = data.rates; applyCurrency(target, ratesCache); }
        })
        .catch(function () {});
    }

    curSel.addEventListener('change', onChange);
    if (curSel.value !== base) onChange();
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
})();
</script>\n`;
}

// ── renderStoreBody ───────────────────────────────────────────────────────────

/**
 * Renders the full store page body as an HTML string.
 * Mirrors StorePage.astro → StoreHeader + Toolbar + CategorySection(s) + StoreFooter.
 */
export function renderStoreBody(
  manifest: Manifest,
  locale: string,
  defaultLang: string,
): string {
  const { store } = manifest;
  const groups = groupProductsByCategory(manifest);
  const slugMap = uniqueProductSlugs(manifest.products, defaultLang);

  let html = '<div class="sf-store">\n';

  html += renderStoreHeader(manifest, locale, defaultLang);
  html += renderToolbar(groups, locale);

  for (const group of groups) {
    const heading = group.category
      ? resolveLocalized(group.category.name, locale)
      : (locale === 'tr' ? 'Diğer' : 'Other');
    const id = group.category ? `cat-${group.category.id}` : 'cat-other';

    html += `<section class="sf-section" id="${escapeAttr(id)}">\n`;
    html += `  <h2 class="sf-section__title">${escapeHtml(heading)}</h2>\n`;
    html += '  <div class="sf-grid">\n';
    for (const product of group.products) {
      const pSlug = slugMap.get(product.id) ?? product.id;
      html += renderProductCard(product, locale, store.currency, store.slug, defaultLang, pSlug);
    }
    html += '  </div>\n';
    html += '</section>\n';
  }

  html += renderStoreFooter(store.slug, locale);

  html += '</div>\n';
  html += controlsScript(locale);
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
): string {
  const { store } = manifest;
  const slugMap = uniqueProductSlugs(manifest.products, defaultLang);
  const pSlug = slugMap.get(product.id) ?? product.id;
  const title = resolveLocalized(product.title, locale);
  const description = resolveLocalized(product.description, locale);
  const stock = stockLabel(product, locale);
  const sc = stockClass(product);
  const backHref = storeUrl(store.slug, locale, defaultLang);
  const backLabel = locale === 'tr' ? 'Mağazaya dön' : 'Back to store';
  const phone = store.contact.whatsapp ?? store.contact.phone;
  const waHref = phone ? productWhatsappHref(phone, title, locale) : null;
  const waLabel = locale === 'tr' ? 'WhatsApp ile sipariş ver' : 'Order via WhatsApp';
  const specsHeading = locale === 'tr' ? 'Ürün Özellikleri' : 'Product details';
  const rows = specRows(product, locale);
  const ship = shippingText(product.shipping, locale);

  let html = '<div class="sf-store">\n';
  html += '  <div class="sf-detail-top">\n';
  html += `    <a class="sf-back" href="${escapeAttr(backHref)}">← ${escapeHtml(backLabel)}</a>\n`;
  html += renderControls(locale, store.currency, store.languages ?? [], (l) => productUrl(store.slug, pSlug, l, defaultLang));
  html += '  </div>\n';
  html += '  <div class="sf-detail">\n';

  // Gallery
  html += '    <div class="sf-detail__gallery">\n';
  html += renderGallery(product.images, title);
  html += '    </div>\n';

  // Info panel
  html += '    <div class="sf-detail__info">\n';
  html += `      <h1 class="sf-detail__title">${escapeHtml(title)}</h1>\n`;

  // Price block (with conversion data attrs)
  html += renderPriceBlock(product, locale, store.currency).replace(/^/gm, '      ').trimStart();

  // Stock pill
  if (stock) {
    html += `      <span class="sf-stock ${escapeHtml(sc)}">${escapeHtml(stock)}</span>\n`;
  }

  // SKU
  if (product.sku) {
    html += `      <p class="sf-detail__sku">SKU: ${escapeHtml(product.sku)}</p>\n`;
  }

  // Description
  if (description) {
    html += `      <p class="sf-detail__desc">${escapeHtml(description)}</p>\n`;
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
  if (product.tags && product.tags.length > 0) {
    html += '      <div class="sf-tags">\n';
    for (const tag of product.tags) {
      html += `        <span class="sf-tag">#${escapeHtml(tag)}</span>\n`;
    }
    html += '      </div>\n';
  }

  // WhatsApp order button
  if (waHref) {
    html += `      <a class="sf-btn sf-btn--order" href="${escapeAttr(waHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(waLabel)}</a>\n`;
  }

  html += '    </div>\n'; // sf-detail__info
  html += '  </div>\n'; // sf-detail
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
  const ld = compact({
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: store.displayName,
    description: resolveLocalized(store.tagline, locale),
    url: canonical,
    image: store.logo,
    address: store.location
      ? compact({
          '@type': 'PostalAddress',
          addressLocality: store.location.city,
          addressCountry: store.location.country,
        })
      : undefined,
    telephone: store.contact.phone,
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
          price: product.price,
          priceCurrency: currency,
          availability,
          url: canonical,
        })
      : undefined;

  const ld = compact({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: resolveLocalized(product.title, locale),
    description: resolveLocalized(product.description, locale),
    image: product.images,
    sku: product.sku,
    gtin: product.attributes?.barcode,
    brand: manifest.store.displayName
      ? { '@type': 'Brand', name: manifest.store.displayName }
      : undefined,
    offers,
  });
  return JSON.stringify(ld);
}
