/**
 * GET /api/shopify/auth?shop=<store>  — OAuth başlat.
 *
 * Mağaza adını doğrular, CSRF state nonce üretip KV'ye yazar ve satıcıyı
 * Shopify consent (authorize) ekranına 302'ler. Scope'lar shopify-oauth.ts'te.
 */
import {
  type ShopifyOAuthEnv,
  normalizeShop,
  authorizeUrl,
  callbackUrl,
  stateKey,
  STATE_TTL,
} from '../../_lib/shopify-oauth';

type Ctx = { request: Request; env: ShopifyOAuthEnv };

function bad(msg: string, status = 400): Response {
  return new Response(msg, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const { env } = ctx;
  if (!env.STORE_KV || !env.SHOPIFY_CLIENT_ID || !env.SHOPIFY_CLIENT_SECRET) {
    return bad('Shopify OAuth not configured', 503);
  }

  const url = new URL(ctx.request.url);
  const shop = normalizeShop(url.searchParams.get('shop') ?? '');
  if (!shop) return bad('Invalid shop parameter');

  // CSRF + token-retrieval anahtarı olarak tek state nonce
  const state = crypto.randomUUID().replace(/-/g, '');
  await env.STORE_KV.put(stateKey(state), shop, { expirationTtl: STATE_TTL });

  const dest = authorizeUrl(shop, env.SHOPIFY_CLIENT_ID, callbackUrl(url.origin), state);
  return new Response(null, { status: 302, headers: { Location: dest } });
}
