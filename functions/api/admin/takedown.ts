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
import { requireWriteKey } from '../../_lib/auth';
import { removeStoreFromD1, bumpIndexVersion } from '../../_lib/marketplace';

interface Env {
  STORE_KV: KVNamespace;
  STORE_WRITE_KEY?: string;
  MARKET_DB?: D1Database;
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const denied = requireWriteKey(ctx.request, ctx.env);
  if (denied) return denied;

  let body: { slug?: string; reason?: string };
  try {
    body = await ctx.request.json();
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
