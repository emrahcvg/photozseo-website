import { describe, it, expect } from 'vitest';
import { onRequestPost } from './delete-company';
import { makeFakeD1 } from '../../_lib/fakeD1';
import { signSession } from '../../_lib/session';
import { SESSION_COOKIE } from '../../../src/storefront/auth/config';
import { createCompany, upsertMembership, getMembership, getCompany, listCompanyMembers } from '../../_lib/team';

const SECRET = 'test-secret';

async function authedPost(body: unknown, sub = 'sub-owner', email = 'o@x.com'): Promise<Request> {
  const token = await signSession({ sub, email, name: 'X', exp: 9999999999 }, SECRET);
  return new Request('https://x/api/team/delete-company', {
    method: 'POST',
    headers: { cookie: `${SESSION_COOKIE}=${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function seed(db: ReturnType<typeof makeFakeD1>['db']): Promise<void> {
  await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'Owner', now: '2026-06-08T00:00:00Z' });
  await upsertMembership(db, { companyId: 'c:co-1', userSub: 'sub-admin', email: 'a@x.com', name: 'Adm', role: 'admin', now: '2026-06-08T00:01:00Z' });
  await upsertMembership(db, { companyId: 'c:co-1', userSub: 'sub-emp', email: 'e@x.com', name: 'Emp', role: 'employee', now: '2026-06-08T00:02:00Z' });
}

const env = (db: ReturnType<typeof makeFakeD1>['db']) => ({ STORE_WRITE_KEY: SECRET, MARKET_DB: db });

describe('POST /api/team/delete-company', () => {
  it('oturum yoksa 401', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://x/api/team/delete-company', { method: 'POST', body: '{}' });
    expect((await onRequestPost({ request: req, env: env(db) })).status).toBe(401);
  });

  it('companyId eksikse 400', async () => {
    const { db } = makeFakeD1(); await seed(db);
    expect((await onRequestPost({ request: await authedPost({}), env: env(db) })).status).toBe(400);
  });

  it('üye olmayan için 404', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1' }, 'sub-yabanci', 'y@x.com'), env: env(db) });
    expect(res.status).toBe(404);
  });

  it('admin silemez (403)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1' }, 'sub-admin', 'a@x.com'), env: env(db) });
    expect(res.status).toBe(403);
  });

  it('employee silemez (403)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1' }, 'sub-emp', 'e@x.com'), env: env(db) });
    expect(res.status).toBe(403);
  });

  it('owner siler: şirket + tüm üyeler gider', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1' }), env: env(db) });
    expect(res.status).toBe(200);
    expect(await getCompany(db, 'c:co-1')).toBeNull();
    expect(await getMembership(db, 'c:co-1', 'sub-owner')).toBeNull();
    expect((await listCompanyMembers(db, 'c:co-1')).length).toBe(0);
  });
});
