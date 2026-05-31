import { describe, it, expect } from 'vitest';
import { syncStoreToMarketplace } from '../../_lib/marketplace';
import { makeFakeD1 } from '../../_lib/fakeD1';
import type { StoreRecord } from '../../_lib/registry';
import type { Manifest } from '../../../src/storefront/types';

function rec(listed: boolean): StoreRecord {
  const manifest: Manifest = {
    store: { slug: 'acme', displayName: 'ACME', contact: {}, languages: ['tr'], currency: 'USD', marketplaceListed: listed },
    categories: [],
    products: [{ id: 'p1', title: { tr: 'Telefon' }, images: [] }],
    meta: { version: 1, updatedAt: '2026-05-31T00:00:00Z' },
  };
  return { manifest, status: 'active', version: 1, updatedAt: '2026-05-31T00:00:00Z' };
}

describe('syncStoreToMarketplace', () => {
  it('listed mağazayı D1\'e yazar + index_version artırır', async () => {
    const { db, tables } = makeFakeD1();
    const before = (tables.meta[0].value as number);
    await syncStoreToMarketplace(db as any, 'acme', rec(true));
    expect(tables.stores).toHaveLength(1);
    expect(tables.products).toHaveLength(1);
    expect(tables.meta[0].value as number).toBe(before + 1);
  });

  it('listed=false mağazayı D1\'den DÜŞÜRÜR (opt-out)', async () => {
    const { db, tables } = makeFakeD1();
    await syncStoreToMarketplace(db as any, 'acme', rec(true));
    expect(tables.stores).toHaveLength(1);
    await syncStoreToMarketplace(db as any, 'acme', rec(false));
    expect(tables.stores).toHaveLength(0);     // opt-out → marketplace'ten kalkar
    expect(tables.products).toHaveLength(0);
  });
});
