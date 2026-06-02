import { describe, it, expect } from 'vitest';
import { createOrder, listOrders, makeOrderRef, type OrderRecord } from './orders';
import { makeFakeD1 } from './fakeD1';

describe('makeOrderRef', () => {
  it("'SP-' önekiyle başlar ve büyük alfasayısal karakterler içerir", () => {
    const ref = makeOrderRef(12345678);
    expect(ref).toMatch(/^SP-[0-9A-Z]+$/);
  });
  it('deterministik: aynı rand aynı ref üretir', () => {
    expect(makeOrderRef(99999)).toBe(makeOrderRef(99999));
  });
  it('farklı rand farklı ref üretir', () => {
    expect(makeOrderRef(1)).not.toBe(makeOrderRef(2));
  });
});

describe('createOrder + listOrders', () => {
  function makeOrder(id: string, ownerKey: string, created_at: string): OrderRecord {
    return {
      id,
      owner_key: ownerKey,
      store_slug: 'test-magaza',
      store_name: 'Test Mağaza',
      items: [
        { productSlug: 'urun-1', qty: 2, title: 'Ürün Bir', price: 49.99, currency: 'TRY' },
        { productSlug: 'urun-2', qty: 1 },
      ],
      item_count: 3,
      total: 149.97,
      currency: 'TRY',
      status: 'sent',
      created_at,
    };
  }

  it('createOrder sonrası listOrders kaydı döner ve items parse edilir', async () => {
    const { db } = makeFakeD1();
    const owner = 'b:google-user-123';
    const order = makeOrder('SP-ABCDE', owner, '2026-06-01T10:00:00.000Z');

    await createOrder(db, order);
    const orders = await listOrders(db, owner);

    expect(orders).toHaveLength(1);
    expect(orders[0].id).toBe('SP-ABCDE');
    expect(orders[0].owner_key).toBe(owner);
    expect(orders[0].store_slug).toBe('test-magaza');
    expect(orders[0].store_name).toBe('Test Mağaza');
    expect(orders[0].item_count).toBe(3);
    expect(orders[0].total).toBe(149.97);
    expect(orders[0].currency).toBe('TRY');
    expect(orders[0].status).toBe('sent');
    // items JSON round-trip kontrolü
    expect(orders[0].items).toHaveLength(2);
    expect(orders[0].items[0].productSlug).toBe('urun-1');
    expect(orders[0].items[0].qty).toBe(2);
    expect(orders[0].items[0].price).toBe(49.99);
    expect(orders[0].items[1].productSlug).toBe('urun-2');
  });

  it('listOrders en yeniden en eskiye sıralar', async () => {
    const { db } = makeFakeD1();
    const owner = 'b:google-user-abc';
    await createOrder(db, makeOrder('SP-OLD', owner, '2026-05-01T00:00:00.000Z'));
    await createOrder(db, makeOrder('SP-NEW', owner, '2026-06-01T00:00:00.000Z'));

    const orders = await listOrders(db, owner);
    expect(orders[0].id).toBe('SP-NEW');
    expect(orders[1].id).toBe('SP-OLD');
  });

  it('listOrders boş sahip için [] döner', async () => {
    const { db } = makeFakeD1();
    const orders = await listOrders(db, 'b:bilinmeyen-kullanici');
    expect(orders).toEqual([]);
  });

  it('siparişler owner_key ile izole', async () => {
    const { db } = makeFakeD1();
    await createOrder(db, makeOrder('SP-A1', 'b:kullanici-a', '2026-06-01T10:00:00.000Z'));
    await createOrder(db, makeOrder('SP-B1', 'b:kullanici-b', '2026-06-01T11:00:00.000Z'));

    const ordersA = await listOrders(db, 'b:kullanici-a');
    const ordersB = await listOrders(db, 'b:kullanici-b');

    expect(ordersA).toHaveLength(1);
    expect(ordersA[0].id).toBe('SP-A1');
    expect(ordersB).toHaveLength(1);
    expect(ordersB[0].id).toBe('SP-B1');
  });
});
