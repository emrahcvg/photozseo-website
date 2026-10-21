/**
 * apple-auth.ts — Sign in with Apple (App Store Guideline 4.8) sunucu tarafı.
 * Web Crypto only (Workers runtime); Node API yok.
 *
 *   • verifyAppleIdentityToken — RS256 JWT, Apple JWKS ile; iss/aud/exp/nonce kontrolü.
 *   • makeClientSecret         — ES256 client_secret JWT (Sign in with Apple .p8 anahtarı).
 *   • exchangeAuthorizationCode / revokeAppleToken — Apple REST (/auth/token, /auth/revoke).
 *     Hesap silmede refresh token iptali Apple tarafından ZORUNLU (2022-06-30).
 *   • appleOwnerSub            — Apple `sub` → ekosistem kimliği (ownerKeyFromBuyer regex'ine uygun).
 *   • sealToken / openToken    — refresh token'ı KV'ye AES-GCM ile şifreli yazmak için.
 */

export const APPLE_ISSUER = 'https://appleid.apple.com';
export const APPLE_JWKS_URL = 'https://appleid.apple.com/auth/keys';
const APPLE_TOKEN_URL = 'https://appleid.apple.com/auth/token';
const APPLE_REVOKE_URL = 'https://appleid.apple.com/auth/revoke';

export interface AppleEnv {
  APPLE_TEAM_ID?: string;
  APPLE_KEY_ID?: string;
  APPLE_PRIVATE_KEY?: string; // .p8 içeriği (PEM, PKCS#8)
  APPLE_CLIENT_ID?: string;   // varsayılan: iOS bundle id
}

export const DEFAULT_APPLE_CLIENT_ID = 'com.emrah.photoZseo';

export function appleClientId(env: AppleEnv): string {
  return env.APPLE_CLIENT_ID || DEFAULT_APPLE_CLIENT_ID;
}

/** Revocation için gereken üç secret da var mı? */
export function hasAppleKey(env: AppleEnv): boolean {
  return !!(env.APPLE_TEAM_ID && env.APPLE_KEY_ID && env.APPLE_PRIVATE_KEY);
}

export interface AppleClaims {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  nonce?: string;
  email?: string;
  email_verified?: boolean | string;
  is_private_email?: boolean | string;
}

export interface AppleJwk {
  kty: string;
  kid: string;
  use?: string;
  alg?: string;
  n: string;
  e: string;
}

export type JwksFetcher = () => Promise<AppleJwk[]>;

export const fetchAppleJwks: JwksFetcher = async () => {
  const res = await fetch(APPLE_JWKS_URL);
  if (!res.ok) throw new Error('Apple JWKS fetch failed: ' + res.status);
  const body = (await res.json()) as { keys: AppleJwk[] };
  return body.keys ?? [];
};

// --- base64url ---

export function b64urlToBytes(s: string): Uint8Array<ArrayBuffer> {
  const pad = (4 - (s.length % 4)) % 4;
  const raw = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad));
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function bytesToB64url(bytes: Uint8Array): string {
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function jsonB64url(obj: unknown): string {
  return bytesToB64url(new TextEncoder().encode(JSON.stringify(obj)));
}

export async function sha256Hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Apple identity token'ı doğrular. Başarısızsa `null` (sebep loglanmaz — çağıran 401 döner).
 *
 * @param rawNonce İstemcinin ürettiği ham nonce. İstemci Apple'a sha256(rawNonce) gönderir;
 *                 token'daki `nonce` claim'i bu hash'e eşit olmalı (replay koruması).
 */
export async function verifyAppleIdentityToken(
  token: string,
  opts: { audience: string; rawNonce: string; nowSec: number; fetchJwks?: JwksFetcher },
): Promise<AppleClaims | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h64, p64, s64] = parts;

  let header: { alg?: string; kid?: string };
  let claims: AppleClaims;
  try {
    header = JSON.parse(new TextDecoder().decode(b64urlToBytes(h64)));
    claims = JSON.parse(new TextDecoder().decode(b64urlToBytes(p64)));
  } catch {
    return null;
  }
  if (header.alg !== 'RS256' || !header.kid) return null;

  const keys = await (opts.fetchJwks ?? fetchAppleJwks)();
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) return null;

  const key = await crypto.subtle.importKey(
    'jwk',
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    b64urlToBytes(s64),
    new TextEncoder().encode(`${h64}.${p64}`),
  );
  if (!ok) return null;

  if (claims.iss !== APPLE_ISSUER) return null;
  if (claims.aud !== opts.audience) return null;
  if (typeof claims.exp !== 'number' || claims.exp < opts.nowSec) return null;
  if (!claims.sub) return null;
  if (!opts.rawNonce || claims.nonce !== (await sha256Hex(opts.rawNonce))) return null;

  return claims;
}

/**
 * Apple `sub` (ör. "001234.abcdef0123456789.0123") → ekosistem kimliği.
 * `ownerKeyFromBuyer` yalnız [A-Za-z0-9_-] kabul ettiği için nokta '-' olur.
 * Google sub'ları sayısal olduğundan `apple_` öneki çakışmayı imkânsız kılar.
 */
export function appleOwnerSub(appleSub: string): string {
  return 'apple_' + appleSub.replace(/[^A-Za-z0-9_-]/g, '-');
}

export function isAppleOwnerSub(sub: string): boolean {
  return sub.startsWith('apple_');
}

// --- client_secret (ES256) ---

function pemToPkcs8(pem: string): Uint8Array<ArrayBuffer> {
  const body = pem
    .replace(/-----BEGIN [^-]+-----/, '')
    .replace(/-----END [^-]+-----/, '')
    .replace(/\\n/g, '')
    .replace(/\s+/g, '');
  const raw = atob(body);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/** Apple REST çağrıları için kısa ömürlü (5 dk) ES256 client_secret JWT. */
export async function makeClientSecret(env: AppleEnv, nowSec: number): Promise<string> {
  if (!hasAppleKey(env)) throw new Error('Apple key not configured');
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToPkcs8(env.APPLE_PRIVATE_KEY!),
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  );
  const header = jsonB64url({ alg: 'ES256', kid: env.APPLE_KEY_ID });
  const payload = jsonB64url({
    iss: env.APPLE_TEAM_ID,
    iat: nowSec,
    exp: nowSec + 300,
    aud: APPLE_ISSUER,
    sub: appleClientId(env),
  });
  // Web Crypto ECDSA imzası zaten JWS'in istediği ham r||s (P1363) biçiminde.
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(`${header}.${payload}`),
  );
  return `${header}.${payload}.${bytesToB64url(new Uint8Array(sig))}`;
}

/** authorization_code → refresh_token. Başarısızsa null. */
export async function exchangeAuthorizationCode(
  env: AppleEnv,
  code: string,
  nowSec: number,
  fetchImpl: typeof fetch = fetch,
): Promise<string | null> {
  const body = new URLSearchParams({
    client_id: appleClientId(env),
    client_secret: await makeClientSecret(env, nowSec),
    code,
    grant_type: 'authorization_code',
  });
  const res = await fetchImpl(APPLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) return null;
  const json = (await res.json().catch(() => null)) as { refresh_token?: string } | null;
  return json?.refresh_token ?? null;
}

/** Refresh token'ı Apple'da iptal eder (hesap silme). Apple 200 döndürürse true. */
export async function revokeAppleToken(
  env: AppleEnv,
  refreshToken: string,
  nowSec: number,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  const body = new URLSearchParams({
    client_id: appleClientId(env),
    client_secret: await makeClientSecret(env, nowSec),
    token: refreshToken,
    token_type_hint: 'refresh_token',
  });
  const res = await fetchImpl(APPLE_REVOKE_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  return res.ok;
}

// --- KV'de şifreli saklama (AES-GCM, anahtar = HKDF(STORE_WRITE_KEY)) ---

async function aesKey(secret: string): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'HKDF', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: new TextEncoder().encode('pz-apple-refresh-token') },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function sealToken(plain: string, secret: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await aesKey(secret), new TextEncoder().encode(plain));
  return `${bytesToB64url(iv)}.${bytesToB64url(new Uint8Array(ct))}`;
}

export async function openToken(sealed: string, secret: string): Promise<string | null> {
  const [iv64, ct64] = sealed.split('.');
  if (!iv64 || !ct64) return null;
  try {
    const pt = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: b64urlToBytes(iv64) },
      await aesKey(secret),
      b64urlToBytes(ct64),
    );
    return new TextDecoder().decode(pt);
  } catch {
    return null;
  }
}

/** KV anahtarları (STORE_KV). */
export const appleKv = {
  refreshToken: (ownerSub: string) => `apple_rt:${ownerSub}`,
  profile: (ownerSub: string) => `apple_profile:${ownerSub}`,
  nonce: (nonceHash: string) => `apple_nonce:${nonceHash}`,
};
