/**
 * POST /api/team/pool/upload-url — asset için presigned R2 PUT URL + metadata upsert.
 * Gövde: { companyId, projectId, assetId, ext, modifiedAt, snapshot }
 * 200 { uploadUrl, r2Key } | 400 | 401 | 403 | 503
 */
import { requireMembership, type PoolEnv } from '../../../_lib/pool-authz';
import { upsertAsset } from '../../../_lib/pool';
import { r2KeyForAsset, isSafeKeySegment, presignR2Url } from '../../../_lib/r2-presign';

interface Env extends PoolEnv {
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
}
type Ctx = { request: Request; env: Env };

const BUCKET = 'photozseo-team-pool';
const UPLOAD_TTL = 900;

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const body = await ctx.request.json().catch(() => null) as
    { companyId?: string; projectId?: string; assetId?: string; ext?: string; modifiedAt?: string; snapshot?: unknown } | null;
  if (!body?.companyId || !body.projectId || !body.assetId || !body.ext || !body.modifiedAt || body.snapshot === undefined) {
    return json({ error: 'companyId, projectId, assetId, ext, modifiedAt, snapshot required' }, 400);
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireMembership(ctx.request, ctx.env, body.companyId, nowSec);
  if (auth instanceof Response) return auth;

  if (!isSafeKeySegment(body.projectId) || !isSafeKeySegment(body.assetId) || !isSafeKeySegment(body.ext)) {
    return json({ error: 'unsafe id/ext' }, 400);
  }
  if (!ctx.env.R2_ACCOUNT_ID || !ctx.env.R2_ACCESS_KEY_ID || !ctx.env.R2_SECRET_ACCESS_KEY) {
    return json({ error: 'R2 not configured' }, 503);
  }

  const r2Key = r2KeyForAsset(body.companyId, body.projectId, body.assetId, body.ext);

  await upsertAsset(ctx.env.MARKET_DB!, {
    companyId: body.companyId, projectId: body.projectId, assetId: body.assetId, r2Key, createdBy: auth.sub,
    modifiedAt: body.modifiedAt, snapshot: JSON.stringify(body.snapshot),
  });

  const uploadUrl = await presignR2Url(
    { accountId: ctx.env.R2_ACCOUNT_ID, accessKeyId: ctx.env.R2_ACCESS_KEY_ID, secretAccessKey: ctx.env.R2_SECRET_ACCESS_KEY, bucket: BUCKET },
    { method: 'PUT', key: r2Key, expiresSeconds: UPLOAD_TTL },
  );

  return json({ uploadUrl, r2Key });
}
