/**
 * registry.ts — KV registry helpers for P2 storefront slugs.
 * Runs in the Cloudflare Workers runtime.
 */

import type { Manifest } from '../../src/storefront/types';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StoreRecord {
  manifest: Manifest;
  phone?: string;
  status: 'active' | 'reserved' | 'unpublished';
  version: number;
  updatedAt: string;
}

// ── Key helpers ───────────────────────────────────────────────────────────────

export function storeKey(slug: string): string {
  return `store:${slug}`;
}

export function metaKey(slug: string): string {
  return `meta:${slug}`;
}

// ── Minimal slugify (mirrors src/storefront/manifest.ts) ──────────────────────

const TR_MAP: Record<string, string> = {
  ç: 'c', Ç: 'c',
  ğ: 'g', Ğ: 'g',
  ı: 'i', İ: 'i',
  ö: 'o', Ö: 'o',
  ş: 's', Ş: 's',
  ü: 'u', Ü: 'u',
};

function slugify(text: string): string {
  if (!text) return '';
  let s = text.replace(/[çÇğĞıİöÖşŞüÜ]/g, (c) => TR_MAP[c] ?? c);
  s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  s = s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return s;
}

// ── KV operations ─────────────────────────────────────────────────────────────

/**
 * Find a free slug by checking KV for `store:<candidate>`.
 * Tries `base`, `base-2`, `base-3`, …
 * Does NOT write; caller handles persistence.
 */
export async function claimSlug(kv: KVNamespace, desiredBase: string): Promise<string> {
  const base = slugify(desiredBase);
  let candidate = base;
  let n = 2;
  while (true) {
    const existing = await kv.get(storeKey(candidate));
    if (existing === null) return candidate;
    candidate = `${base}-${n++}`;
  }
}

export async function putStore(kv: KVNamespace, slug: string, record: StoreRecord): Promise<void> {
  await kv.put(storeKey(slug), JSON.stringify(record));
}

export async function getStore(kv: KVNamespace, slug: string): Promise<StoreRecord | null> {
  const raw = await kv.get(storeKey(slug));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoreRecord;
  } catch {
    return null;
  }
}

export async function deleteStore(kv: KVNamespace, slug: string): Promise<void> {
  await kv.delete(storeKey(slug));
}
