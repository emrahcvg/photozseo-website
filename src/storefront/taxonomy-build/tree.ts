import type { RawEntry, TreeNode } from './types';

export function buildTree(entries: RawEntry[]): TreeNode[] {
  const pathKeyToId = new Map<string, string>();
  for (const e of entries) {
    const key = e.path.join(' > ');
    if (pathKeyToId.has(key)) {
      throw new Error(`çakışan path: ${key}`);
    }
    pathKeyToId.set(key, e.id);
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
