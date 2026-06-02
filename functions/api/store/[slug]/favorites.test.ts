import { describe, it, expect } from 'vitest';
import { onRequestGet, onRequestPost, onRequestDelete } from './favorites';
import { makeFakeD1 } from '../../../_lib/fakeD1';

const DEVICE = '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';

function ctx(db: unknown, slug: string, method: string, body?: unknown, deviceId?: string) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (deviceId !== undefined) headers['x-device-id'] = deviceId;
  return {
    request: new Request('https://photozseo.com/api/store/' + slug + '/favorites', {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }),
    env: { MARKET_DB: db },
    params: { slug },
  } as any;
}

describe('favorites API', () => {
  it('cihaz kimliği yoksa 400', async () => {
    const { db } = makeFakeD1();
    const res = await onRequestGet(ctx(db, 'magaza-a', 'GET'));
    expect(res.status).toBe(400);
  });

  it('POST favori ekler, GET listeler, DELETE siler', async () => {
    const { db } = makeFakeD1();
    const slug = 'magaza-a';

    const post = await onRequestPost(ctx(db, slug, 'POST', { productSlug: 'urun-1' }, DEVICE));
    expect(post.status).toBe(200);

    const get = await onRequestGet(ctx(db, slug, 'GET', undefined, DEVICE));
    expect(get.status).toBe(200);
    expect(await get.json()).toEqual({ favorites: ['urun-1'] });

    const del = await onRequestDelete(ctx(db, slug, 'DELETE', { productSlug: 'urun-1' }, DEVICE));
    expect(del.status).toBe(200);

    const get2 = await onRequestGet(ctx(db, slug, 'GET', undefined, DEVICE));
    expect(await get2.json()).toEqual({ favorites: [] });
  });

  it('geçersiz productSlug 400', async () => {
    const { db } = makeFakeD1();
    const res = await onRequestPost(ctx(db, 'magaza-a', 'POST', { productSlug: '../x' }, DEVICE));
    expect(res.status).toBe(400);
  });
});
