import { describe, it, expect, beforeEach } from 'vitest';
import { __resetOramaCache } from './marketplace';
import {
  storeRecordToStoreFields,
  storeRecordToProductRows,
  type ProductRow,
} from './marketplace';

beforeEach(() => __resetOramaCache());
import type { StoreRecord } from './registry';
import type { Manifest } from '../../src/storefront/types';

function makeRecord(over: Partial<Manifest['store']> = {}, products: Manifest['products'] = []): StoreRecord {
  const manifest: Manifest = {
    store: {
      slug: 'acme',
      displayName: 'ACME Store',
      tagline: { en: 'Best gear' },
      location: { city: 'Istanbul', country: 'TR' },
      contact: { whatsapp: '+905551112233' },
      languages: ['tr', 'en'],
      currency: 'USD',
      marketplaceListed: true,
      payment: { iban: 'TR0001', ibanName: 'Ahmet Yilmaz' },
      ...over,
    },
    categories: [{ id: 'electronics.phones', name: { en: 'Phones' } }],
    products,
    meta: { version: 4, updatedAt: '2026-05-31T10:00:00Z' },
  };
  return { manifest, status: 'active', version: 4, updatedAt: '2026-05-31T10:00:00Z' };
}

describe('storeRecordToStoreFields', () => {
  it('manifest store alanlarını D1 store satırına eşler; kanonik dil languages[0]', () => {
    const rec = makeRecord();
    const f = storeRecordToStoreFields('acme', rec, 99);
    expect(f.slug).toBe('acme');
    expect(f.name).toBe('ACME Store');
    expect(f.city).toBe('Istanbul');
    expect(f.country).toBe('TR');
    expect(f.iban).toBe('TR0001');
    expect(f.iban_name).toBe('Ahmet Yilmaz');
    expect(f.whatsapp).toBe('+905551112233');
    expect(f.listed).toBe(1);          // marketplaceListed true → 1
    expect(f.lang).toBe('tr');         // languages[0]
    expect(f.index_version).toBe(99);
    expect(typeof f.updated_at).toBe('string');
  });

  it('marketplaceListed yoksa/false ise listed=0', () => {
    const rec = makeRecord({ marketplaceListed: false });
    expect(storeRecordToStoreFields('acme', rec, 1).listed).toBe(0);
    const rec2 = makeRecord({ marketplaceListed: undefined });
    expect(storeRecordToStoreFields('acme', rec2, 1).listed).toBe(0);
  });
});

describe('storeRecordToProductRows', () => {
  it('her ürünü kanonik dilde D1 satırına eşler; id=<slug>:<productSlug>', () => {
    const rec = makeRecord({}, [
      {
        id: 'p1',
        categoryId: 'electronics.phones',
        title: { tr: 'Akilli Telefon', en: 'Smart Phone' },
        description: { tr: 'Hizli', en: 'Fast' },
        price: 199.9,
        currency: 'USD',
        inStock: true,
        stockQty: 5,
        images: ['https://drive/img1.jpg'],
        tags: ['yeni', 'kampanya'],
      },
    ]);
    const rows: ProductRow[] = storeRecordToProductRows('acme', rec);
    expect(rows).toHaveLength(1);
    const r = rows[0];
    expect(r.store_slug).toBe('acme');
    expect(r.id).toContain('acme:');          // <slug>:<productSlug>
    expect(r.title).toBe('Akilli Telefon');   // kanonik dil tr
    expect(r.description).toBe('Hizli');
    expect(r.category_id).toBe('electronics.phones');
    expect(r.tags).toBe('yeni,kampanya');     // CSV
    expect(r.price).toBe(199.9);
    expect(r.currency).toBe('USD');
    expect(r.stock).toBe(5);
    expect(r.image_url).toBe('https://drive/img1.jpg');
    expect(r.product_path).toContain('/store/acme/product/');
  });

  it('stockQty yoksa inStock false → stock 0, true → 1', () => {
    const rec = makeRecord({}, [
      { id: 'p2', title: { tr: 'X' }, images: [], inStock: true },
      { id: 'p3', title: { tr: 'Y' }, images: [], inStock: false },
    ]);
    const rows = storeRecordToProductRows('acme', rec);
    expect(rows[0].stock).toBe(1);
    expect(rows[1].stock).toBe(0);
  });
});

import { makeFakeD1 } from './fakeD1';
import { bumpIndexVersion, getIndexVersion } from './marketplace';

describe('index version sayacı', () => {
  it('getIndexVersion başlangıçta 0', async () => {
    const { db } = makeFakeD1();
    expect(await getIndexVersion(db as any)).toBe(0);
  });
  it('bumpIndexVersion artırır ve yeni değeri döner', async () => {
    const { db } = makeFakeD1();
    expect(await bumpIndexVersion(db as any)).toBe(1);
    expect(await bumpIndexVersion(db as any)).toBe(2);
    expect(await getIndexVersion(db as any)).toBe(2);
  });
});

import { upsertStoreToD1, removeStoreFromD1 } from './marketplace';

describe('upsertStoreToD1', () => {
  it('store + ürünleri D1\'e yazar; listed=1, ürün id\'leri slug ön ekli', async () => {
    const { db, tables } = makeFakeD1();
    const rec = makeRecord({}, [
      { id: 'p1', categoryId: 'electronics.phones', title: { tr: 'Telefon' }, price: 100, currency: 'USD', inStock: true, images: ['a.jpg'] },
    ]);
    await upsertStoreToD1(db as any, 'acme', rec);
    expect(tables.stores).toHaveLength(1);
    expect(tables.stores[0].slug).toBe('acme');
    expect(tables.stores[0].listed).toBe(1);
    expect(tables.products).toHaveLength(1);
    expect(tables.products[0].store_slug).toBe('acme');
    expect(String(tables.products[0].id)).toContain('acme:');
  });

  it('replace: ikinci upsert eski ürünleri siler, yenileri yazar', async () => {
    const { db, tables } = makeFakeD1();
    await upsertStoreToD1(db as any, 'acme', makeRecord({}, [
      { id: 'p1', title: { tr: 'Eski' }, images: [] },
      { id: 'p2', title: { tr: 'Eski2' }, images: [] },
    ]));
    expect(tables.products).toHaveLength(2);
    await upsertStoreToD1(db as any, 'acme', makeRecord({}, [
      { id: 'p3', title: { tr: 'Yeni' }, images: [] },
    ]));
    expect(tables.products).toHaveLength(1);
    expect(tables.products[0].title).toBe('Yeni');
  });
});

describe('removeStoreFromD1', () => {
  it('mağazayı ve tüm ürünlerini D1\'den siler', async () => {
    const { db, tables } = makeFakeD1();
    await upsertStoreToD1(db as any, 'acme', makeRecord({}, [
      { id: 'p1', title: { tr: 'X' }, images: [] },
    ]));
    expect(tables.stores).toHaveLength(1);
    await removeStoreFromD1(db as any, 'acme');
    expect(tables.stores).toHaveLength(0);
    expect(tables.products).toHaveLength(0);
  });
});

import { listStores, listNewProducts } from './marketplace';

async function seedTwoStores() {
  const { db, tables } = makeFakeD1();
  await upsertStoreToD1(db as any, 'acme', makeRecord({ displayName: 'ACME' }, [
    { id: 'p1', categoryId: 'electronics.phones', title: { tr: 'Telefon' }, price: 100, inStock: true, images: ['a.jpg'] },
    { id: 'p2', categoryId: 'home.kitchen', title: { tr: 'Tava' }, price: 50, inStock: true, images: ['b.jpg'] },
  ]));
  await upsertStoreToD1(db as any, 'beta', makeRecord({ slug: 'beta', displayName: 'BETA', marketplaceListed: false }, [
    { id: 'p3', categoryId: 'electronics.phones', title: { tr: 'Telefon2' }, price: 200, inStock: false, images: ['c.jpg'] },
  ]));
  return { db, tables };
}

describe('listStores', () => {
  it('sadece listed=1 mağazaları döner', async () => {
    const { db } = await seedTwoStores();
    const res = await listStores(db as any, {});
    expect(res.total).toBe(1);
    expect(res.items[0].slug).toBe('acme');
  });
});

describe('listNewProducts', () => {
  it('yalnız listed mağaza ürünlerini döner (limit yok)', async () => {
    // beta (marketplaceListed:false) hariç → yalnız acme'nin 2 ürünü.
    const { db } = await seedTwoStores();
    const res = await listNewProducts(db as any, {});
    expect(res.total).toBe(2);
  });
  it('categoryId filtreler (listed-only)', async () => {
    // beta p3 electronics.phones unlisted → sadece acme p1 kalır.
    const { db } = await seedTwoStores();
    const res = await listNewProducts(db as any, { categoryId: 'electronics.phones' });
    expect(res.total).toBe(1);
  });
  it('limit + offset uygular', async () => {
    const { db } = await seedTwoStores();
    const res = await listNewProducts(db as any, { limit: 1, offset: 1 });
    expect(res.items).toHaveLength(1);
    expect(res.total).toBe(2); // total filtre sonrası ama sayfalama öncesi (listed-only)
  });
});

import { getOrama, computeFacets, applyFilters } from './marketplace';

describe('computeFacets', () => {
  it('kategori + şehir sayar, fiyat aralığı bulur', () => {
    const rows: any[] = [
      { category_id: 'a', city: 'Istanbul', price: 100, stock: 5 },
      { category_id: 'a', city: 'Izmir', price: 50, stock: 0 },
      { category_id: 'b', city: 'Istanbul', price: 200, stock: 3 },
    ];
    const f = computeFacets(rows);
    expect(f.categories['a']).toBe(2);
    expect(f.categories['b']).toBe(1);
    expect(f.cities['Istanbul']).toBe(2);
    expect(f.priceMin).toBe(50);
    expect(f.priceMax).toBe(200);
    expect(f.inStockCount).toBe(2);
  });
});

describe('applyFilters', () => {
  const rows: any[] = [
    { id: '1', category_id: 'a', city: 'Istanbul', price: 100, stock: 5 },
    { id: '2', category_id: 'b', city: 'Izmir', price: 50, stock: 0 },
    { id: '3', category_id: 'a', city: 'Istanbul', price: 300, stock: 2 },
  ];
  it('categoryId filtreler', () => {
    expect(applyFilters(rows, { categoryId: 'a' }).map((r) => r.id)).toEqual(['1', '3']);
  });
  it('fiyat aralığı', () => {
    expect(applyFilters(rows, { minPrice: 60, maxPrice: 200 }).map((r) => r.id)).toEqual(['1']);
  });
  it('inStock', () => {
    expect(applyFilters(rows, { inStock: true }).map((r) => r.id)).toEqual(['1', '3']);
  });
  it('city', () => {
    expect(applyFilters(rows, { city: 'Izmir' }).map((r) => r.id)).toEqual(['2']);
  });
});

describe('getOrama', () => {
  it('D1\'den indeks kurar; index_version değişince yeniden kurar', async () => {
    const { db } = await seedTwoStores();
    const idx1 = await getOrama(db as any);
    expect(idx1.version).toBe(await getIndexVersion(db as any));
    // version artmadıkça aynı instance dönmeli (cache)
    const idx2 = await getOrama(db as any);
    expect(idx2).toBe(idx1);
  });
});

import { searchProducts } from './marketplace';

// translate.test.ts'teki fakeAI deseni.
function fakeAI(map: Record<string, string> = {}) {
  let calls = 0;
  const ai = {
    run: async (_m: string, inputs: any) => {
      calls++;
      const user = (inputs.messages ?? []).find((x: any) => x.role === 'user')?.content ?? '';
      return { response: map[user] ?? user };
    },
  };
  return { ai, get calls() { return calls; } };
}

describe('searchProducts', () => {
  it('sadece listed mağaza ürünlerini filtre + facet ile döner', async () => {
    // beta (marketplaceListed:false) hariç tutulur → yalnız acme'nin 2 ürünü.
    const { db } = await seedTwoStores();
    const { ai } = fakeAI();
    const res = await searchProducts(db as any, ai as any, {});
    expect(res.total).toBe(2);
    expect(res.facets.categories['electronics.phones']).toBe(1);
    expect(res.facets.cities['Istanbul']).toBeGreaterThan(0);
  });

  it('q full-text Orama ile filtreler', async () => {
    const { db } = await seedTwoStores();
    const { ai } = fakeAI();
    const res = await searchProducts(db as any, ai as any, { q: 'Tava' });
    expect(res.total).toBe(1);
    expect(res.items[0].title).toBe('Tava');
  });

  it('categoryId + minPrice filtreler', async () => {
    // Yalnız listed acme görünür: p1 electronics.phones@100, p2 home.kitchen@50.
    const { db } = await seedTwoStores();
    const { ai } = fakeAI();
    const res = await searchProducts(db as any, ai as any, { categoryId: 'electronics.phones', minPrice: 60 });
    expect(res.total).toBe(1);
    expect(res.items[0].price).toBe(100);
  });

  it('sort price_asc fiyata göre sıralar', async () => {
    const { db } = await seedTwoStores();
    const { ai } = fakeAI();
    const res = await searchProducts(db as any, ai as any, { sort: 'price_asc' });
    const prices = res.items.map((r) => r.price);
    expect(prices).toEqual([...prices].sort((a, b) => (a! - b!)));
  });

  it('q farklı dildeyse AI ile kanonik dile çevirir', async () => {
    const { db } = await seedTwoStores();
    // Kanonik dil tr (makeRecord languages[0]='tr'). İngilizce sorgu "Pan" → "Tava".
    const { ai } = fakeAI({ Pan: 'Tava' });
    const res = await searchProducts(db as any, ai as any, { q: 'Pan', lang: 'en' });
    expect(res.items.some((r) => r.title === 'Tava')).toBe(true);
  });

  it('q kanonik dildeyse AI çağrılmaz', async () => {
    const { db } = await seedTwoStores();
    const f = fakeAI();
    await searchProducts(db as any, f.ai as any, { q: 'Tava', lang: 'tr' });
    expect(f.calls).toBe(0);
  });
});
