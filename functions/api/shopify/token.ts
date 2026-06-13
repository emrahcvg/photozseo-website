/**
 * POST /api/shopify/token  — app, OAuth ile alınan token'ı tek seferlik çeker.
 *
 * Gövde: { state: "<callback'ten gelen nonce>" }
 * Dönüş: { shop, access_token, scope }  → okunduktan sonra KV'den SİLİNİR.
 *
 * Güvenlik: token mağaza adıyla değil, kısa-ömürlü tek-kullanımlık `state` ile
 * anahtarlanır. Eski Fly köprüsündeki "client_id ile herhangi mağaza token'ı
 * çekme" açığı böylece kapanır.
 */
import { type ShopifyOAuthEnv, tokenKey } from '../../_lib/shopify-oauth';

type Ctx = { request: Request; env: ShopifyOAuthEnv };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const { env } = ctx;
  if (!env.STORE_KV) return json({ error: 'Shopify OAuth not configured' }, 503);

  const body = (await ctx.request.json().catch(() => null)) as { state?: string } | null;
  const state = body?.state?.trim();
  if (!state) return json({ error: 'state required' }, 400);

  const raw = await env.STORE_KV.get(tokenKey(state));
  if (!raw) return json({ error: 'Token not found or already retrieved' }, 404);

  // Tek-kullanımlık: okur okumaz sil.
  await env.STORE_KV.delete(tokenKey(state));

  return json(JSON.parse(raw), 200);
}
