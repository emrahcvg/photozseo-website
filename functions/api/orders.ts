/**
 * GET /api/orders — Giriş yapmış kullanıcının (veya anonim cihazın) sipariş listesini döner.
 * Kimlik yoksa boş liste döner (401 yerine graceful fallback).
 */
import { resolveOwnerKey } from '../_lib/buyer-owner';
import { listOrders } from '../_lib/orders';
import type { D1Like } from '../_lib/buyer';

interface Env { MARKET_DB: D1Like; STORE_WRITE_KEY?: string; }
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
