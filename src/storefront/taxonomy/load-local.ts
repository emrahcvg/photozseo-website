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

async function loadLabels(lang: string): Promise<Record<string, string>> {
  if (labelCache.has(lang)) return labelCache.get(lang)!;
  try {
    const mod = await import(`./labels.${lang}.json`);
    const table = (mod.default ?? mod) as Record<string, string>;
    labelCache.set(lang, table);
    return table;
  } catch {
    return {};
  }
}

export async function getTaxonomyService(lang: string): Promise<TaxonomyService> {
  const langs = lang === 'en' ? ['en'] : [lang, 'en'];
  const labels: Record<string, Record<string, string>> = {};
  for (const l of langs) labels[l] = await loadLabels(l);
  return createTaxonomyService({
    tree: tree as unknown as TaxNode[],
    labels,
    taxonomyVersion: (meta as { taxonomyVersion: number }).taxonomyVersion,
  });
}
