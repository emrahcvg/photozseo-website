# Implementation Plan — Web Taksonomi API (Alt-proje #2)

**Tarih:** 2026-06-01
**Branch:** `feat/taxonomy-pipeline`
**Spec:** `docs/superpowers/specs/2026-06-01-2-taxonomy-api-design.md`
**Kilitli kararlar:** `docs/superpowers/specs/2026-06-01-resolved-decisions.md` (#2)

---

## Goal

Kanonik taksonomi verisini (`tree.json` ~5595 düğüm + 12 `labels.<lang>.json` + `meta.json`) düşük transfer maliyetiyle, çok dilli ve versiyonlanmış olarak sunan **salt-okunur, public** bir Cloudflare Pages Functions API'si. 5 endpoint: `meta`, `tree`, `labels/:lang`, `node/:id`, `search`. Veri **static import** ile bundle'lanır (KV yok), arama **Orama** per-lang lazy modül-global indeks ile yapılır, cache **ETag + `?v=` + `immutable`** ile yönetilir.

## Architecture

- **Veri kaynağı:** `src/storefront/taxonomy/{tree.json, labels.<lang>.json, meta.json}` — #1 pipeline çıktısı. Function'lar bunları `functions/_lib/taxonomy.ts` üzerinden **doğrudan import** eder (build'e bundle'lanır; runtime fetch/KV yok). `rates/[base].ts`'in KV-fetch deseni burada **kullanılmaz** — sadece JSON yanıt + cache header deseni taşınır.
- **Shared loader:** `functions/_lib/taxonomy.ts` tek veri-erişim noktası: `loadTree()`, `loadLabels(lang)`, `loadMeta()`, `resolveAncestors()`, `buildNode()`, `getTaxonomyOrama(lang, version)`, `taxonomyEtag()`, `json304()` / `jsonImmutable()`.
- **Saf mantık ↔ I/O ayrımı:** Tüm hesaplama (ancestor zinciri, node birleştirme, etag string, search doc kurulumu, lang fallback) **saf fonksiyon** + küçük fixture ile test edilir; JSON import'a bağlı entegrasyon adımları #1 çıktısını gerektirir (aşağıda **Dependency Note**).
- **Orama:** `functions/_lib/marketplace.ts`'teki `getOrama` deseni birebir taşınır; tek fark modül-global cache `Map<lang, { db, version }>` (dil-başına lazy, `taxonomyVersion` damgalı). `__resetTaxonomyOramaCache()` test-only reset.
- **Cache sözleşmesi:** `tree`/`labels`/`node`/`search` için ETag = `tax-<kind>-<lang?>-v<taxonomyVersion>`; `If-None-Match` eşleşince `304`. `Cache-Control: public, max-age=86400, immutable`. `meta` kısa cache (`max-age=300`, ETag yok). İstemci `?v=<taxonomyVersion>` ekleyebilir (sunucu yok sayar; sadece edge cache-key ayrıştırması için).

## Tech Stack

- **Runtime:** Cloudflare Pages Functions (Workers runtime), file-based routing `functions/api/taxonomy/...`.
- **Dil:** TypeScript (English code, Türkçe yorum).
- **Arama:** `@orama/orama` ^3.1.18 (mevcut dependency) — `create`, `insertMultiple`, `search`.
- **Test:** Vitest ^3.2.4 (`npx vitest run`). Yorum/test/değişken adları spec'teki dosyalarla aynı stil.
- **JSON import:** TypeScript `resolveJsonModule` (Astro/tsconfig'te zaten açık — entegrasyon adımında doğrulanır).

## File Structure

```
functions/
  _lib/
    taxonomy.ts            (YENİ) loader + ancestors + node + etag + orama helper
    taxonomy.test.ts       (YENİ) saf mantık birim testleri (fixture, JSON import yok)
  api/
    taxonomy/
      meta.ts              (YENİ) GET /api/taxonomy/meta
      tree.ts              (YENİ) GET /api/taxonomy/tree
      labels/
        [lang].ts          (YENİ) GET /api/taxonomy/labels/:lang
      node/
        [id].ts            (YENİ) GET /api/taxonomy/node/:id?lang=
      search.ts            (YENİ) GET /api/taxonomy/search?q=&lang=&limit=
      taxonomy-endpoints.test.ts  (YENİ) handler entegrasyon testleri (#1 verisi gerekir)
src/storefront/taxonomy/   (#1 ÇIKTISI — bu plan üretmez; entegrasyon için gerekli)
  tree.json
  labels.en.json … labels.ur.json
  meta.json
```

> **Dependency Note (#1):** `functions/_lib/taxonomy.ts`'in `loadTree/loadLabels/loadMeta` import'ları ve `taxonomy-endpoints.test.ts` ANCAK `npm run build:taxonomy` çalıştırılıp `src/storefront/taxonomy/*.json` üretildikten sonra geçer. **Saf mantık** (Task 1: ancestors, node, etag, lang fallback, orama doc — hepsi fixture ile) `tree.json` olmadan da yeşildir. Plandaki her entegrasyon adımı "**[#1 gerektirir]**" etiketlidir. #1 bitmemişse 4 fixture dosyasıyla geçici stub bırakılır (Task 2 notu); gerçek JSON gelince stub silinir, kod değişmez.

---

## Tasks

### Task 1 — `functions/_lib/taxonomy.ts` saf mantık çekirdeği (TDD)

Veriden bağımsız tüm saf fonksiyonlar: tipler, lang fallback, ancestor çözümü, node birleştirme, etag string, Orama doc kurulumu. Hiç JSON import yok → #1'siz test edilebilir.

**Files:**
- create `functions/_lib/taxonomy.ts`
- create `functions/_lib/taxonomy.test.ts`

**TDD — önce test (`functions/_lib/taxonomy.test.ts`):**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import {
  TAX_LANGS,
  resolveLang,
  resolveAncestors,
  buildNode,
  buildPathString,
  taxonomyEtag,
  buildTaxonomyOrama,
  searchTaxonomy,
  __resetTaxonomyOramaCache,
  type TaxNode,
} from './taxonomy';

const TREE: TaxNode[] = [
  { id: '1', parentId: null, depth: 0 },
  { id: '3', parentId: '1', depth: 1 },
  { id: '3237', parentId: '3', depth: 2 },
  { id: '99', parentId: null, depth: 0 },
];
const LABELS_EN: Record<string, string> = {
  '1': 'Animals & Pet Supplies', '3': 'Pet Supplies', '3237': 'Bird Cages', '99': 'Furniture',
};
const LABELS_TR: Record<string, string> = {
  '1': 'Hayvanlar', '3': 'Evcil Hayvan', '3237': 'Kuş Kafesleri', '99': 'Mobilya',
};

describe('resolveLang', () => {
  it('geçerli dili aynen döndürür', () => {
    expect(resolveLang('tr')).toBe('tr');
  });
  it('bilinmeyen/eksik dili en e düşürür', () => {
    expect(resolveLang('xx')).toBe('en');
    expect(resolveLang(undefined)).toBe('en');
  });
  it('TAX_LANGS spec sırasını korur', () => {
    expect(TAX_LANGS).toEqual(['en','tr','de','es','pt','ja','ko','zh','ar','fa','hi','ur']);
  });
});

describe('resolveAncestors', () => {
  it('kökten düğüme ata zincirini (düğüm dahil) döndürür', () => {
    expect(resolveAncestors(TREE, '3237').map((n) => n.id)).toEqual(['1', '3', '3237']);
  });
  it('kök düğümde sadece kendisini döndürür', () => {
    expect(resolveAncestors(TREE, '1').map((n) => n.id)).toEqual(['1']);
  });
  it('bilinmeyen id de boş dizi döndürür', () => {
    expect(resolveAncestors(TREE, 'zzz')).toEqual([]);
  });
});

describe('buildNode', () => {
  it('node yanıtını label + path + childIds ile kurar', () => {
    const node = buildNode(TREE, LABELS_TR, '3');
    expect(node).toEqual({
      id: '3',
      depth: 1,
      label: 'Evcil Hayvan',
      path: [
        { id: '1', label: 'Hayvanlar' },
        { id: '3', label: 'Evcil Hayvan' },
      ],
      childIds: ['3237'],
    });
  });
  it('bilinmeyen id de null döndürür', () => {
    expect(buildNode(TREE, LABELS_TR, 'zzz')).toBeNull();
  });
});

describe('buildPathString', () => {
  it('ata label larını > ile birleştirir', () => {
    expect(buildPathString(TREE, LABELS_EN, '3237')).toBe('Animals & Pet Supplies > Pet Supplies > Bird Cages');
  });
});

describe('taxonomyEtag', () => {
  it('tree için lang siz etag üretir', () => {
    expect(taxonomyEtag('tree', undefined, 7)).toBe('"tax-tree-v7"');
  });
  it('labels için lang li etag üretir', () => {
    expect(taxonomyEtag('labels', 'tr', 7)).toBe('"tax-labels-tr-v7"');
  });
});

describe('searchTaxonomy (Orama)', () => {
  beforeEach(() => __resetTaxonomyOramaCache());

  it('dile göre etiketle eşleşir ve path döndürür', async () => {
    const idx = await buildTaxonomyOrama('tr', TREE, LABELS_TR, 7);
    const res = await searchTaxonomy(idx, 'kuş', 10);
    expect(res[0].id).toBe('3237');
    expect(res[0].label).toBe('Kuş Kafesleri');
    expect(res[0].path).toBe('Hayvanlar > Evcil Hayvan > Kuş Kafesleri');
    expect(res[0].depth).toBe(2);
    expect(typeof res[0].score).toBe('number');
  });

  it('limit i uygular', async () => {
    const idx = await buildTaxonomyOrama('en', TREE, LABELS_EN, 7);
    const res = await searchTaxonomy(idx, 'supplies', 1);
    expect(res.length).toBeLessThanOrEqual(1);
  });

  it('version damgasını indexte taşır', async () => {
    const idx = await buildTaxonomyOrama('en', TREE, LABELS_EN, 7);
    expect(idx.version).toBe(7);
    expect(idx.lang).toBe('en');
  });
});
```

**TDD — sonra implementasyon (`functions/_lib/taxonomy.ts`):**

```ts
/**
 * taxonomy.ts — Web Taksonomi API veri çekirdeği (#2).
 *
 * Sorumluluk:
 *   - tree/labels/meta verisine tek erişim noktası (static import; KV yok).
 *   - Ata (breadcrumb) zinciri + node birleştirme + insan-okunur path (saf).
 *   - ETag string + 304/immutable JSON yanıt yardımcıları.
 *   - Orama per-lang lazy, version-damgalı modül-global indeks (marketplace.ts deseni).
 *
 * Saf fonksiyonlar fixture ile test edilir; load* fonksiyonları #1 JSON çıktısını import eder.
 */

import { create, insertMultiple, search, type Orama } from '@orama/orama';

// ── Tipler ─────────────────────────────────────────────────────────────────────

export interface TaxNode {
  id: string;
  parentId: string | null;
  depth: number;
}

export interface TaxMeta {
  googleVersion: string;
  taxonomyVersion: number;
  generatedAt: string;
  nodeCount: number;
  langs: string[];
}

export interface NodePathItem { id: string; label: string; }

export interface NodeResponse {
  id: string;
  depth: number;
  label: string;
  path: NodePathItem[];
  childIds: string[];
}

export interface SearchResult {
  id: string;
  label: string;
  path: string;
  depth: number;
  score: number;
}

type TaxSchema = { id: 'string'; label: 'string'; path: 'string'; depth: 'number' };
export interface TaxonomyOrama {
  db: Orama<TaxSchema>;
  version: number;
  lang: string;
}

// ── Dil ──────────────────────────────────────────────────────────────────────

// Spec meta.langs sırası (sabit; meta.json langs ile aynı olmalı).
export const TAX_LANGS = ['en', 'tr', 'de', 'es', 'pt', 'ja', 'ko', 'zh', 'ar', 'fa', 'hi', 'ur'] as const;
const DEFAULT_LANG = 'en';

/** Bilinmeyen/eksik lang → en fallback (404 yok; UI bozulmasın). */
export function resolveLang(lang: string | undefined | null): string {
  return lang && (TAX_LANGS as readonly string[]).includes(lang) ? lang : DEFAULT_LANG;
}

// ── Saf ağaç mantığı ────────────────────────────────────────────────────────

/** Kökten id ye kadar ata zinciri (düğüm dahil). Bilinmeyen id → []. */
export function resolveAncestors(tree: TaxNode[], id: string): TaxNode[] {
  const byId = new Map(tree.map((n) => [n.id, n]));
  const chain: TaxNode[] = [];
  let cur = byId.get(id) ?? null;
  const guard = new Set<string>(); // döngü koruması
  while (cur && !guard.has(cur.id)) {
    chain.push(cur);
    guard.add(cur.id);
    cur = cur.parentId ? byId.get(cur.parentId) ?? null : null;
  }
  return chain.reverse();
}

/** node yanıtı: label + breadcrumb path + childIds. Bilinmeyen id → null. */
export function buildNode(tree: TaxNode[], labels: Record<string, string>, id: string): NodeResponse | null {
  const byId = new Map(tree.map((n) => [n.id, n]));
  const self = byId.get(id);
  if (!self) return null;
  const path = resolveAncestors(tree, id).map((n) => ({ id: n.id, label: labels[n.id] ?? n.id }));
  const childIds = tree.filter((n) => n.parentId === id).map((n) => n.id);
  return { id, depth: self.depth, label: labels[id] ?? id, path, childIds };
}

/** Ata label larını " > " ile birleştirilmiş insan-okunur tam yol. */
export function buildPathString(tree: TaxNode[], labels: Record<string, string>, id: string): string {
  return resolveAncestors(tree, id).map((n) => labels[n.id] ?? n.id).join(' > ');
}

// ── ETag + yanıt yardımcıları ──────────────────────────────────────────────

type EtagKind = 'tree' | 'labels' | 'node' | 'search';

/** ETag = "tax-<kind>-<lang?>-v<version>" (çift tırnaklı, HTTP ETag formatı). */
export function taxonomyEtag(kind: EtagKind, lang: string | undefined, version: number): string {
  const langPart = lang ? `-${lang}` : '';
  return `"tax-${kind}${langPart}-v${version}"`;
}

const IMMUTABLE_CACHE = 'public, max-age=86400, immutable';

/** If-None-Match eşleşirse 304, yoksa immutable JSON. */
export function jsonImmutable(body: unknown, etag: string, ifNoneMatch: string | null): Response {
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { etag, 'cache-control': IMMUTABLE_CACHE } });
  }
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8', etag, 'cache-control': IMMUTABLE_CACHE },
  });
}

/** Kısa-cache JSON (meta için; ETag yok). */
export function jsonShort(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': status === 200 ? 'public, max-age=300' : 'no-store' },
  });
}

/** Hata yanıtı (no-store). */
export function jsonError(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

// ── Orama (per-lang lazy modül-global, version damgalı) ───────────────────────

const _oramaCache = new Map<string, TaxonomyOrama>();

/** Verili tree+labels ten o dilin Orama indeksini kurar (saf; cache yazmaz). */
export async function buildTaxonomyOrama(
  lang: string,
  tree: TaxNode[],
  labels: Record<string, string>,
  version: number,
): Promise<TaxonomyOrama> {
  const db = create({
    schema: { id: 'string', label: 'string', path: 'string', depth: 'number' },
  }) as TaxonomyOrama['db'];
  const docs = tree.map((n) => ({
    id: n.id,
    label: labels[n.id] ?? n.id,
    path: buildPathString(tree, labels, n.id),
    depth: n.depth,
  }));
  if (docs.length > 0) await insertMultiple(db, docs);
  return { db, version, lang };
}

/** Orama sonuçlarını SearchResult e map ler. */
export async function searchTaxonomy(idx: TaxonomyOrama, term: string, limit: number): Promise<SearchResult[]> {
  const res = await search(idx.db, { term, limit });
  return res.hits.map((h) => ({
    id: String(h.document.id),
    label: String(h.document.label),
    path: String(h.document.path),
    depth: Number(h.document.depth),
    score: h.score,
  }));
}

/** Test-only: per-lang Orama cache i sıfırla. */
export function __resetTaxonomyOramaCache(): void {
  _oramaCache.clear();
}

// ── Veri erişimi (#1 JSON static import) — Task 2 de eklenir ──────────────────
// loadTree / loadLabels / loadMeta / getTaxonomyOrama burada implemente edilir.
```

**Run + beklenen çıktı:**

```
npx vitest run functions/_lib/taxonomy.test.ts
```
Beklenen: `Test Files  1 passed (1)` / `Tests  ~12 passed`. `resolveAncestors`, `buildNode`, `buildPathString`, `taxonomyEtag`, `resolveLang`, `searchTaxonomy` yeşil. JSON import yok → #1 gerekmez.

**Commit:** `feat(taxonomy-api): pure core — ancestors, node, etag, orama search helpers`

---

### Task 2 — Veri erişim katmanı: static import loader [#1 gerektirir]

`load*` fonksiyonları + per-lang cache'li `getTaxonomyOrama`. #1'in `src/storefront/taxonomy/*.json` çıktısını import eder.

**Files:**
- modify `functions/_lib/taxonomy.ts` (alt bölüme `load*` + `getTaxonomyOrama` ekle)
- modify `tsconfig.json` (yalnızca `resolveJsonModule` kapalıysa — doğrula, açıksa dokunma)

> **[#1 gerektirir]** Bu task tamamlanmadan önce `npm run build:taxonomy` çalıştırılıp `src/storefront/taxonomy/tree.json`, `labels.en.json … labels.ur.json`, `meta.json` üretilmiş olmalı. Üretilmemişse adım bloke; #1 throttled çeviriyle devam ediyor (resolved-decisions §Bağımlılık 1). Geçici unblock için min 4-satırlık fixture JSON elle konulabilir, ama gerçek çıktı gelince silinir — **kod değişmez** (loader şekli aynı).

**Implementasyon (`functions/_lib/taxonomy.ts` ekleri):**

```ts
// ── Veri erişimi (#1 JSON çıktısı static import; KV yok, runtime fetch yok) ────
import treeJson from '../../src/storefront/taxonomy/tree.json';
import metaJson from '../../src/storefront/taxonomy/meta.json';
import labelsEn from '../../src/storefront/taxonomy/labels.en.json';
import labelsTr from '../../src/storefront/taxonomy/labels.tr.json';
import labelsDe from '../../src/storefront/taxonomy/labels.de.json';
import labelsEs from '../../src/storefront/taxonomy/labels.es.json';
import labelsPt from '../../src/storefront/taxonomy/labels.pt.json';
import labelsJa from '../../src/storefront/taxonomy/labels.ja.json';
import labelsKo from '../../src/storefront/taxonomy/labels.ko.json';
import labelsZh from '../../src/storefront/taxonomy/labels.zh.json';
import labelsAr from '../../src/storefront/taxonomy/labels.ar.json';
import labelsFa from '../../src/storefront/taxonomy/labels.fa.json';
import labelsHi from '../../src/storefront/taxonomy/labels.hi.json';
import labelsUr from '../../src/storefront/taxonomy/labels.ur.json';

const LABELS_BY_LANG: Record<string, Record<string, string>> = {
  en: labelsEn, tr: labelsTr, de: labelsDe, es: labelsEs, pt: labelsPt, ja: labelsJa,
  ko: labelsKo, zh: labelsZh, ar: labelsAr, fa: labelsFa, hi: labelsHi, ur: labelsUr,
};

export function loadTree(): TaxNode[] {
  return treeJson as TaxNode[];
}

/** lang fallback uygulanmış label haritası. */
export function loadLabels(lang: string): Record<string, string> {
  return LABELS_BY_LANG[resolveLang(lang)];
}

export function loadMeta(): TaxMeta {
  const m = metaJson as { googleVersion: string; taxonomyVersion: number; generatedAt: string };
  const tree = loadTree();
  return { ...m, nodeCount: tree.length, langs: [...TAX_LANGS] };
}

/** marketplace.ts getOrama deseni: per-lang lazy, taxonomyVersion damgalı cache. */
export async function getTaxonomyOrama(lang: string): Promise<TaxonomyOrama> {
  const resolved = resolveLang(lang);
  const version = loadMeta().taxonomyVersion;
  const cached = _oramaCache.get(resolved);
  if (cached && cached.version === version) return cached;
  const idx = await buildTaxonomyOrama(resolved, loadTree(), loadLabels(resolved), version);
  _oramaCache.set(resolved, idx);
  return idx;
}
```

**Run + beklenen çıktı:**

```
npx tsc --noEmit
npx vitest run functions/_lib/taxonomy.test.ts
```
Beklenen: `tsc` hata yok (JSON import tip-çözümlü), vitest hâlâ yeşil. `resolveJsonModule` zaten açık (Astro varsayılanı) — kapalıysa `tsconfig.json compilerOptions` içine `"resolveJsonModule": true` eklenir.

**Commit:** `feat(taxonomy-api): static-import data loader + per-lang lazy orama cache`

---

### Task 3 — `meta` + `tree` endpoint'leri [#1 gerektirir]

**Files:**
- create `functions/api/taxonomy/meta.ts`
- create `functions/api/taxonomy/tree.ts`
- create `functions/api/taxonomy/taxonomy-endpoints.test.ts`

**TDD — önce test (`taxonomy-endpoints.test.ts`, meta+tree kısmı):**

```ts
import { describe, it, expect } from 'vitest';
import { onRequestGet as metaGet } from './meta';
import { onRequestGet as treeGet } from './tree';
import { loadMeta } from '../../_lib/taxonomy';

function ctx(url: string, headers: Record<string, string> = {}, params: Record<string, string> = {}) {
  return { request: new Request(url, { headers }), params, env: {} } as any;
}

describe('GET /api/taxonomy/meta', () => {
  it('200 + googleVersion/taxonomyVersion/nodeCount/langs döndürür', async () => {
    const res = await metaGet(ctx('https://x/api/taxonomy/meta'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.taxonomyVersion).toBe(loadMeta().taxonomyVersion);
    expect(body.nodeCount).toBeGreaterThan(0);
    expect(body.langs).toContain('tr');
    expect(res.headers.get('cache-control')).toContain('max-age=300');
  });
});

describe('GET /api/taxonomy/tree', () => {
  it('200 + düğüm dizisi + immutable etag döndürür', async () => {
    const res = await treeGet(ctx('https://x/api/taxonomy/tree'));
    expect(res.status).toBe(200);
    const v = loadMeta().taxonomyVersion;
    expect(res.headers.get('etag')).toBe(`"tax-tree-v${v}"`);
    expect(res.headers.get('cache-control')).toContain('immutable');
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toHaveProperty('parentId');
  });

  it('If-None-Match eşleşince 304 döndürür', async () => {
    const v = loadMeta().taxonomyVersion;
    const res = await treeGet(ctx('https://x/api/taxonomy/tree', { 'if-none-match': `"tax-tree-v${v}"` }));
    expect(res.status).toBe(304);
  });
});
```

**TDD — implementasyon:**

`functions/api/taxonomy/meta.ts`:
```ts
import { loadMeta, jsonShort } from '../../_lib/taxonomy';

export const onRequestGet: PagesFunction = async () => {
  return jsonShort(loadMeta());
};
```

`functions/api/taxonomy/tree.ts`:
```ts
import { loadTree, loadMeta, taxonomyEtag, jsonImmutable } from '../../_lib/taxonomy';

export const onRequestGet: PagesFunction = async (ctx) => {
  const version = loadMeta().taxonomyVersion;
  const etag = taxonomyEtag('tree', undefined, version);
  return jsonImmutable(loadTree(), etag, ctx.request.headers.get('if-none-match'));
};
```

**Run + beklenen çıktı:**
```
npx vitest run functions/api/taxonomy/taxonomy-endpoints.test.ts
```
Beklenen: meta + tree blokları yeşil (4 test). `tree` 200/304 ikisi de geçer.

**Commit:** `feat(taxonomy-api): meta + tree endpoints with etag/304`

---

### Task 4 — `labels/:lang` endpoint'i [#1 gerektirir]

**Files:**
- create `functions/api/taxonomy/labels/[lang].ts`
- modify `functions/api/taxonomy/taxonomy-endpoints.test.ts` (labels bloğu ekle)

**TDD — test ekle:**
```ts
import { onRequestGet as labelsGet } from './labels/[lang]';

describe('GET /api/taxonomy/labels/:lang', () => {
  it('geçerli dilde id→label haritası + lang li etag döndürür', async () => {
    const res = await labelsGet(ctx('https://x/api/taxonomy/labels/tr', {}, { lang: 'tr' }));
    expect(res.status).toBe(200);
    const v = loadMeta().taxonomyVersion;
    expect(res.headers.get('etag')).toBe(`"tax-labels-tr-v${v}"`);
    const body = await res.json();
    expect(Object.keys(body).length).toBeGreaterThan(0);
  });

  it('bilinmeyen dil için en fallback eder (etag en)', async () => {
    const res = await labelsGet(ctx('https://x/api/taxonomy/labels/xx', {}, { lang: 'xx' }));
    expect(res.status).toBe(200);
    const v = loadMeta().taxonomyVersion;
    expect(res.headers.get('etag')).toBe(`"tax-labels-en-v${v}"`);
  });
});
```

**TDD — implementasyon (`labels/[lang].ts`):**
```ts
import { loadLabels, loadMeta, resolveLang, taxonomyEtag, jsonImmutable } from '../../../_lib/taxonomy';

export const onRequestGet: PagesFunction = async (ctx) => {
  const raw = (Array.isArray(ctx.params.lang) ? ctx.params.lang[0] : ctx.params.lang) ?? '';
  const lang = resolveLang(raw);
  const version = loadMeta().taxonomyVersion;
  const etag = taxonomyEtag('labels', lang, version);
  return jsonImmutable(loadLabels(lang), etag, ctx.request.headers.get('if-none-match'));
};
```

**Run + beklenen çıktı:**
```
npx vitest run functions/api/taxonomy/taxonomy-endpoints.test.ts
```
Beklenen: labels 2 testi yeşil (fallback etag `tax-labels-en-v<N>`).

**Commit:** `feat(taxonomy-api): labels/:lang endpoint with en fallback`

---

### Task 5 — `node/:id` endpoint'i [#1 gerektirir]

**Files:**
- create `functions/api/taxonomy/node/[id].ts`
- modify `functions/api/taxonomy/taxonomy-endpoints.test.ts` (node bloğu)

**TDD — test ekle:**
```ts
import { onRequestGet as nodeGet } from './node/[id]';

describe('GET /api/taxonomy/node/:id', () => {
  it('geçerli id için label+path+childIds döndürür', async () => {
    const tree = (await (await treeGet(ctx('https://x/api/taxonomy/tree'))).json()) as any[];
    const leaf = tree.find((n) => n.depth >= 1) ?? tree[0];
    const res = await nodeGet(ctx(`https://x/api/taxonomy/node/${leaf.id}?lang=tr`, {}, { id: leaf.id }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(leaf.id);
    expect(Array.isArray(body.path)).toBe(true);
    expect(body.path[body.path.length - 1].id).toBe(leaf.id);
  });

  it('bilinmeyen id için 404 + error/id döndürür', async () => {
    const res = await nodeGet(ctx('https://x/api/taxonomy/node/zzz', {}, { id: 'zzz' }));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toEqual({ error: 'Unknown node', id: 'zzz' });
  });

  it('lang verilmezse en e düşer (path label ları en)', async () => {
    const tree = (await (await treeGet(ctx('https://x/api/taxonomy/tree'))).json()) as any[];
    const root = tree.find((n) => n.depth === 0);
    const res = await nodeGet(ctx(`https://x/api/taxonomy/node/${root.id}`, {}, { id: root.id }));
    expect(res.status).toBe(200);
  });
});
```

**TDD — implementasyon (`node/[id].ts`):**
```ts
import { loadTree, loadLabels, loadMeta, resolveLang, buildNode, taxonomyEtag, jsonImmutable, jsonError } from '../../../_lib/taxonomy';

export const onRequestGet: PagesFunction = async (ctx) => {
  const id = (Array.isArray(ctx.params.id) ? ctx.params.id[0] : ctx.params.id) ?? '';
  const url = new URL(ctx.request.url);
  const lang = resolveLang(url.searchParams.get('lang'));
  const node = buildNode(loadTree(), loadLabels(lang), id);
  if (!node) return jsonError({ error: 'Unknown node', id }, 404);
  const etag = taxonomyEtag('node', lang, loadMeta().taxonomyVersion) + `"${id}"`.slice(0); // not: node etag id duyarlı değil; immutable cache yeterli
  return jsonImmutable(node, taxonomyEtag('node', lang, loadMeta().taxonomyVersion), ctx.request.headers.get('if-none-match'));
};
```
> Not: `node` yanıtı `id`+`lang`+`version` kombinasyonuna bağlıdır; ETag id'ye duyarlı olmadığından (URL path zaten id'yi ayırır) edge cache key URL'dir. `If-None-Match` tek-id sayfalarda 304 üretmez ama immutable cache transferi azaltır. (Spec: node "küçük yanıt, kolaylık" — agresif 304 zorunlu değil.) İlk satırdaki kullanılmayan `etag` değişkeni implementasyonda silinir; yalnızca anlatım için bırakıldı.

Temiz hali:
```ts
  if (!node) return jsonError({ error: 'Unknown node', id }, 404);
  const etag = taxonomyEtag('node', lang, loadMeta().taxonomyVersion);
  return jsonImmutable(node, etag, ctx.request.headers.get('if-none-match'));
```

**Run + beklenen çıktı:**
```
npx vitest run functions/api/taxonomy/taxonomy-endpoints.test.ts
```
Beklenen: node 3 testi yeşil (200 path, 404 unknown, en fallback).

**Commit:** `feat(taxonomy-api): node/:id endpoint with ancestor breadcrumb`

---

### Task 6 — `search` endpoint'i [#1 gerektirir]

**Files:**
- create `functions/api/taxonomy/search.ts`
- modify `functions/api/taxonomy/taxonomy-endpoints.test.ts` (search bloğu)

**TDD — test ekle:**
```ts
import { onRequestGet as searchGet } from './search';
import { __resetTaxonomyOramaCache } from '../../_lib/taxonomy';

describe('GET /api/taxonomy/search', () => {
  it('q boşsa 400 q required döndürür', async () => {
    const res = await searchGet(ctx('https://x/api/taxonomy/search?lang=tr'));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'q required' });
  });

  it('q + lang ile sonuç döndürür (query/lang/results şekli)', async () => {
    __resetTaxonomyOramaCache();
    const res = await searchGet(ctx('https://x/api/taxonomy/search?q=cage&lang=en&limit=5'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.query).toBe('cage');
    expect(body.lang).toBe('en');
    expect(Array.isArray(body.results)).toBe(true);
    if (body.results.length) {
      expect(body.results[0]).toHaveProperty('path');
      expect(body.results[0]).toHaveProperty('score');
    }
  });

  it('limit i 25 e sınırlar, default 10', async () => {
    const res = await searchGet(ctx('https://x/api/taxonomy/search?q=a&limit=999'));
    const body = await res.json();
    expect(body.results.length).toBeLessThanOrEqual(25);
  });

  it('bilinmeyen lang → en fallback (lang en raporlanır)', async () => {
    const res = await searchGet(ctx('https://x/api/taxonomy/search?q=cage&lang=xx'));
    const body = await res.json();
    expect(body.lang).toBe('en');
  });
});
```

**TDD — implementasyon (`search.ts`):**
```ts
import { getTaxonomyOrama, searchTaxonomy, resolveLang, jsonError, jsonShort } from '../../_lib/taxonomy';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 25;

export const onRequestGet: PagesFunction = async (ctx) => {
  const url = new URL(ctx.request.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  if (!q) return jsonError({ error: 'q required' }, 400);

  const lang = resolveLang(url.searchParams.get('lang'));
  const rawLimit = Number(url.searchParams.get('limit'));
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, MAX_LIMIT) : DEFAULT_LIMIT;

  const idx = await getTaxonomyOrama(lang);
  const results = await searchTaxonomy(idx, q, limit);
  return jsonShort({ query: q, lang, results });
};
```
> Not: `search` sonuçları dinamik (q'ya bağlı) → `meta` gibi kısa cache (`max-age=300`), immutable değil.

**Run + beklenen çıktı:**
```
npx vitest run functions/api/taxonomy/taxonomy-endpoints.test.ts
```
Beklenen: search 4 testi yeşil (400 q, sonuç şekli, limit clamp, en fallback).

**Commit:** `feat(taxonomy-api): search endpoint (orama per-lang) with q/limit guards`

---

### Task 7 — Tam suite + tip kontrolü + final doğrulama [#1 gerektirir]

**Files:** (kod değişikliği yok — yalnızca doğrulama; gerekirse ufak düzeltme)

**Run + beklenen çıktı:**
```
npx tsc --noEmit
npx vitest run
```
Beklenen: `tsc` 0 hata; tüm suite yeşil (Task 1 saf testleri + endpoint testleri + mevcut taxonomy-build/marketplace testleri etkilenmemiş). Bundle boyut izleme notu: `npx wrangler pages functions build` (opsiyonel) ile 12 label JSON'ın bundle'a girdiği teyit edilir; Pages Functions limiti içinde kalmalı (spec §payload).

**Commit:** `test(taxonomy-api): full suite green + tsc clean`

---

## Self-Review

### Spec coverage (5 endpoint + sözleşme)
- **meta** → Task 3: `googleVersion/taxonomyVersion/generatedAt/nodeCount/langs`, `max-age=300`. ✔
- **tree** → Task 3: label'sız düğüm dizisi, `tax-tree-v<N>`, immutable, 304. ✔
- **labels/:lang** → Task 4: id→label haritası, `tax-labels-<lang>-v<N>`, immutable, **en fallback** (404 değil). ✔
- **node/:id?lang** → Task 5: `id/depth/label/path[]/childIds`, 404 `{error,id}`, lang default en. ✔
- **search?q&lang&limit** → Task 6: `{query,lang,results[{id,label,path,depth,score}]}`, q boş→400, limit default 10/max 25, en fallback. ✔
- **Kilitli kararlar (#2):** static import (KV yok) ✔ | node/:id var ✔ | Orama per-lang lazy modül-global, version damgalı ✔ | ETag `tax-<kind>-<lang?>-v<version>` + `?v=` busting + immutable ✔ | public (auth.ts kullanılmaz) ✔ | endpoint seti tam ✔.
- **Lokalizasyon:** yalnızca dil-seçimi fallback (id-bazlı fallback yok, #1 tüm id kapsar garantisi) ✔. node/search label'ları tek lang ✔.
- **Arama:** Orama şema `{id,label,path,depth}`, sorgu çevirisi YOK, per-lang ayrı indeks ✔.

### Placeholder scan
- TBD/FIXME/`...` yer tutucu **yok**. Task 5'teki açıklama notu dışındaki tüm kod gerçek + çalışır; node etag'in "temiz hali" açıkça verildi (anlatım satırı silinir).
- Tek dış bağımlılık: **#1 çıktısı** — her entegrasyon task'ı **[#1 gerektirir]** etiketli; Task 1 (saf çekirdek) #1'siz yeşil.

### Type consistency
- `TaxNode {id;parentId;depth}` = #1 `TreeNode` (taxonomy-build/types.ts) ile birebir. ✔
- `TaxMeta` = `meta.json` (`googleVersion/taxonomyVersion/generatedAt`) + türetilen `nodeCount/langs`; spec meta yanıtıyla uyumlu. ✔
- `taxonomyVersion: number` → `ManifestMeta.taxonomyVersion?: number` (types.ts) ile aynı tip. ✔
- `TAX_LANGS` sırası = `ALL_LANGS` (locales.ts) = spec `meta.langs` = `["en","tr","de","es","pt","ja","ko","zh","ar","fa","hi","ur"]`. ✔
- Orama doc/şema = `marketplace.ts` deseni (`create/insertMultiple/search`, `as Orama<...>` cast), cache `Map<lang,...>` + `__resetTaxonomyOramaCache` test-reset. ✔

### Dependency caveats
- **#1 build:taxonomy zorunlu** (Task 2–7). `src/storefront/taxonomy/*.json` henüz repo'da yok (doğrulandı). #1 throttled çeviriyle devam ediyor.
- `resolveJsonModule` doğrulanmalı (Task 2); kapalıysa tek satır tsconfig düzeltmesi.
- Bundle boyutu (12 label JSON, birkaç MB) Pages Functions limiti içinde izlenmeli (Task 7 notu); aşılırsa resolved-decisions taban kararı gereği yine static import kalır, gerekirse label'lar tek birleşik dosyaya/edge-asset'e taşınır (kapsam dışı, ayrı iterasyon).
