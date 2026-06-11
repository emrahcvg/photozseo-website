/**
 * app-shell.ts — Store (/store/*) ve Market (/market/*) sayfalarının PAYLAŞTIĞI
 * sticky üst header, hesap widget'ı ve footer (P-design-unify Faz 2).
 *
 * Amaç: tüm storefront sayfalarında birebir aynı navigasyon kabuğu. Marka solda
 * (→ /market), sağda sistem kontrolleri (store: para birimi + dil, market: dil) +
 * sepet + hesap. Hesap widget'ı auth.js'in beklediği `pz-*` ID'lerini korur;
 * yalnızca class'lar `.app-acct` olarak ortaklaştırıldı.
 *
 * escapeHtml render.ts'te `function` bildirimi (hoisted) olduğundan render.ts ↔
 * app-shell çapraz importu güvenlidir.
 */

import { escapeHtml } from './render';
import { mt } from './marketplace-i18n';
import { GOOGLE_CLIENT_ID } from './auth/config';

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/"/g, '&quot;');
}

/** Google "Sign in" → avatar/dropdown. Markup pz-* ID'leriyle auth.js'e bağlıdır. */
export function renderAccountWidget(locale: string): string {
  const signIn = escapeHtml(mt(locale, 'signIn'));
  let html = `<div class="app-acct" id="pz-acct-root">\n`;
  html += `  <div id="pz-signin" class="app-acct__signin" data-client-id="${escapeAttr(GOOGLE_CLIENT_ID)}">\n`;
  html += `    <button type="button" class="app-acct__btn" id="pz-signin-btn" aria-label="${signIn}">\n`;
  html += '      <svg class="app-acct__glogo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">\n';
  html += '        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>\n';
  html += '        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>\n';
  html += '        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>\n';
  html += '        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>\n';
  html += '      </svg>\n';
  html += `      <span class="app-acct__btn-label">${signIn}</span>\n`;
  html += '    </button>\n';
  html += '  </div>\n';
  html += '  <div id="pz-user" class="app-acct__user" hidden></div>\n';
  html += '</div>\n';
  return html;
}

export interface AppHeaderOptions {
  locale: string;
  /** Sisteme özel kontroller (store: para birimi + dil, market: dil). Sağ kümede ilk gelir. */
  controlsHtml?: string;
  /** Sepet sayfası URL'i (ortak buyer sepeti). */
  cartHref?: string;
}

/** Ortak sticky üst header — store + market birebir aynı kabuk. */
export function renderAppHeader(opts: AppHeaderOptions): string {
  const { locale, controlsHtml = '', cartHref = '/market/cart' } = opts;
  const home = '/market';
  const cartLabel = escapeHtml(mt(locale, 'cart'));

  let html = '<header class="app-header">\n';
  html += '  <div class="app-header__inner">\n';
  html += `    <a class="app-brand" href="${escapeAttr(home)}" aria-label="photoZseo Market">\n`;
  html += '      <img class="app-brand__mark" src="/icon-128.png" alt="" width="26" height="26" aria-hidden="true" />\n';
  html += '      <span class="app-brand__name">photoZseo</span>\n';
  html += '    </a>\n';
  html += '    <div class="app-header__actions">\n';
  if (controlsHtml) html += controlsHtml;
  html += `      <a class="app-cart" href="${escapeAttr(cartHref)}" aria-label="${cartLabel}" title="${cartLabel}">\n`;
  html += '        <svg class="app-cart__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>\n';
  html += '      </a>\n';
  html += renderAccountWidget(locale).replace(/^/gm, '      ').trimStart();
  html += '    </div>\n';
  html += '  </div>\n';
  html += '</header>\n';
  return html;
}

export interface EmptyStateOptions {
  /** Büyük dekoratif ikon (emoji veya inline SVG metni). */
  icon: string;
  /** Ana başlık (mevcut i18n anahtarından çözülmüş metin). */
  title: string;
  /** İsteğe bağlı alt açıklama. */
  subtitle?: string;
  /** İsteğe bağlı birincil eylem. */
  ctaHref?: string;
  ctaLabel?: string;
  /** Eylemden önce eklenecek ekstra HTML (ör. giriş butonu). */
  extraHtml?: string;
}

/** Ortak "boş durum" bileşeni — çirkin boşluk yerine ikon + başlık + CTA. */
export function renderEmptyState(opts: EmptyStateOptions): string {
  let html = '<div class="app-empty">\n';
  html += `  <div class="app-empty__icon" aria-hidden="true">${opts.icon}</div>\n`;
  html += `  <p class="app-empty__title">${escapeHtml(opts.title)}</p>\n`;
  if (opts.subtitle) html += `  <p class="app-empty__subtitle">${escapeHtml(opts.subtitle)}</p>\n`;
  if (opts.extraHtml) html += opts.extraHtml;
  if (opts.ctaHref && opts.ctaLabel) {
    html += `  <a class="app-empty__cta" href="${escapeAttr(opts.ctaHref)}">${escapeHtml(opts.ctaLabel)}</a>\n`;
  }
  html += '</div>\n';
  return html;
}

export interface AppFooterOptions {
  locale: string;
  /** Kötüye kullanım/şikâyet bağlantısı (store ve market farklı mailto kullanır). */
  reportHref: string;
  /** Şikâyet bağlantısı etiketi anahtarı; varsayılan 'report'. */
  reportLabelKey?: string;
}

/** Ortak footer — güven rozeti + photoZseo marka linki + şikâyet. */
export function renderAppFooter(opts: AppFooterOptions): string {
  const { locale, reportHref, reportLabelKey = 'report' } = opts;
  let html = '<footer class="app-footer">\n';
  html += `  <p class="app-footer__trust">${escapeHtml(mt(locale, 'trustBadge'))}</p>\n`;
  html += '  <div class="app-footer__links">\n';
  html += '    <a class="app-footer__brand" href="https://photozseo.com" target="_blank" rel="noopener noreferrer">photoZseo</a>\n';
  html += '    <span class="app-footer__sep">·</span>\n';
  html += `    <a class="app-footer__report" href="${escapeAttr(reportHref)}">${escapeHtml(mt(locale, reportLabelKey))}</a>\n`;
  html += '    <span class="app-footer__sep">·</span>\n';
  html += '    <a class="app-footer__legal" href="/privacy">Privacy</a>\n';
  html += '    <span class="app-footer__sep">·</span>\n';
  html += '    <a class="app-footer__legal" href="/terms">Terms</a>\n';
  html += '  </div>\n';
  html += '</footer>\n';
  return html;
}
