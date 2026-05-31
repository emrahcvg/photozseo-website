import { describe, it, expect } from 'vitest';
import {
  storeRecordToStoreFields,
  storeRecordToProductRows,
  type ProductRow,
} from './marketplace';
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
  it('tüm ürünleri döner (limit yok)', async () => {
    const { db } = await seedTwoStores();
    const res = await listNewProducts(db as any, {});
    expect(res.total).toBe(3);
  });
  it('categoryId filtreler', async () => {
    const { db } = await seedTwoStores();
    const res = await listNewProducts(db as any, { categoryId: 'electronics.phones' });
    expect(res.total).toBe(2);
  });
  it('limit + offset uygular', async () => {
    const { db } = await seedTwoStores();
    const res = await listNewProducts(db as any, { limit: 1, offset: 1 });
    expect(res.items).toHaveLength(1);
    expect(res.total).toBe(3); // total filtre sonrası ama sayfalama öncesi
  });
});
