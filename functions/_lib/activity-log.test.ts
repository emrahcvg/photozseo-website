import { describe, it, expect } from 'vitest';
import { logActivity, pruneLogs } from './activity-log';
import { makeFakeD1 } from './fakeD1';

describe('logActivity', () => {
  it('team_activity_log tablosuna INSERT yapar', async () => {
    const { db, tables } = makeFakeD1();
    await logActivity(db, {
      companyId: 'c:test',
      eventType: 'member_added',
      actorSub: 'sub-1',
      actorEmail: 'a@x.com',
      targetSub: 'sub-2',
      targetRef: null,
      meta: null,
      now: '2026-01-01T00:00:00.000Z',
    });
    expect(tables.team_activity_log).toHaveLength(1);
    expect(tables.team_activity_log[0]).toMatchObject({
      company_id: 'c:test',
      event_type: 'member_added',
      actor_email: 'a@x.com',
    });
    expect((tables.team_activity_log[0].id as string).startsWith('al:')).toBe(true);
  });

  it('meta JSON string olarak kaydedilir', async () => {
    const { db, tables } = makeFakeD1();
    await logActivity(db, {
      companyId: 'c:1',
      eventType: 'member_role_changed',
      actorSub: 'sub-1',
      actorEmail: 'a@x.com',
      targetSub: null,
      targetRef: null,
      meta: { from: 'admin', to: 'employee' },
      now: '2026-01-01T00:00:00.000Z',
    });
    expect(tables.team_activity_log[0].meta).toBe('{"from":"admin","to":"employee"}');
  });
});

describe('pruneLogs', () => {
  it('365 günden eski kayıtları siler, yenileri bırakır', async () => {
    const { db, tables } = makeFakeD1();
    await logActivity(db, {
      companyId: 'c:1', eventType: 'company_created',
      actorSub: 's', actorEmail: 'e@x.com',
      targetSub: null, targetRef: null, meta: null,
      now: '2025-01-01T00:00:00.000Z',
    });
    await logActivity(db, {
      companyId: 'c:1', eventType: 'member_added',
      actorSub: 's', actorEmail: 'e@x.com',
      targetSub: null, targetRef: null, meta: null,
      now: '2026-06-12T00:00:00.000Z',
    });
    await pruneLogs(db, '2026-01-01T00:00:00.000Z');
    expect(tables.team_activity_log).toHaveLength(1);
    expect(tables.team_activity_log[0].event_type).toBe('member_added');
  });
});
