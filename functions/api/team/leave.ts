/**
 * POST /api/team/leave — oturum sahibi kendi üyeliğini siler (şirketten ayrılır).
 *  - admin/employee her zaman ayrılabilir
 *  - owner yalnız başka owner varsa ayrılabilir; son owner ise engellenir
 *    (önce şirketi silmeli veya sahipliği devretmeli — ayrı flow)
 * Gövde: JSON { companyId }
 * 200 { ok: true } | 400 | 401 | 403 | 404 | 503
 */
import { resolveMember } from '../../_lib/team-session';
import { getMembership, removeMembership, countOwners } from '../../_lib/team';
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

  const body = await ctx.request.json().catch(() => null) as { companyId?: string } | null;
  const companyId = body?.companyId;
  if (!companyId) return json({ error: 'companyId required' }, 400);

  const my = await getMembership(ctx.env.MARKET_DB, companyId, member.sub);
  if (!my) return json({ error: 'Not a member' }, 404);

  if (my.role === 'owner' && (await countOwners(ctx.env.MARKET_DB, companyId)) <= 1) {
    return json({ error: 'Last owner cannot leave; delete or transfer the company first' }, 403);
  }

  await removeMembership(ctx.env.MARKET_DB, companyId, member.sub);
  return json({ ok: true });
}
