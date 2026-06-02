/**
 * GET /api/auth/me — mevcut oturumu kontrol et.
 *
 * Oturum geçerliyse: 200 { loggedIn:true, sub, email, name }
 * Geçersiz/yok:      200 { loggedIn:false }  (client UI kararı için 401 değil)
 */
import { verifySession, parseCookies } from '../../_lib/session';
import { SESSION_COOKIE } from '../../../src/storefront/auth/config';

interface Env {
  STORE_WRITE_KEY?: string;
}
type Ctx = { request: Request; env: Env };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const writeKey = ctx.env.STORE_WRITE_KEY;
  if (!writeKey) return json({ loggedIn: false }, 200);

  const cookies = parseCookies(ctx.request.headers.get('cookie'));
  const token = cookies[SESSION_COOKIE];
  if (!token) return json({ loggedIn: false });

  const nowSec = Math.floor(Date.now() / 1000);
  const payload = await verifySession(token, writeKey, nowSec);
  if (!payload) return json({ loggedIn: false });

  return json({ loggedIn: true, sub: payload.sub, email: payload.email, name: payload.name });
}
