/**
 * quote-approvals.ts — B2B teklif onay akışı (#11 web), D1 üstünde saf veri katmanı.
 * orders.ts pattern'ini izler. Karar (decision) idempotenttir: bir kez
 * approved/rejected/revisionRequested olduktan sonra tekrar yazılmaz.
 */
import type { D1Like } from './buyer';

export type QuoteApprovalStatus = 'sent' | 'approved' | 'rejected' | 'revisionRequested';

/** Müşteriye gösterilecek teklif özeti — iOS publish ederken gönderir. */
export interface QuoteSnapshotLine {
  title: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  unit?: string;
}
export interface QuoteSnapshot {
  documentType: 'quote' | 'proforma';
  quoteNumber: string;
  sellerName?: string;
  customerCompany?: string;
  customerContact?: string;
  currencySymbol: string;
  total: number;
  validityDays?: number;
  deliveryPeriod?: string;
  lines: QuoteSnapshotLine[];
}

export interface QuoteApprovalRecord {
  token: string;
  owner_key: string;
  quote: QuoteSnapshot;
  status: QuoteApprovalStatus;
  customer_signature?: string;
  customer_signed_name?: string;
  revision_note?: string;
  signed_at?: string;
  created_at: string;
  expires_at?: string;
}

/** 128-bit+ tahmin edilemez token (iki randomUUID, tireler atılır). */
export function makeApprovalToken(): string {
  return (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, '');
}

export async function createApproval(
  db: D1Like,
  rec: { token: string; owner_key: string; quote: QuoteSnapshot; created_at: string; expires_at?: string },
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO quote_approvals (token, owner_key, quote_json, status, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
    )
    .bind(rec.token, rec.owner_key, JSON.stringify(rec.quote), 'sent', rec.created_at, rec.expires_at ?? null)
    .run();
}

export async function getApproval(db: D1Like, token: string): Promise<QuoteApprovalRecord | null> {
  const row = await db
    .prepare('SELECT * FROM quote_approvals WHERE token = ?')
    .bind(token)
    .first<{
      token: string;
      owner_key: string;
      quote_json: string;
      status: string;
      customer_signature: string | null;
      customer_signed_name: string | null;
      revision_note: string | null;
      signed_at: string | null;
      created_at: string;
      expires_at: string | null;
    }>();
  if (!row) return null;
  let quote: QuoteSnapshot;
  try {
    quote = JSON.parse(row.quote_json) as QuoteSnapshot;
  } catch {
    return null;
  }
  return {
    token: row.token,
    owner_key: row.owner_key,
    quote,
    status: row.status as QuoteApprovalStatus,
    customer_signature: row.customer_signature ?? undefined,
    customer_signed_name: row.customer_signed_name ?? undefined,
    revision_note: row.revision_note ?? undefined,
    signed_at: row.signed_at ?? undefined,
    created_at: row.created_at,
    expires_at: row.expires_at ?? undefined,
  };
}

/** Süresi dolmuş mu? */
export function isExpired(rec: QuoteApprovalRecord, nowISO: string): boolean {
  return !!rec.expires_at && rec.expires_at < nowISO;
}

/**
 * Müşteri kararını idempotent yazar. Yalnızca 'sent' durumundayken kabul eder;
 * zaten karar verilmişse `already` döner (çağıran 409 üretir).
 */
export async function recordDecision(
  db: D1Like,
  token: string,
  decision: {
    status: Exclude<QuoteApprovalStatus, 'sent'>;
    signature?: string;
    name?: string;
    note?: string;
    ip?: string;
    at: string;
  },
): Promise<'ok' | 'already' | 'missing'> {
  const current = await getApproval(db, token);
  if (!current) return 'missing';
  if (current.status !== 'sent') return 'already';
  await db
    .prepare(
      'UPDATE quote_approvals SET status = ?, customer_signature = ?, customer_signed_name = ?, revision_note = ?, signed_ip = ?, signed_at = ? WHERE token = ? AND status = ?',
    )
    .bind(
      decision.status,
      decision.signature ?? null,
      decision.name ?? null,
      decision.note ?? null,
      decision.ip ?? null,
      decision.at,
      token,
      'sent',
    )
    .run();
  return 'ok';
}
