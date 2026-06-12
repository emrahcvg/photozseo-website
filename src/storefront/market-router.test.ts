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
    expect(html).toContain('New products');
    expect(html).toContain('Mat');
    expect(html).toContain('/store/s');
    expect(html).toContain('rel="canonical" href="https://photozseo.com/market"');
    // hreflang x-default → default dil (en, parametresiz URL)
    expect(html).toContain('hreflang="x-default" href="https://photozseo.com/market"');
    expect(html).toContain('hreflang="en" href="https://photozseo.com/market"');
  });

  it('non-default locale gets a self-referencing ?lang canonical on /market', async () => {
    const res = await handleMarket([], { url: 'https://photozseo.com/market?lang=tr', lang: 'tr', db: {} as any, ai: undefined, ...deps });
    const html = await res.text();
    expect(html).toContain('rel="canonical" href="https://photozseo.com/market?lang=tr"');
    expect(html).toContain('hreflang="x-default" href="https://photozseo.com/market"');
  });

  it('includes og:image and WebSite SearchAction JSON-LD on /market home', async () => {
    const res = await handleMarket([], { url: 'https://photozseo.com/market', lang: 'en', db: {} as any, ai: undefined, ...deps });
    const html = await res.text();
    expect(html).toContain('property="og:image" content="https://photozseo.com/og-image.png"');
    expect(html).toContain('"SearchAction"');
    expect(html).toContain('https://photozseo.com/market/search?q={search_term_string}');
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

  it('renders /market/favorites (owner yok → boş durum)', async () => {
    const res = await handleMarket(['favorites'], { url: 'https://photozseo.com/market/favorites', lang: 'en', db: {} as any, ai: undefined, ...deps });
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain('My Favorites');
    expect(html).toContain('No favorites yet');
    expect(html).toContain('noindex');
  });

  it('renders /market/cart (owner yok → boş durum)', async () => {
    const res = await handleMarket(['cart'], { url: 'https://photozseo.com/market/cart', lang: 'en', db: {} as any, ai: undefined, ...deps });
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain('My Cart');
    expect(html).toContain('cart is empty');
    expect(html).toContain('/market-account.js');
  });

  it('404s an unknown subpath', async () => {
    const res = await handleMarket(['nope'], { url: 'https://photozseo.com/market/nope', lang: 'en', db: {} as any, ai: undefined, ...deps });
    expect(res.status).toBe(404);
  });

  it('serves /market/api/suggest as JSON via injected suggestProducts', async () => {
    const res = await handleMarket(['api', 'suggest'], {
      url: 'https://photozseo.com/market/api/suggest?q=ma', lang: 'en', db: {} as any, ai: undefined,
      ...deps, suggestProducts: async () => ['Mat', 'Macramé Wall Hanging'],
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');
    const data = await res.json() as { suggestions: string[] };
    expect(data.suggestions).toEqual(['Mat', 'Macramé Wall Hanging']);
  });

  it('suggest returns empty list when q is blank (no lib call)', async () => {
    const res = await handleMarket(['api', 'suggest'], {
      url: 'https://photozseo.com/market/api/suggest?q=', lang: 'en', db: {} as any, ai: undefined,
      ...deps, suggestProducts: async () => { throw new Error('should not be called'); },
    });
    const data = await res.json() as { suggestions: string[] };
    expect(data.suggestions).toEqual([]);
  });
});
