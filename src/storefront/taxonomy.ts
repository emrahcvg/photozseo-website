/**
 * taxonomy.ts — Web tarafının taxonomy.json okuyucusu.
 * iOS ile byte-identical `taxonomy.json` (15 üst kategori × 12 dil) buradan
 * lokalize edilir. /market ana sayfası kategorileri ürün havuzundan değil,
 * bu sabit taksonomi'den çeker — böylece kategoriler ürün olmasa da görünür.
 */

import taxonomy from './taxonomy.json';

export interface TaxonomyNode {
  id: string;
  name: Record<string, string>;
  children?: TaxonomyNode[];
}

const NODES = (taxonomy as { taxonomyVersion: number; nodes: TaxonomyNode[] }).nodes;

/** Düğümün locale'e göre adı; fallback: locale → en → id. */
export function localizedName(node: TaxonomyNode, locale: string): string {
  return node.name[locale] ?? node.name.en ?? node.id;
}

/** /market ana sayfası için lokalize üst kategoriler (her zaman dolu). */
export function topCategories(locale: string): { id: string; name: string }[] {
  return NODES.map((n) => ({ id: n.id, name: localizedName(n, locale) }));
}

/** Herhangi bir kategori id'sinin (üst ya da alt) lokalize adı; bulunamazsa id. */
export function categoryName(id: string, locale: string): string {
  for (const top of NODES) {
    if (top.id === id) return localizedName(top, locale);
    for (const child of top.children ?? []) {
      if (child.id === id) return localizedName(child, locale);
    }
  }
  return id;
}
