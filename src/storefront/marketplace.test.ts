import { describe, it, expect } from 'vitest';
import { mt, MK_LOCALES } from './marketplace-i18n';

describe('marketplace i18n', () => {
  it('covers the 12 supported locales', () => {
    expect(MK_LOCALES).toEqual(['en', 'tr', 'de', 'es', 'pt', 'ja', 'ko', 'zh', 'ar', 'fa', 'ur', 'hi']);
  });

  it('returns the locale string when present', () => {
    expect(mt('tr', 'searchPlaceholder')).toBe('Ürün ara…');
    expect(mt('en', 'searchPlaceholder')).toBe('Search products…');
  });

  it('falls back to English for an unknown locale', () => {
    expect(mt('xx', 'newProducts')).toBe(mt('en', 'newProducts'));
  });

  it('returns the key itself for an unknown key (no crash)', () => {
    expect(mt('en', 'totallyMissingKey')).toBe('totallyMissingKey');
  });
});

import { parseTags, mkFormatPrice } from './marketplace';

describe('marketplace helpers', () => {
  it('parseTags handles JSON array strings', () => {
    expect(parseTags('["a","b"]')).toEqual(['a', 'b']);
  });
  it('parseTags handles CSV strings', () => {
    expect(parseTags('a, b ,c')).toEqual(['a', 'b', 'c']);
  });
  it('parseTags handles empty/garbage', () => {
    expect(parseTags('')).toEqual([]);
    expect(parseTags('   ')).toEqual([]);
  });
  it('mkFormatPrice formats a USD number', () => {
    expect(mkFormatPrice(1499, 'USD', 'en')).toMatch(/1,499/);
  });
  it('mkFormatPrice returns empty for null price', () => {
    expect(mkFormatPrice(null, 'USD', 'en')).toBe('');
  });
});

import { renderProductCard } from './marketplace';
import type { ProductRow, StoreRow, Facets } from './marketplace';

const sampleProduct: ProductRow = {
  id: 'ahmet-oto:paspas',
  store_slug: 'ahmet-oto',
  title: 'Tesla Model Y Floor Mats',
  description: 'All-weather mats',
  category_id: 'vehicles.accessories',
  tags: '["tesla","mats"]',
  price: 49.9,
  currency: 'USD',
  stock: 12,
  image_url: 'https://img.example/mat.avif',
  product_path: '/store/ahmet-oto/product/tesla-model-y-floor-mats',
};

describe('renderProductCard', () => {
  const html = renderProductCard(sampleProduct, 'en');
  it('links to product_path', () => {
    expect(html).toContain('href="/store/ahmet-oto/product/tesla-model-y-floor-mats"');
  });
  it('shows title and formatted price', () => {
    expect(html).toContain('Tesla Model Y Floor Mats');
    expect(html).toMatch(/49/);
  });
  it('lazy-loads the image', () => {
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('https://img.example/mat.avif');
  });
  it('renders a placeholder when out of stock (stock 0)', () => {
    const out = renderProductCard({ ...sampleProduct, stock: 0 }, 'tr');
    expect(out).toContain('Tükendi');
  });
  it('XSS: escapes a malicious title', () => {
    const out = renderProductCard({ ...sampleProduct, title: '<img src=x onerror=alert(1)>' }, 'en');
    expect(out).not.toContain('<img src=x onerror');
    expect(out).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });
});

import { renderCategoryChips, renderStoreStrip } from './marketplace';

describe('renderCategoryChips', () => {
  const facets: Facets = {
    categories: [{ id: 'electronics.phones', count: 5 }, { id: 'vehicles.accessories', count: 3 }],
    priceRange: { min: 0, max: 100 }, cities: [], inStockCount: 8,
  };
  const html = renderCategoryChips(facets.categories, 'en');
  it('renders an "All" chip linking to /market/search', () => {
    expect(html).toContain('href="/market/search"');
    expect(html).toContain('All');
  });
  it('renders one chip per category with its count', () => {
    expect(html).toContain('href="/market/c/electronics.phones"');
    expect(html).toContain('href="/market/c/vehicles.accessories"');
    expect(html).toContain('5');
  });
  it('XSS: escapes a malicious category id', () => {
    const out = renderCategoryChips([{ id: '"><script>', count: 1 }], 'en');
    expect(out).not.toContain('"><script>');
  });
});

describe('renderStoreStrip', () => {
  const stores: StoreRow[] = [
    { slug: 'ahmet-oto', name: 'Ahmet Oto', city: 'Istanbul', country: 'TR', listed: 1 },
    { slug: 'beta', name: 'Beta Shop', city: 'Izmir', country: 'TR', listed: 1 },
  ];
  const html = renderStoreStrip(stores, 'en');
  it('links each store to /store/<slug>', () => {
    expect(html).toContain('href="/store/ahmet-oto"');
    expect(html).toContain('href="/store/beta"');
  });
  it('shows store name and city', () => {
    expect(html).toContain('Ahmet Oto');
    expect(html).toContain('Istanbul');
  });
});

import { renderMarketHome } from './marketplace';

describe('renderMarketHome', () => {
  const products: ProductRow[] = [sampleProduct, { ...sampleProduct, id: 'b:2', product_path: '/store/b/product/x', title: 'Second' }];
  const stores: StoreRow[] = [{ slug: 'ahmet-oto', name: 'Ahmet Oto', city: 'Istanbul', country: 'TR', listed: 1 }];
  const cats = [{ id: 'electronics.phones', count: 5 }];
  const html = renderMarketHome({ products, stores, categories: cats, locale: 'en' });

  it('has a search form posting to /market/search (GET)', () => {
    expect(html).toContain('action="/market/search"');
    expect(html).toContain('name="q"');
  });
  it('renders the New products section heading', () => {
    expect(html).toContain('New products');
  });
  it('renders category chips and a store strip', () => {
    expect(html).toContain('/market/c/electronics.phones');
    expect(html).toContain('/store/ahmet-oto');
  });
  it('renders the trust badge', () => {
    expect(html).toContain('Independent sellers · bank transfer · no fake reviews');
  });
  it('renders a Featured slot placeholder (empty, no products)', () => {
    expect(html).toContain('mk-featured');
  });
  it('renders both product cards', () => {
    expect(html).toContain('Tesla Model Y Floor Mats');
    expect(html).toContain('Second');
  });
});

import { renderSearchPage } from './marketplace';

describe('renderSearchPage', () => {
  const facets: Facets = {
    categories: [{ id: 'electronics.phones', count: 5 }],
    priceRange: { min: 10, max: 200 },
    cities: [{ value: 'Istanbul', count: 4 }, { value: 'Izmir', count: 2 }],
    inStockCount: 6,
  };
  const html = renderSearchPage({
    items: [sampleProduct], facets, total: 1, locale: 'en',
    query: { q: 'tesla', sort: 'new', categoryId: 'electronics.phones', city: undefined, minPrice: undefined, maxPrice: undefined, inStock: false },
  });

  it('echoes the query in the search input value', () => {
    expect(html).toContain('value="tesla"');
  });
  it('renders the total result count', () => {
    expect(html).toContain('1');
    expect(html).toContain('results');
  });
  it('renders a sort select with the 3 options', () => {
    expect(html).toContain('name="sort"');
    expect(html).toContain('Newest');
    expect(html).toContain('Price: low to high');
    expect(html).toContain('Price: high to low');
  });
  it('renders category, city and price facets', () => {
    expect(html).toContain('electronics.phones');
    expect(html).toContain('Istanbul');
    expect(html).toContain('name="minPrice"');
    expect(html).toContain('name="maxPrice"');
  });
  it('marks the active sort option as selected', () => {
    expect(html).toMatch(/value="new"\s+selected/);
  });
  it('renders the mobile filter sheet toggle', () => {
    expect(html).toContain('mk-filter-toggle');
  });
  it('renders an inStock checkbox', () => {
    expect(html).toContain('name="inStock"');
  });
  it('shows no-results message when items empty', () => {
    const empty = renderSearchPage({ items: [], facets, total: 0, locale: 'en', query: { q: 'zzz', sort: 'new' } });
    expect(empty).toContain('No results found');
  });
});

import { renderStoresPage, renderCategoryPage, buildItemListJsonLd, buildStoreDirectoryJsonLd } from './marketplace';

describe('renderStoresPage', () => {
  const stores: StoreRow[] = [{ slug: 'ahmet-oto', name: 'Ahmet Oto', city: 'Istanbul', country: 'TR', listed: 1 }];
  const html = renderStoresPage({ stores, total: 1, locale: 'en' });
  it('renders the Stores heading and a store link', () => {
    expect(html).toContain('Stores');
    expect(html).toContain('/store/ahmet-oto');
  });
});

describe('renderCategoryPage', () => {
  const html = renderCategoryPage({ categoryId: 'electronics.phones', items: [sampleProduct], total: 1, locale: 'en' });
  it('shows the category id and a product card', () => {
    expect(html).toContain('electronics.phones');
    expect(html).toContain('Tesla Model Y Floor Mats');
  });
});

describe('JSON-LD builders', () => {
  it('buildItemListJsonLd produces an ItemList with absolute URLs', () => {
    const ld = JSON.parse(buildItemListJsonLd([sampleProduct], 'https://photozseo.com'));
    expect(ld['@type']).toBe('ItemList');
    expect(ld.itemListElement[0].url).toBe('https://photozseo.com/store/ahmet-oto/product/tesla-model-y-floor-mats');
  });
  it('buildStoreDirectoryJsonLd lists stores', () => {
    const ld = JSON.parse(buildStoreDirectoryJsonLd([{ slug: 'ahmet-oto', name: 'Ahmet Oto', city: 'Istanbul', country: 'TR', listed: 1 }], 'https://photozseo.com'));
    expect(ld['@type']).toBe('ItemList');
    expect(ld.itemListElement[0].url).toBe('https://photozseo.com/store/ahmet-oto');
  });
});

import { renderMarketFooter } from './marketplace';

describe('renderMarketFooter', () => {
  const html = renderMarketFooter('en');
  it('has a report mailto to abuse@photozseo.com', () => {
    expect(html).toContain('mailto:abuse@photozseo.com');
    expect(html).toContain('Report');
  });
  it('repeats the trust badge', () => {
    expect(html).toContain('Independent sellers · bank transfer · no fake reviews');
  });
});

describe('renderMarketHome includes footer', () => {
  it('home body contains the report link', () => {
    const html = renderMarketHome({ products: [], stores: [], categories: [], locale: 'en' });
    expect(html).toContain('mailto:abuse@photozseo.com');
  });
});
