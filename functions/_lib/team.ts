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

export interface MembershipRow {
  company_id: string;
  user_sub: string;
  email: string;
  name: string | null;
  role: Role;
  joined_at: string;
}

export interface MembershipView {
  companyId: string;
  role: Role;
  email: string;
  name: string | null;
  joinedAt: string;
}

/** Üyeliği üye olarak ekler/günceller (upsert). Saf veri katmanı. */
export async function upsertMembership(
  db: D1Like,
  m: { companyId: string; userSub: string; email: string; name: string | null; role: Role; now: string },
): Promise<void> {
  await db
    .prepare('INSERT INTO memberships (company_id, user_sub, email, name, role, joined_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(m.companyId, m.userSub, m.email, m.name, m.role, m.now)
    .run();
}

/** Şirket oluşturur ve kurucuyu owner üye yapar. */
export async function createCompany(
  db: D1Like,
  c: { companyId: string; name: string; ownerSub: string; email: string; ownerName: string | null; now: string },
): Promise<void> {
  await db
    .prepare('INSERT INTO companies (id, name, owner_sub, created_at) VALUES (?, ?, ?, ?)')
    .bind(c.companyId, c.name, c.ownerSub, c.now)
    .run();
  await upsertMembership(db, {
    companyId: c.companyId, userSub: c.ownerSub, email: c.email, name: c.ownerName, role: 'owner', now: c.now,
  });
}

/** Tek üyelik kaydını döner; yoksa null. */
export async function getMembership(db: D1Like, companyId: string, userSub: string): Promise<MembershipRow | null> {
  return db
    .prepare('SELECT company_id, user_sub, email, name, role, joined_at FROM memberships WHERE company_id = ? AND user_sub = ?')
    .bind(companyId, userSub)
    .first<MembershipRow>();
}

/** Kullanıcının tüm üyeliklerini görünüm olarak döner. */
export async function listMemberships(db: D1Like, userSub: string): Promise<MembershipView[]> {
  const { results } = await db
    .prepare('SELECT company_id, user_sub, email, name, role, joined_at FROM memberships WHERE user_sub = ?')
    .bind(userSub)
    .all<MembershipRow>();
  return results.map((r) => ({
    companyId: r.company_id, role: r.role, email: r.email, name: r.name, joinedAt: r.joined_at,
  }));
}
