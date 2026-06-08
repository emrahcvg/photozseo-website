/**
 * POST /api/team/create — yeni şirket oluştur; çağıran owner olur.
 * Gövde: JSON { name }
 * 200 { ok, companyId, role } | 400 (name yok) | 401 (oturum yok) | 503 (yapılandırılmamış)
 */
import { resolveMember } from '../../_lib/team-session';
import { createCompany } from '../../_lib/team';
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

  const body = await ctx.request.json().catch(() => null) as { name?: string } | null;
  const name = body?.name?.trim();
  if (!name || name.length > 80) return json({ error: 'name required (<=80)' }, 400);

  const companyId = 'c:' + crypto.randomUUID();
  const now = new Date().toISOString();
  await createCompany(ctx.env.MARKET_DB, {
    companyId, name, ownerSub: member.sub, email: member.email, ownerName: member.name ?? null, now,
  });

  return json({ ok: true, companyId, role: 'owner' });
}
