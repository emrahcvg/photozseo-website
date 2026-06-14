/**
 * GET /api/team/pool/manifest?companyId=&since=&assignedTo=me&limit=500
 * Delta pull — embedded snapshot + assets. hasMore ile sayfalama.
 */
import { requireMembership, type PoolEnv } from '../../../_lib/pool-authz';
import { projectsSinceWithSnapshots } from '../../../_lib/pool';

type Ctx = { request: Request; env: PoolEnv };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const url = new URL(ctx.request.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) return json({ error: 'companyId required' }, 400);

  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireMembership(ctx.request, ctx.env, companyId, nowSec);
  if (auth instanceof Response) return auth;

  const since = url.searchParams.get('since') ?? '';

  const limitParam = parseInt(url.searchParams.get('limit') ?? '500', 10);
  const limit = isNaN(limitParam) || limitParam < 1 || limitParam > 500 ? 500 : limitParam;

  const assignedToParam = url.searchParams.get('assignedTo');
  const assignedTo = assignedToParam === 'me'
    ? auth.sub
    : assignedToParam ?? undefined;

  const { entries, hasMore } = await projectsSinceWithSnapshots(
    ctx.env.MARKET_DB!, companyId, since, { assignedTo, limit }
  );

  const cursor = entries.length ? entries[entries.length - 1].modifiedAt : since;
  return json({ projects: entries, cursor, hasMore });
}
