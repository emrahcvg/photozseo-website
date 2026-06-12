// functions/api/store/[slug]/buyers/[id]/transactions.ts
/**
 * GET  /api/store/:slug/buyers/:id/transactions  — işlem geçmişi + bakiye
 *      Auth: write-key (satıcı) VEYA b2b_<slug> cookie (alıcının kendisi)
 * POST /api/store/:slug/buyers/:id/transactions  — borç/alacak gir (write-key)
 */
import { requireWriteKey } from '../../../../../_lib/auth';
import { addTransaction, listTransactions, getBuyerBalance } from '../../../../../_lib/b2b-ledger';
import { findBuyerById } from '../../../../../_lib/b2b-buyers';

interface Env {
  MARKET_DB: D1Database;
  MARKET_KV: KVNamespace;
  STORE_WRITE_KEY?: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get('cookie') ?? '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k.trim() === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const { request, env, params } = ctx;
  const slug = params.slug as string;
  const buyerId = params.id as string;

  if (!env.MARKET_DB) return json({ error: 'DB not configured' }, 503);

  // Auth: write-key (satıcı) VEYA b2b cookie ile alıcının kendisi
  const denied = requireWriteKey(request, env);
  const isSellerAuth = denied === null;
  const cookieBuyerId = getCookie(request, `b2b_${slug}`);
  const isBuyerAuth = cookieBuyerId === buyerId;

  if (!isSellerAuth && !isBuyerAuth) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const [transactions, balance] = await Promise.all([
    listTransactions(env.MARKET_DB, slug, buyerId),
    getBuyerBalance(env.MARKET_DB, slug, buyerId),
  ]);

  return json({ transactions, balance });
};

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env, params } = ctx;
  const slug = params.slug as string;
  const buyerId = params.id as string;

  if (!env.MARKET_DB) return json({ error: 'DB not configured' }, 503);

  const denied = requireWriteKey(request, env);
  if (denied) return denied;

  let body: { type?: string; amount?: number; currency?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  if (!body.type || !['debit', 'credit'].includes(body.type)) {
    return json({ error: 'type must be debit or credit' }, 400);
  }
  if (!body.amount || body.amount <= 0) {
    return json({ error: 'amount must be > 0' }, 400);
  }

  const buyer = await findBuyerById(env.MARKET_DB, slug, buyerId);
  if (!buyer) {
    return json({ error: 'Buyer not found' }, 404);
  }

  const now = new Date().toISOString();
  const tx = {
    id: crypto.randomUUID(),
    store_slug: slug,
    buyer_id: buyerId,
    type: body.type as 'debit' | 'credit',
    amount: body.amount,
    currency: body.currency ?? 'TRY',
    description: body.description,
    created_by: 'seller' as const,
    created_at: now,
  };

  await addTransaction(env.MARKET_DB, tx);
  const balance = await getBuyerBalance(env.MARKET_DB, slug, buyerId);

  return json({ transaction: tx, balance }, 201);
};
