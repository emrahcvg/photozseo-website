/**
 * POST /api/quote/publish — Satıcı (iOS app) bir teklifi online onaya açar.
 * Sahip kimliği (Google oturumu veya cihaz UUID) owner_key olarak yazılır;
 * durum poll'u bununla kapsanır. Tahmin edilemez token üretilip link döner.
 *
 * Gövde: { quote: QuoteSnapshot, expiresInDays?: number }
 * Yanıt: { ok, token, url, expires_at }
 */
import type { D1Like } from '../../_lib/buyer';
import { resolveOwnerKey } from '../../_lib/buyer-owner';
import { requireWriteAuthOrSession } from '../../_lib/require-session';
import { createApproval, makeApprovalToken, type QuoteSnapshot } from '../../_lib/quote-approvals';

interface Env { MARKET_DB: D1Like; STORE_WRITE_KEY?: string; }
type Ctx = { request: Request; env: Env };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  if (!ctx.env.MARKET_DB) return json({ error: 'db unavailable' }, 503);

  // Yalnızca legit app örneği yayınlayabilsin: write-key VEYA imzalı istek gate
  // (genel kötüye kullanımı önler; B2 hardening). Owner kimliği ise Google
  // oturumu ya da x-device-id'den gelir. FAIL-CLOSED (repo konvansiyonu, bkz.
  // _lib/auth.ts): key yapılandırılmamışsa 503; ne imza ne key varsa 401.
  // Gövde bir kez okunup imza katmanına (HMAC) hash'lenmek üzere veriliyor.
  // Faz B OR-gate: pz_session VEYA legacy key/HMAC (geriye uyumlu). Owner kimliği
  // aşağıda resolveOwnerKey ile çözülmeye devam eder (session→b:<sub>, yoksa cihaz).
  const raw = await ctx.request.text();
  const auth = await requireWriteAuthOrSession(ctx.request, ctx.env, Math.floor(Date.now() / 1000), raw);
  if (auth instanceof Response) return auth;

  const owner = await resolveOwnerKey(ctx.request, ctx.env.STORE_WRITE_KEY, Math.floor(Date.now() / 1000));
  if (!owner) return json({ error: 'identity required' }, 400);

  let body: { quote?: QuoteSnapshot; expiresInDays?: number };
  try {
    body = (raw ? JSON.parse(raw) : {}) as { quote?: QuoteSnapshot; expiresInDays?: number };
  } catch {
    return json({ error: 'bad json' }, 400);
  }
  const quote = body.quote;
  if (!quote || !Array.isArray(quote.lines) || !quote.quoteNumber) {
    return json({ error: 'invalid quote' }, 400);
  }

  const token = makeApprovalToken();
  const now = new Date();
  const created_at = now.toISOString();
  const days = Number.isFinite(body.expiresInDays) ? Number(body.expiresInDays) : (quote.validityDays ?? 30);
  const expires_at = new Date(now.getTime() + Math.max(1, days) * 86400_000).toISOString();

  await createApproval(ctx.env.MARKET_DB, { token, owner_key: owner, quote, created_at, expires_at });

  const origin = new URL(ctx.request.url).origin;
  return json({ ok: true, token, url: `${origin}/q/${token}`, expires_at });
}
