/**
 * Write-protection for the storefront registry.
 * Read/render endpoints are public; write endpoints (claim, PUT manifest)
 * require authorization on EITHER of two layers (backward-compatible OR):
 *
 *   (A) LEGACY  — the shared write key in the `x-store-write-key` header,
 *                 matched against the `STORE_WRITE_KEY` Pages secret.
 *   (B) SIGNED  — an HMAC-SHA256 request signature over
 *                 `method\npath\nx-pz-ts\nbodySHA256` keyed by the same
 *                 secret, sent as `x-pz-sign` + `x-pz-ts` (unix seconds).
 *                 Adds timestamp/replay protection that the raw key lacks.
 *
 * Fail-closed: if the secret is not configured, all writes are rejected.
 *
 * SECURITY NOTE (B2 hardening, 2026-06-14): both layers still derive trust
 * from a single app-embedded `STORE_WRITE_KEY`. Layer (B) hardens against
 * captured-traffic replay and pins requests to a body+path+clock, but it does
 * NOT by itself defeat binary extraction of the secret. The protocol is laid
 * out so that a per-device enrolled secret (or a mandatory Google session)
 * can later be substituted as the signing key WITHOUT another wire change.
 * See B2 design report for the staged rotation plan.
 */

export interface WriteAuthEnv {
  STORE_WRITE_KEY?: string;
}

/** Max clock skew (seconds) accepted on a signed request before it is replay-rejected. */
export const SIGN_MAX_SKEW_SECONDS = 300;

function json(obj: unknown, status: number): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

// --- hex helpers ---

function toHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = '';
  for (const b of bytes) out += b.toString(16).padStart(2, '0');
  return out;
}

/** Constant-time hex-string compare (avoids early-exit timing leak). */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sha256Hex(data: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
}

/**
 * Canonical string that the client signs and the server recomputes.
 * Pinning method + path + timestamp + body hash makes a captured signature
 * unusable for a different request and unusable after the skew window.
 */
function canonicalString(method: string, path: string, ts: string, bodyHashHex: string): string {
  return `${method.toUpperCase()}\n${path}\n${ts}\n${bodyHashHex}`;
}

/**
 * Verify the (B) signed layer. Returns true only when the signature is fresh,
 * well-formed and matches. Any malformed / stale / mismatched input → false
 * (so the caller can fall through to the legacy key check).
 */
export async function verifySignedRequest(
  request: Request,
  bodyBytes: ArrayBuffer,
  secret: string,
  nowSec: number,
): Promise<boolean> {
  const ts = request.headers.get('x-pz-ts');
  const sig = request.headers.get('x-pz-sign');
  if (!ts || !sig) return false;

  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) return false;
  if (Math.abs(nowSec - tsNum) > SIGN_MAX_SKEW_SECONDS) return false;

  const url = new URL(request.url);
  const path = url.pathname + url.search;
  const bodyHash = await sha256Hex(bodyBytes);
  const canonical = canonicalString(request.method, path, ts, bodyHash);

  const key = await importHmacKey(secret);
  const expectedBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(canonical));
  const expectedHex = toHex(expectedBuf);

  return timingSafeEqualHex(expectedHex, sig.toLowerCase());
}

/**
 * LEGACY synchronous gate, unchanged contract.
 * Returns a Response when the request is NOT authorized via the legacy key,
 * or null when it is. Usage:
 *   const denied = requireWriteKey(req, env); if (denied) return denied;
 */
export function requireWriteKey(request: Request, env: WriteAuthEnv): Response | null {
  const expected = env.STORE_WRITE_KEY;
  if (!expected) {
    return json({ error: 'Write key not configured' }, 503);
  }
  const provided = request.headers.get('x-store-write-key');
  if (!provided || provided !== expected) {
    return json({ error: 'Unauthorized' }, 401);
  }
  return null;
}

/**
 * Combined gate (OR): authorized when EITHER the signed layer (B) verifies
 * OR the legacy key (A) matches. Backward compatible — existing clients that
 * send only `x-store-write-key` keep working unchanged.
 *
 * The caller must pass the already-read request body bytes (Pages handlers can
 * only read the body once); pass an empty ArrayBuffer for bodyless requests.
 *
 * Returns null when authorized, or a 401/503 Response when denied.
 */
export async function requireWriteAuth(
  request: Request,
  env: WriteAuthEnv,
  bodyBytes: ArrayBuffer,
  nowSec: number = Math.floor(Date.now() / 1000),
): Promise<Response | null> {
  const expected = env.STORE_WRITE_KEY;
  if (!expected) {
    return json({ error: 'Write key not configured' }, 503);
  }

  // (B) Preferred: fresh HMAC signature.
  if (await verifySignedRequest(request, bodyBytes, expected, nowSec)) {
    return null;
  }

  // (A) Legacy fallback: raw shared key (deprecation window).
  const provided = request.headers.get('x-store-write-key');
  if (provided && provided === expected) {
    return null;
  }

  return json({ error: 'Unauthorized' }, 401);
}
