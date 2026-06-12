// functions/_lib/b2b-buyers.ts
import type { D1Like } from './buyer';

export interface StoreBuyer {
  id: string;
  store_slug: string;
  buyer_name: string;
  access_code: string;
  is_active: number;
  created_at: string;
}

/** Karışıklık yaratmayan karakterler: O, 0, I, 1 dışarıda */
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateAccessCode(): string {
  const buf = new Uint8Array(6);
  crypto.getRandomValues(buf);
  let code = '';
  for (const b of buf) {
    code += CODE_CHARS[b % CODE_CHARS.length];
  }
  return code;
}

export function isValidBuyerCode(code: string): boolean {
  return /^[A-Z2-9]{6}$/.test(code) && !/[O0I1]/.test(code);
}

export async function listBuyers(db: D1Like, storeSlug: string): Promise<StoreBuyer[]> {
  const { results } = await db
    .prepare('SELECT id, store_slug, buyer_name, access_code, is_active, created_at FROM store_buyers WHERE store_slug = ? ORDER BY created_at DESC')
    .bind(storeSlug)
    .all<StoreBuyer>();
  return results;
}

export async function addBuyer(
  db: D1Like,
  storeSlug: string,
  buyerName: string,
  accessCode: string,
  id: string,
  now: string,
): Promise<StoreBuyer> {
  await db
    .prepare('INSERT INTO store_buyers (id, store_slug, buyer_name, access_code, is_active, created_at) VALUES (?, ?, ?, ?, 1, ?)')
    .bind(id, storeSlug, buyerName, accessCode, now)
    .run();
  return { id, store_slug: storeSlug, buyer_name: buyerName, access_code: accessCode, is_active: 1, created_at: now };
}

export async function deleteBuyer(db: D1Like, storeSlug: string, buyerId: string): Promise<void> {
  await db
    .prepare('DELETE FROM store_buyers WHERE id = ? AND store_slug = ?')
    .bind(buyerId, storeSlug)
    .run();
}

export async function findBuyerByCode(
  db: D1Like,
  storeSlug: string,
  accessCode: string,
): Promise<StoreBuyer | null> {
  return db
    .prepare('SELECT id, store_slug, buyer_name, access_code, is_active, created_at FROM store_buyers WHERE store_slug = ? AND access_code = ? AND is_active = 1')
    .bind(storeSlug, accessCode)
    .first<StoreBuyer>();
}

export async function findBuyerById(
  db: D1Like,
  storeSlug: string,
  buyerId: string,
): Promise<StoreBuyer | null> {
  return db
    .prepare('SELECT id, store_slug, buyer_name, access_code, is_active, created_at FROM store_buyers WHERE id = ? AND store_slug = ?')
    .bind(buyerId, storeSlug)
    .first<StoreBuyer>();
}
