// functions/api/store/[slug]/b2b/auth.ts
/**
 * POST /api/store/:slug/b2b/auth
 * Body: { access_code: string }
 * Başarılı: buyer bilgisi + httpOnly cookie (b2b_<slug>, 24 saat)
 * Rate limit: KV ile 5 hatalı deneme / 15 dk / IP
 */
import { findBuyerByCode, isValidBuyerCode } from '../../../../_lib/b2b-buyers';

interface Env {
  STORE_KV: KVNamespace;
  MARKET_DB?: D1Database;
}

const VALID_SLUG = /^[a-z0-9][a-z0-9-]{0,98}[a-z0-9]$|^[a-z0-9]$/;
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 15 * 60;

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...extraHeaders },
  });
}

async function checkRateLimit(kv: KVNamespace, ip: string, slug: string): Promise<boolean> {
  const key = `b2b_rl:${slug}:${ip}`;
  const raw = await kv.get(key);
  const count = raw ? parseInt(raw, 10) : 0;
  if (count >= RATE_LIMIT) return false;
  await kv.put(key, String(count + 1), { expirationTtl: RATE_WINDOW_SECONDS });
  return true;
}

async function clearRateLimit(kv: KVNamespace, ip: string, slug: string): Promise<void> {
  await kv.delete(`b2b_rl:${slug}:${ip}`);
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const slug = ctx.params.slug as string;
  if (!VALID_SLUG.test(slug)) return json({ error: 'Invalid slug' }, 400);

  const db = ctx.env.MARKET_DB;
  if (!db) return json({ error: 'DB not configured' }, 503);

  const ip = ctx.request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const allowed = await checkRateLimit(ctx.env.STORE_KV, ip, slug);
  if (!allowed) return json({ error: 'Too many attempts, try again later' }, 429);

  let body: { access_code?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const code = (body.access_code ?? '').toUpperCase().trim();
  if (!isValidBuyerCode(code)) return json({ error: 'Invalid code format' }, 400);

  const buyer = await findBuyerByCode(db, slug, code);
  if (!buyer) return json({ error: 'Invalid access code' }, 401);

  await clearRateLimit(ctx.env.STORE_KV, ip, slug);

  const cookieName = `b2b_${slug}`;
  const cookieValue = buyer.id;
  const maxAge = 24 * 60 * 60;

  return json(
    { buyer_id: buyer.id, buyer_name: buyer.buyer_name },
    200,
    {
      'Set-Cookie': `${cookieName}=${cookieValue}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Lax`,
    }
  );
};
