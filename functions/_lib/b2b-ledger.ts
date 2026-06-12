import type { D1Like } from './buyer';

export interface BuyerTransaction {
  id: string;
  store_slug: string;
  buyer_id: string;
  type: 'debit' | 'credit' | 'order';
  amount: number;
  currency: string;
  description?: string;
  order_ref?: string;
  created_by: 'seller' | 'system';
  created_at: string;
}

export async function addTransaction(db: D1Like, tx: BuyerTransaction): Promise<void> {
  const delta = tx.type === 'credit' ? -tx.amount : tx.amount;

  await db
    .prepare('INSERT INTO store_buyer_transactions (id, store_slug, buyer_id, type, amount, currency, description, order_ref, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(tx.id, tx.store_slug, tx.buyer_id, tx.type, tx.amount, tx.currency, tx.description ?? null, tx.order_ref ?? null, tx.created_by, tx.created_at)
    .run();

  await db
    .prepare('UPDATE store_buyers SET balance = balance + ? WHERE id = ? AND store_slug = ?')
    .bind(delta, tx.buyer_id, tx.store_slug)
    .run();
}

export async function listTransactions(db: D1Like, storeSlug: string, buyerId: string): Promise<BuyerTransaction[]> {
  const { results } = await db
    .prepare('SELECT id, store_slug, buyer_id, type, amount, currency, description, order_ref, created_by, created_at FROM store_buyer_transactions WHERE store_slug = ? AND buyer_id = ? ORDER BY created_at DESC')
    .bind(storeSlug, buyerId)
    .all<BuyerTransaction>();
  return results;
}

export async function getBuyerBalance(db: D1Like, storeSlug: string, buyerId: string): Promise<number> {
  const row = await db
    .prepare('SELECT balance FROM store_buyers WHERE id = ? AND store_slug = ?')
    .bind(buyerId, storeSlug)
    .first<{ balance: number }>();
  return row?.balance ?? 0;
}
