# Buyer Backend P1 — Anonim Favori + Sepet Kalıcılığı (Web)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Storefront ziyaretçisinin favori (kalp) ve sepet verisini, giriş olmadan anonim cihaz kimliğine bağlı olarak Cloudflare D1'de kalıcı tutmak; mevcut localStorage sepetini backend ile senkronlamak.

**Architecture:** Mevcut `MARKET_DB` (Cloudflare D1) reposuna iki tablo (`favorites`, `cart_items`) eklenir. Saf veri-erişim katmanı `functions/_lib/buyer.ts` yazılır ve genişletilmiş `fakeD1` ile vitest altında test edilir. Pages Functions altında `/api/store/<slug>/favorites` ve `/api/store/<slug>/cart` uçları açılır; sahip kimliği `x-device-id` header'ından gelen anonim cihaz UUID'sidir (`owner_key = "d:<uuid>"`). `owner_key` şeması ileride giriş gelince `b:<buyerId>`'yi de taşıyacak şekilde tasarlanır. Client tarafında storefront sayfasına kalp butonu + cihaz kimliği üretimi + sepet backend senkronu eklenir.

**Tech Stack:** Cloudflare Pages Functions, D1 (SQLite), TypeScript, vitest, vanilla JS (storefront client), wrangler.

**Kapsam dışı (sonraki fazlar):** Sipariş niyeti kaydı + satıcı okuma API + per-store read_token + iOS ekranı (P2); opsiyonel giriş (e-posta OTP + Google) + cihazlar arası senkron + device→buyer merge + sipariş geçmişi + hesap silme (P3).

---

## Dosya Yapısı

- **Create:** `migrations/0002_buyer.sql` — `favorites` + `cart_items` tabloları + indeksler.
- **Create:** `functions/_lib/buyer.ts` — saf veri-erişim katmanı (owner_key, favori CRUD, sepet CRUD, doğrulama).
- **Create:** `functions/_lib/buyer.test.ts` — buyer.ts birim testleri (genişletilmiş fakeD1 üstünde).
- **Modify:** `functions/_lib/fakeD1.ts` — `favorites` + `cart_items` SQL şekilleri eklenir.
- **Create:** `functions/api/store/[slug]/favorites.ts` — GET/POST/DELETE favori ucu.
- **Create:** `functions/api/store/[slug]/cart.ts` — GET/PUT sepet ucu.
- **Create:** `functions/api/store/[slug]/favorites.test.ts` — favori handler testleri.
- **Create:** `functions/api/store/[slug]/cart.test.ts` — sepet handler testleri.
- **Create:** `public/storefront-buyer.js` — cihaz kimliği + kalp butonu wiring + sepet backend senkronu.
- **Modify:** `src/storefront/render.ts` — ürün kartlarına kalp butonu + `storefront-buyer.js` script etiketi.

---

### Task 1: D1 migration — favorites + cart_items tabloları

**Files:**
- Create: `migrations/0002_buyer.sql`

- [ ] **Step 1: Migration dosyasını yaz**

```sql
-- 0002_buyer.sql — photoZseo Buyer backend P1 (favori + sepet kalıcılığı).
-- Sahip (owner_key) anonim cihaz için "d:<uuid>", ileride giriş gelince "b:<buyerId>".
-- D1 (SQLite). KV manifest render kaynağı kalır; bu tablolar alıcı durumu içindir.

CREATE TABLE IF NOT EXISTS favorites (
  owner_key    TEXT NOT NULL,
  store_slug   TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  PRIMARY KEY (owner_key, store_slug, product_slug)
);

CREATE INDEX IF NOT EXISTS idx_favorites_owner ON favorites(owner_key);
CREATE INDEX IF NOT EXISTS idx_favorites_store ON favorites(store_slug, product_slug);

CREATE TABLE IF NOT EXISTS cart_items (
  owner_key    TEXT NOT NULL,
  store_slug   TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  qty          INTEGER NOT NULL,
  updated_at   TEXT NOT NULL,
  PRIMARY KEY (owner_key, store_slug, product_slug)
);

CREATE INDEX IF NOT EXISTS idx_cart_owner ON cart_items(owner_key, store_slug);
```

- [ ] **Step 2: Local D1'e uygula ve doğrula**

Run: `npx wrangler d1 execute MARKET_DB --local --file=migrations/0002_buyer.sql`
Expected: Çıktıda hata yok; "Executed ... commands" benzeri başarı mesajı.

Run: `npx wrangler d1 execute MARKET_DB --local --command="SELECT name FROM sqlite_master WHERE type='table' AND name IN ('favorites','cart_items');"`
Expected: `favorites` ve `cart_items` satırları listelenir.

- [ ] **Step 3: Commit**

```bash
git add migrations/0002_buyer.sql
git commit -m "feat(buyer): D1 migration for favorites + cart_items tables"
```

---

### Task 2: fakeD1'i favorites + cart_items için genişlet

**Files:**
- Modify: `functions/_lib/fakeD1.ts`

- [ ] **Step 1: tables nesnesine yeni koleksiyonları ekle**

`makeFakeD1` içindeki `const tables = {...}` bloğunu şununla değiştir:

```typescript
  const tables = {
    meta: [{ key: 'index_version', value: 0 }] as Row[],
    stores: [] as Row[],
    products: [] as Row[],
    favorites: [] as Row[],
    cart_items: [] as Row[],
  };
```

- [ ] **Step 2: `exec` fonksiyonuna favorites + cart_items SQL şekillerini ekle**

`exec` fonksiyonunda, `throw new Error('fakeD1: tanınmayan SQL: ' + s);` satırından HEMEN ÖNCE şu blokları ekle:

```typescript
    // favorites: INSERT OR IGNORE
    if (/INSERT OR IGNORE INTO favorites/i.test(s)) {
      const [owner_key, store_slug, product_slug, created_at] = args;
      const exists = tables.favorites.some(
        (r) => r.owner_key === owner_key && r.store_slug === store_slug && r.product_slug === product_slug,
      );
      if (!exists) tables.favorites.push({ owner_key, store_slug, product_slug, created_at });
      return { kind: 'run' as const };
    }
    // favorites: DELETE one
    if (/DELETE FROM favorites WHERE owner_key = \? AND store_slug = \? AND product_slug = \?/i.test(s)) {
      tables.favorites = tables.favorites.filter(
        (r) => !(r.owner_key === args[0] && r.store_slug === args[1] && r.product_slug === args[2]),
      );
      return { kind: 'run' as const };
    }
    // favorites: SELECT product_slug WHERE owner_key + store_slug
    if (/SELECT product_slug FROM favorites WHERE owner_key = \? AND store_slug = \?/i.test(s)) {
      const rows = tables.favorites
        .filter((r) => r.owner_key === args[0] && r.store_slug === args[1])
        .map((r) => ({ product_slug: r.product_slug }));
      return { kind: 'all' as const, rows };
    }
    // cart_items: upsert (INSERT OR REPLACE)
    if (/INSERT OR REPLACE INTO cart_items/i.test(s)) {
      const [owner_key, store_slug, product_slug, qty, updated_at] = args;
      const i = tables.cart_items.findIndex(
        (r) => r.owner_key === owner_key && r.store_slug === store_slug && r.product_slug === product_slug,
      );
      const row = { owner_key, store_slug, product_slug, qty, updated_at };
      if (i >= 0) tables.cart_items[i] = row; else tables.cart_items.push(row);
      return { kind: 'run' as const };
    }
    // cart_items: DELETE one
    if (/DELETE FROM cart_items WHERE owner_key = \? AND store_slug = \? AND product_slug = \?/i.test(s)) {
      tables.cart_items = tables.cart_items.filter(
        (r) => !(r.owner_key === args[0] && r.store_slug === args[1] && r.product_slug === args[2]),
      );
      return { kind: 'run' as const };
    }
    // cart_items: DELETE all for owner+store (clear)
    if (/DELETE FROM cart_items WHERE owner_key = \? AND store_slug = \?$/i.test(s)) {
      tables.cart_items = tables.cart_items.filter(
        (r) => !(r.owner_key === args[0] && r.store_slug === args[1]),
      );
      return { kind: 'run' as const };
    }
    // cart_items: SELECT WHERE owner_key + store_slug
    if (/SELECT product_slug, qty FROM cart_items WHERE owner_key = \? AND store_slug = \?/i.test(s)) {
      const rows = tables.cart_items
        .filter((r) => r.owner_key === args[0] && r.store_slug === args[1])
        .map((r) => ({ product_slug: r.product_slug, qty: r.qty }));
      return { kind: 'all' as const, rows };
    }
```

- [ ] **Step 3: FakeD1 arayüzünün tables tipini güncelle**

`export interface FakeD1` içindeki `tables: { meta: Row[]; stores: Row[]; products: Row[] };` satırını şununla değiştir:

```typescript
  tables: { meta: Row[]; stores: Row[]; products: Row[]; favorites: Row[]; cart_items: Row[] };
```

- [ ] **Step 4: Mevcut testlerin hâlâ geçtiğini doğrula**

Run: `npm test`
Expected: PASS (mevcut suite kırılmadı; yeni şekiller eklendi).

- [ ] **Step 5: Commit**

```bash
git add functions/_lib/fakeD1.ts
git commit -m "test(buyer): extend fakeD1 with favorites + cart_items SQL shapes"
```

---

### Task 3: buyer.ts veri-erişim katmanı — owner_key + doğrulama

**Files:**
- Create: `functions/_lib/buyer.ts`
- Test: `functions/_lib/buyer.test.ts`

- [ ] **Step 1: Başarısız testi yaz (owner_key + doğrulama)**

`functions/_lib/buyer.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { ownerKeyFromDevice, isValidSlug } from './buyer';

describe('ownerKeyFromDevice', () => {
  it('geçerli UUID için d: önekli anahtar döner', () => {
    expect(ownerKeyFromDevice('1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')).toBe(
      'd:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    );
  });
  it('boş/biçimsiz cihaz kimliği için null döner', () => {
    expect(ownerKeyFromDevice('')).toBeNull();
    expect(ownerKeyFromDevice('not-a-uuid')).toBeNull();
    expect(ownerKeyFromDevice('d:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')).toBeNull();
  });
});

describe('isValidSlug', () => {
  it('makul slug kabul eder', () => {
    expect(isValidSlug('ahmet-oto-yedek')).toBe(true);
    expect(isValidSlug('deri-defter-2')).toBe(true);
  });
  it('boş/aşırı uzun/yasak karakter reddeder', () => {
    expect(isValidSlug('')).toBe(false);
    expect(isValidSlug('a'.repeat(200))).toBe(false);
    expect(isValidSlug('boşluk var')).toBe(false);
    expect(isValidSlug('../etc')).toBe(false);
  });
});
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

Run: `npx vitest run functions/_lib/buyer.test.ts`
Expected: FAIL — "Cannot find module './buyer'" / export bulunamadı.

- [ ] **Step 3: buyer.ts'in ilk halini yaz**

`functions/_lib/buyer.ts`:

```typescript
/**
 * buyer.ts — Alıcı (anonim) durumu için saf veri-erişim katmanı (P1).
 *
 * Sorumluluk: favori + sepet CRUD'u D1 üstünde; owner_key normalleştirme + girdi doğrulama.
 * owner_key: anonimde "d:<uuid>", ileride giriş gelince "b:<buyerId>".
 * Render/manifest katmanından bağımsızdır.
 */

export interface D1Like {
  prepare(sql: string): {
    bind(...args: unknown[]): {
      first<T = unknown>(col?: string): Promise<T | null>;
      all<T = unknown>(): Promise<{ results: T[] }>;
      run(): Promise<{ success: boolean }>;
    };
  };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z0-9-]+$/i;

/** Geçerli cihaz UUID'sinden "d:<uuid>" anahtarı üretir; geçersizse null. */
export function ownerKeyFromDevice(deviceId: string): string | null {
  if (!deviceId || !UUID_RE.test(deviceId)) return null;
  return 'd:' + deviceId.toLowerCase();
}

/** slug/product_slug için makul format kontrolü (path traversal + aşırı uzunluk engeli). */
export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length > 120) return false;
  return SLUG_RE.test(slug);
}
```

- [ ] **Step 4: Testin geçtiğini doğrula**

Run: `npx vitest run functions/_lib/buyer.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add functions/_lib/buyer.ts functions/_lib/buyer.test.ts
git commit -m "feat(buyer): owner_key + slug validation helpers with tests"
```

---

### Task 4: buyer.ts favori CRUD

**Files:**
- Modify: `functions/_lib/buyer.ts`
- Test: `functions/_lib/buyer.test.ts`

- [ ] **Step 1: Başarısız favori testlerini ekle**

`functions/_lib/buyer.test.ts` dosyasının sonuna ekle (üstteki import satırına `listFavorites, addFavorite, removeFavorite` ekle):

```typescript
import { listFavorites, addFavorite, removeFavorite } from './buyer';
import { makeFakeD1 } from './fakeD1';

describe('favorites CRUD', () => {
  it('ekler, listeler, idempotent ekler, siler', async () => {
    const { db } = makeFakeD1();
    const owner = 'd:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';

    expect(await listFavorites(db, owner, 'ahmet-oto-yedek')).toEqual([]);

    await addFavorite(db, owner, 'ahmet-oto-yedek', 'fren-balatasi', '2026-06-02T00:00:00Z');
    await addFavorite(db, owner, 'ahmet-oto-yedek', 'fren-balatasi', '2026-06-02T00:00:01Z'); // idempotent
    await addFavorite(db, owner, 'ahmet-oto-yedek', 'yag-filtresi', '2026-06-02T00:00:02Z');

    const favs = await listFavorites(db, owner, 'ahmet-oto-yedek');
    expect(favs.sort()).toEqual(['fren-balatasi', 'yag-filtresi']);

    await removeFavorite(db, owner, 'ahmet-oto-yedek', 'fren-balatasi');
    expect(await listFavorites(db, owner, 'ahmet-oto-yedek')).toEqual(['yag-filtresi']);
  });

  it('favoriler mağazaya göre izole', async () => {
    const { db } = makeFakeD1();
    const owner = 'd:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';
    await addFavorite(db, owner, 'magaza-a', 'urun-1', '2026-06-02T00:00:00Z');
    expect(await listFavorites(db, owner, 'magaza-b')).toEqual([]);
  });
});
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

Run: `npx vitest run functions/_lib/buyer.test.ts`
Expected: FAIL — `listFavorites` export edilmiyor.

- [ ] **Step 3: Favori CRUD fonksiyonlarını buyer.ts'e ekle**

`functions/_lib/buyer.ts` sonuna ekle:

```typescript
/** Sahibin bir mağazadaki favori ürün slug'larını döner. */
export async function listFavorites(db: D1Like, ownerKey: string, storeSlug: string): Promise<string[]> {
  const { results } = await db
    .prepare('SELECT product_slug FROM favorites WHERE owner_key = ? AND store_slug = ?')
    .bind(ownerKey, storeSlug)
    .all<{ product_slug: string }>();
  return results.map((r) => r.product_slug);
}

/** Favori ekler (idempotent — varsa yok sayar). */
export async function addFavorite(
  db: D1Like, ownerKey: string, storeSlug: string, productSlug: string, now: string,
): Promise<void> {
  await db
    .prepare('INSERT OR IGNORE INTO favorites (owner_key, store_slug, product_slug, created_at) VALUES (?, ?, ?, ?)')
    .bind(ownerKey, storeSlug, productSlug, now)
    .run();
}

/** Favori siler. */
export async function removeFavorite(
  db: D1Like, ownerKey: string, storeSlug: string, productSlug: string,
): Promise<void> {
  await db
    .prepare('DELETE FROM favorites WHERE owner_key = ? AND store_slug = ? AND product_slug = ?')
    .bind(ownerKey, storeSlug, productSlug)
    .run();
}
```

- [ ] **Step 4: Testin geçtiğini doğrula**

Run: `npx vitest run functions/_lib/buyer.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add functions/_lib/buyer.ts functions/_lib/buyer.test.ts
git commit -m "feat(buyer): favorites CRUD over D1 with tests"
```

---

### Task 5: buyer.ts sepet CRUD

**Files:**
- Modify: `functions/_lib/buyer.ts`
- Test: `functions/_lib/buyer.test.ts`

- [ ] **Step 1: Başarısız sepet testlerini ekle**

`functions/_lib/buyer.test.ts` sonuna ekle (import satırına `getCart, setCartItem, clearCart` ekle):

```typescript
import { getCart, setCartItem, clearCart } from './buyer';

describe('cart CRUD', () => {
  it('ekler, adet günceller, qty<=0 siler, listeler, temizler', async () => {
    const { db } = makeFakeD1();
    const owner = 'd:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';

    expect(await getCart(db, owner, 'magaza-a')).toEqual([]);

    await setCartItem(db, owner, 'magaza-a', 'urun-1', 2, '2026-06-02T00:00:00Z');
    await setCartItem(db, owner, 'magaza-a', 'urun-2', 1, '2026-06-02T00:00:01Z');
    await setCartItem(db, owner, 'magaza-a', 'urun-1', 5, '2026-06-02T00:00:02Z'); // güncelle

    const cart = await getCart(db, owner, 'magaza-a');
    expect(cart.sort((a, b) => a.productSlug.localeCompare(b.productSlug))).toEqual([
      { productSlug: 'urun-1', qty: 5 },
      { productSlug: 'urun-2', qty: 1 },
    ]);

    await setCartItem(db, owner, 'magaza-a', 'urun-2', 0, '2026-06-02T00:00:03Z'); // qty 0 → sil
    expect(await getCart(db, owner, 'magaza-a')).toEqual([{ productSlug: 'urun-1', qty: 5 }]);

    await clearCart(db, owner, 'magaza-a');
    expect(await getCart(db, owner, 'magaza-a')).toEqual([]);
  });
});
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

Run: `npx vitest run functions/_lib/buyer.test.ts`
Expected: FAIL — `getCart` export edilmiyor.

- [ ] **Step 3: Sepet CRUD fonksiyonlarını buyer.ts'e ekle**

`functions/_lib/buyer.ts` sonuna ekle:

```typescript
export interface CartItem {
  productSlug: string;
  qty: number;
}

/** Sahibin bir mağazadaki sepet kalemlerini döner. */
export async function getCart(db: D1Like, ownerKey: string, storeSlug: string): Promise<CartItem[]> {
  const { results } = await db
    .prepare('SELECT product_slug, qty FROM cart_items WHERE owner_key = ? AND store_slug = ?')
    .bind(ownerKey, storeSlug)
    .all<{ product_slug: string; qty: number }>();
  return results.map((r) => ({ productSlug: r.product_slug, qty: r.qty }));
}

/** Sepet kalemini ayarlar; qty<=0 ise kalemi siler, aksi halde upsert eder. */
export async function setCartItem(
  db: D1Like, ownerKey: string, storeSlug: string, productSlug: string, qty: number, now: string,
): Promise<void> {
  if (qty <= 0) {
    await db
      .prepare('DELETE FROM cart_items WHERE owner_key = ? AND store_slug = ? AND product_slug = ?')
      .bind(ownerKey, storeSlug, productSlug)
      .run();
    return;
  }
  await db
    .prepare('INSERT OR REPLACE INTO cart_items (owner_key, store_slug, product_slug, qty, updated_at) VALUES (?, ?, ?, ?, ?)')
    .bind(ownerKey, storeSlug, productSlug, qty, now)
    .run();
}

/** Sahibin bir mağazadaki tüm sepetini temizler. */
export async function clearCart(db: D1Like, ownerKey: string, storeSlug: string): Promise<void> {
  await db
    .prepare('DELETE FROM cart_items WHERE owner_key = ? AND store_slug = ?')
    .bind(ownerKey, storeSlug)
    .run();
}
```

- [ ] **Step 4: Testin geçtiğini doğrula**

Run: `npx vitest run functions/_lib/buyer.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add functions/_lib/buyer.ts functions/_lib/buyer.test.ts
git commit -m "feat(buyer): cart CRUD over D1 with tests"
```

---

### Task 6: Favori API ucu (GET/POST/DELETE)

**Files:**
- Create: `functions/api/store/[slug]/favorites.ts`
- Test: `functions/api/store/[slug]/favorites.test.ts`

- [ ] **Step 1: Başarısız handler testini yaz**

`functions/api/store/[slug]/favorites.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { onRequestGet, onRequestPost, onRequestDelete } from './favorites';
import { makeFakeD1 } from '../../../_lib/fakeD1';

const DEVICE = '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';

function ctx(db: unknown, slug: string, method: string, body?: unknown, deviceId?: string) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (deviceId !== undefined) headers['x-device-id'] = deviceId;
  return {
    request: new Request('https://photozseo.com/api/store/' + slug + '/favorites', {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }),
    env: { MARKET_DB: db },
    params: { slug },
  } as any;
}

describe('favorites API', () => {
  it('cihaz kimliği yoksa 400', async () => {
    const { db } = makeFakeD1();
    const res = await onRequestGet(ctx(db, 'magaza-a', 'GET'));
    expect(res.status).toBe(400);
  });

  it('POST favori ekler, GET listeler, DELETE siler', async () => {
    const { db } = makeFakeD1();
    const slug = 'magaza-a';

    const post = await onRequestPost(ctx(db, slug, 'POST', { productSlug: 'urun-1' }, DEVICE));
    expect(post.status).toBe(200);

    const get = await onRequestGet(ctx(db, slug, 'GET', undefined, DEVICE));
    expect(get.status).toBe(200);
    expect(await get.json()).toEqual({ favorites: ['urun-1'] });

    const del = await onRequestDelete(ctx(db, slug, 'DELETE', { productSlug: 'urun-1' }, DEVICE));
    expect(del.status).toBe(200);

    const get2 = await onRequestGet(ctx(db, slug, 'GET', undefined, DEVICE));
    expect(await get2.json()).toEqual({ favorites: [] });
  });

  it('geçersiz productSlug 400', async () => {
    const { db } = makeFakeD1();
    const res = await onRequestPost(ctx(db, 'magaza-a', 'POST', { productSlug: '../x' }, DEVICE));
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

Run: `npx vitest run functions/api/store/[slug]/favorites.test.ts`
Expected: FAIL — "Cannot find module './favorites'".

- [ ] **Step 3: Handler'ı yaz**

`functions/api/store/[slug]/favorites.ts`:

```typescript
/**
 * /api/store/<slug>/favorites — anonim alıcı favori ucu (P1).
 * Sahip kimliği x-device-id header'ından gelen cihaz UUID'sidir (owner_key = "d:<uuid>").
 * Public uç (write-key yok); sahip yalnız kendi cihaz anahtarını okur/yazar.
 */
import {
  ownerKeyFromDevice, isValidSlug, listFavorites, addFavorite, removeFavorite, type D1Like,
} from '../../../_lib/buyer';

interface Env { MARKET_DB: D1Like; }
type Ctx = { request: Request; env: Env; params: { slug: string } };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

function resolveOwner(request: Request): string | null {
  return ownerKeyFromDevice(request.headers.get('x-device-id') ?? '');
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const owner = resolveOwner(ctx.request);
  if (!owner) return json({ error: 'device id required' }, 400);
  if (!isValidSlug(ctx.params.slug)) return json({ error: 'bad slug' }, 400);
  const favorites = await listFavorites(ctx.env.MARKET_DB, owner, ctx.params.slug);
  return json({ favorites });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const owner = resolveOwner(ctx.request);
  if (!owner) return json({ error: 'device id required' }, 400);
  if (!isValidSlug(ctx.params.slug)) return json({ error: 'bad slug' }, 400);
  const body = (await ctx.request.json().catch(() => null)) as { productSlug?: string } | null;
  if (!body || !body.productSlug || !isValidSlug(body.productSlug)) {
    return json({ error: 'bad productSlug' }, 400);
  }
  await addFavorite(ctx.env.MARKET_DB, owner, ctx.params.slug, body.productSlug, new Date().toISOString());
  return json({ ok: true });
}

export async function onRequestDelete(ctx: Ctx): Promise<Response> {
  const owner = resolveOwner(ctx.request);
  if (!owner) return json({ error: 'device id required' }, 400);
  if (!isValidSlug(ctx.params.slug)) return json({ error: 'bad slug' }, 400);
  const body = (await ctx.request.json().catch(() => null)) as { productSlug?: string } | null;
  if (!body || !body.productSlug || !isValidSlug(body.productSlug)) {
    return json({ error: 'bad productSlug' }, 400);
  }
  await removeFavorite(ctx.env.MARKET_DB, owner, ctx.params.slug, body.productSlug);
  return json({ ok: true });
}
```

- [ ] **Step 4: Testin geçtiğini doğrula**

Run: `npx vitest run functions/api/store/[slug]/favorites.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add "functions/api/store/[slug]/favorites.ts" "functions/api/store/[slug]/favorites.test.ts"
git commit -m "feat(buyer): favorites API endpoint (GET/POST/DELETE)"
```

---

### Task 7: Sepet API ucu (GET/PUT)

**Files:**
- Create: `functions/api/store/[slug]/cart.ts`
- Test: `functions/api/store/[slug]/cart.test.ts`

- [ ] **Step 1: Başarısız handler testini yaz**

`functions/api/store/[slug]/cart.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { onRequestGet, onRequestPut } from './cart';
import { makeFakeD1 } from '../../../_lib/fakeD1';

const DEVICE = '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';

function ctx(db: unknown, slug: string, method: string, body?: unknown, deviceId?: string) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (deviceId !== undefined) headers['x-device-id'] = deviceId;
  return {
    request: new Request('https://photozseo.com/api/store/' + slug + '/cart', {
      method, headers, body: body ? JSON.stringify(body) : undefined,
    }),
    env: { MARKET_DB: db },
    params: { slug },
  } as any;
}

describe('cart API', () => {
  it('cihaz kimliği yoksa 400', async () => {
    const { db } = makeFakeD1();
    expect((await onRequestGet(ctx(db, 'magaza-a', 'GET'))).status).toBe(400);
  });

  it('PUT kalem ekler/günceller, GET listeler, qty 0 siler', async () => {
    const { db } = makeFakeD1();
    const slug = 'magaza-a';

    let res = await onRequestPut(ctx(db, slug, 'PUT', { productSlug: 'urun-1', qty: 2 }, DEVICE));
    expect(res.status).toBe(200);
    res = await onRequestPut(ctx(db, slug, 'PUT', { productSlug: 'urun-2', qty: 1 }, DEVICE));
    expect(res.status).toBe(200);

    const get = await onRequestGet(ctx(db, slug, 'GET', undefined, DEVICE));
    const data = (await get.json()) as { items: Array<{ productSlug: string; qty: number }> };
    expect(data.items.sort((a, b) => a.productSlug.localeCompare(b.productSlug))).toEqual([
      { productSlug: 'urun-1', qty: 2 },
      { productSlug: 'urun-2', qty: 1 },
    ]);

    await onRequestPut(ctx(db, slug, 'PUT', { productSlug: 'urun-1', qty: 0 }, DEVICE));
    const get2 = await onRequestGet(ctx(db, slug, 'GET', undefined, DEVICE));
    expect((await get2.json() as any).items).toEqual([{ productSlug: 'urun-2', qty: 1 }]);
  });

  it('geçersiz qty (sayı değil) 400', async () => {
    const { db } = makeFakeD1();
    const res = await onRequestPut(ctx(db, 'magaza-a', 'PUT', { productSlug: 'urun-1', qty: 'x' }, DEVICE));
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

Run: `npx vitest run functions/api/store/[slug]/cart.test.ts`
Expected: FAIL — "Cannot find module './cart'".

- [ ] **Step 3: Handler'ı yaz**

`functions/api/store/[slug]/cart.ts`:

```typescript
/**
 * /api/store/<slug>/cart — anonim alıcı sepet ucu (P1).
 * Sahip kimliği x-device-id header'ından (owner_key = "d:<uuid>"). Public uç.
 * GET: sepet kalemleri. PUT: tek kalem set (qty<=0 siler).
 */
import {
  ownerKeyFromDevice, isValidSlug, getCart, setCartItem, type D1Like,
} from '../../../_lib/buyer';

interface Env { MARKET_DB: D1Like; }
type Ctx = { request: Request; env: Env; params: { slug: string } };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

function resolveOwner(request: Request): string | null {
  return ownerKeyFromDevice(request.headers.get('x-device-id') ?? '');
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const owner = resolveOwner(ctx.request);
  if (!owner) return json({ error: 'device id required' }, 400);
  if (!isValidSlug(ctx.params.slug)) return json({ error: 'bad slug' }, 400);
  const items = await getCart(ctx.env.MARKET_DB, owner, ctx.params.slug);
  return json({ items });
}

export async function onRequestPut(ctx: Ctx): Promise<Response> {
  const owner = resolveOwner(ctx.request);
  if (!owner) return json({ error: 'device id required' }, 400);
  if (!isValidSlug(ctx.params.slug)) return json({ error: 'bad slug' }, 400);
  const body = (await ctx.request.json().catch(() => null)) as { productSlug?: string; qty?: unknown } | null;
  if (!body || !body.productSlug || !isValidSlug(body.productSlug)) {
    return json({ error: 'bad productSlug' }, 400);
  }
  if (typeof body.qty !== 'number' || !Number.isFinite(body.qty)) {
    return json({ error: 'bad qty' }, 400);
  }
  const qty = Math.min(Math.floor(body.qty), 9999); // üst sınır taşma/abuse engeli
  await setCartItem(ctx.env.MARKET_DB, owner, ctx.params.slug, body.productSlug, qty, new Date().toISOString());
  return json({ ok: true });
}
```

- [ ] **Step 4: Testin geçtiğini doğrula**

Run: `npx vitest run functions/api/store/[slug]/cart.test.ts`
Expected: PASS

- [ ] **Step 5: Tüm suite + astro check**

Run: `npm test && npm run build`
Expected: Tüm testler PASS, build hatasız.

- [ ] **Step 6: Commit**

```bash
git add "functions/api/store/[slug]/cart.ts" "functions/api/store/[slug]/cart.test.ts"
git commit -m "feat(buyer): cart API endpoint (GET/PUT)"
```

---

### Task 8: Client — cihaz kimliği + kalp butonu + sepet backend senkronu

**Files:**
- Create: `public/storefront-buyer.js`
- Modify: `src/storefront/render.ts`

> **Not:** Vanilla JS olduğu için bu task'ta TDD yerine `window.__sfBuyer` test kancası + manuel/Playwright doğrulama kullanılır. Saf mantık (cihaz kimliği üretimi) küçük bir vitest ile kapatılır.

- [ ] **Step 1: storefront-buyer.js yaz**

`public/storefront-buyer.js`:

```javascript
/* storefront-buyer.js — anonim cihaz kimliği + favori (kalp) + sepet backend senkronu.
 * /store/<slug> sayfalarında yüklenir. Cihaz UUID'si localStorage'da, x-device-id header'ıyla yollanır.
 * Backend yoksa/hata verirse sessizce localStorage'a düşer (offline-tolerant). */
(function () {
  'use strict';

  function deviceId() {
    var k = 'sf-device-id';
    var v = null;
    try { v = localStorage.getItem(k); } catch (e) {}
    if (!v) {
      v = (self.crypto && self.crypto.randomUUID)
        ? self.crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, val = c === 'x' ? r : (r & 0x3) | 0x8;
            return val.toString(16);
          });
      try { localStorage.setItem(k, v); } catch (e) {}
    }
    return v;
  }

  function slug() {
    var m = location.pathname.match(/\/store\/([a-z0-9-]+)/i);
    return m ? m[1] : null;
  }

  function api(path, method, body) {
    return fetch(path, {
      method: method,
      headers: { 'content-type': 'application/json', 'x-device-id': deviceId() },
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); });
  }

  var s = slug();

  function addFavorite(productSlug) { return api('/api/store/' + s + '/favorites', 'POST', { productSlug: productSlug }); }
  function removeFavorite(productSlug) { return api('/api/store/' + s + '/favorites', 'DELETE', { productSlug: productSlug }); }
  function listFavorites() { return api('/api/store/' + s + '/favorites', 'GET'); }
  function setCartItem(productSlug, qty) { return api('/api/store/' + s + '/cart', 'PUT', { productSlug: productSlug, qty: qty }); }
  function getCart() { return api('/api/store/' + s + '/cart', 'GET'); }

  // Kalp butonlarını wire et + mevcut favori durumunu boya.
  function wireFavorites() {
    var buttons = document.querySelectorAll('[data-sf-fav]');
    if (!buttons.length || !s) return;
    listFavorites().then(function (res) {
      var set = {};
      (res.favorites || []).forEach(function (p) { set[p] = true; });
      buttons.forEach(function (btn) {
        var p = btn.getAttribute('data-sf-fav');
        if (set[p]) btn.classList.add('is-fav');
        btn.addEventListener('click', function (ev) {
          ev.preventDefault();
          var active = btn.classList.toggle('is-fav');
          (active ? addFavorite(p) : removeFavorite(p)).catch(function () { btn.classList.toggle('is-fav'); });
        });
      });
    }).catch(function () {/* offline: butonlar yine toggle eder ama backend'e yazmaz */});
  }

  window.__sfBuyer = {
    deviceId: deviceId, slug: slug,
    addFavorite: addFavorite, removeFavorite: removeFavorite, listFavorites: listFavorites,
    setCartItem: setCartItem, getCart: getCart,
  };

  if (document.readyState !== 'loading') wireFavorites();
  else document.addEventListener('DOMContentLoaded', wireFavorites);
})();
```

- [ ] **Step 2: render.ts'te ürün kartına kalp butonu + script ekle**

`src/storefront/render.ts` içinde ürün kartı HTML'ini üreten yeri bul (ürün başlığı/fiyatının render edildiği fonksiyon). Karta, ürünün slug'ı ile bir kalp butonu ekle. Aşağıdaki kalıbı kartın içine yerleştir (ürün slug değişkeni mevcut kodda ne ise onu kullan — ör. `p.slug` / `productSlug`):

```typescript
`<button class="sf-fav" data-sf-fav="${escapeHtml(productSlug)}" aria-label="Favorilere ekle" title="Favorilere ekle">♥</button>`
```

`document.ts`/`render.ts`'te storefront sayfasının `<body>` sonuna script etiketini ekle (mevcut `marketplace-cart.js` script etiketinin yanına):

```html
<script src="/storefront-buyer.js" defer></script>
```

- [ ] **Step 3: storefront.css'e kalp stilini ekle**

`public/storefront.css` sonuna ekle:

```css
.sf-fav { background: none; border: 0; cursor: pointer; font-size: 1.25rem; color: #c9ccd6; line-height: 1; padding: .25rem; transition: color .15s, transform .15s; }
.sf-fav:hover { transform: scale(1.15); }
.sf-fav.is-fav { color: #e0245e; }
```

- [ ] **Step 4: Build + suite**

Run: `npm run build && npm test`
Expected: Build hatasız, testler PASS. (Eğer render.ts'in mevcut snapshot/unit testi varsa kalp butonu eklenince güncelle.)

- [ ] **Step 5: Commit**

```bash
git add public/storefront-buyer.js public/storefront.css src/storefront/render.ts
git commit -m "feat(buyer): storefront device id + favorite heart button + cart sync client"
```

---

### Task 9: Production deploy + canlı doğrulama

**Files:** (yok — deploy + doğrulama)

- [ ] **Step 1: Production D1'e migration uygula**

Run: `npx wrangler d1 execute MARKET_DB --remote --file=migrations/0002_buyer.sql`
Expected: Başarı; hata yok.

Run: `npx wrangler d1 execute MARKET_DB --remote --command="SELECT name FROM sqlite_master WHERE type='table' AND name IN ('favorites','cart_items');"`
Expected: İki tablo listelenir.

- [ ] **Step 2: Deploy**

Run: `npm run build && npx wrangler pages deploy dist --project-name photozseo --branch main`
Expected: Deploy OK.

- [ ] **Step 3: Canlı API doğrulama (photozseo.com — *.pages.dev bu ortamdan erişilemez)**

Run (cihaz kimliği yok → 400):
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://photozseo.com/api/store/emrah-cavusdag/favorites
```
Expected: `400`

Run (POST favori + GET):
```bash
DID="1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"
curl -s -X POST https://photozseo.com/api/store/emrah-cavusdag/favorites \
  -H "x-device-id: $DID" -H "content-type: application/json" -d '{"productSlug":"test-urun"}'
curl -s https://photozseo.com/api/store/emrah-cavusdag/favorites -H "x-device-id: $DID"
```
Expected: POST `{"ok":true}`, GET `{"favorites":["test-urun"]}`

Run (temizlik — test favorisini sil):
```bash
curl -s -X DELETE https://photozseo.com/api/store/emrah-cavusdag/favorites \
  -H "x-device-id: $DID" -H "content-type: application/json" -d '{"productSlug":"test-urun"}'
```
Expected: `{"ok":true}`

- [ ] **Step 4: Manuel UI doğrulama**

photozseo.com/store/<canlı-slug> aç → bir ürünün kalbine bas → sayfayı yenile → kalp dolu kalmalı (backend'den yüklendi). Farklı bir gizli pencerede (farklı cihaz kimliği) kalp boş olmalı (izolasyon).

- [ ] **Step 5: Plan tamamlandı — final commit (gerekiyorsa)**

P1 tamam. Sonraki: P2 (sipariş + satıcı okuma API + per-store read_token + iOS) için ayrı plan.

---

## Self-Review Notları

- **Spec kapsamı (P1 dilimi):** favori kalıcılığı (Task 4,6,8), sepet kalıcılığı (Task 5,7,8), anonim cihaz kimliği (Task 3,8), D1 depolama (Task 1). owner_key şeması ileride `b:` taşımaya hazır (Task 3). Giriş/sipariş/satıcı-okuma bilinçli olarak P2/P3'e bırakıldı.
- **Placeholder taraması:** yok — her adımda tam kod/komut var.
- **Tip tutarlılığı:** `D1Like` (buyer.ts) ↔ fakeD1 `db` şekli uyumlu; `CartItem.productSlug/qty` adları handler + test + lib boyunca aynı; SQL string'leri fakeD1 regex'leriyle birebir (örn. `SELECT product_slug, qty FROM cart_items WHERE owner_key = ? AND store_slug = ?`).
- **Güvenlik notu (P1 sınırı):** favori/sepet uçları public + cihaz-anahtarlı; PII içermez. Asıl per-store auth sertleştirmesi P2'de sipariş (telefon içerir) ile gelir — bkz tasarım madde 3.
