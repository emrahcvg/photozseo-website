/**
 * /api/store/:slug
 * PUT — store/update a manifest; returns { ok, slug, version }
 * GET — retrieve the stored manifest JSON; 404 if missing
 */

import { getStore, putStore, deleteStore, isBlocked } from '../../_lib/registry';
import { requireWriteAuthOrSession } from '../../_lib/require-session';
import { syncStoreToMarketplace, removeStoreFromD1, bumpIndexVersion } from '../../_lib/marketplace';
import { moderateText } from '../../_lib/moderation';
import { recordConsent, requestMeta } from '../legal/consent';
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

// StoreRecord (registry.ts) henüz owner_sub tutmuyor; alan KV'ye cast ile yazılıp
// cast ile okunur. registry.ts'e dokunmadan B2 Faz B sahipliğini sağlar.
type OwnedRecord = { ownerSub?: string } | null | undefined;

/**
 * B2 Faz B sahiplik geçidi — SADECE şu üçü birlikteyken 403:
 *   kayıtta owner_sub DOLU  VE  auth kind==='session'  VE  session.sub !== owner_sub.
 * Diğer tüm durumlar (owner_sub null, veya legacy/HMAC yolu) → izin ver (eski davranış).
 */
function ownershipForbidden(
  existing: OwnedRecord,
  auth: { kind: 'session'; session: { sub: string } } | { kind: 'legacy' },
): boolean {
  const ownerSub = existing?.ownerSub;
  return !!ownerSub && auth.kind === 'session' && auth.session.sub !== ownerSub;
}

function json403(msg: string) {
  return new Response(JSON.stringify({ error: msg }), {
    status: 403,
    headers: { 'content-type': 'application/json' },
  });
}

function json422(obj: Record<string, unknown>) {
  return new Response(JSON.stringify(obj), {
    status: 422,
    headers: { 'content-type': 'application/json' },
  });
}

/** Localized (Record<lang,string>) ya da düz string → kelime listesi. */
function localizedValues(v: unknown): string[] {
  if (v == null) return [];
  if (typeof v === 'string') return [v];
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string');
  if (typeof v === 'object') return Object.values(v as Record<string, unknown>).filter((x) => typeof x === 'string') as string[];
  return [];
}

/**
 * Manifest'in kullanıcı-girdisi metin alanlarını moderasyon için toplar:
 * mağaza adı/tagline + her ürünün title/description/tags (tüm dillerde).
 */
function collectModerationFields(manifest: Manifest): { titles: string[]; descriptions: string[]; tags: string[] } {
  const titles: string[] = [];
  const descriptions: string[] = [];
  const tags: string[] = [];

  if (manifest.store?.displayName) titles.push(manifest.store.displayName);
  titles.push(...localizedValues(manifest.store?.tagline));

  for (const p of manifest.products ?? []) {
    titles.push(...localizedValues(p.title));
    descriptions.push(...localizedValues(p.description));
    if (Array.isArray(p.tags)) tags.push(...p.tags);
    titles.push(...localizedValues(p.partTypeLabel));
  }
  for (const c of manifest.categories ?? []) {
    titles.push(...localizedValues(c.name));
  }
  return { titles, descriptions, tags };
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
  // requireWriteAuthOrSession imzalı (HMAC) layer için ham gövde metnini ister.
  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireWriteAuthOrSession(ctx.request, ctx.env, nowSec, text);
  if (auth instanceof Response) return auth;

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

  // Sunucu-tarafı moderasyon: yayın ÖNCESİ yasak-ürün taraması. Client
  // moderasyonu ATLANAMASIN — !ok ise 422 ile yayını ENGELLE. Bu YENİ bir engel
  // olup yalnızca zaten engellenmesi gereken yasak ürünleri yakalar; meşru
  // mağazayı etkilemez (geriye uyumlu).
  {
    const { titles, descriptions, tags } = collectModerationFields(manifest);
    const verdict = moderateText(titles, descriptions, tags);
    if (!verdict.ok) {
      return json422({ error: 'prohibited_content', category: verdict.category });
    }
  }

  const existing = await getStore(ctx.env.STORE_KV, slug);

  // B2 Faz B sahiplik geçidi: sahipli mağazaya başka bir oturum yazamaz.
  if (ownershipForbidden(existing as OwnedRecord, auth)) {
    return json403('You are not the owner of this store.');
  }

  const version = (existing?.version ?? 0) + 1;
  const updatedAt = new Date().toISOString(); // KV ve D1 aynı timestamp'i yazsın.

  // Sahipliği koru: kayıtta owner_sub varsa onu taşı; yoksa bu istek bir oturum
  // ise sahibi bu kullanıcı yap (ilk sahiplenme). Legacy/anonim yolda undefined.
  const ownerSub =
    (existing as OwnedRecord)?.ownerSub ?? (auth.kind === 'session' ? auth.session.sub : undefined);

  await putStore(ctx.env.STORE_KV, slug, {
    manifest,
    phone: manifest.store.contact?.phone,
    status: 'active',
    version,
    updatedAt,
    ...(ownerSub ? { ownerSub } : {}),
  } as never);

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

  // Kabul (consent) sunucu kaydı (best-effort, additive).
  // manifest.meta.compliance varsa onu legal_consents'e de yaz — istemcinin
  // gönderdiği acceptedAt damgasına güvenmek yerine kabulün sunucu UTC saatiyle
  // + IP + UA ile kalıcı, denetlenebilir kaydını tut.
  //
  // GERİYE UYUMLU: compliance YOKSA şimdilik REDDETME (eski istemciler
  // kırılmasın) — sadece bir uyarı logla. Faz-2'de bu kabul ZORUNLU olacak ve
  // eksikse yayın 4xx ile engellenecek.
  const compliance = (manifest.meta as { compliance?: { aupVersion?: string; acceptedAt?: string; publisherEmail?: string } } | undefined)?.compliance;
  if (ctx.env.MARKET_DB) {
    if (compliance?.aupVersion) {
      try {
        const { ip, userAgent } = requestMeta(ctx.request);
        await recordConsent(ctx.env.MARKET_DB, {
          userSub: auth.kind === 'session' ? auth.session.sub : undefined,
          userEmail: (auth.kind === 'session' ? auth.session.email : undefined) ?? compliance.publisherEmail,
          storeSlug: slug,
          docType: 'aup',
          docVersion: compliance.aupVersion,
          // Sunucu otorite: acceptedAt sunucu UTC. (İstemci acceptedAt'i ham
          // kayda gerek yok; compliance.acceptedAt ileride doc_hash gibi
          // saklanabilir — Faz-2 notu.)
          acceptedAt: updatedAt,
          ip,
          userAgent,
          platform: 'ios',
        });
      } catch (e) {
        console.error('legal consent record failed (non-fatal):', e);
      }
    } else {
      // Faz-2'de zorunlu olacak: kabul damgası eksik yayın.
      console.warn('store published without compliance acceptance (slug=%s) — will be required in Faz-2', slug);
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
  // DELETE gövdesizdir → bodyText ''.
  const nowSec = Math.floor(Date.now() / 1000);
  const auth = await requireWriteAuthOrSession(ctx.request, ctx.env, nowSec, '');
  if (auth instanceof Response) return auth;

  const slug = ctx.params.slug as string;

  // B2 Faz B sahiplik geçidi: sahipli mağazayı başka bir oturum silemez.
  const existing = await getStore(ctx.env.STORE_KV, slug);
  if (ownershipForbidden(existing as OwnedRecord, auth)) {
    return json403('You are not the owner of this store.');
  }

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
