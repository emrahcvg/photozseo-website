/**
 * POST /api/team/pool/assign — proje batch atama.
 * Yetki: owner/admin (manageMembers).
 */
import { requireMembership, type PoolEnv } from '../../../_lib/pool-authz';
import { assignProjects } from '../../../_lib/pool';
import { can } from '../../../_lib/team';

type Ctx = { request: Request; env: PoolEnv };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const nowSec = Math.floor(Date.now() / 1000);

  const body = await ctx.request.json().catch(() => null) as {
    companyId?: string;
    assignments?: { projectId: string; assignTo: string | null; status?: string }[];
  } | null;

  if (!body?.companyId) return json({ error: 'companyId required' }, 400);
  if (!Array.isArray(body.assignments) || body.assignments.length === 0)
    return json({ error: 'assignments required' }, 400);
  if (body.assignments.length > 500)
    return json({ error: 'max 500 assignments per request' }, 400);

  const auth = await requireMembership(ctx.request, ctx.env, body.companyId, nowSec);
  if (auth instanceof Response) return auth;

  if (!can(auth.role, 'manageMembers')) return json({ error: 'Forbidden' }, 403);

  await assignProjects(
    ctx.env.MARKET_DB!,
    body.assignments.map((a) => ({
      companyId: body.companyId!,
      projectId: a.projectId,
      assignTo: a.assignTo,
      status: a.status,
    }))
  );

  return json({ ok: true, updated: body.assignments.length });
}
