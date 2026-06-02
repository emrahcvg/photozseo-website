import { describe, it, expect } from 'vitest';
import { onRequestGet, onRequestPut } from './cart';
import { makeFakeD1 } from '../../../_lib/fakeD1';

const DEVICE = '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';

function ctx(db: unknown, slug: string, method: string, body?: unknown, deviceId?: string) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (deviceId !== undefined) headers['x-device-id'] = deviceId;
  return {
    request: new Request('https://photozseo.com/api/store/' + slug + '/cart', {
      method, headers, body: body ? JSON.stringify(body) : undefined,
    }),
    env: { MARKET_DB: db },
    params: { slug },
  } as any;
}

describe('cart API', () => {
  it('cihaz kimliği yoksa 400', async () => {
    const { db } = makeFakeD1();
    expect((await onRequestGet(ctx(db, 'magaza-a', 'GET'))).status).toBe(400);
  });

  it('PUT kalem ekler/günceller, GET listeler, qty 0 siler', async () => {
    const { db } = makeFakeD1();
    const slug = 'magaza-a';

    let res = await onRequestPut(ctx(db, slug, 'PUT', { productSlug: 'urun-1', qty: 2 }, DEVICE));
    expect(res.status).toBe(200);
    res = await onRequestPut(ctx(db, slug, 'PUT', { productSlug: 'urun-2', qty: 1 }, DEVICE));
    expect(res.status).toBe(200);

    const get = await onRequestGet(ctx(db, slug, 'GET', undefined, DEVICE));
    const data = (await get.json()) as { items: Array<{ productSlug: string; qty: number }> };
    expect(data.items.sort((a, b) => a.productSlug.localeCompare(b.productSlug))).toEqual([
      { productSlug: 'urun-1', qty: 2 },
      { productSlug: 'urun-2', qty: 1 },
    ]);

    await onRequestPut(ctx(db, slug, 'PUT', { productSlug: 'urun-1', qty: 0 }, DEVICE));
    const get2 = await onRequestGet(ctx(db, slug, 'GET', undefined, DEVICE));
    expect((await get2.json() as any).items).toEqual([{ productSlug: 'urun-2', qty: 1 }]);
  });

  it('geçersiz qty (sayı değil) 400', async () => {
    const { db } = makeFakeD1();
    const res = await onRequestPut(ctx(db, 'magaza-a', 'PUT', { productSlug: 'urun-1', qty: 'x' }, DEVICE));
    expect(res.status).toBe(400);
  });
});
