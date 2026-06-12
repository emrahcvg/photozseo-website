import { describe, it, expect, vi } from 'vitest';
import { onRequestPost } from './create';
import { makeFakeD1 } from '../../_lib/fakeD1';
import { signSession } from '../../_lib/session';
import { SESSION_COOKIE } from '../../../src/storefront/auth/config';

const SECRET = 'test-secret';

async function authedRequest(body: unknown): Promise<Request> {
  const token = await signSession(
    { sub: 'sub-ahmet', email: 'ahmet@x.com', name: 'Ahmet', exp: 9999999999 },
    SECRET,
  );
  return new Request('https://x/api/team/create', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: `${SESSION_COOKIE}=${token}` },
    body: JSON.stringify(body),
  });
}

describe('POST /api/team/create', () => {
  it('oturum yoksa 401', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://x/api/team/create', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"name":"A"}' });
    const res = await onRequestPost({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(401);
  });

  it('name yoksa 400', async () => {
    const { db } = makeFakeD1();
    const res = await onRequestPost({ request: await authedRequest({}), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(400);
  });

  it('geçerli istek şirket oluşturur, kurucu owner olur', async () => {
    const { db, tables } = makeFakeD1();
    const res = await onRequestPost({ request: await authedRequest({ name: 'Ahmet Oto' }), env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(res.status).toBe(200);
    const json = await res.json() as { ok: boolean; companyId: string; role: string };
    expect(json.ok).toBe(true);
    expect(json.role).toBe('owner');
    expect(tables.companies).toHaveLength(1);
    expect(tables.memberships[0]).toMatchObject({ role: 'owner', user_sub: 'sub-ahmet' });
    expect(tables.team_activity_log.length).toBeGreaterThan(0);
    expect(tables.team_activity_log[0].event_type).toBe('company_created');
  });
});
