/**
 * POST /api/report — herkese açık şikayet (notice) girişi.
 *
 * Auth YOK: alıcı / 3. taraf / hak sahibi şikayet edebilir (App Store 1.2 UGC
 * şikayet mekanizması + DSA notice-and-action). Şikayet D1 `reports` kuyruğuna
 * status='open' yazılır; admin sonradan /api/admin/takedown ile aksiyon alır.
 *
 * Body: { slug, productId?, reason, reporterContact?, details? }
 * reason whitelist: counterfeit | prohibited | fraud | ip_infringement | other
 *
 * Spam koruması: IP-bazlı KV rate-limit (10 şikayet / saat / IP).
 * 200 → { ok: true, reportId }
 */

interface Env {
  STORE_KV: KVNamespace;
  MARKET_DB?: D1Database;
}

// İzin verilen şikayet sebepleri (kapalı liste).
const VALID_REASONS = ['counterfeit', 'prohibited', 'fraud', 'ip_infringement', 'other'] as const;
type ReportReason = (typeof VALID_REASONS)[number];

const VALID_SLUG = /^[a-z0-9][a-z0-9-]{0,98}[a-z0-9]$|^[a-z0-9]$/;
const MAX_DETAILS = 2000;
const MAX_CONTACT = 200;
const MAX_PRODUCT_ID = 200;

// Spam koruması: saatte 10 şikayet / IP.
const RATE_LIMIT = 10;
const RATE_WINDOW_SECONDS = 60 * 60;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/** IP başına saatlik şikayet sayacı; limiti aşınca false. */
async function checkRateLimit(kv: KVNamespace, ip: string): Promise<boolean> {
  const key = `report_rl:${ip}`;
  const raw = await kv.get(key);
  const count = raw ? parseInt(raw, 10) : 0;
  if (count >= RATE_LIMIT) return false;
  await kv.put(key, String(count + 1), { expirationTtl: RATE_WINDOW_SECONDS });
  return true;
}

function isValidReason(r: unknown): r is ReportReason {
  return typeof r === 'string' && (VALID_REASONS as readonly string[]).includes(r);
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const db = ctx.env.MARKET_DB;
  if (!db) return json({ error: 'DB not configured' }, 503);

  const ip = ctx.request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const allowed = await checkRateLimit(ctx.env.STORE_KV, ip);
  if (!allowed) return json({ error: 'Too many reports, try again later' }, 429);

  let body: {
    slug?: string;
    productId?: string;
    reason?: string;
    reporterContact?: string;
    details?: string;
  };
  try {
    body = await ctx.request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const slug = body.slug?.trim();
  if (!slug || !VALID_SLUG.test(slug)) return json({ error: 'Invalid or missing slug' }, 400);

  if (!isValidReason(body.reason)) {
    return json({ error: 'Invalid reason', allowed: VALID_REASONS }, 400);
  }
  const reason = body.reason;

  // Opsiyonel alanları normalize + sınırla (DB şişmesi / abuse engeli).
  const productId = body.productId?.trim().slice(0, MAX_PRODUCT_ID) || null;
  const reporterContact = body.reporterContact?.trim().slice(0, MAX_CONTACT) || null;
  const details = body.details?.trim().slice(0, MAX_DETAILS) || null;

  const reportId = 'rep:' + crypto.randomUUID();
  const createdAt = new Date().toISOString();

  try {
    await db
      .prepare(
        `INSERT INTO reports
         (id, store_slug, product_id, reason, reporter_contact, details, status, created_at, actioned_at, actioned_by)
         VALUES (?, ?, ?, ?, ?, ?, 'open', ?, NULL, NULL)`
      )
      .bind(reportId, slug, productId, reason, reporterContact, details, createdAt)
      .run();
  } catch (e) {
    console.error('report insert failed:', e);
    return json({ error: 'Could not record report' }, 500);
  }

  return json({ ok: true, reportId }, 200);
};
