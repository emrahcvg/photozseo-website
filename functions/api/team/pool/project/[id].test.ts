import { describe, it, expect } from 'vitest';
import { onRequestGet, onRequestPut, onRequestDelete } from './[id]';
import { makeFakeD1 } from '../../../../_lib/fakeD1';
import { signSession } from '../../../../_lib/session';
import { SESSION_COOKIE } from '../../../../../src/storefront/auth/config';
import { createCompany, upsertMembership } from '../../../../_lib/team';
import { upsertProject, getProject, upsertAsset } from '../../../../_lib/pool';

const SECRET = 'test-secret';

async function authed(sub: string, url: string, method: string, body?: unknown): Promise<Request> {
  const token = await signSession({ sub, email: 's@x.com', name: 'S', exp: 9999999999 }, SECRET);
  return new Request(url, {
    method,
    headers: { cookie: `${SESSION_COOKIE}=${token}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function seedCompany(db: any) {
  await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'O', now: '2026-06-08T00:00:00Z' });
  await upsertMembership(db, { companyId: 'c:co-1', userSub: 'sub-emp', email: 'e@x.com', name: 'E', role: 'employee', now: '2026-06-08T00:00:00Z' });
}

const ENV = (db: any) => ({ STORE_WRITE_KEY: SECRET, MARKET_DB: db });
const CTX = (request: Request, db: any) => ({ request, env: ENV(db), params: { id: 'p1' } });

describe('PUT pool/project/[id]', () => {
  it('üye projeyi upsert eder (200)', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    const req = await authed('sub-emp', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'PUT', { modifiedAt: '2026-06-08T10:00:00Z', snapshot: { name: 'Ürün' } });
    const res = await onRequestPut(CTX(req, db));
    expect(res.status).toBe(200);
    const got = await getProject(db, 'c:co-1', 'p1');
    expect(got!.snapshot).toBe(JSON.stringify({ name: 'Ürün' }));
    expect(got!.created_by).toBe('sub-emp');
  });

  it('üye olmayan 403', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    const req = await authed('sub-stranger', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'PUT', { modifiedAt: '2026-06-08T10:00:00Z', snapshot: {} });
    expect((await onRequestPut(CTX(req, db))).status).toBe(403);
  });

  it('modifiedAt/snapshot eksikse 400', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    const req = await authed('sub-emp', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'PUT', { snapshot: {} });
    expect((await onRequestPut(CTX(req, db))).status).toBe(400);
  });
});

describe('GET pool/project/[id]', () => {
  it('tam snapshot + asset listesi döner', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await upsertProject(db, { companyId: 'c:co-1', projectId: 'p1', createdBy: 'sub-owner', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{"name":"Ü"}' });
    await upsertAsset(db, { companyId: 'c:co-1', projectId: 'p1', assetId: 'a1', r2Key: 'k', createdBy: 'sub-owner', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{"order":0}' });
    const req = await authed('sub-owner', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'GET');
    const res = await onRequestGet(CTX(req, db));
    expect(res.status).toBe(200);
    const body = await res.json() as { project: any; assets: any[] };
    expect(body.project.snapshot).toEqual({ name: 'Ü' });
    expect(body.assets).toHaveLength(1);
  });

  it('yok ise 404', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    const req = await authed('sub-owner', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'GET');
    expect((await onRequestGet(CTX(req, db))).status).toBe(404);
  });
});

describe('DELETE pool/project/[id]', () => {
  it('owner tombstone yapar (200)', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await upsertProject(db, { companyId: 'c:co-1', projectId: 'p1', createdBy: 'sub-emp', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
    const req = await authed('sub-owner', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'DELETE', { deletedAt: '2026-06-08T12:00:00Z' });
    const res = await onRequestDelete(CTX(req, db));
    expect(res.status).toBe(200);
    expect((await getProject(db, 'c:co-1', 'p1'))!.deleted_at).toBe('2026-06-08T12:00:00Z');
  });

  it('employee başkasının projesini silemez (403)', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await upsertProject(db, { companyId: 'c:co-1', projectId: 'p1', createdBy: 'sub-owner', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
    const req = await authed('sub-emp', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'DELETE', { deletedAt: '2026-06-08T12:00:00Z' });
    expect((await onRequestDelete(CTX(req, db))).status).toBe(403);
  });

  it('employee KENDİ projesini silebilir (200)', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await upsertProject(db, { companyId: 'c:co-1', projectId: 'p1', createdBy: 'sub-emp', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
    const req = await authed('sub-emp', 'https://x/api/team/pool/project/p1?companyId=c:co-1', 'DELETE', { deletedAt: '2026-06-08T12:00:00Z' });
    expect((await onRequestDelete(CTX(req, db))).status).toBe(200);
  });
});
