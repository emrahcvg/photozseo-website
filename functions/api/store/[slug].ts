/**
 * /api/store/:slug
 * PUT — store/update a manifest; returns { ok, slug, version }
 * GET — retrieve the stored manifest JSON; 404 if missing
 */

import { getStore, putStore, deleteStore } from '../../_lib/registry';
import { requireWriteKey } from '../../_lib/auth';
import type { Manifest } from '../../../src/storefront/types';

interface Env {
  STORE_KV: KVNamespace;
  STORE_WRITE_KEY?: string;
}

export const onRequestPut: PagesFunction<Env> = async (ctx) => {
  const denied = requireWriteKey(ctx.request, ctx.env);
  if (denied) return denied;

  const slug = ctx.params.slug as string;

  let manifest: Manifest;
  try {
    manifest = await ctx.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const existing = await getStore(ctx.env.STORE_KV, slug);
  const version = (existing?.version ?? 0) + 1;

  await putStore(ctx.env.STORE_KV, slug, {
    manifest,
    phone: manifest.store.contact?.phone,
    status: 'active',
    version,
    updatedAt: new Date().toISOString(),
  });

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
  const denied = requireWriteKey(ctx.request, ctx.env);
  if (denied) return denied;

  const slug = ctx.params.slug as string;
  await deleteStore(ctx.env.STORE_KV, slug);

  return new Response(JSON.stringify({ ok: true, slug, deleted: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
