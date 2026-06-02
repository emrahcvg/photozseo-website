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
import { whatsappHref, socialHref, stockLabel, mapHref, productWhatsappHref, storeUrl, productUrl, slugify, productSlug, uniqueProductSlugs, specRows, shippingText, formatWeight } from './manifest';
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
  it('bilinmeyen tipte protokolsüz değer boş string döner', () => {
    expect(socialHref('other', 'serbest-metin')).toBe('');
  });
  it('bilinmeyen tipte tel: protokolüne izin verir', () => {
    expect(socialHref('other', 'tel:+905001234567')).toBe('tel:+905001234567');
  });
  it('javascript: protokolünü engeller (XSS koruması)', () => {
    expect(socialHref('other', 'javascript:alert(1)')).toBe('');
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
  it('default lang — /store/slug/product/tesla-model-y-paspas-seti', () => {
    expect(productUrl('ahmet-oto', 'tesla-model-y-paspas-seti', 'en', 'en')).toBe('/store/ahmet-oto/product/tesla-model-y-paspas-seti');
  });
  it('other lang — /store/slug/tr/product/tesla-model-y-paspas-seti', () => {
    expect(productUrl('ahmet-oto', 'tesla-model-y-paspas-seti', 'tr', 'en')).toBe('/store/ahmet-oto/tr/product/tesla-model-y-paspas-seti');
  });
});

describe('slugify', () => {
  it('Turkish chars + spaces', () => {
    expect(slugify('Tesla Model Y Paspas Seti')).toBe('tesla-model-y-paspas-seti');
  });
  it('İ (capital dotted I) → i', () => {
    expect(slugify('İç Ambiyans LED Kiti')).toBe('ic-ambiyans-led-kiti');
  });
  it('ç,ş transliteration', () => {
    expect(slugify('Çelik Şönt')).toBe('celik-sont');
  });
  it('trims leading/trailing spaces', () => {
    expect(slugify('  hello world  ')).toBe('hello-world');
  });
  it('empty string → empty string', () => {
    expect(slugify('')).toBe('');
  });
});

describe('productSlug', () => {
  const base: Product = { id: 'p1', title: { tr: 'Tesla Model Y Paspas Seti', en: 'Model Y Floor Mat Set' }, images: [] };

  it('uses product.slug when set', () => {
    expect(productSlug({ ...base, slug: 'tesla-model-y-paspas-seti' }, 'tr')).toBe('tesla-model-y-paspas-seti');
  });
  it('derives slug from title when product.slug not set', () => {
    expect(productSlug(base, 'tr')).toBe('tesla-model-y-paspas-seti');
  });
  it('falls back to en title when locale not available', () => {
    expect(productSlug(base, 'de')).toBe('model-y-floor-mat-set');
  });
});

describe('uniqueProductSlugs', () => {
  it('assigns unique slugs, deduplicating with -2 suffix', () => {
    const p1: Product = { id: 'p1', title: { en: 'Mat' }, images: [] };
    const p2: Product = { id: 'p2', title: { en: 'Mat' }, images: [] };
    const map = uniqueProductSlugs([p1, p2], 'en');
    expect(map.get('p1')).toBe('mat');
    expect(map.get('p2')).toBe('mat-2');
  });
  it('assigns -3 for third duplicate', () => {
    const p1: Product = { id: 'p1', title: { en: 'X' }, images: [] };
    const p2: Product = { id: 'p2', title: { en: 'X' }, images: [] };
    const p3: Product = { id: 'p3', title: { en: 'X' }, images: [] };
    const map = uniqueProductSlugs([p1, p2, p3], 'en');
    expect(map.get('p3')).toBe('x-3');
  });
  it('non-conflicting slugs stay unchanged', () => {
    const p1: Product = { id: 'p1', title: { en: 'Alpha' }, images: [] };
    const p2: Product = { id: 'p2', title: { en: 'Beta' }, images: [] };
    const map = uniqueProductSlugs([p1, p2], 'en');
    expect(map.get('p1')).toBe('alpha');
    expect(map.get('p2')).toBe('beta');
  });
});

describe('specRows', () => {
  it('returns rows for defined attributes in order', () => {
    const p: Product = {
      id: 'p1', title: { en: 'T' }, images: [],
      attributes: {
        color: { tr: 'Siyah', en: 'Black' },
        material: { tr: 'TPE Kauçuk', en: 'TPE Rubber' },
        warrantyMonths: 24,
        countryOfOrigin: 'TR',
        barcode: '8690000000001',
      },
    };
    const rows = specRows(p, 'en');
    expect(rows).toEqual([
      { label: 'Color', value: 'Black' },
      { label: 'Material', value: 'TPE Rubber' },
      { label: 'Warranty', value: '24 mo' },
      { label: 'Origin', value: 'TR' },
      { label: 'Barcode', value: '8690000000001' },
    ]);
  });
  it('returns tr labels for tr locale', () => {
    const p: Product = {
      id: 'p1', title: { tr: 'T' }, images: [],
      attributes: { color: { tr: 'Siyah', en: 'Black' }, warrantyMonths: 12 },
    };
    const rows = specRows(p, 'tr');
    expect(rows[0]).toEqual({ label: 'Renk', value: 'Siyah' });
    expect(rows[1]).toEqual({ label: 'Garanti', value: '12 ay' });
  });
  it('empty attributes → []', () => {
    const p: Product = { id: 'p1', title: { en: 'T' }, images: [], attributes: {} };
    expect(specRows(p, 'en')).toEqual([]);
  });
  it('no attributes → []', () => {
    const p: Product = { id: 'p1', title: { en: 'T' }, images: [] };
    expect(specRows(p, 'en')).toEqual([]);
  });
});

describe('shippingText', () => {
  it('all dims + weight in kg (en)', () => {
    const s = { weightGrams: 3200, lengthCM: 60, widthCM: 45, heightCM: 8 };
    expect(shippingText(s, 'en')).toBe('60×45×8 cm, 3.2 kg');
  });
  it('weight in kg uses locale decimal separator (tr)', () => {
    expect(shippingText({ weightGrams: 3200 }, 'tr')).toBe('3,2 kg');
  });
  it('weight under 1kg stays grams', () => {
    expect(shippingText({ weightGrams: 250 }, 'en')).toBe('250 g');
  });
  it('null when nothing', () => {
    expect(shippingText({}, 'en')).toBeNull();
    expect(shippingText(undefined, 'en')).toBeNull();
  });
});

describe('formatWeight', () => {
  it('grams below 1000', () => {
    expect(formatWeight(250, 'en')).toBe('250 g');
  });
  it('kg with en decimal', () => {
    expect(formatWeight(3200, 'en')).toBe('3.2 kg');
  });
  it('kg with tr decimal', () => {
    expect(formatWeight(1500, 'tr')).toBe('1,5 kg');
  });
});

// ── groupProductsByCategory invariant kilitleri ──────────────────────────────

function mkManifest(partial: Partial<Manifest>): Manifest {
  return {
    store: { slug: 's', displayName: 'S', contact: {}, languages: ['en'], currency: 'USD' },
    categories: [],
    products: [],
    meta: { version: 1, updatedAt: '' },
    ...partial,
  } as Manifest;
}

describe('groupProductsByCategory — invariant korunur', () => {
  it('categoryId === category.id eşleşen ürünler doğru grupta', () => {
    const m = mkManifest({
      categories: [{ id: '267', name: { en: 'Phones' } }],
      products: [
        { id: 'p1', categoryId: '267', title: { en: 'A' }, images: [] },
        { id: 'p2', categoryId: '267', title: { en: 'B' }, images: [] },
      ],
    });
    const groups = groupProductsByCategory(m);
    expect(groups).toHaveLength(1);
    expect(groups[0].category?.id).toBe('267');
    expect(groups[0].products).toHaveLength(2);
  });
  it('eşleşmeyen categoryId → null (Other) grubuna düşer', () => {
    const m = mkManifest({
      categories: [{ id: '267', name: { en: 'Phones' } }],
      products: [{ id: 'p1', categoryId: 'c99', title: { en: 'X' }, images: [] }],
    });
    const groups = groupProductsByCategory(m);
    expect(groups).toHaveLength(1);
    expect(groups[0].category).toBeNull();
  });
  it('categoryId yoksa Other grubuna', () => {
    const m = mkManifest({
      categories: [],
      products: [{ id: 'p1', title: { en: 'X' }, images: [] }],
    });
    const groups = groupProductsByCategory(m);
    expect(groups[0].category).toBeNull();
  });
  it('boş gruplar elenir', () => {
    const m = mkManifest({
      categories: [{ id: '267', name: { en: 'Phones' } }],
      products: [],
    });
    expect(groupProductsByCategory(m)).toEqual([]);
  });
});
