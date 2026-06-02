/**
 * service.ts — Saf-TS taxonomyService. tree.json + labels.<lang>.json üzerinde
 * okuma yüzeyi. DOM yok; store (build/SSR) ve market (edge) tüketir.
 * Çözülemeyen id'de ASLA throw etmez — her zaman zarif düşüş (id'ye fallback).
 */

export interface TaxNode {
  id: string;
  parentId: string | null;
  depth: number;
}

export interface TaxonomyService {
  node(id: string): TaxNode | undefined;
  children(id: string | null): TaxNode[];
  ancestors(id: string): TaxNode[];
  label(id: string, lang: string): string;
  path(id: string, lang: string): string[];
  version(): number;
}

export interface TaxonomyData {
  tree: TaxNode[];
  labels: Record<string, Record<string, string>>;
  taxonomyVersion: number;
}

const ROOT_KEY = '__root__';
const FALLBACK_LANG = 'en';

export function createTaxonomyService(data: TaxonomyData): TaxonomyService {
  const byId = new Map<string, TaxNode>();
  const childrenOf = new Map<string, TaxNode[]>();

  for (const n of data.tree) {
    byId.set(n.id, n);
    const key = n.parentId ?? ROOT_KEY;
    const arr = childrenOf.get(key) ?? [];
    arr.push(n);
    childrenOf.set(key, arr);
  }

  const node = (id: string): TaxNode | undefined => byId.get(id);

  const children = (id: string | null): TaxNode[] =>
    childrenOf.get(id ?? ROOT_KEY) ?? [];

  const ancestors = (id: string): TaxNode[] => {
    const chain: TaxNode[] = [];
    let cur = byId.get(id);
    const seen = new Set<string>();
    while (cur && cur.parentId != null && !seen.has(cur.parentId)) {
      seen.add(cur.parentId);
      const parent = byId.get(cur.parentId);
      if (!parent) break;
      chain.push(parent);
      cur = parent;
    }
    return chain.reverse();
  };

  const label = (id: string, lang: string): string => {
    const table = data.labels[lang];
    if (table && table[id] != null) return table[id];
    const en = data.labels[FALLBACK_LANG];
    if (en && en[id] != null) return en[id];
    return id;
  };

  const path = (id: string, lang: string): string[] => {
    const chain = [...ancestors(id), ...(byId.has(id) ? [byId.get(id)!] : [])];
    if (chain.length === 0) return [label(id, lang)];
    return chain.map((n) => label(n.id, lang));
  };

  const version = (): number => data.taxonomyVersion;

  return { node, children, ancestors, label, path, version };
}
