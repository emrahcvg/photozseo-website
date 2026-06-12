/**
 * GET /api/team/activity — şirketin aktivite logunu sayfalı döner.
 * Query: companyId (zorunlu), limit (default 30, max 50), cursor (opsiyonel ISO)
 * Sadece owner erişebilir.
 * 200 { items: [...], nextCursor: string | null } | 400 | 401 | 403 | 503
 *
 * POST /api/team/activity — export_completed olayı loglar.
 * Body: { companyId, eventType: 'export_completed', meta? }
 * 201 | 400 | 401 | 403 | 503
 */
import { resolveMember } from '../../_lib/team-session';
import { getMembership } from '../../_lib/team';
import { logActivity } from '../../_lib/activity-log';
import type { D1Like } from '../../_lib/buyer';

interface Env { STORE_WRITE_KEY?: string; MARKET_DB?: D1Like; }
type Ctx = { request: Request; env: Env };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  if (!ctx.env.STORE_WRITE_KEY) return json({ error: 'Team service not configured' }, 503);
  if (!ctx.env.MARKET_DB) return json({ error: 'DB not configured' }, 503);

  const nowSec = Math.floor(Date.now() / 1000);
  const member = await resolveMember(ctx.request, ctx.env, nowSec);
  if (!member) return json({ error: 'Unauthorized' }, 401);

  const url = new URL(ctx.request.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) return json({ error: 'companyId required' }, 400);

  const my = await getMembership(ctx.env.MARKET_DB, companyId, member.sub);
  if (!my || my.role !== 'owner') return json({ error: 'Forbidden' }, 403);

  const rawLimit = parseInt(url.searchParams.get('limit') ?? '30', 10);
  const limit = Math.min(Math.max(1, isNaN(rawLimit) ? 30 : rawLimit), 50);
  const cursor = url.searchParams.get('cursor');

  const fetchLimit = limit + 1;
  const rows = await ctx.env.MARKET_DB
    .prepare(
      cursor
        ? `SELECT id, company_id, event_type, actor_sub, actor_email, target_sub, target_ref, meta, created_at
           FROM team_activity_log
           WHERE company_id = ? AND created_at < ?
           ORDER BY created_at DESC LIMIT ?`
        : `SELECT id, company_id, event_type, actor_sub, actor_email, target_sub, target_ref, meta, created_at
           FROM team_activity_log
           WHERE company_id = ?
           ORDER BY created_at DESC LIMIT ?`
    )
    .bind(...(cursor ? [companyId, cursor, fetchLimit] : [companyId, fetchLimit]))
    .all<{
      id: string; company_id: string; event_type: string;
      actor_sub: string; actor_email: string;
      target_sub: string | null; target_ref: string | null;
      meta: string | null; created_at: string;
    }>();

  const items = rows.results.slice(0, limit).map((r) => ({
    id: r.id,
    eventType: r.event_type,
    actorSub: r.actor_sub,
    actorEmail: r.actor_email,
    targetSub: r.target_sub,
    targetRef: r.target_ref,
    meta: r.meta ? JSON.parse(r.meta) : null,
    createdAt: r.created_at,
  }));

  const hasMore = rows.results.length > limit;
  const nextCursor = hasMore ? items[items.length - 1].createdAt : null;

  return json({ items, nextCursor });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  if (!ctx.env.STORE_WRITE_KEY) return json({ error: 'Team service not configured' }, 503);
  if (!ctx.env.MARKET_DB) return json({ error: 'DB not configured' }, 503);

  const nowSec = Math.floor(Date.now() / 1000);
  const member = await resolveMember(ctx.request, ctx.env, nowSec);
  if (!member) return json({ error: 'Unauthorized' }, 401);

  const body = await ctx.request.json().catch(() => null) as {
    companyId?: string; eventType?: string; meta?: Record<string, unknown>;
  } | null;

  if (!body?.companyId || body.eventType !== 'export_completed') {
    return json({ error: "companyId zorunlu; eventType sadece 'export_completed' kabul edilir" }, 400);
  }

  const my = await getMembership(ctx.env.MARKET_DB, body.companyId, member.sub);
  if (!my) return json({ error: 'Forbidden' }, 403);

  await logActivity(ctx.env.MARKET_DB, {
    companyId: body.companyId,
    eventType: 'export_completed',
    actorSub: member.sub,
    actorEmail: member.email,
    targetSub: null,
    targetRef: null,
    meta: body.meta ?? null,
    now: new Date().toISOString(),
  });

  return new Response(null, { status: 201 });
}
