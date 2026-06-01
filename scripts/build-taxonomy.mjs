import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { assemble } from '../src/storefront/taxonomy-build/assemble.ts';
import { GOOGLE_LOCALE, TRANSLATOR_CODE, ALL_LANGS, TAXONOMY_URL } from '../src/storefront/taxonomy-build/locales.ts';
import { hashLabel, selectStale, mergeCache } from '../src/storefront/taxonomy-build/cache.ts';

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
      const r = spawnSync(PY, ['translate_map.py', code, inPath, outPath, '2'], {
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
