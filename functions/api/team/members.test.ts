import { describe, it, expect } from 'vitest';
import { onRequestGet } from './members';
import { makeFakeD1 } from '../../_lib/fakeD1';
import { signSession } from '../../_lib/session';
import { SESSION_COOKIE } from '../../../src/storefront/auth/config';
import { createCompany, upsertMembership } from '../../_lib/team';

const SECRET = 'test-secret';

async function authedGet(companyId: string | null, sub = 'sub-owner', email = 'o@x.com'): Promise<Request> {
  const token = await signSession({ sub, email, name: 'Owner', exp: 9999999999 }, SECRET);
  const url = companyId === null ? 'https://x/api/team/members' : `https://x/api/team/members?companyId=${encodeURIComponent(companyId)}`;
  return new Request(url, { headers: { cookie: `${SESSION_COOKIE}=${token}` } });
}

async function seed(db: ReturnType<typeof makeFakeD1>['db']): Promise<void> {
  await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-owner', email: 'o@x.com', ownerName: 'Owner', now: '2026-06-08T00:00:00Z' });
  await upsertMembership(db, { companyId: 'c:co-1', userSub: 'sub-emp', email: 'e@x.com', name: 'Emp', role: 'employee', now: '2026-06-08T00:01:00Z' });
}

describe('GET /api/team/members', () => {
  it('oturum yoksa 401', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://x/api/team/members?companyId=c:co-1');
    const res = await onRequestGet({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(401);
  });

  it('companyId yoksa 400', async () => {
    const { db } = makeFakeD1();
    const res = await onRequestGet({ request: await authedGet(null), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(400);
  });

  it('üye olmayan şirket için 403', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const res = await onRequestGet({ request: await authedGet('c:co-1', 'sub-yabanci', 'y@x.com'), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(403);
  });

  it('üye ise roster döner (owner dahil)', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const res = await onRequestGet({ request: await authedGet('c:co-1'), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(200);
    const json = await res.json() as { ok: boolean; members: { sub: string; role: string }[] };
    expect(json.ok).toBe(true);
    expect(json.members.map((m) => m.sub).sort()).toEqual(['sub-emp', 'sub-owner']);
  });

  it('employee de roster görebilir (salt-okunur)', async () => {
    const { db } = makeFakeD1();
    await seed(db);
    const res = await onRequestGet({ request: await authedGet('c:co-1', 'sub-emp', 'e@x.com'), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(200);
  });
});
