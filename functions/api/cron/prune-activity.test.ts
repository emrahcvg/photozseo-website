import { describe, it, expect } from 'vitest';
import { onRequestGet } from './prune-activity';
import { makeFakeD1 } from '../../_lib/fakeD1';
import { logActivity } from '../../_lib/activity-log';

describe('GET /api/cron/prune-activity', () => {
  it('365 günden eski kayıtları siler, yenileri korur', async () => {
    const { db, tables } = makeFakeD1();
    const env = { MARKET_DB: db };

    const old = new Date(Date.now() - 366 * 24 * 60 * 60 * 1000).toISOString();
    const fresh = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString();

    await logActivity(db, { companyId: 'c:1', eventType: 'company_created', actorSub: 's1', actorEmail: 'a@x.com', targetSub: null, targetRef: null, meta: null, now: old });
    await logActivity(db, { companyId: 'c:1', eventType: 'member_added', actorSub: 's1', actorEmail: 'a@x.com', targetSub: null, targetRef: null, meta: null, now: fresh });

    const res = await onRequestGet({ request: new Request('https://x/api/cron/prune-activity'), env });
    expect(res.status).toBe(200);
    expect(tables.team_activity_log).toHaveLength(1);
    expect(tables.team_activity_log[0].event_type).toBe('member_added');
  });

  it('DB yoksa 503 döner', async () => {
    const res = await onRequestGet({ request: new Request('https://x/api/cron/prune-activity'), env: {} });
    expect(res.status).toBe(503);
  });
});
