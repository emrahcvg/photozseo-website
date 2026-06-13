/**
 * GET /api/shopify/callback?code=&shop=&state=&hmac=  — OAuth dönüşü.
 *
 * 1) HMAC doğrula (client_secret)  2) state nonce'u KV'de mağazayla eşleştir
 * 3) code → kalıcı access token takası  4) token'ı state ile KV'ye yaz (tek-kullanımlık)
 * 5) photozseo://shopify/connect?state=... deep link'iyle app'e dön (token URL'de DEĞİL).
 */
import {
  type ShopifyOAuthEnv,
  isValidShop,
  verifyHmac,
  exchangeToken,
  stateKey,
  tokenKey,
  TOKEN_TTL,
  APP_DEEP_LINK,
} from '../../_lib/shopify-oauth';

type Ctx = { request: Request; env: ShopifyOAuthEnv };

function fail(msg: string, status = 400): Response {
  return new Response(msg, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

function successPage(deepLink: string, shop: string): Response {
  const html = `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>photoZseo — Connected</title>
<style>body{font-family:-apple-system,sans-serif;text-align:center;padding:48px 20px;background:#f8f9fa}
.card{max-width:380px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.1)}
.i{font-size:48px;margin-bottom:12px}h1{font-size:22px;margin:0 0 8px}p{color:#666;font-size:15px;margin:0 0 24px}
.s{color:#95BF47;font-weight:600}.b{display:inline-block;background:#1B7FE3;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:600}</style>
</head><body><div class="card"><div class="i">✅</div><h1>Connected!</h1>
<p><span class="s">${shop}</span> is now linked to photoZseo.</p>
<a class="b" href="${deepLink}">Open photoZseo</a></div>
<script>location.href=${JSON.stringify(deepLink)}</script></body></html>`;
  return new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const { env } = ctx;
  if (!env.STORE_KV || !env.SHOPIFY_CLIENT_ID || !env.SHOPIFY_CLIENT_SECRET) {
    return fail('Shopify OAuth not configured', 503);
  }

  const url = new URL(ctx.request.url);
  const shop = url.searchParams.get('shop') ?? '';
  const code = url.searchParams.get('code') ?? '';
  const state = url.searchParams.get('state') ?? '';
  if (!shop || !code || !state || !isValidShop(shop)) return fail('Missing/invalid parameters');

  // 1) HMAC imza doğrulaması
  if (!(await verifyHmac(url, env.SHOPIFY_CLIENT_SECRET))) return fail('Invalid HMAC', 403);

  // 2) state nonce — KV'de mağazayla eşleşmeli (CSRF)
  const expectedShop = await env.STORE_KV.get(stateKey(state));
  if (!expectedShop || expectedShop !== shop) return fail('Invalid or expired state', 403);
  await env.STORE_KV.delete(stateKey(state));

  // 3) authorization code → kalıcı access token
  const tok = await exchangeToken(shop, env.SHOPIFY_CLIENT_ID, env.SHOPIFY_CLIENT_SECRET, code);
  if (!tok) return fail('Token exchange failed', 502);

  // 4) token'ı state ile sakla — app /api/shopify/token ile tek seferlik çeker
  await env.STORE_KV.put(
    tokenKey(state),
    JSON.stringify({ shop, access_token: tok.access_token, scope: tok.scope }),
    { expirationTtl: TOKEN_TTL },
  );

  // 5) app'e dön — token taşınmaz, sadece state
  const shopName = shop.replace('.myshopify.com', '');
  const deepLink = `${APP_DEEP_LINK}?state=${encodeURIComponent(state)}&shop=${encodeURIComponent(shopName)}`;
  return successPage(deepLink, shop);
}
