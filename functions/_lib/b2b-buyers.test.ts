import { describe, it, expect } from 'vitest';
import {
  listBuyers, addBuyer, deleteBuyer, findBuyerByCode, findBuyerById,
  isValidBuyerCode, generateAccessCode,
} from './b2b-buyers';
import { makeFakeD1 } from './fakeD1';

describe('generateAccessCode', () => {
  it('6 karakter büyük harf alfanümerik üretir, karışık karakterler yok', () => {
    for (let i = 0; i < 20; i++) {
      const code = generateAccessCode();
      expect(code).toMatch(/^[A-Z2-9]{6}$/);
      expect(code).not.toMatch(/[O0I1]/);
    }
  });
});

describe('isValidBuyerCode', () => {
  it('6 karakter büyük alfanümerik kabul eder', () => {
    expect(isValidBuyerCode('AB2C3D')).toBe(true);
    expect(isValidBuyerCode('XYZABC')).toBe(true);
  });
  it('yanlış uzunluk veya küçük harf reddeder', () => {
    expect(isValidBuyerCode('AB2')).toBe(false);
    expect(isValidBuyerCode('ab2c3d')).toBe(false);
    expect(isValidBuyerCode('')).toBe(false);
    expect(isValidBuyerCode('AB2C3D7')).toBe(false);
  });
});

describe('addBuyer + listBuyers', () => {
  it('alıcı ekler ve listeler', async () => {
    const { db } = makeFakeD1();
    const buyer = await addBuyer(db, 'test-store', 'Ahmet Ltd', 'AB2C3D', 'uuid-1', '2026-06-12T00:00:00Z');
    expect(buyer.id).toBe('uuid-1');
    expect(buyer.buyer_name).toBe('Ahmet Ltd');

    const list = await listBuyers(db, 'test-store');
    expect(list).toHaveLength(1);
    expect(list[0].access_code).toBe('AB2C3D');
  });

  it('aynı slug+kod için duplicate ekleyemez', async () => {
    const { db } = makeFakeD1();
    await addBuyer(db, 'test-store', 'A', 'AB2C3D', 'uuid-1', '2026-06-12T00:00:00Z');
    await expect(
      addBuyer(db, 'test-store', 'B', 'AB2C3D', 'uuid-2', '2026-06-12T00:00:01Z')
    ).rejects.toThrow();
  });

  it('farklı store aynı kodu kullanabilir', async () => {
    const { db } = makeFakeD1();
    await addBuyer(db, 'store-a', 'A', 'AB2C3D', 'uuid-1', '2026-06-12T00:00:00Z');
    await addBuyer(db, 'store-b', 'B', 'AB2C3D', 'uuid-2', '2026-06-12T00:00:00Z');
    expect(await listBuyers(db, 'store-a')).toHaveLength(1);
    expect(await listBuyers(db, 'store-b')).toHaveLength(1);
  });
});

describe('deleteBuyer', () => {
  it('alıcıyı siler', async () => {
    const { db } = makeFakeD1();
    await addBuyer(db, 'test-store', 'A', 'AB2C3D', 'uuid-1', '2026-06-12T00:00:00Z');
    await deleteBuyer(db, 'test-store', 'uuid-1');
    expect(await listBuyers(db, 'test-store')).toHaveLength(0);
  });
});

describe('findBuyerByCode', () => {
  it('geçerli kod için alıcı döner', async () => {
    const { db } = makeFakeD1();
    await addBuyer(db, 'test-store', 'Ahmet', 'AB2C3D', 'uuid-1', '2026-06-12T00:00:00Z');
    const buyer = await findBuyerByCode(db, 'test-store', 'AB2C3D');
    expect(buyer?.id).toBe('uuid-1');
    expect(buyer?.buyer_name).toBe('Ahmet');
  });

  it('geçersiz kod için null döner', async () => {
    const { db } = makeFakeD1();
    const result = await findBuyerByCode(db, 'test-store', 'XXXXXX');
    expect(result).toBeNull();
  });

  it('is_active=0 olan alıcıyı döndürmez', async () => {
    const { db } = makeFakeD1();
    await addBuyer(db, 'test-store', 'Pasif', 'AB2C3D', 'uuid-1', '2026-06-12T00:00:00Z');
    await db.prepare('UPDATE store_buyers SET is_active=0 WHERE id=?').bind('uuid-1').run();
    expect(await findBuyerByCode(db, 'test-store', 'AB2C3D')).toBeNull();
  });
});

describe('findBuyerById', () => {
  it('geçerli id için alıcı döner', async () => {
    const { db } = makeFakeD1();
    await addBuyer(db, 'test-store', 'Ahmet', 'AB2C3D', 'uuid-1', '2026-06-12T00:00:00Z');
    const buyer = await findBuyerById(db, 'test-store', 'uuid-1');
    expect(buyer?.id).toBe('uuid-1');
    expect(buyer?.buyer_name).toBe('Ahmet');
  });

  it('yanlış id için null döner', async () => {
    const { db } = makeFakeD1();
    const result = await findBuyerById(db, 'test-store', 'non-existent');
    expect(result).toBeNull();
  });
});
