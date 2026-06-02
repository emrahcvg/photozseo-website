/**
 * İmzalı oturum cookie değeri — Web Crypto (HMAC-SHA256).
 * Format: base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload, secret))
 * Node API yok; Workers runtime'da çalışır.
 */

export interface SessionPayload {
  sub: string;
  email: string;
  name?: string;
  exp: number; // unix saniye
}

// --- base64url yardımcıları (padding yok) ---

function b64urlEncode(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function b64urlDecode(s: string): ArrayBuffer {
  // Padding ekle
  const pad = (4 - (s.length % 4)) % 4;
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad);
  const raw = atob(b64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes.buffer;
}

// --- HMAC anahtarı içe aktarma ---

async function importKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

// --- Oturum imzalama ---

export async function signSession(payload: SessionPayload, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const payloadB64 = b64urlEncode(enc.encode(JSON.stringify(payload)).buffer as ArrayBuffer);
  const key = await importKey(secret);
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64));
  const sigB64 = b64urlEncode(sigBuf);
  return `${payloadB64}.${sigB64}`;
}

// --- Oturum doğrulama ---

/**
 * Token'ı doğrular. Geçersiz imza, bozuk format veya süresi dolmuşsa null döner.
 * @param nowSec Test edilebilirlik için dışarıdan verilen unix saniye değeri.
 */
export async function verifySession(
  token: string,
  secret: string,
  nowSec: number,
): Promise<SessionPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;

  let sigBuf: ArrayBuffer;
  let payloadBuf: ArrayBuffer;
  try {
    sigBuf = b64urlDecode(sigB64);
    payloadBuf = b64urlDecode(payloadB64);
  } catch {
    return null;
  }

  const enc = new TextEncoder();
  const key = await importKey(secret);

  // crypto.subtle.verify — sabit zamanlı HMAC karşılaştırması
  const valid = await crypto.subtle.verify('HMAC', key, sigBuf, enc.encode(payloadB64));
  if (!valid) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(payloadBuf)) as SessionPayload;
  } catch {
    return null;
  }

  // Süre kontrolü
  if (typeof payload.exp !== 'number' || payload.exp < nowSec) return null;

  return payload;
}

// --- Cookie ayrıştırma ---

/**
 * "a=1; b=2" formatındaki Cookie header'ını ayrıştırır.
 */
export function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((s) => {
      const idx = s.indexOf('=');
      if (idx === -1) return [s.trim(), ''];
      return [s.slice(0, idx).trim(), s.slice(idx + 1).trim()];
    }),
  );
}
