/**
 * /api/team/pool/asset/[id]?companyId=&projectId= — asset indir/sil.
 * GET    → { downloadUrl } presigned R2 GET (asset yoksa 404)
 * DELETE → tombstone (editAllProjects VEYA created_by===sub). 200 { ok }
 * 400 | 401 | 403 | 404 | 503
 */
import { requireMembership, type PoolEnv } from '../../../../_lib/pool-authz';
import { getAsset, tombstoneAsset } from '../../../../_lib/pool';
import { presignR2Url } from '../../../../_lib/r2-presign';
import { can } from '../../../../_lib/team';
import { logActivity } from '../../../../_lib/activity-log';

interface Env extends PoolEnv {
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
}
type Ctx = { request: Request; env: Env; params: { id: string } };

const BUCKET = 'photozseo-team-pool';
const DOWNLOAD_TTL = 600;

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

function scope(request: Request): { companyId: string | null; projectId: string | null } {
  const u = new URL(request.url);
  return { companyId: u.searchParams.get('companyId'), projectId: u.searchParams.get('projectId') };
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const { companyId, projectId } = scope(ctx.request);
  if (!companyId || !projectId) return json({ error: 'companyId + projectId required' }, 400);
  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireMembership(ctx.request, ctx.env, companyId, nowSec);
  if (auth instanceof Response) return auth;

  const a = await getAsset(ctx.env.MARKET_DB!, companyId, projectId, ctx.params.id);
  if (!a) return json({ error: 'Not found' }, 404);
  if (!ctx.env.R2_ACCOUNT_ID || !ctx.env.R2_ACCESS_KEY_ID || !ctx.env.R2_SECRET_ACCESS_KEY) {
    return json({ error: 'R2 not configured' }, 503);
  }

  const downloadUrl = await presignR2Url(
    { accountId: ctx.env.R2_ACCOUNT_ID, accessKeyId: ctx.env.R2_ACCESS_KEY_ID, secretAccessKey: ctx.env.R2_SECRET_ACCESS_KEY, bucket: BUCKET },
    { method: 'GET', key: a.r2_key, expiresSeconds: DOWNLOAD_TTL },
  );
  return json({ downloadUrl, r2Key: a.r2_key });
}

export async function onRequestDelete(ctx: Ctx): Promise<Response> {
  const { companyId, projectId } = scope(ctx.request);
  if (!companyId || !projectId) return json({ error: 'companyId + projectId required' }, 400);
  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireMembership(ctx.request, ctx.env, companyId, nowSec);
  if (auth instanceof Response) return auth;

  const a = await getAsset(ctx.env.MARKET_DB!, companyId, projectId, ctx.params.id);
  if (!a) return json({ error: 'Not found' }, 404);
  if (!can(auth.role, 'editAllProjects') && a.created_by !== auth.sub) return json({ error: 'Forbidden' }, 403);

  const body = await ctx.request.json().catch(() => null) as { deletedAt?: string } | null;
  const deletedAt = body?.deletedAt ?? new Date().toISOString();
  await tombstoneAsset(ctx.env.MARKET_DB!, { companyId, projectId, assetId: ctx.params.id, deletedAt, modifiedAt: deletedAt });

  try {
    await logActivity(ctx.env.MARKET_DB!, {
      companyId,
      eventType: 'asset_deleted',
      actorSub: auth.sub,
      actorEmail: auth.email,
      targetSub: null,
      targetRef: ctx.params.id,
      meta: { projectId },
      now: new Date().toISOString(),
    });
  } catch {}

  return json({ ok: true });
}
