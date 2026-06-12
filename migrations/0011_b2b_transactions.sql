-- migrations/0011_b2b_transactions.sql
ALTER TABLE store_buyers ADD COLUMN balance REAL NOT NULL DEFAULT 0;
ALTER TABLE store_buyers ADD COLUMN currency TEXT NOT NULL DEFAULT 'TRY';

CREATE TABLE IF NOT EXISTS store_buyer_transactions (
    id           TEXT PRIMARY KEY,
    store_slug   TEXT NOT NULL,
    buyer_id     TEXT NOT NULL REFERENCES store_buyers(id) ON DELETE CASCADE,
    type         TEXT NOT NULL CHECK(type IN ('debit','credit','order')),
    amount       REAL NOT NULL CHECK(amount > 0),
    currency     TEXT NOT NULL,
    description  TEXT,
    order_ref    TEXT,
    created_by   TEXT NOT NULL CHECK(created_by IN ('seller','system')),
    created_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_txn_buyer     ON store_buyer_transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_txn_slug_date ON store_buyer_transactions(store_slug, created_at DESC);
