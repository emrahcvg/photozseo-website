import { describe, it, expect } from 'vitest';
import { handleMarket } from '../../functions/market/[[path]]';
import type { ProductRow, StoreRow } from './marketplace';
import type { Facets as LibFacets } from '../../functions/_lib/marketplace';

const product: ProductRow = {
  id: 's:p', store_slug: 's', title: 'Mat', description: 'd', category_id: 'c1',
  tags: '', price: 49.9, currency: 'USD', stock: 3, image_url: 'i.avif',
  product_path: '/store/s/product/mat',
};
const store: StoreRow = { slug: 's', name: 'Shop', city: 'Istanbul', country: 'TR', listed: 1 };
// P1-shaped facets (Record maps + priceMin/priceMax); the router adapts to render shape.
const facets: LibFacets = { categories: { c1: 1 }, cities: { Istanbul: 1 }, priceMin: 0, priceMax: 100, inStockCount: 1 };

const deps = {
  searchProducts: async () => ({ items: [product], facets, total: 1 }),
  listNewProducts: async () => ({ items: [product], total: 1 }),
  listStores: async () => ({ items: [store], total: 1 }),
} as any;

describe('handleMarket', () => {
  it('renders /market home with new products + stores', async () => {
    const res = await handleMarket([], { url: 'https://photozseo.com/market', lang: 'en', db: {} as any, ai: undefined, ...deps });
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain('Recommended for You');
    expect(html).toContain('Mat');
    expect(html).toContain('/store/s');
    expect(html).toContain('rel="canonical" href="https://photozseo.com/market"');
    // hreflang x-default present
    expect(html).toContain('hreflang="x-default"');
  });

  it('renders /market/search with results + facets', async () => {
    const res = await handleMarket(['search'], { url: 'https://photozseo.com/market/search?q=mat&sort=new', lang: 'en', db: {} as any, ai: undefined, ...deps });
    const html = await res.text();
    expect(html).toContain('value="mat"');
    expect(html).toContain('Istanbul');
    expect(html).toContain('results');
  });

  it('renders /market/stores', async () => {
    const res = await handleMarket(['stores'], { url: 'https://photozseo.com/market/stores', lang: 'en', db: {} as any, ai: undefined, ...deps });
    const html = await res.text();
    expect(html).toContain('Stores');
    expect(html).toContain('/store/s');
  });

  it('renders /market/c/<id>', async () => {
    const res = await handleMarket(['c', 'c1'], { url: 'https://photozseo.com/market/c/c1', lang: 'en', db: {} as any, ai: undefined, ...deps });
    const html = await res.text();
    expect(html).toContain('c1');
    expect(html).toContain('Mat');
  });

  it('404s an unknown subpath', async () => {
    const res = await handleMarket(['nope'], { url: 'https://photozseo.com/market/nope', lang: 'en', db: {} as any, ai: undefined, ...deps });
    expect(res.status).toBe(404);
  });
});
