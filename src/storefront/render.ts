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
  // encodeURI is not needed here — the helpers already produce valid URLs.
  // We only need to HTML-escape the characters that break out of attribute quotes.
  return escapeHtml(url);
}

// ── Stock class helper ────────────────────────────────────────────────────────

function stockClass(product: Product): string {
  if (product.inStock === false || product.stockQty === 0) return 'sf-stock--out';
  if (typeof product.stockQty === 'number' && product.stockQty <= 5) return 'sf-stock--low';
  return 'sf-stock--in';
}

// ── renderStoreHeader ────────────────────────────────────────────────────────

function renderStoreHeader(manifest: Manifest, locale: string): string {
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

  html += `  <nav class="sf-header__contact" aria-label="${escapeHtml(contactLabel)}">\n`;
  for (const b of buttons) {
    const external = !/^(tel:|mailto:)/.test(b.href);
    const extras = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    html += `    <a class="sf-btn" href="${escapeAttr(b.href)}"${extras}>${escapeHtml(b.label)}</a>\n`;
  }
  html += '  </nav>\n';
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
  const price = formatPrice(product.price, product.currency ?? currency, locale);
  const compareAt = formatPrice(product.compareAtPrice, product.currency ?? currency, locale);
  const image = product.images[0] ?? '';
  const soldOut = product.inStock === false;
  const href = productUrl(storeSlug, pSlug, locale, defaultLang);
  const stock = stockLabel(product, locale);
  const sc = stockClass(product);

  let html = `<a class="sf-card-link" href="${escapeAttr(href)}">\n`;
  html += '  <article class="sf-card">\n';
  html += '    <div class="sf-card__media">\n';
  if (image) {
    html += `      <img src="${escapeAttr(image)}" alt="${escapeHtml(title)}" loading="lazy" width="800" height="800" />\n`;
  }
  if (soldOut) {
    const badge = locale === 'tr' ? 'Tükendi' : 'Sold out';
    html += `      <span class="sf-card__badge">${escapeHtml(badge)}</span>\n`;
  }
  html += '    </div>\n';
  html += '    <div class="sf-card__body">\n';
  html += `      <h3 class="sf-card__title">${escapeHtml(title)}</h3>\n`;
  if (description) {
    html += `      <p class="sf-card__desc">${escapeHtml(description)}</p>\n`;
  }
  html += '      <div class="sf-card__price">\n';
  if (price) {
    html += `        <span class="sf-card__amount">${escapeHtml(price)}</span>\n`;
    if (compareAt) {
      html += `        <span class="sf-card__compare">${escapeHtml(compareAt)}</span>\n`;
    }
  } else {
    const contactTxt = locale === 'tr' ? 'Fiyat için iletişime geç' : 'Contact for price';
    html += `        <span class="sf-card__contact">${escapeHtml(contactTxt)}</span>\n`;
  }
  html += '      </div>\n';
  if (stock) {
    html += `      <span class="sf-stock ${escapeHtml(sc)}">${escapeHtml(stock)}</span>\n`;
  }
  html += '    </div>\n';
  html += '  </article>\n';
  html += '</a>\n';

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

// ── renderStoreBody ───────────────────────────────────────────────────────────

/**
 * Renders the full store page body as an HTML string.
 * Mirrors StorePage.astro → StoreHeader + CategorySection(s) + StoreFooter.
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

  html += renderStoreHeader(manifest, locale);

  for (const group of groups) {
    const heading = group.category
      ? resolveLocalized(group.category.name, locale)
      : (locale === 'tr' ? 'Diğer' : 'Other');

    html += '<section class="sf-section">\n';
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
  return html;
}

// ── renderGallery ────────────────────────────────────────────────────────────

function renderGallery(images: string[], alt: string): string {
  const hasMultiple = images.length > 1;
  const escapedAlt = escapeHtml(alt);

  // Safely JSON-encode images for the inline data script.
  // We replace </script> sequences to prevent script injection.
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
  const title = resolveLocalized(product.title, locale);
  const description = resolveLocalized(product.description, locale);
  const currency = product.currency ?? store.currency;
  const price = formatPrice(product.price, currency, locale);
  const compareAt = formatPrice(product.compareAtPrice, currency, locale);
  const stock = stockLabel(product, locale);
  const sc = stockClass(product);
  const backHref = storeUrl(store.slug, locale, defaultLang);
  const backLabel = locale === 'tr' ? 'Mağazaya dön' : 'Back to store';
  const phone = store.contact.whatsapp ?? store.contact.phone;
  const waHref = phone ? productWhatsappHref(phone, title, locale) : null;
  const waLabel = locale === 'tr' ? 'WhatsApp ile sipariş ver' : 'Order via WhatsApp';
  const noPrice = locale === 'tr' ? 'Fiyat için iletişime geç' : 'Contact for price';
  const specsHeading = locale === 'tr' ? 'Ürün Özellikleri' : 'Product details';
  const rows = specRows(product, locale);
  const ship = shippingText(product.shipping, locale);

  let html = '<div class="sf-store">\n';
  html += `  <a class="sf-back" href="${escapeAttr(backHref)}">← ${escapeHtml(backLabel)}</a>\n`;
  html += '  <div class="sf-detail">\n';

  // Gallery
  html += '    <div class="sf-detail__gallery">\n';
  html += renderGallery(product.images, title);
  html += '    </div>\n';

  // Info panel
  html += '    <div class="sf-detail__info">\n';
  html += `      <h1 class="sf-detail__title">${escapeHtml(title)}</h1>\n`;

  // Price block
  html += '      <div class="sf-card__price">\n';
  if (price) {
    html += `        <span class="sf-card__amount">${escapeHtml(price)}</span>\n`;
    if (compareAt) {
      html += `        <span class="sf-card__compare">${escapeHtml(compareAt)}</span>\n`;
    }
  } else {
    html += `        <span class="sf-card__contact">${escapeHtml(noPrice)}</span>\n`;
  }
  html += '      </div>\n';

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

  return html;
}
