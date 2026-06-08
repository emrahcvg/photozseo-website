-- 0005_team_pool.sql — Takım/Ortak Havuz Faz 2A (proje + asset senkron deposu).
-- Şirkete kapsamlı. snapshot kolonu iOS ProjectSnapshot/AssetSnapshot JSON'unu
-- opak saklar; senkron yalnızca modified_at/deleted_at/created_by ile yönetilir.

CREATE TABLE IF NOT EXISTS pool_projects (
  company_id  TEXT NOT NULL,
  project_id  TEXT NOT NULL,               -- UUID
  created_by  TEXT NOT NULL,               -- ilk push eden sub
  modified_at TEXT NOT NULL,               -- ISO-UTC; LWW anahtarı
  deleted_at  TEXT,                         -- tombstone (ISO) veya NULL
  snapshot    TEXT NOT NULL,                -- ProjectSnapshot JSON (asset'siz)
  PRIMARY KEY (company_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_pool_projects_sync ON pool_projects(company_id, modified_at);

CREATE TABLE IF NOT EXISTS pool_assets (
  company_id  TEXT NOT NULL,
  project_id  TEXT NOT NULL,
  asset_id    TEXT NOT NULL,               -- UUID
  r2_key      TEXT NOT NULL,                -- companies/<c>/projects/<p>/original/<a>.<ext>
  created_by  TEXT NOT NULL,
  modified_at TEXT NOT NULL,
  deleted_at  TEXT,
  snapshot    TEXT NOT NULL,                -- AssetSnapshot JSON
  PRIMARY KEY (company_id, project_id, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_pool_assets_project ON pool_assets(company_id, project_id);
