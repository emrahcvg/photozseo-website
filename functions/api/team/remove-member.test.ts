import { describe, it, expect } from 'vitest';
import { onRequestPost } from './remove-member';
import { makeFakeD1 } from '../../_lib/fakeD1';
import { signSession } from '../../_lib/session';
import { SESSION_COOKIE } from '../../../src/storefront/auth/config';
import { createCompany, upsertMembership, listCompanyMembers } from '../../_lib/team';

const SECRET = 'test-secret';

async function authedPost(body: unknown, sub = 'sub-owner', email = 'o@x.com'): Promise<Request> {
  const token = await signSession({ sub, email, name: 'X', exp: 9999999999 }, SECRET);
  return new Request('https://x/api/team/remove-member', {
    method: 'POST',
    headers: { cookie: `${SESSION_COOKIE}=${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function seed(db: ReturnType<typeof makeFakeD1>['db']): Promise<void> {
  await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'Owner', now: '2026-06-08T00:00:00Z' });
  await upsertMembership(db, { companyId: 'c:co-1', userSub: 'sub-admin', email: 'a@x.com', name: 'Adm', role: 'admin', now: '2026-06-08T00:01:00Z' });
  await upsertMembership(db, { companyId: 'c:co-1', userSub: 'sub-admin2', email: 'a2@x.com', name: 'Adm2', role: 'admin', now: '2026-06-08T00:01:30Z' });
  await upsertMembership(db, { companyId: 'c:co-1', userSub: 'sub-emp', email: 'e@x.com', name: 'Emp', role: 'employee', now: '2026-06-08T00:02:00Z' });
}

const env = (db: ReturnType<typeof makeFakeD1>['db']) => ({ STORE_WRITE_KEY: SECRET, MARKET_DB: db });

describe('POST /api/team/remove-member', () => {
  it('oturum yoksa 401', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://x/api/team/remove-member', { method: 'POST', body: '{}' });
    expect((await onRequestPost({ request: req, env: env(db) })).status).toBe(401);
  });

  it('companyId/sub eksikse 400', async () => {
    const { db } = makeFakeD1(); await seed(db);
    expect((await onRequestPost({ request: await authedPost({ companyId: 'c:co-1' }), env: env(db) })).status).toBe(400);
  });

  it('kendini çıkaramaz (400 → leave kullan)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    expect((await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-owner' }), env: env(db) })).status).toBe(400);
  });

  it('employee çıkaramaz (403)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-admin' }, 'sub-emp', 'e@x.com'), env: env(db) });
    expect(res.status).toBe(403);
  });

  it('owner çıkarılamaz (403)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-owner' }, 'sub-admin', 'a@x.com'), env: env(db) });
    expect(res.status).toBe(403);
  });

  it('admin başka admini çıkaramaz (403)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-admin2' }, 'sub-admin', 'a@x.com'), env: env(db) });
    expect(res.status).toBe(403);
  });

  it('olmayan üye için 404', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-yok' }), env: env(db) });
    expect(res.status).toBe(404);
  });

  it('owner employee çıkarır → roster küçülür', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-emp' }), env: env(db) });
    expect(res.status).toBe(200);
    const subs = (await listCompanyMembers(db, 'c:co-1')).map((m) => m.sub);
    expect(subs).not.toContain('sub-emp');
  });

  it('owner admini çıkarabilir', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-admin' }), env: env(db) });
    expect(res.status).toBe(200);
  });

  it('admin employee çıkarabilir', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-emp' }, 'sub-admin', 'a@x.com'), env: env(db) });
    expect(res.status).toBe(200);
  });
});
