# photoZseo Takım / Ortak Havuz — Faz 2A: Backend Senkron API + R2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Şirket havuzundaki projelerin ve fotoğrafların sunucu tarafında saklanması ve cihazlar arası senkronlanması için Cloudflare backend'ini kur — D1'de company-scoped proje/asset metadata (delta pull + last-write-wins + tombstone), R2'de fotoğraflar (presigned URL ile doğrudan yükleme).

**Architecture:** Faz 1'in (`feature/team-shared-pool-faz1`) üstüne eklenir; aynı Pages Functions + D1 (`MARKET_DB`) + `pz_session` deseni. Yeni: R2 bucket binding (`POOL_R2`) + S3 presigned URL (aws4fetch). iOS'ta zaten var olan `ProjectSnapshot`/`AssetSnapshot` Codable DTO'ları kablo formatıdır — backend bunları **opak JSON** olarak saklar (zengin alanlara bağımlı değil; sadece `modified_at`/`deleted_at`/`created_by` indexli kolonlarla senkron yönetir). Çakışma modeli mevcut iCloud senkronuyla aynı: metadata last-write-wins (`modified_at`), asset'ler değişmez (yeni asset = yeni id), silmeler tombstone.

**Tech Stack:** Cloudflare Pages Functions (TypeScript), D1, R2 (S3 presigned via `aws4fetch`), Web Crypto, vitest + `makeFakeD1` + sahte R2/presigner. iOS istemci YOK (Faz 2B).

**Önkoşul (Faz 1):** Bu plan Faz 1 branch'i üstünde çalışır (`functions/_lib/team.ts`, `team-session.ts`, `migrations/0004_team.sql` mevcut olmalı). `resolveMember`, `getMembership`, `can` Faz 1'den import edilir.

**Kapsam dışı (bu faz değil):** iOS Core Data senkron motoru/offline kuyruğu (2B), proje kişisel-vs-havuz kapsam kararı (2B), capability enforcement'in export/publish'e yayılması (Faz 3), gerçek R2 bucket + S3 credential üretimi (manuel önkoşul — Task 11'de listelenir).

---

## File Structure

| Dosya | Sorumluluk | Yeni/Değişen |
|---|---|---|
| `wrangler.toml` | `POOL_R2` bucket binding + R2 S3 secret dökümantasyonu | Değişen |
| `package.json` | `aws4fetch` bağımlılığı | Değişen |
| `migrations/0005_team_pool.sql` | `pool_projects`, `pool_assets` şeması | Yeni |
| `functions/_lib/pool.ts` | Saf veri-erişim: proje/asset upsert (LWW), delta pull, tombstone | Yeni |
| `functions/_lib/pool.test.ts` | `pool.ts` birim testleri | Yeni |
| `functions/_lib/pool-authz.ts` | `requireMembership` — oturum + şirket üyeliği + rol guard'ı | Yeni |
| `functions/_lib/r2-presign.ts` | R2 anahtar üretimi + presigned PUT/GET URL (aws4fetch) | Yeni |
| `functions/_lib/r2-presign.test.ts` | anahtar + URL şekli testleri | Yeni |
| `functions/_lib/fakeD1.ts` | pool tablolarının SQL şekilleri | Değişen |
| `functions/api/team/pool/manifest.ts` | GET — delta (değişen proje id+modified_at listesi) | Yeni |
| `functions/api/team/pool/project/[id].ts` | GET (tam snapshot) + PUT (upsert) + DELETE (tombstone) | Yeni |
| `functions/api/team/pool/upload-url.ts` | POST — asset için presigned PUT URL + asset metadata upsert | Yeni |
| `functions/api/team/pool/asset/[id].ts` | GET (presigned download URL) + DELETE (tombstone) | Yeni |
| `functions/api/team/pool/*.test.ts` | endpoint testleri | Yeni |

---

## Konvansiyonlar (Faz 1'den devam)

- **Zaman/ID enjeksiyonu:** Saf lib fonksiyonları `now`/id'yi parametre alır; `Date.now()`/`crypto.randomUUID()` yalnızca endpoint katmanında.
- **D1Like** `functions/_lib/buyer.ts`'den import.
- **Oturum:** `resolveMember(request, env, nowSec)` (`team-session.ts`), secret = `STORE_WRITE_KEY`.
- **Üyelik/rol:** `getMembership` + `can` (`team.ts`).
- **Çakışma:** `modified_at` (ISO-UTC string) leksikografik karşılaştırma = kronolojik. Upsert yalnızca gelen `modified_at` mevcuttan **büyük veya eşitse** yazar (LWW).
- **Test:** vitest, co-located `.test.ts`, `makeFakeD1`.
- **Komutlar:** `npm test`, `npx vitest run <dosya>`, `npx tsc --noEmit -p tsconfig.json`.

---

## R2 Anahtar Düzeni

`companies/<companyId>/projects/<projectId>/original/<assetId>.<ext>`

(iOS'taki `projects/<projectID>/original/<assetID>.<ext>` düzenini company prefix'iyle yansıtır.)

---

## Senkron Protokolü (delta pull)

1. İstemci bir **cursor** tutar: gördüğü en büyük `modified_at`.
2. `GET /api/team/pool/manifest?since=<iso>` → `modified_at > since` olan projeler (tombstone'lananlar dahil) — `{ projectId, modifiedAt, deletedAt }[]` + yeni cursor.
3. İstemci değişen her proje için `GET /api/team/pool/project/<id>` ile tam snapshot'ı (+ asset metadata + R2 download URL'leri) çeker.
4. İstemci yerel değişiklikleri `PUT /api/team/pool/project/<id>` ile push eder (server LWW uygular).
5. Fotoğraf: `POST upload-url` → presigned PUT → istemci doğrudan R2'ye yükler.

---

## Task 1: R2 binding + aws4fetch bağımlılığı

**Files:**
- Modify: `wrangler.toml`
- Modify: `package.json`

- [ ] **Step 1: `wrangler.toml`'a R2 binding ekle**

`wrangler.toml` sonuna ekle:

```toml
# R2 — Takım/Ortak Havuz fotoğraf depolama (Faz 2A).
# Local dev: `wrangler pages dev` --r2 POOL_R2 ile emüle eder (account gerekmez).
# Production bucket manuel oluşturulur (Task 11 önkoşulları).
[[r2_buckets]]
binding = "POOL_R2"
bucket_name = "photozseo-team-pool"
preview_bucket_name = "photozseo-team-pool-preview"
```

- [ ] **Step 2: aws4fetch'i kur**

Run: `npm install aws4fetch`
Beklenen: `package.json` `dependencies`'e `aws4fetch` eklenir, kurulum başarılı.

- [ ] **Step 3: aws4fetch import edilebiliyor mu doğrula**

Run: `node -e "import('aws4fetch').then(m => console.log(typeof m.AwsClient))"`
Beklenen: `function`

- [ ] **Step 4: Commit**

```bash
git add wrangler.toml package.json package-lock.json
git commit -m "feat(pool): add POOL_R2 binding + aws4fetch dependency"
```

---

## Task 2: D1 şema migration'ı

**Files:**
- Create: `migrations/0005_team_pool.sql`

- [ ] **Step 1: Migration dosyasını yaz**

```sql
-- 0005_team_pool.sql — Takım/Ortak Havuz Faz 2A (proje + asset senkron deposu).
-- Şirkete kapsamlı. snapshot kolonu iOS ProjectSnapshot/AssetSnapshot JSON'unu
-- opak saklar; senkron yalnızca modified_at/deleted_at/created_by ile yönetilir.

CREATE TABLE IF NOT EXISTS pool_projects (
  company_id  TEXT NOT NULL,
  project_id  TEXT NOT NULL,               -- UUID
  created_by  TEXT NOT NULL,               -- ilk push eden sub
  modified_at TEXT NOT NULL,               -- ISO-UTC; LWW anahtarı
  deleted_at  TEXT,                         -- tombstone (ISO) veya NULL
  snapshot    TEXT NOT NULL,                -- ProjectSnapshot JSON (asset'siz)
  PRIMARY KEY (company_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_pool_projects_sync ON pool_projects(company_id, modified_at);

CREATE TABLE IF NOT EXISTS pool_assets (
  company_id  TEXT NOT NULL,
  project_id  TEXT NOT NULL,
  asset_id    TEXT NOT NULL,               -- UUID
  r2_key      TEXT NOT NULL,                -- companies/<c>/projects/<p>/original/<a>.<ext>
  created_by  TEXT NOT NULL,
  modified_at TEXT NOT NULL,
  deleted_at  TEXT,
  snapshot    TEXT NOT NULL,                -- AssetSnapshot JSON
  PRIMARY KEY (company_id, project_id, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_pool_assets_project ON pool_assets(company_id, project_id);
```

- [ ] **Step 2: Yerel D1'e uygula ve doğrula**

Run: `npx wrangler d1 migrations apply MARKET_DB --local`
Sonra: `npx wrangler d1 execute MARKET_DB --local --command "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('pool_projects','pool_assets');"`
Beklenen: 2 satır — `pool_projects`, `pool_assets`.

- [ ] **Step 3: Commit**

```bash
git add migrations/0005_team_pool.sql
git commit -m "feat(pool): add pool_projects/pool_assets D1 schema"
```

---

## Task 3: Sahte D1'e pool tablolarını ekle

**Files:**
- Modify: `functions/_lib/fakeD1.ts`

- [ ] **Step 1: `tables` nesnesine ve `FakeD1` tipine pool tablolarını ekle**

`functions/_lib/fakeD1.ts` içinde `const tables = {` bloğuna, `invites: [] as Row[],` satırından sonra ekle:

```ts
    pool_projects: [] as Row[],
    pool_assets: [] as Row[],
```

`FakeD1` arabirimindeki `tables: { ... }` tip bildirimine ekle: `pool_projects: Row[]; pool_assets: Row[];`

- [ ] **Step 2: `exec` içine SQL şekil işleyicilerini ekle**

`functions/_lib/fakeD1.ts` içinde `exec` fonksiyonundaki son `throw new Error('fakeD1: tanınmayan SQL: ' + s);` satırından **hemen önce** ekle:

```ts
    // pool_projects: LWW upsert (ON CONFLICT ... WHERE excluded.modified_at >= mevcut)
    if (/INSERT INTO pool_projects/i.test(s)) {
      const [company_id, project_id, created_by, modified_at, deleted_at, snapshot] = args;
      const i = tables.pool_projects.findIndex((r) => r.company_id === company_id && r.project_id === project_id);
      if (i < 0) {
        tables.pool_projects.push({ company_id, project_id, created_by, modified_at, deleted_at, snapshot });
      } else if (String(modified_at) >= String(tables.pool_projects[i].modified_at)) {
        // created_by ilk yazanı korur (excluded.created_by ile değişmez)
        const keepCreatedBy = tables.pool_projects[i].created_by;
        tables.pool_projects[i] = { company_id, project_id, created_by: keepCreatedBy, modified_at, deleted_at, snapshot };
      }
      return { kind: 'run' as const };
    }
    // pool_projects: SELECT one
    if (/SELECT .* FROM pool_projects WHERE company_id = \? AND project_id = \?/i.test(s)) {
      const r = tables.pool_projects.find((x) => x.company_id === args[0] && x.project_id === args[1]) ?? null;
      return { kind: 'first' as const, row: r };
    }
    // pool_projects: delta SELECT (modified_at > since)
    if (/SELECT project_id, modified_at, deleted_at FROM pool_projects WHERE company_id = \? AND modified_at > \?/i.test(s)) {
      const rows = tables.pool_projects
        .filter((r) => r.company_id === args[0] && String(r.modified_at) > String(args[1]))
        .map((r) => ({ project_id: r.project_id, modified_at: r.modified_at, deleted_at: r.deleted_at }))
        .sort((a, b) => String(a.modified_at).localeCompare(String(b.modified_at)));
      return { kind: 'all' as const, rows };
    }
    // pool_projects: tombstone UPDATE
    if (/UPDATE pool_projects SET deleted_at = \?, modified_at = \? WHERE company_id = \? AND project_id = \?/i.test(s)) {
      const r = tables.pool_projects.find((x) => x.company_id === args[2] && x.project_id === args[3]);
      if (r) { r.deleted_at = args[0]; r.modified_at = args[1]; }
      return { kind: 'run' as const };
    }
    // pool_assets: LWW upsert
    if (/INSERT INTO pool_assets/i.test(s)) {
      const [company_id, project_id, asset_id, r2_key, created_by, modified_at, deleted_at, snapshot] = args;
      const i = tables.pool_assets.findIndex((r) => r.company_id === company_id && r.project_id === project_id && r.asset_id === asset_id);
      if (i < 0) {
        tables.pool_assets.push({ company_id, project_id, asset_id, r2_key, created_by, modified_at, deleted_at, snapshot });
      } else if (String(modified_at) >= String(tables.pool_assets[i].modified_at)) {
        const keepCreatedBy = tables.pool_assets[i].created_by;
        tables.pool_assets[i] = { company_id, project_id, asset_id, r2_key, created_by: keepCreatedBy, modified_at, deleted_at, snapshot };
      }
      return { kind: 'run' as const };
    }
    // pool_assets: SELECT one
    if (/SELECT .* FROM pool_assets WHERE company_id = \? AND project_id = \? AND asset_id = \?/i.test(s)) {
      const r = tables.pool_assets.find((x) => x.company_id === args[0] && x.project_id === args[1] && x.asset_id === args[2]) ?? null;
      return { kind: 'first' as const, row: r };
    }
    // pool_assets: list by project
    if (/SELECT .* FROM pool_assets WHERE company_id = \? AND project_id = \?$/i.test(s)) {
      const rows = tables.pool_assets.filter((r) => r.company_id === args[0] && r.project_id === args[1]);
      return { kind: 'all' as const, rows };
    }
    // pool_assets: tombstone UPDATE
    if (/UPDATE pool_assets SET deleted_at = \?, modified_at = \? WHERE company_id = \? AND project_id = \? AND asset_id = \?/i.test(s)) {
      const r = tables.pool_assets.find((x) => x.company_id === args[2] && x.project_id === args[3] && x.asset_id === args[4]);
      if (r) { r.deleted_at = args[0]; r.modified_at = args[1]; }
      return { kind: 'run' as const };
    }
```

- [ ] **Step 3: Mevcut suite regresyon kontrolü**

Run: `npm test`
Beklenen: Tüm mevcut testler PASS.

- [ ] **Step 4: Commit**

```bash
git add functions/_lib/fakeD1.ts
git commit -m "test(pool): extend fakeD1 with pool_projects/pool_assets"
```

---

## Task 4: `pool.ts` — proje veri-erişimi (LWW upsert + delta + tombstone)

**Files:**
- Create: `functions/_lib/pool.ts`
- Create: `functions/_lib/pool.test.ts`

- [ ] **Step 1: Başarısız testi yaz**

`functions/_lib/pool.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { makeFakeD1 } from './fakeD1';
import { upsertProject, getProject, projectsSince, tombstoneProject } from './pool';

const C = 'c:co-1';

describe('pool projeler', () => {
  it('upsert + get', async () => {
    const { db } = makeFakeD1();
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'sub-a', modifiedAt: '2026-06-08T00:00:00Z', snapshot: '{"name":"Ürün"}' });
    const got = await getProject(db, C, 'p1');
    expect(got).toMatchObject({ project_id: 'p1', created_by: 'sub-a', snapshot: '{"name":"Ürün"}', deleted_at: null });
  });

  it('LWW: eski modified_at yazmaz, yeni yazar', async () => {
    const { db } = makeFakeD1();
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'sub-a', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{"v":2}' });
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'sub-b', modifiedAt: '2026-06-08T09:00:00Z', snapshot: '{"v":1}' }); // eski → yok sayılır
    expect((await getProject(db, C, 'p1'))!.snapshot).toBe('{"v":2}');
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'sub-b', modifiedAt: '2026-06-08T11:00:00Z', snapshot: '{"v":3}' }); // yeni → yazar
    expect((await getProject(db, C, 'p1'))!.snapshot).toBe('{"v":3}');
  });

  it('created_by ilk yazanı korur (update created_by değiştirmez)', async () => {
    const { db } = makeFakeD1();
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'sub-a', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'sub-b', modifiedAt: '2026-06-08T11:00:00Z', snapshot: '{}' });
    expect((await getProject(db, C, 'p1'))!.created_by).toBe('sub-a');
  });

  it('projectsSince delta — since sonrası, kronolojik', async () => {
    const { db } = makeFakeD1();
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'x', modifiedAt: '2026-06-08T08:00:00Z', snapshot: '{}' });
    await upsertProject(db, { companyId: C, projectId: 'p2', createdBy: 'x', modifiedAt: '2026-06-08T09:00:00Z', snapshot: '{}' });
    await upsertProject(db, { companyId: C, projectId: 'p3', createdBy: 'x', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
    const delta = await projectsSince(db, C, '2026-06-08T08:30:00Z');
    expect(delta.map((d) => d.projectId)).toEqual(['p2', 'p3']);
  });

  it('tombstone — deleted_at set + delta içinde görünür', async () => {
    const { db } = makeFakeD1();
    await upsertProject(db, { companyId: C, projectId: 'p1', createdBy: 'x', modifiedAt: '2026-06-08T08:00:00Z', snapshot: '{}' });
    await tombstoneProject(db, { companyId: C, projectId: 'p1', deletedAt: '2026-06-08T12:00:00Z', modifiedAt: '2026-06-08T12:00:00Z' });
    const got = await getProject(db, C, 'p1');
    expect(got!.deleted_at).toBe('2026-06-08T12:00:00Z');
    const delta = await projectsSince(db, C, '2026-06-08T11:00:00Z');
    expect(delta[0]).toMatchObject({ projectId: 'p1', deletedAt: '2026-06-08T12:00:00Z' });
  });

  it('şirket izolasyonu — başka şirketin projesi görünmez', async () => {
    const { db } = makeFakeD1();
    await upsertProject(db, { companyId: 'c:other', projectId: 'p9', createdBy: 'x', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
    expect(await getProject(db, C, 'p9')).toBeNull();
    expect(await projectsSince(db, C, '2026-06-08T00:00:00Z')).toEqual([]);
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `npx vitest run functions/_lib/pool.test.ts`
Beklenen: FAIL — `Cannot find module './pool'`.

- [ ] **Step 3: Implementasyonu yaz**

`functions/_lib/pool.ts`:

```ts
/**
 * pool.ts — Takım/Ortak Havuz Faz 2A saf veri-erişim katmanı.
 * Şirkete kapsamlı proje/asset CRUD; LWW (modified_at) + tombstone.
 * snapshot opak JSON; bu katman içeriğini yorumlamaz.
 */
import type { D1Like } from './buyer';

export interface ProjectRow {
  company_id: string;
  project_id: string;
  created_by: string;
  modified_at: string;
  deleted_at: string | null;
  snapshot: string;
}

export interface DeltaEntry {
  projectId: string;
  modifiedAt: string;
  deletedAt: string | null;
}

/**
 * Projeyi upsert eder. ON CONFLICT'te yalnızca gelen modified_at mevcuttan
 * büyük/eşitse günceller (LWW); created_by ilk yazanı korur.
 */
export async function upsertProject(
  db: D1Like,
  p: { companyId: string; projectId: string; createdBy: string; modifiedAt: string; snapshot: string; deletedAt?: string | null },
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO pool_projects (company_id, project_id, created_by, modified_at, deleted_at, snapshot) VALUES (?, ?, ?, ?, ?, ?) ' +
      'ON CONFLICT(company_id, project_id) DO UPDATE SET ' +
      'modified_at = excluded.modified_at, deleted_at = excluded.deleted_at, snapshot = excluded.snapshot ' +
      'WHERE excluded.modified_at >= pool_projects.modified_at',
    )
    .bind(p.companyId, p.projectId, p.createdBy, p.modifiedAt, p.deletedAt ?? null, p.snapshot)
    .run();
}

/** Tek projeyi döner; yoksa null. */
export async function getProject(db: D1Like, companyId: string, projectId: string): Promise<ProjectRow | null> {
  return db
    .prepare('SELECT company_id, project_id, created_by, modified_at, deleted_at, snapshot FROM pool_projects WHERE company_id = ? AND project_id = ?')
    .bind(companyId, projectId)
    .first<ProjectRow>();
}

/** modified_at > since olan projeleri kronolojik döner (tombstone dahil). */
export async function projectsSince(db: D1Like, companyId: string, since: string): Promise<DeltaEntry[]> {
  const { results } = await db
    .prepare('SELECT project_id, modified_at, deleted_at FROM pool_projects WHERE company_id = ? AND modified_at > ? ORDER BY modified_at ASC')
    .bind(companyId, since)
    .all<{ project_id: string; modified_at: string; deleted_at: string | null }>();
  return results.map((r) => ({ projectId: r.project_id, modifiedAt: r.modified_at, deletedAt: r.deleted_at }));
}

/** Projeyi tombstone'lar (deleted_at + modified_at güncellenir). */
export async function tombstoneProject(
  db: D1Like,
  t: { companyId: string; projectId: string; deletedAt: string; modifiedAt: string },
): Promise<void> {
  await db
    .prepare('UPDATE pool_projects SET deleted_at = ?, modified_at = ? WHERE company_id = ? AND project_id = ?')
    .bind(t.deletedAt, t.modifiedAt, t.companyId, t.projectId)
    .run();
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npx vitest run functions/_lib/pool.test.ts`
Beklenen: PASS (6 test).

- [ ] **Step 5: Commit**

```bash
git add functions/_lib/pool.ts functions/_lib/pool.test.ts
git commit -m "feat(pool): project data access — LWW upsert, delta, tombstone"
```

---

## Task 5: `pool.ts` — asset veri-erişimi

**Files:**
- Modify: `functions/_lib/pool.ts`
- Modify: `functions/_lib/pool.test.ts`

- [ ] **Step 1: Başarısız testi ekle**

`functions/_lib/pool.test.ts` sonuna ekle:

```ts
import { upsertAsset, getAsset, listAssets, tombstoneAsset } from './pool';

describe('pool asset', () => {
  it('upsert + get + list', async () => {
    const { db } = makeFakeD1();
    await upsertAsset(db, { companyId: C, projectId: 'p1', assetId: 'a1', r2Key: 'companies/c:co-1/projects/p1/original/a1.jpg', createdBy: 'sub-a', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{"order":0}' });
    const got = await getAsset(db, C, 'p1', 'a1');
    expect(got).toMatchObject({ asset_id: 'a1', r2_key: 'companies/c:co-1/projects/p1/original/a1.jpg', deleted_at: null });
    const list = await listAssets(db, C, 'p1');
    expect(list).toHaveLength(1);
  });

  it('LWW eski yazmaz', async () => {
    const { db } = makeFakeD1();
    await upsertAsset(db, { companyId: C, projectId: 'p1', assetId: 'a1', r2Key: 'k', createdBy: 'a', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{"v":2}' });
    await upsertAsset(db, { companyId: C, projectId: 'p1', assetId: 'a1', r2Key: 'k', createdBy: 'a', modifiedAt: '2026-06-08T09:00:00Z', snapshot: '{"v":1}' });
    expect((await getAsset(db, C, 'p1', 'a1'))!.snapshot).toBe('{"v":2}');
  });

  it('tombstone', async () => {
    const { db } = makeFakeD1();
    await upsertAsset(db, { companyId: C, projectId: 'p1', assetId: 'a1', r2Key: 'k', createdBy: 'a', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
    await tombstoneAsset(db, { companyId: C, projectId: 'p1', assetId: 'a1', deletedAt: '2026-06-08T12:00:00Z', modifiedAt: '2026-06-08T12:00:00Z' });
    expect((await getAsset(db, C, 'p1', 'a1'))!.deleted_at).toBe('2026-06-08T12:00:00Z');
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız gör**

Run: `npx vitest run functions/_lib/pool.test.ts`
Beklenen: FAIL — `upsertAsset is not a function`.

- [ ] **Step 3: Implementasyonu ekle**

`functions/_lib/pool.ts` sonuna ekle:

```ts
export interface AssetRow {
  company_id: string;
  project_id: string;
  asset_id: string;
  r2_key: string;
  created_by: string;
  modified_at: string;
  deleted_at: string | null;
  snapshot: string;
}

/** Asset'i upsert eder (LWW; created_by korunur). */
export async function upsertAsset(
  db: D1Like,
  a: { companyId: string; projectId: string; assetId: string; r2Key: string; createdBy: string; modifiedAt: string; snapshot: string; deletedAt?: string | null },
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO pool_assets (company_id, project_id, asset_id, r2_key, created_by, modified_at, deleted_at, snapshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ' +
      'ON CONFLICT(company_id, project_id, asset_id) DO UPDATE SET ' +
      'r2_key = excluded.r2_key, modified_at = excluded.modified_at, deleted_at = excluded.deleted_at, snapshot = excluded.snapshot ' +
      'WHERE excluded.modified_at >= pool_assets.modified_at',
    )
    .bind(a.companyId, a.projectId, a.assetId, a.r2Key, a.createdBy, a.modifiedAt, a.deletedAt ?? null, a.snapshot)
    .run();
}

/** Tek asset; yoksa null. */
export async function getAsset(db: D1Like, companyId: string, projectId: string, assetId: string): Promise<AssetRow | null> {
  return db
    .prepare('SELECT company_id, project_id, asset_id, r2_key, created_by, modified_at, deleted_at, snapshot FROM pool_assets WHERE company_id = ? AND project_id = ? AND asset_id = ?')
    .bind(companyId, projectId, assetId)
    .first<AssetRow>();
}

/** Projedeki tüm asset'ler (tombstone dahil). */
export async function listAssets(db: D1Like, companyId: string, projectId: string): Promise<AssetRow[]> {
  const { results } = await db
    .prepare('SELECT company_id, project_id, asset_id, r2_key, created_by, modified_at, deleted_at, snapshot FROM pool_assets WHERE company_id = ? AND project_id = ?')
    .bind(companyId, projectId)
    .all<AssetRow>();
  return results;
}

/** Asset'i tombstone'lar. */
export async function tombstoneAsset(
  db: D1Like,
  t: { companyId: string; projectId: string; assetId: string; deletedAt: string; modifiedAt: string },
): Promise<void> {
  await db
    .prepare('UPDATE pool_assets SET deleted_at = ?, modified_at = ? WHERE company_id = ? AND project_id = ? AND asset_id = ?')
    .bind(t.deletedAt, t.modifiedAt, t.companyId, t.projectId, t.assetId)
    .run();
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npx vitest run functions/_lib/pool.test.ts`
Beklenen: PASS.

- [ ] **Step 5: Commit**

```bash
git add functions/_lib/pool.ts functions/_lib/pool.test.ts
git commit -m "feat(pool): asset data access — LWW upsert, list, tombstone"
```

---

## Task 6: `pool-authz.ts` — üyelik + rol guard'ı

**Files:**
- Create: `functions/_lib/pool-authz.ts`
- Create: `functions/_lib/pool-authz.test.ts`

- [ ] **Step 1: Başarısız testi yaz**

`functions/_lib/pool-authz.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { makeFakeD1 } from './fakeD1';
import { signSession } from './session';
import { SESSION_COOKIE } from '../../src/storefront/auth/config';
import { createCompany } from './team';
import { requireMembership } from './pool-authz';

const SECRET = 'test-secret';

async function req(sub: string, email: string): Promise<Request> {
  const token = await signSession({ sub, email, name: 'X', exp: 9999999999 }, SECRET);
  return new Request('https://x/api/team/pool/x', { headers: { cookie: `${SESSION_COOKIE}=${token}` } });
}

describe('requireMembership', () => {
  it('oturum yoksa 401 Response döner', async () => {
    const { db } = makeFakeD1();
    const r = new Request('https://x/api/team/pool/x');
    const out = await requireMembership(r, { STORE_WRITE_KEY: SECRET, MARKET_DB: db }, 'c:co-1', 0);
    expect(out instanceof Response).toBe(true);
    expect((out as Response).status).toBe(401);
  });

  it('üye değilse 403 Response', async () => {
    const { db } = makeFakeD1();
    await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'O', now: '2026-06-08T00:00:00Z' });
    const out = await requireMembership(await req('sub-stranger', 's@x.com'), { STORE_WRITE_KEY: SECRET, MARKET_DB: db }, 'c:co-1', 0);
    expect((out as Response).status).toBe(403);
  });

  it('üye ise { sub, role } döner', async () => {
    const { db } = makeFakeD1();
    await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'O', now: '2026-06-08T00:00:00Z' });
    const out = await requireMembership(await req('sub-owner', 'o@x.com'), { STORE_WRITE_KEY: SECRET, MARKET_DB: db }, 'c:co-1', 0);
    expect(out).toMatchObject({ sub: 'sub-owner', role: 'owner' });
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız gör**

Run: `npx vitest run functions/_lib/pool-authz.test.ts`
Beklenen: FAIL — `Cannot find module './pool-authz'`.

- [ ] **Step 3: Implementasyonu yaz**

`functions/_lib/pool-authz.ts`:

```ts
/**
 * pool-authz.ts — pool endpoint'leri için oturum + şirket üyeliği guard'ı.
 * Başarılı: { sub, email, role } döner. Başarısız: doğrudan döndürülecek Response.
 */
import { resolveMember } from './team-session';
import { getMembership, type Role } from './team';
import type { D1Like } from './buyer';

export interface PoolEnv {
  STORE_WRITE_KEY?: string;
  MARKET_DB?: D1Like;
}

export interface MemberCtx {
  sub: string;
  email: string;
  role: Role;
}

function json(obj: unknown, status: number): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

/**
 * Oturumu çözer ve çağıranın companyId'de üye olduğunu doğrular.
 * @returns MemberCtx (yetkili) veya Response (401/403/503).
 */
export async function requireMembership(
  request: Request,
  env: PoolEnv,
  companyId: string,
  nowSec: number,
): Promise<MemberCtx | Response> {
  if (!env.STORE_WRITE_KEY || !env.MARKET_DB) return json({ error: 'Pool service not configured' }, 503);

  const member = await resolveMember(request, env, nowSec);
  if (!member) return json({ error: 'Unauthorized' }, 401);

  const m = await getMembership(env.MARKET_DB, companyId, member.sub);
  if (!m) return json({ error: 'Forbidden' }, 403);

  return { sub: member.sub, email: member.email, role: m.role };
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npx vitest run functions/_lib/pool-authz.test.ts`
Beklenen: PASS.

- [ ] **Step 5: Commit**

```bash
git add functions/_lib/pool-authz.ts functions/_lib/pool-authz.test.ts
git commit -m "feat(pool): requireMembership authz guard"
```

---

## Task 7: `r2-presign.ts` — R2 anahtarı + presigned URL

**Files:**
- Create: `functions/_lib/r2-presign.ts`
- Create: `functions/_lib/r2-presign.test.ts`

R2 presigned URL'leri S3-uyumlu API + SigV4 ile üretilir (`aws4fetch`). Anahtar üretimi saf/deterministiktir ve birim test edilir; imza üretimi `aws4fetch`'e devredilir ve test yalnızca URL yapısını (host, path, imza query param'ının varlığı) doğrular (imza değeri zaman bağımlı, değer testi yapılmaz).

- [ ] **Step 1: Başarısız testi yaz**

`functions/_lib/r2-presign.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { r2KeyForAsset, isSafeKeySegment, presignR2Url } from './r2-presign';

describe('r2KeyForAsset', () => {
  it('company prefix\'li anahtar üretir', () => {
    expect(r2KeyForAsset('c:co-1', 'p1', 'a1', 'jpg')).toBe('companies/c:co-1/projects/p1/original/a1.jpg');
  });
  it('uzantı baştaki noktayı temizler', () => {
    expect(r2KeyForAsset('c:co-1', 'p1', 'a1', '.png')).toBe('companies/c:co-1/projects/p1/original/a1.png');
  });
});

describe('isSafeKeySegment', () => {
  it('UUID/slug kabul, path traversal red', () => {
    expect(isSafeKeySegment('a1b2')).toBe(true);
    expect(isSafeKeySegment('1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')).toBe(true);
    expect(isSafeKeySegment('../etc')).toBe(false);
    expect(isSafeKeySegment('a/b')).toBe(false);
    expect(isSafeKeySegment('')).toBe(false);
  });
});

describe('presignR2Url', () => {
  const cfg = {
    accountId: 'acct123',
    accessKeyId: 'AKIA',
    secretAccessKey: 'SECRET',
    bucket: 'photozseo-team-pool',
  };
  it('PUT için imzalı URL üretir (host + key + imza param)', async () => {
    const url = await presignR2Url(cfg, { method: 'PUT', key: 'companies/c/projects/p/original/a.jpg', expiresSeconds: 900 });
    expect(url).toContain('acct123.r2.cloudflarestorage.com');
    expect(url).toContain('/photozseo-team-pool/companies/c/projects/p/original/a.jpg');
    expect(url).toContain('X-Amz-Signature=');
    expect(url).toContain('X-Amz-Expires=900');
  });
  it('GET için imzalı URL üretir', async () => {
    const url = await presignR2Url(cfg, { method: 'GET', key: 'companies/c/projects/p/original/a.jpg', expiresSeconds: 600 });
    expect(url).toContain('X-Amz-Signature=');
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız gör**

Run: `npx vitest run functions/_lib/r2-presign.test.ts`
Beklenen: FAIL — `Cannot find module './r2-presign'`.

- [ ] **Step 3: Implementasyonu yaz**

`functions/_lib/r2-presign.ts`:

```ts
/**
 * r2-presign.ts — R2 (S3-uyumlu) presigned URL üretimi.
 * Anahtar üretimi saf; imza aws4fetch ile SigV4. Worker runtime'da çalışır.
 */
import { AwsClient } from 'aws4fetch';

const SEGMENT_RE = /^[A-Za-z0-9:_-]+$/;

/** Tek bir anahtar segmenti güvenli mi (path traversal / slash engeli). */
export function isSafeKeySegment(seg: string): boolean {
  if (!seg || seg.length > 200) return false;
  return SEGMENT_RE.test(seg);
}

/** Asset için R2 nesne anahtarı. companyId/projectId/assetId çağıran tarafça doğrulanmalı. */
export function r2KeyForAsset(companyId: string, projectId: string, assetId: string, ext: string): string {
  const cleanExt = ext.replace(/^\./, '').toLowerCase();
  return `companies/${companyId}/projects/${projectId}/original/${assetId}.${cleanExt}`;
}

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

/** Presigned R2 URL üretir (PUT yükleme / GET indirme). */
export async function presignR2Url(
  cfg: R2Config,
  opts: { method: 'PUT' | 'GET'; key: string; expiresSeconds: number },
): Promise<string> {
  const client = new AwsClient({
    accessKeyId: cfg.accessKeyId,
    secretAccessKey: cfg.secretAccessKey,
    service: 's3',
    region: 'auto',
  });
  const endpoint = `https://${cfg.accountId}.r2.cloudflarestorage.com/${cfg.bucket}/${opts.key}`;
  const url = new URL(endpoint);
  url.searchParams.set('X-Amz-Expires', String(opts.expiresSeconds));
  const signed = await client.sign(new Request(url, { method: opts.method }), { aws: { signQuery: true } });
  return signed.url;
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npx vitest run functions/_lib/r2-presign.test.ts`
Beklenen: PASS. (`X-Amz-Signature` ve `X-Amz-Expires` query param'ları aws4fetch tarafından eklenir.)

- [ ] **Step 5: Commit**

```bash
git add functions/_lib/r2-presign.ts functions/_lib/r2-presign.test.ts
git commit -m "feat(pool): R2 key builder + presigned URL via aws4fetch"
```

---

## Task 8: GET /api/team/pool/manifest — delta pull

**Files:**
- Create: `functions/api/team/pool/manifest.ts`
- Create: `functions/api/team/pool/manifest.test.ts`

- [ ] **Step 1: Başarısız testi yaz**

`functions/api/team/pool/manifest.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { onRequestGet } from './manifest';
import { makeFakeD1 } from '../../../_lib/fakeD1';
import { signSession } from '../../../_lib/session';
import { SESSION_COOKIE } from '../../../../src/storefront/auth/config';
import { createCompany } from '../../../_lib/team';
import { upsertProject } from '../../../_lib/pool';

const SECRET = 'test-secret';

async function authedGet(sub: string, url: string): Promise<Request> {
  const token = await signSession({ sub, email: 's@x.com', name: 'S', exp: 9999999999 }, SECRET);
  return new Request(url, { headers: { cookie: `${SESSION_COOKIE}=${token}` } });
}

describe('GET /api/team/pool/manifest', () => {
  async function seed(db: any) {
    await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'O', now: '2026-06-08T00:00:00Z' });
    await upsertProject(db, { companyId: 'c:co-1', projectId: 'p1', createdBy: 'sub-owner', modifiedAt: '2026-06-08T08:00:00Z', snapshot: '{}' });
    await upsertProject(db, { companyId: 'c:co-1', projectId: 'p2', createdBy: 'sub-owner', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
  }

  it('companyId yoksa 400', async () => {
    const { db } = makeFakeD1();
    const res = await onRequestGet({ request: await authedGet('sub-owner', 'https://x/api/team/pool/manifest'), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(400);
  });

  it('üye değilse 403', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const res = await onRequestGet({ request: await authedGet('sub-stranger', 'https://x/api/team/pool/manifest?companyId=c:co-1'), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(403);
  });

  it('since olmadan tüm projeleri döner', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const res = await onRequestGet({ request: await authedGet('sub-owner', 'https://x/api/team/pool/manifest?companyId=c:co-1'), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(200);
    const body = await res.json() as { projects: { projectId: string }[]; cursor: string };
    expect(body.projects.map((p) => p.projectId)).toEqual(['p1', 'p2']);
    expect(body.cursor).toBe('2026-06-08T10:00:00Z');
  });

  it('since ile delta döner', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const res = await onRequestGet({ request: await authedGet('sub-owner', 'https://x/api/team/pool/manifest?companyId=c:co-1&since=2026-06-08T09:00:00Z'), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    const body = await res.json() as { projects: { projectId: string }[] };
    expect(body.projects.map((p) => p.projectId)).toEqual(['p2']);
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız gör**

Run: `npx vitest run functions/api/team/pool/manifest.test.ts`
Beklenen: FAIL — `Cannot find module './manifest'`.

- [ ] **Step 3: Endpoint'i yaz**

`functions/api/team/pool/manifest.ts`:

```ts
/**
 * GET /api/team/pool/manifest?companyId=&since= — delta pull.
 * Üye olunan şirkette modified_at > since olan projeleri döner.
 * 200 { projects:[{projectId,modifiedAt,deletedAt}], cursor } | 400 | 401 | 403 | 503
 */
import { requireMembership, type PoolEnv } from '../../../_lib/pool-authz';
import { projectsSince } from '../../../_lib/pool';

type Ctx = { request: Request; env: PoolEnv };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const url = new URL(ctx.request.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) return json({ error: 'companyId required' }, 400);

  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireMembership(ctx.request, ctx.env, companyId, nowSec);
  if (auth instanceof Response) return auth;

  const since = url.searchParams.get('since') ?? '';
  const projects = await projectsSince(ctx.env.MARKET_DB!, companyId, since);
  const cursor = projects.length ? projects[projects.length - 1].modifiedAt : since;
  return json({ projects, cursor });
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npx vitest run functions/api/team/pool/manifest.test.ts`
Beklenen: PASS.

- [ ] **Step 5: Commit**

```bash
git add functions/api/team/pool/manifest.ts functions/api/team/pool/manifest.test.ts
git commit -m "feat(pool): GET manifest delta-pull endpoint"
```

---

## Task 9: project/[id] — GET tam snapshot + PUT upsert + DELETE tombstone

**Files:**
- Create: `functions/api/team/pool/project/[id].ts`
- Create: `functions/api/team/pool/project/[id].test.ts`

Pages Functions, `onRequestGet`/`onRequestPut`/`onRequestDelete` ile aynı dosyada metoda göre yönlendirir. `params.id` dinamik segmenttir. `companyId` query string'den gelir.

- [ ] **Step 1: Başarısız testi yaz**

`functions/api/team/pool/project/[id].test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { onRequestGet, onRequestPut, onRequestDelete } from './[id]';
import { makeFakeD1 } from '../../../../_lib/fakeD1';
import { signSession } from '../../../../_lib/session';
import { SESSION_COOKIE } from '../../../../../src/storefront/auth/config';
import { createCompany, upsertMembership } from '../../../../_lib/team';
import { upsertProject, getProject, upsertAsset } from '../../../../_lib/pool';

const SECRET = 'test-secret';

async function authed(sub: string, url: string, method: string, body?: unknown): Promise<Request> {
  const token = await signSession({ sub, email: 's@x.com', name: 'S', exp: 9999999999 }, SECRET);
  return new Request(url, {
    method,
    headers: { cookie: `${SESSION_COOKIE}=${token}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function seedCompany(db: any) {
  await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'O', now: '2026-06-08T00:00:00Z' });
  await upsertMembership(db, { companyId: 'c:co-1', userSub: 'sub-emp', email: 'e@x.com', name: 'E', role: 'employee', now: '2026-06-08T00:00:00Z' });
}

const ENV = (db: any) => ({ STORE_WRITE_KEY: SECRET, MARKET_DB: db });
const CTX = (request: Request, db: any) => ({ request, env: ENV(db), params: { id: 'p1' } });

describe('PUT pool/project/[id]', () => {
  it('üye projeyi upsert eder (200)', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    const req = await authed('sub-emp', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'PUT', { modifiedAt: '2026-06-08T10:00:00Z', snapshot: { name: 'Ürün' } });
    const res = await onRequestPut(CTX(req, db));
    expect(res.status).toBe(200);
    const got = await getProject(db, 'c:co-1', 'p1');
    expect(got!.snapshot).toBe(JSON.stringify({ name: 'Ürün' }));
    expect(got!.created_by).toBe('sub-emp');
  });

  it('üye olmayan 403', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    const req = await authed('sub-stranger', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'PUT', { modifiedAt: '2026-06-08T10:00:00Z', snapshot: {} });
    expect((await onRequestPut(CTX(req, db))).status).toBe(403);
  });

  it('modifiedAt/snapshot eksikse 400', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    const req = await authed('sub-emp', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'PUT', { snapshot: {} });
    expect((await onRequestPut(CTX(req, db))).status).toBe(400);
  });
});

describe('GET pool/project/[id]', () => {
  it('tam snapshot + asset listesi döner', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await upsertProject(db, { companyId: 'c:co-1', projectId: 'p1', createdBy: 'sub-owner', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{"name":"Ü"}' });
    await upsertAsset(db, { companyId: 'c:co-1', projectId: 'p1', assetId: 'a1', r2Key: 'k', createdBy: 'sub-owner', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{"order":0}' });
    const req = await authed('sub-owner', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'GET');
    const res = await onRequestGet(CTX(req, db));
    expect(res.status).toBe(200);
    const body = await res.json() as { project: any; assets: any[] };
    expect(body.project.snapshot).toEqual({ name: 'Ü' });
    expect(body.assets).toHaveLength(1);
  });

  it('yok ise 404', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    const req = await authed('sub-owner', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'GET');
    expect((await onRequestGet(CTX(req, db))).status).toBe(404);
  });
});

describe('DELETE pool/project/[id]', () => {
  it('owner tombstone yapar (200)', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await upsertProject(db, { companyId: 'c:co-1', projectId: 'p1', createdBy: 'sub-emp', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
    const req = await authed('sub-owner', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'DELETE', { deletedAt: '2026-06-08T12:00:00Z' });
    const res = await onRequestDelete(CTX(req, db));
    expect(res.status).toBe(200);
    expect((await getProject(db, 'c:co-1', 'p1'))!.deleted_at).toBe('2026-06-08T12:00:00Z');
  });

  it('employee başkasının projesini silemez (403)', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await upsertProject(db, { companyId: 'c:co-1', projectId: 'p1', createdBy: 'sub-owner', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
    const req = await authed('sub-emp', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'DELETE', { deletedAt: '2026-06-08T12:00:00Z' });
    expect((await onRequestDelete(CTX(req, db))).status).toBe(403);
  });

  it('employee KENDİ projesini silebilir (200)', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await upsertProject(db, { companyId: 'c:co-1', projectId: 'p1', createdBy: 'sub-emp', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
    const req = await authed('sub-emp', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'DELETE', { deletedAt: '2026-06-08T12:00:00Z' });
    expect((await onRequestDelete(CTX(req, db))).status).toBe(200);
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız gör**

Run: `npx vitest run "functions/api/team/pool/project/[id].test.ts"`
Beklenen: FAIL — `Cannot find module './[id]'`.

- [ ] **Step 3: Endpoint'i yaz**

`functions/api/team/pool/project/[id].ts`:

```ts
/**
 * /api/team/pool/project/[id]?companyId= — proje senkron.
 * GET    → { project:{...,snapshot:obj}, assets:[...] }   (yoksa 404)
 * PUT    → upsert (LWW). Gövde { modifiedAt, snapshot, deletedAt? }. 200 { ok }
 * DELETE → tombstone. editAllProjects yetkisi VEYA created_by===sub gerekir. 200 { ok }
 * 400 | 401 | 403 | 404 | 503
 */
import { requireMembership, type PoolEnv } from '../../../../_lib/pool-authz';
import { getProject, upsertProject, listAssets, tombstoneProject } from '../../../../_lib/pool';
import { can } from '../../../../_lib/team';

type Ctx = { request: Request; env: PoolEnv; params: { id: string } };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

function companyIdOf(request: Request): string | null {
  return new URL(request.url).searchParams.get('companyId');
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const companyId = companyIdOf(ctx.request);
  if (!companyId) return json({ error: 'companyId required' }, 400);
  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireMembership(ctx.request, ctx.env, companyId, nowSec);
  if (auth instanceof Response) return auth;

  const row = await getProject(ctx.env.MARKET_DB!, companyId, ctx.params.id);
  if (!row) return json({ error: 'Not found' }, 404);
  const assets = await listAssets(ctx.env.MARKET_DB!, companyId, ctx.params.id);
  return json({
    project: { projectId: row.project_id, createdBy: row.created_by, modifiedAt: row.modified_at, deletedAt: row.deleted_at, snapshot: JSON.parse(row.snapshot) },
    assets: assets.map((a) => ({ assetId: a.asset_id, r2Key: a.r2_key, modifiedAt: a.modified_at, deletedAt: a.deleted_at, snapshot: JSON.parse(a.snapshot) })),
  });
}

export async function onRequestPut(ctx: Ctx): Promise<Response> {
  const companyId = companyIdOf(ctx.request);
  if (!companyId) return json({ error: 'companyId required' }, 400);
  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireMembership(ctx.request, ctx.env, companyId, nowSec);
  if (auth instanceof Response) return auth;

  const body = await ctx.request.json().catch(() => null) as { modifiedAt?: string; snapshot?: unknown; deletedAt?: string | null } | null;
  if (!body?.modifiedAt || body.snapshot === undefined) return json({ error: 'modifiedAt + snapshot required' }, 400);

  await upsertProject(ctx.env.MARKET_DB!, {
    companyId, projectId: ctx.params.id, createdBy: auth.sub,
    modifiedAt: body.modifiedAt, snapshot: JSON.stringify(body.snapshot), deletedAt: body.deletedAt ?? null,
  });
  return json({ ok: true });
}

export async function onRequestDelete(ctx: Ctx): Promise<Response> {
  const companyId = companyIdOf(ctx.request);
  if (!companyId) return json({ error: 'companyId required' }, 400);
  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireMembership(ctx.request, ctx.env, companyId, nowSec);
  if (auth instanceof Response) return auth;

  const existing = await getProject(ctx.env.MARKET_DB!, companyId, ctx.params.id);
  if (!existing) return json({ error: 'Not found' }, 404);

  // Silme kuralı: editAllProjects (owner/admin) VEYA projenin sahibi (created_by).
  if (!can(auth.role, 'editAllProjects') && existing.created_by !== auth.sub) {
    return json({ error: 'Forbidden' }, 403);
  }

  const body = await ctx.request.json().catch(() => null) as { deletedAt?: string } | null;
  const deletedAt = body?.deletedAt ?? new Date().toISOString();
  await tombstoneProject(ctx.env.MARKET_DB!, { companyId, projectId: ctx.params.id, deletedAt, modifiedAt: deletedAt });
  return json({ ok: true });
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npx vitest run "functions/api/team/pool/project/[id].test.ts"`
Beklenen: PASS (8 senaryo: PUT 200/403/400, GET 200/404, DELETE owner-200/emp-other-403/emp-own-200).

- [ ] **Step 5: Commit**

```bash
git add "functions/api/team/pool/project/[id].ts" "functions/api/team/pool/project/[id].test.ts"
git commit -m "feat(pool): project GET/PUT/DELETE endpoint with ownership-aware delete"
```

---

## Task 10: asset upload-url + asset/[id] (download + tombstone)

**Files:**
- Create: `functions/api/team/pool/upload-url.ts`
- Create: `functions/api/team/pool/asset/[id].ts`
- Create: `functions/api/team/pool/upload-url.test.ts`

R2 credential'ları endpoint'e `env` secret'larından gelir: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`. Bucket adı sabit (`photozseo-team-pool`).

- [ ] **Step 1: Başarısız testi yaz**

`functions/api/team/pool/upload-url.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { onRequestPost } from './upload-url';
import { makeFakeD1 } from '../../../_lib/fakeD1';
import { signSession } from '../../../_lib/session';
import { SESSION_COOKIE } from '../../../../src/storefront/auth/config';
import { createCompany } from '../../../_lib/team';
import { getAsset } from '../../../_lib/pool';

const SECRET = 'test-secret';
const R2 = { R2_ACCOUNT_ID: 'acct123', R2_ACCESS_KEY_ID: 'AKIA', R2_SECRET_ACCESS_KEY: 'sk' };

async function authed(sub: string, body: unknown): Promise<Request> {
  const token = await signSession({ sub, email: 's@x.com', name: 'S', exp: 9999999999 }, SECRET);
  return new Request('https://x/api/team/pool/upload-url', {
    method: 'POST', headers: { cookie: `${SESSION_COOKIE}=${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
}

async function seed(db: any) {
  await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'O', now: '2026-06-08T00:00:00Z' });
}

describe('POST /api/team/pool/upload-url', () => {
  it('üye için presigned PUT URL döner + asset metadata yazar', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const req = await authed('sub-owner', { companyId: 'c:co-1', projectId: 'p1', assetId: 'a1', ext: 'jpg', modifiedAt: '2026-06-08T10:00:00Z', snapshot: { order: 0 } });
    const res = await onRequestPost({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db, ...R2 } });
    expect(res.status).toBe(200);
    const body = await res.json() as { uploadUrl: string; r2Key: string };
    expect(body.uploadUrl).toContain('X-Amz-Signature=');
    expect(body.r2Key).toBe('companies/c:co-1/projects/p1/original/a1.jpg');
    const a = await getAsset(db, 'c:co-1', 'p1', 'a1');
    expect(a!.r2_key).toBe('companies/c:co-1/projects/p1/original/a1.jpg');
  });

  it('üye değilse 403', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const req = await authed('sub-stranger', { companyId: 'c:co-1', projectId: 'p1', assetId: 'a1', ext: 'jpg', modifiedAt: '2026-06-08T10:00:00Z', snapshot: {} });
    expect((await onRequestPost({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db, ...R2 } })).status).toBe(403);
  });

  it('güvensiz id (path traversal) 400', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const req = await authed('sub-owner', { companyId: 'c:co-1', projectId: '../etc', assetId: 'a1', ext: 'jpg', modifiedAt: '2026-06-08T10:00:00Z', snapshot: {} });
    expect((await onRequestPost({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db, ...R2 } })).status).toBe(400);
  });

  it('R2 yapılandırılmamışsa 503', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const req = await authed('sub-owner', { companyId: 'c:co-1', projectId: 'p1', assetId: 'a1', ext: 'jpg', modifiedAt: '2026-06-08T10:00:00Z', snapshot: {} });
    expect((await onRequestPost({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } })).status).toBe(503);
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız gör**

Run: `npx vitest run functions/api/team/pool/upload-url.test.ts`
Beklenen: FAIL — `Cannot find module './upload-url'`.

- [ ] **Step 3: upload-url endpoint'ini yaz**

`functions/api/team/pool/upload-url.ts`:

```ts
/**
 * POST /api/team/pool/upload-url — asset için presigned R2 PUT URL + metadata upsert.
 * Gövde: { companyId, projectId, assetId, ext, modifiedAt, snapshot }
 * 200 { uploadUrl, r2Key } | 400 | 401 | 403 | 503
 */
import { requireMembership, type PoolEnv } from '../../../_lib/pool-authz';
import { upsertAsset } from '../../../_lib/pool';
import { r2KeyForAsset, isSafeKeySegment, presignR2Url } from '../../../_lib/r2-presign';

interface Env extends PoolEnv {
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
}
type Ctx = { request: Request; env: Env };

const BUCKET = 'photozseo-team-pool';
const UPLOAD_TTL = 900;

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const body = await ctx.request.json().catch(() => null) as
    { companyId?: string; projectId?: string; assetId?: string; ext?: string; modifiedAt?: string; snapshot?: unknown } | null;
  if (!body?.companyId || !body.projectId || !body.assetId || !body.ext || !body.modifiedAt || body.snapshot === undefined) {
    return json({ error: 'companyId, projectId, assetId, ext, modifiedAt, snapshot required' }, 400);
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireMembership(ctx.request, ctx.env, body.companyId, nowSec);
  if (auth instanceof Response) return auth;

  if (!isSafeKeySegment(body.projectId) || !isSafeKeySegment(body.assetId) || !isSafeKeySegment(body.ext)) {
    return json({ error: 'unsafe id/ext' }, 400);
  }
  if (!ctx.env.R2_ACCOUNT_ID || !ctx.env.R2_ACCESS_KEY_ID || !ctx.env.R2_SECRET_ACCESS_KEY) {
    return json({ error: 'R2 not configured' }, 503);
  }

  const r2Key = r2KeyForAsset(body.companyId, body.projectId, body.assetId, body.ext);

  await upsertAsset(ctx.env.MARKET_DB!, {
    companyId: body.companyId, projectId: body.projectId, assetId: body.assetId, r2Key, createdBy: auth.sub,
    modifiedAt: body.modifiedAt, snapshot: JSON.stringify(body.snapshot),
  });

  const uploadUrl = await presignR2Url(
    { accountId: ctx.env.R2_ACCOUNT_ID, accessKeyId: ctx.env.R2_ACCESS_KEY_ID, secretAccessKey: ctx.env.R2_SECRET_ACCESS_KEY, bucket: BUCKET },
    { method: 'PUT', key: r2Key, expiresSeconds: UPLOAD_TTL },
  );

  return json({ uploadUrl, r2Key });
}
```

- [ ] **Step 4: asset/[id] endpoint'ini yaz (download + tombstone)**

`functions/api/team/pool/asset/[id].ts`:

```ts
/**
 * /api/team/pool/asset/[id]?companyId=&projectId= — asset indir/sil.
 * GET    → { downloadUrl } presigned R2 GET (asset yoksa 404)
 * DELETE → tombstone (editAllProjects VEYA created_by===sub). 200 { ok }
 * 400 | 401 | 403 | 404 | 503
 */
import { requireMembership, type PoolEnv } from '../../../../_lib/pool-authz';
import { getAsset, tombstoneAsset } from '../../../../_lib/pool';
import { presignR2Url } from '../../../../_lib/r2-presign';
import { can } from '../../../../_lib/team';

interface Env extends PoolEnv {
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
}
type Ctx = { request: Request; env: Env; params: { id: string } };

const BUCKET = 'photozseo-team-pool';
const DOWNLOAD_TTL = 600;

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

function scope(request: Request): { companyId: string | null; projectId: string | null } {
  const u = new URL(request.url);
  return { companyId: u.searchParams.get('companyId'), projectId: u.searchParams.get('projectId') };
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const { companyId, projectId } = scope(ctx.request);
  if (!companyId || !projectId) return json({ error: 'companyId + projectId required' }, 400);
  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireMembership(ctx.request, ctx.env, companyId, nowSec);
  if (auth instanceof Response) return auth;

  const a = await getAsset(ctx.env.MARKET_DB!, companyId, projectId, ctx.params.id);
  if (!a) return json({ error: 'Not found' }, 404);
  if (!ctx.env.R2_ACCOUNT_ID || !ctx.env.R2_ACCESS_KEY_ID || !ctx.env.R2_SECRET_ACCESS_KEY) {
    return json({ error: 'R2 not configured' }, 503);
  }

  const downloadUrl = await presignR2Url(
    { accountId: ctx.env.R2_ACCOUNT_ID, accessKeyId: ctx.env.R2_ACCESS_KEY_ID, secretAccessKey: ctx.env.R2_SECRET_ACCESS_KEY, bucket: BUCKET },
    { method: 'GET', key: a.r2_key, expiresSeconds: DOWNLOAD_TTL },
  );
  return json({ downloadUrl, r2Key: a.r2_key });
}

export async function onRequestDelete(ctx: Ctx): Promise<Response> {
  const { companyId, projectId } = scope(ctx.request);
  if (!companyId || !projectId) return json({ error: 'companyId + projectId required' }, 400);
  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireMembership(ctx.request, ctx.env, companyId, nowSec);
  if (auth instanceof Response) return auth;

  const a = await getAsset(ctx.env.MARKET_DB!, companyId, projectId, ctx.params.id);
  if (!a) return json({ error: 'Not found' }, 404);
  if (!can(auth.role, 'editAllProjects') && a.created_by !== auth.sub) return json({ error: 'Forbidden' }, 403);

  const body = await ctx.request.json().catch(() => null) as { deletedAt?: string } | null;
  const deletedAt = body?.deletedAt ?? new Date().toISOString();
  await tombstoneAsset(ctx.env.MARKET_DB!, { companyId, projectId, assetId: ctx.params.id, deletedAt, modifiedAt: deletedAt });
  return json({ ok: true });
}
```

- [ ] **Step 5: Testleri çalıştır, geçtiğini gör**

Run: `npx vitest run functions/api/team/pool/upload-url.test.ts`
Beklenen: PASS (4 senaryo). (asset/[id] davranışı upload-url + pool testlerince dolaylı kapsanır; ayrı test dosyası gerekmez.)

- [ ] **Step 6: Commit**

```bash
git add functions/api/team/pool/upload-url.ts "functions/api/team/pool/asset/[id].ts" functions/api/team/pool/upload-url.test.ts
git commit -m "feat(pool): presigned upload-url + asset download/tombstone endpoints"
```

---

## Task 11: Tam suite + tip kontrolü + faz kapanışı

**Files:** (doğrulama)

- [ ] **Step 1: Tüm test suite**

Run: `npm test`
Beklenen: Tüm testler PASS (Faz 1 + Faz 2A pool/r2/authz/endpoint testleri + mevcut buyer/marketplace/store; regresyon yok).

- [ ] **Step 2: TypeScript tip kontrolü (yeni dosyalar)**

Run: `npx tsc --noEmit -p tsconfig.json`
Beklenen: `functions/_lib/pool*.ts`, `r2-presign.ts`, `functions/api/team/pool/**` dosyalarında hata yok. (Repoda önceden var olan `src/i18n/ui.ts` hataları bu fazın kapsamı dışındadır.)

- [ ] **Step 3: Manuel önkoşulları belgele (canlıya çıkış için — bu fazda kod değil)**

Aşağıdakiler deploy öncesi gereklidir, kullanıcı onayı/işlemi ister:
1. R2 bucket oluştur: `npx wrangler r2 bucket create photozseo-team-pool` (+ preview).
2. R2 S3 API token üret (Cloudflare dashboard → R2 → Manage API Tokens) → `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ACCOUNT_ID` Pages secret olarak ekle: `npx wrangler pages secret put R2_ACCESS_KEY_ID` (vb.).
3. R2 bucket CORS yapılandır (iOS doğrudan PUT/GET için): PUT/GET + `*` origin (veya app origin) izinleri.
4. Prod D1 migration: `npx wrangler d1 migrations apply MARKET_DB --remote` (0005 dahil).

- [ ] **Step 4: Faz kapanış commit'i (gerekiyorsa)**

```bash
git add docs/superpowers/plans/2026-06-08-team-shared-pool-faz2a-backend-sync.md
git commit -m "docs(pool): Faz 2A backend sync plan + completion"
```

---

## Sonraki fazlar (roadmap — bu planın parçası değil)

- **Faz 2B — iOS senkron istemcisi:** Core Data ↔ havuz; `SyncSnapshot` DTO'larını bu API'ye bağla; delta cursor saklama; offline kuyruğu; foto upload (presigned PUT) + indirme cache'i; **proje kişisel-vs-havuz kapsam kararı** (önerilen: per-project `companyID`, mahremiyet için). Mevcut `iCloudSyncService` ile bir arada çalışma.
- **Faz 3 — capability enforcement yayılımı:** `can()`'in export/publish/pricing uçlarında zorunlu kılınması + şirket ayarlarının çalışana salt-okunur akışı.
- **Faz 4 — iOS UI:** şirket kur/katıl, üye listesi, rol rozeti, "Hazır" işaretleme, Owner havuz/yayın ekranı.
- **Faz 5 — faturalandırma + koltuk yönetimi** (RevenueCat).

---

## Self-Review Notları

- **Spec coverage:** Delta-pull senkron (Task 8), proje upsert/get/tombstone LWW (Task 4/9), asset metadata + R2 presigned yükleme/indirme (Task 5/7/10), şirket izolasyonu + rol-farkında silme (Task 6/9/10) — Faz 2A tasarımının tümü karşılandı. iOS/kapsam-kararı bilinçle ertelendi (2B).
- **Tip tutarlılığı:** `ProjectRow`/`AssetRow`/`DeltaEntry` (`pool.ts`), `MemberCtx`/`PoolEnv` (`pool-authz.ts`), `R2Config` (`r2-presign.ts`) tek yerde; endpoint'ler import eder. Faz 1'den `resolveMember`/`getMembership`/`can`/`upsertMembership` yeniden kullanılır. Fonksiyon adları task'lar arası tutarlı: `upsertProject`, `getProject`, `projectsSince`, `tombstoneProject`, `upsertAsset`, `getAsset`, `listAssets`, `tombstoneAsset`, `requireMembership`, `r2KeyForAsset`, `isSafeKeySegment`, `presignR2Url`.
- **Çakışma modeli:** LWW `modified_at` SQL `WHERE excluded.modified_at >= ...` ile DB seviyesinde; fakeD1 aynı semantiği taklit eder (Task 3). created_by ilk yazanı korur → silme yetkisi için güvenilir sahiplik.
- **Güvenlik:** Her endpoint `requireMembership` ile şirket izolasyonu; `companyId` istemciden ama üyelik DB'den doğrulanır (başka şirkete erişim engelli). R2 anahtar segmentleri `isSafeKeySegment` ile path-traversal'a karşı doğrulanır. Presigned URL kısa TTL (PUT 900s / GET 600s).
- **Placeholder yok:** Tüm kod adımları tam. R2 credential üretimi kod değil manuel önkoşul (Task 11 Step 3) olarak işaretli.
- **Bağımlılık:** `aws4fetch` (Task 1). `upsertMembership` `team.ts`'den export (Faz 1'de tanımlı — test seed'inde kullanılıyor).
```
