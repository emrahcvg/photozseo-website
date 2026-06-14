-- migrations/0014_reports.sql
-- Şikayet (report) kuyruğu — App Store 1.2 (kullanıcı üretimi içerik şikayeti) +
-- DSA notice-and-action. Herkese açık /api/report endpoint'i buraya status='open' yazar;
-- admin /api/admin/takedown aksiyon alınca status='actioned' yapar.
--
-- Geriye uyumlu: yeni tablo, mevcut şemaya dokunmaz. ÇALIŞTIRILMADI (execute yok).
--
-- reason whitelist (kod katmanında zorlanır):
--   counterfeit | prohibited | fraud | ip_infringement | other
-- status akışı: open -> reviewing -> actioned | dismissed
CREATE TABLE IF NOT EXISTS reports (
  id               TEXT NOT NULL PRIMARY KEY,  -- "rep:" + crypto.randomUUID()
  store_slug       TEXT NOT NULL,
  product_id       TEXT,                       -- nullable: tüm mağaza şikayeti ise NULL
  reason           TEXT NOT NULL,              -- whitelist'ten biri
  reporter_contact TEXT,                       -- nullable: anonim şikayet mümkün
  details          TEXT,                       -- nullable: serbest metin açıklama
  status           TEXT NOT NULL DEFAULT 'open',  -- open|reviewing|actioned|dismissed
  created_at       TEXT NOT NULL,
  actioned_at      TEXT,                       -- nullable: aksiyon zamanı
  actioned_by      TEXT                        -- nullable: aksiyonu alan admin sub'ı
);

-- Admin kuyruğu: açık şikayetleri en eskiden yeniye sırala (24h SLA takibi).
CREATE INDEX IF NOT EXISTS idx_reports_status_time
  ON reports(status, created_at);
