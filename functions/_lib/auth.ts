/**
 * Write-protection for the storefront registry.
 * Read/render endpoints are public; write endpoints (claim, PUT manifest)
 * require the shared write key supplied via the `x-store-write-key` header,
 * matched against the `STORE_WRITE_KEY` Pages secret.
 *
 * Fail-closed: if the secret is not configured, all writes are rejected.
 * NOTE (P3 hardening): this is a single app-embedded shared key — it blocks
 * random public writes but does not isolate one seller from another. Per-seller
 * tokens come with the account/auth work in P3.
 */

export interface WriteAuthEnv {
  STORE_WRITE_KEY?: string;
}

function json(obj: unknown, status: number): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/**
 * Returns a Response when the request is NOT authorized to write,
 * or null when it is. Usage: `const denied = requireWriteKey(req, env); if (denied) return denied;`
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
