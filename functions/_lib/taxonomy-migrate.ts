/**
 * taxonomy-migrate.ts — Lazy (read-time) legacy id → google id çevirisi.
 * #5 dual-write'ın read-map yarısı. categories[] + products[].categoryId BİRLİKTE
 * çevrilir (manifest.ts invariant'ı: string-eşitlik bağı korunmalı). Saf, non-destructive
 * (yeni nesne döner, orijinali mutate etmez). Çözülemeyen → uncategorized sentinel + warn.
 */
import type { Manifest } from '../../src/storefront/types';
import { mapLegacyId, UNCATEGORIZED } from '../../src/storefront/taxonomy/legacy-map';

/**
 * Manifest içindeki tüm category id'lerini ve product categoryId'lerini
 * aynı legacy haritasıyla çevirir. manifest.ts invariant'ı korunur:
 *   category.id === product.categoryId (string eşitliği).
 *
 * @param manifest  — orijinal manifest (mutate edilmez)
 * @param map       — { legacyId: googleNumericId } sözlüğü
 * @param warn      — çözülemeyen her eski id için çağrılan opsiyonel callback
 */
export function applyLegacyMapToManifest(
  manifest: Manifest,
  map: Record<string, string>,
  warn?: (oldId: string) => void,
): Manifest {
  // Tek bir yardımcı: id'yi çevirir, çözülemeyen → uncategorized + warn
  const mapped = (id: string | undefined): string => {
    const g = mapLegacyId(id, map);
    // Zaten UNCATEGORIZED sentinel olan id "map'lenemeyen legacy" değildir;
    // tekrar normalize'da telemetri'yi yanıltmamak için warn'lanmaz (idempotent damga).
    if (id && id !== UNCATEGORIZED && g === UNCATEGORIZED && warn) warn(id);
    return g;
  };

  return {
    ...manifest,
    categories: manifest.categories.map((c) => ({ ...c, id: mapped(c.id) })),
    products: manifest.products.map((p) => ({
      ...p,
      categoryId: p.categoryId != null ? mapped(p.categoryId) : p.categoryId,
    })),
  };
}

/**
 * Write-normalize: KV'ye yazmadan önce manifest'i normalleştirir.
 * Tüm legacy id'leri google id'ye çevirir (idempotent) ve
 * taxonomyMigration damgasını meta'ya ekler.
 *
 * @param manifest  — orijinal manifest (mutate edilmez)
 * @param map       — { legacyId: googleNumericId } sözlüğü
 * @param toVersion — hedef taxonomy sürümü (taxonomy.json versiyonu)
 */
export function normalizeManifestForWrite(
  manifest: Manifest,
  map: Record<string, string>,
  toVersion: number,
): Manifest {
  const unmapped: string[] = [];
  const mapped = applyLegacyMapToManifest(manifest, map, (oldId) => {
    if (!unmapped.includes(oldId)) unmapped.push(oldId);
  });
  return {
    ...mapped,
    meta: {
      ...mapped.meta,
      taxonomyVersion: toVersion,
      taxonomyMigration: {
        fromVersion: manifest.meta.taxonomyVersion,
        toVersion,
        migratedAt: new Date().toISOString(),
        unmapped,
      },
    },
  };
}
