/**
 * GET  /api/orders — Giriş yapmış kullanıcının (veya anonim cihazın) sipariş listesini döner.
 * POST /api/orders — Yeni sipariş oluşturur; IBAN/banka havalesi ödeme bilgisi döner.
 * Kimlik yoksa GET boş liste döner (401 yerine graceful fallback).
 */
import { resolveOwnerKey } from '../_lib/buyer-owner';
import { listOrders, createOrder } from '../_lib/orders';
import type { D1Like } from '../_lib/buyer';

interface Env { MARKET_DB: D1Like; STORE_WRITE_KEY?: string; STORE_IBAN?: string; }
type Ctx = { request: Request; env: Env };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  if (!ctx.env.MARKET_DB) return json({ orders: [] });

  const owner = await resolveOwnerKey(ctx.request, ctx.env.STORE_WRITE_KEY, Math.floor(Date.now() / 1000));
  if (!owner) return json({ orders: [] });

  const orders = await listOrders(ctx.env.MARKET_DB, owner);
  return json({ orders });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  if (!ctx.env.MARKET_DB) return json({ error: 'Service unavailable' }, 503);

  let body: unknown;
  try { body = await ctx.request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const b = body as Record<string, unknown>;
  const store_slug = typeof b.store_slug === 'string' ? b.store_slug.trim() : '';
  if (!store_slug) return json({ error: 'store_slug required' }, 400);

  const items = Array.isArray(b.items)
    ? (b.items as Array<{ product_id?: string; qty?: number; price?: number }>)
    : [];
  if (items.length === 0) return json({ error: 'items required' }, 400);

  const currency = typeof b.currency === 'string' ? b.currency : 'USD';
  const buyer_note = typeof b.buyer_note === 'string' ? b.buyer_note : undefined;
  const total = items.reduce((s, x) => s + (typeof x.price === 'number' ? x.price * (x.qty ?? 1) : 0), 0);

  const order_id = crypto.randomUUID().slice(0, 8);
  const created_at = new Date().toISOString();
  const owner_key = (await resolveOwnerKey(ctx.request, ctx.env.STORE_WRITE_KEY, Math.floor(Date.now() / 1000))) ?? 'd:anon';

  await createOrder(ctx.env.MARKET_DB, {
    id: order_id,
    owner_key,
    store_slug,
    store_name: typeof b.store_name === 'string' ? b.store_name : undefined,
    items: items.map((x) => ({
      productSlug: x.product_id as string,
      qty: x.qty ?? 1,
      price: x.price,
      currency,
    })),
    item_count: items.length,
    total,
    currency,
    status: 'pending',
    created_at,
    ...(buyer_note ? { buyer_note } : {}),
  });

  const iban = ctx.env.STORE_IBAN ?? 'TR000000000000000000000000';
  return json({
    order_id,
    status: 'pending',
    payment: {
      method: 'bank_transfer',
      iban,
      amount: total,
      currency,
      instructions: 'Sipariş no: ' + order_id,
    },
  });
}
