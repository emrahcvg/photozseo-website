import { describe, it, expect } from 'vitest';
import { buildMarketplaceSitemap } from '../../functions/marketplace-sitemap';
import type { ProductRow, StoreRow } from './marketplace';

const products: ProductRow[] = [
  { id: 's:p', store_slug: 's', title: 'Mat', description: '', category_id: 'c', tags: '', price: 1, currency: 'USD', stock: 1, image_url: '', product_path: '/store/s/product/mat' },
];
const stores: StoreRow[] = [{ slug: 's', name: 'Shop', city: 'Istanbul', country: 'TR', listed: 1 }];

describe('buildMarketplaceSitemap', () => {
  const xml = buildMarketplaceSitemap(stores, products, 'https://photozseo.com');
  it('starts with the urlset declaration', () => {
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset');
  });
  it('includes /market and store + product URLs', () => {
    expect(xml).toContain('<loc>https://photozseo.com/market</loc>');
    expect(xml).toContain('<loc>https://photozseo.com/store/s</loc>');
    expect(xml).toContain('<loc>https://photozseo.com/store/s/product/mat</loc>');
  });
  it('XML-escapes ampersands in paths', () => {
    const x = buildMarketplaceSitemap([], [{ ...products[0], product_path: '/store/s/product/a&b' }], 'https://x.com');
    expect(x).toContain('a&amp;b');
    expect(x).not.toContain('a&b<');
  });
});
