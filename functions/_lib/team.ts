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

// Karışık-olmayan alfabe: I, O, 0, 1 çıkarıldı (okuma hatasını önler).
const INVITE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const INVITE_LEN = 8;
const INVITE_RE = /^[A-HJ-NP-Z2-9]{8}$/;

/** Rastgele bayt sağlayıcı (test edilebilirlik için enjekte edilir). */
export type RandomBytes = (n: number) => Uint8Array;

/** 8 karakterlik davet kodu üretir. rand: endpoint'te crypto.getRandomValues sarmalayıcısı. */
export function randomInviteCode(rand: RandomBytes): string {
  const bytes = rand(INVITE_LEN);
  let out = '';
  for (let i = 0; i < INVITE_LEN; i++) {
    out += INVITE_ALPHABET[bytes[i] % INVITE_ALPHABET.length];
  }
  return out;
}

/** Davet kodu biçim kontrolü (büyük harfe normalize ederek). */
export function isValidInviteCode(code: string): boolean {
  if (!code) return false;
  return INVITE_RE.test(code.toUpperCase());
}
