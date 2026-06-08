import { describe, it, expect } from 'vitest';
import { makeFakeD1 } from './fakeD1';
import { signSession } from './session';
import { SESSION_COOKIE } from '../../src/storefront/auth/config';
import { createCompany } from './team';
import { requireMembership } from './pool-authz';

const SECRET = 'test-secret';

async function req(sub: string, email: string): Promise<Request> {
  const token = await signSession({ sub, email, name: 'X', exp: 9999999999 }, SECRET);
  return new Request('https://x/api/team/pool/x', { headers: { cookie: `${SESSION_COOKIE}=${token}` } });
}

describe('requireMembership', () => {
  it('oturum yoksa 401 Response döner', async () => {
    const { db } = makeFakeD1();
    const r = new Request('https://x/api/team/pool/x');
    const out = await requireMembership(r, { STORE_WRITE_KEY: SECRET, MARKET_DB: db }, 'c:co-1', 0);
    expect(out instanceof Response).toBe(true);
    expect((out as Response).status).toBe(401);
  });

  it('üye değilse 403 Response', async () => {
    const { db } = makeFakeD1();
    await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'O', now: '2026-06-08T00:00:00Z' });
    const out = await requireMembership(await req('sub-stranger', 's@x.com'), { STORE_WRITE_KEY: SECRET, MARKET_DB: db }, 'c:co-1', 0);
    expect((out as Response).status).toBe(403);
  });

  it('üye ise { sub, role } döner', async () => {
    const { db } = makeFakeD1();
    await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'O', now: '2026-06-08T00:00:00Z' });
    const out = await requireMembership(await req('sub-owner', 'o@x.com'), { STORE_WRITE_KEY: SECRET, MARKET_DB: db }, 'c:co-1', 0);
    expect(out).toMatchObject({ sub: 'sub-owner', role: 'owner' });
  });
});
