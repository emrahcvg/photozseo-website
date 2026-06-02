/**
 * POST /api/store/<slug>/order — Sepeti sipariş olarak kayıt altına alır.
 *
 * Akış:
 *   1. Sahip kimliğini çözümle (Google oturumu veya cihaz UUID).
 *   2. D1'den güncel sepeti çek (istemciye güvenme).
 *   3. Sipariş referansı üret, orders tablosuna yaz.
 *   4. Sepetin ilgili mağazası için cart_items sil (sepeti temizle).
 *   5. { ok: true, order_ref } döndür.
 */
import { isValidSlug, getCart, clearCart, type D1Like } from '../../../_lib/buyer';
import { resolveOwnerKey } from '../../../_lib/buyer-owner';
import { createOrder, makeOrderRef } from '../../../_lib/orders';

interface Env { MARKET_DB: D1Like; STORE_WRITE_KEY?: string; }
type Ctx = { request: Request; env: Env; params: { slug: string } };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  // D1 bağlayıcı kontrolü
  if (!ctx.env.MARKET_DB) return json({ error: 'db unavailable' }, 503);

  const storeSlug = ctx.params.slug;
  if (!isValidSlug(storeSlug)) return json({ error: 'bad slug' }, 400);

  // Sahip kimliğini çözümle
  const owner = await resolveOwnerKey(ctx.request, ctx.env.STORE_WRITE_KEY, Math.floor(Date.now() / 1000));
  if (!owner) return json({ error: 'identity required' }, 400);

  // Opsiyonel JSON gövde (store_name gibi meta bilgiler)
  let bodyData: { store_name?: string } = {};
  try { bodyData = (await ctx.request.json().catch(() => ({}))) as { store_name?: string }; } catch { /* yoksay */ }

  // Sunucu taraflı sepet snapshot — istemci listesine güvenme
  const cartItems = await getCart(ctx.env.MARKET_DB, owner, storeSlug);
  if (!cartItems.length) return json({ error: 'empty cart' }, 400);

  // Sipariş kalemleri: sepetten oluştur (sadece productSlug + qty; title/price sunucuda yok)
  const orderItems = cartItems.map((c) => ({ productSlug: c.productSlug, qty: c.qty }));
  const itemCount = cartItems.reduce((sum, c) => sum + c.qty, 0);
  const orderRef = makeOrderRef(Math.floor(Math.random() * 36 ** 5));
  const now = new Date().toISOString();

  await createOrder(ctx.env.MARKET_DB, {
    id: orderRef,
    owner_key: owner,
    store_slug: storeSlug,
    store_name: bodyData.store_name ?? undefined,
    items: orderItems,
    item_count: itemCount,
    total: undefined,
    currency: undefined,
    status: 'sent',
    created_at: now,
  });

  // Sipariş verildi → sepeti temizle
  await clearCart(ctx.env.MARKET_DB, owner, storeSlug);

  return json({ ok: true, order_ref: orderRef });
}
