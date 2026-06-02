-- 0002_buyer.sql — photoZseo Buyer backend P1 (favori + sepet kalıcılığı).
-- Sahip (owner_key) anonim cihaz için "d:<uuid>", ileride giriş gelince "b:<buyerId>".
-- D1 (SQLite). KV manifest render kaynağı kalır; bu tablolar alıcı durumu içindir.

CREATE TABLE IF NOT EXISTS favorites (
  owner_key    TEXT NOT NULL,
  store_slug   TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  PRIMARY KEY (owner_key, store_slug, product_slug)
);

CREATE INDEX IF NOT EXISTS idx_favorites_owner ON favorites(owner_key);
CREATE INDEX IF NOT EXISTS idx_favorites_store ON favorites(store_slug, product_slug);

CREATE TABLE IF NOT EXISTS cart_items (
  owner_key    TEXT NOT NULL,
  store_slug   TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  qty          INTEGER NOT NULL,
  updated_at   TEXT NOT NULL,
  PRIMARY KEY (owner_key, store_slug, product_slug)
);

CREATE INDEX IF NOT EXISTS idx_cart_owner ON cart_items(owner_key, store_slug);
