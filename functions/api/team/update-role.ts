import { resolveMember } from '../../_lib/team-session';
import { getMembership, updateMembershipRole, can, ROLES } from '../../_lib/team';
import { logActivity } from '../../_lib/activity-log';
import type { Role } from '../../_lib/team';
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

  const body = await ctx.request.json().catch(() => null) as { companyId?: string; sub?: string; role?: string } | null;
  const companyId = body?.companyId;
  const targetSub = body?.sub;
  const role = body?.role;
  if (!companyId || !targetSub || !role) return json({ error: 'companyId + sub + role required' }, 400);

  if (!ROLES.includes(role as Role) || role === 'owner') {
    return json({ error: 'role must be admin or employee' }, 400);
  }

  if (targetSub === member.sub) {
    return json({ error: 'Cannot change your own role' }, 400);
  }

  const my = await getMembership(ctx.env.MARKET_DB, companyId, member.sub);
  if (!my || !can(my.role, 'manageMembers')) return json({ error: 'Forbidden' }, 403);

  const target = await getMembership(ctx.env.MARKET_DB, companyId, targetSub);
  if (!target) return json({ error: 'Member not found' }, 404);

  if (target.role === 'owner') return json({ error: 'Owner role cannot be changed' }, 403);
  if (my.role === 'admin' && target.role === 'admin') {
    return json({ error: 'Admins cannot change other admins' }, 403);
  }

  await updateMembershipRole(ctx.env.MARKET_DB, companyId, targetSub, role as Role);

  try {
    await logActivity(ctx.env.MARKET_DB, {
      companyId,
      eventType: 'member_role_changed',
      actorSub: member.sub,
      actorEmail: member.email,
      targetSub,
      targetRef: null,
      meta: { from: target.role, to: role },
      now: new Date().toISOString(),
    });
  } catch {}

  return json({ ok: true });
}
