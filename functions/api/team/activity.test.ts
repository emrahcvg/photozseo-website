import { describe, it, expect } from 'vitest';
import { onRequestGet as getActivity } from './activity';
import { onRequestPost as create } from './create';
import { makeFakeD1 } from '../../_lib/fakeD1';
import { signSession } from '../../_lib/session';
import { SESSION_COOKIE } from '../../../src/storefront/auth/config';
import { logActivity } from '../../_lib/activity-log';

const SECRET = 'test-secret';

async function authedGet(sub: string, email: string, url: string): Promise<Request> {
  const token = await signSession({ sub, email, name: 'T', exp: 9999999999 }, SECRET);
  return new Request(url, { headers: { cookie: `${SESSION_COOKIE}=${token}` } });
}

async function authedPost(sub: string, email: string, url: string, body: unknown): Promise<Request> {
  const token = await signSession({ sub, email, name: 'T', exp: 9999999999 }, SECRET);
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: `${SESSION_COOKIE}=${token}` },
    body: JSON.stringify(body),
  });
}

describe('GET /api/team/activity', () => {
  it('owner 30 kayıt alır, hasMore doğru hesaplanır', async () => {
    const { db, tables } = makeFakeD1();
    const env = { STORE_WRITE_KEY: SECRET, MARKET_DB: db };

    const cRes = await create({ request: await authedPost('sub-o', 'o@x.com', 'https://x/api/team/create', { name: 'A' }), env });
    const { companyId } = await cRes.json() as { companyId: string };

    for (let i = 0; i < 31; i++) {
      await logActivity(db, {
        companyId, eventType: 'member_added', actorSub: 'sub-o', actorEmail: 'o@x.com',
        targetSub: null, targetRef: null, meta: null,
        now: new Date(Date.now() - i * 1000).toISOString(),
      });
    }

    const req = await authedGet('sub-o', 'o@x.com', `https://x/api/team/activity?companyId=${companyId}&limit=30`);
    const res = await getActivity({ request: req, env });
    expect(res.status).toBe(200);
    const body = await res.json() as { items: unknown[]; nextCursor: string | null };
    expect(body.items).toHaveLength(30);
    expect(body.nextCursor).not.toBeNull();
  });

  it('owner olmayan 403 alır', async () => {
    const { db } = makeFakeD1();
    const env = { STORE_WRITE_KEY: SECRET, MARKET_DB: db };
    const cRes = await create({ request: await authedPost('sub-o', 'o@x.com', 'https://x/api/team/create', { name: 'A' }), env });
    const { companyId } = await cRes.json() as { companyId: string };

    const req = await authedGet('sub-other', 'x@x.com', `https://x/api/team/activity?companyId=${companyId}&limit=30`);
    const res = await getActivity({ request: req, env });
    expect(res.status).toBe(403);
  });

  it('oturumsuz 401 alır', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://x/api/team/activity?companyId=c:x&limit=30');
    const res = await getActivity({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(401);
  });

  it('cursor pagination — sonraki sayfayı doğru getirir', async () => {
    const { db } = makeFakeD1();
    const env = { STORE_WRITE_KEY: SECRET, MARKET_DB: db };
    const cRes = await create({ request: await authedPost('sub-o', 'o@x.com', 'https://x/api/team/create', { name: 'A' }), env });
    const { companyId } = await cRes.json() as { companyId: string };

    for (let i = 0; i < 35; i++) {
      await logActivity(db, {
        companyId, eventType: 'member_added', actorSub: 'sub-o', actorEmail: 'o@x.com',
        targetSub: null, targetRef: null, meta: null,
        now: new Date(2026, 0, 1, 0, 0, i).toISOString(),
      });
    }

    const req1 = await authedGet('sub-o', 'o@x.com', `https://x/api/team/activity?companyId=${companyId}&limit=30`);
    const body1 = await (await getActivity({ request: req1, env })).json() as { items: unknown[]; nextCursor: string };
    expect(body1.items).toHaveLength(30);
    expect(body1.nextCursor).not.toBeNull();

    const req2 = await authedGet('sub-o', 'o@x.com', `https://x/api/team/activity?companyId=${companyId}&limit=30&cursor=${encodeURIComponent(body1.nextCursor)}`);
    const body2 = await (await getActivity({ request: req2, env })).json() as { items: unknown[]; nextCursor: string | null };
    expect(body2.items).toHaveLength(5);
    expect(body2.nextCursor).toBeNull();
  });
});

import { onRequestPost as postActivity } from './activity';

describe('POST /api/team/activity (export log)', () => {
  it('üye export log gönderebilir — 201 döner', async () => {
    const { db, tables } = makeFakeD1();
    const env = { STORE_WRITE_KEY: SECRET, MARKET_DB: db };
    const cRes = await create({ request: await authedPost('sub-o', 'o@x.com', 'https://x/api/team/create', { name: 'A' }), env });
    const { companyId } = await cRes.json() as { companyId: string };

    const req = await authedPost('sub-o', 'o@x.com', 'https://x/api/team/activity', {
      companyId, eventType: 'export_completed', meta: { platform: 'Amazon', count: 5, format: 'JPG' }
    });
    const res = await postActivity({ request: req, env });
    expect(res.status).toBe(201);
    expect(tables.team_activity_log).toHaveLength(1);
    expect(tables.team_activity_log[0].event_type).toBe('export_completed');
    expect(tables.team_activity_log[0].actor_email).toBe('o@x.com');
  });

  it('oturumsuz 401 alır', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://x/api/team/activity', { method: 'POST', body: '{}', headers: { 'content-type': 'application/json' } });
    const res = await postActivity({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(401);
  });

  it('event_type export_completed dışında reddedilir', async () => {
    const { db } = makeFakeD1();
    const env = { STORE_WRITE_KEY: SECRET, MARKET_DB: db };
    const cRes = await create({ request: await authedPost('sub-o', 'o@x.com', 'https://x/api/team/create', { name: 'A' }), env });
    const { companyId } = await cRes.json() as { companyId: string };

    const req = await authedPost('sub-o', 'o@x.com', 'https://x/api/team/activity', {
      companyId, eventType: 'member_removed', meta: {}
    });
    const res = await postActivity({ request: req, env });
    expect(res.status).toBe(400);
  });
});
