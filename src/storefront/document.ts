/**
 * document.ts — Full HTML document wrapper for P2 storefront pages.
 * Wraps an already-rendered body (trusted HTML) with <html>, <head>, etc.
 */

import { escapeHtml } from './render';

const RTL_LANGS = ['ar', 'ur', 'fa'];

// Open Graph locale formatı (language_TERRITORY). Bilinmeyen dil → lang_LANG fallback.
const OG_LOCALE: Record<string, string> = {
  en: 'en_US',
  tr: 'tr_TR',
  de: 'de_DE',
  es: 'es_ES',
  pt: 'pt_BR',
  ja: 'ja_JP',
  ko: 'ko_KR',
  zh: 'zh_CN',
  ar: 'ar_AR',
  fa: 'fa_IR',
  ur: 'ur_PK',
  hi: 'hi_IN',
};

function ogLocale(lang: string): string {
  return OG_LOCALE[lang] ?? `${lang}_${lang.toUpperCase()}`;
}

export interface AlternateLink {
  lang: string;
  href: string;
}

export interface DocumentOptions {
  title: string;
  description?: string;
  lang: string;
  body: string;
  canonical?: string;
  alternates?: AlternateLink[];
  ogImage?: string;
  jsonLd?: string | string[]; // already JSON.stringify'd, NOT yet escaped for </script>; dizi verilirse her blok ayrı <script> olarak eklenir
  stylesheets?: string[];
  bodyScripts?: string[];
  robots?: string; // varsayılan "index, follow"; arama sonuç sayfaları "noindex, follow" geçer
  preloadImage?: string; // LCP görsel — <link rel="preload" as="image" fetchpriority="high"> enjekte eder
}

/** Neutralize a closing-script sequence so JSON-LD can't break out of its tag. */
function safeJsonLd(json: string): string {
  return json.replace(/<\/script>/gi, '<\\/script>');
}

export function renderDocument(opts: DocumentOptions): string {
  const { title, description = '', lang, body, canonical, alternates, ogImage, jsonLd, preloadImage } = opts;
  const dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
  const esc = escapeHtml;
  const escapedTitle = esc(title);
  const escapedDesc = esc(description);

  const twitterCard = ogImage ? 'summary_large_image' : 'summary';

  let head = `<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="${escapedDesc}" />
<title>${escapedTitle}</title>
<meta name="theme-color" content="#ffffff" />`;

  if (canonical) {
    head += `\n<link rel="canonical" href="${esc(canonical)}" />`;
  }

  for (const alt of alternates ?? []) {
    head += `\n<link rel="alternate" hreflang="${esc(alt.lang)}" href="${esc(alt.href)}" />`;
  }

  // Favicons (shared with main site assets in /public).
  head += `
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`;

  // Open Graph
  head += `
<meta property="og:type" content="website" />
<meta property="og:title" content="${escapedTitle}" />
<meta property="og:description" content="${escapedDesc}" />
<meta property="og:site_name" content="photoZseo" />`;
  if (canonical) head += `\n<meta property="og:url" content="${esc(canonical)}" />`;
  if (ogImage) head += `\n<meta property="og:image" content="${esc(ogImage)}" />`;
  head += `\n<meta property="og:locale" content="${esc(ogLocale(lang))}" />`;
  // Alternatif diller (mevcut dil ve x-default hariç) → og:locale:alternate.
  const seenOg = new Set<string>([ogLocale(lang)]);
  for (const alt of alternates ?? []) {
    if (alt.lang === 'x-default') continue;
    const ol = ogLocale(alt.lang);
    if (seenOg.has(ol)) continue;
    seenOg.add(ol);
    head += `\n<meta property="og:locale:alternate" content="${esc(ol)}" />`;
  }

  // Twitter
  head += `
<meta name="twitter:card" content="${twitterCard}" />
<meta name="twitter:title" content="${escapedTitle}" />
<meta name="twitter:description" content="${escapedDesc}" />`;
  if (ogImage) head += `\n<meta name="twitter:image" content="${esc(ogImage)}" />`;

  head += `
<meta name="robots" content="${esc(opts.robots ?? 'index, follow')}" />`;
  // Ortak tasarım sistemi (token'lar) her sayfada İLK yüklenir; ardından
  // sayfaya özel CSS (store → storefront.css, market → marketplace.css) gelir.
  const pageSheets = opts.stylesheets && opts.stylesheets.length ? opts.stylesheets : ['/storefront.css?v=aura39'];
  const sheets = ['/theme.css?v=2', ...pageSheets];
  for (const href of sheets) {
    head += `\n<link rel="stylesheet" href="${esc(href)}" />`;
  }

  if (preloadImage) {
    head += `\n<link rel="preload" as="image" href="${esc(preloadImage)}" fetchpriority="high" />`;
  }

  if (jsonLd) {
    const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    for (const b of blocks) head += `\n<script type="application/ld+json">${safeJsonLd(b)}</script>`;
  }

  let bodyScripts = '';
  for (const src of opts.bodyScripts ?? []) {
    bodyScripts += `<script src="${esc(src)}" defer></script>`;
  }

  return `<!doctype html>
<html lang="${esc(lang)}" dir="${dir}">
<head>
${head}
</head>
<body>${body}${bodyScripts}</body>
</html>`;
}
