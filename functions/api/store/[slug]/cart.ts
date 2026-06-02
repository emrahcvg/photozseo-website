/**
 * /api/store/<slug>/cart — anonim alıcı sepet ucu (P1).
 * Sahip kimliği x-device-id header'ından (owner_key = "d:<uuid>"). Public uç.
 * GET: sepet kalemleri. PUT: tek kalem set (qty<=0 siler).
 */
import {
  ownerKeyFromDevice, isValidSlug, getCart, setCartItem, type D1Like,
} from '../../../_lib/buyer';

interface Env { MARKET_DB: D1Like; }
type Ctx = { request: Request; env: Env; params: { slug: string } };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

function resolveOwner(request: Request): string | null {
  return ownerKeyFromDevice(request.headers.get('x-device-id') ?? '');
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const owner = resolveOwner(ctx.request);
  if (!owner) return json({ error: 'device id required' }, 400);
  if (!isValidSlug(ctx.params.slug)) return json({ error: 'bad slug' }, 400);
  const items = await getCart(ctx.env.MARKET_DB, owner, ctx.params.slug);
  return json({ items });
}

export async function onRequestPut(ctx: Ctx): Promise<Response> {
  const owner = resolveOwner(ctx.request);
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
