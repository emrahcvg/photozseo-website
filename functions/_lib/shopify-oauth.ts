/**
 * Shopify OAuth — paylaşılan sabitler + helper'lar (Cloudflare Pages Functions).
 *
 * Fly.io köprüsünün (photozseo-shopify.fly.dev) yerine geçer. Farklar:
 *  - HMAC doğrulaması Node `crypto` yerine Web Crypto (Workers uyumlu).
 *  - Token, mağaza adıyla DEĞİL tek-kullanımlık `state` nonce'u ile saklanır/çekilir
 *    → client_id ile herhangi bir mağazanın token'ını çekme açığı kapanır.
 *  - In-memory Map yerine STORE_KV (TTL'li, restart'tan etkilenmez).
 */

/**
 * SCOPE FIX — v1.1 ürün push'unun ihtiyaç duyduğu izinler.
 * write_products → ürün/varyant/sku/barcode/media/koleksiyon (read_products dahil)
 * write_inventory → stok adedi yazma (read_inventory dahil)
 * read_locations → stok için location id çözümü
 * Not: `read_markets_home` OAuth grantable handle'ı DEĞİL (validator quirk'i).
 * Canlı testte `locations` sorgusu 403 verirse `read_markets` eklenir.
 */
export const SHOPIFY_SCOPES = 'write_products,write_inventory,read_locations';

/** iOS'un kayıtlı URL şeması — callback buraya döner (token URL'de taşınmaz). */
export const APP_DEEP_LINK = 'photozseo://shopify/connect';

/** KV anahtarları + TTL'ler. */
export const stateKey = (state: string) => `shopify:oauth:state:${state}`;
export const tokenKey = (state: string) => `shopify:oauth:token:${state}`;
export const STATE_TTL = 600; // consent gidiş-dönüşü için 10 dk
export const TOKEN_TTL = 300; // app'in token'ı çekmesi için 5 dk

export interface ShopifyOAuthEnv {
  STORE_KV?: KVNamespace;
  SHOPIFY_CLIENT_ID?: string;
  SHOPIFY_CLIENT_SECRET?: string;
}

/** `xxx.myshopify.com` formatı — subdomain injection'a karşı katı doğrulama. */
export function isValidShop(shop: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,59}\.myshopify\.com$/i.test(shop);
}

/** Mağaza adını normalize et: "xxx" veya "xxx.myshopify.com" → "xxx.myshopify.com". */
export function normalizeShop(raw: string): string | null {
  const s = raw.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const shop = s.endsWith('.myshopify.com') ? s : `${s}.myshopify.com`;
  return isValidShop(shop) ? shop : null;
}

/** Callback redirect_uri'sini istek origin'inden kur (mutlak https zorunlu). */
export function callbackUrl(origin: string): string {
  return `${origin}/api/shopify/callback`;
}

/** Shopify consent (authorize) URL'i. */
export function authorizeUrl(
  shop: string,
  clientId: string,
  redirectUri: string,
  state: string,
): string {
  const p = new URLSearchParams({
    client_id: clientId,
    scope: SHOPIFY_SCOPES,
    redirect_uri: redirectUri,
    state,
  });
  return `https://${shop}/admin/oauth/authorize?${p.toString()}`;
}

/** Web Crypto HMAC-SHA256 (hex). Workers'da Node crypto yok. */
async function hmacHex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Sabit-zamanlı hex karşılaştırma (timing attack'a karşı). */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Shopify OAuth callback HMAC doğrulaması.
 * hmac/signature dışındaki tüm query paramları lexicographic sıralanıp
 * `key=value` olarak `&` ile birleştirilir, client_secret ile HMAC-SHA256.
 */
export async function verifyHmac(url: URL, secret: string): Promise<boolean> {
  const provided = url.searchParams.get('hmac');
  if (!provided) return false;
  const pairs: string[] = [];
  for (const [k, v] of url.searchParams) {
    if (k === 'hmac' || k === 'signature') continue;
    pairs.push(`${k}=${v}`);
  }
  pairs.sort();
  const computed = await hmacHex(pairs.join('&'), secret);
  return timingSafeEqualHex(computed, provided.toLowerCase());
}

/** Authorization code → kalıcı access token takası. */
export async function exchangeToken(
  shop: string,
  clientId: string,
  clientSecret: string,
  code: string,
): Promise<{ access_token: string; scope: string } | null> {
  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  if (!res.ok) return null;
  const data = (await res.json().catch(() => null)) as { access_token?: string; scope?: string } | null;
  if (!data?.access_token) return null;
  return { access_token: data.access_token, scope: data.scope ?? '' };
}
