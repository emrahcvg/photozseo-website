/**
 * /api/team/pool/project/[id]?companyId= — proje senkron.
 * GET    → { project:{...,snapshot:obj}, assets:[...] }   (yoksa 404)
 * PUT    → upsert (LWW). Gövde { modifiedAt, snapshot, deletedAt? }. 200 { ok }
 * DELETE → tombstone. editAllProjects yetkisi VEYA created_by===sub gerekir. 200 { ok }
 * 400 | 401 | 403 | 404 | 503
 */
import { requireMembership, type PoolEnv } from '../../../../_lib/pool-authz';
import { getProject, upsertProject, listAssets, tombstoneProject } from '../../../../_lib/pool';
import { can } from '../../../../_lib/team';

type Ctx = { request: Request; env: PoolEnv; params: { id: string } };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

function companyIdOf(request: Request): string | null {
  return new URL(request.url).searchParams.get('companyId');
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const companyId = companyIdOf(ctx.request);
  if (!companyId) return json({ error: 'companyId required' }, 400);
  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireMembership(ctx.request, ctx.env, companyId, nowSec);
  if (auth instanceof Response) return auth;

  const row = await getProject(ctx.env.MARKET_DB!, companyId, ctx.params.id);
  if (!row) return json({ error: 'Not found' }, 404);
  const assets = await listAssets(ctx.env.MARKET_DB!, companyId, ctx.params.id);
  return json({
    project: { projectId: row.project_id, createdBy: row.created_by, modifiedAt: row.modified_at, deletedAt: row.deleted_at, snapshot: JSON.parse(row.snapshot) },
    assets: assets.map((a) => ({ assetId: a.asset_id, r2Key: a.r2_key, modifiedAt: a.modified_at, deletedAt: a.deleted_at, snapshot: JSON.parse(a.snapshot) })),
  });
}

export async function onRequestPut(ctx: Ctx): Promise<Response> {
  const companyId = companyIdOf(ctx.request);
  if (!companyId) return json({ error: 'companyId required' }, 400);
  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireMembership(ctx.request, ctx.env, companyId, nowSec);
  if (auth instanceof Response) return auth;

  const body = await ctx.request.json().catch(() => null) as { modifiedAt?: string; snapshot?: unknown; deletedAt?: string | null } | null;
  if (!body?.modifiedAt || body.snapshot === undefined) return json({ error: 'modifiedAt + snapshot required' }, 400);

  await upsertProject(ctx.env.MARKET_DB!, {
    companyId, projectId: ctx.params.id, createdBy: auth.sub,
    modifiedAt: body.modifiedAt, snapshot: JSON.stringify(body.snapshot), deletedAt: body.deletedAt ?? null,
  });
  return json({ ok: true });
}

export async function onRequestDelete(ctx: Ctx): Promise<Response> {
  const companyId = companyIdOf(ctx.request);
  if (!companyId) return json({ error: 'companyId required' }, 400);
  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireMembership(ctx.request, ctx.env, companyId, nowSec);
  if (auth instanceof Response) return auth;

  const existing = await getProject(ctx.env.MARKET_DB!, companyId, ctx.params.id);
  if (!existing) return json({ error: 'Not found' }, 404);

  // Silme kuralı: editAllProjects (owner/admin) VEYA projenin sahibi (created_by).
  if (!can(auth.role, 'editAllProjects') && existing.created_by !== auth.sub) {
    return json({ error: 'Forbidden' }, 403);
  }

  const body = await ctx.request.json().catch(() => null) as { deletedAt?: string } | null;
  const deletedAt = body?.deletedAt ?? new Date().toISOString();
  await tombstoneProject(ctx.env.MARKET_DB!, { companyId, projectId: ctx.params.id, deletedAt, modifiedAt: deletedAt });
  return json({ ok: true });
}
