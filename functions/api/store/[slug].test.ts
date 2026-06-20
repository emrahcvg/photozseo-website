import { describe, it, expect } from 'vitest';
import { onRequestPut, onRequestDelete } from './[slug]';
import { makeFakeD1 } from '../../_lib/fakeD1';
import { getStore } from '../../_lib/registry';
import { signSession } from '../../_lib/session';
import { SESSION_COOKIE } from '../../../src/storefront/auth/config';
import type { Manifest } from '../../../src/storefront/types';

const KEY = 'test-write-key';

async function makeSessionCookie(key: string = KEY): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const token = await signSession({ sub: 'google-sub-123', email: 'seller@example.com', exp }, key);
  return `${SESSION_COOKIE}=${token}`;
}

// Minimal bellek-içi KV — registry sadece get/put/delete kullanır.
function makeFakeKV() {
  const map = new Map<string, string>();
  return {
    map,
    kv: {
      get: async (k: string) => map.get(k) ?? null,
      put: async (k: string, v: string) => { map.set(k, v); },
      delete: async (k: string) => { map.delete(k); },
    } as unknown as KVNamespace,
  };
}

function manifest(listed: boolean): Manifest {
  return {
    store: { slug: 'acme', displayName: 'ACME', contact: { phone: '+90555' }, languages: ['tr'], currency: 'USD', marketplaceListed: listed },
    categories: [],
    products: [{ id: 'p1', title: { tr: 'Telefon' }, images: [] }],
    meta: { version: 1, updatedAt: '2026-05-31T00:00:00Z' },
  };
}

async function putCtx(opts: { slug?: string; body?: unknown; env: Record<string, unknown>; cookie?: string | null }) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (opts.cookie !== null) {
    headers['cookie'] = opts.cookie ?? await makeSessionCookie();
  }
  const slug = opts.slug ?? 'acme';
  return {
    request: new Request(`https://photozseo.com/api/store/${slug}`, {
      method: 'PUT',
      headers,
      body: typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body ?? manifest(true)),
    }),
    params: { slug },
    env: opts.env,
  } as never;
}

async function delCtx(opts: { slug?: string; env: Record<string, unknown>; cookie?: string | null }) {
  const headers: Record<string, string> = {};
  if (opts.cookie !== null) {
    headers['cookie'] = opts.cookie ?? await makeSessionCookie();
  }
  const slug = opts.slug ?? 'acme';
  return {
    request: new Request(`https://photozseo.com/api/store/${slug}`, { method: 'DELETE', headers }),
    params: { slug },
    env: opts.env,
  } as never;
}

describe('PUT /api/store/:slug — opt-in publish', () => {
  it('opt-in (marketplaceListed=true): mağaza KV\'ye yazılır VE market D1\'de görünür', async () => {
    const { db, tables } = makeFakeD1();
    const { kv, map } = makeFakeKV();
    const env = { STORE_KV: kv, STORE_WRITE_KEY: KEY, MARKET_DB: db };
    const before = tables.meta[0].value as number;

    const res = await onRequestPut(await putCtx({ body: manifest(true), env }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, slug: 'acme', version: 1 });
    expect(map.size).toBe(1);
    expect(tables.stores).toHaveLength(1);
    expect(tables.stores[0].listed).toBe(1);
    expect(tables.products).toHaveLength(1);
    expect(tables.meta[0].value as number).toBe(before + 1);
  });

  it('opt-out (marketplaceListed=false): KV\'de kalır ama market D1\'den düşer', async () => {
    const { db, tables } = makeFakeD1();
    const { kv } = makeFakeKV();
    const env = { STORE_KV: kv, STORE_WRITE_KEY: KEY, MARKET_DB: db };

    await onRequestPut(await putCtx({ body: manifest(true), env }));
    expect(tables.stores).toHaveLength(1);

    const res = await onRequestPut(await putCtx({ body: manifest(false), env }));
    expect(res.status).toBe(200);
    expect(tables.stores).toHaveLength(0);
    expect(tables.products).toHaveLength(0);
    const stored = await getStore(kv, 'acme');
    expect(stored?.manifest.store.marketplaceListed).toBe(false);
  });

  it('D1 sync patlasa bile mağaza PUT\'u başarılı (best-effort, KV bozulmaz)', async () => {
    const brokenDb = { prepare() { throw new Error('D1 down'); } };
    const { kv, map } = makeFakeKV();
    const env = { STORE_KV: kv, STORE_WRITE_KEY: KEY, MARKET_DB: brokenDb };

    const res = await onRequestPut(await putCtx({ body: manifest(true), env }));

    expect(res.status).toBe(200);
    expect(map.size).toBe(1);
  });

  it('MARKET_DB binding yoksa crash yok, mağaza yine kaydedilir', async () => {
    const { kv, map } = makeFakeKV();
    const env = { STORE_KV: kv, STORE_WRITE_KEY: KEY };

    const res = await onRequestPut(await putCtx({ body: manifest(true), env }));

    expect(res.status).toBe(200);
    expect(map.size).toBe(1);
  });

  it('oturum olmadan PUT reddedilir (401)', async () => {
    const { db } = makeFakeD1();
    const { kv, map } = makeFakeKV();
    const env = { STORE_KV: kv, STORE_WRITE_KEY: KEY, MARKET_DB: db };

    const res = await onRequestPut(await putCtx({ body: manifest(true), env, cookie: null }));

    expect(res.status).toBe(401);
    expect(map.size).toBe(0);
  });

  it('STORE_WRITE_KEY tanımsızsa fail-closed (401)', async () => {
    const { kv } = makeFakeKV();
    const env = { STORE_KV: kv };

    const res = await onRequestPut(await putCtx({ body: manifest(true), env }));

    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/store/:slug — market temizliği', () => {
  it('DELETE mağazayı KV\'den siler VE market D1\'den düşürür + index bump', async () => {
    const { db, tables } = makeFakeD1();
    const { kv, map } = makeFakeKV();
    const env = { STORE_KV: kv, STORE_WRITE_KEY: KEY, MARKET_DB: db };

    await onRequestPut(await putCtx({ body: manifest(true), env }));
    expect(map.size).toBe(1);
    expect(tables.stores).toHaveLength(1);
    const beforeDelete = tables.meta[0].value as number;

    const res = await onRequestDelete(await delCtx({ env }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, slug: 'acme', deleted: true });
    expect(map.size).toBe(0);
    expect(tables.stores).toHaveLength(0);
    expect(tables.products).toHaveLength(0);
    expect(tables.meta[0].value as number).toBe(beforeDelete + 1);
  });

  it('oturum olmadan DELETE reddedilir (401)', async () => {
    const { db } = makeFakeD1();
    const { kv, map } = makeFakeKV();
    map.set('store:acme', JSON.stringify({ status: 'active', version: 1 }));
    const env = { STORE_KV: kv, STORE_WRITE_KEY: KEY, MARKET_DB: db };

    const res = await onRequestDelete(await delCtx({ env, cookie: null }));

    expect(res.status).toBe(401);
    expect(map.size).toBe(1);
  });
});
