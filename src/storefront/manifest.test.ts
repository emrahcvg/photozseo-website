import { describe, it, expect } from 'vitest';
import { resolveLocalized, formatPrice, FALLBACK_LOCALE } from './manifest';

describe('resolveLocalized', () => {
  it('istenen dili döndürür', () => {
    expect(resolveLocalized({ tr: 'Merhaba', en: 'Hello' }, 'tr')).toBe('Merhaba');
  });
  it('dil yoksa fallback (en) döner', () => {
    expect(resolveLocalized({ en: 'Hello' }, 'de')).toBe('Hello');
  });
  it('fallback da yoksa ilk değeri döner', () => {
    expect(resolveLocalized({ tr: 'Merhaba' }, 'de', 'en')).toBe('Merhaba');
  });
  it('undefined alanda boş string döner', () => {
    expect(resolveLocalized(undefined, 'tr')).toBe('');
  });
  it('FALLBACK_LOCALE en olmalı', () => {
    expect(FALLBACK_LOCALE).toBe('en');
  });
});

describe('formatPrice', () => {
  it('fiyat undefined ise null döner', () => {
    expect(formatPrice(undefined, 'TRY', 'tr')).toBeNull();
  });
  it('geçerli fiyatı biçimli string döndürür', () => {
    const out = formatPrice(1499, 'TRY', 'tr');
    expect(typeof out).toBe('string');
    expect(out).toContain('499');
  });
  it('geçersiz currency kodunda çökmeyip fallback döner', () => {
    const out = formatPrice(10, 'XXXX_BAD', 'tr');
    expect(out).toContain('10');
  });
});
import { groupProductsByCategory, resolveStoreLocale } from './manifest';
import type { Manifest } from './types';

const fakeManifest: Manifest = {
  store: { slug: 's', displayName: 'S', contact: {}, languages: ['tr', 'en'], currency: 'TRY' },
  categories: [
    { id: 'c1', name: { tr: 'A' } },
    { id: 'c2', name: { tr: 'B' } },
  ],
  products: [
    { id: 'p1', categoryId: 'c1', title: { tr: 'P1' }, images: [] },
    { id: 'p2', categoryId: 'c2', title: { tr: 'P2' }, images: [] },
    { id: 'p3', categoryId: 'cX-yok', title: { tr: 'P3' }, images: [] },
  ],
  meta: { version: 1, updatedAt: '' },
};

describe('groupProductsByCategory', () => {
  it('ürünleri kategorilere göre gruplar', () => {
    const groups = groupProductsByCategory(fakeManifest);
    expect(groups.find((g) => g.category?.id === 'c1')?.products).toHaveLength(1);
  });
  it('bilinmeyen kategorideki ürünü "kategorisiz" gruba koyar', () => {
    const groups = groupProductsByCategory(fakeManifest);
    const uncategorized = groups.find((g) => g.category === null);
    expect(uncategorized?.products.map((p) => p.id)).toContain('p3');
  });
  it('boş kategorileri eler', () => {
    const m: Manifest = { ...fakeManifest, categories: [...fakeManifest.categories, { id: 'c3', name: { tr: 'Boş' } }] };
    const groups = groupProductsByCategory(m);
    expect(groups.find((g) => g.category?.id === 'c3')).toBeUndefined();
  });
});

describe('resolveStoreLocale', () => {
  it('istenen dil destekleniyorsa onu döner', () => {
    expect(resolveStoreLocale(fakeManifest, 'tr')).toBe('tr');
  });
  it('istenen dil yoksa en döner (destekleniyorsa)', () => {
    expect(resolveStoreLocale(fakeManifest, 'de')).toBe('en');
  });
  it('istenen ve en yoksa ilk dili döner', () => {
    const m: Manifest = { ...fakeManifest, store: { ...fakeManifest.store, languages: ['tr'] } };
    expect(resolveStoreLocale(m, 'de')).toBe('tr');
  });
});
