/**
 * POST /api/team/join — davet kodunu kullan, üye ol.
 * Gövde: JSON { code }
 * 200 { ok, companyId, role } | 400 | 401 | 409 (kullanılmaz: süre/used/already) | 503
 */
import { resolveMember } from '../../_lib/team-session';
import { redeemInvite, isValidInviteCode } from '../../_lib/team';
import { logActivity } from '../../_lib/activity-log';
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

  const body = await ctx.request.json().catch(() => null) as { code?: string } | null;
  const code = body?.code?.trim() ?? '';
  if (!isValidInviteCode(code)) return json({ error: 'invalid code format' }, 400);

  const now = new Date().toISOString();
  const result = await redeemInvite(ctx.env.MARKET_DB, {
    code, userSub: member.sub, email: member.email, name: member.name ?? null, now,
  });

  if (!result.ok) return json({ error: result.reason }, 409);

  try {
    await logActivity(ctx.env.MARKET_DB, {
      companyId: result.companyId,
      eventType: 'member_added',
      actorSub: member.sub,
      actorEmail: member.email,
      targetSub: null,
      targetRef: null,
      meta: { role: result.role },
      now: new Date().toISOString(),
    });
  } catch {}

  return json({ ok: true, companyId: result.companyId, role: result.role });
}
