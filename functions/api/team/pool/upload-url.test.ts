import { describe, it, expect } from 'vitest';
import { onRequestPost } from './upload-url';
import { makeFakeD1 } from '../../../_lib/fakeD1';
import { signSession } from '../../../_lib/session';
import { SESSION_COOKIE } from '../../../../src/storefront/auth/config';
import { createCompany } from '../../../_lib/team';
import { getAsset } from '../../../_lib/pool';

const SECRET = 'test-secret';
const R2 = { R2_ACCOUNT_ID: 'acct123', R2_ACCESS_KEY_ID: 'AKIA', R2_SECRET_ACCESS_KEY: 'sk' };

async function authed(sub: string, body: unknown): Promise<Request> {
  const token = await signSession({ sub, email: 's@x.com', name: 'S', exp: 9999999999 }, SECRET);
  return new Request('https://x/api/team/pool/upload-url', {
    method: 'POST', headers: { cookie: `${SESSION_COOKIE}=${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
}

async function seed(db: any) {
  await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'O', now: '2026-06-08T00:00:00Z' });
}

describe('POST /api/team/pool/upload-url', () => {
  it('üye için presigned PUT URL döner + asset metadata yazar', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const req = await authed('sub-owner', { companyId: 'c:co-1', projectId: 'p1', assetId: 'a1', ext: 'jpg', modifiedAt: '2026-06-08T10:00:00Z', snapshot: { order: 0 } });
    const res = await onRequestPost({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db, ...R2 } });
    expect(res.status).toBe(200);
    const body = await res.json() as { uploadUrl: string; r2Key: string };
    expect(body.uploadUrl).toContain('X-Amz-Signature=');
    expect(body.r2Key).toBe('companies/c:co-1/projects/p1/original/a1.jpg');
    const a = await getAsset(db, 'c:co-1', 'p1', 'a1');
    expect(a!.r2_key).toBe('companies/c:co-1/projects/p1/original/a1.jpg');
  });

  it('üye değilse 403', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const req = await authed('sub-stranger', { companyId: 'c:co-1', projectId: 'p1', assetId: 'a1', ext: 'jpg', modifiedAt: '2026-06-08T10:00:00Z', snapshot: {} });
    expect((await onRequestPost({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db, ...R2 } })).status).toBe(403);
  });

  it('güvensiz id (path traversal) 400', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const req = await authed('sub-owner', { companyId: 'c:co-1', projectId: '../etc', assetId: 'a1', ext: 'jpg', modifiedAt: '2026-06-08T10:00:00Z', snapshot: {} });
    expect((await onRequestPost({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db, ...R2 } })).status).toBe(400);
  });

  it('R2 yapılandırılmamışsa 503', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const req = await authed('sub-owner', { companyId: 'c:co-1', projectId: 'p1', assetId: 'a1', ext: 'jpg', modifiedAt: '2026-06-08T10:00:00Z', snapshot: {} });
    expect((await onRequestPost({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } })).status).toBe(503);
  });
});
