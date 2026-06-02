/**
 * /api/store/<slug>/cart — alıcı sepet ucu (P1+).
 * Sahip kimliği: önce Google oturumu (b:<sub>), yoksa cihaz UUID (d:<uuid>).
 * Public uç. GET: sepet kalemleri. PUT: tek kalem set (qty<=0 siler).
 */
import {
  isValidSlug, getCart, setCartItem, type D1Like,
} from '../../../_lib/buyer';
import { resolveOwnerKey } from '../../../_lib/buyer-owner';

interface Env { MARKET_DB: D1Like; STORE_WRITE_KEY?: string; }
type Ctx = { request: Request; env: Env; params: { slug: string } };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const owner = await resolveOwnerKey(ctx.request, ctx.env.STORE_WRITE_KEY, Math.floor(Date.now() / 1000));
  if (!owner) return json({ error: 'device id required' }, 400);
  if (!isValidSlug(ctx.params.slug)) return json({ error: 'bad slug' }, 400);
  const items = await getCart(ctx.env.MARKET_DB, owner, ctx.params.slug);
  return json({ items });
}

export async function onRequestPut(ctx: Ctx): Promise<Response> {
  const owner = await resolveOwnerKey(ctx.request, ctx.env.STORE_WRITE_KEY, Math.floor(Date.now() / 1000));
  if (!owner) return json({ error: 'device id required' }, 400);
  if (!isValidSlug(ctx.params.slug)) return json({ error: 'bad slug' }, 400);
  const body = (await ctx.request.json().catch(() => null)) as { productSlug?: string; qty?: unknown } | null;
  if (!body || !body.productSlug || !isValidSlug(body.productSlug)) {
    return json({ error: 'bad productSlug' }, 400);
  }
  if (typeof body.qty !== 'number' || !Number.isFinite(body.qty)) {
    return json({ error: 'bad qty' }, 400);
  }
  const qty = Math.min(Math.floor(body.qty), 9999); // üst sınır taşma/abuse engeli
  await setCartItem(ctx.env.MARKET_DB, owner, ctx.params.slug, body.productSlug, qty, new Date().toISOString());
  return json({ ok: true });
}
