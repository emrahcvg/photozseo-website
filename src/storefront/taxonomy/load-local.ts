/**
 * load-local.ts — Local (static import) adapter. tree/labels/meta JSON'larını
 * import edip taxonomyService kurar. Store build/SSR + market edge tercih edilen yol
 * (HTTP yok; kilitli karar: web = static import). Lang label haritaları lazy: yalnız
 * istenen + en yüklenir.
 */
import { createTaxonomyService, type TaxonomyService, type TaxNode } from './service';
import tree from './tree.json';
import meta from './meta.json';

const labelCache = new Map<string, Record<string, string>>();

const LABEL_LOADERS: Record<string, () => Promise<{ default: Record<string, string> }>> = {
  en: () => import('./labels.en.json'),
  tr: () => import('./labels.tr.json'),
  de: () => import('./labels.de.json'),
  es: () => import('./labels.es.json'),
  pt: () => import('./labels.pt.json'),
  ja: () => import('./labels.ja.json'),
  ko: () => import('./labels.ko.json'),
  zh: () => import('./labels.zh.json'),
  ar: () => import('./labels.ar.json'),
  fa: () => import('./labels.fa.json'),
  hi: () => import('./labels.hi.json'),
  ur: () => import('./labels.ur.json'),
  fr: () => import('./labels.fr.json'),
  it: () => import('./labels.it.json'),
  pl: () => import('./labels.pl.json'),
};

async function loadLabels(lang: string): Promise<Record<string, string>> {
  if (labelCache.has(lang)) return labelCache.get(lang)!;
  const loader = LABEL_LOADERS[lang];
  if (!loader) return {};
  try {
    const mod = await loader();
    const table = (mod.default ?? mod) as Record<string, string>;
    labelCache.set(lang, table);
    return table;
  } catch {
    return {};
  }
}

// Dil başına tek servis (isolate ömrü boyunca): ağaç Map'leri her istekte yeniden kurulmasın.
const serviceCache = new Map<string, Promise<TaxonomyService>>();

export function getTaxonomyService(lang: string): Promise<TaxonomyService> {
  const hit = serviceCache.get(lang);
  if (hit) return hit;
  const p = buildService(lang);
  serviceCache.set(lang, p);
  p.catch(() => serviceCache.delete(lang)); // hata kalıcı önbelleğe girmesin
  return p;
}

async function buildService(lang: string): Promise<TaxonomyService> {
  const langs = lang === 'en' ? ['en'] : [lang, 'en'];
  const labels: Record<string, Record<string, string>> = {};
  for (const l of langs) labels[l] = await loadLabels(l);
  return createTaxonomyService({
    tree: tree as unknown as TaxNode[],
    labels,
    taxonomyVersion: (meta as { taxonomyVersion: number }).taxonomyVersion,
  });
}
