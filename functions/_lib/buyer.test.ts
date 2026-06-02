import { describe, it, expect } from 'vitest';
import {
  ownerKeyFromDevice, isValidSlug,
  listFavorites, addFavorite, removeFavorite,
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
