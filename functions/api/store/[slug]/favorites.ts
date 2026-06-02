/**
 * /api/store/<slug>/favorites — alıcı favori ucu (P1+).
 * Sahip kimliği: önce Google oturumu (b:<sub>), yoksa cihaz UUID (d:<uuid>).
 * Public uç; sahip yalnız kendi anahtarını okur/yazar.
 */
import {
  isValidSlug, listFavorites, addFavorite, removeFavorite, type D1Like,
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
  const favorites = await listFavorites(ctx.env.MARKET_DB, owner, ctx.params.slug);
  return json({ favorites });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const owner = await resolveOwnerKey(ctx.request, ctx.env.STORE_WRITE_KEY, Math.floor(Date.now() / 1000));
  if (!owner) return json({ error: 'device id required' }, 400);
  if (!isValidSlug(ctx.params.slug)) return json({ error: 'bad slug' }, 400);
  const body = (await ctx.request.json().catch(() => null)) as { productSlug?: string } | null;
  if (!body || !body.productSlug || !isValidSlug(body.productSlug)) {
    return json({ error: 'bad productSlug' }, 400);
  }
  await addFavorite(ctx.env.MARKET_DB, owner, ctx.params.slug, body.productSlug, new Date().toISOString());
  return json({ ok: true });
}

export async function onRequestDelete(ctx: Ctx): Promise<Response> {
  const owner = await resolveOwnerKey(ctx.request, ctx.env.STORE_WRITE_KEY, Math.floor(Date.now() / 1000));
  if (!owner) return json({ error: 'device id required' }, 400);
  if (!isValidSlug(ctx.params.slug)) return json({ error: 'bad slug' }, 400);
  const body = (await ctx.request.json().catch(() => null)) as { productSlug?: string } | null;
  if (!body || !body.productSlug || !isValidSlug(body.productSlug)) {
    return json({ error: 'bad productSlug' }, 400);
  }
  await removeFavorite(ctx.env.MARKET_DB, owner, ctx.params.slug, body.productSlug);
  return json({ ok: true });
}
