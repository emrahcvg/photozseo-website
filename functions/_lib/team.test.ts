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
