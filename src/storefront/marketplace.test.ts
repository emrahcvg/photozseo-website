import { describe, it, expect } from 'vitest';
import { idToSlug as idToSlugT } from './taxonomy/slug-resolve';
import { mt, MK_LOCALES } from './marketplace-i18n';

describe('marketplace i18n', () => {
  it('covers the 15 site locales (fr/it/pl dahil)', () => {
    expect(MK_LOCALES).toEqual(['en', 'tr', 'de', 'es', 'pt', 'fr', 'it', 'pl', 'ja', 'ko', 'zh', 'ar', 'fa', 'ur', 'hi']);
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
  it('links to the marketplace product page', () => {
    expect(html).toContain(`href="/market/p/${encodeURIComponent(sampleProduct.id)}"`);
  });
  it('shows title and formatted price', () => {
    expect(html).toContain('Tesla Model Y Floor Mats');
    expect(html).toMatch(/49/);
  });
  it('first card is the LCP candidate (eager); later cards lazy-load', () => {
    expect(html).toContain('loading="eager" fetchpriority="high"');
    expect(renderProductCard(sampleProduct, 'en', 1)).toContain('loading="lazy"');
    expect(html).toContain('https://img.example/mat.avif');
  });
  it('renders a placeholder when out of stock (stock 0)', () => {
    const out = renderProductCard({ ...sampleProduct, stock: 0 }, 'tr');
    expect(out).toContain('Tükendi');
    expect(out).toContain('mk-card__badge--out');
  });
  it('no stock badges other than soldOut (in-stock/low-stock removed)', () => {
    const inStock = renderProductCard(sampleProduct, 'en'); // stock 12
    expect(inStock).not.toContain('mk-card__badge');
    expect(inStock).not.toContain('In Stock');
    const low = renderProductCard({ ...sampleProduct, stock: 2 }, 'en');
    expect(low).not.toContain('mk-card__badge');
    expect(low).not.toContain('Only');
  });
  it('empty media uses an SVG placeholder (no emoji)', () => {
    const out = renderProductCard({ ...sampleProduct, image_url: '' }, 'en');
    expect(out).toContain('mk-card__media-empty');
    expect(out).toContain('<svg class="mk-icon"');
    expect(out).not.toContain('📷');
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
  it('renders a letter avatar per store (no pin emoji)', () => {
    expect(html).toContain('mk-store__avatar');
    expect(html).toContain('>A</span>');
    expect(html).not.toContain('📍');
  });
});

import { renderMarketHome } from './marketplace';

describe('renderMarketHome (v3 İsviçre)', () => {
  const products: ProductRow[] = [sampleProduct, { ...sampleProduct, id: 'b:2', product_path: '/store/b/product/x', title: 'Second' }];
  const stores: StoreRow[] = [{ slug: 'ahmet-oto', name: 'Ahmet Oto', city: 'Istanbul', country: 'TR', listed: 1 }];
  const cats = [{ id: '222', count: 5 }, { id: '888', count: 0 }];
  const html = renderMarketHome({ products, stores, categories: cats, locale: 'en' });

  it('has a search form posting to /market/search (GET) with a 100-char cap', () => {
    expect(html).toContain('action="/market/search"');
    expect(html).toContain('name="q"');
    expect(html).toContain('maxlength="100"');
  });
  it('search input wires the autocomplete datalist', () => {
    expect(html).toContain('list="mk-suggest"');
    expect(html).toContain('data-mk-suggest');
    expect(html).toContain('<datalist id="mk-suggest"></datalist>');
  });
  it('hero: two-tone title, value proposition and three trust facts', () => {
    expect(html).toContain(`${mt('en', 'heroTitle')} <span class="mk-hero__muted">${mt('en', 'heroTitleMuted')}</span>`);
    expect(html).toContain(`<p class="mk-hero__sub">${mt('en', 'heroSub').replace(/'/g, '&#39;')}</p>`);
    expect(html.match(/class="mk-fact"/g)?.length).toBe(3);
    expect(html).toContain(mt('en', 'factReviewsTitle'));
  });
  it('category index lists every root with taxonomy id and count (empty ones too)', () => {
    expect(html).toContain('mk-cats');
    expect(html).toContain('<span class="mk-cat__id">222</span>');
    expect(html).toContain('href="/market/c/electronics"');
    expect(html).toContain('mk-cat mk-cat--empty');
    expect(html).not.toContain('mk-sidebar');
    expect(html).not.toContain('mk-chips');
  });
  it('single product grid with ranking transparency note, no Featured rail', () => {
    expect(html).toContain(mt('en', 'newProducts'));
    expect(html).toContain(mt('en', 'rankingNote'));
    expect(html).not.toContain(mt('en', 'featured'));
    expect(html).toContain('Tesla Model Y Floor Mats');
    expect(html).toContain('Second');
  });
  it('LCP: first 4 grid images eager + fetchpriority=high', () => {
    expect(html.match(/fetchpriority="high"/g)?.length).toBe(2);
    const many = Array.from({ length: 10 }, (_, i) => ({ ...sampleProduct, id: `s:p${i}`, title: `P${i}` }));
    const out = renderMarketHome({ products: many, stores: [], categories: [], locale: 'en' });
    expect(out.match(/fetchpriority="high"/g)?.length).toBe(4);
  });
  it('order flow explains the real three steps', () => {
    expect(html).toContain('mk-steps');
    for (const n of [1, 2, 3]) expect(html).toContain(mt('en', `step${n}Title`));
  });
  it('store table links each store to /store/<slug>', () => {
    expect(html).toContain('mk-table');
    expect(html).toContain('href="/store/ahmet-oto"');
    expect(html).toContain('Istanbul, TR');
  });
  it('seller CTA points to the localized site home', () => {
    expect(html).toContain('class="mk-sell__cta" href="/"');
    expect(renderMarketHome({ products, stores, categories: cats, locale: 'tr' })).toContain('class="mk-sell__cta" href="/tr/"');
  });
  it('single <main> landmark', () => {
    expect(html.match(/<main\b/g)?.length).toBe(1);
  });
  it('bottom tab bar: 4 tabs with SVG icons, discover active', () => {
    expect(html).toContain('mk-tab-bar');
    expect(html).toContain('href="/market/favorites"');
    expect(html).toContain('mk-tab-bar__item--active');
    expect(html.match(/mk-tab-bar__icon/g)?.length).toBe(4);
  });
  it('header carries the light/dark theme toggle', () => {
    expect(html).toContain('data-theme-toggle');
    expect(html).toContain(mt('en', 'themeToggle'));
  });
  it('escapes hostile product and store names', () => {
    const out = renderMarketHome({
      products: [{ ...sampleProduct, title: '<img src=x onerror=alert(1)>' }],
      stores: [{ slug: 'x', name: '<script>alert(1)</script>', city: '', country: '', listed: 1 }],
      categories: [], locale: 'en',
    });
    expect(out).not.toContain('<img src=x');
    expect(out).not.toContain('<script>alert(1)</script>');
  });
});

describe('renderMarketHome — empty marketplace', () => {
  const html = renderMarketHome({ products: [], stores: [], categories: [{ id: '222', count: 0 }], locale: 'en' });
  it('shows the honest opening state with counts instead of "No results"', () => {
    expect(html).toContain('mk-void');
    expect(html).toContain(mt('en', 'voidTitle'));
    expect(html).not.toContain(mt('en', 'noResults'));
    expect(html).not.toContain('class="mk-grid"');
  });
  it('still offers the category index and seller CTA', () => {
    expect(html).toContain('mk-cats');
    expect(html).toContain('mk-sell');
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
  it('renders the sheet backdrop + .mk-btn--apply (mk-btn-apply fixed)', () => {
    expect(html).toContain('mk-sheet-backdrop');
    expect(html).toContain('data-mk-backdrop');
    expect(html).toContain('mk-btn mk-btn--apply');
    expect(html).not.toContain('"mk-btn-apply"');
  });
  it('filter toggle carries an SVG icon + bottom tab bar present', () => {
    expect(html).toMatch(/mk-filter-toggle[^>]*>.*<svg class="mk-icon mk-icon--sm"/s);
    expect(html).toContain('mk-tab-bar');
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
  it('uses .mk-page-title + grid variant + tab bar (stores active)', () => {
    expect(html).toContain('mk-page-title');
    expect(html).toContain('mk-stores--grid');
    expect(html).toContain('mk-store__avatar');
    expect(html).toContain('mk-tab-bar');
    expect(html).toMatch(/mk-tab-bar__item--active" href="\/market\/stores"/);
  });
});

describe('renderCategoryPage', () => {
  const html = renderCategoryPage({ categoryId: 'electronics.phones', items: [sampleProduct], total: 1, locale: 'en' });
  it('shows the category id and a product card', () => {
    expect(html).toContain('electronics.phones');
    expect(html).toContain('Tesla Model Y Floor Mats');
  });
  it('has a tab bar and a breadcrumb with separated › spans', () => {
    expect(html).toContain('mk-tab-bar');
    expect(html).toContain('mk-breadcrumb__sep');
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
  it('shows the marketplace (not single-store) disclaimer', () => {
    expect(html).toContain(mt('en', 'marketFooterNote'));
  });
  it('links all legal pages, localized for non-English', () => {
    for (const page of ['marketplace-rules', 'store-terms', 'aup', 'privacy', 'terms']) {
      expect(html).toContain(`href="/${page}"`);
    }
    const tr = renderMarketFooter('tr');
    expect(tr).toContain('href="/tr/marketplace-rules"');
    expect(tr).toContain('href="/tr/privacy"');
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
  it('href kararlı slug URL (numeric id → slug)', () => {
    const html = rcc2([{ id: '267', count: 3 }], 'en', labelOf);
    expect(html).toContain(`/market/c/${idToSlugT('267')}`);
  });
});

describe('renderCategoryPage — breadcrumb + h1 label', () => {
  it('h1 leaf label, breadcrumb ara segmentler linkli', () => {
    const html = rcp2({
      categoryId: '267', items: [], total: 0, locale: 'en',
      breadcrumb: [{ id: '222', label: 'Electronics' }, { id: '267', label: 'Mobile Phones' }],
    });
    expect(html).toContain('<h1 class="mk-page-title">Mobile Phones</h1>');
    expect(html).toContain(`href="/market/c/${idToSlugT('222')}"`);
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
    expect(obj.itemListElement[0]).toMatchObject({ position: 1, name: 'Electronics', item: `https://photozseo.com/market/c/${idToSlugT('222')}` });
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
    expect(html).toContain(`href="/market/c/${idToSlugT('267')}"`);
    expect(html).toContain('Mobile Phones');
  });

  it('renders an "All Electronics" link to /market/c/222', () => {
    expect(html).toContain(`href="/market/c/${idToSlugT('222')}"`);
    expect(html).toMatch(/All[^<]*Electronics/);
  });

  it('renders Arts (no children) as a plain link href="/market/c/8"', () => {
    expect(html).toContain(`href="/market/c/${idToSlugT('8')}"`);
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

describe('renderMarketHome — categoryTree (geriye uyum)', () => {
  it('accepts categoryTree but renders the index instead of a sidebar', () => {
    const tree: CategoryTreeNode[] = [{ id: '222', label: 'Electronics', children: [] }];
    const html = renderMarketHome({ products: [sampleProduct], stores: [], categories: [{ id: '222', count: 1 }], locale: 'en', categoryTree: tree });
    expect(html).not.toContain('mk-sidebar');
    expect(html).toContain('mk-cats');
    expect(html).toContain('app-header');
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

describe('boş durum (app-empty)', () => {
  it('boş sepet şık empty-state + CTA gösterir (mk-acct-page__empty değil)', () => {
    const html = renderCartPage({ groups: [], locale: 'tr', loggedIn: true });
    expect(html).toContain('app-empty');
    expect(html).toContain('app-empty__cta');
    expect(html).not.toContain('mk-acct-page__empty');
  });
  it('boş favoriler app-empty + giriş yapılmamışsa signin butonu', () => {
    const html = renderFavoritesPage({ groups: [], locale: 'tr', loggedIn: false });
    expect(html).toContain('app-empty');
    expect(html).toContain('pz-signin-btn-acct');
  });
  it('boş arama sonucu app-empty (düz mk-no-results değil)', () => {
    const html = renderSearchPage({ items: [], facets: { categories: [], priceRange: { min: 0, max: 0 }, cities: [], inStockCount: 0 }, total: 0, locale: 'tr', query: { q: 'xyz' } });
    expect(html).toContain('app-empty');
  });
});

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

import { renderPager, renderProductPage as rpp3 } from './marketplace';

describe('renderPager', () => {
  const hrefFor = (n: number) => (n === 1 ? '/market/search?q=x' : `/market/search?q=x&page=${n}`);
  it('tek sayfada hiçbir şey basmaz', () => {
    expect(renderPager(40, { page: 1, pageSize: 40, hrefFor }, 'en')).toBe('');
  });
  it('rel=prev/next bağlantıları ve sayfa durumu', () => {
    const html = renderPager(100, { page: 2, pageSize: 40, hrefFor }, 'tr');
    expect(html).toContain('rel="prev" href="/market/search?q=x"');
    expect(html).toContain('rel="next" href="/market/search?q=x&amp;page=3"');
    expect(html).toContain('Sayfa 2 / 3');
  });
  it('son sayfada sonraki bağlantısı yok', () => {
    expect(renderPager(100, { page: 3, pageSize: 40, hrefFor }, 'en')).not.toContain('rel="next"');
  });
});

describe('renderProductPage — sepet düğmesi', () => {
  it('buyer API için ürün slug\'ını (iki nokta üst üste olmadan) taşır', () => {
    const html = rpp3({ ...sampleProduct, id: 'ahmet-oto:tesla-mats', price: 10, stock: 3, store_name: 'Ahmet Oto', whatsapp: '', city: '', country: '' } as never, 'en');
    expect(html).toContain('data-mk-pslug="tesla-mats"');
    expect(html).toContain('data-mk-cart-root-slug="ahmet-oto"');
    expect(html).toContain(`data-mk-added="${mt('en', 'addedToCart')}"`);
  });
});

describe('mt() — üretilmiş çeviri yedeği', () => {
  it('elle tablosu olmayan fr/it/pl, İngilizceye düşmeden üretilmiş çeviriyi kullanır', () => {
    for (const l of ['fr', 'it', 'pl']) expect(mt(l, 'heroTitle')).not.toBe(mt('en', 'heroTitle'));
  });
  it('bilinmeyen dil İngilizceye düşer', () => {
    expect(mt('xx', 'heroTitle')).toBe(mt('en', 'heroTitle'));
  });
});

describe('renderProductPage — satıcı kimliği ve şikâyet (Pazar Yeri Kuralları)', () => {
  it('satıcı adı, konum, mağaza bağlantısı ve şikâyet bağlantısı gösterir', () => {
    const html = rpp3({ ...sampleProduct, id: 'ahmet-oto:mat', price: 10, stock: 1, store_name: 'Ahmet Oto', whatsapp: '', city: 'Konya', country: 'TR' } as never, 'tr');
    expect(html).toContain(mt('tr', 'sellerIdentityHeading'));
    expect(html).toContain('href="/store/ahmet-oto"');
    expect(html).toContain('Konya, TR');
    expect(html).toContain('mailto:support@photozseo.com?subject=Report%20listing%3A%20ahmet-oto%3Amat');
    expect(html).toContain(mt('tr', 'reportProduct'));
  });
});
