-- 0006_quote_approvals.sql: B2B teklif online onay/red akışı (#11 web)
-- Satıcı (iOS app) bir teklifi yayınlar → tahmin edilemez token → müşteriye link.
-- Müşteri /q/<token>'da onaylar/reddeder/revizyon ister (token = yetki, auth yok).
-- Satıcı owner_key ile durumu poll eder.
CREATE TABLE IF NOT EXISTS quote_approvals (
  token                TEXT PRIMARY KEY,          -- 128-bit+ tahmin edilemez
  owner_key            TEXT NOT NULL,             -- yayınlayan satıcı: b:<sub> / d:<uuid>
  quote_json           TEXT NOT NULL,             -- render snapshot'ı (müşteri/kalem/toplam)
  status               TEXT NOT NULL DEFAULT 'sent',  -- sent|approved|rejected|revisionRequested
  customer_signature   TEXT,                      -- base64 PNG (opsiyonel)
  customer_signed_name TEXT,
  revision_note        TEXT,
  signed_ip            TEXT,
  signed_at            TEXT,
  created_at           TEXT NOT NULL,
  expires_at           TEXT
);
CREATE INDEX IF NOT EXISTS idx_quote_approvals_owner ON quote_approvals(owner_key, created_at);
