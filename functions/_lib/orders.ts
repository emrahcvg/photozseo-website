/**
 * orders.ts — Sipariş CRUD katmanı; D1 üstünde saf veri erişimi.
 * owner_key: Google girişi "b:<sub>", anonim cihaz "d:<uuid>".
 */

import type { D1Like } from './buyer';

export interface OrderItem {
  productSlug: string;
  qty: number;
  title?: string;
  price?: number;
  currency?: string;
}

export interface OrderRecord {
  id: string;
  owner_key: string;
  store_slug: string;
  store_name?: string;
  items: OrderItem[];
  item_count: number;
  total?: number;
  currency?: string;
  status: string;
  created_at: string;
}

/** Sipariş referansı üretir: 'SP-' + rand'ın base36 gösterimi (büyük harf). */
export function makeOrderRef(rand: number): string {
  return 'SP-' + Math.abs(Math.floor(rand)).toString(36).toUpperCase();
}

/** Yeni sipariş kaydı ekler (items → items_json olarak serialize edilir). */
export async function createOrder(db: D1Like, order: OrderRecord): Promise<void> {
  const items_json = JSON.stringify(order.items);
  await db
    .prepare(
      'INSERT INTO orders (id, owner_key, store_slug, store_name, items_json, item_count, total, currency, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    )
    .bind(
      order.id,
      order.owner_key,
      order.store_slug,
      order.store_name ?? null,
      items_json,
      order.item_count,
      order.total ?? null,
      order.currency ?? null,
      order.status,
      order.created_at,
    )
    .run();
}

/** Sahibin siparişlerini en yeniden en eskiye döner; items_json parse edilir. */
export async function listOrders(db: D1Like, ownerKey: string): Promise<OrderRecord[]> {
  const { results } = await db
    .prepare('SELECT * FROM orders WHERE owner_key = ? ORDER BY created_at DESC')
    .bind(ownerKey)
    .all<{
      id: string;
      owner_key: string;
      store_slug: string;
      store_name: string | null;
      items_json: string;
      item_count: number;
      total: number | null;
      currency: string | null;
      status: string;
      created_at: string;
    }>();

  return results.map((r) => ({
    id: r.id,
    owner_key: r.owner_key,
    store_slug: r.store_slug,
    store_name: r.store_name ?? undefined,
    items: (() => {
      try {
        return JSON.parse(r.items_json) as OrderItem[];
      } catch {
        return [];
      }
    })(),
    item_count: r.item_count,
    total: r.total ?? undefined,
    currency: r.currency ?? undefined,
    status: r.status,
    created_at: r.created_at,
  }));
}
