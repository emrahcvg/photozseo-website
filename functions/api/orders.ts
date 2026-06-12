/**
 * GET  /api/orders — Giriş yapmış kullanıcının (veya anonim cihazın) sipariş listesini döner.
 * POST /api/orders — Yeni sipariş oluşturur; IBAN/banka havalesi ödeme bilgisi döner.
 * Kimlik yoksa GET boş liste döner (401 yerine graceful fallback).
 */
import { resolveOwnerKey } from '../_lib/buyer-owner';
import { listOrders, createOrder } from '../_lib/orders';
import type { D1Like } from '../_lib/buyer';

interface Env { MARKET_DB: D1Like; STORE_WRITE_KEY?: string; STORE_IBAN?: string; RESEND_API_KEY?: string; }
type Ctx = { request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void };

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

  const storeRow = await ctx.env.MARKET_DB
    .prepare('SELECT iban, iban_name, payment_json, owner_email, name FROM stores WHERE slug = ?')
    .bind(store_slug).first<{ iban: string | null; iban_name: string | null; payment_json: string | null; owner_email: string | null; name: string | null }>();

  let paymentInfo: Record<string, unknown>;
  if (storeRow?.payment_json) {
    paymentInfo = JSON.parse(storeRow.payment_json);
  } else if (storeRow?.iban) {
    paymentInfo = { method: 'bank_transfer', iban: storeRow.iban, ibanName: storeRow.iban_name };
  } else {
    paymentInfo = { method: 'bank_transfer', iban: ctx.env.STORE_IBAN ?? 'TR000000000000000000000000' };
  }

  // Satıcıya email bildirimi (best-effort — sipariş yanıtını bloklamaz)
  if (ctx.env.RESEND_API_KEY && storeRow?.owner_email) {
    const itemLines = items
      .map((x) => `• ${x.product_id ?? '-'} × ${x.qty ?? 1}  ${x.price != null ? x.price + ' ' + currency : ''}`)
      .join('\n');
    const emailBody = [
      `New order received: ${order_id}`,
      `Store: ${storeRow.name ?? store_slug}`,
      `Total: ${total.toFixed(2)} ${currency}`,
      '',
      'Items:',
      itemLines,
      '',
      `View orders: https://photozseo.com/market/orders`,
    ].join('\n');
    ctx.waitUntil(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ctx.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'orders@photozseo.com',
          to: storeRow.owner_email,
          subject: `New order ${order_id} — ${storeRow.name ?? store_slug}`,
          text: emailBody,
        }),
      }).catch(() => {}),
    );
  }

  return json({
    order_id,
    status: 'pending',
    payment: paymentInfo,
  });
}
