import { describe, it, expect } from 'vitest';
import { onRequestGet } from './manifest';
import { makeFakeD1 } from '../../../_lib/fakeD1';
import { signSession } from '../../../_lib/session';
import { SESSION_COOKIE } from '../../../../src/storefront/auth/config';
import { createCompany } from '../../../_lib/team';
import { upsertProject } from '../../../_lib/pool';

const SECRET = 'test-secret';

async function authedGet(sub: string, url: string): Promise<Request> {
  const token = await signSession({ sub, email: 's@x.com', name: 'S', exp: 9999999999 }, SECRET);
  return new Request(url, { headers: { cookie: `${SESSION_COOKIE}=${token}` } });
}

describe('GET /api/team/pool/manifest', () => {
  async function seed(db: any) {
    await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'O', now: '2026-06-08T00:00:00Z' });
    await upsertProject(db, { companyId: 'c:co-1', projectId: 'p1', createdBy: 'sub-owner', modifiedAt: '2026-06-08T08:00:00Z', snapshot: '{}' });
    await upsertProject(db, { companyId: 'c:co-1', projectId: 'p2', createdBy: 'sub-owner', modifiedAt: '2026-06-08T10:00:00Z', snapshot: '{}' });
  }

  it('companyId yoksa 400', async () => {
    const { db } = makeFakeD1();
    const res = await onRequestGet({ request: await authedGet('sub-owner', 'https://x/api/team/pool/manifest'), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(400);
  });

  it('üye değilse 403', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const res = await onRequestGet({ request: await authedGet('sub-stranger', 'https://x/api/team/pool/manifest?companyId=c:co-1'), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(403);
  });

  it('since olmadan tüm projeleri döner', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const res = await onRequestGet({ request: await authedGet('sub-owner', 'https://x/api/team/pool/manifest?companyId=c:co-1'), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(200);
    const body = await res.json() as { projects: { projectId: string }[]; cursor: string };
    expect(body.projects.map((p) => p.projectId)).toEqual(['p1', 'p2']);
    expect(body.cursor).toBe('2026-06-08T10:00:00Z');
  });

  it('since ile delta döner', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const res = await onRequestGet({ request: await authedGet('sub-owner', 'https://x/api/team/pool/manifest?companyId=c:co-1&since=2026-06-08T09:00:00Z'), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    const body = await res.json() as { projects: { projectId: string }[] };
    expect(body.projects.map((p) => p.projectId)).toEqual(['p2']);
  });
});
