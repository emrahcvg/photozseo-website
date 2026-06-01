# Taksonomi Veri Pipeline'ı — Implementasyon Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Google Product Taxonomy'yi indirip parse eden, 12 dilde label üreten (eksik dilleri translation-swarm ile çeviren), versiyonlanmış kanonik JSON çıktısı veren delta-aware bir build pipeline'ı kurmak.

**Architecture:** Saf TS modülleri (parse → tree → label) vitest ile TDD edilir; bir Node ESM orchestrator (`scripts/build-taxonomy.mjs`) bunları indirme + dosya yazma ile birleştirir. Google'da olmayan diller için mevcut `translation-swarm/translator.py`'yi yeniden kullanan küçük bir `translate_map.py` CLI çağrılır. Numeric ID kanonik anahtardır.

**Tech Stack:** TypeScript, Node 22 ESM, vitest, Astro repo; Python 3 (deep_translator, mevcut translation-swarm).

---

## File Structure

```
src/storefront/taxonomy-build/
  types.ts            # Tüm pipeline tipleri (RawEntry, TreeNode, BuildResult)
  parse.ts            # Google .txt → { version, entries }   (saf, test edilir)
  parse.test.ts
  tree.ts             # entries → TreeNode[]                 (saf, test edilir)
  tree.test.ts
  labels.ts           # entries → { id: yaprakLabel }        (saf, test edilir)
  labels.test.ts
  locales.ts          # website-lang → Google-locale | null haritası
  cache.ts            # delta cache: id+enHash karşılaştırması (saf, test edilir)
  cache.test.ts
  fixtures/
    sample-en.txt     # küçük gerçek-format örnek
    sample-de.txt

src/storefront/taxonomy/        # ÜRETİLEN çıktı (build sonucu)
  tree.json
  labels.<lang>.json  (12 dosya)
  meta.json
  .cache/labels.<lang>.cache.json

scripts/build-taxonomy.mjs      # orchestrator (indir + birleştir + yaz)

~/Desktop/translation-swarm/
  translate_map.py    # YENİ: {id:en} → {id:çeviri} CLI; translator.py reuse
```

**Diller (website):** `en, tr, de, es, pt, ja, ko, zh, ar, fa, hi, ur`
**Google'da hazır beklenen:** tr, de, es, pt(→pt-BR), ja, ko, zh(→zh-CN) + en kaynak.
**Her zaman çevrilecek (Google'da yok):** ar, fa, hi, ur. Ek olarak: Google locale'i fetch'te 404 verirse o dil de çeviriye düşer.

---

### Task 1: Tip tanımları

**Files:**
- Create: `src/storefront/taxonomy-build/types.ts`

- [ ] **Step 1: Tipleri yaz**

```typescript
// Google .txt'nin tek satırından parse edilen ham giriş.
export interface RawEntry {
  id: string;        // numeric kategori ID, string olarak (örn. "212")
  path: string[];    // ["Apparel & Accessories", "Clothing", "Shirts & Tops"]
}

// Kanonik ağaç düğümü (dil-bağımsız).
export interface TreeNode {
  id: string;
  parentId: string | null;  // kök düğümlerde null
  depth: number;            // kök = 0
}

// Bir build çalışmasının tam çıktısı.
export interface BuildResult {
  tree: TreeNode[];
  labels: Record<string, Record<string, string>>; // lang -> (id -> yaprak label)
  meta: { googleVersion: string; taxonomyVersion: number; generatedAt: string };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/storefront/taxonomy-build/types.ts
git commit -m "feat(taxonomy): pipeline tip tanımları"
```

---

### Task 2: Parser (`parse.ts`)

**Files:**
- Create: `src/storefront/taxonomy-build/fixtures/sample-en.txt`
- Create: `src/storefront/taxonomy-build/parse.test.ts`
- Create: `src/storefront/taxonomy-build/parse.ts`

- [ ] **Step 1: Fixture dosyasını oluştur**

`src/storefront/taxonomy-build/fixtures/sample-en.txt` (gerçek Google formatı, başlık dahil):

```
# Google_Product_Taxonomy_Version: 2026-03-15
1 - Animals & Pet Supplies
3237 - Animals & Pet Supplies > Live Animals
2 - Animals & Pet Supplies > Pet Supplies
3 - Animals & Pet Supplies > Pet Supplies > Bird Supplies
166 - Apparel & Accessories
1604 - Apparel & Accessories > Clothing
212 - Apparel & Accessories > Clothing > Shirts & Tops
```

- [ ] **Step 2: Failing test yaz**

`src/storefront/taxonomy-build/parse.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from './parse';

const sample = readFileSync(
  fileURLToPath(new URL('./fixtures/sample-en.txt', import.meta.url)),
  'utf-8',
);

describe('parse', () => {
  it('versiyon başlığını okur', () => {
    expect(parse(sample).version).toBe('2026-03-15');
  });

  it('her veri satırını id + path dizisine ayırır', () => {
    const { entries } = parse(sample);
    expect(entries).toContainEqual({
      id: '212',
      path: ['Apparel & Accessories', 'Clothing', 'Shirts & Tops'],
    });
  });

  it('başlık ve boş satırları atlar', () => {
    const { entries } = parse(sample);
    expect(entries).toHaveLength(7);
    expect(entries.every((e) => e.id && e.path.length > 0)).toBe(true);
  });

  it('path içindeki & ve > etrafındaki boşlukları korur', () => {
    const { entries } = parse(sample);
    const root = entries.find((e) => e.id === '1');
    expect(root!.path).toEqual(['Animals & Pet Supplies']);
  });
});
```

- [ ] **Step 3: Test fail ettiğini doğrula**

Run: `npx vitest run src/storefront/taxonomy-build/parse.test.ts`
Expected: FAIL — "Cannot find module './parse'"

- [ ] **Step 4: parse.ts implement et**

```typescript
import type { RawEntry } from './types';

const VERSION_RE = /version:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i;

export function parse(text: string): { version: string; entries: RawEntry[] } {
  const lines = text.split('\n');
  let version = '';
  const entries: RawEntry[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('#')) {
      const m = line.match(VERSION_RE);
      if (m) version = m[1];
      continue;
    }
    const sep = line.indexOf(' - ');
    if (sep === -1) continue;
    const id = line.slice(0, sep).trim();
    const path = line
      .slice(sep + 3)
      .split(' > ')
      .map((s) => s.trim());
    if (!id || path.length === 0) continue;
    entries.push({ id, path });
  }

  return { version, entries };
}
```

- [ ] **Step 5: Test geçtiğini doğrula**

Run: `npx vitest run src/storefront/taxonomy-build/parse.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add src/storefront/taxonomy-build/parse.ts src/storefront/taxonomy-build/parse.test.ts src/storefront/taxonomy-build/fixtures/sample-en.txt
git commit -m "feat(taxonomy): Google .txt parser + fixture"
```

---

### Task 3: Tree builder (`tree.ts`)

**Files:**
- Create: `src/storefront/taxonomy-build/tree.test.ts`
- Create: `src/storefront/taxonomy-build/tree.ts`

- [ ] **Step 1: Failing test yaz**

`src/storefront/taxonomy-build/tree.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { buildTree } from './tree';
import type { RawEntry } from './types';

const entries: RawEntry[] = [
  { id: '166', path: ['Apparel & Accessories'] },
  { id: '1604', path: ['Apparel & Accessories', 'Clothing'] },
  { id: '212', path: ['Apparel & Accessories', 'Clothing', 'Shirts & Tops'] },
  { id: '1', path: ['Animals & Pet Supplies'] },
];

describe('buildTree', () => {
  it('kök düğümün parentId null, depth 0 olur', () => {
    const node = buildTree(entries).find((n) => n.id === '166');
    expect(node).toEqual({ id: '166', parentId: null, depth: 0 });
  });

  it('alt düğümün parentId ve depth değerini path zincirinden çözer', () => {
    const node = buildTree(entries).find((n) => n.id === '212');
    expect(node).toEqual({ id: '212', parentId: '1604', depth: 2 });
  });

  it('her giriş için bir düğüm üretir', () => {
    expect(buildTree(entries)).toHaveLength(4);
  });

  it('parent path bir giriş olarak yoksa hata fırlatır', () => {
    const orphan: RawEntry[] = [{ id: '9', path: ['A', 'B'] }];
    expect(() => buildTree(orphan)).toThrow(/parent bulunamadı/);
  });
});
```

- [ ] **Step 2: Test fail ettiğini doğrula**

Run: `npx vitest run src/storefront/taxonomy-build/tree.test.ts`
Expected: FAIL — "Cannot find module './tree'"

- [ ] **Step 3: tree.ts implement et**

```typescript
import type { RawEntry, TreeNode } from './types';

export function buildTree(entries: RawEntry[]): TreeNode[] {
  const pathKeyToId = new Map<string, string>();
  for (const e of entries) {
    pathKeyToId.set(e.path.join(' > '), e.id);
  }

  return entries.map((e) => {
    const depth = e.path.length - 1;
    let parentId: string | null = null;
    if (depth > 0) {
      const parentKey = e.path.slice(0, -1).join(' > ');
      const found = pathKeyToId.get(parentKey);
      if (!found) {
        throw new Error(`parent bulunamadı: ${e.id} (${parentKey})`);
      }
      parentId = found;
    }
    return { id: e.id, parentId, depth };
  });
}
```

- [ ] **Step 4: Test geçtiğini doğrula**

Run: `npx vitest run src/storefront/taxonomy-build/tree.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/storefront/taxonomy-build/tree.ts src/storefront/taxonomy-build/tree.test.ts
git commit -m "feat(taxonomy): path zincirinden tree builder"
```

---

### Task 4: Label çıkarıcı (`labels.ts`)

**Files:**
- Create: `src/storefront/taxonomy-build/labels.test.ts`
- Create: `src/storefront/taxonomy-build/labels.ts`

- [ ] **Step 1: Failing test yaz**

`src/storefront/taxonomy-build/labels.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { extractLabels } from './labels';
import type { RawEntry } from './types';

const entries: RawEntry[] = [
  { id: '166', path: ['Apparel & Accessories'] },
  { id: '212', path: ['Apparel & Accessories', 'Clothing', 'Shirts & Tops'] },
];

describe('extractLabels', () => {
  it('her id için yol son parçasını (yaprak) label yapar', () => {
    expect(extractLabels(entries)).toEqual({
      '166': 'Apparel & Accessories',
      '212': 'Shirts & Tops',
    });
  });
});
```

- [ ] **Step 2: Test fail ettiğini doğrula**

Run: `npx vitest run src/storefront/taxonomy-build/labels.test.ts`
Expected: FAIL — "Cannot find module './labels'"

- [ ] **Step 3: labels.ts implement et**

```typescript
import type { RawEntry } from './types';

export function extractLabels(entries: RawEntry[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const e of entries) {
    out[e.id] = e.path[e.path.length - 1];
  }
  return out;
}
```

- [ ] **Step 4: Test geçtiğini doğrula**

Run: `npx vitest run src/storefront/taxonomy-build/labels.test.ts`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add src/storefront/taxonomy-build/labels.ts src/storefront/taxonomy-build/labels.test.ts
git commit -m "feat(taxonomy): id→yaprak label çıkarıcı"
```

---

### Task 5: Locale haritası (`locales.ts`)

**Files:**
- Create: `src/storefront/taxonomy-build/locales.ts`

- [ ] **Step 1: Haritayı yaz**

```typescript
// Website dili → denenecek Google taksonomi locale'i (null = doğrudan çeviri).
// fetch 404 verirse orchestrator o dili çeviriye düşürür (belirsiz locale'ler için).
export const GOOGLE_LOCALE: Record<string, string | null> = {
  en: 'en-US',
  tr: 'tr-TR',
  de: 'de-DE',
  es: 'es-ES',
  pt: 'pt-BR',
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
  ar: null,
  fa: null,
  hi: null,
  ur: null,
};

// Website dili → translation-swarm/translator.py LANG kodu (çeviri gerektiğinde).
export const TRANSLATOR_CODE: Record<string, string> = {
  tr: 'tr',
  de: 'de',
  es: 'es',
  pt: 'pt-BR',
  ja: 'ja',
  ko: 'ko',
  zh: 'zh-Hans',
  ar: 'ar',
  fa: 'fa',
  hi: 'hi',
  ur: 'ur',
};

export const ALL_LANGS = Object.keys(GOOGLE_LOCALE);
export const TAXONOMY_URL = (locale: string) =>
  `https://www.google.com/basepages/producttype/taxonomy-with-ids.${locale}.txt`;
```

- [ ] **Step 2: Commit**

```bash
git add src/storefront/taxonomy-build/locales.ts
git commit -m "feat(taxonomy): website-lang → Google-locale + translator kod haritası"
```

---

### Task 6: Delta cache (`cache.ts`)

**Files:**
- Create: `src/storefront/taxonomy-build/cache.test.ts`
- Create: `src/storefront/taxonomy-build/cache.ts`

Amaç: bir dil için yalnızca EN label'ı değişen (veya yeni) id'leri çeviriye yollamak. Cache: `{ id: { enHash, value } }`.

- [ ] **Step 1: Failing test yaz**

`src/storefront/taxonomy-build/cache.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { hashLabel, selectStale, mergeCache } from './cache';
import type { LabelCache } from './cache';

describe('cache', () => {
  it('hashLabel aynı metin için aynı, farklı için farklı', () => {
    expect(hashLabel('Shirts')).toBe(hashLabel('Shirts'));
    expect(hashLabel('Shirts')).not.toBe(hashLabel('Tops'));
  });

  it('selectStale yalnız yeni veya enHash değişen id leri döndürür', () => {
    const enLabels = { '1': 'Animals', '2': 'Clothing' };
    const cache: LabelCache = {
      '1': { enHash: hashLabel('Animals'), value: 'Hayvanlar' },
    };
    expect(selectStale(enLabels, cache)).toEqual(['2']);
  });

  it('selectStale enHash değişince o id yi döndürür', () => {
    const enLabels = { '1': 'Pets' };
    const cache: LabelCache = {
      '1': { enHash: hashLabel('Animals'), value: 'Hayvanlar' },
    };
    expect(selectStale(enLabels, cache)).toEqual(['1']);
  });

  it('mergeCache yeni çevirileri enHash ile yazar, eskileri korur', () => {
    const enLabels = { '1': 'Animals', '2': 'Clothing' };
    const cache: LabelCache = {
      '1': { enHash: hashLabel('Animals'), value: 'Hayvanlar' },
    };
    const merged = mergeCache(cache, enLabels, { '2': 'Giyim' });
    expect(merged['2']).toEqual({ enHash: hashLabel('Clothing'), value: 'Giyim' });
    expect(merged['1'].value).toBe('Hayvanlar');
  });
});
```

- [ ] **Step 2: Test fail ettiğini doğrula**

Run: `npx vitest run src/storefront/taxonomy-build/cache.test.ts`
Expected: FAIL — "Cannot find module './cache'"

- [ ] **Step 3: cache.ts implement et**

```typescript
import { createHash } from 'node:crypto';

export interface LabelCache {
  [id: string]: { enHash: string; value: string };
}

export function hashLabel(text: string): string {
  return createHash('sha1').update(text).digest('hex').slice(0, 12);
}

// EN label'ı cache'tekinden farklı veya cache'te olmayan id'ler.
export function selectStale(
  enLabels: Record<string, string>,
  cache: LabelCache,
): string[] {
  return Object.keys(enLabels).filter((id) => {
    const cached = cache[id];
    return !cached || cached.enHash !== hashLabel(enLabels[id]);
  });
}

// Yeni çevirileri cache'e işle; dokunulmayanları koru.
export function mergeCache(
  cache: LabelCache,
  enLabels: Record<string, string>,
  fresh: Record<string, string>,
): LabelCache {
  const next: LabelCache = { ...cache };
  for (const [id, value] of Object.entries(fresh)) {
    next[id] = { enHash: hashLabel(enLabels[id]), value };
  }
  return next;
}
```

- [ ] **Step 4: Test geçtiğini doğrula**

Run: `npx vitest run src/storefront/taxonomy-build/cache.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/storefront/taxonomy-build/cache.ts src/storefront/taxonomy-build/cache.test.ts
git commit -m "feat(taxonomy): delta cache (id+enHash) çeviri tasarrufu"
```

---

### Task 7: `translate_map.py` (translation-swarm reuse)

**Files:**
- Create: `~/Desktop/translation-swarm/translate_map.py`

Mevcut `translator.py`'nin `Translator` sınıfını yeniden kullanır; `swarm.py` veya watcher'a dokunmaz. `{id: en_label}` JSON'u alır, `{id: çeviri}` JSON'u yazar.

- [ ] **Step 1: translate_map.py yaz**

```python
#!/usr/bin/env python3
"""Batch map çevirici: {id: en_label} -> {id: çeviri}, PARALEL.

Mevcut translator.py reuse eder; swarm.py'a dokunmaz.
Tek dil içinde ThreadPoolExecutor ile paralel çevirir; transient
Google/rate-limit hatasında exponential backoff ile retry yapar.
Translator (deep_translator) örneği thread'ler arası paylaşılmasın diye
her görevde yeni örnek kurulur (ucuz, thread-safe).

Kullanım:
    python translate_map.py <lang> <input.json> <output.json> [workers]
örn:
    python translate_map.py ar /tmp/stale.json /tmp/out.json 8
"""
import json
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

from translator import LANGS, Translator

DEFAULT_WORKERS = 8
MAX_RETRY = 4


def translate_one(lang: str, cid: str, text: str):
    """Tek bir label'ı çevir; transient hata'da backoff ile retry.

    Dönüş: (id, value|None, error|None). value None ise orchestrator
    eksik id olarak yakalar (EN'e düşürmeyiz)."""
    delay = 1.0
    last = "?"
    for _ in range(MAX_RETRY):
        tr = Translator(lang)  # her denemede taze örnek (thread-safe)
        res = tr.translate(text)
        if res.error is None or res.error == "empty-source":
            return cid, res.value, None
        last = res.error
        # placeholder/brand hataları retry ile düzelmez; sadece transient'e backoff
        if "google" not in last:
            break
        time.sleep(delay)
        delay *= 2
    return cid, None, last


def main() -> int:
    if len(sys.argv) not in (4, 5):
        print("usage: translate_map.py <lang> <input.json> <output.json> [workers]", file=sys.stderr)
        return 2
    lang, in_path, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    workers = int(sys.argv[4]) if len(sys.argv) == 5 else DEFAULT_WORKERS
    if lang not in LANGS:
        print(f"bilinmeyen dil: {lang} (geçerli: {', '.join(LANGS)})", file=sys.stderr)
        return 2

    with open(in_path, encoding="utf-8") as f:
        src: dict[str, str] = json.load(f)

    out: dict[str, str] = {}
    errors = 0
    done = 0
    total = len(src)
    with ThreadPoolExecutor(max_workers=workers) as ex:
        futs = [ex.submit(translate_one, lang, cid, text) for cid, text in src.items()]
        for fut in as_completed(futs):
            cid, value, err = fut.result()
            done += 1
            if err is not None:
                errors += 1
                print(f"[{lang}] {cid} hata: {err}", file=sys.stderr)
            else:
                out[cid] = value
            if done % 500 == 0:
                print(f"[{lang}] {done}/{total}", file=sys.stderr)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False)
    print(f"[{lang}] tamam: {len(out)}/{total} (hata: {errors}, workers: {workers})", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 2: Manuel duman testi**

Run:
```bash
cd ~/Desktop/translation-swarm && source .venv/bin/activate && \
echo '{"212":"Shirts & Tops","166":"Apparel & Accessories"}' > /tmp/tax_test.json && \
python translate_map.py ar /tmp/tax_test.json /tmp/tax_out.json 4 && cat /tmp/tax_out.json
```
Expected: `/tmp/tax_out.json` içinde `{"212":"<arapça çeviri>","166":"<arapça çeviri>"}`; her iki id de mevcut, değerler boş değil. (Paralel; sıra farklı olabilir.)

- [ ] **Step 3: Commit (translation-swarm reposunda)**

```bash
cd ~/Desktop/translation-swarm && git add translate_map.py && \
git commit -m "feat: taksonomi için {id:en}->{id:çeviri} batch map CLI (translator.py reuse)" || echo "git repo değilse atla"
```

---

### Task 8: Orchestrator — saf birleştirme katmanı (`assemble`)

**Files:**
- Create: `src/storefront/taxonomy-build/assemble.test.ts`
- Create: `src/storefront/taxonomy-build/assemble.ts`
- Create: `src/storefront/taxonomy-build/fixtures/sample-de.txt`

Önce ağ ve dosya I/O'dan **arınmış** birleştirme mantığını test edip yazarız; indirme/yazma sonraki task'ta. `assemble`, kaynak metinleri (zaten indirilmiş string'ler) ve bir `translateFn` enjeksiyonu alır.

- [ ] **Step 1: de fixture oluştur**

`src/storefront/taxonomy-build/fixtures/sample-de.txt`:

```
# Google_Product_Taxonomy_Version: 2026-03-15
1 - Tiere & Tierbedarf
3237 - Tiere & Tierbedarf > Lebende Tiere
2 - Tiere & Tierbedarf > Tierbedarf
3 - Tiere & Tierbedarf > Tierbedarf > Vogelbedarf
166 - Bekleidung & Accessoires
1604 - Bekleidung & Accessoires > Bekleidung
212 - Bekleidung & Accessoires > Bekleidung > Shirts & Tops
```

- [ ] **Step 2: Failing test yaz**

`src/storefront/taxonomy-build/assemble.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { assemble } from './assemble';

const read = (f: string) =>
  readFileSync(fileURLToPath(new URL(`./fixtures/${f}`, import.meta.url)), 'utf-8');

const sources: Record<string, string | null> = {
  en: read('sample-en.txt'),
  de: read('sample-de.txt'),
  ar: null, // Google'da yok → çeviri yolu
};

// Sahte çevirmen: id->en map alır, deterministik "AR:<en>" döndürür.
const fakeTranslate = async (lang: string, idToEn: Record<string, string>) => {
  const out: Record<string, string> = {};
  for (const [id, en] of Object.entries(idToEn)) out[id] = `${lang.toUpperCase()}:${en}`;
  return out;
};

describe('assemble', () => {
  it('en kaynağından tree üretir', async () => {
    const r = await assemble(sources, fakeTranslate);
    expect(r.tree.find((n) => n.id === '212')).toEqual({
      id: '212', parentId: '1604', depth: 2,
    });
  });

  it('Google locale olan dilin label larını o kaynaktan alır', async () => {
    const r = await assemble(sources, fakeTranslate);
    expect(r.labels.de['166']).toBe('Bekleidung & Accessoires');
  });

  it('Google locale olmayan dili translateFn ile doldurur', async () => {
    const r = await assemble(sources, fakeTranslate);
    expect(r.labels.ar['166']).toBe('AR:Apparel & Accessories');
  });

  it('her dil tree deki tüm id leri kapsar', async () => {
    const r = await assemble(sources, fakeTranslate);
    const ids = r.tree.map((n) => n.id).sort();
    for (const lang of Object.keys(sources)) {
      expect(Object.keys(r.labels[lang]).sort()).toEqual(ids);
    }
  });

  it('meta.googleVersion en başlığından gelir', async () => {
    const r = await assemble(sources, fakeTranslate);
    expect(r.meta.googleVersion).toBe('2026-03-15');
  });

  it('Google locale dosyası bir id i içermiyorsa hata fırlatır', async () => {
    const broken = { en: sources.en, de: read('sample-en.txt').replace(/^212 .*$/m, '') };
    await expect(assemble(broken, fakeTranslate)).rejects.toThrow(/eksik id/);
  });
});
```

- [ ] **Step 3: Test fail ettiğini doğrula**

Run: `npx vitest run src/storefront/taxonomy-build/assemble.test.ts`
Expected: FAIL — "Cannot find module './assemble'"

- [ ] **Step 4: assemble.ts implement et**

```typescript
import type { BuildResult } from './types';
import { parse } from './parse';
import { buildTree } from './tree';
import { extractLabels } from './labels';

export type TranslateFn = (
  lang: string,
  idToEn: Record<string, string>,
) => Promise<Record<string, string>>;

// sources: website-lang -> ham .txt metni (null = Google'da yok, çevir).
// generatedAt + taxonomyVersion orchestrator tarafından stamp'lenir; burada sabit.
export async function assemble(
  sources: Record<string, string | null>,
  translate: TranslateFn,
): Promise<BuildResult> {
  const enText = sources.en;
  if (!enText) throw new Error('en kaynağı zorunlu');

  const enParsed = parse(enText);
  const tree = buildTree(enParsed.entries);
  const enLabels = extractLabels(enParsed.entries);
  const allIds = Object.keys(enLabels);

  const labels: Record<string, Record<string, string>> = {};
  for (const [lang, text] of Object.entries(sources)) {
    if (lang === 'en') {
      labels.en = enLabels;
      continue;
    }
    if (text) {
      const map = extractLabels(parse(text).entries);
      for (const id of allIds) {
        if (!(id in map)) throw new Error(`eksik id: ${lang} dosyasında ${id}`);
      }
      labels[lang] = map;
    } else {
      labels[lang] = await translate(lang, enLabels);
      for (const id of allIds) {
        if (!(id in labels[lang])) throw new Error(`eksik id: ${lang} çevirisinde ${id}`);
      }
    }
  }

  return {
    tree,
    labels,
    meta: { googleVersion: enParsed.version, taxonomyVersion: 0, generatedAt: '' },
  };
}
```

- [ ] **Step 5: Test geçtiğini doğrula**

Run: `npx vitest run src/storefront/taxonomy-build/assemble.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 6: Commit**

```bash
git add src/storefront/taxonomy-build/assemble.ts src/storefront/taxonomy-build/assemble.test.ts src/storefront/taxonomy-build/fixtures/sample-de.txt
git commit -m "feat(taxonomy): saf assemble katmanı (tree + çok dilli label)"
```

---

### Task 9: Build script (`scripts/build-taxonomy.mjs`) — indirme + I/O + çeviri köprüsü

**Files:**
- Create: `scripts/build-taxonomy.mjs`
- Modify: `package.json` (scripts: `build:taxonomy` ekle)

Bu task ağ/dosya/Python köprüsünü içerir; saf mantık Task 8'de test edildi. Manuel çalıştırmayla doğrulanır.

- [ ] **Step 1: build-taxonomy.mjs yaz**

```javascript
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { assemble } from '../src/storefront/taxonomy-build/assemble.js';
import { GOOGLE_LOCALE, TRANSLATOR_CODE, ALL_LANGS, TAXONOMY_URL } from '../src/storefront/taxonomy-build/locales.js';
import { hashLabel, selectStale, mergeCache } from '../src/storefront/taxonomy-build/cache.js';

const OUT_DIR = 'src/storefront/taxonomy';
const CACHE_DIR = join(OUT_DIR, '.cache');
const SWARM_DIR = join(homedir(), 'Desktop', 'translation-swarm');
const PY = join(SWARM_DIR, '.venv', 'bin', 'python');

// 1) Kaynakları indir: Google locale 200 verirse metin, yoksa null.
async function fetchSources() {
  const sources = {};
  for (const lang of ALL_LANGS) {
    const locale = GOOGLE_LOCALE[lang];
    if (!locale) { sources[lang] = null; continue; }
    const res = await fetch(TAXONOMY_URL(locale));
    if (res.ok) {
      sources[lang] = await res.text();
      console.log(`indirildi: ${lang} (${locale})`);
    } else {
      sources[lang] = null;
      console.log(`yok (${res.status}): ${lang} (${locale}) → çeviriye düşecek`);
    }
  }
  return sources;
}

// 2) Çeviri köprüsü: delta cache + translate_map.py.
async function makeTranslateFn() {
  await mkdir(CACHE_DIR, { recursive: true });
  return async (lang, enLabels) => {
    const cachePath = join(CACHE_DIR, `labels.${lang}.cache.json`);
    const cache = existsSync(cachePath)
      ? JSON.parse(await readFile(cachePath, 'utf-8'))
      : {};
    const staleIds = selectStale(enLabels, cache);
    let fresh = {};
    if (staleIds.length > 0) {
      const inMap = Object.fromEntries(staleIds.map((id) => [id, enLabels[id]]));
      const inPath = join(tmpdir(), `tax_in_${lang}.json`);
      const outPath = join(tmpdir(), `tax_out_${lang}.json`);
      await writeFile(inPath, JSON.stringify(inMap), 'utf-8');
      const code = TRANSLATOR_CODE[lang];
      // workers=8: dil-içi paralellik. Diller sıralı çağrılır (aşağıdaki for),
      // böylece toplam eşzamanlı Google isteği ~8'de kalır (rate-limit/ban koruması).
      const r = spawnSync(PY, ['translate_map.py', code, inPath, outPath, '8'], {
        cwd: SWARM_DIR, stdio: 'inherit',
      });
      if (r.status !== 0) throw new Error(`translate_map.py başarısız: ${lang}`);
      fresh = JSON.parse(await readFile(outPath, 'utf-8'));
    } else {
      console.log(`çeviri atlandı (delta yok): ${lang}`);
    }
    const merged = mergeCache(cache, enLabels, fresh);
    await writeFile(cachePath, JSON.stringify(merged), 'utf-8');
    // Tüm id'ler için cache'ten label döndür.
    const out = {};
    for (const id of Object.keys(enLabels)) out[id] = merged[id]?.value ?? '';
    return out;
  };
}

async function main() {
  const sources = await fetchSources();
  const result = await assemble(sources, await makeTranslateFn());

  // Versiyon + zaman damgası stamp (assemble bunları boş bırakır).
  result.meta.generatedAt = new Date().toISOString();
  const prevMetaPath = join(OUT_DIR, 'meta.json');
  const prev = existsSync(prevMetaPath)
    ? JSON.parse(await readFile(prevMetaPath, 'utf-8'))
    : { taxonomyVersion: 0 };
  result.meta.taxonomyVersion = (prev.taxonomyVersion ?? 0) + 1;

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(join(OUT_DIR, 'tree.json'), JSON.stringify(result.tree));
  for (const [lang, map] of Object.entries(result.labels)) {
    await writeFile(join(OUT_DIR, `labels.${lang}.json`), JSON.stringify(map));
  }
  await writeFile(join(OUT_DIR, 'meta.json'), JSON.stringify(result.meta, null, 2));
  console.log(`tamam: ${result.tree.length} düğüm, v${result.meta.taxonomyVersion}, Google ${result.meta.googleVersion}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: package.json'a script ekle**

`package.json` `scripts` bloğuna ekle:

```json
    "build:taxonomy": "node scripts/build-taxonomy.mjs",
```

- [ ] **Step 3: Çalıştır ve çıktıyı doğrula**

Run: `npm run build:taxonomy`
Expected:
- Konsolda her dil için "indirildi" / "yok → çeviriye düşecek" satırları
- Son satır: `tamam: ~6600 düğüm, v1, Google YYYY-MM-DD`
- `src/storefront/taxonomy/tree.json`, 12 adet `labels.<lang>.json`, `meta.json` oluşur

- [ ] **Step 4: Çıktı bütünlüğünü doğrula**

Run:
```bash
node -e "const t=require('./src/storefront/taxonomy/tree.json');const en=require('./src/storefront/taxonomy/labels.en.json');const ar=require('./src/storefront/taxonomy/labels.ar.json');const ids=t.map(n=>n.id);console.log('düğüm:',ids.length,'en kapsama:',ids.every(i=>en[i]),'ar kapsama:',ids.every(i=>ar[i]),'kök sayısı:',t.filter(n=>n.parentId===null).length)"
```
Expected: `düğüm: ~6600 en kapsama: true ar kapsama: true kök sayısı: >0`

- [ ] **Step 5: Delta tasarrufunu doğrula (ikinci çalıştırma)**

Run: `npm run build:taxonomy`
Expected: çeviri gerektiren diller için "çeviri atlandı (delta yok)" satırları (cache sayesinde translate_map.py çağrılmaz).

- [ ] **Step 6: Commit**

```bash
git add scripts/build-taxonomy.mjs package.json
git commit -m "feat(taxonomy): build orchestrator (indir + delta çeviri + tree/labels/meta yaz)"
```

---

### Task 10: Üretilen çıktıyı repoya işle + .gitignore kararı

**Files:**
- Modify: `.gitignore` (cache hariç tut)
- Add: `src/storefront/taxonomy/*.json` (üretilen kanonik veri commit edilir)

Spec gereği kanonik çıktı statik olarak commit edilir (web + iOS bundle tüketir). Cache klasörü commit edilmez.

- [ ] **Step 1: .gitignore'a cache satırı ekle**

`.gitignore` sonuna ekle:

```
src/storefront/taxonomy/.cache/
```

- [ ] **Step 2: Üretilen veriyi ekle ve commit**

```bash
git add src/storefront/taxonomy/tree.json src/storefront/taxonomy/labels.*.json src/storefront/taxonomy/meta.json .gitignore
git commit -m "chore(taxonomy): üretilen kanonik veri (tree + 12 dil label + meta) v1"
```

---

### Task 11: Tam test koşusu + doğrulama

- [ ] **Step 1: Tüm taxonomy testlerini çalıştır**

Run: `npx vitest run src/storefront/taxonomy-build/`
Expected: PASS — parse(4) + tree(4) + labels(1) + cache(4) + assemble(6) = 19 test

- [ ] **Step 2: Mevcut test takımının bozulmadığını doğrula**

Run: `npm test`
Expected: önceki tüm storefront testleri + yeni 19 test PASS; regresyon yok

- [ ] **Step 3: Spec başarı kriterlerini kontrol et**

`docs/superpowers/specs/2026-06-01-taxonomy-data-pipeline-design.md` "Başarı kriteri" bölümünü tek tek doğrula:
- `npm run build:taxonomy` → tree.json + 12 labels + meta.json üretiyor ✓ (Task 9 Step 3)
- tree node sayısı Google ile aynı, geçerli parentId/depth ✓ (Task 9 Step 4)
- her dil tüm id'leri kapsıyor ✓ (Task 9 Step 4 + assemble testi)
- ikinci koşuda değişmeyen yapraklar çevrilmiyor ✓ (Task 9 Step 5)

---

## Self-Review Notları

**Spec coverage:** Master kaynak (Task 5,9), parse formatı (Task 2), numeric ID kanonik (Task 1,3), ayrık çıktı tree+labels+meta (Task 8,9,10), translation-swarm reuse (Task 7), delta cache (Task 6,9), versiyonlama (Task 9), eksik dil çevirisi + locale fallback (Task 5,8,9) → hepsi karşılandı.

**Tip tutarlılığı:** `RawEntry`, `TreeNode`, `BuildResult` (types.ts) tüm task'larda aynı; `LabelCache` (cache.ts) Task 6+9'da tutarlı; `TranslateFn` imzası Task 8 (tanım) ↔ Task 9 (makeTranslateFn implementasyonu: `(lang, enLabels) => Promise<Record<string,string>>`) eşleşiyor; `GOOGLE_LOCALE`/`TRANSLATOR_CODE`/`ALL_LANGS`/`TAXONOMY_URL` (locales.ts) Task 9'da aynı isimle import.

**Placeholder taraması:** Tüm kod adımları tam içerikli; TBD/TODO yok.

**Not (import uzantısı):** `build-taxonomy.mjs` derlenmiş `.js` yollarını import eder (`assemble.js`); repo `tsx`/ts-node kullanmıyorsa, çalıştırmadan önce `npx tsc` ile `taxonomy-build/*.ts` derlenmeli VEYA script `npx tsx scripts/build-taxonomy.mjs` ile koşulmalı. Yürütme sırasında ortama göre netleşir; sorun çıkarsa `tsx` devDependency eklenir.
```
