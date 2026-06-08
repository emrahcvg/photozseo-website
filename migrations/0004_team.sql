-- 0004_team.sql — photoZseo Takım/Ortak Havuz Faz 1 (şirket + üyelik + davet).
-- Kimlik Google sub üstünden gelir (pz_session). Bu tablolar yalnızca takım/rol
-- durumunu tutar; proje/foto senkronu Faz 2'dir.

CREATE TABLE IF NOT EXISTS companies (
  id          TEXT NOT NULL PRIMARY KEY,   -- "c:" + uuid
  name        TEXT NOT NULL,
  owner_sub   TEXT NOT NULL,               -- kurucu/owner Google sub
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_companies_owner ON companies(owner_sub);

CREATE TABLE IF NOT EXISTS memberships (
  company_id  TEXT NOT NULL,
  user_sub    TEXT NOT NULL,               -- üye Google sub
  email       TEXT NOT NULL,
  name        TEXT,
  role        TEXT NOT NULL,               -- 'owner' | 'admin' | 'employee'
  joined_at   TEXT NOT NULL,
  PRIMARY KEY (company_id, user_sub)
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_sub);

CREATE TABLE IF NOT EXISTS invites (
  code        TEXT NOT NULL PRIMARY KEY,   -- 8 karakter, karışık olmayan alfabe
  company_id  TEXT NOT NULL,
  role        TEXT NOT NULL,               -- kullanımda verilecek rol: 'admin' | 'employee'
  created_by  TEXT NOT NULL,               -- davet eden sub
  created_at  TEXT NOT NULL,
  expires_at  TEXT NOT NULL,
  redeemed_by TEXT,                        -- kullanan sub; NULL ise kullanılmamış
  redeemed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_invites_company ON invites(company_id);
