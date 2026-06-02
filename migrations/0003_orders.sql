-- 0003_orders.sql: Alıcı sipariş geçmişi tablosu
CREATE TABLE IF NOT EXISTS orders (
  id          TEXT PRIMARY KEY,          -- sipariş referansı, ör. SP-7F3A2
  owner_key   TEXT NOT NULL,             -- b:<sub> veya d:<uuid>
  store_slug  TEXT NOT NULL,
  store_name  TEXT,
  items_json  TEXT NOT NULL,             -- JSON: [{productSlug, qty, title?, price?, currency?}]
  item_count  INTEGER NOT NULL,
  total       REAL,
  currency    TEXT,
  status      TEXT NOT NULL DEFAULT 'sent',
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_owner ON orders(owner_key, created_at);
