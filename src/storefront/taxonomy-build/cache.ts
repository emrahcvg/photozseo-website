import { createHash } from 'node:crypto';

export interface LabelCache {
  [id: string]: { enHash: string; value: string };
}

export function hashLabel(text: string): string {
  // 12 hex'e kısaltma bilinçli: kompakt cache anahtarı, güvenlik amaçlı değil.
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
