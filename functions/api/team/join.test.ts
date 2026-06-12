import { describe, it, expect } from 'vitest';
import { onRequestPost as join } from './join';
import { onRequestPost as invite } from './invite';
import { onRequestPost as create } from './create';
import { onRequestGet as me } from './me';
import { makeFakeD1 } from '../../_lib/fakeD1';
import { signSession } from '../../_lib/session';
import { SESSION_COOKIE } from '../../../src/storefront/auth/config';

const SECRET = 'test-secret';

async function authed(sub: string, email: string, name: string, url: string, body: unknown): Promise<Request> {
  const token = await signSession({ sub, email, name, exp: 9999999999 }, SECRET);
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: `${SESSION_COOKIE}=${token}` },
    body: JSON.stringify(body),
  });
}

describe('team join akışı', () => {
  it('owner şirket kurar → davet üretir → çalışan katılır', async () => {
    const { db, tables } = makeFakeD1();
    const env = { STORE_WRITE_KEY: SECRET, MARKET_DB: db };

    const cRes = await create({ request: await authed('sub-owner', 'o@x.com', 'O', 'https://x/api/team/create', { name: 'Ahmet Oto' }), env });
    const { companyId } = await cRes.json() as { companyId: string };

    const iRes = await invite({ request: await authed('sub-owner', 'o@x.com', 'O', 'https://x/api/team/invite', { companyId, role: 'employee' }), env });
    expect(iRes.status).toBe(200);
    const { code } = await iRes.json() as { code: string };

    const jRes = await join({ request: await authed('sub-emp', 'e@x.com', 'Emre', 'https://x/api/team/join', { code }), env });
    expect(jRes.status).toBe(200);
    expect(await jRes.json()).toMatchObject({ ok: true, companyId, role: 'employee' });
    expect(tables.memberships.find((m) => m.user_sub === 'sub-emp')).toMatchObject({ role: 'employee' });
    expect(tables.team_activity_log.length).toBeGreaterThan(0);
    expect(tables.team_activity_log.some(r => r.event_type === 'member_added')).toBe(true);
    expect(tables.team_activity_log.some(r => r.event_type === 'member_invited')).toBe(true);
  });

  it('employee davet üretemez (403)', async () => {
    const { db } = makeFakeD1();
    const env = { STORE_WRITE_KEY: SECRET, MARKET_DB: db };
    const cRes = await create({ request: await authed('sub-owner', 'o@x.com', 'O', 'https://x/api/team/create', { name: 'A' }), env });
    const { companyId } = await cRes.json() as { companyId: string };
    const iRes = await invite({ request: await authed('sub-owner', 'o@x.com', 'O', 'https://x/api/team/invite', { companyId, role: 'employee' }), env });
    const { code } = await iRes.json() as { code: string };
    await join({ request: await authed('sub-emp', 'e@x.com', 'E', 'https://x/api/team/join', { code }), env });

    // employee başka kod üretmeye kalkışır
    const denied = await invite({ request: await authed('sub-emp', 'e@x.com', 'E', 'https://x/api/team/invite', { companyId, role: 'employee' }), env });
    expect(denied.status).toBe(403);
  });

  it('aynı kod ikinci kez kullanılamaz (409)', async () => {
    const { db } = makeFakeD1();
    const env = { STORE_WRITE_KEY: SECRET, MARKET_DB: db };
    const cRes = await create({ request: await authed('sub-owner', 'o@x.com', 'O', 'https://x/api/team/create', { name: 'A' }), env });
    const { companyId } = await cRes.json() as { companyId: string };
    const iRes = await invite({ request: await authed('sub-owner', 'o@x.com', 'O', 'https://x/api/team/invite', { companyId, role: 'employee' }), env });
    const { code } = await iRes.json() as { code: string };

    await join({ request: await authed('sub-1', '1@x.com', '1', 'https://x/api/team/join', { code }), env });
    const second = await join({ request: await authed('sub-2', '2@x.com', '2', 'https://x/api/team/join', { code }), env });
    expect(second.status).toBe(409);
  });

  it('me, kullanıcının üyeliklerini döner', async () => {
    const { db } = makeFakeD1();
    const env = { STORE_WRITE_KEY: SECRET, MARKET_DB: db };
    await create({ request: await authed('sub-owner', 'o@x.com', 'O', 'https://x/api/team/create', { name: 'A' }), env });

    const token = await signSession({ sub: 'sub-owner', email: 'o@x.com', name: 'O', exp: 9999999999 }, SECRET);
    const req = new Request('https://x/api/team/me', { headers: { cookie: `${SESSION_COOKIE}=${token}` } });
    const res = await me({ request: req, env });
    const body = await res.json() as { loggedIn: boolean; memberships: { role: string }[] };
    expect(body.loggedIn).toBe(true);
    expect(body.memberships).toHaveLength(1);
    expect(body.memberships[0].role).toBe('owner');
  });

  it('me, oturum yoksa loggedIn:false', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://x/api/team/me');
    const res = await me({ request: req, env: { STORE_WRITE_KEY: SECRET, MARKET_DB: db } });
    expect(await res.json()).toEqual({ loggedIn: false });
  });
});
