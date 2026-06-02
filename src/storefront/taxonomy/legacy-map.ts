/**
 * legacy-map.ts — Eski (dot/serbest) categoryId → Google numeric id eşlemesi.
 * Saf; read-time (lazy) ve write-normalize aynı fonksiyonları kullanır.
 * Çözülemeyen id → UNCATEGORIZED sentinel (sessiz kayıp YOK; çağıran raporlar).
 */

export const UNCATEGORIZED = 'uncategorized';

/** Saf numeric string mi (Google taksonomi id formatı)? */
export function isGoogleId(id: string): boolean {
  return /^[0-9]+$/.test(id);
}

/**
 * Eski id'yi Google id'ye çevir. Zaten Google id ise dokunma (idempotent).
 * Haritada yoksa UNCATEGORIZED sentinel döner.
 */
export function mapLegacyId(id: string | undefined, map: Record<string, string>): string {
  if (!id) return UNCATEGORIZED;
  if (isGoogleId(id)) return id;
  return map[id] ?? UNCATEGORIZED;
}
