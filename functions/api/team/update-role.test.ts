import { describe, it, expect } from 'vitest';
import { onRequestPost } from './update-role';
import { makeFakeD1 } from '../../_lib/fakeD1';
import { signSession } from '../../_lib/session';
import { SESSION_COOKIE } from '../../../src/storefront/auth/config';
import { createCompany, upsertMembership, getMembership } from '../../_lib/team';

const SECRET = 'test-secret';

async function authedPost(body: unknown, sub = 'sub-owner', email = 'o@x.com'): Promise<Request> {
  const token = await signSession({ sub, email, name: 'X', exp: 9999999999 }, SECRET);
  return new Request('https://x/api/team/update-role', {
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

describe('POST /api/team/update-role', () => {
  it('oturum yoksa 401', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://x/api/team/update-role', { method: 'POST', body: '{}' });
    expect((await onRequestPost({ request: req, env: env(db) })).status).toBe(401);
  });

  it('companyId/sub/role eksikse 400', async () => {
    const { db } = makeFakeD1(); await seed(db);
    expect((await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-emp' }), env: env(db) })).status).toBe(400);
  });

  it('geçersiz rol 400', async () => {
    const { db } = makeFakeD1(); await seed(db);
    expect((await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-emp', role: 'superuser' }), env: env(db) })).status).toBe(400);
  });

  it('owner ataması 400 (devir ayrı)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    expect((await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-emp', role: 'owner' }), env: env(db) })).status).toBe(400);
  });

  it('kendi rolünü değiştiremez (400)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    expect((await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-owner', role: 'employee' }), env: env(db) })).status).toBe(400);
  });

  it('employee değiştiremez (403)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-admin', role: 'employee' }, 'sub-emp', 'e@x.com'), env: env(db) });
    expect(res.status).toBe(403);
  });

  it('owner rolü değiştirilemez (403)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-owner', role: 'employee' }, 'sub-admin', 'a@x.com'), env: env(db) });
    expect(res.status).toBe(403);
  });

  it('admin başka admini değiştiremez (403)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-admin2', role: 'employee' }, 'sub-admin', 'a@x.com'), env: env(db) });
    expect(res.status).toBe(403);
  });

  it('olmayan üye 404', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-yok', role: 'admin' }), env: env(db) });
    expect(res.status).toBe(404);
  });

  it('owner employee → admin yapar (200, rol kalıcı)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-emp', role: 'admin' }), env: env(db) });
    expect(res.status).toBe(200);
    expect((await getMembership(db, 'c:co-1', 'sub-emp'))?.role).toBe('admin');
  });

  it('owner admin → employee düşürür (200)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-admin', role: 'employee' }), env: env(db) });
    expect(res.status).toBe(200);
    expect((await getMembership(db, 'c:co-1', 'sub-admin'))?.role).toBe('employee');
  });

  it('admin employee → admin yapabilir (200)', async () => {
    const { db } = makeFakeD1(); await seed(db);
    const res = await onRequestPost({ request: await authedPost({ companyId: 'c:co-1', sub: 'sub-emp', role: 'admin' }, 'sub-admin', 'a@x.com'), env: env(db) });
    expect(res.status).toBe(200);
    expect((await getMembership(db, 'c:co-1', 'sub-emp'))?.role).toBe('admin');
  });
});
