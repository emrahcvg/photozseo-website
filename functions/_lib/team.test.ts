import { describe, it, expect } from 'vitest';
import { ROLES, type Role, can } from './team';

describe('roller', () => {
  it('üç sabit rol tanımlı', () => {
    expect(ROLES).toEqual(['owner', 'admin', 'employee']);
  });
});

describe('can(role, capability)', () => {
  it('owner her şeyi yapabilir', () => {
    for (const cap of ['editAllProjects','export','publish','viewPricing','companySettings','manageMembers','billing','deleteCompany'] as const) {
      expect(can('owner', cap)).toBe(true);
    }
  });

  it('admin billing ve deleteCompany hariç her şeyi yapar', () => {
    expect(can('admin', 'publish')).toBe(true);
    expect(can('admin', 'manageMembers')).toBe(true);
    expect(can('admin', 'companySettings')).toBe(true);
    expect(can('admin', 'billing')).toBe(false);
    expect(can('admin', 'deleteCompany')).toBe(false);
  });

  it('employee operasyonel yeteneklerin hiçbirini yapamaz', () => {
    for (const cap of ['editAllProjects','export','publish','viewPricing','companySettings','manageMembers','billing','deleteCompany'] as const) {
      expect(can('employee', cap)).toBe(false);
    }
  });
});

import { randomInviteCode, isValidInviteCode } from './team';

describe('davet kodu', () => {
  it('randomInviteCode 8 karakter karışık-olmayan alfabe üretir', () => {
    const code = randomInviteCode((n) => new Uint8Array(n).fill(0));
    expect(code).toHaveLength(8);
    expect(/^[A-HJ-NP-Z2-9]{8}$/.test(code)).toBe(true); // I,O,0,1 yok
  });

  it('farklı rastgele baytlar farklı kod üretir', () => {
    const a = randomInviteCode((n) => { const u = new Uint8Array(n); u.forEach((_,i)=>u[i]=i); return u; });
    const b = randomInviteCode((n) => { const u = new Uint8Array(n); u.forEach((_,i)=>u[i]=i+5); return u; });
    expect(a).not.toBe(b);
  });

  it('isValidInviteCode biçim kontrolü', () => {
    expect(isValidInviteCode('ABCD2345')).toBe(true);
    expect(isValidInviteCode('abcd2345')).toBe(true);   // küçük harf normalize edilir
    expect(isValidInviteCode('ABC')).toBe(false);        // kısa
    expect(isValidInviteCode('ABCD23I5')).toBe(false);   // I yasak
    expect(isValidInviteCode('ABCD 234')).toBe(false);   // boşluk
  });
});

import { makeFakeD1 } from './fakeD1';
import { createCompany, getMembership, listMemberships } from './team';

describe('createCompany + üyelik', () => {
  it('şirket oluşturur ve kurucuyu owner yapar', async () => {
    const { db } = makeFakeD1();
    await createCompany(db, {
      companyId: 'c:co-1', name: 'Ahmet Oto', ownerSub: 'sub-ahmet',
      email: 'ahmet@x.com', ownerName: 'Ahmet', now: '2026-06-08T00:00:00Z',
    });

    const m = await getMembership(db, 'c:co-1', 'sub-ahmet');
    expect(m).toMatchObject({ company_id: 'c:co-1', role: 'owner', email: 'ahmet@x.com' });
  });

  it('listMemberships kullanıcının tüm üyeliklerini döner', async () => {
    const { db } = makeFakeD1();
    await createCompany(db, { companyId: 'c:co-1', name: 'A', ownerSub: 'sub-1', email: 'a@x.com', ownerName: 'A', now: '2026-06-08T00:00:00Z' });
    await createCompany(db, { companyId: 'c:co-2', name: 'B', ownerSub: 'sub-1', email: 'a@x.com', ownerName: 'A', now: '2026-06-08T00:00:01Z' });

    const list = await listMemberships(db, 'sub-1');
    expect(list.map((m) => m.companyId).sort()).toEqual(['c:co-1', 'c:co-2']);
    expect(list.every((m) => m.role === 'owner')).toBe(true);
  });

  it('üyeliği olmayan kullanıcı için null/boş döner', async () => {
    const { db } = makeFakeD1();
    expect(await getMembership(db, 'c:yok', 'sub-yok')).toBeNull();
    expect(await listMemberships(db, 'sub-yok')).toEqual([]);
  });
});
