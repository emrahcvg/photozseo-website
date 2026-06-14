import { describe, it, expect } from 'vitest';
import { onRequestPost } from './assign';
import { makeFakeD1 } from '../../../_lib/fakeD1';
import { signSession } from '../../../_lib/session';
import { SESSION_COOKIE } from '../../../../src/storefront/auth/config';
import { createCompany } from '../../../_lib/team';
import { upsertProject } from '../../../_lib/pool';

const SECRET = 'test-secret';

async function makeReq(sub: string, body: unknown): Promise<Request> {
  const token = await signSession({ sub, email: `${sub}@x.com`, name: sub, exp: 9999999999 }, SECRET);
  return new Request('https://x/api/team/pool/assign', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: `${SESSION_COOKIE}=${token}` },
    body: JSON.stringify(body),
  });
}

describe('POST /api/team/pool/assign', () => {
  it('owner 200 döner', async () => {
    const { db } = makeFakeD1();
    await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'O', now: '2026-06-14T00:00:00Z' });
    await upsertProject(db, { companyId: 'c:co-1', projectId: 'p1', createdBy: 'sub-owner', modifiedAt: '2026-06-14T10:00:00Z', snapshot: '{}' });
    const req = await makeReq('sub-owner', { companyId: 'c:co-1', assignments: [{ projectId: 'p1', assignTo: 'sub-ahmet' }] });
    const res = await onRequestPost({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(200);
    const b = await res.json() as { ok: boolean; updated: number };
    expect(b.ok).toBe(true);
    expect(b.updated).toBe(1);
  });

  it('companyId yok → 400', async () => {
    const { db } = makeFakeD1();
    const req = await makeReq('sub-owner', { assignments: [{ projectId: 'p1', assignTo: 'sub-x' }] });
    const res = await onRequestPost({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(400);
  });

  it('üye değil → 403', async () => {
    const { db } = makeFakeD1();
    await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'O', now: '2026-06-14T00:00:00Z' });
    const req = await makeReq('sub-stranger', { companyId: 'c:co-1', assignments: [{ projectId: 'p1', assignTo: 'sub-x' }] });
    const res = await onRequestPost({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(403);
  });
});
