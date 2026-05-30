import type { Manifest } from './types';

// P1: veri kaynağı fixture JSON'lar. P2'de bu modül registry+Drive fetch ile değişecek.
const fixtures = import.meta.glob<{ default: Manifest }>('./fixtures/*.json', { eager: true });

export function getAllManifests(): Manifest[] {
  return Object.values(fixtures).map((mod) => mod.default);
}

export function getManifestBySlug(slug: string): Manifest | undefined {
  return getAllManifests().find((m) => m.store.slug === slug);
}
