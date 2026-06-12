/**
 * POST /api/team/invite — davet kodu üret. Yalnızca manageMembers yetkisi olan rol (owner/admin).
 * Gövde: JSON { companyId, role }  (role: 'admin' | 'employee')
 * 200 { ok, code, expiresAt } | 400 | 401 | 403 | 503
 */
import { resolveMember } from '../../_lib/team-session';
import { getMembership, createInvite, randomInviteCode, can, type Role } from '../../_lib/team';
import { logActivity } from '../../_lib/activity-log';
import type { D1Like } from '../../_lib/buyer';

interface Env { STORE_WRITE_KEY?: string; MARKET_DB?: D1Like; }
type Ctx = { request: Request; env: Env };

const INVITE_TTL_DAYS = 7;

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  if (!ctx.env.STORE_WRITE_KEY) return json({ error: 'Team service not configured' }, 503);
  if (!ctx.env.MARKET_DB) return json({ error: 'DB not configured' }, 503);

  const nowSec = Math.floor(Date.now() / 1000);
  const member = await resolveMember(ctx.request, ctx.env, nowSec);
  if (!member) return json({ error: 'Unauthorized' }, 401);

  const body = await ctx.request.json().catch(() => null) as { companyId?: string; role?: string } | null;
  const companyId = body?.companyId;
  const role = body?.role as Role | undefined;
  if (!companyId || (role !== 'admin' && role !== 'employee')) {
    return json({ error: "companyId + role ('admin'|'employee') required" }, 400);
  }

  const my = await getMembership(ctx.env.MARKET_DB, companyId, member.sub);
  if (!my || !can(my.role, 'manageMembers')) return json({ error: 'Forbidden' }, 403);

  const code = randomInviteCode((n) => crypto.getRandomValues(new Uint8Array(n)));
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 86400_000).toISOString();
  await createInvite(ctx.env.MARKET_DB, { code, companyId, role, createdBy: member.sub, now, expiresAt });

  try {
    await logActivity(ctx.env.MARKET_DB, {
      companyId,
      eventType: 'member_invited',
      actorSub: member.sub,
      actorEmail: member.email,
      targetSub: null,
      targetRef: null,
      meta: { role, code },
      now: new Date().toISOString(),
    });
  } catch {}

  return json({ ok: true, code, expiresAt });
}
