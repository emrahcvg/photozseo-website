/**
 * GET /api/team/pool/manifest?companyId=&since= — delta pull.
 * Üye olunan şirkette modified_at > since olan projeleri döner.
 * 200 { projects:[{projectId,modifiedAt,deletedAt}], cursor } | 400 | 401 | 403 | 503
 */
import { requireMembership, type PoolEnv } from '../../../_lib/pool-authz';
import { projectsSince } from '../../../_lib/pool';

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
  const projects = await projectsSince(ctx.env.MARKET_DB!, companyId, since);
  const cursor = projects.length ? projects[projects.length - 1].modifiedAt : since;
  return json({ projects, cursor });
}
