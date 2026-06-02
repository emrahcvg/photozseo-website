/**
 * buyer-owner.ts birim testleri — sahip anahtar çözümleme.
 */
import { describe, it, expect } from 'vitest';
import { resolveOwnerKey } from './buyer-owner';
import { signSession, type SessionPayload } from './session';

const SECRET = 'test-secret-32-bytes-0000000000000';
const NOW = 1_700_000_000;
const FUTURE_EXP = NOW + 86_400;
const DEVICE_UUID = '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';
const SUB = 'google-user-123';

function makeRequest(opts: { cookie?: string; deviceId?: string }): Request {
  const headers: Record<string, string> = {};
  if (opts.cookie !== undefined) headers['cookie'] = opts.cookie;
  if (opts.deviceId !== undefined) headers['x-device-id'] = opts.deviceId;
  return new Request('https://photozseo.com/api/store/test/favorites', { method: 'GET', headers });
}

describe('resolveOwnerKey', () => {
  it('geçerli session cookie → b:<sub> döner', async () => {
    const payload: SessionPayload = { sub: SUB, email: 'test@example.com', exp: FUTURE_EXP };
    const token = await signSession(payload, SECRET);
    const req = makeRequest({ cookie: `pz_session=${token}` });
    const key = await resolveOwnerKey(req, SECRET, NOW);
    expect(key).toBe(`b:${SUB}`);
  });

  it('cookie yok, geçerli x-device-id → d:<uuid> döner', async () => {
    const req = makeRequest({ deviceId: DEVICE_UUID });
    const key = await resolveOwnerKey(req, SECRET, NOW);
    expect(key).toBe(`d:${DEVICE_UUID}`);
  });

  it('bozuk cookie + geçerli device → d:<uuid> döner (device fallback)', async () => {
    const req = makeRequest({ cookie: 'pz_session=bad.cookie.value', deviceId: DEVICE_UUID });
    const key = await resolveOwnerKey(req, SECRET, NOW);
    expect(key).toBe(`d:${DEVICE_UUID}`);
  });

  it('ne cookie ne device → null döner', async () => {
    const req = makeRequest({});
    const key = await resolveOwnerKey(req, SECRET, NOW);
    expect(key).toBeNull();
  });
});
