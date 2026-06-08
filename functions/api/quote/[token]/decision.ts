/**
 * POST /api/quote/<token>/decision — Müşteri kararı (auth yok; token = yetki).
 * Gövde: { action: 'approve'|'reject'|'revision', signature?, name?, note? }
 * Idempotent: zaten karar verilmişse 409. Süresi dolmuşsa 410.
 */
import type { D1Like } from '../../../_lib/buyer';
import { getApproval, recordDecision, isExpired, type QuoteApprovalStatus } from '../../../_lib/quote-approvals';

interface Env { MARKET_DB: D1Like; }
type Ctx = { request: Request; env: Env; params: { token: string } };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

const ACTION_TO_STATUS: Record<string, Exclude<QuoteApprovalStatus, 'sent'>> = {
  approve: 'approved',
  reject: 'rejected',
  revision: 'revisionRequested',
};

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  if (!ctx.env.MARKET_DB) return json({ error: 'db unavailable' }, 503);

  let body: { action?: string; signature?: string; name?: string; note?: string };
  try {
    body = (await ctx.request.json()) as typeof body;
  } catch {
    return json({ error: 'bad json' }, 400);
  }
  const status = body.action ? ACTION_TO_STATUS[body.action] : undefined;
  if (!status) return json({ error: 'invalid action' }, 400);

  const now = new Date().toISOString();
  const rec = await getApproval(ctx.env.MARKET_DB, ctx.params.token);
  if (!rec) return json({ error: 'not found' }, 404);
  if (isExpired(rec, now)) return json({ error: 'expired' }, 410);

  // Onceden masraflı imzayı sınırla (basit boyut tavanı, ~1.5MB base64).
  const signature = typeof body.signature === 'string' && body.signature.length < 2_000_000
    ? body.signature
    : undefined;

  const ip = ctx.request.headers.get('cf-connecting-ip') ?? undefined;
  const result = await recordDecision(ctx.env.MARKET_DB, ctx.params.token, {
    status,
    signature,
    name: body.name?.slice(0, 200),
    note: body.note?.slice(0, 2000),
    ip,
    at: now,
  });

  if (result === 'missing') return json({ error: 'not found' }, 404);
  if (result === 'already') return json({ error: 'already decided', status: rec.status }, 409);
  return json({ ok: true, status });
}
