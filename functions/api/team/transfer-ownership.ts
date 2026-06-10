/**
 * POST /api/team/transfer-ownership — sahipliği başka bir üyeye devreder.
 * Yalnızca mevcut owner. Tek-owner modeli: hedef owner olur, çağıran admin'e iner.
 * Kurallar: çağıran owner olmalı, hedef mevcut üye olmalı, kendine devredemez.
 * Gövde: JSON { companyId, sub }
 * 200 { ok: true } | 400 | 401 | 403 | 404 | 503
 */
import { resolveMember } from '../../_lib/team-session';
import { getMembership, transferOwnership } from '../../_lib/team';
import type { D1Like } from '../../_lib/buyer';

interface Env { STORE_WRITE_KEY?: string; MARKET_DB?: D1Like; }
type Ctx = { request: Request; env: Env };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  if (!ctx.env.STORE_WRITE_KEY) return json({ error: 'Team service not configured' }, 503);
  if (!ctx.env.MARKET_DB) return json({ error: 'DB not configured' }, 503);

  const nowSec = Math.floor(Date.now() / 1000);
  const member = await resolveMember(ctx.request, ctx.env, nowSec);
  if (!member) return json({ error: 'Unauthorized' }, 401);

  const body = await ctx.request.json().catch(() => null) as { companyId?: string; sub?: string } | null;
  const companyId = body?.companyId;
  const targetSub = body?.sub;
  if (!companyId || !targetSub) return json({ error: 'companyId + sub required' }, 400);

  if (targetSub === member.sub) return json({ error: 'Cannot transfer to yourself' }, 400);

  const my = await getMembership(ctx.env.MARKET_DB, companyId, member.sub);
  if (!my || my.role !== 'owner') return json({ error: 'Only the owner can transfer ownership' }, 403);

  const target = await getMembership(ctx.env.MARKET_DB, companyId, targetSub);
  if (!target) return json({ error: 'Member not found' }, 404);

  await transferOwnership(ctx.env.MARKET_DB, companyId, member.sub, targetSub);
  return json({ ok: true });
}
