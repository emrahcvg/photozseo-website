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
    expect(html).toContain('Recommended for You');
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
  it('marks the active sort chip as active', () => {
    expect(html).toMatch(/value="new"[^>]*mk-sort-chip--active|mk-sort-chip--active[^>]*value="new"/);
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
  it('has a report mailto to support@photozseo.com', () => {
    expect(html).toContain('mailto:support@photozseo.com');
    expect(html).toContain('Report');
  });
  it('repeats the trust badge', () => {
    expect(html).toContain('Independent sellers · bank transfer · no fake reviews');
  });
});

describe('renderMarketHome includes footer', () => {
  it('home body contains the report link', () => {
    const html = renderMarketHome({ products: [], stores: [], categories: [], locale: 'en' });
    expect(html).toContain('mailto:support@photozseo.com');
  });
});

import {
  renderCategoryChips as rcc2,
  renderCategoryPage as rcp2,
  buildBreadcrumbJsonLd,
  type LabelOf,
} from './marketplace';

const labelOf: LabelOf = (id, locale) => {
  const table: Record<string, Record<string, string>> = {
    en: { '267': 'Mobile Phones', '222': 'Electronics' },
    tr: { '267': 'Cep Telefonları', '222': 'Elektronik' },
  };
  return table[locale]?.[id] ?? table.en?.[id] ?? id;
};

describe('renderCategoryChips — label çözümü (BUG FIX)', () => {
  it('ham id yerine localized label basar', () => {
    const html = rcc2([{ id: '267', count: 3 }], 'tr', labelOf);
    expect(html).toContain('Cep Telefonları');
    expect(html).not.toContain('>267 <');
  });
  it('çözülemeyen id ham kalır (regresyon yok)', () => {
    const html = rcc2([{ id: 'c1', count: 1 }], 'en', labelOf);
    expect(html).toContain('c1');
  });
  it('href hâlâ numeric/ham id ile (kararlı URL)', () => {
    const html = rcc2([{ id: '267', count: 3 }], 'en', labelOf);
    expect(html).toContain('/market/c/267');
  });
});

describe('renderCategoryPage — breadcrumb + h1 label', () => {
  it('h1 leaf label, breadcrumb ara segmentler linkli', () => {
    const html = rcp2({
      categoryId: '267', items: [], total: 0, locale: 'en',
      breadcrumb: [{ id: '222', label: 'Electronics' }, { id: '267', label: 'Mobile Phones' }],
    });
    expect(html).toContain('<h1 class="mk-section__title">Mobile Phones</h1>');
    expect(html).toContain('href="/market/c/222"');
    expect(html).toContain('Electronics');
  });
  it('breadcrumb null ise ham id h1\'de (kırılmaz)', () => {
    const html = rcp2({ categoryId: 'electronics.phones', items: [], total: 0, locale: 'en', breadcrumb: null });
    expect(html).toContain('electronics.phones');
  });
});

describe('renderSearchPage — facet labelOf forwarding (BUG FIX)', () => {
  it('renderSearchPage facet kategori label\'ı lokalize eder, value ham id kalır', () => {
    const facets: Facets = { categories: [{ id: '267', count: 5 }], priceRange: { min: 0, max: 100 }, cities: [], inStockCount: 5 };
    const html = renderSearchPage({
      items: [], facets, total: 0, locale: 'tr',
      query: { q: undefined, sort: 'new', categoryId: undefined, city: undefined, minPrice: undefined, maxPrice: undefined, inStock: false },
      labelOf,
    });
    expect(html).toContain('Cep Telefonları');      // localized display
    expect(html).toContain('value="267"');           // raw id preserved
  });
});

describe('buildBreadcrumbJsonLd', () => {
  it('BreadcrumbList üretir', () => {
    const json = buildBreadcrumbJsonLd(
      [{ id: '222', label: 'Electronics' }, { id: '267', label: 'Mobile Phones' }],
      'https://photozseo.com',
    );
    const obj = JSON.parse(json);
    expect(obj['@type']).toBe('BreadcrumbList');
    expect(obj.itemListElement).toHaveLength(2);
    expect(obj.itemListElement[0]).toMatchObject({ position: 1, name: 'Electronics', item: 'https://photozseo.com/market/c/222' });
  });
});

import { renderCategorySidebar, type CategoryTreeNode } from './marketplace';

describe('renderCategorySidebar', () => {
  const tree: CategoryTreeNode[] = [
    {
      id: '222',
      label: 'Electronics',
      children: [{ id: '267', label: 'Mobile Phones', children: [] }],
    },
    { id: '8', label: 'Arts', children: [] },
  ];

  const html = renderCategorySidebar(tree, 'en');

  it('renders .mk-sidebar', () => {
    expect(html).toContain('mk-sidebar');
  });

  it('renders a <details> for Electronics (has children)', () => {
    expect(html).toContain('<details class="mk-sidebar__group">');
    expect(html).toContain('Electronics');
  });

  it('renders a child link href="/market/c/267" with label "Mobile Phones"', () => {
    expect(html).toContain('href="/market/c/267"');
    expect(html).toContain('Mobile Phones');
  });

  it('renders an "All Electronics" link to /market/c/222', () => {
    expect(html).toContain('href="/market/c/222"');
    expect(html).toMatch(/All[^<]*Electronics/);
  });

  it('renders Arts (no children) as a plain link href="/market/c/8"', () => {
    expect(html).toContain('href="/market/c/8"');
    expect(html).toContain('mk-sidebar__link--top');
    expect(html).toContain('Arts');
  });

  it('XSS: escapes a malicious label in tree', () => {
    const xssTree: CategoryTreeNode[] = [
      { id: 'x1', label: '<script>alert(1)</script>', children: [] },
    ];
    const out = renderCategorySidebar(xssTree, 'en');
    expect(out).not.toContain('<script>alert(1)</script>');
    expect(out).toContain('&lt;script&gt;');
  });

  it('XSS: escapes a malicious id in href', () => {
    const xssTree: CategoryTreeNode[] = [
      { id: '"><img src=x>', label: 'Bad', children: [] },
    ];
    const out = renderCategorySidebar(xssTree, 'en');
    expect(out).not.toContain('"><img src=x>');
  });

  it('empty tree renders sidebar with no links', () => {
    const out = renderCategorySidebar([], 'en');
    expect(out).toContain('mk-sidebar');
    expect(out).not.toContain('href="/market/c/');
  });
});

describe('renderMarketHome — categoryTree integration', () => {
  const products: ProductRow[] = [sampleProduct];
  const stores: StoreRow[] = [{ slug: 'ahmet-oto', name: 'Ahmet Oto', city: 'Istanbul', country: 'TR', listed: 1 }];
  const cats = [{ id: 'electronics.phones', count: 5 }];
  const tree: CategoryTreeNode[] = [
    { id: '222', label: 'Electronics', children: [{ id: '267', label: 'Mobile Phones', children: [] }] },
    { id: '8', label: 'Arts', children: [] },
  ];

  it('with categoryTree: renders mk-layout + mk-sidebar + mk-main', () => {
    const html = renderMarketHome({ products, stores, categories: cats, locale: 'en', categoryTree: tree });
    expect(html).toContain('mk-layout');
    expect(html).toContain('mk-sidebar');
    expect(html).toContain('mk-main');
  });

  it('without categoryTree: NO mk-layout (backward compat)', () => {
    const html = renderMarketHome({ products, stores, categories: cats, locale: 'en' });
    expect(html).not.toContain('mk-layout');
    expect(html).not.toContain('mk-sidebar');
    expect(html).not.toContain('mk-main');
  });

  it('empty categoryTree ([]) also produces no layout wrapper', () => {
    const html = renderMarketHome({ products, stores, categories: cats, locale: 'en', categoryTree: [] });
    expect(html).not.toContain('mk-layout');
  });

  it('ortak app-header sidebar varken de render edilir', () => {
    const html = renderMarketHome({ products, stores, categories: cats, locale: 'en', categoryTree: tree });
    expect(html).toContain('app-header');
    expect(html).toContain('app-brand');
  });

  it('existing content (hero, chips, products) preserved inside mk-main', () => {
    const html = renderMarketHome({ products, stores, categories: cats, locale: 'en', categoryTree: tree });
    expect(html).toContain('mk-hero');
    expect(html).toContain('mk-chips');
    expect(html).toContain('Tesla Model Y Floor Mats');
  });
});

import { renderFavoritesPage, renderCartPage } from './marketplace';
import type { BuyerGroup } from './marketplace';

const FAV_GROUPS: BuyerGroup[] = [
  {
    storeSlug: 'magaza-a', storeName: 'Mağaza A',
    items: [
      { storeSlug: 'magaza-a', productSlug: 'urun-1', title: 'Fren Balatası', price: 100, currency: 'TRY', stock: 7, imageUrl: 'a1.jpg', productPath: '/store/magaza-a/p/urun-1' },
    ],
  },
  {
    storeSlug: 'magaza-b', storeName: 'Mağaza B',
    items: [
      { storeSlug: 'magaza-b', productSlug: 'urun-9', title: 'Yağ Filtresi', price: 9, currency: 'USD', stock: 0, imageUrl: 'b9.jpg', productPath: '/store/magaza-b/p/urun-9' },
    ],
  },
];

describe('renderFavoritesPage', () => {
  it('mağazaya göre gruplar + favori kaldır butonu + ürün linki', () => {
    const html = renderFavoritesPage({ groups: FAV_GROUPS, locale: 'tr', loggedIn: true });
    expect(html).toContain('Favorilerim');
    expect(html).toContain('Mağaza A');
    expect(html).toContain('Mağaza B');
    expect(html).toContain('Fren Balatası');
    expect(html).toContain('data-mk-fav-remove');
    expect(html).toContain('href="/store/magaza-a/p/urun-1"');
    expect(html).toContain('Tükendi'); // stock 0 → soldOut
  });

  it('boş + giriş yok → boş mesaj + Giriş yap butonu', () => {
    const html = renderFavoritesPage({ groups: [], locale: 'tr', loggedIn: false });
    expect(html).toContain('Henüz favorin yok');
    expect(html).toContain('pz-signin-btn-acct');
  });

  it('boş + giriş var → Giriş yap butonu YOK', () => {
    const html = renderFavoritesPage({ groups: [], locale: 'tr', loggedIn: true });
    expect(html).not.toContain('pz-signin-btn-acct');
  });
});

describe('renderCartPage', () => {
  const CART_GROUPS: BuyerGroup[] = [
    {
      storeSlug: 'magaza-a', storeName: 'Mağaza A',
      items: [
        { storeSlug: 'magaza-a', productSlug: 'urun-1', title: 'Fren Balatası', price: 100, currency: 'TRY', stock: 7, imageUrl: 'a1.jpg', productPath: '/store/magaza-a/p/urun-1', qty: 2 },
        { storeSlug: 'magaza-a', productSlug: 'urun-2', title: 'Conta', price: 50, currency: 'TRY', stock: 3, imageUrl: 'a2.jpg', productPath: '/store/magaza-a/p/urun-2', qty: 1 },
      ],
    },
  ];

  it('adet kontrolleri + grup toplamı (2×100 + 1×50 = 250) + sipariş linki', () => {
    const html = renderCartPage({ groups: CART_GROUPS, locale: 'tr', loggedIn: true });
    expect(html).toContain('Sepetim');
    expect(html).toContain('data-mk-cart-inc');
    expect(html).toContain('data-mk-cart-dec');
    expect(html).toContain('data-mk-cart-remove');
    expect(html).toContain('data-price="100"');
    expect(html).toMatch(/Toplam:[^<]*250/);
    expect(html).toContain('/store/magaza-a#cart');
  });

  it('boş sepet → emptyCart mesajı', () => {
    const html = renderCartPage({ groups: [], locale: 'tr', loggedIn: true });
    expect(html).toContain('Sepetiniz boş');
  });
});

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

describe('marketplace.css', () => {
  const css = readFileSync(fileURLToPath(new URL('../../public/marketplace.css', import.meta.url)), 'utf8');
  const required = ['.mk-grid', '.mk-card', '.mk-chips', '.mk-stores', '.mk-facets', '.mk-trust', '.mk-searchbar', '.mk-filter-toggle', '.mk-sidebar', '.mk-layout'];
  it.each(required)('defines %s', (sel) => {
    expect(css).toContain(sel);
  });
  it('dark mode ortak theme.css tokenlarına bağlı (kendi dark bloğu yerine)', () => {
    // P-design-unify Faz 1: dark mode public/theme.css'e taşındı; marketplace.css
    // --mk-* değişkenlerini shared token'lara alias'lar.
    expect(css).toContain('--mk-bg:       var(--bg)');
    expect(css).toContain('--mk-accent:   var(--accent)');
  });
  it('theme.css ortak dark mode bloğunu içerir', () => {
    const theme = readFileSync(fileURLToPath(new URL('../../public/theme.css', import.meta.url)), 'utf8');
    expect(theme).toContain('prefers-color-scheme: dark');
  });
  it('uses a responsive grid (2 cols mobile baseline)', () => {
    expect(css).toContain('grid-template-columns');
  });
});
