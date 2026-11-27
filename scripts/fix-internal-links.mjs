// Derleme sonrası: iç bağlantıları sunucunun gerçek (eğik çizgili) adresine çevirir.
// Cloudflare Pages /path -> /path/ için 308 yönlendirmesi yapar; menü/alt bilgi linkleri eğik çizgisiz olunca
// Google bunları "Yönlendirmeli sayfa" diye sayıyor. Canonical/hreflang/sitemap zaten eğik çizgili.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://photozseo.com';
const SKIP_PREFIX = ['/api', '/ai/', '/img', '/pimg', '/ext', '/screenshots', '/.well-known', '/market', '/store', '/q/', '/chrome', '/cdn-cgi', '/_astro'];

export function normalizePath(path) {
  if (!path.startsWith('/') || path.startsWith('//') || path === '/') return path;
  const m = path.match(/^([^?#]*)([?#].*)?$/);
  const p = m[1], rest = m[2] || '';
  if (p.endsWith('/')) return path;
  const last = p.split('/').pop();
  if (last.includes('.')) return path;                       // dosya (.png, .xml, .txt ...)
  if (SKIP_PREFIX.some((s) => p === s || p.startsWith(s.endsWith('/') ? s : s + '/') || p.startsWith(s))) return path;
  return `${p}/${rest}`;
}

export function normalizeHtml(html) {
  html = html.replace(/(href=")(\/[^"]*)(")/g, (_, a, p, c) => a + normalizePath(p) + c);
  html = html.replace(/(href=")https:\/\/photozseo\.com(\/[^"]*)(")/g, (_, a, p, c) => a + SITE + normalizePath(p) + c);
  html = html.replace(/(["'])https:\/\/photozseo\.com(\/[^"'\s<>]*)(\1)/g, (_, q, p, q2) => q + SITE + normalizePath(p) + q2);
  return html;
}

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const f = join(dir, n);
    if (statSync(f).isDirectory()) walk(f, out); else if (n.endsWith('.html')) out.push(f);
  }
  return out;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dist = resolve(process.argv[2] || 'dist');
  let changed = 0;
  for (const f of walk(dist)) {
    const a = readFileSync(f, 'utf8'), b = normalizeHtml(a);
    if (a !== b) { writeFileSync(f, b); changed++; }
  }
  console.log(`[fix-internal-links] ${changed} HTML dosyası güncellendi`);
}
