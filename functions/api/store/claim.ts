/**
 * POST /api/store/claim
 * Body: { desiredSlug: string, phone?: string }
 * Returns: { slug: string } — the available (unique) slug
 */

import { claimSlug, putStore } from '../../_lib/registry';
import { requireWriteKey } from '../../_lib/auth';

interface Env {
  STORE_KV: KVNamespace;
  STORE_WRITE_KEY?: string;
}

function json400(msg: string) {
  return new Response(JSON.stringify({ error: msg }), {
    status: 400,
    headers: { 'content-type': 'application/json' },
  });
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const denied = requireWriteKey(ctx.request, ctx.env);
  if (denied) return denied;

  const contentLength = Number(ctx.request.headers.get('content-length') ?? 0);
  if (contentLength > 4096) {
    return new Response(JSON.stringify({ error: 'Payload too large' }), {
      status: 413,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body: { desiredSlug?: string; phone?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return json400('Invalid JSON body');
  }

  const desired = body.desiredSlug?.trim();
  if (!desired) return json400('desiredSlug is required');
  if (desired.length > 100) return json400('desiredSlug too long');
  if (body.phone && body.phone.length > 30) return json400('phone too long');
  const slug = await claimSlug(ctx.env.STORE_KV, desired);

  // Write a reservation marker so subsequent claim calls find it taken
  await putStore(ctx.env.STORE_KV, slug, {
    manifest: {} as never, // placeholder until PUT fills it
    phone: body.phone,
    status: 'reserved',
    version: 0,
    updatedAt: new Date().toISOString(),
  });

  return new Response(JSON.stringify({ slug }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
