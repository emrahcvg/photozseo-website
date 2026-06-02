/**
 * /api/store/<slug>/favorites — anonim alıcı favori ucu (P1).
 * Sahip kimliği x-device-id header'ından gelen cihaz UUID'sidir (owner_key = "d:<uuid>").
 * Public uç (write-key yok); sahip yalnız kendi cihaz anahtarını okur/yazar.
 */
import {
  ownerKeyFromDevice, isValidSlug, listFavorites, addFavorite, removeFavorite, type D1Like,
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
  const favorites = await listFavorites(ctx.env.MARKET_DB, owner, ctx.params.slug);
  return json({ favorites });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const owner = resolveOwner(ctx.request);
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
  const owner = resolveOwner(ctx.request);
  if (!owner) return json({ error: 'device id required' }, 400);
  if (!isValidSlug(ctx.params.slug)) return json({ error: 'bad slug' }, 400);
  const body = (await ctx.request.json().catch(() => null)) as { productSlug?: string } | null;
  if (!body || !body.productSlug || !isValidSlug(body.productSlug)) {
    return json({ error: 'bad productSlug' }, 400);
  }
  await removeFavorite(ctx.env.MARKET_DB, owner, ctx.params.slug, body.productSlug);
  return json({ ok: true });
}
