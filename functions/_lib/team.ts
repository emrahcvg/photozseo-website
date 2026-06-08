/**
 * team.ts — Takım/Ortak Havuz Faz 1 saf veri-erişim + rol/capability katmanı.
 * D1Like üstünde çalışır (functions/_lib/buyer.ts'den yeniden kullanılır).
 * Roller sabit; enforcement can() arkasında — v1.x granüler rol için tek nokta.
 */
import type { D1Like } from './buyer';

export const ROLES = ['owner', 'admin', 'employee'] as const;
export type Role = (typeof ROLES)[number];

export type Capability =
  | 'editAllProjects'
  | 'export'
  | 'publish'
  | 'viewPricing'
  | 'companySettings'
  | 'manageMembers'
  | 'billing'
  | 'deleteCompany';

const ADMIN_CAPS: Capability[] = [
  'editAllProjects', 'export', 'publish', 'viewPricing', 'companySettings', 'manageMembers',
];
const OWNER_CAPS: Capability[] = [...ADMIN_CAPS, 'billing', 'deleteCompany'];

const MATRIX: Record<Role, ReadonlySet<Capability>> = {
  owner: new Set(OWNER_CAPS),
  admin: new Set(ADMIN_CAPS),
  employee: new Set<Capability>(),
};

/** Verilen rolün bir yeteneğe sahip olup olmadığını döner. Tek enforcement noktası. */
export function can(role: Role, cap: Capability): boolean {
  return MATRIX[role]?.has(cap) ?? false;
}
