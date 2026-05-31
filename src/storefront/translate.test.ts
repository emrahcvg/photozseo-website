import { describe, it, expect } from 'vitest';
import { translateManifest, getTranslatedManifest, type AiBinding } from '../../functions/_lib/translate';
import type { Manifest } from './types';

// ── Fakes ────────────────────────────────────────────────────────────────────

function fakeKV() {
  const store = new Map<string, string>();
  let getCount = 0;
  return {
    store,
    get getCount() { return getCount; },
    get: async (k: string) => { getCount++; return store.has(k) ? store.get(k)! : null; },
    put: async (k: string, v: string) => { store.set(k, v); },
    delete: async (k: string) => { store.delete(k); },
  };
}

function fakeAI(prefix = '[t]') {
  let calls = 0;
  const ai: AiBinding = {
    run: async (_model, inputs) => {
      calls++;
      const messages = (inputs.messages ?? []) as { role: string; content: string }[];
      const user = messages.find((m) => m.role === 'user')?.content ?? '';
      return { response: `${prefix}${user}` };
    },
  };
  return { ai, get calls() { return calls; } };
}

const baseManifest: Manifest = {
  store: {
    slug: 'x',
    displayName: 'ACME',                 // marka — çevrilmemeli
    tagline: { en: 'Best gear' },
    contact: {},
    languages: ['en'],
    currency: 'USD',
  },
  categories: [{ id: 'c1', name: { en: 'Bottles' } }],
  products: [
    {
      id: 'p1',
      categoryId: 'c1',
      title: { en: 'Steel Bottle' },
      description: { en: 'Keeps drinks cold' },
      price: 20,
      currency: 'USD',
      images: [],
      attributes: { color: { en: 'Blue' } },
    },
  ],
  meta: { version: 3, updatedAt: '2026-05-31T00:00:00Z' },
};

// ── translateManifest ──────────────────────────────────────────────────────────

describe('translateManifest', () => {
  it('translates tagline, category, title, description, attribute color', async () => {
    const kv = fakeKV();
    const { ai } = fakeAI('[de]');
    const { manifest: out } = await translateManifest(ai, kv as unknown as KVNamespace, baseManifest, 'en', 'de');

    expect(out.store.tagline?.de).toBe('[de]Best gear');
    expect(out.categories[0].name.de).toBe('[de]Bottles');
    expect(out.products[0].title.de).toBe('[de]Steel Bottle');
    expect(out.products[0].description?.de).toBe('[de]Keeps drinks cold');
    expect(out.products[0].attributes?.color?.de).toBe('[de]Blue');
  });

  it('does NOT translate the brand displayName', async () => {
    const kv = fakeKV();
    const { ai } = fakeAI('[de]');
    const { manifest: out } = await translateManifest(ai, kv as unknown as KVNamespace, baseManifest, 'en', 'de');
    expect(out.store.displayName).toBe('ACME');
  });

  it('keeps source EN keys intact', async () => {
    const kv = fakeKV();
    const { ai } = fakeAI();
    const { manifest: out } = await translateManifest(ai, kv as unknown as KVNamespace, baseManifest, 'en', 'de');
    expect(out.products[0].title.en).toBe('Steel Bottle');
  });

  it('skips fields already translated', async () => {
    const kv = fakeKV();
    const { ai } = fakeAI('[de]');
    const m: Manifest = {
      ...baseManifest,
      products: [{ ...baseManifest.products[0], title: { en: 'Steel Bottle', de: 'Stahlflasche' } }],
    };
    const { manifest: out } = await translateManifest(ai, kv as unknown as KVNamespace, m, 'en', 'de');
    expect(out.products[0].title.de).toBe('Stahlflasche'); // korunur, yeniden çevrilmez
  });

  it('uses the per-string KV cache on repeat (no second AI call)', async () => {
    const kv = fakeKV();
    const first = fakeAI('[de]');
    await translateManifest(first.ai, kv as unknown as KVNamespace, baseManifest, 'en', 'de');
    const firstCalls = first.calls;
    expect(firstCalls).toBeGreaterThan(0);

    const second = fakeAI('[de]');
    await translateManifest(second.ai, kv as unknown as KVNamespace, baseManifest, 'en', 'de');
    expect(second.calls).toBe(0); // hepsi KV'den
  });
});

// ── getTranslatedManifest ────────────────────────────────────────────────────────

describe('getTranslatedManifest', () => {
  it('returns source manifest unchanged when target === source', async () => {
    const kv = fakeKV();
    const { ai } = fakeAI();
    const out = await getTranslatedManifest(ai, kv as unknown as KVNamespace, 'x', baseManifest, 'en', 'en');
    expect(out).toBe(baseManifest);
  });

  it('falls back to source when AI binding is missing', async () => {
    const kv = fakeKV();
    const out = await getTranslatedManifest(undefined, kv as unknown as KVNamespace, 'x', baseManifest, 'en', 'de');
    expect(out.products[0].title.de).toBeUndefined();
  });

  it('does NOT cache the whole manifest when a translation fails (so it retries)', async () => {
    const kv = fakeKV();
    const failingAI: AiBinding = { run: async () => { throw new Error('rate limit'); } };
    const out = await getTranslatedManifest(failingAI, kv as unknown as KVNamespace, 'x', baseManifest, 'en', 'de');
    expect(kv.store.has('i18n:v2:x:de:v3')).toBe(false);       // kısmi → cache'lenmez (tekrar denenir)
    expect(out.products[0].title.de).toBe('Steel Bottle');     // graceful: kaynak metin gösterilir
  });

  it('caches the whole translated manifest by version', async () => {
    const kv = fakeKV();
    const { ai } = fakeAI('[de]');
    await getTranslatedManifest(ai, kv as unknown as KVNamespace, 'x', baseManifest, 'en', 'de');
    expect(kv.store.has('i18n:v2:x:de:v3')).toBe(true);

    // İkinci çağrı AI'a hiç gitmemeli (tam-manifest cache).
    const second = fakeAI('[de]');
    const out2 = await getTranslatedManifest(second.ai, kv as unknown as KVNamespace, 'x', baseManifest, 'en', 'de');
    expect(second.calls).toBe(0);
    expect(out2.products[0].title.de).toBe('[de]Steel Bottle');
  });
});
