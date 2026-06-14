ALTER TABLE pool_projects ADD COLUMN assigned_to TEXT;
ALTER TABLE pool_projects ADD COLUMN assignment_status TEXT NOT NULL DEFAULT 'unassigned';
CREATE INDEX IF NOT EXISTS idx_pool_projects_assigned ON pool_projects(company_id, assigned_to, modified_at);
