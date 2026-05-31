/**
 * document.ts — Full HTML document wrapper for P2 storefront pages.
 * Wraps an already-rendered body (trusted HTML) with <html>, <head>, etc.
 */

import { escapeHtml } from './render';

const RTL_LANGS = ['ar', 'ur', 'fa'];

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
  jsonLd?: string; // already JSON.stringify'd, NOT yet escaped for </script>
  stylesheets?: string[];
  bodyScripts?: string[];
}

/** Neutralize a closing-script sequence so JSON-LD can't break out of its tag. */
function safeJsonLd(json: string): string {
  return json.replace(/<\/script>/gi, '<\\/script>');
}

export function renderDocument(opts: DocumentOptions): string {
  const { title, description = '', lang, body, canonical, alternates, ogImage, jsonLd } = opts;
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

  // Twitter
  head += `
<meta name="twitter:card" content="${twitterCard}" />
<meta name="twitter:title" content="${escapedTitle}" />
<meta name="twitter:description" content="${escapedDesc}" />`;
  if (ogImage) head += `\n<meta name="twitter:image" content="${esc(ogImage)}" />`;

  head += `
<meta name="robots" content="index, follow" />`;
  const sheets = opts.stylesheets && opts.stylesheets.length ? opts.stylesheets : ['/storefront.css'];
  for (const href of sheets) {
    head += `\n<link rel="stylesheet" href="${esc(href)}" />`;
  }

  if (jsonLd) {
    head += `\n<script type="application/ld+json">${safeJsonLd(jsonLd)}</script>`;
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
