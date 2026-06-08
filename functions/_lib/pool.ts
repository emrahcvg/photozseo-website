/**
 * pool.ts — Takım/Ortak Havuz Faz 2A saf veri-erişim katmanı.
 * Şirkete kapsamlı proje/asset CRUD; LWW (modified_at) + tombstone.
 * snapshot opak JSON; bu katman içeriğini yorumlamaz.
 */
import type { D1Like } from './buyer';

export interface ProjectRow {
  company_id: string;
  project_id: string;
  created_by: string;
  modified_at: string;
  deleted_at: string | null;
  snapshot: string;
}

export interface DeltaEntry {
  projectId: string;
  modifiedAt: string;
  deletedAt: string | null;
}

/**
 * Projeyi upsert eder. ON CONFLICT'te yalnızca gelen modified_at mevcuttan
 * büyük/eşitse günceller (LWW); created_by ilk yazanı korur.
 */
export async function upsertProject(
  db: D1Like,
  p: { companyId: string; projectId: string; createdBy: string; modifiedAt: string; snapshot: string; deletedAt?: string | null },
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO pool_projects (company_id, project_id, created_by, modified_at, deleted_at, snapshot) VALUES (?, ?, ?, ?, ?, ?) ' +
      'ON CONFLICT(company_id, project_id) DO UPDATE SET ' +
      'modified_at = excluded.modified_at, deleted_at = excluded.deleted_at, snapshot = excluded.snapshot ' +
      'WHERE excluded.modified_at >= pool_projects.modified_at',
    )
    .bind(p.companyId, p.projectId, p.createdBy, p.modifiedAt, p.deletedAt ?? null, p.snapshot)
    .run();
}

/** Tek projeyi döner; yoksa null. */
export async function getProject(db: D1Like, companyId: string, projectId: string): Promise<ProjectRow | null> {
  return db
    .prepare('SELECT company_id, project_id, created_by, modified_at, deleted_at, snapshot FROM pool_projects WHERE company_id = ? AND project_id = ?')
    .bind(companyId, projectId)
    .first<ProjectRow>();
}

/** modified_at > since olan projeleri kronolojik döner (tombstone dahil). */
export async function projectsSince(db: D1Like, companyId: string, since: string): Promise<DeltaEntry[]> {
  const { results } = await db
    .prepare('SELECT project_id, modified_at, deleted_at FROM pool_projects WHERE company_id = ? AND modified_at > ? ORDER BY modified_at ASC')
    .bind(companyId, since)
    .all<{ project_id: string; modified_at: string; deleted_at: string | null }>();
  return results.map((r) => ({ projectId: r.project_id, modifiedAt: r.modified_at, deletedAt: r.deleted_at }));
}

/** Projeyi tombstone'lar (deleted_at + modified_at güncellenir). */
export async function tombstoneProject(
  db: D1Like,
  t: { companyId: string; projectId: string; deletedAt: string; modifiedAt: string },
): Promise<void> {
  await db
    .prepare('UPDATE pool_projects SET deleted_at = ?, modified_at = ? WHERE company_id = ? AND project_id = ?')
    .bind(t.deletedAt, t.modifiedAt, t.companyId, t.projectId)
    .run();
}
