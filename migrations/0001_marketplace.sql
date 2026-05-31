-- 0001_marketplace.sql — photoZseo Marketplace kanonik şema (P1)
-- D1 (SQLite). KV manifest render kaynağı kalır; D1 pazar yeri sorguları için kanonik kopya.

CREATE TABLE IF NOT EXISTS stores (
  slug          TEXT PRIMARY KEY,
  name          TEXT,
  city          TEXT,
  country       TEXT,
  iban          TEXT,
  iban_name     TEXT,
  whatsapp      TEXT,
  listed        INTEGER NOT NULL DEFAULT 0,
  lang          TEXT,
  index_version INTEGER,
  updated_at    TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id           TEXT PRIMARY KEY,
  store_slug   TEXT NOT NULL,
  title        TEXT,
  description  TEXT,
  category_id  TEXT,
  tags         TEXT,
  price        REAL,
  currency     TEXT,
  stock        INTEGER,
  image_url    TEXT,
  product_path TEXT,
  updated_at   TEXT
);

CREATE INDEX IF NOT EXISTS idx_products_store    ON products(store_slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

CREATE TABLE IF NOT EXISTS meta (
  key   TEXT PRIMARY KEY,
  value INTEGER
);

INSERT OR IGNORE INTO meta(key, value) VALUES ('index_version', 0);
