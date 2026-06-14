// functions/api/store/[slug]/buyers.ts
/**
 * GET  /api/store/:slug/buyers        — alıcı listesi (write-key)
 * POST /api/store/:slug/buyers        — alıcı ekle (write-key)
 * DELETE /api/store/:slug/buyers      — alıcı sil (write-key + ?id=<buyerId>)
 */
import { requireWriteAuthOrSession } from '../../../_lib/require-session';
import {
  listBuyers, addBuyer, deleteBuyer,
  generateAccessCode, isValidBuyerCode,
} from '../../../_lib/b2b-buyers';

interface Env {
  STORE_WRITE_KEY?: string;
  MARKET_DB?: D1Database;
}

const VALID_SLUG = /^[a-z0-9][a-z0-9-]{0,98}[a-z0-9]$|^[a-z0-9]$/;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  // Faz B OR-gate: pz_session VEYA legacy key/HMAC. Bodyless istek → bodyText ''.
  const auth = await requireWriteAuthOrSession(ctx.request, ctx.env, Math.floor(Date.now() / 1000), '');
  if (auth instanceof Response) return auth;

  const slug = ctx.params.slug as string;
  if (!VALID_SLUG.test(slug)) return json({ error: 'Invalid slug' }, 400);

  const db = ctx.env.MARKET_DB;
  if (!db) return json({ error: 'DB not configured' }, 503);

  const buyers = await listBuyers(db, slug);
  return json({ buyers });
};

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  // Read body once up front so the signed (HMAC) auth layer can hash it.
  const raw = await ctx.request.text();

  // Faz B OR-gate: pz_session VEYA legacy key/HMAC (gövde metni HMAC hash'i için).
  const auth = await requireWriteAuthOrSession(ctx.request, ctx.env, Math.floor(Date.now() / 1000), raw);
  if (auth instanceof Response) return auth;

  const slug = ctx.params.slug as string;
  if (!VALID_SLUG.test(slug)) return json({ error: 'Invalid slug' }, 400);

  const db = ctx.env.MARKET_DB;
  if (!db) return json({ error: 'DB not configured' }, 503);

  let body: { buyer_name?: string; access_code?: string };
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const name = (body.buyer_name ?? '').trim();
  if (!name || name.length > 100) return json({ error: 'buyer_name required (max 100)' }, 400);

  let code = body.access_code ? body.access_code.toUpperCase().trim() : generateAccessCode();
  if (!isValidBuyerCode(code)) return json({ error: 'access_code must be 6 uppercase alphanumeric (no O,0,I,1)' }, 400);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const buyer = await addBuyer(db, slug, name, code, id, now);
      return json({ buyer }, 201);
    } catch {
      if (body.access_code) {
        return json({ error: 'access_code already in use for this store' }, 409);
      }
      code = generateAccessCode();
    }
  }
  return json({ error: 'Could not generate unique code, try again' }, 500);
};

export const onRequestDelete: PagesFunction<Env> = async (ctx) => {
  // Faz B OR-gate: pz_session VEYA legacy key/HMAC. Bodyless istek → bodyText ''.
  const auth = await requireWriteAuthOrSession(ctx.request, ctx.env, Math.floor(Date.now() / 1000), '');
  if (auth instanceof Response) return auth;

  const slug = ctx.params.slug as string;
  const url = new URL(ctx.request.url);
  const buyerId = url.searchParams.get('id');

  if (!VALID_SLUG.test(slug)) return json({ error: 'Invalid slug' }, 400);
  if (!buyerId) return json({ error: 'id query param required' }, 400);

  const db = ctx.env.MARKET_DB;
  if (!db) return json({ error: 'DB not configured' }, 503);

  await deleteBuyer(db, slug, buyerId);
  return json({ ok: true });
};
