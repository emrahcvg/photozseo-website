/**
 * registry.ts — KV registry helpers for P2 storefront slugs.
 * Runs in the Cloudflare Workers runtime.
 */

import type { Manifest } from '../../src/storefront/types';
import { normalizeManifestForWrite } from './taxonomy-migrate';
import legacyMap from '../../src/storefront/taxonomy/legacy-map.json';
import meta from '../../src/storefront/taxonomy/meta.json';

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

export function blockKey(slug: string): string {
  return `blocked:${slug}`;
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
    // Bloklanmış slug "boş" olsa bile (store silinmiş) yeniden alınamaz —
    // banlı satıcı aynı adı tekrar claim edemesin (takedown'dan sonra).
    const blocked = await kv.get(blockKey(candidate));
    if (existing === null && blocked === null) return candidate;
    candidate = `${base}-${n++}`;
  }
}

export async function putStore(kv: KVNamespace, slug: string, record: StoreRecord): Promise<void> {
  // KV'ye yazmadan önce manifest'teki legacy id'leri google id'ye normalize et (graceful).
  let toWrite = record;
  try {
    const tv = (meta as { taxonomyVersion: number }).taxonomyVersion;
    const normalized = normalizeManifestForWrite(record.manifest, legacyMap as Record<string, string>, tv);
    toWrite = { ...record, manifest: normalized };
  } catch { /* taxonomy yoksa ham yaz (graceful) */ }
  await kv.put(storeKey(slug), JSON.stringify(toWrite));
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

// ── Blocklist / takedown (dolandırıcılık karşıtı) ─────────────────────────────

export interface BlockRecord {
  reason?: string;
  blockedAt: string;
  /** Bloğu uygulayan admin (session sub veya 'legacy'). Audit izi. */
  actor?: string;
  /** Bu bloğu tetikleyen şikayet kaydının id'si (reports.id), varsa. */
  reportId?: string;
  /** Mağaza sahibinin Google sub'ı — satıcı-bazlı repeat-infringer izi (slug bloğuna EK). */
  sellerSub?: string;
}

/** blockStore/takedownStore için opsiyonel audit alanları (hepsi geriye uyumlu). */
export interface BlockAudit {
  actor?: string;
  reportId?: string;
  sellerSub?: string;
}

export async function isBlocked(kv: KVNamespace, slug: string): Promise<boolean> {
  return (await kv.get(blockKey(slug))) !== null;
}

export async function blockStore(
  kv: KVNamespace,
  slug: string,
  reason?: string,
  audit?: BlockAudit,
): Promise<void> {
  const record: BlockRecord = {
    reason,
    blockedAt: new Date().toISOString(),
    ...(audit?.actor ? { actor: audit.actor } : {}),
    ...(audit?.reportId ? { reportId: audit.reportId } : {}),
    ...(audit?.sellerSub ? { sellerSub: audit.sellerSub } : {}),
  };
  await kv.put(blockKey(slug), JSON.stringify(record));
}

export async function unblockStore(kv: KVNamespace, slug: string): Promise<void> {
  await kv.delete(blockKey(slug));
}

/**
 * Takedown: mağazayı yayından kaldır VE slug'ı blokla. Tek atomik niyet —
 * banlı satıcı aynı adı tekrar claim/PUT edemez. unblockStore ile geri alınır.
 */
export async function takedownStore(
  kv: KVNamespace,
  slug: string,
  reason?: string,
  audit?: BlockAudit,
): Promise<void> {
  await deleteStore(kv, slug);
  await blockStore(kv, slug, reason, audit);
}
