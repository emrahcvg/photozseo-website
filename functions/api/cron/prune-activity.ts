import { pruneLogs } from '../../_lib/activity-log';
import type { D1Like } from '../../_lib/buyer';

interface Env { MARKET_DB?: D1Like; }
type Ctx = { request: Request; env: Env };

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  if (!ctx.env.MARKET_DB) {
    return new Response(JSON.stringify({ error: 'DB not configured' }), { status: 503 });
  }
  const cutoff = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
  await pruneLogs(ctx.env.MARKET_DB, cutoff);
  return new Response(JSON.stringify({ ok: true, cutoff }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
