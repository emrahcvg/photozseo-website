/**
 * GET  /api/orders — Giriş yapmış kullanıcının (veya anonim cihazın) sipariş listesini döner.
 * POST /api/orders — Yeni sipariş oluşturur; IBAN/banka havalesi ödeme bilgisi döner.
 * Kimlik yoksa GET boş liste döner (401 yerine graceful fallback).
 */
import { resolveOwnerKey } from '../_lib/buyer-owner';
import { listOrders, createOrder, randomOrderRef } from '../_lib/orders';
import type { D1Like } from '../_lib/buyer';

interface Env { MARKET_DB: D1Like; STORE_WRITE_KEY?: string; RESEND_API_KEY?: string; STORE_KV?: KVNamespace; }

const MAX_ITEMS = 50;
const MAX_QTY = 99;
const MAX_NOTE = 500;
/** IP başına saatlik sipariş limiti — her sipariş satıcıya e-posta tetikler (spam/maliyet). */
const ORDER_RATE_LIMIT = 20;
const ORDER_RATE_WINDOW = 3600;
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,62}$/;
type Ctx = { request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void };

function json(obj: unknown, status = 200): Response {
  // Sipariş verisi kişiye özel → hiçbir önbellekte tutulmaz.
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store' } });
}

async function withinRateLimit(kv: KVNamespace | undefined, ip: string): Promise<boolean> {
  if (!kv) return true; // KV yoksa (lokal test) limit uygulanmaz
  const key = `order_rl:${ip}`;
  const count = parseInt((await kv.get(key)) ?? '0', 10) || 0;
  if (count >= ORDER_RATE_LIMIT) return false;
  await kv.put(key, String(count + 1), { expirationTtl: ORDER_RATE_WINDOW });
  return true;
}

function parsePayment(raw: string | null | undefined): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
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

  const ip = ctx.request.headers.get('cf-connecting-ip') ?? 'unknown';
  if (!(await withinRateLimit(ctx.env.STORE_KV, ip))) {
    return json({ error: 'Too many orders. Please try again later.' }, 429);
  }

  let body: unknown;
  try { body = await ctx.request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const b = (body ?? {}) as Record<string, unknown>;
  const store_slug = typeof b.store_slug === 'string' ? b.store_slug.trim() : '';
  if (!SLUG_RE.test(store_slug)) return json({ error: 'store_slug required' }, 400);

  const rawItems = Array.isArray(b.items) ? (b.items as Array<{ product_id?: unknown; qty?: unknown }>) : [];
  if (rawItems.length === 0) return json({ error: 'items required' }, 400);
  if (rawItems.length > MAX_ITEMS) return json({ error: `At most ${MAX_ITEMS} items per order` }, 400);

  // Miktarları birleştir; fiyat istemciden ALINMAZ (D1'deki yayınlanmış fiyat esas).
  const qtyById = new Map<string, number>();
  for (const x of rawItems) {
    if (typeof x.product_id !== 'string' || !x.product_id || x.product_id.length > 200) continue;
    const q = Number.isInteger(x.qty) ? Math.min(Math.max(x.qty as number, 1), MAX_QTY) : 1;
    qtyById.set(x.product_id, Math.min((qtyById.get(x.product_id) ?? 0) + q, MAX_QTY));
  }
  if (qtyById.size === 0) return json({ error: 'items required' }, 400);

  const storeRow = await ctx.env.MARKET_DB
    .prepare('SELECT iban, iban_name, payment_json, owner_email, name FROM stores WHERE slug = ?')
    .bind(store_slug).first<{ iban: string | null; iban_name: string | null; payment_json: string | null; owner_email: string | null; name: string | null }>();
  if (!storeRow) return json({ error: 'Store not found' }, 404);

  const ids = [...qtyById.keys()];
  const placeholders = ids.map(() => '?').join(',');
  const { results: productRows } = await ctx.env.MARKET_DB
    .prepare(`SELECT id, title, price, currency FROM products WHERE store_slug = ? AND id IN (${placeholders})`)
    .bind(store_slug, ...ids)
    .all<{ id: string; title: string; price: number | null; currency: string | null }>();
  const products = productRows ?? [];
  if (products.length === 0) return json({ error: 'No valid products for this store' }, 400);

  const currency = products.find((p) => p.currency)?.currency ?? 'USD';
  const items = products.map((p) => ({
    productSlug: p.id,
    title: p.title,
    qty: qtyById.get(p.id) ?? 1,
    price: typeof p.price === 'number' ? p.price : undefined,
    currency: p.currency ?? currency,
  }));
  const mixedCurrency = items.some((x) => x.currency !== currency);
  const total = mixedCurrency
    ? undefined
    : items.reduce((s, x) => s + (typeof x.price === 'number' ? x.price * x.qty : 0), 0);
  const buyer_note = typeof b.buyer_note === 'string' ? b.buyer_note.slice(0, MAX_NOTE) : undefined;

  const order_id = randomOrderRef();
  const created_at = new Date().toISOString();
  const owner_key = (await resolveOwnerKey(ctx.request, ctx.env.STORE_WRITE_KEY, Math.floor(Date.now() / 1000))) ?? 'd:anon';

  await createOrder(ctx.env.MARKET_DB, {
    id: order_id,
    owner_key,
    store_slug,
    store_name: storeRow.name ?? undefined,
    items,
    item_count: items.reduce((s, x) => s + x.qty, 0),
    total,
    currency,
    status: 'pending',
    created_at,
    ...(buyer_note ? { buyer_note } : {}),
  });

  // Ödeme bilgisi yalnız satıcının kendi kaydından gelir; yoksa uydurma IBAN gösterilmez.
  const paymentInfo: Record<string, unknown> | null =
    parsePayment(storeRow.payment_json) ??
    (storeRow.iban ? { method: 'bank_transfer', iban: storeRow.iban, ibanName: storeRow.iban_name } : null);

  // Satıcıya email bildirimi (best-effort — sipariş yanıtını bloklamaz)
  if (ctx.env.RESEND_API_KEY && storeRow.owner_email) {
    const itemLines = items
      .map((x) => `• ${x.title} × ${x.qty}  ${x.price != null ? x.price + ' ' + x.currency : ''}`)
      .join('\n');
    const emailBody = [
      `New order received: ${order_id}`,
      `Store: ${storeRow.name ?? store_slug}`,
      total != null ? `Total: ${total.toFixed(2)} ${currency}` : 'Total: see items',
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
    // amount/currency sunucuda hesaplanır; karışık para biriminde amount null (kalem bazlı ödenir).
    payment: { ...(paymentInfo ?? {}), amount: total ?? null, currency },
  });
}
