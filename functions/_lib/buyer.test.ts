import { describe, it, expect } from 'vitest';
import {
  ownerKeyFromDevice, isValidSlug,
  listFavorites, addFavorite, removeFavorite,
  getCart, setCartItem, clearCart,
  listAllFavorites, listAllCart,
} from './buyer';
import { makeFakeD1 } from './fakeD1';

describe('ownerKeyFromDevice', () => {
  it('geçerli UUID için d: önekli anahtar döner', () => {
    expect(ownerKeyFromDevice('1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')).toBe(
      'd:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    );
  });
  it('boş/biçimsiz cihaz kimliği için null döner', () => {
    expect(ownerKeyFromDevice('')).toBeNull();
    expect(ownerKeyFromDevice('not-a-uuid')).toBeNull();
    expect(ownerKeyFromDevice('d:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')).toBeNull();
  });
});

describe('isValidSlug', () => {
  it('makul slug kabul eder', () => {
    expect(isValidSlug('ahmet-oto-yedek')).toBe(true);
    expect(isValidSlug('deri-defter-2')).toBe(true);
  });
  it('boş/aşırı uzun/yasak karakter reddeder', () => {
    expect(isValidSlug('')).toBe(false);
    expect(isValidSlug('a'.repeat(200))).toBe(false);
    expect(isValidSlug('boşluk var')).toBe(false);
    expect(isValidSlug('../etc')).toBe(false);
  });
});

describe('favorites CRUD', () => {
  it('ekler, listeler, idempotent ekler, siler', async () => {
    const { db } = makeFakeD1();
    const owner = 'd:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';

    expect(await listFavorites(db, owner, 'ahmet-oto-yedek')).toEqual([]);

    await addFavorite(db, owner, 'ahmet-oto-yedek', 'fren-balatasi', '2026-06-02T00:00:00Z');
    await addFavorite(db, owner, 'ahmet-oto-yedek', 'fren-balatasi', '2026-06-02T00:00:01Z'); // idempotent
    await addFavorite(db, owner, 'ahmet-oto-yedek', 'yag-filtresi', '2026-06-02T00:00:02Z');

    const favs = await listFavorites(db, owner, 'ahmet-oto-yedek');
    expect(favs.sort()).toEqual(['fren-balatasi', 'yag-filtresi']);

    await removeFavorite(db, owner, 'ahmet-oto-yedek', 'fren-balatasi');
    expect(await listFavorites(db, owner, 'ahmet-oto-yedek')).toEqual(['yag-filtresi']);
  });

  it('favoriler mağazaya göre izole', async () => {
    const { db } = makeFakeD1();
    const owner = 'd:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';
    await addFavorite(db, owner, 'magaza-a', 'urun-1', '2026-06-02T00:00:00Z');
    expect(await listFavorites(db, owner, 'magaza-b')).toEqual([]);
  });
});

describe('cart CRUD', () => {
  it('ekler, adet günceller, qty<=0 siler, listeler, temizler', async () => {
    const { db } = makeFakeD1();
    const owner = 'd:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';

    expect(await getCart(db, owner, 'magaza-a')).toEqual([]);

    await setCartItem(db, owner, 'magaza-a', 'urun-1', 2, '2026-06-02T00:00:00Z');
    await setCartItem(db, owner, 'magaza-a', 'urun-2', 1, '2026-06-02T00:00:01Z');
    await setCartItem(db, owner, 'magaza-a', 'urun-1', 5, '2026-06-02T00:00:02Z'); // güncelle

    const cart = await getCart(db, owner, 'magaza-a');
    expect(cart.sort((a, b) => a.productSlug.localeCompare(b.productSlug))).toEqual([
      { productSlug: 'urun-1', qty: 5 },
      { productSlug: 'urun-2', qty: 1 },
    ]);

    await setCartItem(db, owner, 'magaza-a', 'urun-2', 0, '2026-06-02T00:00:03Z'); // qty 0 → sil
    expect(await getCart(db, owner, 'magaza-a')).toEqual([{ productSlug: 'urun-1', qty: 5 }]);

    await clearCart(db, owner, 'magaza-a');
    expect(await getCart(db, owner, 'magaza-a')).toEqual([]);
  });
});

describe('listAllFavorites / listAllCart (çapraz-mağaza, gruplu)', () => {
  function seed(tables: ReturnType<typeof makeFakeD1>['tables']) {
    tables.stores.push(
      { slug: 'magaza-a', name: 'Mağaza A', listed: 1 },
      { slug: 'magaza-b', name: 'Mağaza B', listed: 1 },
    );
    tables.products.push(
      { id: 'magaza-a:urun-1', store_slug: 'magaza-a', title: 'Ürün 1', price: 100, currency: 'TRY', stock: 7, image_url: 'a1.jpg', product_path: '/store/magaza-a/p/urun-1' },
      { id: 'magaza-a:urun-2', store_slug: 'magaza-a', title: 'Ürün 2', price: 50, currency: 'TRY', stock: 0, image_url: 'a2.jpg', product_path: '/store/magaza-a/p/urun-2' },
      { id: 'magaza-b:urun-9', store_slug: 'magaza-b', title: 'Ürün 9', price: 9, currency: 'USD', stock: 3, image_url: 'b9.jpg', product_path: '/store/magaza-b/p/urun-9' },
    );
  }

  it('favorileri mağazaya göre gruplar + ürün verisiyle zenginleştirir', async () => {
    const { db, tables } = makeFakeD1();
    seed(tables);
    const owner = 'd:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';
    await addFavorite(db, owner, 'magaza-a', 'urun-1', '2026-06-02T00:00:00Z');
    await addFavorite(db, owner, 'magaza-b', 'urun-9', '2026-06-02T00:00:01Z');

    const groups = await listAllFavorites(db, owner);
    expect(groups.map((g) => g.storeSlug)).toEqual(['magaza-a', 'magaza-b']);
    expect(groups[0]).toMatchObject({ storeName: 'Mağaza A' });
    expect(groups[0].items[0]).toMatchObject({
      productSlug: 'urun-1', title: 'Ürün 1', price: 100, currency: 'TRY', stock: 7,
      imageUrl: 'a1.jpg', productPath: '/store/magaza-a/p/urun-1',
    });
    expect(groups[1].items[0].title).toBe('Ürün 9');
  });

  it('boş favori → boş dizi', async () => {
    const { db } = makeFakeD1();
    expect(await listAllFavorites(db, 'd:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')).toEqual([]);
  });

  it('silinmiş ürün (indekste yok) → kalem yine listelenir, alanlar null', async () => {
    const { db, tables } = makeFakeD1();
    seed(tables);
    const owner = 'd:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';
    await addFavorite(db, owner, 'magaza-a', 'silinmis-urun', '2026-06-02T00:00:00Z');
    const groups = await listAllFavorites(db, owner);
    expect(groups[0].items[0]).toMatchObject({ productSlug: 'silinmis-urun', title: null, price: null });
  });

  it('sepeti mağazaya göre gruplar + qty taşır', async () => {
    const { db, tables } = makeFakeD1();
    seed(tables);
    const owner = 'd:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';
    await setCartItem(db, owner, 'magaza-a', 'urun-1', 2, '2026-06-02T00:00:00Z');
    await setCartItem(db, owner, 'magaza-a', 'urun-2', 3, '2026-06-02T00:00:01Z');
    await setCartItem(db, owner, 'magaza-b', 'urun-9', 1, '2026-06-02T00:00:02Z');

    const groups = await listAllCart(db, owner);
    expect(groups.map((g) => g.storeSlug)).toEqual(['magaza-a', 'magaza-b']);
    const a = groups[0].items.reduce<Record<string, number>>((m, it) => { m[it.productSlug] = it.qty!; return m; }, {});
    expect(a).toEqual({ 'urun-1': 2, 'urun-2': 3 });
    expect(groups[1].items[0]).toMatchObject({ productSlug: 'urun-9', qty: 1, price: 9 });
  });
});
