-- migrations/0010_b2b_buyers.sql
-- B2B Mağaza Alıcıları. Her store'a ait access code'lar ve alıcı adları.
-- access_code store_slug başına TUNENDİR (UNIQUE INDEX).
CREATE TABLE IF NOT EXISTS store_buyers (
    id           TEXT PRIMARY KEY,
    store_slug   TEXT NOT NULL,
    buyer_name   TEXT NOT NULL,
    access_code  TEXT NOT NULL,
    is_active    INTEGER NOT NULL DEFAULT 1,
    created_at   TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_buyers_slug_code
    ON store_buyers(store_slug, access_code);

CREATE INDEX IF NOT EXISTS idx_buyers_slug
    ON store_buyers(store_slug);
