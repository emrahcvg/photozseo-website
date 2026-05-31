# P1 – Web Çekirdek (Marketplace Veri + Arama İndeksi) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** photoZseo Marketplace keşif katmanının veri çekirdeğini kur: D1 kanonik şema + `PUT /api/store/<slug>` write-through entegrasyonu + Orama bellek-içi full-text indeks + faceted sorgu modülü (`functions/_lib/marketplace.ts`).

**Architecture:** Mevcut KV manifest render katmanı dokunulmaz kalır. `PUT /api/store/<slug>` aynı istekte KV'ye yazdıktan sonra D1'e write-through upsert yapar ve `meta.index_version` sayacını artırır. D1 kanonik kaynaktır (filtre/facet/sıralama anlık SQL). Orama indeksi soğuk başlangıçta D1'den modül-seviye global'e tembel kurulur, `index_version` değişince yeniden inşa edilir; full-text sorgu Orama'dan, filtreler D1'den gelir. Farklı dildeki sorgu Workers AI ile kanonik dile çevrilir.

**Tech Stack:** Cloudflare Pages Functions, D1, Orama, Workers AI, TypeScript, vitest

---

## Paylaşılan Sözleşme (P2 buna güvenecek — DEĞİŞTİRME)

`functions/_lib/marketplace.ts` şu sembolleri export eder:

- Tipler: `ProductRow`, `StoreRow`, `Facets`, `OramaIndex`
- `upsertStoreToD1(db: D1Database, slug: string, record: StoreRecord): Promise<void>`
- `removeStoreFromD1(db: D1Database, slug: string): Promise<void>`
- `bumpIndexVersion(db: D1Database): Promise<number>`
- `getIndexVersion(db: D1Database): Promise<number>`
- `getOrama(db: D1Database): Promise<OramaIndex>`
- `searchProducts(db, ai, opts): Promise<{ items: ProductRow[]; facets: Facets; total: number }>`
- `listNewProducts(db, opts): Promise<{ items: ProductRow[]; total: number }>`
- `listStores(db, opts): Promise<{ items: StoreRow[]; total: number }>`

`migrations/0001_marketplace.sql` şema P2'nin de okuyacağı kanonik tablo yapısıdır.

---

## Test Stratejisi

- **Birim testleri (vitest):** `marketplace.ts` saf fonksiyonları + Orama mantığı, **bellek-içi sahte D1** (`fakeD1`) ile test edilir. Bu sahte, D1'in `prepare().bind().all()/first()/run()` zincirini taklit eden minimal bir SQL motoru DEĞİL — testlerimiz `marketplace.ts`'in SQL string'ine değil, modülün kendi yardımcı fonksiyonlarına (satır→Orama doc dönüşümü, facet hesaplama, filtre uygulama) doğrudan birim testi yazar. D1 ile gerçek entegrasyon `wrangler d1 execute --local` smoke testiyle doğrulanır.
- **AI sahtesi:** `translate.test.ts`'teki `fakeAI` deseni birebir kullanılır.
- Vitest config şu an yalnızca `src/**/*.test.ts` topluyor; **Task 1** bunu `functions/**/*.test.ts`'i de kapsayacak şekilde genişletir.
- Mevcut testler (translate, manifest, render…) her commit'ten önce yeşil kalmalı: `npx vitest run`.

---

## Task 1 — Vitest config functions/ test'lerini de toplasın

`marketplace.ts` testleri `functions/_lib/` altında yaşayacak (mevcut `translate.test.ts` import deseniyle tutarlı: test `src/`'te, kaynak `functions/`'ta). Önce config'i genişletip yeni klasörü include et.

- [ ] **1.1 — Failing test yaz.** `functions/_lib/marketplace.test.ts` oluştur (geçici minimal):

```ts
// functions/_lib/marketplace.test.ts
import { describe, it, expect } from 'vitest';

describe('marketplace test harness', () => {
  it('functions/ testleri toplanıyor', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **1.2 — Fail gör.** Bu test config `include` yüzünden HİÇ toplanmaz; kanıtla:

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: `No test files found, exiting with code 1` (veya filtre eşleşmediği uyarısı). Bu, include'un dar olduğunu kanıtlar.

- [ ] **1.3 — Config'i genişlet.** `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'functions/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **1.4 — Pass gör.**

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: `1 passed`.

- [ ] **1.5 — Tüm suite hâlâ yeşil mi?**

```bash
npx vitest run
```

Beklenen çıktı: tüm dosyalar `passed`, sıfır `failed`.

- [ ] **1.6 — Commit.** `vitest: functions/ test'lerini de topla`

---

## Task 2 — D1 migration + wrangler.toml binding

Kanonik şemayı SQL dosyası olarak yaz, wrangler'a D1 binding ekle, local D1'e uygula.

- [ ] **2.1 — Migration dosyasını yaz.** `migrations/0001_marketplace.sql`:

```sql
-- 0001_marketplace.sql — photoZseo Marketplace kanonik şema (P1)
-- D1 (SQLite). KV manifest render kaynağı kalır; D1 pazar yeri sorguları için kanonik kopya.

CREATE TABLE IF NOT EXISTS stores (
  slug          TEXT PRIMARY KEY,
  name          TEXT,
  city          TEXT,
  country       TEXT,
  iban          TEXT,
  iban_name     TEXT,
  whatsapp      TEXT,
  listed        INTEGER NOT NULL DEFAULT 0,
  lang          TEXT,
  index_version INTEGER,
  updated_at    TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id           TEXT PRIMARY KEY,
  store_slug   TEXT NOT NULL,
  title        TEXT,
  description  TEXT,
  category_id  TEXT,
  tags         TEXT,
  price        REAL,
  currency     TEXT,
  stock        INTEGER,
  image_url    TEXT,
  product_path TEXT,
  updated_at   TEXT
);

CREATE INDEX IF NOT EXISTS idx_products_store    ON products(store_slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

CREATE TABLE IF NOT EXISTS meta (
  key   TEXT PRIMARY KEY,
  value INTEGER
);

INSERT OR IGNORE INTO meta(key, value) VALUES ('index_version', 0);
```

- [ ] **2.2 — Local D1 veritabanı oluştur ve migration'ı uygula.** D1 binding adı `MARKET_DB`. Local dev için account gerekmez (miniflare emülasyonu):

```bash
npx wrangler d1 execute MARKET_DB --local --file=migrations/0001_marketplace.sql
```

Beklenen çıktı: `🌀 Executing on local database MARKET_DB` + `Executed ... commands` (hata yok). Not: ilk çağrı local sqlite dosyasını `.wrangler/state/` altında oluşturur.

- [ ] **2.3 — Şemayı doğrula.**

```bash
npx wrangler d1 execute MARKET_DB --local --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
```

Beklenen çıktı: `meta`, `products`, `stores` satırları.

```bash
npx wrangler d1 execute MARKET_DB --local --command="SELECT key, value FROM meta;"
```

Beklenen çıktı: `index_version | 0`.

- [ ] **2.4 — wrangler.toml'a D1 binding ekle.** `wrangler.toml` sonuna ekle (KV bloğunun altına):

```toml
# D1 — Marketplace kanonik veritabanı (P1, 2026-05-31).
# Local dev: `wrangler d1 execute MARKET_DB --local` miniflare ile emüle eder, account gerekmez.
# Production database_id: ilk `wrangler d1 create photozseo-marketplace` çıktısıyla doldurulacak (deploy adımı).
[[d1_databases]]
binding = "MARKET_DB"
database_name = "photozseo-marketplace"
database_id = "PLACEHOLDER_PRODUCTION_DB_ID"
migrations_dir = "migrations"
```

> NOT: `database_id` production deploy'da gerçek ID ile değişir; local test'i etkilemez. Bu placeholder bilinçlidir — deploy task'ı değil, P1 çekirdek görevidir.

- [ ] **2.5 — Commit.** `d1: marketplace migration + wrangler binding (MARKET_DB)`

---

## Task 3 — types.ts geriye uyumlu alanlar

P3 (iOS) manifest'e `marketplaceListed` + `payment.ibanName` ekleyecek. types.ts'i şimdiden opsiyonel/geriye uyumlu genişlet ki P1 kodu tip-güvenli okusun.

- [ ] **3.1 — Failing test yaz.** `src/storefront/types.test.ts` oluştur:

```ts
import { describe, it, expect } from 'vitest';
import type { StoreInfo } from './types';

describe('StoreInfo marketplace alanları', () => {
  it('marketplaceListed ve payment opsiyonel olarak set edilebilir', () => {
    const s: StoreInfo = {
      slug: 'x',
      displayName: 'ACME',
      contact: {},
      languages: ['tr'],
      currency: 'USD',
      marketplaceListed: true,
      payment: { iban: 'TR000', ibanName: 'Ad Soyad' },
    };
    expect(s.marketplaceListed).toBe(true);
    expect(s.payment?.ibanName).toBe('Ad Soyad');
  });
});
```

- [ ] **3.2 — Fail gör.**

```bash
npx vitest run src/storefront/types.test.ts
```

Beklenen çıktı: TS derleme hatası — `marketplaceListed`/`payment` `StoreInfo`'da yok (`Object literal may only specify known properties`). Test fail.

- [ ] **3.3 — types.ts'i genişlet.** `src/storefront/types.ts` içinde `StoreInfo`'ya ekle:

```ts
export interface StoreInfo {
  slug: string;
  displayName: string;
  logo?: string;
  tagline?: Localized;
  location?: StoreLocation;
  contact: StoreContact;
  languages: string[];
  currency: string;
  // Marketplace (P3 iOS tarafından yazılır — geriye uyumlu, opsiyonel).
  marketplaceListed?: boolean;
  payment?: {
    iban?: string;
    ibanName?: string;
  };
}
```

- [ ] **3.4 — Pass gör.**

```bash
npx vitest run src/storefront/types.test.ts
```

Beklenen çıktı: `1 passed`.

- [ ] **3.5 — Commit.** `types: StoreInfo'ya opsiyonel marketplaceListed + payment ekle`

---

## Task 4 — Orama bağımlılığı kur

- [ ] **4.1 — Paketi kur.** `@orama/orama` hem dependency (Workers runtime'da çalışır) hem dev (test) olarak gerekir; tek install yeter (dependencies'e girer):

```bash
npm install @orama/orama
```

Beklenen çıktı: `added N packages`, `package.json` `dependencies` altında `@orama/orama` belirir.

- [ ] **4.2 — Smoke test yaz.** `functions/_lib/orama-smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { create, insert, search } from '@orama/orama';

describe('orama smoke', () => {
  it('basit full-text arama çalışır', async () => {
    const db = create({
      schema: { id: 'string', title: 'string' },
    });
    await insert(db, { id: 'p1', title: 'Steel water bottle' });
    await insert(db, { id: 'p2', title: 'Leather wallet' });
    const res = await search(db, { term: 'bottle' });
    expect(res.count).toBe(1);
    expect(res.hits[0].document.id).toBe('p1');
  });
});
```

- [ ] **4.3 — Pass gör.**

```bash
npx vitest run functions/_lib/orama-smoke.test.ts
```

Beklenen çıktı: `1 passed`. (Eğer `create`'in await gerektirdiği bir Orama sürümü gelirse `const db = await create(...)` yap — sürüme göre uyarla; smoke testin amacı API şeklini kilitlemek.)

- [ ] **4.4 — Smoke test'i sil** (artık API doğrulandı, kalıcı değil):

```bash
rm functions/_lib/orama-smoke.test.ts
```

- [ ] **4.5 — Commit.** `deps: @orama/orama ekle (in-memory marketplace indeksi)`

---

## Task 5 — marketplace.ts: tipler + satır eşleme yardımcıları

Önce saf, D1'siz yardımcılar: `StoreRecord` manifest'ten D1 satırlarına eşleme. Bunlar `upsertStoreToD1`'in iç motorudur ve birim testi kolaydır.

- [ ] **5.1 — Failing test yaz.** `functions/_lib/marketplace.test.ts`'i (Task 1'deki placeholder) tamamen değiştir:

```ts
import { describe, it, expect } from 'vitest';
import {
  storeRecordToStoreFields,
  storeRecordToProductRows,
  type ProductRow,
} from './marketplace';
import type { StoreRecord } from './registry';
import type { Manifest } from '../../src/storefront/types';

function makeRecord(over: Partial<Manifest['store']> = {}, products: Manifest['products'] = []): StoreRecord {
  const manifest: Manifest = {
    store: {
      slug: 'acme',
      displayName: 'ACME Store',
      tagline: { en: 'Best gear' },
      location: { city: 'Istanbul', country: 'TR' },
      contact: { whatsapp: '+905551112233' },
      languages: ['tr', 'en'],
      currency: 'USD',
      marketplaceListed: true,
      payment: { iban: 'TR0001', ibanName: 'Ahmet Yilmaz' },
      ...over,
    },
    categories: [{ id: 'electronics.phones', name: { en: 'Phones' } }],
    products,
    meta: { version: 4, updatedAt: '2026-05-31T10:00:00Z' },
  };
  return { manifest, status: 'active', version: 4, updatedAt: '2026-05-31T10:00:00Z' };
}

describe('storeRecordToStoreFields', () => {
  it('manifest store alanlarını D1 store satırına eşler; kanonik dil languages[0]', () => {
    const rec = makeRecord();
    const f = storeRecordToStoreFields('acme', rec, 99);
    expect(f.slug).toBe('acme');
    expect(f.name).toBe('ACME Store');
    expect(f.city).toBe('Istanbul');
    expect(f.country).toBe('TR');
    expect(f.iban).toBe('TR0001');
    expect(f.iban_name).toBe('Ahmet Yilmaz');
    expect(f.whatsapp).toBe('+905551112233');
    expect(f.listed).toBe(1);          // marketplaceListed true → 1
    expect(f.lang).toBe('tr');         // languages[0]
    expect(f.index_version).toBe(99);
    expect(typeof f.updated_at).toBe('string');
  });

  it('marketplaceListed yoksa/false ise listed=0', () => {
    const rec = makeRecord({ marketplaceListed: false });
    expect(storeRecordToStoreFields('acme', rec, 1).listed).toBe(0);
    const rec2 = makeRecord({ marketplaceListed: undefined });
    expect(storeRecordToStoreFields('acme', rec2, 1).listed).toBe(0);
  });
});

describe('storeRecordToProductRows', () => {
  it('her ürünü kanonik dilde D1 satırına eşler; id=<slug>:<productSlug>', () => {
    const rec = makeRecord({}, [
      {
        id: 'p1',
        categoryId: 'electronics.phones',
        title: { tr: 'Akilli Telefon', en: 'Smart Phone' },
        description: { tr: 'Hizli', en: 'Fast' },
        price: 199.9,
        currency: 'USD',
        inStock: true,
        stockQty: 5,
        images: ['https://drive/img1.jpg'],
        tags: ['yeni', 'kampanya'],
      },
    ]);
    const rows: ProductRow[] = storeRecordToProductRows('acme', rec);
    expect(rows).toHaveLength(1);
    const r = rows[0];
    expect(r.store_slug).toBe('acme');
    expect(r.id).toContain('acme:');          // <slug>:<productSlug>
    expect(r.title).toBe('Akilli Telefon');   // kanonik dil tr
    expect(r.description).toBe('Hizli');
    expect(r.category_id).toBe('electronics.phones');
    expect(r.tags).toBe('yeni,kampanya');     // CSV
    expect(r.price).toBe(199.9);
    expect(r.currency).toBe('USD');
    expect(r.stock).toBe(5);
    expect(r.image_url).toBe('https://drive/img1.jpg');
    expect(r.product_path).toContain('/store/acme/product/');
  });

  it('stockQty yoksa inStock false → stock 0, true → 1', () => {
    const rec = makeRecord({}, [
      { id: 'p2', title: { tr: 'X' }, images: [], inStock: true },
      { id: 'p3', title: { tr: 'Y' }, images: [], inStock: false },
    ]);
    const rows = storeRecordToProductRows('acme', rec);
    expect(rows[0].stock).toBe(1);
    expect(rows[1].stock).toBe(0);
  });
});
```

- [ ] **5.2 — Fail gör.**

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: `Cannot find module './marketplace'` / import hatası — fail.

- [ ] **5.3 — marketplace.ts iskelet + eşleme yardımcıları.** `functions/_lib/marketplace.ts` oluştur:

```ts
/**
 * marketplace.ts — photoZseo Marketplace veri çekirdeği (P1).
 *
 * Sorumluluk:
 *   - StoreRecord (KV manifest) → D1 kanonik satırlar (write-through).
 *   - index_version monoton sayaç (meta tablosu).
 *   - Orama bellek-içi full-text indeks (D1'den tembel kurulur, version damgasıyla cache).
 *   - Faceted arama / yeni ürün listesi / mağaza dizini sorguları.
 *
 * KV manifest render kaynağı kalır; burada D1 kanonik kopya tutulur.
 */

import type { StoreRecord } from './registry';
import type { Manifest } from '../../src/storefront/types';
import { resolveLocalized, uniqueProductSlugs, productUrl, SUPPORTED_LOCALES } from '../../src/storefront/manifest';
import { create, insertMultiple, search, type Orama } from '@orama/orama';
import type { AiBinding } from './translate';

const DEFAULT_LANG = 'en';

// ── Public tipler (P2 buna güvenir) ──────────────────────────────────────────

export interface ProductRow {
  id: string;
  store_slug: string;
  title: string;
  description: string;
  category_id: string;
  tags: string;          // CSV
  price: number | null;
  currency: string;
  stock: number;
  image_url: string;
  product_path: string;
  updated_at: string;
}

export interface StoreRow {
  slug: string;
  name: string;
  city: string;
  country: string;
  iban: string;
  iban_name: string;
  whatsapp: string;
  listed: number;
  lang: string;
  index_version: number | null;
  updated_at: string;
}

export interface Facets {
  categories: Record<string, number>;
  cities: Record<string, number>;
  priceMin: number | null;
  priceMax: number | null;
}

// Orama doc + indeks tipi.
interface OramaDoc {
  id: string;
  title: string;
  description: string;
  tags: string;
}

export interface OramaIndex {
  db: Orama<{ id: 'string'; title: 'string'; description: 'string'; tags: 'string' }>;
  version: number;
}

// ── Manifest → D1 satır eşleme (saf, test edilebilir) ────────────────────────

function canonicalLang(manifest: Manifest): string {
  return manifest.store.languages?.[0] ?? DEFAULT_LANG;
}

export function storeRecordToStoreFields(
  slug: string,
  record: StoreRecord,
  indexVersion: number,
): StoreRow {
  const s = record.manifest.store;
  return {
    slug,
    name: s.displayName ?? '',
    city: s.location?.city ?? '',
    country: s.location?.country ?? '',
    iban: s.payment?.iban ?? '',
    iban_name: s.payment?.ibanName ?? '',
    whatsapp: s.contact?.whatsapp ?? '',
    listed: s.marketplaceListed === true ? 1 : 0,
    lang: canonicalLang(record.manifest),
    index_version: indexVersion,
    updated_at: record.updatedAt ?? new Date().toISOString(),
  };
}

export function storeRecordToProductRows(slug: string, record: StoreRecord): ProductRow[] {
  const manifest = record.manifest;
  const lang = canonicalLang(manifest);
  const slugMap = uniqueProductSlugs(manifest.products, DEFAULT_LANG);
  const updatedAt = record.updatedAt ?? new Date().toISOString();

  return manifest.products.map((p) => {
    const pSlug = slugMap.get(p.id) ?? p.id;
    const stock = typeof p.stockQty === 'number' ? p.stockQty : (p.inStock ? 1 : 0);
    return {
      id: `${slug}:${pSlug}`,
      store_slug: slug,
      title: resolveLocalized(p.title, lang),
      description: resolveLocalized(p.description, lang),
      category_id: p.categoryId ?? '',
      tags: (p.tags ?? []).join(','),
      price: typeof p.price === 'number' ? p.price : null,
      currency: p.currency ?? manifest.store.currency ?? 'USD',
      stock,
      image_url: p.images?.[0] ?? '',
      product_path: productUrl(slug, pSlug, DEFAULT_LANG, DEFAULT_LANG),
      updated_at: updatedAt,
    };
  });
}
```

> NOT: `uniqueProductSlugs`, `productUrl`, `resolveLocalized`, `SUPPORTED_LOCALES` `src/storefront/manifest.ts`'ten gelir (store router'da kullanılan aynı yardımcılar). İmza farklıysa store router'daki çağrıyı referans al ve uyumla.

- [ ] **5.4 — Pass gör.**

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: `5 passed` (storeRecordToStoreFields 2 + storeRecordToProductRows 2 + import OK). Eğer `productUrl`/`uniqueProductSlugs` imzası farklı geldiyse hata mesajını oku, çağrıyı düzelt, tekrar çalıştır.

- [ ] **5.5 — Commit.** `marketplace: tipler + manifest→D1 satır eşleme yardımcıları`

---

## Task 6 — fakeD1 test yardımcısı + meta version fonksiyonları

`bumpIndexVersion` / `getIndexVersion` D1 yazıp okur. Bunları test etmek için D1'in `prepare/bind/first/run` zincirini taklit eden bir bellek-içi sahte gerekir. Sahteyi tek tablo (`meta`) için yeterince akıllı yap, sonraki task'larda genişlet.

- [ ] **6.1 — Failing test yaz.** `functions/_lib/fakeD1.ts` (test yardımcısı — test değil, paylaşılan fixture):

```ts
// functions/_lib/fakeD1.ts — vitest için minimal bellek-içi D1 sahtesi.
// Sadece marketplace.ts'in ürettiği SQL şekillerini destekler (meta upsert/select,
// stores/products replace + filtre select + count). Tam bir SQL motoru DEĞİLDİR.

interface Row { [k: string]: unknown; }

export interface FakeD1 {
  db: {
    prepare(sql: string): {
      bind(...args: unknown[]): {
        first<T = Row>(col?: string): Promise<T | null>;
        all<T = Row>(): Promise<{ results: T[] }>;
        run(): Promise<{ success: boolean }>;
      };
      first<T = Row>(col?: string): Promise<T | null>;
      all<T = Row>(): Promise<{ results: T[] }>;
      run(): Promise<{ success: boolean }>;
    };
    batch(stmts: unknown[]): Promise<unknown[]>;
  };
  tables: { meta: Row[]; stores: Row[]; products: Row[] };
}

export function makeFakeD1(): FakeD1 {
  const tables = {
    meta: [{ key: 'index_version', value: 0 }] as Row[],
    stores: [] as Row[],
    products: [] as Row[],
  };

  function exec(sql: string, args: unknown[]) {
    const s = sql.trim().replace(/\s+/g, ' ');

    // meta: UPDATE ... value = value + 1
    if (/UPDATE meta SET value = value \+ 1/i.test(s)) {
      const m = tables.meta.find((r) => r.key === 'index_version')!;
      m.value = (m.value as number) + 1;
      return { kind: 'run' as const };
    }
    // meta: SELECT value FROM meta WHERE key = 'index_version'
    if (/SELECT value FROM meta WHERE key = \?/i.test(s)) {
      const r = tables.meta.find((x) => x.key === args[0]);
      return { kind: 'first' as const, row: r ? { value: r.value } : null };
    }
    // stores upsert (INSERT OR REPLACE INTO stores ...)
    if (/INSERT OR REPLACE INTO stores/i.test(s)) {
      const [slug, name, city, country, iban, iban_name, whatsapp, listed, lang, index_version, updated_at] = args;
      const i = tables.stores.findIndex((r) => r.slug === slug);
      const row = { slug, name, city, country, iban, iban_name, whatsapp, listed, lang, index_version, updated_at };
      if (i >= 0) tables.stores[i] = row; else tables.stores.push(row);
      return { kind: 'run' as const };
    }
    // products: DELETE FROM products WHERE store_slug = ?
    if (/DELETE FROM products WHERE store_slug = \?/i.test(s)) {
      tables.products = tables.products.filter((r) => r.store_slug !== args[0]);
      return { kind: 'run' as const };
    }
    // stores: DELETE FROM stores WHERE slug = ?
    if (/DELETE FROM stores WHERE slug = \?/i.test(s)) {
      tables.stores = tables.stores.filter((r) => r.slug !== args[0]);
      return { kind: 'run' as const };
    }
    // products insert
    if (/INSERT OR REPLACE INTO products/i.test(s)) {
      const [id, store_slug, title, description, category_id, tags, price, currency, stock, image_url, product_path, updated_at] = args;
      tables.products.push({ id, store_slug, title, description, category_id, tags, price, currency, stock, image_url, product_path, updated_at });
      return { kind: 'run' as const };
    }
    // products select all (filtreler marketplace.ts JS tarafında uygulanır — sahte tüm satırları döner)
    if (/SELECT .* FROM products/i.test(s)) {
      return { kind: 'all' as const, rows: [...tables.products] };
    }
    // stores select all
    if (/SELECT .* FROM stores/i.test(s)) {
      return { kind: 'all' as const, rows: tables.stores.filter((r) => (r.listed as number) === 1) };
    }
    throw new Error('fakeD1: tanınmayan SQL: ' + s);
  }

  function stmt(sql: string, args: unknown[]) {
    return {
      first: async <T,>(_col?: string) => { const r = exec(sql, args); return (r.kind === 'first' ? r.row : null) as T | null; },
      all: async <T,>() => { const r = exec(sql, args); return { results: (r.kind === 'all' ? r.rows : []) as T[] }; },
      run: async () => { exec(sql, args); return { success: true }; },
    };
  }

  const db = {
    prepare(sql: string) {
      return {
        bind: (...args: unknown[]) => stmt(sql, args),
        first: async <T,>(c?: string) => stmt(sql, []).first<T>(c),
        all: async <T,>() => stmt(sql, []).all<T>(),
        run: async () => stmt(sql, []).run(),
      };
    },
    async batch(stmts: unknown[]) { return stmts.map(() => ({ success: true })); },
  };

  return { db, tables };
}
```

> NOT: Bu sahte, `marketplace.ts`'in **filtreleme/facet'i SQL'de değil JS'te yaptığı** varsayımına dayanır (Task 8/9 bunu zorlar). `searchProducts`/`listNewProducts` D1'den tüm satırları çekip JS'te filtreler — bu hem testi basitleştirir hem Orama+D1 birleşimini tek yerde tutar (indeks küçük, spec bunu kabul ediyor).

`functions/_lib/marketplace.test.ts` sonuna ekle:

```ts
import { makeFakeD1 } from './fakeD1';
import { bumpIndexVersion, getIndexVersion } from './marketplace';

describe('index version sayacı', () => {
  it('getIndexVersion başlangıçta 0', async () => {
    const { db } = makeFakeD1();
    expect(await getIndexVersion(db as any)).toBe(0);
  });
  it('bumpIndexVersion artırır ve yeni değeri döner', async () => {
    const { db } = makeFakeD1();
    expect(await bumpIndexVersion(db as any)).toBe(1);
    expect(await bumpIndexVersion(db as any)).toBe(2);
    expect(await getIndexVersion(db as any)).toBe(2);
  });
});
```

- [ ] **6.2 — Fail gör.**

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: `bumpIndexVersion`/`getIndexVersion` export edilmediği için import hatası — fail.

- [ ] **6.3 — Implementasyon.** `functions/_lib/marketplace.ts` sonuna ekle:

```ts
// ── index_version sayacı (meta tablosu) ───────────────────────────────────────

export async function getIndexVersion(db: D1Database): Promise<number> {
  const row = await db
    .prepare("SELECT value FROM meta WHERE key = ?")
    .bind('index_version')
    .first<{ value: number }>();
  return row?.value ?? 0;
}

export async function bumpIndexVersion(db: D1Database): Promise<number> {
  await db.prepare("UPDATE meta SET value = value + 1 WHERE key = ?").bind('index_version').run();
  return getIndexVersion(db);
}
```

- [ ] **6.4 — Pass gör.**

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: tüm describe blokları passed (eşleme 4 + version 2 = en az 6 test passed).

- [ ] **6.5 — Commit.** `marketplace: getIndexVersion + bumpIndexVersion + fakeD1 fixture`

---

## Task 7 — upsertStoreToD1 + removeStoreFromD1

Write-through'un D1 yazma motoru. Mevcut ürünleri silip yeniden yazar (replace). Store satırını upsert eder.

- [ ] **7.1 — Failing test yaz.** `marketplace.test.ts` sonuna:

```ts
import { upsertStoreToD1, removeStoreFromD1 } from './marketplace';

describe('upsertStoreToD1', () => {
  it('store + ürünleri D1\'e yazar; listed=1, ürün id\'leri slug ön ekli', async () => {
    const { db, tables } = makeFakeD1();
    const rec = makeRecord({}, [
      { id: 'p1', categoryId: 'electronics.phones', title: { tr: 'Telefon' }, price: 100, currency: 'USD', inStock: true, images: ['a.jpg'] },
    ]);
    await upsertStoreToD1(db as any, 'acme', rec);
    expect(tables.stores).toHaveLength(1);
    expect(tables.stores[0].slug).toBe('acme');
    expect(tables.stores[0].listed).toBe(1);
    expect(tables.products).toHaveLength(1);
    expect(tables.products[0].store_slug).toBe('acme');
    expect(String(tables.products[0].id)).toContain('acme:');
  });

  it('replace: ikinci upsert eski ürünleri siler, yenileri yazar', async () => {
    const { db, tables } = makeFakeD1();
    await upsertStoreToD1(db as any, 'acme', makeRecord({}, [
      { id: 'p1', title: { tr: 'Eski' }, images: [] },
      { id: 'p2', title: { tr: 'Eski2' }, images: [] },
    ]));
    expect(tables.products).toHaveLength(2);
    await upsertStoreToD1(db as any, 'acme', makeRecord({}, [
      { id: 'p3', title: { tr: 'Yeni' }, images: [] },
    ]));
    expect(tables.products).toHaveLength(1);
    expect(tables.products[0].title).toBe('Yeni');
  });
});

describe('removeStoreFromD1', () => {
  it('mağazayı ve tüm ürünlerini D1\'den siler', async () => {
    const { db, tables } = makeFakeD1();
    await upsertStoreToD1(db as any, 'acme', makeRecord({}, [
      { id: 'p1', title: { tr: 'X' }, images: [] },
    ]));
    expect(tables.stores).toHaveLength(1);
    await removeStoreFromD1(db as any, 'acme');
    expect(tables.stores).toHaveLength(0);
    expect(tables.products).toHaveLength(0);
  });
});
```

- [ ] **7.2 — Fail gör.**

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: `upsertStoreToD1`/`removeStoreFromD1` export yok — import hatası, fail.

- [ ] **7.3 — Implementasyon.** `functions/_lib/marketplace.ts` sonuna ekle:

```ts
// ── Write-through D1 yazma ─────────────────────────────────────────────────────

export async function upsertStoreToD1(db: D1Database, slug: string, record: StoreRecord): Promise<void> {
  const version = await getIndexVersion(db);
  const sf = storeRecordToStoreFields(slug, record, version);
  const rows = storeRecordToProductRows(slug, record);

  // 1) Store satırını upsert.
  await db.prepare(
    `INSERT OR REPLACE INTO stores
       (slug, name, city, country, iban, iban_name, whatsapp, listed, lang, index_version, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    sf.slug, sf.name, sf.city, sf.country, sf.iban, sf.iban_name,
    sf.whatsapp, sf.listed, sf.lang, sf.index_version, sf.updated_at,
  ).run();

  // 2) Bu mağazanın eski ürünlerini sil (replace semantiği).
  await db.prepare(`DELETE FROM products WHERE store_slug = ?`).bind(slug).run();

  // 3) Yeni ürünleri yaz.
  for (const r of rows) {
    await db.prepare(
      `INSERT OR REPLACE INTO products
         (id, store_slug, title, description, category_id, tags, price, currency, stock, image_url, product_path, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      r.id, r.store_slug, r.title, r.description, r.category_id, r.tags,
      r.price, r.currency, r.stock, r.image_url, r.product_path, r.updated_at,
    ).run();
  }
}

export async function removeStoreFromD1(db: D1Database, slug: string): Promise<void> {
  await db.prepare(`DELETE FROM products WHERE store_slug = ?`).bind(slug).run();
  await db.prepare(`DELETE FROM stores WHERE slug = ?`).bind(slug).run();
}
```

- [ ] **7.4 — Pass gör.**

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: upsert (2) + remove (1) dahil tüm testler passed.

- [ ] **7.5 — Commit.** `marketplace: upsertStoreToD1 + removeStoreFromD1 (write-through replace)`

---

## Task 8 — listStores + listNewProducts (D1 sorgu, filtre/sıralama JS'te)

- [ ] **8.1 — Failing test yaz.** `marketplace.test.ts` sonuna:

```ts
import { listStores, listNewProducts } from './marketplace';

async function seedTwoStores() {
  const { db, tables } = makeFakeD1();
  await upsertStoreToD1(db as any, 'acme', makeRecord({ displayName: 'ACME' }, [
    { id: 'p1', categoryId: 'electronics.phones', title: { tr: 'Telefon' }, price: 100, inStock: true, images: ['a.jpg'] },
    { id: 'p2', categoryId: 'home.kitchen', title: { tr: 'Tava' }, price: 50, inStock: true, images: ['b.jpg'] },
  ]));
  await upsertStoreToD1(db as any, 'beta', makeRecord({ slug: 'beta', displayName: 'BETA', marketplaceListed: false }, [
    { id: 'p3', categoryId: 'electronics.phones', title: { tr: 'Telefon2' }, price: 200, inStock: false, images: ['c.jpg'] },
  ]));
  return { db, tables };
}

describe('listStores', () => {
  it('sadece listed=1 mağazaları döner', async () => {
    const { db } = await seedTwoStores();
    const res = await listStores(db as any, {});
    expect(res.total).toBe(1);
    expect(res.items[0].slug).toBe('acme');
  });
});

describe('listNewProducts', () => {
  it('tüm ürünleri döner (limit yok)', async () => {
    const { db } = await seedTwoStores();
    const res = await listNewProducts(db as any, {});
    expect(res.total).toBe(3);
  });
  it('categoryId filtreler', async () => {
    const { db } = await seedTwoStores();
    const res = await listNewProducts(db as any, { categoryId: 'electronics.phones' });
    expect(res.total).toBe(2);
  });
  it('limit + offset uygular', async () => {
    const { db } = await seedTwoStores();
    const res = await listNewProducts(db as any, { limit: 1, offset: 1 });
    expect(res.items).toHaveLength(1);
    expect(res.total).toBe(3); // total filtre sonrası ama sayfalama öncesi
  });
});
```

- [ ] **8.2 — Fail gör.**

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: `listStores`/`listNewProducts` export yok — fail.

- [ ] **8.3 — Implementasyon.** `functions/_lib/marketplace.ts` sonuna ekle:

```ts
// ── Listeleme sorguları (D1'den çek, JS'te filtre/sırala/sayfala) ─────────────

async function fetchAllProducts(db: D1Database): Promise<ProductRow[]> {
  const { results } = await db.prepare(
    `SELECT id, store_slug, title, description, category_id, tags, price, currency, stock, image_url, product_path, updated_at
     FROM products`
  ).all<ProductRow>();
  return results ?? [];
}

async function fetchListedStores(db: D1Database): Promise<StoreRow[]> {
  const { results } = await db.prepare(
    `SELECT slug, name, city, country, iban, iban_name, whatsapp, listed, lang, index_version, updated_at
     FROM stores WHERE listed = 1`
  ).all<StoreRow>();
  return results ?? [];
}

function paginate<T>(items: T[], limit?: number, offset?: number): T[] {
  const start = offset ?? 0;
  const end = limit != null ? start + limit : undefined;
  return items.slice(start, end);
}

export async function listStores(
  db: D1Database,
  opts: { limit?: number; offset?: number },
): Promise<{ items: StoreRow[]; total: number }> {
  const all = await fetchListedStores(db);
  all.sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''));
  return { items: paginate(all, opts.limit, opts.offset), total: all.length };
}

export async function listNewProducts(
  db: D1Database,
  opts: { limit?: number; offset?: number; categoryId?: string },
): Promise<{ items: ProductRow[]; total: number }> {
  let all = await fetchAllProducts(db);
  if (opts.categoryId) all = all.filter((p) => p.category_id === opts.categoryId);
  all.sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''));
  return { items: paginate(all, opts.limit, opts.offset), total: all.length };
}
```

- [ ] **8.4 — Pass gör.**

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: listStores (1) + listNewProducts (3) dahil hepsi passed.

- [ ] **8.5 — Commit.** `marketplace: listStores + listNewProducts (yeni-bazlı sıralama, sayfalama)`

---

## Task 9 — Orama indeks (getOrama) + facet + filtre yardımcıları

Orama'yı D1'den tembel kur, modül-seviye global'de cache'le, `index_version` değişince yeniden kur. Facet hesaplama ve filtre uygulama saf fonksiyonlar.

- [ ] **9.1 — Failing test yaz.** `marketplace.test.ts` sonuna:

```ts
import { getOrama, computeFacets, applyFilters } from './marketplace';

describe('computeFacets', () => {
  it('kategori + şehir sayar, fiyat aralığı bulur', () => {
    const rows: any[] = [
      { category_id: 'a', city: 'Istanbul', price: 100 },
      { category_id: 'a', city: 'Izmir', price: 50 },
      { category_id: 'b', city: 'Istanbul', price: 200 },
    ];
    const f = computeFacets(rows);
    expect(f.categories['a']).toBe(2);
    expect(f.categories['b']).toBe(1);
    expect(f.cities['Istanbul']).toBe(2);
    expect(f.priceMin).toBe(50);
    expect(f.priceMax).toBe(200);
  });
});

describe('applyFilters', () => {
  const rows: any[] = [
    { id: '1', category_id: 'a', city: 'Istanbul', price: 100, stock: 5 },
    { id: '2', category_id: 'b', city: 'Izmir', price: 50, stock: 0 },
    { id: '3', category_id: 'a', city: 'Istanbul', price: 300, stock: 2 },
  ];
  it('categoryId filtreler', () => {
    expect(applyFilters(rows, { categoryId: 'a' }).map((r) => r.id)).toEqual(['1', '3']);
  });
  it('fiyat aralığı', () => {
    expect(applyFilters(rows, { minPrice: 60, maxPrice: 200 }).map((r) => r.id)).toEqual(['1']);
  });
  it('inStock', () => {
    expect(applyFilters(rows, { inStock: true }).map((r) => r.id)).toEqual(['1', '3']);
  });
  it('city', () => {
    expect(applyFilters(rows, { city: 'Izmir' }).map((r) => r.id)).toEqual(['2']);
  });
});

describe('getOrama', () => {
  it('D1\'den indeks kurar; index_version değişince yeniden kurar', async () => {
    const { db } = await seedTwoStores();
    const idx1 = await getOrama(db as any);
    expect(idx1.version).toBe(await getIndexVersion(db as any));
    // version artmadıkça aynı instance dönmeli (cache)
    const idx2 = await getOrama(db as any);
    expect(idx2).toBe(idx1);
  });
});
```

> NOT: `getOrama` modül-seviye global cache kullanır. Test izolasyonu için `seedTwoStores` her seferinde YENİ fakeD1 üretir; ancak global cache tek olduğundan testte cache davranışı (`idx2 === idx1`) aynı db için doğrulanır. Eğer global cache testler arası sızıntı yaratırsa, `marketplace.ts` cache'i `db` referansına göre değil yalnız `version`'a göre tutar — test sırası bağımsız olsun diye `getOrama` her çağrıda `getIndexVersion`'ı okur ve eşleşmezse yeniden kurar.

- [ ] **9.2 — Fail gör.**

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: `getOrama`/`computeFacets`/`applyFilters` export yok — fail.

- [ ] **9.3 — Implementasyon.** `functions/_lib/marketplace.ts` sonuna ekle:

```ts
// ── Facet + filtre (saf) ──────────────────────────────────────────────────────

export interface SearchOpts {
  q?: string;
  lang?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  inStock?: boolean;
  sort?: 'new' | 'price_asc' | 'price_desc';
  limit?: number;
  offset?: number;
}

// Filtre/facet için store şehri lazım — products satırına city eklenmemiş olduğundan
// arama yolu products'ı stores ile JS'te birleştirir (aşağıda joinedRows).
interface JoinedRow extends ProductRow {
  city: string;
}

export function applyFilters(rows: JoinedRow[], opts: SearchOpts): JoinedRow[] {
  return rows.filter((r) => {
    if (opts.categoryId && r.category_id !== opts.categoryId) return false;
    if (opts.minPrice != null && (r.price == null || r.price < opts.minPrice)) return false;
    if (opts.maxPrice != null && (r.price == null || r.price > opts.maxPrice)) return false;
    if (opts.city && r.city !== opts.city) return false;
    if (opts.inStock === true && r.stock <= 0) return false;
    return true;
  });
}

export function computeFacets(rows: JoinedRow[]): Facets {
  const categories: Record<string, number> = {};
  const cities: Record<string, number> = {};
  let priceMin: number | null = null;
  let priceMax: number | null = null;
  for (const r of rows) {
    if (r.category_id) categories[r.category_id] = (categories[r.category_id] ?? 0) + 1;
    if (r.city) cities[r.city] = (cities[r.city] ?? 0) + 1;
    if (typeof r.price === 'number') {
      priceMin = priceMin == null ? r.price : Math.min(priceMin, r.price);
      priceMax = priceMax == null ? r.price : Math.max(priceMax, r.price);
    }
  }
  return { categories, cities, priceMin, priceMax };
}

// ── Orama indeks (tembel, modül-global cache, version damgası) ────────────────

let _oramaCache: OramaIndex | null = null;

async function buildOrama(db: D1Database, version: number): Promise<OramaIndex> {
  const products = await fetchAllProducts(db);
  const oramaDb = create({
    schema: { id: 'string', title: 'string', description: 'string', tags: 'string' },
  }) as OramaIndex['db'];
  const docs: OramaDoc[] = products.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    tags: p.tags.replace(/,/g, ' '),
  }));
  if (docs.length > 0) await insertMultiple(oramaDb, docs);
  return { db: oramaDb, version };
}

export async function getOrama(db: D1Database): Promise<OramaIndex> {
  const version = await getIndexVersion(db);
  if (_oramaCache && _oramaCache.version === version) return _oramaCache;
  _oramaCache = await buildOrama(db, version);
  return _oramaCache;
}
```

> NOT: `create` Orama sürümüne göre Promise dönebilir. Task 4.3 smoke testinde gördüğün API şekline göre `create(...)` veya `await create(...)` kullan; gerekirse `buildOrama`'yı `await create(...)` yap.

- [ ] **9.4 — Pass gör.**

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: computeFacets (1) + applyFilters (4) + getOrama (1) passed.

- [ ] **9.5 — Commit.** `marketplace: Orama tembel indeks + facet + filtre yardımcıları`

---

## Task 10 — searchProducts (Orama full-text + D1 filtre + sorgu çevirisi)

Tam arama: `q` varsa Orama'dan eşleşen id'ler, sonra D1 satırlarıyla join + filtre + facet + sırala + sayfala. `q` kanonik dilden farklı dildeyse Workers AI ile çevir.

- [ ] **10.1 — Failing test yaz.** `marketplace.test.ts` sonuna:

```ts
import { searchProducts } from './marketplace';

// translate.test.ts'teki fakeAI deseni.
function fakeAI(map: Record<string, string> = {}) {
  let calls = 0;
  const ai = {
    run: async (_m: string, inputs: any) => {
      calls++;
      const user = (inputs.messages ?? []).find((x: any) => x.role === 'user')?.content ?? '';
      return { response: map[user] ?? user };
    },
  };
  return { ai, get calls() { return calls; } };
}

describe('searchProducts', () => {
  it('q olmadan tüm ürünleri filtre + facet ile döner', async () => {
    const { db } = await seedTwoStores();
    const { ai } = fakeAI();
    const res = await searchProducts(db as any, ai as any, {});
    expect(res.total).toBe(3);
    expect(res.facets.categories['electronics.phones']).toBe(2);
    expect(res.facets.cities['Istanbul']).toBeGreaterThan(0);
  });

  it('q full-text Orama ile filtreler', async () => {
    const { db } = await seedTwoStores();
    const { ai } = fakeAI();
    const res = await searchProducts(db as any, ai as any, { q: 'Tava' });
    expect(res.total).toBe(1);
    expect(res.items[0].title).toBe('Tava');
  });

  it('categoryId + minPrice filtreler', async () => {
    const { db } = await seedTwoStores();
    const { ai } = fakeAI();
    const res = await searchProducts(db as any, ai as any, { categoryId: 'electronics.phones', minPrice: 150 });
    expect(res.total).toBe(1);
    expect(res.items[0].price).toBe(200);
  });

  it('sort price_asc fiyata göre sıralar', async () => {
    const { db } = await seedTwoStores();
    const { ai } = fakeAI();
    const res = await searchProducts(db as any, ai as any, { sort: 'price_asc' });
    const prices = res.items.map((r) => r.price);
    expect(prices).toEqual([...prices].sort((a, b) => (a! - b!)));
  });

  it('q farklı dildeyse AI ile kanonik dile çevirir', async () => {
    const { db } = await seedTwoStores();
    // Kanonik dil tr (makeRecord languages[0]='tr'). İngilizce sorgu "Pan" → "Tava".
    const { ai, calls } = fakeAI({ Pan: 'Tava' });
    const res = await searchProducts(db as any, ai as any, { q: 'Pan', lang: 'en' });
    expect(res.items.some((r) => r.title === 'Tava')).toBe(true);
  });

  it('q kanonik dildeyse AI çağrılmaz', async () => {
    const { db } = await seedTwoStores();
    const f = fakeAI();
    await searchProducts(db as any, f.ai as any, { q: 'Tava', lang: 'tr' });
    expect(f.calls).toBe(0);
  });
});
```

- [ ] **10.2 — Fail gör.**

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: `searchProducts` export yok — fail.

- [ ] **10.3 — Implementasyon.** `functions/_lib/marketplace.ts` sonuna ekle:

```ts
// ── Sorgu çevirisi (kanonik dile) ──────────────────────────────────────────────

const LANG_NAMES: Record<string, string> = {
  en: 'English', tr: 'Turkish', de: 'German', es: 'Spanish', pt: 'Portuguese',
  ja: 'Japanese', ko: 'Korean', zh: 'Chinese (Simplified)', ar: 'Arabic',
  fa: 'Persian', ur: 'Urdu', hi: 'Hindi',
};

// Kanonik dili D1 store satırlarından çıkar (çoğunluk / ilk listed store dili).
async function inferCanonicalLang(db: D1Database): Promise<string> {
  const stores = await fetchListedStores(db);
  return stores[0]?.lang ?? DEFAULT_LANG;
}

async function translateQuery(ai: AiBinding, q: string, fromLang: string, toLang: string): Promise<string> {
  if (fromLang === toLang) return q;
  const src = LANG_NAMES[fromLang] ?? fromLang;
  const tgt = LANG_NAMES[toLang] ?? toLang;
  const system = `You are a search query translator. Translate the user's product search query from ${src} to ${tgt}. Output ONLY the translated query — no quotes, no notes.`;
  try {
    const res = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: q },
      ],
      max_tokens: 64,
      temperature: 0.1,
    });
    const out = (res.response ?? res.translated_text ?? '').trim();
    return out || q;
  } catch {
    return q; // graceful: çeviri başarısızsa orijinal sorgu
  }
}

// ── searchProducts ─────────────────────────────────────────────────────────────

async function joinedRows(db: D1Database): Promise<JoinedRow[]> {
  const products = await fetchAllProducts(db);
  const stores = await fetchListedStores(db);
  const cityBySlug = new Map(stores.map((s) => [s.slug, s.city]));
  const listedSlugs = new Set(stores.map((s) => s.slug));
  // Sadece listed mağazaların ürünleri pazar yerinde görünür.
  return products
    .filter((p) => listedSlugs.has(p.store_slug))
    .map((p) => ({ ...p, city: cityBySlug.get(p.store_slug) ?? '' }));
}

function sortRows(rows: JoinedRow[], sort?: SearchOpts['sort']): JoinedRow[] {
  const r = [...rows];
  if (sort === 'price_asc') r.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  else if (sort === 'price_desc') r.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
  else r.sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? '')); // new
  return r;
}

export async function searchProducts(
  db: D1Database,
  ai: AiBinding,
  opts: SearchOpts,
): Promise<{ items: ProductRow[]; facets: Facets; total: number }> {
  let rows = await joinedRows(db);

  // 1) Full-text (Orama) — q varsa eşleşen id'lere indir.
  if (opts.q && opts.q.trim() !== '') {
    const canonical = await inferCanonicalLang(db);
    const queryLang = opts.lang ?? canonical;
    const term = await translateQuery(ai, opts.q.trim(), queryLang, canonical);
    const orama = await getOrama(db);
    const res = await search(orama.db, { term, limit: 1000 });
    const ids = new Set(res.hits.map((h) => String(h.document.id)));
    rows = rows.filter((r) => ids.has(r.id));
  }

  // 2) Yapısal filtreler.
  rows = applyFilters(rows, opts);

  // 3) Facet'ler filtrelenmiş küme üzerinden.
  const facets = computeFacets(rows);

  // 4) Sırala + sayfala.
  const sorted = sortRows(rows, opts.sort);
  const total = sorted.length;
  const items = paginate(sorted, opts.limit, opts.offset).map(({ city, ...rest }) => rest as ProductRow);

  return { items, facets, total };
}
```

- [ ] **10.4 — Pass gör.**

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: searchProducts 6 test passed. Orama global cache testler arası sızarsa: her `seedTwoStores` farklı db ama aynı `index_version` (her ikisi de upsert sonrası aynı sayıda bump → version eşleşip yanlış cache dönebilir). Bunu önlemek için **Task 10.5**'e bak.

- [ ] **10.5 — Orama cache test izolasyonu.** Global cache testler arası karışmasın diye `marketplace.test.ts`'in en üstüne ekle:

```ts
import { beforeEach } from 'vitest';
import { __resetOramaCache } from './marketplace';

beforeEach(() => __resetOramaCache());
```

ve `marketplace.ts`'e test-only reset ekle (getOrama bölümünün altına):

```ts
/** Test-only: modül-global Orama cache'ini sıfırlar. Production'da çağrılmaz. */
export function __resetOramaCache(): void {
  _oramaCache = null;
}
```

Tekrar çalıştır:

```bash
npx vitest run functions/_lib/marketplace.test.ts
```

Beklenen çıktı: tüm searchProducts testleri stabil passed.

- [ ] **10.6 — Commit.** `marketplace: searchProducts (Orama full-text + filtre + facet + sorgu çevirisi)`

---

## Task 11 — PUT/DELETE write-through entegrasyonu

`functions/api/store/[slug].ts`'i D1 write-through ile genişlet. KV her zaman önce yazılır (mevcut davranış korunur); D1 yazımı best-effort — başarısız olursa KV/render bozulmamalı (graceful).

- [ ] **11.1 — Failing test yaz.** `functions/api/store/slug-writethrough.test.ts` (köşeli parantezli dosya adı import'ta sorun çıkarır; handler'ları doğrudan import etmek yerine D1 yan etkisini birim olarak test ederiz — handler'ı yeniden export edilebilir bir yardımcıya çıkar).

Önce handler'daki write-through mantığını test edilebilir bir fonksiyona ayır. Test:

```ts
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
```

- [ ] **11.2 — Fail gör.**

```bash
npx vitest run functions/api/store/slug-writethrough.test.ts
```

Beklenen çıktı: `syncStoreToMarketplace` export yok — fail.

- [ ] **11.3 — Implementasyon (marketplace.ts'e orkestratör ekle).** `functions/_lib/marketplace.ts` sonuna:

```ts
// ── Write-through orkestratör (PUT/DELETE handler'larından çağrılır) ──────────

/**
 * Mağaza yayınlandığında çağrılır. marketplaceListed true ise D1'e upsert eder,
 * false (opt-out) ise D1'den düşürür. Her iki durumda index_version'ı artırır
 * (Orama'nın yeniden kurulmasını tetikler). best-effort: hata fırlatabilir,
 * çağıran graceful yakalar.
 */
export async function syncStoreToMarketplace(
  db: D1Database,
  slug: string,
  record: StoreRecord,
): Promise<void> {
  const listed = record.manifest.store.marketplaceListed === true;
  if (listed) {
    await upsertStoreToD1(db, slug, record);
  } else {
    await removeStoreFromD1(db, slug);
  }
  await bumpIndexVersion(db);
}
```

- [ ] **11.4 — Pass gör.**

```bash
npx vitest run functions/api/store/slug-writethrough.test.ts
```

Beklenen çıktı: 2 passed.

- [ ] **11.5 — Handler'a bağla.** `functions/api/store/[slug].ts`'i düzenle. `Env`'e D1 ekle, PUT sonunda + DELETE sonunda best-effort D1 sync çağır:

`Env` interface:

```ts
interface Env {
  STORE_KV: KVNamespace;
  STORE_WRITE_KEY?: string;
  MARKET_DB?: D1Database;
}
```

import satırına ekle:

```ts
import { syncStoreToMarketplace, removeStoreFromD1, bumpIndexVersion } from '../../_lib/marketplace';
```

`onRequestPut` içinde, `putStore(...)` çağrısından SONRA, `return new Response(...)` 'dan ÖNCE:

```ts
  // Write-through D1 (best-effort): pazar yeri indeksini güncelle. KV/render asla bozulmaz.
  if (ctx.env.MARKET_DB) {
    try {
      await syncStoreToMarketplace(ctx.env.MARKET_DB, slug, {
        manifest,
        phone: manifest.store.contact?.phone,
        status: 'active',
        version,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('marketplace D1 sync failed (non-fatal):', e);
    }
  }
```

`onRequestDelete` içinde, `deleteStore(...)` çağrısından SONRA:

```ts
  // Pazar yerinden de düşür (best-effort).
  if (ctx.env.MARKET_DB) {
    try {
      await removeStoreFromD1(ctx.env.MARKET_DB, slug);
      await bumpIndexVersion(ctx.env.MARKET_DB);
    } catch (e) {
      console.error('marketplace D1 delete failed (non-fatal):', e);
    }
  }
```

- [ ] **11.6 — Tüm suite yeşil + tip kontrolü.**

```bash
npx vitest run
npx astro check
```

Beklenen çıktı: vitest tümü passed; `astro check` 0 error (yeni TS hataları yok). `astro check` uzun sürerse atla ama vitest zorunlu.

- [ ] **11.7 — Commit.** `api/store: D1 write-through + opt-out senkronizasyonu (best-effort)`

---

## Task 12 — Local D1 entegrasyon smoke testi (wrangler)

Birim testler fakeD1 kullanıyor; gerçek D1 SQL'inin şemayla uyumunu `wrangler d1 execute --local` ile elle doğrula.

- [ ] **12.1 — Migration yeniden uygulanabilir mi (idempotent)?**

```bash
npx wrangler d1 execute MARKET_DB --local --file=migrations/0001_marketplace.sql
```

Beklenen çıktı: hata yok (`CREATE TABLE IF NOT EXISTS` + `INSERT OR IGNORE` → tekrar çalışır).

- [ ] **12.2 — Elle bir store + ürün insert + sorgu.**

```bash
npx wrangler d1 execute MARKET_DB --local --command="INSERT OR REPLACE INTO stores(slug,name,city,country,iban,iban_name,whatsapp,listed,lang,index_version,updated_at) VALUES('acme','ACME','Istanbul','TR','TR01','Ad','+9055',1,'tr',0,'2026-05-31T00:00:00Z'); INSERT OR REPLACE INTO products(id,store_slug,title,description,category_id,tags,price,currency,stock,image_url,product_path,updated_at) VALUES('acme:telefon','acme','Telefon','aciklama','electronics.phones','yeni',199.9,'USD',5,'a.jpg','/store/acme/product/telefon','2026-05-31T00:00:00Z');"
```

Beklenen çıktı: 2 statement çalıştı, hata yok.

```bash
npx wrangler d1 execute MARKET_DB --local --command="SELECT s.name, p.title, p.category_id FROM stores s JOIN products p ON p.store_slug=s.slug WHERE s.listed=1;"
```

Beklenen çıktı: `ACME | Telefon | electronics.phones`.

- [ ] **12.3 — index_version bump doğrula.**

```bash
npx wrangler d1 execute MARKET_DB --local --command="UPDATE meta SET value=value+1 WHERE key='index_version'; SELECT value FROM meta WHERE key='index_version';"
```

Beklenen çıktı: `1`.

- [ ] **12.4 — Temizlik (local state isteğe bağlı sıfırlama).** Bu adımda kalıcı değişiklik yok; smoke testi geçtiyse devam. (İstersen `.wrangler/state/v3/d1` altındaki local db'yi silip 2.2'yi tekrar koşarak temiz başlangıç doğrulanabilir.)

- [ ] **12.5 — Commit (varsa).** Bu task kod değiştirmezse commit yok; sadece doğrulama. Doğrulama notunu commit mesajına gerek yok.

---

## Tamamlanma kriteri (verification-before-completion)

- [ ] `npx vitest run` → tüm dosyalar passed, 0 failed (mevcut + yeni marketplace testleri).
- [ ] `functions/_lib/marketplace.ts` paylaşılan sözleşmedeki TÜM sembolleri export ediyor (`upsertStoreToD1`, `removeStoreFromD1`, `bumpIndexVersion`, `getIndexVersion`, `getOrama`, `searchProducts`, `listNewProducts`, `listStores`, `ProductRow`, `StoreRow`, `Facets`, `OramaIndex`).
- [ ] `migrations/0001_marketplace.sql` şema spec'le birebir (stores/products+2 index/meta seed).
- [ ] `wrangler.toml` `MARKET_DB` D1 binding içeriyor.
- [ ] `src/storefront/types.ts` `StoreInfo.marketplaceListed?` + `payment?.{iban,ibanName}` içeriyor (geriye uyumlu).
- [ ] `functions/api/store/[slug].ts` PUT + DELETE D1 write-through (best-effort, KV render bozulmaz).
- [ ] `package.json` `dependencies` altında `@orama/orama`.
- [ ] Local D1 smoke testi (Task 12) hata vermeden geçti.

## P2'ye not (devir)

P2 keşif UI'ı `functions/_lib/marketplace.ts`'ten `searchProducts`, `listNewProducts`, `listStores`, `getOrama` çağırır; route'lara `ctx.env.MARKET_DB` (D1) + `ctx.env.AI` (Workers AI) geçer. `ProductRow`/`StoreRow`/`Facets` tipleri render kontratıdır. `product_path` zaten `/store/<slug>/product/<pslug>` formatında — kartlardan mevcut storefront'a doğrudan link. Kanonik dil store satırının `lang` alanındadır; kart metinleri ziyaretçi diline mevcut storefront çeviri cache'iyle çevrilir (P2 işi).
