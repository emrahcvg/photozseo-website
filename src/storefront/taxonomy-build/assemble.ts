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
