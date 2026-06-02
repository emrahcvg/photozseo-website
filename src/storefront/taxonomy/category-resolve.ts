/**
 * category-resolve.ts — Kategori adı çözümleme (store+market ortak).
 * Öncelik: manifest adı → taxonomy label → "Other". svc inject; saf.
 */
import type { TaxonomyService } from './service';
import { UNCATEGORIZED } from './legacy-map';

type Localized = Record<string, string>;

function resolveLocalized(field: Localized | undefined, lang: string): string {
  if (!field) return '';
  return field[lang] ?? field.en ?? Object.values(field)[0] ?? '';
}

/** manifest adı → svc.label → "Other"/"Diğer". */
export function resolveCategoryName(
  categoryId: string | undefined,
  manifestName: Localized | undefined,
  lang: string,
  svc: TaxonomyService,
): string {
  const fromManifest = resolveLocalized(manifestName, lang).trim();
  if (fromManifest) return fromManifest;
  if (categoryId && categoryId !== UNCATEGORIZED && svc.node(categoryId)) {
    return svc.label(categoryId, lang);
  }
  return lang === 'tr' ? 'Diğer' : 'Other';
}

export interface BreadcrumbSegment {
  id: string;
  label: string;
}

/**
 * parentId zincirinden breadcrumb segmentleri. Çözülemeyen/boş id → null
 * (çağıran breadcrumb satırını GİZLER; kırık zincir gösterilmez).
 */
export function categoryBreadcrumb(
  categoryId: string | undefined,
  lang: string,
  svc: TaxonomyService,
): BreadcrumbSegment[] | null {
  if (!categoryId || categoryId === UNCATEGORIZED) return null;
  const self = svc.node(categoryId);
  if (!self) return null;
  const chain = [...svc.ancestors(categoryId), self];
  return chain.map((n) => ({ id: n.id, label: svc.label(n.id, lang) }));
}
