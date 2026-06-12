-- migrations/0009_team_activity_log.sql
-- Takım Aktivite Logu. Her event için: kim yaptı, ne yaptı, ne zaman.
-- meta kolonu event'e özgü JSON blob'u serbest biçimde saklar.
CREATE TABLE IF NOT EXISTS team_activity_log (
  id          TEXT NOT NULL PRIMARY KEY,  -- "al:" + crypto.randomUUID()
  company_id  TEXT NOT NULL,
  event_type  TEXT NOT NULL,
  actor_sub   TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  target_sub  TEXT,
  target_ref  TEXT,
  meta        TEXT,
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tal_company_time
  ON team_activity_log(company_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tal_cleanup
  ON team_activity_log(created_at);
