/**
 * POST /api/auth/logout — oturumu sonlandır.
 *
 * pz_session cookie'yi Max-Age=0 ile silerek oturumu kapatır.
 * Yanıt: 200 { ok:true }
 */
import { SESSION_COOKIE } from '../../../src/storefront/auth/config';

type Ctx = { request: Request; env: Record<string, unknown> };

export async function onRequestPost(_ctx: Ctx): Promise<Response> {
  const clearCookie =
    `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'set-cookie': clearCookie,
    },
  });
}
