-- Migration 0013: legal_consents — append-only kabul (consent) kayıt defteri.
--
-- Yasal kabul (AUP / kullanım koşulları) onaylarının SUNUCU-tarafı kalıcı,
-- denetlenebilir (audit) kaydı. İstemcinin gönderdiği compliance damgasına
-- güvenmek yerine, kabulün sunucu UTC saatiyle + IP + UA ile saklanmasını
-- sağlar.
--
-- AUDIT BÜTÜNLÜĞÜ: Bu tablo APPEND-ONLY'dir. Uygulama katmanı yalnızca INSERT
-- yapar; UPDATE/DELETE YOKTUR. Düzeltme gerekirse yeni bir satır eklenir.
-- (SQLite tetikleyici ile koruma yerine, uygulama disiplini + bu yorum.)
--
-- GERİYE UYUMLU: Yeni tablo; mevcut hiçbir tabloya/akışa dokunmaz. Eski
-- istemciler compliance göndermese de yayın akışı bozulmaz (Faz-1).

CREATE TABLE IF NOT EXISTS legal_consents (
    id           TEXT PRIMARY KEY,          -- UUID
    user_sub     TEXT,                      -- Google sub (oturum); legacy/anonim yolda NULL
    user_email   TEXT,                      -- oturum email'i (opsiyonel)
    store_slug   TEXT,                      -- ilişkili mağaza (varsa)
    doc_type     TEXT NOT NULL,             -- 'aup' | 'terms' | 'privacy' ...
    doc_version  TEXT NOT NULL,             -- kabul edilen doküman sürümü
    doc_hash     TEXT,                      -- kabul edilen metnin hash'i (opsiyonel)
    accepted_at  TEXT NOT NULL,             -- SUNUCU UTC ISO 8601 (otorite olan zaman)
    ip           TEXT,                      -- CF-Connecting-IP
    user_agent   TEXT,                      -- User-Agent
    app_version  TEXT,                      -- istemci uygulama sürümü
    platform     TEXT                       -- 'ios' | 'web' | ...
);

-- Kullanıcının belirli bir doküman+sürümü kabul edip etmediğini hızlı sorgu.
CREATE INDEX IF NOT EXISTS idx_consents_sub_doc
    ON legal_consents(user_sub, doc_type, doc_version);

-- Mağaza bazlı kabul geçmişi (takedown/uyuşmazlık denetimi).
CREATE INDEX IF NOT EXISTS idx_consents_slug
    ON legal_consents(store_slug);
