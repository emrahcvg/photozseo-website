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
  // Gerçek upsert: aynı (company_id, user_sub) tekrar gelirse UNIQUE hatası yerine güncelle.
  await db
    .prepare(
      'INSERT INTO memberships (company_id, user_sub, email, name, role, joined_at) VALUES (?, ?, ?, ?, ?, ?) ' +
      'ON CONFLICT(company_id, user_sub) DO UPDATE SET email = excluded.email, name = excluded.name, role = excluded.role, joined_at = excluded.joined_at',
    )
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

/** Bir şirketin tek bir üyesinin görünümü (roster için; sub ile kimliklenir). */
export interface CompanyMemberView {
  sub: string;
  email: string;
  name: string | null;
  role: Role;
  joinedAt: string;
}

/** Bir şirketin tüm üyelerini döner. Çağıran tarafça üyelik yetkisi doğrulanmalı. */
export async function listCompanyMembers(db: D1Like, companyId: string): Promise<CompanyMemberView[]> {
  const { results } = await db
    .prepare('SELECT company_id, user_sub, email, name, role, joined_at FROM memberships WHERE company_id = ?')
    .bind(companyId)
    .all<MembershipRow>();
  return results.map((r) => ({
    sub: r.user_sub, email: r.email, name: r.name, role: r.role, joinedAt: r.joined_at,
  }));
}

/** Bir üyeliği siler. Çağıran tarafça yetki + rol kuralları doğrulanmalı. */
export async function removeMembership(db: D1Like, companyId: string, userSub: string): Promise<void> {
  await db
    .prepare('DELETE FROM memberships WHERE company_id = ? AND user_sub = ?')
    .bind(companyId, userSub)
    .run();
}

/** Şirketteki owner sayısı — son-owner ayrılma/çıkarılma korumasında kullanılır. */
export async function countOwners(db: D1Like, companyId: string): Promise<number> {
  const row = await db
    .prepare("SELECT COUNT(*) AS n FROM memberships WHERE company_id = ? AND role = 'owner'")
    .bind(companyId)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export interface InviteRow {
  code: string;
  company_id: string;
  role: Role;
  created_by: string;
  created_at: string;
  expires_at: string;
  redeemed_by: string | null;
  redeemed_at: string | null;
}

/** Davet kaydı oluşturur. Kod ve süre endpoint'te üretilir, buraya parametre gelir. */
export async function createInvite(
  db: D1Like,
  inv: { code: string; companyId: string; role: Role; createdBy: string; now: string; expiresAt: string },
): Promise<void> {
  await db
    .prepare('INSERT INTO invites (code, company_id, role, created_by, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(inv.code, inv.companyId, inv.role, inv.createdBy, inv.now, inv.expiresAt)
    .run();
}

export type RedeemResult =
  | { ok: true; companyId: string; role: Role }
  | { ok: false; reason: 'not_found' | 'expired' | 'used' | 'already_member' };

/**
 * Daveti kullanır: doğrulama (var/süre/kullanılmamış/zaten-üye) → üyelik oluştur → daveti işaretle.
 * `now` ve karşılaştırmalar ISO string (sözlüksel sıralama UTC ISO'da kronolojiktir).
 */
export async function redeemInvite(
  db: D1Like,
  req: { code: string; userSub: string; email: string; name: string | null; now: string },
): Promise<RedeemResult> {
  const normalized = req.code.toUpperCase();
  const inv = await db
    .prepare('SELECT code, company_id, role, created_by, created_at, expires_at, redeemed_by, redeemed_at FROM invites WHERE code = ?')
    .bind(normalized)
    .first<InviteRow>();

  if (!inv) return { ok: false, reason: 'not_found' };
  if (inv.redeemed_by) return { ok: false, reason: 'used' };
  if (inv.expires_at < req.now) return { ok: false, reason: 'expired' };

  const existing = await getMembership(db, inv.company_id, req.userSub);
  if (existing) return { ok: false, reason: 'already_member' };

  await upsertMembership(db, {
    companyId: inv.company_id, userSub: req.userSub, email: req.email, name: req.name, role: inv.role, now: req.now,
  });
  await db
    .prepare('UPDATE invites SET redeemed_by = ?, redeemed_at = ? WHERE code = ? AND redeemed_by IS NULL')
    .bind(req.userSub, req.now, normalized)
    .run();

  return { ok: true, companyId: inv.company_id, role: inv.role };
}
