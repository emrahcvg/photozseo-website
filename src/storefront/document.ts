/**
 * document.ts — Full HTML document wrapper for P2 storefront pages.
 * Wraps an already-rendered body (trusted HTML) with <html>, <head>, etc.
 */

import { escapeHtml } from './render';

const RTL_LANGS = ['ar', 'ur', 'fa'];

export interface DocumentOptions {
  title: string;
  description?: string;
  lang: string;
  body: string;
}

export function renderDocument(opts: DocumentOptions): string {
  const { title, description = '', lang, body } = opts;
  const dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
  const esc = escapeHtml;
  const escapedTitle = esc(title);
  const escapedDesc = esc(description);

  return `<!doctype html>
<html lang="${esc(lang)}" dir="${dir}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="${escapedDesc}" />
<title>${escapedTitle}</title>
<meta name="theme-color" content="#ffffff" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${escapedTitle}" />
<meta property="og:description" content="${escapedDesc}" />
<meta property="og:site_name" content="photoZseo" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${escapedTitle}" />
<meta name="twitter:description" content="${escapedDesc}" />
<meta name="robots" content="index, follow" />
<link rel="stylesheet" href="/storefront.css" />
</head>
<body>${body}</body>
</html>`;
}
