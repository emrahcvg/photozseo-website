import { describe, it, expect } from 'vitest';
import { applyLegacyMapToManifest, normalizeManifestForWrite } from './taxonomy-migrate';
import type { Manifest } from '../../src/storefront/types';

const map = { 'electronics.phones': '267', 'clothing.shoes': '187' };

function mk(): Manifest {
  return {
    store: {
      slug: 's',
      displayName: 'S',
      contact: {},
      languages: ['en'],
      currency: 'USD',
    },
    categories: [
      { id: 'electronics.phones', name: { en: 'Phones' } },
      { id: 'c1', name: { en: 'Custom' } },
    ],
    products: [
      { id: 'p1', categoryId: 'electronics.phones', title: { en: 'A' }, images: [] },
      { id: 'p2', categoryId: 'c1', title: { en: 'B' }, images: [] },
      { id: 'p3', categoryId: '187', title: { en: 'C' }, images: [] },
    ],
    meta: { version: 1, updatedAt: '' },
  };
}

describe('applyLegacyMapToManifest — invariant korunarak birlikte çevirir', () => {
  it('categories[].id + products[].categoryId AYNI haritayla çevrilir (bağ korunur)', () => {
    const out = applyLegacyMapToManifest(mk(), map);
    expect(out.categories[0].id).toBe('267');
    expect(out.products[0].categoryId).toBe('267');
  });

  it('serbest id (c1) → uncategorized sentinel (categories + products tutarlı)', () => {
    const out = applyLegacyMapToManifest(mk(), map);
    expect(out.categories[1].id).toBe('uncategorized');
    expect(out.products[1].categoryId).toBe('uncategorized');
  });

  it('zaten google id (187) dokunulmaz (idempotent)', () => {
    const out = applyLegacyMapToManifest(mk(), map);
    expect(out.products[2].categoryId).toBe('187');
  });

  it('iki kez uygulamak idempotent (no-op)', () => {
    const once = applyLegacyMapToManifest(mk(), map);
    const twice = applyLegacyMapToManifest(once, map);
    expect(twice).toEqual(once);
  });

  it('orijinal manifest mutate edilmez (pure)', () => {
    const m = mk();
    applyLegacyMapToManifest(m, map);
    expect(m.products[0].categoryId).toBe('electronics.phones');
  });

  it('warn callback çözülemeyen id için çağrılır', () => {
    const warned: string[] = [];
    applyLegacyMapToManifest(mk(), map, (id) => warned.push(id));
    // c1 her iki kez (category + product) raporlanmalı
    expect(warned).toContain('c1');
  });

  it('categoryId undefined olan ürünler dokunulmaz', () => {
    const m = mk();
    // p3'ün categoryId'sini undefined yap
    m.products[2].categoryId = undefined;
    const out = applyLegacyMapToManifest(m, map);
    expect(out.products[2].categoryId).toBeUndefined();
  });
});

describe('normalizeManifestForWrite — write-normalize + damga', () => {
  it("eski id'leri çevirir ve taxonomyMigration damgası ekler", () => {
    const out = normalizeManifestForWrite(mk(), map, 7);
    expect(out.products[0].categoryId).toBe('267');
    expect(out.meta.taxonomyVersion).toBe(7);
    expect(out.meta.taxonomyMigration?.unmapped).toEqual(['c1']);
    expect(out.meta.taxonomyMigration?.toVersion).toBe(7);
  });
  it('zaten normalize manifest tekrar yazılırsa idempotent (unmapped boş, içerik aynı)', () => {
    const once = normalizeManifestForWrite(mk(), map, 7);
    const twice = normalizeManifestForWrite(once, map, 7);
    expect(twice.products).toEqual(once.products);
    expect(twice.categories).toEqual(once.categories);
  });
  it('ikinci normalize unmapped boş üretir (zaten-uncategorized tekrar işaretlenmez)', () => {
    const once = normalizeManifestForWrite(mk(), map, 7);
    const twice = normalizeManifestForWrite(once, map, 7);
    expect(twice.meta.taxonomyMigration?.unmapped).toEqual([]);
  });
});
