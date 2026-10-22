-- 0016_marketplace_indexes.sql — pazar yeri listeleme sorguları SQL'e taşındı (WHERE/ORDER BY/LIMIT).
-- Sıralama ve filtre kolonları için indeksler; mevcut veriyi değiştirmez, tekrar çalıştırılabilir.
CREATE INDEX IF NOT EXISTS idx_products_updated ON products(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_price   ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_cat_upd ON products(category_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_stores_listed    ON stores(listed, updated_at DESC);
