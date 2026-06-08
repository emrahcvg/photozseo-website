/**
 * GET /api/team/me — oturumun üyeliklerini döner (şirket + rol listesi).
 * Oturum yoksa: 200 { loggedIn: false }  (client UI kararı için, 401 değil)
 * Oturum varsa: 200 { loggedIn: true, sub, email, memberships: [{ companyId, role, ... }] }
 */
import { resolveMember } from '../../_lib/team-session';
import { listMemberships } from '../../_lib/team';
import type { D1Like } from '../../_lib/buyer';

interface Env { STORE_WRITE_KEY?: string; MARKET_DB?: D1Like; }
type Ctx = { request: Request; env: Env };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  if (!ctx.env.STORE_WRITE_KEY || !ctx.env.MARKET_DB) return json({ loggedIn: false });

  const nowSec = Math.floor(Date.now() / 1000);
  const member = await resolveMember(ctx.request, ctx.env, nowSec);
  if (!member) return json({ loggedIn: false });

  const memberships = await listMemberships(ctx.env.MARKET_DB, member.sub);
  return json({ loggedIn: true, sub: member.sub, email: member.email, memberships });
}
