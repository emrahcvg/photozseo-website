import type { D1Like } from './buyer';

export type ActivityEventType =
  | 'member_added' | 'member_removed' | 'member_role_changed'
  | 'member_invited' | 'ownership_transferred' | 'company_created'
  | 'project_created' | 'project_deleted'
  | 'asset_added' | 'asset_deleted'
  | 'export_completed';

export interface ActivityEntry {
  companyId: string;
  eventType: ActivityEventType;
  actorSub: string;
  actorEmail: string;
  targetSub: string | null;
  targetRef: string | null;
  meta: Record<string, unknown> | null;
  now: string;
}

export async function logActivity(db: D1Like, entry: ActivityEntry): Promise<void> {
  const id = 'al:' + crypto.randomUUID();
  const metaStr = entry.meta ? JSON.stringify(entry.meta) : null;
  await db
    .prepare(
      `INSERT INTO team_activity_log
       (id, company_id, event_type, actor_sub, actor_email, target_sub, target_ref, meta, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, entry.companyId, entry.eventType, entry.actorSub, entry.actorEmail,
          entry.targetSub, entry.targetRef, metaStr, entry.now)
    .run();
}

export async function pruneLogs(db: D1Like, beforeDate: string): Promise<void> {
  await db
    .prepare(`DELETE FROM team_activity_log WHERE created_at < ?`)
    .bind(beforeDate)
    .run();
}
