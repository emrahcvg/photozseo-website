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
import { whatsappHref, socialHref, stockLabel, mapHref, productWhatsappHref, storeUrl, productUrl } from './manifest';
import type { Product, StoreLocation } from './types';

describe('whatsappHref', () => {
  it('numaradan rakam-dışı karakterleri temizler', () => {
    expect(whatsappHref('+90 555 111 22 33')).toBe('https://wa.me/905551112233');
  });
});

describe('socialHref', () => {
  it('instagram kullanıcı adından URL üretir', () => {
    expect(socialHref('instagram', '@ahmetoto')).toBe('https://instagram.com/ahmetoto');
  });
  it('telegram kullanıcı adından URL üretir', () => {
    expect(socialHref('telegram', 'ahmetoto')).toBe('https://t.me/ahmetoto');
  });
  it('zaten URL ise olduğu gibi döner', () => {
    expect(socialHref('website', 'https://ornek.com')).toBe('https://ornek.com');
  });
  it('bilinmeyen tipte değeri olduğu gibi döner', () => {
    expect(socialHref('other', 'serbest-metin')).toBe('serbest-metin');
  });
});

describe('stockLabel', () => {
  const base: Product = { id: 'x', title: { en: 'T' }, images: [] };

  it('qty > 5 — TR: "Stokta N adet"', () => {
    expect(stockLabel({ ...base, stockQty: 12 }, 'tr')).toBe('Stokta 12 adet');
  });
  it('qty > 5 — EN: "N in stock"', () => {
    expect(stockLabel({ ...base, stockQty: 12 }, 'en')).toBe('12 in stock');
  });
  it('qty <= 5 — TR: "Son N!"', () => {
    expect(stockLabel({ ...base, stockQty: 3 }, 'tr')).toBe('Son 3!');
  });
  it('qty <= 5 — EN: "Only N left!"', () => {
    expect(stockLabel({ ...base, stockQty: 3 }, 'en')).toBe('Only 3 left!');
  });
  it('inStock false — TR: "Tükendi"', () => {
    expect(stockLabel({ ...base, inStock: false }, 'tr')).toBe('Tükendi');
  });
  it('inStock false — EN: "Sold out"', () => {
    expect(stockLabel({ ...base, inStock: false }, 'en')).toBe('Sold out');
  });
  it('stockQty 0 — "Sold out"', () => {
    expect(stockLabel({ ...base, stockQty: 0 }, 'en')).toBe('Sold out');
  });
  it('inStock true, no qty — TR: "Stokta var"', () => {
    expect(stockLabel({ ...base, inStock: true }, 'tr')).toBe('Stokta var');
  });
  it('inStock true, no qty — EN: "In stock"', () => {
    expect(stockLabel({ ...base, inStock: true }, 'en')).toBe('In stock');
  });
  it('nothing known — null', () => {
    expect(stockLabel({ ...base }, 'en')).toBeNull();
  });
});

describe('mapHref', () => {
  it('lat/lng varsa Google Maps koordinat linki üretir', () => {
    const loc: StoreLocation = { lat: 41.0, lng: 29.0, city: 'İstanbul', country: 'TR' };
    expect(mapHref(loc)).toBe('https://www.google.com/maps/search/?api=1&query=41,29');
  });
  it('lat/lng yoksa city/country ile query üretir', () => {
    const loc: StoreLocation = { city: 'İstanbul', country: 'TR' };
    expect(mapHref(loc)).toBe('https://www.google.com/maps/search/?api=1&query=%C4%B0stanbul%2C%20TR');
  });
  it('undefined location → null', () => {
    expect(mapHref(undefined)).toBeNull();
  });
  it('boş location → null', () => {
    expect(mapHref({})).toBeNull();
  });
});

describe('productWhatsappHref', () => {
  it('wa.me URL ve encoded ürün adı içerir (TR)', () => {
    const href = productWhatsappHref('+905551112233', 'Model Y Paspas', 'tr');
    expect(href).toContain('wa.me/905551112233');
    expect(href).toContain('Model%20Y%20Paspas');
  });
  it('wa.me URL ve encoded ürün adı içerir (EN)', () => {
    const href = productWhatsappHref('+905551112233', 'Model Y Mat', 'en');
    expect(href).toContain('wa.me/905551112233');
    expect(href).toContain('Model%20Y%20Mat');
  });
});

describe('storeUrl', () => {
  it('default lang — /store/slug', () => {
    expect(storeUrl('ahmet-oto', 'en', 'en')).toBe('/store/ahmet-oto');
  });
  it('other lang — /store/slug/tr', () => {
    expect(storeUrl('ahmet-oto', 'tr', 'en')).toBe('/store/ahmet-oto/tr');
  });
});

describe('productUrl', () => {
  it('default lang — /store/slug/product/p1', () => {
    expect(productUrl('ahmet-oto', 'p1', 'en', 'en')).toBe('/store/ahmet-oto/product/p1');
  });
  it('other lang — /store/slug/tr/product/p1', () => {
    expect(productUrl('ahmet-oto', 'p1', 'tr', 'en')).toBe('/store/ahmet-oto/tr/product/p1');
  });
});
