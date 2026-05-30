# Web Storefront (P1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bir `manifest.json` verildiğinde, çok dilli ve kategorili bir online mağaza sayfasını HTML olarak render eden Astro modülü.

**Architecture:** Saf TS helper modülleri (manifest tipleri, locale çözümleme, fiyat biçimleme, kategori gruplama) vitest ile TDD edilir; `.astro` bileşenleri bu test edilmiş helper'ları tüketir. Mağaza verisi P1'de `src/storefront/fixtures/*.json` dosyalarından gelir (`getStaticPaths` ile build edilir). Gerçek registry+Drive çözümlemesi ve Cloudflare SSR adapter P2/entegrasyon kapsamıdır, P1'de YOK.

**Tech Stack:** Astro 6, TypeScript (strict), vitest, mevcut `Layout.astro` (SEO/OG/RTL hazır), i18n (`src/i18n/ui.ts`).

**Spec:** `photoZseo/docs/superpowers/specs/2026-05-30-online-magaza-google-drive-design.md`

---

## File Structure

**Create:**
- `vitest.config.ts` — vitest yapılandırması
- `src/storefront/types.ts` — Manifest TS tipleri (spec'in 4 bloğu)
- `src/storefront/manifest.ts` — saf helper'lar: locale çözümleme, fiyat, kategori gruplama, iletişim linkleri
- `src/storefront/manifest.test.ts` — helper unit testleri (vitest)
- `src/storefront/source.ts` — fixture manifest yükleyici (P1 veri kaynağı; P2'de registry+Drive ile değişecek soyutlama noktası)
- `src/storefront/source.test.ts` — source unit testi
- `src/storefront/fixtures/ahmet-oto-yedek.json` — örnek mağaza manifesti
- `src/components/storefront/ProductCard.astro` — tek ürün kartı
- `src/components/storefront/CategorySection.astro` — kategori başlığı + ürün gridi
- `src/components/storefront/StoreHeader.astro` — logo/isim/tagline/konum + iletişim butonları
- `src/components/storefront/StoreFooter.astro` — "photoZseo ile oluşturuldu" + şikayet linki
- `src/components/storefront/StorePage.astro` — tüm bileşenleri birleştiren orkestratör
- `src/styles/storefront.css` — mağaza stilleri
- `src/pages/store/[slug].astro` — varsayılan dil route'u (`/store/<slug>`)
- `src/pages/store/[slug]/[lang].astro` — dile özel route (`/store/<slug>/<lang>`)

**Modify:**
- `package.json` — vitest devDependency + `test` script

---

## Task 1: Vitest kurulumu

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: vitest'i devDependency olarak kur**

Run: `npm install -D vitest@^3`
Expected: `package.json` devDependencies'e `vitest` eklenir, hata yok.

- [ ] **Step 2: vitest config oluştur**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 3: `test` script ekle**

`package.json` → `scripts` bloğuna ekle (mevcut satırların yanına):

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Boş çalıştırma ile kurulumu doğrula**

Run: `npm test`
Expected: "No test files found" benzeri çıktı, exit kodu hatasız (henüz test yok).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add vitest for storefront helper tests"
```

---

## Task 2: Manifest tipleri + fixture

**Files:**
- Create: `src/storefront/types.ts`
- Create: `src/storefront/fixtures/ahmet-oto-yedek.json`

- [ ] **Step 1: Manifest tiplerini yaz**

Create `src/storefront/types.ts`:

```ts
export type Localized = Record<string, string>;

export interface SocialLink {
  type: string; // instagram | telegram | whatsapp | website | other
  value: string;
}

export interface StoreContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  social?: SocialLink[];
}

export interface StoreLocation {
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

export interface StoreInfo {
  slug: string;
  displayName: string;
  logo?: string;
  tagline?: Localized;
  location?: StoreLocation;
  contact: StoreContact;
  languages: string[];
  currency: string;
}

export interface Category {
  id: string;
  name: Localized;
}

export interface Product {
  id: string;
  categoryId?: string;
  title: Localized;
  description?: Localized;
  price?: number;
  compareAtPrice?: number;
  currency?: string;
  sku?: string;
  inStock?: boolean;
  images: string[];
}

export interface ManifestMeta {
  version: number;
  updatedAt: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface Manifest {
  store: StoreInfo;
  categories: Category[];
  products: Product[];
  meta: ManifestMeta;
}
```

- [ ] **Step 2: Örnek fixture manifesti yaz**

Create `src/storefront/fixtures/ahmet-oto-yedek.json` (görseller P1'de mutlak placeholder URL; gerçek Drive/CF çözümlemesi P2/P3):

```json
{
  "store": {
    "slug": "ahmet-oto-yedek",
    "displayName": "Ahmet Oto Yedek",
    "logo": "https://picsum.photos/seed/ahmetlogo/200/200",
    "tagline": { "tr": "Orijinal Tesla yedek parça", "en": "Genuine Tesla spare parts" },
    "location": { "city": "İstanbul", "country": "TR", "lat": 41.0, "lng": 29.0 },
    "contact": {
      "phone": "+905551112233",
      "whatsapp": "+905551112233",
      "email": "ahmet@example.com",
      "address": "Kadıköy, İstanbul",
      "social": [
        { "type": "instagram", "value": "ahmetoto" },
        { "type": "telegram", "value": "ahmetoto" }
      ]
    },
    "languages": ["tr", "en"],
    "currency": "TRY"
  },
  "categories": [
    { "id": "c1", "name": { "tr": "Paspaslar", "en": "Floor Mats" } },
    { "id": "c2", "name": { "tr": "Aydınlatma", "en": "Lighting" } }
  ],
  "products": [
    {
      "id": "p1",
      "categoryId": "c1",
      "title": { "tr": "Tesla Model Y Paspas Seti", "en": "Model Y Floor Mat Set" },
      "description": { "tr": "Tam oturan, su geçirmez paspas seti.", "en": "Custom-fit, waterproof mat set." },
      "price": 1499,
      "compareAtPrice": 1899,
      "currency": "TRY",
      "sku": "TPC-MAT-MY",
      "inStock": true,
      "images": ["https://picsum.photos/seed/p1a/800/800", "https://picsum.photos/seed/p1b/800/800"]
    },
    {
      "id": "p2",
      "categoryId": "c2",
      "title": { "tr": "İç Ambiyans LED Kiti", "en": "Interior Ambient LED Kit" },
      "description": { "tr": "16 renk, uygulama kontrollü.", "en": "16 colors, app controlled." },
      "price": 899,
      "currency": "TRY",
      "sku": "TPC-LED-AMB",
      "inStock": false,
      "images": ["https://picsum.photos/seed/p2a/800/800"]
    },
    {
      "id": "p3",
      "categoryId": "c2",
      "title": { "tr": "Plaka Çerçevesi", "en": "License Plate Frame" },
      "description": { "tr": "Karbon görünümlü.", "en": "Carbon-look finish." },
      "currency": "TRY",
      "inStock": true,
      "images": ["https://picsum.photos/seed/p3a/800/800"]
    }
  ],
  "meta": {
    "version": 1,
    "updatedAt": "2026-05-30T18:00:00Z",
    "seo": {
      "title": "Ahmet Oto Yedek — Tesla Yedek Parça",
      "description": "Orijinal Tesla yedek parça ve aksesuar mağazası.",
      "keywords": ["tesla", "yedek parça", "oto aksesuar"]
    }
  }
}
```

- [ ] **Step 3: Tipleri doğrula (build-time type check)**

Run: `npx astro check --minimumSeverity error 2>&1 | tail -5 || npx tsc --noEmit 2>&1 | tail -5`
Expected: `src/storefront/types.ts` ile ilgili tip hatası yok.

- [ ] **Step 4: Commit**

```bash
git add src/storefront/types.ts src/storefront/fixtures/ahmet-oto-yedek.json
git commit -m "feat(storefront): add manifest types and sample fixture"
```

---

## Task 3: Locale çözümleme + fiyat biçimleme (TDD)

**Files:**
- Create: `src/storefront/manifest.ts`
- Test: `src/storefront/manifest.test.ts`

- [ ] **Step 1: Failing testleri yaz**

Create `src/storefront/manifest.test.ts`:

```ts
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
```

- [ ] **Step 2: Testlerin başarısız olduğunu doğrula**

Run: `npm test -- src/storefront/manifest.test.ts`
Expected: FAIL — `manifest.ts` modülü/exportları bulunamıyor.

- [ ] **Step 3: Minimal implementasyonu yaz**

Create `src/storefront/manifest.ts`:

```ts
import type { Localized } from './types';

export const FALLBACK_LOCALE = 'en';

export function resolveLocalized(
  field: Localized | undefined,
  locale: string,
  fallback: string = FALLBACK_LOCALE,
): string {
  if (!field) return '';
  return field[locale] ?? field[fallback] ?? Object.values(field)[0] ?? '';
}

export function formatPrice(
  amount: number | undefined,
  currency: string,
  locale: string,
): string | null {
  if (amount == null) return null;
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}
```

- [ ] **Step 4: Testlerin geçtiğini doğrula**

Run: `npm test -- src/storefront/manifest.test.ts`
Expected: PASS (8 test).

- [ ] **Step 5: Commit**

```bash
git add src/storefront/manifest.ts src/storefront/manifest.test.ts
git commit -m "feat(storefront): add resolveLocalized and formatPrice helpers"
```

---

## Task 4: Kategori gruplama + mağaza locale çözümleme (TDD)

**Files:**
- Modify: `src/storefront/manifest.ts`
- Modify: `src/storefront/manifest.test.ts`

- [ ] **Step 1: Failing testleri ekle**

`src/storefront/manifest.test.ts` dosyasının SONUNA ekle:

```ts
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
```

- [ ] **Step 2: Testlerin başarısız olduğunu doğrula**

Run: `npm test -- src/storefront/manifest.test.ts`
Expected: FAIL — `groupProductsByCategory` / `resolveStoreLocale` export edilmemiş.

- [ ] **Step 3: Implementasyonu ekle**

`src/storefront/manifest.ts` SONUNA ekle (mevcut importu güncelle):

```ts
import type { Manifest, Category, Product } from './types';

export interface CategoryGroup {
  category: Category | null;
  products: Product[];
}

export function groupProductsByCategory(manifest: Manifest): CategoryGroup[] {
  const groups: CategoryGroup[] = manifest.categories.map((c) => ({
    category: c,
    products: manifest.products.filter((p) => p.categoryId === c.id),
  }));
  const known = new Set(manifest.categories.map((c) => c.id));
  const uncategorized = manifest.products.filter((p) => !p.categoryId || !known.has(p.categoryId));
  if (uncategorized.length) groups.push({ category: null, products: uncategorized });
  return groups.filter((g) => g.products.length > 0);
}

export function resolveStoreLocale(manifest: Manifest, requested?: string): string {
  const langs = manifest.store.languages ?? [];
  if (requested && langs.includes(requested)) return requested;
  if (langs.includes(FALLBACK_LOCALE)) return FALLBACK_LOCALE;
  return langs[0] ?? FALLBACK_LOCALE;
}
```

> Not: `import type { Localized } from './types';` satırını `import type { Localized, Manifest, Category, Product } from './types';` olacak şekilde birleştir (tek import satırı, çift import olmasın).

- [ ] **Step 4: Testlerin geçtiğini doğrula**

Run: `npm test -- src/storefront/manifest.test.ts`
Expected: PASS (14 test).

- [ ] **Step 5: Commit**

```bash
git add src/storefront/manifest.ts src/storefront/manifest.test.ts
git commit -m "feat(storefront): add category grouping and store locale resolution"
```

---

## Task 5: İletişim / sosyal link helper'ları (TDD)

**Files:**
- Modify: `src/storefront/manifest.ts`
- Modify: `src/storefront/manifest.test.ts`

- [ ] **Step 1: Failing testleri ekle**

`src/storefront/manifest.test.ts` SONUNA ekle:

```ts
import { whatsappHref, socialHref } from './manifest';

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
```

- [ ] **Step 2: Testlerin başarısız olduğunu doğrula**

Run: `npm test -- src/storefront/manifest.test.ts`
Expected: FAIL — `whatsappHref` / `socialHref` yok.

- [ ] **Step 3: Implementasyonu ekle**

`src/storefront/manifest.ts` SONUNA ekle:

```ts
export function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;
}

export function socialHref(type: string, value: string): string {
  if (/^https?:\/\//.test(value)) return value;
  const handle = value.replace(/^@/, '');
  switch (type) {
    case 'instagram':
      return `https://instagram.com/${handle}`;
    case 'telegram':
      return `https://t.me/${handle}`;
    case 'whatsapp':
      return whatsappHref(value);
    default:
      return value;
  }
}
```

- [ ] **Step 4: Testlerin geçtiğini doğrula**

Run: `npm test -- src/storefront/manifest.test.ts`
Expected: PASS (19 test).

- [ ] **Step 5: Commit**

```bash
git add src/storefront/manifest.ts src/storefront/manifest.test.ts
git commit -m "feat(storefront): add whatsapp and social href helpers"
```

---

## Task 6: Fixture veri kaynağı (TDD)

**Files:**
- Create: `src/storefront/source.ts`
- Test: `src/storefront/source.test.ts`

- [ ] **Step 1: Failing testi yaz**

Create `src/storefront/source.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { getAllManifests, getManifestBySlug } from './source';

describe('source', () => {
  it('fixture klasöründeki manifestleri yükler', () => {
    const all = getAllManifests();
    expect(all.length).toBeGreaterThan(0);
  });
  it('slug ile manifest bulur', () => {
    const m = getManifestBySlug('ahmet-oto-yedek');
    expect(m?.store.displayName).toBe('Ahmet Oto Yedek');
  });
  it('olmayan slug için undefined döner', () => {
    expect(getManifestBySlug('yok-boyle-bir-magaza')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

Run: `npm test -- src/storefront/source.test.ts`
Expected: FAIL — `source.ts` yok.

- [ ] **Step 3: Implementasyonu yaz**

Create `src/storefront/source.ts`:

```ts
import type { Manifest } from './types';

// P1: veri kaynağı fixture JSON'lar. P2'de bu modül registry+Drive fetch ile değişecek.
const fixtures = import.meta.glob<{ default: Manifest }>('./fixtures/*.json', { eager: true });

export function getAllManifests(): Manifest[] {
  return Object.values(fixtures).map((mod) => mod.default);
}

export function getManifestBySlug(slug: string): Manifest | undefined {
  return getAllManifests().find((m) => m.store.slug === slug);
}
```

- [ ] **Step 4: Testin geçtiğini doğrula**

Run: `npm test -- src/storefront/source.test.ts`
Expected: PASS (3 test).

- [ ] **Step 5: Tüm helper testleri yeşil mi doğrula**

Run: `npm test`
Expected: PASS (22 test toplam), exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/storefront/source.ts src/storefront/source.test.ts
git commit -m "feat(storefront): add fixture-based manifest source"
```

---

## Task 7: ProductCard bileşeni

**Files:**
- Create: `src/components/storefront/ProductCard.astro`

- [ ] **Step 1: ProductCard'ı yaz**

Create `src/components/storefront/ProductCard.astro`:

```astro
---
import type { Product } from '../../storefront/types';
import { resolveLocalized, formatPrice } from '../../storefront/manifest';

interface Props {
  product: Product;
  locale: string;
  currency: string;
}

const { product, locale, currency } = Astro.props;
const title = resolveLocalized(product.title, locale);
const description = resolveLocalized(product.description, locale);
const price = formatPrice(product.price, product.currency ?? currency, locale);
const compareAt = formatPrice(product.compareAtPrice, product.currency ?? currency, locale);
const image = product.images[0] ?? '';
const soldOut = product.inStock === false;
---

<article class="sf-card">
  <div class="sf-card__media">
    {image && <img src={image} alt={title} loading="lazy" width="800" height="800" />}
    {soldOut && <span class="sf-card__badge">{locale === 'tr' ? 'Tükendi' : 'Sold out'}</span>}
  </div>
  <div class="sf-card__body">
    <h3 class="sf-card__title">{title}</h3>
    {description && <p class="sf-card__desc">{description}</p>}
    <div class="sf-card__price">
      {price ? (
        <>
          <span class="sf-card__amount">{price}</span>
          {compareAt && <span class="sf-card__compare">{compareAt}</span>}
        </>
      ) : (
        <span class="sf-card__contact">{locale === 'tr' ? 'Fiyat için iletişime geç' : 'Contact for price'}</span>
      )}
    </div>
  </div>
</article>
```

- [ ] **Step 2: Tip kontrolü**

Run: `npx astro check --minimumSeverity error 2>&1 | tail -5`
Expected: ProductCard ile ilgili hata yok (StorePage henüz yok, onunla ilgili "unused" uyarısı olabilir; error seviyesinde olmamalı).

- [ ] **Step 3: Commit**

```bash
git add src/components/storefront/ProductCard.astro
git commit -m "feat(storefront): add ProductCard component"
```

---

## Task 8: CategorySection bileşeni

**Files:**
- Create: `src/components/storefront/CategorySection.astro`

- [ ] **Step 1: CategorySection'ı yaz**

Create `src/components/storefront/CategorySection.astro`:

```astro
---
import type { CategoryGroup } from '../../storefront/manifest';
import { resolveLocalized } from '../../storefront/manifest';
import ProductCard from './ProductCard.astro';

interface Props {
  group: CategoryGroup;
  locale: string;
  currency: string;
}

const { group, locale, currency } = Astro.props;
const heading = group.category
  ? resolveLocalized(group.category.name, locale)
  : (locale === 'tr' ? 'Diğer' : 'Other');
---

<section class="sf-section">
  <h2 class="sf-section__title">{heading}</h2>
  <div class="sf-grid">
    {group.products.map((product) => (
      <ProductCard product={product} locale={locale} currency={currency} />
    ))}
  </div>
</section>
```

- [ ] **Step 2: Tip kontrolü**

Run: `npx astro check --minimumSeverity error 2>&1 | tail -5`
Expected: CategorySection ile ilgili hata yok.

- [ ] **Step 3: Commit**

```bash
git add src/components/storefront/CategorySection.astro
git commit -m "feat(storefront): add CategorySection component"
```

---

## Task 9: StoreHeader bileşeni (iletişim butonları)

**Files:**
- Create: `src/components/storefront/StoreHeader.astro`

- [ ] **Step 1: StoreHeader'ı yaz**

Create `src/components/storefront/StoreHeader.astro`:

```astro
---
import type { StoreInfo } from '../../storefront/types';
import { resolveLocalized, whatsappHref, socialHref } from '../../storefront/manifest';

interface Props {
  store: StoreInfo;
  locale: string;
}

const { store, locale } = Astro.props;
const tagline = resolveLocalized(store.tagline, locale);
const c = store.contact;

const buttons: { label: string; href: string }[] = [];
if (c.whatsapp) buttons.push({ label: 'WhatsApp', href: whatsappHref(c.whatsapp) });
if (c.phone) buttons.push({ label: locale === 'tr' ? 'Ara' : 'Call', href: `tel:${c.phone}` });
if (c.email) buttons.push({ label: 'E-mail', href: `mailto:${c.email}` });
for (const s of c.social ?? []) {
  buttons.push({ label: s.type, href: socialHref(s.type, s.value) });
}

const locationText = [store.location?.city, store.location?.country].filter(Boolean).join(', ');
---

<header class="sf-header">
  {store.logo && <img class="sf-header__logo" src={store.logo} alt={store.displayName} width="96" height="96" />}
  <h1 class="sf-header__name">{store.displayName}</h1>
  {tagline && <p class="sf-header__tagline">{tagline}</p>}
  {locationText && <p class="sf-header__location">📍 {locationText}</p>}
  <nav class="sf-header__contact" aria-label={locale === 'tr' ? 'İletişim' : 'Contact'}>
    {buttons.map((b) => (
      <a class="sf-btn" href={b.href} target="_blank" rel="noopener noreferrer">{b.label}</a>
    ))}
  </nav>
</header>
```

- [ ] **Step 2: Tip kontrolü**

Run: `npx astro check --minimumSeverity error 2>&1 | tail -5`
Expected: StoreHeader ile ilgili hata yok.

- [ ] **Step 3: Commit**

```bash
git add src/components/storefront/StoreHeader.astro
git commit -m "feat(storefront): add StoreHeader with contact buttons"
```

---

## Task 10: StoreFooter bileşeni

**Files:**
- Create: `src/components/storefront/StoreFooter.astro`

- [ ] **Step 1: StoreFooter'ı yaz**

Create `src/components/storefront/StoreFooter.astro`:

```astro
---
interface Props {
  slug: string;
  locale: string;
}

const { slug, locale } = Astro.props;
const poweredBy = locale === 'tr' ? 'Bu mağaza photoZseo ile oluşturuldu' : 'This store was created with photoZseo';
const reportLabel = locale === 'tr' ? 'Bu mağazayı şikayet et' : 'Report this store';
const reportHref = `mailto:abuse@photozseo.com?subject=${encodeURIComponent('Report store: ' + slug)}`;
---

<footer class="sf-footer">
  <a class="sf-footer__brand" href="https://photozseo.com" target="_blank" rel="noopener noreferrer">{poweredBy}</a>
  <span class="sf-footer__sep">·</span>
  <a class="sf-footer__report" href={reportHref}>{reportLabel}</a>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/storefront/StoreFooter.astro
git commit -m "feat(storefront): add StoreFooter with powered-by and report link"
```

---

## Task 11: StorePage orkestratörü + stiller

**Files:**
- Create: `src/components/storefront/StorePage.astro`
- Create: `src/styles/storefront.css`

- [ ] **Step 1: StorePage'i yaz**

Create `src/components/storefront/StorePage.astro`:

```astro
---
import type { Manifest } from '../../storefront/types';
import { groupProductsByCategory } from '../../storefront/manifest';
import StoreHeader from './StoreHeader.astro';
import CategorySection from './CategorySection.astro';
import StoreFooter from './StoreFooter.astro';
import '../../styles/storefront.css';

interface Props {
  manifest: Manifest;
  locale: string;
}

const { manifest, locale } = Astro.props;
const groups = groupProductsByCategory(manifest);
---

<main class="sf-store">
  <StoreHeader store={manifest.store} locale={locale} />
  {groups.map((group) => (
    <CategorySection group={group} locale={locale} currency={manifest.store.currency} />
  ))}
  <StoreFooter slug={manifest.store.slug} locale={locale} />
</main>
```

- [ ] **Step 2: Stilleri yaz**

Create `src/styles/storefront.css`:

```css
.sf-store { max-width: 1100px; margin: 0 auto; padding: 24px 16px 64px; }

.sf-header { text-align: center; padding: 32px 0 24px; }
.sf-header__logo { border-radius: 50%; object-fit: cover; }
.sf-header__name { font-size: 1.8rem; margin: 12px 0 4px; }
.sf-header__tagline { color: #555; margin: 0 0 8px; }
.sf-header__location { color: #777; font-size: 0.9rem; margin: 0 0 16px; }
.sf-header__contact { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }

.sf-btn {
  display: inline-block; padding: 8px 16px; border-radius: 999px;
  background: #0B0E1A; color: #fff; text-decoration: none; font-size: 0.9rem;
}
.sf-btn:hover { opacity: 0.85; }

.sf-section { margin-top: 32px; }
.sf-section__title { font-size: 1.3rem; margin: 0 0 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; }

.sf-grid {
  display: grid; gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.sf-card { border: 1px solid #eee; border-radius: 12px; overflow: hidden; background: #fff; }
.sf-card__media { position: relative; aspect-ratio: 1 / 1; background: #f4f4f4; }
.sf-card__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.sf-card__badge {
  position: absolute; top: 8px; inset-inline-start: 8px;
  background: #c0392b; color: #fff; font-size: 0.75rem; padding: 2px 8px; border-radius: 6px;
}
.sf-card__body { padding: 12px; }
.sf-card__title { font-size: 1rem; margin: 0 0 6px; }
.sf-card__desc { font-size: 0.85rem; color: #666; margin: 0 0 8px; }
.sf-card__amount { font-weight: 700; }
.sf-card__compare { text-decoration: line-through; color: #999; margin-inline-start: 6px; font-size: 0.85rem; }
.sf-card__contact { color: #0B0E1A; font-size: 0.9rem; }

.sf-footer { margin-top: 48px; text-align: center; color: #888; font-size: 0.85rem; }
.sf-footer a { color: #888; }
.sf-footer__sep { margin: 0 8px; }
```

- [ ] **Step 3: Tip kontrolü**

Run: `npx astro check --minimumSeverity error 2>&1 | tail -5`
Expected: StorePage ile ilgili hata yok.

- [ ] **Step 4: Commit**

```bash
git add src/components/storefront/StorePage.astro src/styles/storefront.css
git commit -m "feat(storefront): add StorePage orchestrator and styles"
```

---

## Task 12: Route'lar (varsayılan + dile özel)

**Files:**
- Create: `src/pages/store/[slug].astro`
- Create: `src/pages/store/[slug]/[lang].astro`

- [ ] **Step 1: Varsayılan dil route'unu yaz**

Create `src/pages/store/[slug].astro`:

```astro
---
import Layout from '../../layouts/Layout.astro';
import StorePage from '../../components/storefront/StorePage.astro';
import { getAllManifests, getManifestBySlug } from '../../storefront/source';
import { resolveStoreLocale, resolveLocalized } from '../../storefront/manifest';
import { defaultLang, type Lang } from '../../i18n/ui';

export function getStaticPaths() {
  return getAllManifests().map((m) => ({ params: { slug: m.store.slug } }));
}

const { slug } = Astro.params;
const manifest = getManifestBySlug(slug!)!;
const locale = resolveStoreLocale(manifest, defaultLang);
const title = manifest.meta.seo?.title ?? manifest.store.displayName;
const description = manifest.meta.seo?.description ?? resolveLocalized(manifest.store.tagline, locale);
---

<Layout title={title} description={description} lang={locale as Lang} fullBleed>
  <StorePage manifest={manifest} locale={locale} />
</Layout>
```

- [ ] **Step 2: Dile özel route'u yaz**

Create `src/pages/store/[slug]/[lang].astro`:

```astro
---
import Layout from '../../../layouts/Layout.astro';
import StorePage from '../../../components/storefront/StorePage.astro';
import { getAllManifests, getManifestBySlug } from '../../../storefront/source';
import { resolveStoreLocale, resolveLocalized } from '../../../storefront/manifest';
import { type Lang } from '../../../i18n/ui';

export function getStaticPaths() {
  const paths: { params: { slug: string; lang: string } }[] = [];
  for (const m of getAllManifests()) {
    for (const lang of m.store.languages) {
      paths.push({ params: { slug: m.store.slug, lang } });
    }
  }
  return paths;
}

const { slug, lang } = Astro.params;
const manifest = getManifestBySlug(slug!)!;
const locale = resolveStoreLocale(manifest, lang);
const title = manifest.meta.seo?.title ?? manifest.store.displayName;
const description = manifest.meta.seo?.description ?? resolveLocalized(manifest.store.tagline, locale);
---

<Layout title={title} description={description} lang={locale as Lang} fullBleed>
  <StorePage manifest={manifest} locale={locale} />
</Layout>
```

- [ ] **Step 3: Tip kontrolü**

Run: `npx astro check --minimumSeverity error 2>&1 | tail -5`
Expected: Hata yok.

- [ ] **Step 4: Commit**

```bash
git add src/pages/store/
git commit -m "feat(storefront): add store routes (default + per-locale)"
```

---

## Task 13: Build doğrulaması + önizleme

**Files:** (yok — doğrulama task'i)

- [ ] **Step 1: Tüm testleri çalıştır**

Run: `npm test`
Expected: PASS (22 test), exit 0.

- [ ] **Step 2: Production build al**

Run: `npm run build`
Expected: Build başarılı; çıktıda `/store/ahmet-oto-yedek` ve `/store/ahmet-oto-yedek/tr`, `/store/ahmet-oto-yedek/en` sayfaları üretilmiş olmalı.

- [ ] **Step 3: Üretilen HTML'i doğrula**

Run: `cat dist/store/ahmet-oto-yedek/index.html | grep -o 'Ahmet Oto Yedek' | head -1 && grep -c 'sf-card' dist/store/ahmet-oto-yedek/index.html`
Expected: "Ahmet Oto Yedek" görünür; `sf-card` sayısı 3 (üç ürün).

- [ ] **Step 4: TR sayfasında Türkçe içerik doğrula**

Run: `grep -o 'Tükendi' dist/store/ahmet-oto-yedek/tr/index.html | head -1 && grep -o 'Paspaslar' dist/store/ahmet-oto-yedek/tr/index.html | head -1`
Expected: "Tükendi" (stokta olmayan ürün) ve "Paspaslar" (kategori) görünür.

- [ ] **Step 5: Görsel önizleme (manuel)**

Run: `npm run preview`
Tarayıcıda aç: `http://localhost:4321/store/ahmet-oto-yedek` ve `.../tr`
Expected: Logo, isim, tagline, konum, iletişim butonları (WhatsApp/Ara/E-mail/instagram/telegram), iki kategori (Paspaslar/Aydınlatma → TR'de), ürün kartları, "Fiyat için iletişime geç" (p3), "Tükendi" rozeti (p2), alt bilgi + şikayet linki görünür. RTL dil yok (tr/en LTR).

- [ ] **Step 6: Son commit (gerekiyorsa)**

Build artefaktları (`dist/`) `.gitignore`'da; ek commit yok. Plan tamam.

---

## Self-Review Notları (yazım sırasında kontrol edildi)

- **Spec kapsama:** P1 = "manifest → HTML render" tüm spec render gereksinimlerini karşılar: tam irtibat (StoreHeader butonları), kategorili vitrin (CategorySection), çok dilli (resolveLocalized + per-locale route), fiyat opsiyonel ("iletişime geç"), stok/tükendi rozeti, ziyaretçi takipsiz + şikayet linki (StoreFooter), SEO (Layout + meta.seo). **Kapsam DIŞI (bilinçli):** registry çözümleme, Drive/CF görsel cache, SSR adapter, otomatik/manuel güncelleme akışı → P2/P3.
- **Tip tutarlılığı:** `CategoryGroup` (Task 4) → CategorySection/StorePage'de aynı isimle kullanıldı. `resolveLocalized/formatPrice/groupProductsByCategory/resolveStoreLocale/whatsappHref/socialHref` imzaları task'lar arası tutarlı. `getAllManifests/getManifestBySlug` (Task 6) → route'larda aynı.
- **Placeholder yok:** her adımda gerçek kod var.
- **Bilinen kısıt:** Fixture görselleri picsum.photos (internet gerektirir önizlemede). Gerçek görsel çözümleme P2/P3. `astro check` çıktısı, henüz tüketilmeyen bileşenler için "hint/warning" verebilir; bu yüzden `--minimumSeverity error` ile yalnız error'a bakılıyor.
