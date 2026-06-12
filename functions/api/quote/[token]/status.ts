/**
 * GET /api/quote/<token>/status — Satıcı teklif durumunu poll eder.
 * Yalnızca yayınlayan owner_key eşleşirse döner (gizlilik); aksi halde 404.
 * Yanıt: { status, signed_at?, customer_signed_name?, revision_note? }
 */
import type { D1Like } from '../../../_lib/buyer';
import { resolveOwnerKey } from '../../../_lib/buyer-owner';
import { getApproval } from '../../../_lib/quote-approvals';

interface Env { MARKET_DB: D1Like; STORE_WRITE_KEY?: string; }
type Ctx = { request: Request; env: Env; params: { token: string } };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  if (!ctx.env.MARKET_DB) return json({ error: 'db unavailable' }, 503);

  const owner = await resolveOwnerKey(ctx.request, ctx.env.STORE_WRITE_KEY, Math.floor(Date.now() / 1000));
  if (!owner) return json({ error: 'identity required' }, 400);

  const rec = await getApproval(ctx.env.MARKET_DB, ctx.params.token);
  // Sahip eşleşmezse varlığı sızdırma — 404.
  if (!rec || rec.owner_key !== owner) return json({ error: 'not found' }, 404);

  return json({
    status: rec.status,
    signed_at: rec.signed_at ?? null,
    customer_signed_name: rec.customer_signed_name ?? null,
    revision_note: rec.revision_note ?? null,
  });
}
