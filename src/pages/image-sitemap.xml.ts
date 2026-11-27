import type { APIRoute } from 'astro';
import { FIGURES, FIGURE_PLACEMENT } from '../i18n/figures';

const SITE = 'https://photozseo.com';
const LANGS = ['en', 'tr', 'de', 'es', 'fr', 'it', 'pt', 'pl', 'ja', 'ko', 'zh', 'ar', 'hi', 'fa', 'ur'] as const;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = () => {
  const pages: { loc: string; fid: string; lang: (typeof LANGS)[number] }[] = [];
  for (const lang of LANGS) {
    const prefix = lang === 'en' ? '' : `/${lang}`;
    for (const [slug, fid] of Object.entries(FIGURE_PLACEMENT)) pages.push({ loc: `${SITE}${prefix}/blog/${slug}`, fid, lang });
    pages.push({ loc: `${SITE}${prefix}/marketplace-image-sizes`, fid: 'marketplace-product-image-sizes-2026', lang });
  }
  const body = pages.map(({ loc, fid, lang }) => {
    const f = FIGURES[fid][lang];
    return `  <url>\n    <loc>${esc(loc)}</loc>\n    <image:image>\n      <image:loc>${SITE}/img/figures/${fid}-${lang}.webp</image:loc>\n      <image:title>${esc(f.caption)}</image:title>\n      <image:caption>${esc(f.alt)}</image:caption>\n    </image:image>\n  </url>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${body}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
