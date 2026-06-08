import { describe, it, expect } from 'vitest';
import { onRequestGet, onRequestDelete } from './[id]';
import { makeFakeD1 } from '../../../../_lib/fakeD1';
import { signSession } from '../../../../_lib/session';
import { SESSION_COOKIE } from '../../../../../src/storefront/auth/config';
import { createCompany, upsertMembership } from '../../../../_lib/team';
import { upsertProject, upsertAsset, getAsset } from '../../../../_lib/pool';

const SECRET = 'test-secret';
const R2 = { R2_ACCOUNT_ID: 'acct123', R2_ACCESS_KEY_ID: 'AKIA', R2_SECRET_ACCESS_KEY: 'sk' };

async function authed(sub: string, method: string, body?: unknown): Promise<Request> {
  const token = await signSession({ sub, email: 's@x.com', name: 'S', exp: 9999999999 }, SECRET);
  return new Request('https://x/api/team/pool/asset/a1?companyId=c:co-1&projectId=p1', {
    method,
    headers: { cookie: `${SESSION_COOKIE}=${token}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function seedCompany(db: any) {
  await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'O', now: '2026-06-08T00:00:00Z' });
  await upsertMembership(db, { companyId: 'c:co-1', userSub: 'sub-emp', email: 'e@x.com', name: 'E', role: 'employee', now: '2026-06-08T00:00:00Z' });
  await upsertProject(db, { companyId: 'c:co-1', projectId: 'p1', createdBy: 'sub-owner', modifiedAt: '2026-06-08T08:00:00Z', snapshot: '{}' });
}

async function seedAsset(db: any, createdBy: string) {
  await upsertAsset(db, { companyId: 'c:co-1', projectId: 'p1', assetId: 'a1', r2Key: 'companies/c:co-1/projects/p1/original/a1.jpg', createdBy, modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{"order":0}' });
}

const ENV = (db: any, r2 = true) => ({ STORE_WRITE_KEY: SECRET, MARKET_DB: db, ...(r2 ? R2 : {}) });
const CTX = (request: Request, db: any, r2 = true) => ({ request, env: ENV(db, r2), params: { id: 'a1' } });

describe('GET pool/asset/[id]', () => {
  it('asset yoksa 404', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    const req = await authed('sub-owner', 'GET');
    expect((await onRequestGet(CTX(req, db))).status).toBe(404);
  });

  it('üye olmayan 403', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await seedAsset(db, 'sub-owner');
    const req = await authed('sub-stranger', 'GET');
    expect((await onRequestGet(CTX(req, db))).status).toBe(403);
  });

  it('var olan asset için 200 + presigned download URL', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await seedAsset(db, 'sub-owner');
    const req = await authed('sub-owner', 'GET');
    const res = await onRequestGet(CTX(req, db));
    expect(res.status).toBe(200);
    const body = await res.json() as { downloadUrl: string };
    expect(body.downloadUrl).toContain('X-Amz-Signature=');
  });

  it('R2 yapılandırılmamışsa 503', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await seedAsset(db, 'sub-owner');
    const req = await authed('sub-owner', 'GET');
    expect((await onRequestGet(CTX(req, db, false))).status).toBe(503);
  });
});

describe('DELETE pool/asset/[id]', () => {
  it('owner başka birinin asset\'ini tombstone yapar (200)', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await seedAsset(db, 'sub-emp');
    const req = await authed('sub-owner', 'DELETE', { deletedAt: '2026-06-08T12:00:00Z' });
    const res = await onRequestDelete(CTX(req, db));
    expect(res.status).toBe(200);
    expect((await getAsset(db, 'c:co-1', 'p1', 'a1'))!.deleted_at).toBe('2026-06-08T12:00:00Z');
  });

  it('employee başkasının asset\'ini silemez (403)', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await seedAsset(db, 'sub-owner');
    const req = await authed('sub-emp', 'DELETE', { deletedAt: '2026-06-08T12:00:00Z' });
    expect((await onRequestDelete(CTX(req, db))).status).toBe(403);
  });

  it('employee KENDİ asset\'ini siler (200)', async () => {
    const { db } = makeFakeD1();
    await seedCompany(db);
    await seedAsset(db, 'sub-emp');
    const req = await authed('sub-emp', 'DELETE', { deletedAt: '2026-06-08T12:00:00Z' });
    const res = await onRequestDelete(CTX(req, db));
    expect(res.status).toBe(200);
    expect((await getAsset(db, 'c:co-1', 'p1', 'a1'))!.deleted_at).toBe('2026-06-08T12:00:00Z');
  });
});
