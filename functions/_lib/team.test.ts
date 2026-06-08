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
