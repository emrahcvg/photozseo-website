/**
 * /api/store/:slug
 * PUT — store/update a manifest; returns { ok, slug, version }
 * GET — retrieve the stored manifest JSON; 404 if missing
 */

import { getStore, putStore, deleteStore, isBlocked } from '../../_lib/registry';
import { requireWriteAuth } from '../../_lib/auth';
import { syncStoreToMarketplace, removeStoreFromD1, bumpIndexVersion } from '../../_lib/marketplace';
import type { Manifest } from '../../../src/storefront/types';

interface Env {
  STORE_KV: KVNamespace;
  STORE_WRITE_KEY?: string;
  MARKET_DB?: D1Database;
}

const MAX_MANIFEST_BYTES = 2 * 1024 * 1024; // 2 MB — KV value limit 25 MB, bu çok daha düşük
const VALID_SLUG = /^[a-z0-9][a-z0-9-]{0,98}[a-z0-9]$|^[a-z0-9]$/;

function json400(msg: string) {
  return new Response(JSON.stringify({ error: msg }), {
    status: 400,
    headers: { 'content-type': 'application/json' },
  });
}

export const onRequestPut: PagesFunction<Env> = async (ctx) => {
  const contentLength = Number(ctx.request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_MANIFEST_BYTES) {
    return new Response(JSON.stringify({ error: 'Payload too large' }), {
      status: 413,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Read body once up front: the signed (HMAC) auth layer hashes it.
  const text = await ctx.request.text();
  if (text.length > MAX_MANIFEST_BYTES) {
    return new Response(JSON.stringify({ error: 'Payload too large' }), {
      status: 413,
      headers: { 'content-type': 'application/json' },
    });
  }
  const bodyBytes = new TextEncoder().encode(text).buffer as ArrayBuffer;

  const denied = await requireWriteAuth(ctx.request, ctx.env, bodyBytes);
  if (denied) return denied;

  const slug = ctx.params.slug as string;
  if (!VALID_SLUG.test(slug)) return json400('Invalid slug');

  // Takedown sonrası blok: banlı mağaza yeniden yayınlanamaz/güncellenemez.
  if (await isBlocked(ctx.env.STORE_KV, slug)) {
    return new Response(
      JSON.stringify({ error: 'This store has been removed for policy violation and cannot be republished.' }),
      { status: 403, headers: { 'content-type': 'application/json' } },
    );
  }

  let manifest: Manifest;
  try {
    manifest = JSON.parse(text);
  } catch {
    return json400('Invalid JSON body');
  }

  const existing = await getStore(ctx.env.STORE_KV, slug);
  const version = (existing?.version ?? 0) + 1;
  const updatedAt = new Date().toISOString(); // KV ve D1 aynı timestamp'i yazsın.

  await putStore(ctx.env.STORE_KV, slug, {
    manifest,
    phone: manifest.store.contact?.phone,
    status: 'active',
    version,
    updatedAt,
  });

  // Write-through D1 (best-effort): pazar yeri indeksini güncelle. KV/render asla bozulmaz.
  if (ctx.env.MARKET_DB) {
    try {
      await syncStoreToMarketplace(ctx.env.MARKET_DB, slug, {
        manifest,
        phone: manifest.store.contact?.phone,
        status: 'active',
        version,
        updatedAt,
      });
    } catch (e) {
      console.error('marketplace D1 sync failed (non-fatal):', e);
    }
  }

  return new Response(JSON.stringify({ ok: true, slug, version }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const slug = ctx.params.slug as string;
  const record = await getStore(ctx.env.STORE_KV, slug);

  if (!record) {
    return new Response(JSON.stringify({ error: 'Not found', slug }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(record.manifest), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

export const onRequestDelete: PagesFunction<Env> = async (ctx) => {
  const denied = await requireWriteAuth(ctx.request, ctx.env, new ArrayBuffer(0));
  if (denied) return denied;

  const slug = ctx.params.slug as string;
  await deleteStore(ctx.env.STORE_KV, slug);

  // Pazar yerinden de düşür (best-effort).
  if (ctx.env.MARKET_DB) {
    try {
      await removeStoreFromD1(ctx.env.MARKET_DB, slug);
      await bumpIndexVersion(ctx.env.MARKET_DB);
    } catch (e) {
      console.error('marketplace D1 delete failed (non-fatal):', e);
    }
  }

  return new Response(JSON.stringify({ ok: true, slug, deleted: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
