/**
 * POST /api/team/remove-member — bir üyeyi şirketten çıkarır.
 * Yalnızca manageMembers yetkisi olan rol (owner/admin). Kurallar:
 *  - owner çıkarılamaz (önce şirket silinir/devredilir)
 *  - admin yalnız employee çıkarabilir (admin/owner'a dokunamaz); owner admin+employee çıkarabilir
 *  - kendini çıkaramaz (bunun için /api/team/leave)
 * Gövde: JSON { companyId, sub }
 * 200 { ok: true } | 400 | 401 | 403 | 404 | 503
 */
import { resolveMember } from '../../_lib/team-session';
import { getMembership, removeMembership, can } from '../../_lib/team';
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

  const body = await ctx.request.json().catch(() => null) as { companyId?: string; sub?: string } | null;
  const companyId = body?.companyId;
  const targetSub = body?.sub;
  if (!companyId || !targetSub) return json({ error: 'companyId + sub required' }, 400);

  if (targetSub === member.sub) {
    return json({ error: 'Use /api/team/leave to remove yourself' }, 400);
  }

  const my = await getMembership(ctx.env.MARKET_DB, companyId, member.sub);
  if (!my || !can(my.role, 'manageMembers')) return json({ error: 'Forbidden' }, 403);

  const target = await getMembership(ctx.env.MARKET_DB, companyId, targetSub);
  if (!target) return json({ error: 'Member not found' }, 404);

  // Owner asla çıkarılamaz; admin yalnız employee çıkarabilir.
  if (target.role === 'owner') return json({ error: 'Owner cannot be removed' }, 403);
  if (my.role === 'admin' && target.role === 'admin') {
    return json({ error: 'Admins cannot remove other admins' }, 403);
  }

  await removeMembership(ctx.env.MARKET_DB, companyId, targetSub);

  try {
    await logActivity(ctx.env.MARKET_DB, {
      companyId,
      eventType: 'member_removed',
      actorSub: member.sub,
      actorEmail: member.email,
      targetSub,
      targetRef: null,
      meta: null,
      now: new Date().toISOString(),
    });
  } catch {}

  return json({ ok: true });
}
