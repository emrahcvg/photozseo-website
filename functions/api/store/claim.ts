/**
 * POST /api/store/claim
 * Body: { desiredSlug: string, phone?: string }
 * Returns: { slug: string } — the available (unique) slug
 */

import { claimSlug, putStore } from '../../_lib/registry';
import { requireWriteAuthOrSession } from '../../_lib/require-session';

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
  const contentLength = Number(ctx.request.headers.get('content-length') ?? 0);
  if (contentLength > 4096) {
    return new Response(JSON.stringify({ error: 'Payload too large' }), {
      status: 413,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Body must be read once, then handed to the auth layer so the signed
  // (HMAC) check can hash it. Bodyless legacy callers still pass an empty buffer.
  const raw = await ctx.request.text();
  if (raw.length > 4096) {
    return new Response(JSON.stringify({ error: 'Payload too large' }), {
      status: 413,
      headers: { 'content-type': 'application/json' },
    });
  }
  // requireWriteAuthOrSession imzalı (HMAC) layer için ham gövde metnini ister.
  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireWriteAuthOrSession(ctx.request, ctx.env, nowSec, raw);
  if (auth instanceof Response) return auth;

  // kind==='session' → mağaza kaydına owner_sub yaz; kind==='legacy' → anonim (NULL).
  const ownerSub = auth.kind === 'session' ? auth.session.sub : undefined;

  let body: { desiredSlug?: string; phone?: string };
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return json400('Invalid JSON body');
  }

  const desired = body.desiredSlug?.trim();
  if (!desired) return json400('desiredSlug is required');
  if (desired.length > 100) return json400('desiredSlug too long');
  if (body.phone && body.phone.length > 30) return json400('phone too long');
  const slug = await claimSlug(ctx.env.STORE_KV, desired);

  // Write a reservation marker so subsequent claim calls find it taken.
  // ownerSub yalnızca session yolunda yazılır (B2 Faz B sahiplik); legacy/anonim
  // yolda undefined kalır → eski anonim davranış korunur. Alan StoreRecord'da
  // opsiyonel olmadığından cast ile eklenir (registry.ts'e dokunmadan).
  await putStore(ctx.env.STORE_KV, slug, {
    manifest: {} as never, // placeholder until PUT fills it
    phone: body.phone,
    status: 'reserved',
    version: 0,
    updatedAt: new Date().toISOString(),
    ...(ownerSub ? { ownerSub } : {}),
  } as never);

  return new Response(JSON.stringify({ slug }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
