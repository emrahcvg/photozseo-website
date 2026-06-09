import { describe, it, expect } from 'vitest';
import { onRequestPost } from './leave';
import { makeFakeD1 } from '../../_lib/fakeD1';
import { signSession } from '../../_lib/session';
import { SESSION_COOKIE } from '../../../src/storefront/auth/config';
import { createCompany, upsertMembership, getMembership } from '../../_lib/team';

const SECRET = 'test-secret';

async function authedPost(body: unknown, sub: string, email = 'x@x.com'): Promise<Request> {
  const token = await signSession({ sub, email, name: 'X', exp: 9999999999 }, SECRET);
  return new Request('https://x/api/team/leave', {
    method: 'POST',
    headers: { cookie: `${SESSION_COOKIE}=${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const env = (db: ReturnType<typeof makeFakeD1>['db']) => ({ STORE_WRITE_KEY: SECRET, MARKET_DB: db });

async function seed(db: ReturnType<typeof makeFakeD1>['db']): Promise<void> {
  await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'Owner', now: '2026-06-08T00:00:00Z' });
  await upsertMembership(db, { companyId: 'c:co-1', userSub: 'sub-emp', email: 'e@x.com', name: 'Emp', role: 'employee', now: '2026-06-08T00:01:00Z' });
}

describe('POST /api/team/leave', () => {
  it('oturum yoksa 401', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://x/api/team/leave', { method: 'POST', body: '{}' });
    expect((await onRequestPost({ request: req, env: env(db) })).status).toBe(401);
  });

  it('companyId yoksa 400', async () => {
    const { db } = makeFakeD1(); await seed(db);
    expect((await onRequestPost({ request: await authedPost({}, 'sub-emp', 'e@x.com'), env: env(db) })).status).toBe(400);
  });

  it('üye olmayan 404', async () => {
    const { db } = makeFakeD1(); await seed(db);
    expect((await onRequestPost({ request: await authedPost({ companyId: 'c:co-1' }, 'sub-yabanci'), env: env(db) })).status).toBe(404);
  });

  it('son owner ayrılamaz (403)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1' }, 'sub-owner', 'o@x.com'), env: env(db) });
    expect(res.status).toBe(403);
  });

  it('employee ayrılabilir → üyelik silinir', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1' }, 'sub-emp', 'e@x.com'), env: env(db) });
    expect(res.status).toBe(200);
    expect(await getMembership(db, 'c:co-1', 'sub-emp')).toBeNull();
  });

  it('başka owner varsa owner ayrılabilir', async () => {
    const { db } = makeFakeD1(); await seed(db);
    await upsertMembership(db, { companyId: 'c:co-1', userSub: 'sub-owner2', email: 'o2@x.com', name: 'O2', role: 'owner', now: '2026-06-08T00:03:00Z' });
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1' }, 'sub-owner', 'o@x.com'), env: env(db) });
    expect(res.status).toBe(200);
    expect(await getMembership(db, 'c:co-1', 'sub-owner')).toBeNull();
  });
});
