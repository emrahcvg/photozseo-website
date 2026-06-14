/**
 * POST /api/legal/consent
 *
 * Yasal kabul (AUP / koşullar) onaylarının SUNUCU-tarafı kalıcı kaydı.
 * İstemcinin compliance damgasına güvenmek yerine kabulü sunucu UTC saatiyle +
 * IP + UA ile legal_consents tablosuna append-only yazar.
 *
 * Gövde: JSON {
 *   storeSlug?: string,
 *   docs: [{ type: string, version: string, hash?: string }],
 *   consentText?: string,   // verilirse hash'lenip her doc_hash boşsa doldurulur
 *   appVersion?: string,
 *   platform?: string,
 * }
 *
 * Auth: requireWriteAuthOrSession — oturum (session) yolunda sub/email çekilir.
 * Fail-closed: DB yoksa 503, auth yoksa 401, geçersiz gövde 400.
 *
 * 200 { ok: true, ids: string[] }
 */
import { requireWriteAuthOrSession } from '../../_lib/require-session';
import type { D1Like } from '../../_lib/buyer';

interface Env {
  STORE_WRITE_KEY?: string;
  MARKET_DB?: D1Like;
}
type Ctx = { request: Request; env: Env };

interface ConsentDoc {
  type: string;
  version: string;
  hash?: string;
}

export interface ConsentInsert {
  userSub?: string;
  userEmail?: string;
  storeSlug?: string;
  docType: string;
  docVersion: string;
  docHash?: string;
  acceptedAt: string;
  ip?: string;
  userAgent?: string;
  appVersion?: string;
  platform?: string;
}

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/** crypto.randomUUID Workers runtime'da mevcut; fallback gerekmez. */
function newId(): string {
  return crypto.randomUUID();
}

/** İstemci IP'sini (Cloudflare) ve User-Agent'ı request başlıklarından çeker. */
export function requestMeta(request: Request): { ip?: string; userAgent?: string } {
  const ip =
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For') ??
    undefined;
  const userAgent = request.headers.get('User-Agent') ?? undefined;
  return { ip: ip ?? undefined, userAgent };
}

/**
 * legal_consents'e tek bir kabul satırı INSERT eder (append-only).
 * store PUT akışı da bunu çağırır — paylaşılan tek yazma noktası.
 */
export async function recordConsent(db: D1Like, c: ConsentInsert): Promise<string> {
  const id = newId();
  await db
    .prepare(
      `INSERT INTO legal_consents
         (id, user_sub, user_email, store_slug, doc_type, doc_version, doc_hash,
          accepted_at, ip, user_agent, app_version, platform)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      c.userSub ?? null,
      c.userEmail ?? null,
      c.storeSlug ?? null,
      c.docType,
      c.docVersion,
      c.docHash ?? null,
      c.acceptedAt,
      c.ip ?? null,
      c.userAgent ?? null,
      c.appVersion ?? null,
      c.platform ?? null,
    )
    .run();
  return id;
}

/** consentText verilmişse SHA-256 hex hash üretir (doc_hash boşsa doldurmak için). */
export async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  // Fail-closed: yapılandırma yoksa kaydetme garantisi veremeyiz.
  if (!ctx.env.STORE_WRITE_KEY) return json({ error: 'Service not configured' }, 503);
  if (!ctx.env.MARKET_DB) return json({ error: 'DB not configured' }, 503);

  // requireWriteAuthOrSession imzalı (HMAC) layer için ham gövde metnini ister.
  const text = await ctx.request.text();
  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireWriteAuthOrSession(ctx.request, ctx.env, nowSec, text);
  if (auth instanceof Response) return auth;

  const userSub = auth.kind === 'session' ? auth.session.sub : undefined;
  const userEmail = auth.kind === 'session' ? auth.session.email : undefined;

  let body:
    | {
        storeSlug?: string;
        docs?: ConsentDoc[];
        consentText?: string;
        appVersion?: string;
        platform?: string;
      }
    | null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const docs = body?.docs;
  if (!Array.isArray(docs) || docs.length === 0) {
    return json({ error: 'docs[] required' }, 400);
  }

  // Her doc en az type+version içermeli.
  const valid = docs.every(
    (d) => d && typeof d.type === 'string' && d.type.length > 0 && typeof d.version === 'string' && d.version.length > 0,
  );
  if (!valid) return json({ error: 'each doc requires {type, version}' }, 400);

  const { ip, userAgent } = requestMeta(ctx.request);
  const acceptedAt = new Date().toISOString(); // SUNUCU UTC = otorite olan zaman.

  // consentText verilmişse hash'ini hesapla; doc.hash boşsa bununla doldur.
  const fallbackHash = body?.consentText ? await sha256Hex(body.consentText) : undefined;

  const ids: string[] = [];
  for (const d of docs) {
    const id = await recordConsent(ctx.env.MARKET_DB, {
      userSub,
      userEmail,
      storeSlug: body?.storeSlug,
      docType: d.type,
      docVersion: d.version,
      docHash: d.hash ?? fallbackHash,
      acceptedAt,
      ip,
      userAgent,
      appVersion: body?.appVersion,
      platform: body?.platform,
    });
    ids.push(id);
  }

  return json({ ok: true, ids });
}
