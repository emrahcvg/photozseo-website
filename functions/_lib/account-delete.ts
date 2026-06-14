/**
 * account-delete.ts — In-app account deletion (App Store Guideline 5.1.1(v)).
 *
 * Bir kullanıcının (Google `sub`) ekosistemdeki verisini siler/anonimleştirir.
 * Saf veri-erişim katmanı: kimlik (session→sub) doğrulamasını ÇAĞIRAN yapar
 * (functions/api/account/delete.ts), burada yalnız `sub` verilmiş kabul edilir.
 *
 * KAPSAM (sub → owner_key = b:<sub>):
 *   • Mağazalar: KV (`store:<slug>`) + D1 `stores`/`products`. Sahip eşleşmesi
 *     KV kaydındaki `ownerSub` üzerinden (D1 stores.owner_sub yazılmıyor).
 *   • Alıcı durumu: D1 `favorites`, `cart_items`, `orders` (owner_key=b:<sub>).
 *   • B2B: kullanıcının sahip OLDUĞU mağazalara ait `store_buyers` +
 *     `store_buyer_transactions` (mağaza silinince beraber).
 *
 * KORUNAN (silinmez — anonimleştirilir):
 *   • `legal_consents`: kabul (consent) KANITI yasal saklama gerektirir
 *     (GDPR Art.17(3)(b)/(e)). Satır + `user_sub` KORUNUR; yalnız `user_email`
 *     PII'si NULL'lanır. Append-only tablo olduğundan bu TEK izinli UPDATE.
 *
 * Hiçbir slug bloklanmaz (takedown DEĞİL) — kullanıcı kendi verisini gönüllü
 * siliyor; aynı adı tekrar alabilir.
 */

import type { D1Like } from './buyer';
import { ownerKeyFromBuyer } from './buyer';

/** KV list/get/delete için ihtiyaç duyulan minimum yüzey (test edilebilirlik). */
export interface KVLike {
  list(opts?: { prefix?: string; cursor?: string }): Promise<{
    keys: { name: string }[];
    list_complete: boolean;
    cursor?: string;
  }>;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
}

export interface DeleteSummary {
  stores: number;
  products: number;
  favorites: number;
  cartItems: number;
  orders: number;
  b2bBuyers: number;
  b2bTransactions: number;
  consentsAnonymized: number;
}

/**
 * KV'de `store:*` kayıtlarını gezip `ownerSub === sub` olan mağaza slug'larını
 * döner. KV `ownerSub`'ı StoreRecord'a cast ile yazıldığından ham JSON okunur.
 */
export async function findOwnedStoreSlugs(kv: KVLike, sub: string): Promise<string[]> {
  const slugs: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await kv.list({ prefix: 'store:', cursor });
    for (const k of page.keys) {
      const slug = k.name.slice('store:'.length);
      if (!slug) continue;
      const raw = await kv.get(k.name);
      if (!raw) continue;
      try {
        const rec = JSON.parse(raw) as { ownerSub?: string };
        if (rec.ownerSub && rec.ownerSub === sub) slugs.push(slug);
      } catch {
        /* bozuk kayıt → atla */
      }
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return slugs;
}

/**
 * Tek bir kullanıcının verisini siler/anonimleştirir.
 * Best-effort: D1 yoksa yalnız KV mağazaları silinir; KV yoksa yalnız D1.
 * Çağıran taraf en az birinin var olduğunu garanti etmeli (fail-closed).
 */
export async function deleteAccountData(
  sub: string,
  kv: KVLike | undefined,
  db: D1Like | undefined,
): Promise<DeleteSummary> {
  const summary: DeleteSummary = {
    stores: 0,
    products: 0,
    favorites: 0,
    cartItems: 0,
    orders: 0,
    b2bBuyers: 0,
    b2bTransactions: 0,
    consentsAnonymized: 0,
  };

  const ownerKey = ownerKeyFromBuyer(sub); // b:<sub>; geçersiz sub → null
  const ownedSlugs = kv ? await findOwnedStoreSlugs(kv, sub) : [];

  // 1) Mağazalar — KV kaydını sil (takedown DEĞİL; slug bloklanmaz).
  if (kv) {
    for (const slug of ownedSlugs) {
      await kv.delete(`store:${slug}`);
      await kv.delete(`meta:${slug}`);
      summary.stores++;
    }
  }

  // 2) Mağazaya bağlı D1 verisi (ürünler + B2B alıcı/işlemleri + stores satırı).
  if (db) {
    for (const slug of ownedSlugs) {
      // B2B işlemleri (FK ON DELETE CASCADE store_buyers'a bağlı; yine de açıkça sil).
      const txn = await db
        .prepare('DELETE FROM store_buyer_transactions WHERE store_slug = ?')
        .bind(slug)
        .run();
      summary.b2bTransactions += rowsAffected(txn);

      const buyers = await db
        .prepare('DELETE FROM store_buyers WHERE store_slug = ?')
        .bind(slug)
        .run();
      summary.b2bBuyers += rowsAffected(buyers);

      const prods = await db
        .prepare('DELETE FROM products WHERE store_slug = ?')
        .bind(slug)
        .run();
      summary.products += rowsAffected(prods);

      await db.prepare('DELETE FROM stores WHERE slug = ?').bind(slug).run();
    }

    // 3) Alıcı durumu (owner_key = b:<sub>).
    if (ownerKey) {
      const favs = await db.prepare('DELETE FROM favorites WHERE owner_key = ?').bind(ownerKey).run();
      summary.favorites += rowsAffected(favs);

      const cart = await db.prepare('DELETE FROM cart_items WHERE owner_key = ?').bind(ownerKey).run();
      summary.cartItems += rowsAffected(cart);

      const ord = await db.prepare('DELETE FROM orders WHERE owner_key = ?').bind(ownerKey).run();
      summary.orders += rowsAffected(ord);
    }

    // 4) legal_consents — SİLME; yalnız user_email PII'sini anonimleştir.
    //    Satır + user_sub KORUNUR (yasal saklama / GDPR Art.17(3)).
    const cons = await db
      .prepare("UPDATE legal_consents SET user_email = NULL WHERE user_sub = ? AND user_email IS NOT NULL")
      .bind(sub)
      .run();
    summary.consentsAnonymized += rowsAffected(cons);
  }

  return summary;
}

/** D1 `run()` sonucundan etkilenen satır sayısını güvenli çeker (yoksa 0). */
function rowsAffected(res: unknown): number {
  const meta = (res as { meta?: { changes?: number; rows_written?: number } })?.meta;
  return meta?.changes ?? meta?.rows_written ?? 0;
}
