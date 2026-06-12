/**
 * slug-resolve.ts — Bidirectional Google Taxonomy ID ↔ URL slug mapping.
 * Slugs are generated from English labels (lowercase, hyphens, no special chars).
 * slug-map.json is auto-generated; do not edit manually — run the generator script.
 */
import slugMap from './slug-map.json';

const map = slugMap as Record<string, string>;

/** Numeric category ID → URL slug (e.g. "1" → "animals-pet-supplies"). Falls back to the ID itself. */
export function idToSlug(id: string): string {
  return map[id] ?? id;
}

/** URL slug → numeric category ID (e.g. "animals-pet-supplies" → "1").
 *  Numeric strings pass through unchanged. Returns undefined for unknown slugs. */
export function slugToId(slug: string): string | undefined {
  if (/^\d+$/.test(slug)) return slug;
  return map[slug];
}
