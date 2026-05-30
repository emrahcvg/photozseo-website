/**
 * POST /api/store/claim
 * Body: { desiredSlug: string, phone?: string }
 * Returns: { slug: string } — the available (unique) slug
 */

import { claimSlug, putStore } from '../../_lib/registry';

interface Env {
  STORE_KV: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: { desiredSlug?: string; phone?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const desired = body.desiredSlug?.trim();
  if (!desired) {
    return new Response(JSON.stringify({ error: 'desiredSlug is required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

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
