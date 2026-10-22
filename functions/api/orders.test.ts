import { describe, it, expect } from 'vitest';
import { onRequestPost, onRequestGet } from './orders';

interface Captured { inserted: unknown[][] }

/** /api/orders'ın kullandığı üç SQL şeklini karşılayan minimal D1 sahtesi. */
function stubDb(opts: { store?: Record<string, unknown> | null; products?: Record<string, unknown>[] }, cap: Captured) {
  return {
    prepare(sql: string) {
      return {
        bind(...args: unknown[]) {
          return {
            async first<T>() {
              if (sql.startsWith('SELECT iban')) return (opts.store ?? null) as T | null;
              return null;
            },
            async all<T>() {
              if (sql.startsWith('SELECT id, title, price, currency FROM products')) {
                const ids = new Set(args.slice(1));
                return { results: (opts.products ?? []).filter((p) => ids.has(p.id)) as T[] };
              }
              return { results: [] as T[] };
            },
            async run() {
              if (sql.startsWith('INSERT INTO orders')) cap.inserted.push(args);
              return { success: true };
            },
          };
        },
      };
    },
  };
}

function post(body: unknown, db: unknown) {
  return onRequestPost({
    request: new Request('https://photozseo.com/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-device-id': '6f1c2c1e-4b7a-4f7e-9a51-2b2d4c3e1f00' },
      body: JSON.stringify(body),
    }),
    env: { MARKET_DB: db as never },
    waitUntil: () => {},
  });
}

const STORE = { iban: 'TR330006100519786457841326', iban_name: 'Anadolu Dokuma', payment_json: null, owner_email: null, name: 'Anadolu Dokuma' };
const PRODUCTS = [
  { id: 'anadolu:kilim', title: 'Kilim yastık', price: 640, currency: 'TRY' },
  { id: 'anadolu:cezve', title: 'Bakır cezve', price: 890, currency: 'TRY' },
];

describe('POST /api/orders', () => {
  it('fiyatı istemciden değil D1 ürün kaydından hesaplar', async () => {
    const cap: Captured = { inserted: [] };
    const res = await post({
      store_slug: 'anadolu',
      items: [{ product_id: 'anadolu:kilim', qty: 2, price: 0.01 }, { product_id: 'anadolu:cezve', qty: 1, price: 0.01 }],
    }, stubDb({ store: STORE, products: PRODUCTS }, cap));
    expect(res.status).toBe(200);
    const json = await res.json() as { order_id: string; payment: { amount: number; currency: string; iban: string } };
    expect(json.payment.amount).toBe(2 * 640 + 890);
    expect(json.payment.currency).toBe('TRY');
    expect(json.payment.iban).toBe(STORE.iban);
    expect(json.order_id).toMatch(/^SP-[2-9A-HJKMNP-Z]{10}$/);
    expect(res.headers.get('cache-control')).toBe('private, no-store');
  });

  it('başka mağazanın ürününü siparişe sokmaz', async () => {
    const cap: Captured = { inserted: [] };
    const res = await post({ store_slug: 'anadolu', items: [{ product_id: 'baska:urun', qty: 1 }] }, stubDb({ store: STORE, products: PRODUCTS }, cap));
    expect(res.status).toBe(400);
    expect(cap.inserted).toHaveLength(0);
  });

  it('bilinmeyen mağaza → 404, uydurma IBAN dönmez', async () => {
    const cap: Captured = { inserted: [] };
    const res = await post({ store_slug: 'yok', items: [{ product_id: 'yok:x', qty: 1 }] }, stubDb({ store: null }, cap));
    expect(res.status).toBe(404);
    expect(await res.text()).not.toContain('TR0000');
  });

  it('IBAN tanımsız mağazada ödeme bilgisinde IBAN yoktur', async () => {
    const cap: Captured = { inserted: [] };
    const res = await post({ store_slug: 'anadolu', items: [{ product_id: 'anadolu:kilim', qty: 1 }] },
      stubDb({ store: { ...STORE, iban: null }, products: PRODUCTS }, cap));
    const json = await res.json() as { payment: Record<string, unknown> };
    expect(json.payment.iban).toBeUndefined();
  });

  it('bozuk payment_json 500 yerine IBAN yedeğine düşer', async () => {
    const cap: Captured = { inserted: [] };
    const res = await post({ store_slug: 'anadolu', items: [{ product_id: 'anadolu:kilim', qty: 1 }] },
      stubDb({ store: { ...STORE, payment_json: '{bozuk' }, products: PRODUCTS }, cap));
    expect(res.status).toBe(200);
  });

  it('50 kalemden fazlasını ve geçersiz slug\'ı reddeder', async () => {
    const cap: Captured = { inserted: [] };
    const many = Array.from({ length: 51 }, (_, i) => ({ product_id: `anadolu:p${i}`, qty: 1 }));
    expect((await post({ store_slug: 'anadolu', items: many }, stubDb({ store: STORE }, cap))).status).toBe(400);
    expect((await post({ store_slug: '../x', items: [{ product_id: 'a', qty: 1 }] }, stubDb({ store: STORE }, cap))).status).toBe(400);
  });

  it('miktarı 1–99 aralığına sıkıştırır', async () => {
    const cap: Captured = { inserted: [] };
    const res = await post({ store_slug: 'anadolu', items: [{ product_id: 'anadolu:kilim', qty: 100000 }] }, stubDb({ store: STORE, products: PRODUCTS }, cap));
    const json = await res.json() as { payment: { amount: number } };
    expect(json.payment.amount).toBe(99 * 640);
  });
});

describe('GET /api/orders', () => {
  it('kişiye özel yanıtı önbelleğe aldırmaz', async () => {
    const res = await onRequestGet({ request: new Request('https://photozseo.com/api/orders'), env: { MARKET_DB: stubDb({}, { inserted: [] }) as never }, waitUntil: () => {} });
    expect(res.headers.get('cache-control')).toBe('private, no-store');
  });
});
