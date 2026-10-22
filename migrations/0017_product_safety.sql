-- 0017_product_safety.sql — GPSR (AB 2023/988) md. 19: ilanda üretici / AB sorumlu kişi / ürün kimliği / uyarılar.
-- Pazar yeri ürün sayfası D1'den render edildiği için manifestteki product.safety JSON olarak kopyalanır.
-- Canlıda: npx wrangler d1 execute photozseo-marketplace --remote --file migrations/0017_product_safety.sql
ALTER TABLE products ADD COLUMN safety_json TEXT;
