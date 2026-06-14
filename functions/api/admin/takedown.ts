/**
 * POST /api/admin/takedown
 * Body: { slug: string, reason?: string }
 * Yetki: STORE_WRITE_KEY (x-store-write-key header).
 *
 * Dolandırıcılık/şikayet üzerine mağazayı KALICI kaldırır: KV'den siler + slug'ı
 * bloklar (banlı satıcı aynı adı tekrar claim/PUT edemez) + pazar yeri D1'inden
 * düşürür. Normal DELETE (satıcı kendi mağazasını kapatır) bloklamaz; bu eder.
 */

import { takedownStore } from '../../_lib/registry';
import { requireWriteAuthOrSession } from '../../_lib/require-session';
import { removeStoreFromD1, bumpIndexVersion } from '../../_lib/marketplace';

interface Env {
  STORE_KV: KVNamespace;
  STORE_WRITE_KEY?: string;
  MARKET_DB?: D1Database;
  ADMIN_SUBS?: string; // virgülle ayrılmış izinli Google sub listesi (yoksa boş → hiçbir session admin değil)
}

/** Virgülle ayrılmış ADMIN_SUBS içinde sub var mı? Boş/eksik liste → false. */
function isAdminSub(sub: string, adminSubs: string | undefined): boolean {
  if (!adminSubs) return false;
  const allow = adminSubs.split(',').map((s) => s.trim()).filter(Boolean);
  return allow.includes(sub);
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  // Read body once up front so the signed (HMAC) auth layer can hash it.
  const raw = await ctx.request.text();

  // Faz B OR-gate: pz_session VEYA legacy key/HMAC (gövde metni HMAC hash'i için).
  const auth = await requireWriteAuthOrSession(ctx.request, ctx.env, Math.floor(Date.now() / 1000), raw);
  if (auth instanceof Response) return auth;

  // Admin allowlist: SADECE session yolunda sub, ADMIN_SUBS içinde olmalı.
  // Legacy (key/HMAC) yolu geriye uyumlu olarak admin sayılır (eski davranış).
  if (auth.kind === 'session' && !isAdminSub(auth.session.sub, ctx.env.ADMIN_SUBS)) {
    return json(403, { error: 'Forbidden' });
  }

  let body: { slug?: string; reason?: string };
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const slug = body.slug?.trim();
  if (!slug) return json(400, { error: 'slug is required' });
  if (slug.length > 100) return json(400, { error: 'slug too long' });

  await takedownStore(ctx.env.STORE_KV, slug, body.reason);

  // Pazar yerinden de düşür (best-effort; KV takedown'ı asla bozulmaz).
  if (ctx.env.MARKET_DB) {
    try {
      await removeStoreFromD1(ctx.env.MARKET_DB, slug);
      await bumpIndexVersion(ctx.env.MARKET_DB);
    } catch (e) {
      console.error('marketplace D1 takedown failed (non-fatal):', e);
    }
  }

  return json(200, { ok: true, slug, takendown: true });
};
