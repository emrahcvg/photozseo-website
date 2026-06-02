import { describe, it, expect } from 'vitest';
import { buildMarketplaceSitemap } from '../../functions/marketplace-sitemap';
import type { ProductRow, StoreRow } from './marketplace';
import { productBearingL1Urls } from './market-sitemap';
import { createTaxonomyService, type TaxNode } from './taxonomy/service';
import tree from './taxonomy/__fixtures__/tree.fixture.json';

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

const svc = createTaxonomyService({
  tree: tree as TaxNode[], labels: { en: {} }, taxonomyVersion: 1,
});

describe('productBearingL1Urls', () => {
  it('distinct category_id\'lerin L1 atalarını URL\'ye çevirir', () => {
    const urls = productBearingL1Urls(['267', '187'], svc, 'https://photozseo.com');
    expect(urls).toContain('https://photozseo.com/market/c/222');
    expect(urls).toContain('https://photozseo.com/market/c/166');
  });
  it('aynı L1\'e düşen id\'ler tekilleşir', () => {
    const urls = productBearingL1Urls(['267', '262'], svc, 'https://photozseo.com');
    expect(urls.filter((u) => u.endsWith('/c/222'))).toHaveLength(1);
  });
  it('zaten L1 olan id kendini verir', () => {
    const urls = productBearingL1Urls(['222'], svc, 'https://x.com');
    expect(urls).toEqual(['https://x.com/market/c/222']);
  });
  it('çözülemeyen id atlanır (kırılmaz)', () => {
    const urls = productBearingL1Urls(['electronics.phones'], svc, 'https://x.com');
    expect(urls).toEqual([]);
  });
});
