import { describe, expect, test } from 'vitest';
import {
  blockStore,
  isBlocked,
  unblockStore,
  takedownStore,
  claimSlug,
  getStore,
  putStore,
  type StoreRecord,
} from './registry';

// In-memory KV mock — KVNamespace'in test ettiğimiz alt kümesi (get/put/delete).
function memKV() {
  const m = new Map<string, string>();
  return {
    get: async (k: string) => (m.has(k) ? m.get(k)! : null),
    put: async (k: string, v: string) => { m.set(k, v); },
    delete: async (k: string) => { m.delete(k); },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

const rec = (slug: string): StoreRecord => ({
  manifest: { store: { slug } } as never,
  status: 'active',
  version: 1,
  updatedAt: '2026-01-01',
});

describe('blocklist', () => {
  test('block / isBlocked / unblock roundtrip', async () => {
    const kv = memKV();
    expect(await isBlocked(kv, 'ahmet')).toBe(false);
    await blockStore(kv, 'ahmet', 'fraud');
    expect(await isBlocked(kv, 'ahmet')).toBe(true);
    await unblockStore(kv, 'ahmet');
    expect(await isBlocked(kv, 'ahmet')).toBe(false);
  });

  test('takedown deletes the store AND blocks the slug', async () => {
    const kv = memKV();
    await putStore(kv, 'scam', rec('scam'));
    await takedownStore(kv, 'scam', 'reported');
    expect(await getStore(kv, 'scam')).toBeNull();
    expect(await isBlocked(kv, 'scam')).toBe(true);
  });

  test('claimSlug skips a blocked slug so a banned name cannot be reused', async () => {
    const kv = memKV();
    await blockStore(kv, 'scam', 'fraud'); // store silindi ama blok kaldı
    const slug = await claimSlug(kv, 'scam');
    expect(slug).not.toBe('scam');
    expect(slug).toBe('scam-2');
  });

  test('claimSlug still returns the base when neither store nor block exists', async () => {
    const kv = memKV();
    expect(await claimSlug(kv, 'fresh')).toBe('fresh');
  });
});
