/**
 * pool-authz.ts — pool endpoint'leri için oturum + şirket üyeliği guard'ı.
 * Başarılı: { sub, email, role } döner. Başarısız: doğrudan döndürülecek Response.
 */
import { resolveMember } from './team-session';
import { getMembership, type Role } from './team';
import type { D1Like } from './buyer';

export interface PoolEnv {
  STORE_WRITE_KEY?: string;
  MARKET_DB?: D1Like;
}

export interface MemberCtx {
  sub: string;
  email: string;
  role: Role;
}

function json(obj: unknown, status: number): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

/**
 * Oturumu çözer ve çağıranın companyId'de üye olduğunu doğrular.
 * @returns MemberCtx (yetkili) veya Response (401/403/503).
 */
export async function requireMembership(
  request: Request,
  env: PoolEnv,
  companyId: string,
  nowSec: number,
): Promise<MemberCtx | Response> {
  if (!env.STORE_WRITE_KEY || !env.MARKET_DB) return json({ error: 'Pool service not configured' }, 503);

  const member = await resolveMember(request, env, nowSec);
  if (!member) return json({ error: 'Unauthorized' }, 401);

  const m = await getMembership(env.MARKET_DB, companyId, member.sub);
  if (!m) return json({ error: 'Forbidden' }, 403);

  return { sub: member.sub, email: member.email, role: m.role };
}
