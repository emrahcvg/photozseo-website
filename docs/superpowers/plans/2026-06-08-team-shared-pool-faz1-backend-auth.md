# photoZseo Takım / Ortak Havuz — Faz 1: Backend + Auth + Davet — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bir iş yerindeki çalışanların ortak bir "şirket" altında toplanabilmesi için Cloudflare backend temelini kur — şirket oluşturma, davet kodu üretme/kullanma, üyelik + rol kaydı ve rol→yetenek (capability) katmanı.

**Architecture:** Mevcut `photozseo-website` Pages Functions + D1 (`MARKET_DB`) altyapısına eklenir. Yeni D1 tabloları (`companies`, `memberships`, `invites`), saf veri-erişim katmanı `functions/_lib/team.ts`, ve `functions/api/team/*` endpoint'leri. Kimlik mevcut imzalı Google oturum cookie'si (`pz_session`, `_lib/session.ts`) üstünden gelir — yeni auth yok. Roller sabit (`owner`/`admin`/`employee`) ama enforcement bir `can(role, capability)` fonksiyonu arkasında durur, böylece v1.x'te granüler rol eklemek enforcement noktalarını bozmaz.

**Tech Stack:** Cloudflare Pages Functions (TypeScript), D1 (SQLite), Web Crypto (HMAC session), vitest + `makeFakeD1()` bellek-içi sahte. Bu fazda iOS istemci YOK (Faz 4), fotoğraf/R2 senkronu YOK (Faz 2).

**Kapsam dışı (bu faz değil):** iOS UI, R2 fotoğraf depolama, proje senkron motoru, "Hazır" işaretleme, granüler/custom roller, kişi-başı faturalandırma, stok yönetimi.

---

## File Structure

| Dosya | Sorumluluk | Yeni/Değişen |
|---|---|---|
| `migrations/0004_team.sql` | `companies`, `memberships`, `invites` tablo şeması | Yeni |
| `functions/_lib/team.ts` | Saf veri-erişim + rol/capability mantığı (D1Like üstünde) | Yeni |
| `functions/_lib/team.test.ts` | `team.ts` birim testleri (`makeFakeD1`) | Yeni |
| `functions/_lib/team-session.ts` | Endpoint'ler için ortak oturum→üye çözümleme yardımcısı | Yeni |
| `functions/_lib/fakeD1.ts` | Sahte D1'e yeni tabloların SQL şekilleri eklenir | Değişen |
| `functions/api/team/create.ts` | POST — şirket oluştur + owner üyeliği | Yeni |
| `functions/api/team/me.ts` | GET — oturumun üyelikleri (şirket + rol) | Yeni |
| `functions/api/team/invite.ts` | POST — davet kodu üret (owner/admin) | Yeni |
| `functions/api/team/join.ts` | POST — davet kodunu kullan, üye ol | Yeni |
| `functions/api/team/create.test.ts` | create endpoint testi | Yeni |
| `functions/api/team/join.test.ts` | join endpoint testi (süre/tek-kullanım/zaten-üye) | Yeni |

Her dosya tek bir sorumluluk taşır: şema (SQL), saf mantık (`team.ts`), oturum köprüsü (`team-session.ts`), HTTP kabuğu (endpoint'ler). Endpoint'ler iş mantığını `team.ts`'e devreder — test edilebilirlik ve DRY için.

---

## Konvansiyonlar (mevcut koddan)

- **Zaman/ID enjeksiyonu:** Saf lib fonksiyonları `now: string` (ISO) ve üretilmiş `id`/`code` değerlerini **parametre olarak** alır (bkz. `addFavorite(..., now)`, `verifySession(..., nowSec)`). `Date.now()`/`crypto.randomUUID()` yalnızca endpoint katmanında çağrılır.
- **D1Like:** `functions/_lib/buyer.ts` içindeki `D1Like` arabirimi yeniden kullanılır (yeniden tanımlama yok — import et).
- **Oturum:** `pz_session` cookie'si, secret = `env.STORE_WRITE_KEY`, `verifySession(token, secret, nowSec)`.
- **JSON yanıt:** Her endpoint kendi `json(obj, status)` yardımcısını tanımlar (mevcut dosyalardaki kalıp).
- **Test:** vitest, `.test.ts` co-located, `makeFakeD1()` sahtesi.
- **Komutlar:** `npm test` (tüm suite), `npx vitest run <dosya>` (tek dosya).

---

## Rol → Yetenek Matrisi (referans)

| Capability anahtarı | owner | admin | employee |
|---|:--:|:--:|:--:|
| `editAllProjects` | ✅ | ✅ | ❌ |
| `export` | ✅ | ✅ | ❌ |
| `publish` | ✅ | ✅ | ❌ |
| `viewPricing` | ✅ | ✅ | ❌ |
| `companySettings` | ✅ | ✅ | ❌ |
| `manageMembers` | ✅ | ✅ | ❌ |
| `billing` | ✅ | ❌ | ❌ |
| `deleteCompany` | ✅ | ❌ | ❌ |

(Çek/proje/AI/"Hazır" her üyede serbest — capability gerektirmez, bu yüzden matriste yok.)

---

## Task 1: D1 şema migration'ı

**Files:**
- Create: `migrations/0004_team.sql`

- [ ] **Step 1: Migration dosyasını yaz**

```sql
-- 0004_team.sql — photoZseo Takım/Ortak Havuz Faz 1 (şirket + üyelik + davet).
-- Kimlik Google sub üstünden gelir (pz_session). Bu tablolar yalnızca takım/rol
-- durumunu tutar; proje/foto senkronu Faz 2'dir.

CREATE TABLE IF NOT EXISTS companies (
  id          TEXT NOT NULL PRIMARY KEY,   -- "c:" + uuid
  name        TEXT NOT NULL,
  owner_sub   TEXT NOT NULL,               -- kurucu/owner Google sub
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_companies_owner ON companies(owner_sub);

CREATE TABLE IF NOT EXISTS memberships (
  company_id  TEXT NOT NULL,
  user_sub    TEXT NOT NULL,               -- üye Google sub
  email       TEXT NOT NULL,
  name        TEXT,
  role        TEXT NOT NULL,               -- 'owner' | 'admin' | 'employee'
  joined_at   TEXT NOT NULL,
  PRIMARY KEY (company_id, user_sub)
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_sub);

CREATE TABLE IF NOT EXISTS invites (
  code        TEXT NOT NULL PRIMARY KEY,   -- 8 karakter, karışık olmayan alfabe
  company_id  TEXT NOT NULL,
  role        TEXT NOT NULL,               -- kullanımda verilecek rol: 'admin' | 'employee'
  created_by  TEXT NOT NULL,               -- davet eden sub
  created_at  TEXT NOT NULL,
  expires_at  TEXT NOT NULL,
  redeemed_by TEXT,                        -- kullanan sub; NULL ise kullanılmamış
  redeemed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_invites_company ON invites(company_id);
```

- [ ] **Step 2: Yerel D1'e uygulayıp şemayı doğrula**

Run: `npx wrangler d1 execute MARKET_DB --local --command "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('companies','memberships','invites');"`

Beklenen: 3 satır — `companies`, `memberships`, `invites`. (Migration ilk kez uygulanıyorsa wrangler `migrations_dir` üzerinden `0004_team.sql`'i otomatik çalıştırır; çalıştırmazsa: `npx wrangler d1 migrations apply MARKET_DB --local`.)

- [ ] **Step 3: Commit**

```bash
git add migrations/0004_team.sql
git commit -m "feat(team): add companies/memberships/invites D1 schema"
```

---

## Task 2: Saf mantık — roller + `can()` capability

**Files:**
- Create: `functions/_lib/team.ts`
- Create: `functions/_lib/team.test.ts`

- [ ] **Step 1: Başarısız testi yaz**

`functions/_lib/team.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { ROLES, type Role, can } from './team';

describe('roller', () => {
  it('üç sabit rol tanımlı', () => {
    expect(ROLES).toEqual(['owner', 'admin', 'employee']);
  });
});

describe('can(role, capability)', () => {
  it('owner her şeyi yapabilir', () => {
    for (const cap of ['editAllProjects','export','publish','viewPricing','companySettings','manageMembers','billing','deleteCompany'] as const) {
      expect(can('owner', cap)).toBe(true);
    }
  });

  it('admin billing ve deleteCompany hariç her şeyi yapar', () => {
    expect(can('admin', 'publish')).toBe(true);
    expect(can('admin', 'manageMembers')).toBe(true);
    expect(can('admin', 'companySettings')).toBe(true);
    expect(can('admin', 'billing')).toBe(false);
    expect(can('admin', 'deleteCompany')).toBe(false);
  });

  it('employee operasyonel yeteneklerin hiçbirini yapamaz', () => {
    for (const cap of ['editAllProjects','export','publish','viewPricing','companySettings','manageMembers','billing','deleteCompany'] as const) {
      expect(can('employee', cap)).toBe(false);
    }
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `npx vitest run functions/_lib/team.test.ts`
Beklenen: FAIL — `Cannot find module './team'` veya `can is not a function`.

- [ ] **Step 3: Minimal implementasyonu yaz**

`functions/_lib/team.ts`:

```ts
/**
 * team.ts — Takım/Ortak Havuz Faz 1 saf veri-erişim + rol/capability katmanı.
 * D1Like üstünde çalışır (functions/_lib/buyer.ts'den yeniden kullanılır).
 * Roller sabit; enforcement can() arkasında — v1.x granüler rol için tek nokta.
 */
import type { D1Like } from './buyer';

export const ROLES = ['owner', 'admin', 'employee'] as const;
export type Role = (typeof ROLES)[number];

export type Capability =
  | 'editAllProjects'
  | 'export'
  | 'publish'
  | 'viewPricing'
  | 'companySettings'
  | 'manageMembers'
  | 'billing'
  | 'deleteCompany';

const ADMIN_CAPS: Capability[] = [
  'editAllProjects', 'export', 'publish', 'viewPricing', 'companySettings', 'manageMembers',
];
const OWNER_CAPS: Capability[] = [...ADMIN_CAPS, 'billing', 'deleteCompany'];

const MATRIX: Record<Role, ReadonlySet<Capability>> = {
  owner: new Set(OWNER_CAPS),
  admin: new Set(ADMIN_CAPS),
  employee: new Set<Capability>(),
};

/** Verilen rolün bir yeteneğe sahip olup olmadığını döner. Tek enforcement noktası. */
export function can(role: Role, cap: Capability): boolean {
  return MATRIX[role]?.has(cap) ?? false;
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npx vitest run functions/_lib/team.test.ts`
Beklenen: PASS (3 describe, hepsi yeşil).

- [ ] **Step 5: Commit**

```bash
git add functions/_lib/team.ts functions/_lib/team.test.ts
git commit -m "feat(team): roles + can() capability matrix"
```

---

## Task 3: Davet kodu üreteci + doğrulama

**Files:**
- Modify: `functions/_lib/team.ts`
- Modify: `functions/_lib/team.test.ts`

- [ ] **Step 1: Başarısız testi ekle**

`functions/_lib/team.test.ts` sonuna ekle:

```ts
import { randomInviteCode, isValidInviteCode } from './team';

describe('davet kodu', () => {
  it('randomInviteCode 8 karakter karışık-olmayan alfabe üretir', () => {
    const code = randomInviteCode((n) => new Uint8Array(n).fill(0));
    expect(code).toHaveLength(8);
    expect(/^[A-HJ-NP-Z2-9]{8}$/.test(code)).toBe(true); // I,O,0,1 yok
  });

  it('farklı rastgele baytlar farklı kod üretir', () => {
    const a = randomInviteCode((n) => { const u = new Uint8Array(n); u.forEach((_,i)=>u[i]=i); return u; });
    const b = randomInviteCode((n) => { const u = new Uint8Array(n); u.forEach((_,i)=>u[i]=i+5); return u; });
    expect(a).not.toBe(b);
  });

  it('isValidInviteCode biçim kontrolü', () => {
    expect(isValidInviteCode('ABCD2345')).toBe(true);
    expect(isValidInviteCode('abcd2345')).toBe(true);   // küçük harf normalize edilir
    expect(isValidInviteCode('ABC')).toBe(false);        // kısa
    expect(isValidInviteCode('ABCD23I5')).toBe(false);   // I yasak
    expect(isValidInviteCode('ABCD 234')).toBe(false);   // boşluk
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `npx vitest run functions/_lib/team.test.ts`
Beklenen: FAIL — `randomInviteCode is not a function`.

- [ ] **Step 3: Implementasyonu ekle**

`functions/_lib/team.ts` sonuna ekle:

```ts
// Karışık-olmayan alfabe: I, O, 0, 1 çıkarıldı (okuma hatasını önler).
const INVITE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const INVITE_LEN = 8;
const INVITE_RE = /^[A-HJ-NP-Z2-9]{8}$/;

/** Rastgele bayt sağlayıcı (test edilebilirlik için enjekte edilir). */
export type RandomBytes = (n: number) => Uint8Array;

/** 8 karakterlik davet kodu üretir. rand: endpoint'te crypto.getRandomValues sarmalayıcısı. */
export function randomInviteCode(rand: RandomBytes): string {
  const bytes = rand(INVITE_LEN);
  let out = '';
  for (let i = 0; i < INVITE_LEN; i++) {
    out += INVITE_ALPHABET[bytes[i] % INVITE_ALPHABET.length];
  }
  return out;
}

/** Davet kodu biçim kontrolü (büyük harfe normalize ederek). */
export function isValidInviteCode(code: string): boolean {
  if (!code) return false;
  return INVITE_RE.test(code.toUpperCase());
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npx vitest run functions/_lib/team.test.ts`
Beklenen: PASS.

- [ ] **Step 5: Commit**

```bash
git add functions/_lib/team.ts functions/_lib/team.test.ts
git commit -m "feat(team): invite code generator + format validation"
```

---

## Task 4: Sahte D1'e takım tablolarını ekle

**Files:**
- Modify: `functions/_lib/fakeD1.ts`

`team.ts` veri-erişim fonksiyonlarını test etmek için `makeFakeD1()`'in yeni SQL şekillerini tanıması gerekir. Bu task yalnızca sahteyi genişletir; ardındaki Task 5/6 bu sahteyi kullanır.

- [ ] **Step 1: `tables` nesnesine yeni tabloları ekle**

`functions/_lib/fakeD1.ts` içinde `const tables = {` bloğuna ekle (mevcut `orders: [] as Row[],` satırından sonra):

```ts
    companies: [] as Row[],
    memberships: [] as Row[],
    invites: [] as Row[],
```

Ve `FakeD1` arabirimindeki `tables: { ... }` tip bildirimine ekle:

```ts
  tables: { meta: Row[]; stores: Row[]; products: Row[]; favorites: Row[]; cart_items: Row[]; orders: Row[]; companies: Row[]; memberships: Row[]; invites: Row[] };
```

- [ ] **Step 2: `exec` içine SQL şekil işleyicilerini ekle**

`functions/_lib/fakeD1.ts` içinde `exec` fonksiyonundaki son `throw new Error('fakeD1: tanınmayan SQL: ' + s);` satırından **hemen önce** ekle:

```ts
    // companies: INSERT
    if (/INSERT INTO companies/i.test(s)) {
      const [id, name, owner_sub, created_at] = args;
      tables.companies.push({ id, name, owner_sub, created_at });
      return { kind: 'run' as const };
    }
    // companies: SELECT by id
    if (/SELECT .* FROM companies WHERE id = \?/i.test(s)) {
      const r = tables.companies.find((x) => x.id === args[0]) ?? null;
      return { kind: 'first' as const, row: r };
    }
    // memberships: INSERT
    if (/INSERT INTO memberships/i.test(s)) {
      const [company_id, user_sub, email, name, role, joined_at] = args;
      const i = tables.memberships.findIndex((r) => r.company_id === company_id && r.user_sub === user_sub);
      const row = { company_id, user_sub, email, name, role, joined_at };
      if (i >= 0) tables.memberships[i] = row; else tables.memberships.push(row);
      return { kind: 'run' as const };
    }
    // memberships: SELECT one by company + user
    if (/SELECT .* FROM memberships WHERE company_id = \? AND user_sub = \?/i.test(s)) {
      const r = tables.memberships.find((x) => x.company_id === args[0] && x.user_sub === args[1]) ?? null;
      return { kind: 'first' as const, row: r };
    }
    // memberships: SELECT all by user (me)
    if (/SELECT .* FROM memberships WHERE user_sub = \?/i.test(s)) {
      const rows = tables.memberships.filter((r) => r.user_sub === args[0]);
      return { kind: 'all' as const, rows };
    }
    // invites: INSERT
    if (/INSERT INTO invites/i.test(s)) {
      const [code, company_id, role, created_by, created_at, expires_at] = args;
      tables.invites.push({ code, company_id, role, created_by, created_at, expires_at, redeemed_by: null, redeemed_at: null });
      return { kind: 'run' as const };
    }
    // invites: SELECT by code
    if (/SELECT .* FROM invites WHERE code = \?/i.test(s)) {
      const r = tables.invites.find((x) => x.code === args[0]) ?? null;
      return { kind: 'first' as const, row: r };
    }
    // invites: mark redeemed (single-use guard: yalnızca redeemed_by IS NULL iken)
    if (/UPDATE invites SET redeemed_by = \?, redeemed_at = \? WHERE code = \? AND redeemed_by IS NULL/i.test(s)) {
      const inv = tables.invites.find((x) => x.code === args[2] && x.redeemed_by == null);
      if (inv) { inv.redeemed_by = args[0]; inv.redeemed_at = args[1]; }
      return { kind: 'run' as const };
    }
```

- [ ] **Step 3: Mevcut suite'in hâlâ geçtiğini doğrula (regresyon yok)**

Run: `npm test`
Beklenen: Tüm mevcut testler PASS (yeni şekiller eklendi, eskiler bozulmadı).

- [ ] **Step 4: Commit**

```bash
git add functions/_lib/fakeD1.ts
git commit -m "test(team): extend fakeD1 with companies/memberships/invites"
```

---

## Task 5: `team.ts` — şirket oluştur + üyelik sorgula

**Files:**
- Modify: `functions/_lib/team.ts`
- Modify: `functions/_lib/team.test.ts`

- [ ] **Step 1: Başarısız testi ekle**

`functions/_lib/team.test.ts` sonuna ekle:

```ts
import { makeFakeD1 } from './fakeD1';
import { createCompany, getMembership, listMemberships } from './team';

describe('createCompany + üyelik', () => {
  it('şirket oluşturur ve kurucuyu owner yapar', async () => {
    const { db } = makeFakeD1();
    await createCompany(db, {
      companyId: 'c:co-1', name: 'Ahmet Oto', ownerSub: 'sub-ahmet',
      email: 'ahmet@x.com', ownerName: 'Ahmet', now: '2026-06-08T00:00:00Z',
    });

    const m = await getMembership(db, 'c:co-1', 'sub-ahmet');
    expect(m).toMatchObject({ company_id: 'c:co-1', role: 'owner', email: 'ahmet@x.com' });
  });

  it('listMemberships kullanıcının tüm üyeliklerini döner', async () => {
    const { db } = makeFakeD1();
    await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-1', email: 'a@x.com', ownerName: 'A', now: '2026-06-08T00:00:00Z' });
    await createCompany(db, { companyId: 'c:co-2', name: 'B', ownerSub: 'sub-1', email: 'a@x.com', ownerName: 'A', now: '2026-06-08T00:00:01Z' });

    const list = await listMemberships(db, 'sub-1');
    expect(list.map((m) => m.companyId).sort()).toEqual(['c:co-1', 'c:co-2']);
    expect(list.every((m) => m.role === 'owner')).toBe(true);
  });

  it('üyeliği olmayan kullanıcı için null/boş döner', async () => {
    const { db } = makeFakeD1();
    expect(await getMembership(db, 'c:yok', 'sub-yok')).toBeNull();
    expect(await listMemberships(db, 'sub-yok')).toEqual([]);
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `npx vitest run functions/_lib/team.test.ts`
Beklenen: FAIL — `createCompany is not a function`.

- [ ] **Step 3: Implementasyonu ekle**

`functions/_lib/team.ts` sonuna ekle:

```ts
export interface MembershipRow {
  company_id: string;
  user_sub: string;
  email: string;
  name: string | null;
  role: Role;
  joined_at: string;
}

export interface MembershipView {
  companyId: string;
  role: Role;
  email: string;
  name: string | null;
  joinedAt: string;
}

/** Üyeliği üye olarak ekler/günceller (upsert). Saf veri katmanı. */
export async function upsertMembership(
  db: D1Like,
  m: { companyId: string; userSub: string; email: string; name: string | null; role: Role; now: string },
): Promise<void> {
  await db
    .prepare('INSERT INTO memberships (company_id, user_sub, email, name, role, joined_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(m.companyId, m.userSub, m.email, m.name, m.role, m.now)
    .run();
}

/** Şirket oluşturur ve kurucuyu owner üye yapar. */
export async function createCompany(
  db: D1Like,
  c: { companyId: string; name: string; ownerSub: string; email: string; ownerName: string | null; now: string },
): Promise<void> {
  await db
    .prepare('INSERT INTO companies (id, name, owner_sub, created_at) VALUES (?, ?, ?, ?)')
    .bind(c.companyId, c.name, c.ownerSub, c.now)
    .run();
  await upsertMembership(db, {
    companyId: c.companyId, userSub: c.ownerSub, email: c.email, name: c.ownerName, role: 'owner', now: c.now,
  });
}

/** Tek üyelik kaydını döner; yoksa null. */
export async function getMembership(db: D1Like, companyId: string, userSub: string): Promise<MembershipRow | null> {
  return db
    .prepare('SELECT company_id, user_sub, email, name, role, joined_at FROM memberships WHERE company_id = ? AND user_sub = ?')
    .bind(companyId, userSub)
    .first<MembershipRow>();
}

/** Kullanıcının tüm üyeliklerini görünüm olarak döner. */
export async function listMemberships(db: D1Like, userSub: string): Promise<MembershipView[]> {
  const { results } = await db
    .prepare('SELECT company_id, user_sub, email, name, role, joined_at FROM memberships WHERE user_sub = ?')
    .bind(userSub)
    .all<MembershipRow>();
  return results.map((r) => ({
    companyId: r.company_id, role: r.role, email: r.email, name: r.name, joinedAt: r.joined_at,
  }));
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npx vitest run functions/_lib/team.test.ts`
Beklenen: PASS.

- [ ] **Step 5: Commit**

```bash
git add functions/_lib/team.ts functions/_lib/team.test.ts
git commit -m "feat(team): createCompany + membership queries"
```

---

## Task 6: `team.ts` — davet oluştur + kullan (süre, tek-kullanım, zaten-üye)

**Files:**
- Modify: `functions/_lib/team.ts`
- Modify: `functions/_lib/team.test.ts`

- [ ] **Step 1: Başarısız testi ekle**

`functions/_lib/team.test.ts` sonuna ekle:

```ts
import { createInvite, redeemInvite } from './team';

describe('davet oluştur + kullan', () => {
  async function seedCompany(db: any) {
    await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'O', now: '2026-06-08T00:00:00Z' });
  }

  it('createInvite kaydı yazar; redeemInvite üyelik oluşturur', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await createInvite(db, { code: 'ABCD2345', companyId: 'c:co-1', role: 'employee', createdBy: 'sub-owner', now: '2026-06-08T00:00:00Z', expiresAt: '2026-06-15T00:00:00Z' });

    const res = await redeemInvite(db, {
      code: 'ABCD2345', userSub: 'sub-emp', email: 'e@x.com', name: 'Emre',
      now: '2026-06-09T00:00:00Z',
    });
    expect(res).toEqual({ ok: true, companyId: 'c:co-1', role: 'employee' });

    const m = await getMembership(db, 'c:co-1', 'sub-emp');
    expect(m).toMatchObject({ role: 'employee', email: 'e@x.com' });
  });

  it('süresi geçmiş davet reddedilir (expired)', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await createInvite(db, { code: 'ABCD2345', companyId: 'c:co-1', role: 'employee', createdBy: 'sub-owner', now: '2026-06-08T00:00:00Z', expiresAt: '2026-06-08T01:00:00Z' });

    const res = await redeemInvite(db, { code: 'ABCD2345', userSub: 'sub-emp', email: 'e@x.com', name: 'E', now: '2026-06-09T00:00:00Z' });
    expect(res).toEqual({ ok: false, reason: 'expired' });
    expect(await getMembership(db, 'c:co-1', 'sub-emp')).toBeNull();
  });

  it('tek kullanımlık — ikinci kullanım reddedilir (used)', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await createInvite(db, { code: 'ABCD2345', companyId: 'c:co-1', role: 'employee', createdBy: 'sub-owner', now: '2026-06-08T00:00:00Z', expiresAt: '2026-06-15T00:00:00Z' });

    await redeemInvite(db, { code: 'ABCD2345', userSub: 'sub-1', email: '1@x.com', name: '1', now: '2026-06-09T00:00:00Z' });
    const res = await redeemInvite(db, { code: 'ABCD2345', userSub: 'sub-2', email: '2@x.com', name: '2', now: '2026-06-09T00:00:01Z' });
    expect(res).toEqual({ ok: false, reason: 'used' });
  });

  it('bilinmeyen kod reddedilir (not_found)', async () => {
    const { db } = makeFakeD1();
    const res = await redeemInvite(db, { code: 'ZZZZ9999', userSub: 'sub-x', email: 'x@x.com', name: 'X', now: '2026-06-09T00:00:00Z' });
    expect(res).toEqual({ ok: false, reason: 'not_found' });
  });

  it('zaten üye olan kullanıcı için already_member', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await createInvite(db, { code: 'ABCD2345', companyId: 'c:co-1', role: 'employee', createdBy: 'sub-owner', now: '2026-06-08T00:00:00Z', expiresAt: '2026-06-15T00:00:00Z' });

    const res = await redeemInvite(db, { code: 'ABCD2345', userSub: 'sub-owner', email: 'o@x.com', name: 'O', now: '2026-06-09T00:00:00Z' });
    expect(res).toEqual({ ok: false, reason: 'already_member' });
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `npx vitest run functions/_lib/team.test.ts`
Beklenen: FAIL — `createInvite is not a function`.

- [ ] **Step 3: Implementasyonu ekle**

`functions/_lib/team.ts` sonuna ekle:

```ts
export interface InviteRow {
  code: string;
  company_id: string;
  role: Role;
  created_by: string;
  created_at: string;
  expires_at: string;
  redeemed_by: string | null;
  redeemed_at: string | null;
}

/** Davet kaydı oluşturur. Kod ve süre endpoint'te üretilir, buraya parametre gelir. */
export async function createInvite(
  db: D1Like,
  inv: { code: string; companyId: string; role: Role; createdBy: string; now: string; expiresAt: string },
): Promise<void> {
  await db
    .prepare('INSERT INTO invites (code, company_id, role, created_by, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(inv.code, inv.companyId, inv.role, inv.createdBy, inv.now, inv.expiresAt)
    .run();
}

export type RedeemResult =
  | { ok: true; companyId: string; role: Role }
  | { ok: false; reason: 'not_found' | 'expired' | 'used' | 'already_member' };

/**
 * Daveti kullanır: doğrulama (var/süre/kullanılmamış/zaten-üye) → üyelik oluştur → daveti işaretle.
 * `now` ve karşılaştırmalar ISO string (sözlüksel sıralama UTC ISO'da kronolojiktir).
 */
export async function redeemInvite(
  db: D1Like,
  req: { code: string; userSub: string; email: string; name: string | null; now: string },
): Promise<RedeemResult> {
  const normalized = req.code.toUpperCase();
  const inv = await db
    .prepare('SELECT code, company_id, role, created_by, created_at, expires_at, redeemed_by, redeemed_at FROM invites WHERE code = ?')
    .bind(normalized)
    .first<InviteRow>();

  if (!inv) return { ok: false, reason: 'not_found' };
  if (inv.redeemed_by) return { ok: false, reason: 'used' };
  if (inv.expires_at < req.now) return { ok: false, reason: 'expired' };

  const existing = await getMembership(db, inv.company_id, req.userSub);
  if (existing) return { ok: false, reason: 'already_member' };

  await upsertMembership(db, {
    companyId: inv.company_id, userSub: req.userSub, email: req.email, name: req.name, role: inv.role, now: req.now,
  });
  await db
    .prepare('UPDATE invites SET redeemed_by = ?, redeemed_at = ? WHERE code = ? AND redeemed_by IS NULL')
    .bind(req.userSub, req.now, normalized)
    .run();

  return { ok: true, companyId: inv.company_id, role: inv.role };
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npx vitest run functions/_lib/team.test.ts`
Beklenen: PASS (tüm davet senaryoları yeşil).

- [ ] **Step 5: Commit**

```bash
git add functions/_lib/team.ts functions/_lib/team.test.ts
git commit -m "feat(team): createInvite + redeemInvite with expiry/single-use/already-member guards"
```

---

## Task 7: Oturum→üye çözümleme yardımcısı

**Files:**
- Create: `functions/_lib/team-session.ts`

Tüm `api/team/*` endpoint'leri aynı oturum çözümlemesini yapar (cookie → verifySession → sub/email/name). DRY için tek yardımcıya alınır.

- [ ] **Step 1: Yardımcıyı yaz**

`functions/_lib/team-session.ts`:

```ts
/**
 * team-session.ts — api/team/* endpoint'leri için ortak oturum köprüsü.
 * pz_session cookie'sini doğrular, üye kimliğini (sub/email/name) döner.
 */
import { verifySession, parseCookies, type SessionPayload } from './session';
import { SESSION_COOKIE } from '../../src/storefront/auth/config';

export interface TeamEnv {
  STORE_WRITE_KEY?: string;
}

/**
 * Geçerli oturum varsa payload döner; yoksa null.
 * @param nowSec Test edilebilirlik için dışarıdan verilen unix saniye.
 */
export async function resolveMember(
  request: Request,
  env: TeamEnv,
  nowSec: number,
): Promise<SessionPayload | null> {
  const secret = env.STORE_WRITE_KEY;
  if (!secret) return null;
  const cookies = parseCookies(request.headers.get('cookie'));
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;
  return verifySession(token, secret, nowSec);
}
```

- [ ] **Step 2: TypeScript derlemesini doğrula**

Run: `npx tsc --noEmit -p tsconfig.json`
Beklenen: Hata yok (import yolları ve tipler çözülüyor). `SessionPayload` `session.ts`'den export edilmiş durumda — değilse o satıra `export` ekle.

- [ ] **Step 3: Commit**

```bash
git add functions/_lib/team-session.ts
git commit -m "feat(team): shared session->member resolver helper"
```

---

## Task 8: POST /api/team/create endpoint'i

**Files:**
- Create: `functions/api/team/create.ts`
- Create: `functions/api/team/create.test.ts`

- [ ] **Step 1: Başarısız testi yaz**

`functions/api/team/create.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';
import { onRequestPost } from './create';
import { makeFakeD1 } from '../../_lib/fakeD1';
import { signSession } from '../../_lib/session';
import { SESSION_COOKIE } from '../../../src/storefront/auth/config';

const SECRET = 'test-secret';

async function authedRequest(body: unknown): Promise<Request> {
  const token = await signSession(
    { sub: 'sub-ahmet', email: 'ahmet@x.com', name: 'Ahmet', exp: 9999999999 },
    SECRET,
  );
  return new Request('https://x/api/team/create', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: `${SESSION_COOKIE}=${token}` },
    body: JSON.stringify(body),
  });
}

describe('POST /api/team/create', () => {
  it('oturum yoksa 401', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://x/api/team/create', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"name":"A"}' });
    const res = await onRequestPost({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(401);
  });

  it('name yoksa 400', async () => {
    const { db } = makeFakeD1();
    const res = await onRequestPost({ request: await authedRequest({}), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(400);
  });

  it('geçerli istek şirket oluşturur, kurucu owner olur', async () => {
    const { db, tables } = makeFakeD1();
    const res = await onRequestPost({ request: await authedRequest({ name: 'Ahmet Oto' }), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(200);
    const json = await res.json() as { ok: boolean; companyId: string; role: string };
    expect(json.ok).toBe(true);
    expect(json.role).toBe('owner');
    expect(tables.companies).toHaveLength(1);
    expect(tables.memberships[0]).toMatchObject({ role: 'owner', user_sub: 'sub-ahmet' });
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `npx vitest run functions/api/team/create.test.ts`
Beklenen: FAIL — `Cannot find module './create'`.

- [ ] **Step 3: Endpoint'i yaz**

`functions/api/team/create.ts`:

```ts
/**
 * POST /api/team/create — yeni şirket oluştur; çağıran owner olur.
 * Gövde: JSON { name }
 * 200 { ok, companyId, role } | 400 (name yok) | 401 (oturum yok) | 503 (yapılandırılmamış)
 */
import { resolveMember } from '../../_lib/team-session';
import { createCompany } from '../../_lib/team';
import type { D1Like } from '../../_lib/buyer';

interface Env { STORE_WRITE_KEY?: string; MARKET_DB?: D1Like; }
type Ctx = { request: Request; env: Env };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  if (!ctx.env.STORE_WRITE_KEY) return json({ error: 'Team service not configured' }, 503);
  if (!ctx.env.MARKET_DB) return json({ error: 'DB not configured' }, 503);

  const nowSec = Math.floor(Date.now() / 1000);
  const member = await resolveMember(ctx.request, ctx.env, nowSec);
  if (!member) return json({ error: 'Unauthorized' }, 401);

  const body = await ctx.request.json().catch(() => null) as { name?: string } | null;
  const name = body?.name?.trim();
  if (!name || name.length > 80) return json({ error: 'name required (<=80)' }, 400);

  const companyId = 'c:' + crypto.randomUUID();
  const now = new Date().toISOString();
  await createCompany(ctx.env.MARKET_DB, {
    companyId, name, ownerSub: member.sub, email: member.email, ownerName: member.name ?? null, now,
  });

  return json({ ok: true, companyId, role: 'owner' });
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npx vitest run functions/api/team/create.test.ts`
Beklenen: PASS.

- [ ] **Step 5: Commit**

```bash
git add functions/api/team/create.ts functions/api/team/create.test.ts
git commit -m "feat(team): POST /api/team/create endpoint"
```

---

## Task 9: POST /api/team/invite + POST /api/team/join

**Files:**
- Create: `functions/api/team/invite.ts`
- Create: `functions/api/team/join.ts`
- Create: `functions/api/team/join.test.ts`

- [ ] **Step 1: invite endpoint'ini yaz**

`functions/api/team/invite.ts`:

```ts
/**
 * POST /api/team/invite — davet kodu üret. Yalnızca manageMembers yetkisi olan rol (owner/admin).
 * Gövde: JSON { companyId, role }  (role: 'admin' | 'employee')
 * 200 { ok, code, expiresAt } | 400 | 401 | 403 | 503
 */
import { resolveMember } from '../../_lib/team-session';
import { getMembership, createInvite, randomInviteCode, can, type Role } from '../../_lib/team';
import type { D1Like } from '../../_lib/buyer';

interface Env { STORE_WRITE_KEY?: string; MARKET_DB?: D1Like; }
type Ctx = { request: Request; env: Env };

const INVITE_TTL_DAYS = 7;

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  if (!ctx.env.STORE_WRITE_KEY) return json({ error: 'Team service not configured' }, 503);
  if (!ctx.env.MARKET_DB) return json({ error: 'DB not configured' }, 503);

  const nowSec = Math.floor(Date.now() / 1000);
  const member = await resolveMember(ctx.request, ctx.env, nowSec);
  if (!member) return json({ error: 'Unauthorized' }, 401);

  const body = await ctx.request.json().catch(() => null) as { companyId?: string; role?: string } | null;
  const companyId = body?.companyId;
  const role = body?.role as Role | undefined;
  if (!companyId || (role !== 'admin' && role !== 'employee')) {
    return json({ error: "companyId + role ('admin'|'employee') required" }, 400);
  }

  const my = await getMembership(ctx.env.MARKET_DB, companyId, member.sub);
  if (!my || !can(my.role, 'manageMembers')) return json({ error: 'Forbidden' }, 403);

  const code = randomInviteCode((n) => crypto.getRandomValues(new Uint8Array(n)));
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 86400_000).toISOString();
  await createInvite(ctx.env.MARKET_DB, { code, companyId, role, createdBy: member.sub, now, expiresAt });

  return json({ ok: true, code, expiresAt });
}
```

- [ ] **Step 2: join endpoint'ini yaz**

`functions/api/team/join.ts`:

```ts
/**
 * POST /api/team/join — davet kodunu kullan, üye ol.
 * Gövde: JSON { code }
 * 200 { ok, companyId, role } | 400 | 401 | 409 (kullanılmaz: süre/used/already) | 503
 */
import { resolveMember } from '../../_lib/team-session';
import { redeemInvite, isValidInviteCode } from '../../_lib/team';
import type { D1Like } from '../../_lib/buyer';

interface Env { STORE_WRITE_KEY?: string; MARKET_DB?: D1Like; }
type Ctx = { request: Request; env: Env };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  if (!ctx.env.STORE_WRITE_KEY) return json({ error: 'Team service not configured' }, 503);
  if (!ctx.env.MARKET_DB) return json({ error: 'DB not configured' }, 503);

  const nowSec = Math.floor(Date.now() / 1000);
  const member = await resolveMember(ctx.request, ctx.env, nowSec);
  if (!member) return json({ error: 'Unauthorized' }, 401);

  const body = await ctx.request.json().catch(() => null) as { code?: string } | null;
  const code = body?.code?.trim() ?? '';
  if (!isValidInviteCode(code)) return json({ error: 'invalid code format' }, 400);

  const now = new Date().toISOString();
  const result = await redeemInvite(ctx.env.MARKET_DB, {
    code, userSub: member.sub, email: member.email, name: member.name ?? null, now,
  });

  if (!result.ok) return json({ error: result.reason }, 409);
  return json({ ok: true, companyId: result.companyId, role: result.role });
}
```

- [ ] **Step 3: join testini yaz**

`functions/api/team/join.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { onRequestPost as join } from './join';
import { onRequestPost as invite } from './invite';
import { onRequestPost as create } from './create';
import { makeFakeD1 } from '../../_lib/fakeD1';
import { signSession } from '../../_lib/session';
import { SESSION_COOKIE } from '../../../src/storefront/auth/config';

const SECRET = 'test-secret';

async function authed(sub: string, email: string, name: string, url: string, body: unknown): Promise<Request> {
  const token = await signSession({ sub, email, name, exp: 9999999999 }, SECRET);
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: `${SESSION_COOKIE}=${token}` },
    body: JSON.stringify(body),
  });
}

describe('team join akışı', () => {
  it('owner şirket kurar → davet üretir → çalışan katılır', async () => {
    const { db, tables } = makeFakeD1();
    const env = { STORE_WRITE_KEY: SECRET, MARKET_DB: db };

    const cRes = await create({ request: await authed('sub-owner', 'o@x.com', 'O', 'https://x/api/team/create', { name: 'Ahmet Oto' }), env });
    const { companyId } = await cRes.json() as { companyId: string };

    const iRes = await invite({ request: await authed('sub-owner', 'o@x.com', 'O', 'https://x/api/team/invite', { companyId, role: 'employee' }), env });
    expect(iRes.status).toBe(200);
    const { code } = await iRes.json() as { code: string };

    const jRes = await join({ request: await authed('sub-emp', 'e@x.com', 'Emre', 'https://x/api/team/join', { code }), env });
    expect(jRes.status).toBe(200);
    expect(await jRes.json()).toMatchObject({ ok: true, companyId, role: 'employee' });
    expect(tables.memberships.find((m) => m.user_sub === 'sub-emp')).toMatchObject({ role: 'employee' });
  });

  it('employee davet üretemez (403)', async () => {
    const { db } = makeFakeD1();
    const env = { STORE_WRITE_KEY: SECRET, MARKET_DB: db };
    const cRes = await create({ request: await authed('sub-owner', 'o@x.com', 'O', 'https://x/api/team/create', { name: 'A' }), env });
    const { companyId } = await cRes.json() as { companyId: string };
    const iRes = await invite({ request: await authed('sub-owner', 'o@x.com', 'O', 'https://x/api/team/invite', { companyId, role: 'employee' }), env });
    const { code } = await iRes.json() as { code: string };
    await join({ request: await authed('sub-emp', 'e@x.com', 'E', 'https://x/api/team/join', { code }), env });

    // employee başka kod üretmeye kalkışır
    const denied = await invite({ request: await authed('sub-emp', 'e@x.com', 'E', 'https://x/api/team/invite', { companyId, role: 'employee' }), env });
    expect(denied.status).toBe(403);
  });

  it('aynı kod ikinci kez kullanılamaz (409)', async () => {
    const { db } = makeFakeD1();
    const env = { STORE_WRITE_KEY: SECRET, MARKET_DB: db };
    const cRes = await create({ request: await authed('sub-owner', 'o@x.com', 'O', 'https://x/api/team/create', { name: 'A' }), env });
    const { companyId } = await cRes.json() as { companyId: string };
    const iRes = await invite({ request: await authed('sub-owner', 'o@x.com', 'O', 'https://x/api/team/invite', { companyId, role: 'employee' }), env });
    const { code } = await iRes.json() as { code: string };

    await join({ request: await authed('sub-1', '1@x.com', '1', 'https://x/api/team/join', { code }), env });
    const second = await join({ request: await authed('sub-2', '2@x.com', '2', 'https://x/api/team/join', { code }), env });
    expect(second.status).toBe(409);
  });
});
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npx vitest run functions/api/team/join.test.ts`
Beklenen: PASS (3 senaryo: tam akış, 403, 409).

- [ ] **Step 5: Commit**

```bash
git add functions/api/team/invite.ts functions/api/team/join.ts functions/api/team/join.test.ts
git commit -m "feat(team): POST /api/team/invite + /api/team/join endpoints"
```

---

## Task 10: GET /api/team/me endpoint'i

**Files:**
- Create: `functions/api/team/me.ts`

- [ ] **Step 1: Endpoint'i yaz**

`functions/api/team/me.ts`:

```ts
/**
 * GET /api/team/me — oturumun üyeliklerini döner (şirket + rol listesi).
 * Oturum yoksa: 200 { loggedIn: false }  (client UI kararı için, 401 değil)
 * Oturum varsa: 200 { loggedIn: true, sub, email, memberships: [{ companyId, role, ... }] }
 */
import { resolveMember } from '../../_lib/team-session';
import { listMemberships } from '../../_lib/team';
import type { D1Like } from '../../_lib/buyer';

interface Env { STORE_WRITE_KEY?: string; MARKET_DB?: D1Like; }
type Ctx = { request: Request; env: Env };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  if (!ctx.env.STORE_WRITE_KEY || !ctx.env.MARKET_DB) return json({ loggedIn: false });

  const nowSec = Math.floor(Date.now() / 1000);
  const member = await resolveMember(ctx.request, ctx.env, nowSec);
  if (!member) return json({ loggedIn: false });

  const memberships = await listMemberships(ctx.env.MARKET_DB, member.sub);
  return json({ loggedIn: true, sub: member.sub, email: member.email, memberships });
}
```

- [ ] **Step 2: me senaryosunu join.test.ts'e ekle (ayrı dosya açmadan, DRY)**

`functions/api/team/join.test.ts` içine, üstteki importlara ekle:

```ts
import { onRequestGet as me } from './me';
```

Ve `describe('team join akışı', ...)` içine yeni test ekle:

```ts
  it('me, kullanıcının üyeliklerini döner', async () => {
    const { db } = makeFakeD1();
    const env = { STORE_WRITE_KEY: SECRET, MARKET_DB: db };
    await create({ request: await authed('sub-owner', 'o@x.com', 'O', 'https://x/api/team/create', { name: 'A' }), env });

    const token = await signSession({ sub: 'sub-owner', email: 'o@x.com', name: 'O', exp: 9999999999 }, SECRET);
    const req = new Request('https://x/api/team/me', { headers: { cookie: `${SESSION_COOKIE}=${token}` } });
    const res = await me({ request: req, env });
    const body = await res.json() as { loggedIn: boolean; memberships: { role: string }[] };
    expect(body.loggedIn).toBe(true);
    expect(body.memberships).toHaveLength(1);
    expect(body.memberships[0].role).toBe('owner');
  });

  it('me, oturum yoksa loggedIn:false', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://x/api/team/me');
    const res = await me({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(await res.json()).toEqual({ loggedIn: false });
  });
```

- [ ] **Step 3: Testi çalıştır, geçtiğini gör**

Run: `npx vitest run functions/api/team/join.test.ts`
Beklenen: PASS (me dahil tüm senaryolar yeşil).

- [ ] **Step 4: Commit**

```bash
git add functions/api/team/me.ts functions/api/team/join.test.ts
git commit -m "feat(team): GET /api/team/me endpoint"
```

---

## Task 11: Tam suite + tip doğrulama (faz kapanışı)

**Files:** (yok — doğrulama)

- [ ] **Step 1: Tüm test suite'i çalıştır**

Run: `npm test`
Beklenen: Tüm testler PASS — yeni takım testleri + mevcut buyer/marketplace/store testleri (regresyon yok).

- [ ] **Step 2: TypeScript tip kontrolü**

Run: `npx tsc --noEmit -p tsconfig.json`
Beklenen: Hata yok.

- [ ] **Step 3: Prod D1'e migration uygula (deploy öncesi)**

Run: `npx wrangler d1 migrations apply MARKET_DB --remote`
Beklenen: `0004_team.sql` uygulandı. (Bu adım canlı veritabanını değiştirir — kullanıcı onayı/uygun ortam gerektirir.)

- [ ] **Step 4: Faz kapanış commit'i (gerekiyorsa)**

```bash
git add -A
git commit -m "chore(team): Faz 1 backend+auth+invite complete — all tests green"
```

---

## Sonraki fazlar (sadece roadmap başlığı — bu planın parçası değil)

- **Faz 2 — Senkron motoru:** Ortak havuz ↔ Core Data; proje/asset metadata D1'de, fotoğraflar **R2**'de; offline çekim + çakışma çözümü (metadata last-write-wins, asset değişmez).
- **Faz 3 — Capability enforcement yayılımı:** `can()`'in tüm sunucu uçlarında (export/publish/pricing) zorunlu kılınması + şirket ayarlarının çalışanlara salt-okunur akışı.
- **Faz 4 — iOS istemci UI:** Şirket oluştur/katıl ekranları, üye listesi, rol rozeti, "Hazır" işaretleme, Owner havuz/yayın ekranı.
- **Faz 5 — Owner havuz/yayın + faturalandırma:** Tek-abonelik (RevenueCat) + koltuk yönetimi.

---

## Self-Review Notları

- **Spec coverage:** 3-rol modeli (Task 2), davet akışı (Task 3/6/9), capability enforcement temeli (Task 2 `can()` + Task 9 `manageMembers` kontrolü), tek-kullanım/süre/zaten-üye korumaları (Task 6) — tasarımdaki tüm Faz 1 kararları karşılandı. Stok/iOS/R2 bilinçli olarak kapsam dışı.
- **Tip tutarlılığı:** `Role`, `Capability`, `MembershipRow/View`, `InviteRow`, `RedeemResult` tek yerde (`team.ts`) tanımlı; endpoint'ler import eder. `D1Like` `buyer.ts`'den yeniden kullanılır (çift tanım yok). Fonksiyon adları tüm task'larda tutarlı (`createCompany`, `getMembership`, `listMemberships`, `createInvite`, `redeemInvite`, `randomInviteCode`, `isValidInviteCode`, `can`, `resolveMember`).
- **Placeholder yok:** Her kod adımı tam içerik taşır.
- **Bağımlılık:** `session.ts`'in `SessionPayload`'ı export ettiği varsayılır (Task 7 Step 2 doğrular; değilse o export eklenir). `src/storefront/auth/config`'in `SESSION_COOKIE` export'u mevcut (auth/me.ts kullanıyor).
