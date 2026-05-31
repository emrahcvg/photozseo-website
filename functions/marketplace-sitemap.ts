/** GET /marketplace-sitemap.xml — listed stores + their products (only listed=1). */
import { listStores as realListStores, listNewProducts as realListNew } from './_lib/marketplace';
import type { AiBinding } from './_lib/translate';
import type { ProductRow, StoreRow } from '../src/storefront/marketplace';

function xmlEscape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function buildMarketplaceSitemap(stores: StoreRow[], products: ProductRow[], origin: string): string {
  const urls: string[] = [`${origin}/market`, `${origin}/market/stores`];
  for (const s of stores) urls.push(`${origin}/store/${s.slug}`);
  for (const p of products) urls.push(`${origin}${p.product_path}`);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const u of urls) {
    xml += `  <url><loc>${xmlEscape(u)}</loc></url>\n`;
  }
  xml += '</urlset>\n';
  return xml;
}

interface Env {
  MARKET_DB: D1Database;
  AI?: AiBinding;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const origin = new URL(ctx.request.url).origin;
  const [stores, products] = await Promise.all([
    realListStores(ctx.env.MARKET_DB, { limit: 5000 }),
    realListNew(ctx.env.MARKET_DB, { limit: 5000 }),
  ]);
  const xml = buildMarketplaceSitemap(stores.items, products.items, origin);
  return new Response(xml, {
    status: 200,
    headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' },
  });
};
