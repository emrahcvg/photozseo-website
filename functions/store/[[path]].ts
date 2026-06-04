/**
 * GET /store/*
 * Patterns:
 *   /store/<slug>                          → store page, default lang
 *   /store/<slug>/<lang>                   → store page, that lang
 *   /store/<slug>/product/<pslug>          → product page, default lang
 *   /store/<slug>/<lang>/product/<pslug>   → product page, that lang
 */

import { htmlResponse } from '../_lib/html-response';
import { getStore } from '../_lib/registry';
import { getTranslatedManifest, type AiBinding } from '../_lib/translate';
import {
  renderStoreBody,
  renderProductBody,
  buildStoreJsonLd,
  buildProductJsonLd,
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildFaqJsonLd,
} from '../../src/storefront/render';
import { renderDocument, type AlternateLink } from '../../src/storefront/document';
import {
  uniqueProductSlugs,
  resolveLocalized,
  storeUrl,
  productUrl,
  SUPPORTED_LOCALES,
} from '../../src/storefront/manifest';
import { getTaxonomyService } from '../../src/storefront/taxonomy/load-local';
import { applyLegacyMapToManifest } from '../_lib/taxonomy-migrate';
import { parseImageFilename, toProxyImages } from '../../src/storefront/image-proxy';
import type { Manifest } from '../../src/storefront/types';
import legacyMap from '../../src/storefront/taxonomy/legacy-map.json';

interface Env {
  STORE_KV: KVNamespace;
  AI?: AiBinding;
}

const DEFAULT_LANG = 'en';

function notFoundHtml(message: string): string {
  return renderDocument({
    title: 'Store not found — photoZseo',
    description: '',
    lang: DEFAULT_LANG,
    body: `<div class="sf-store"><p style="padding:2rem;text-align:center">${message}</p></div>`,
  });
}

/**
 * Serve a product image by its SEO path `/store/<slug>/img/<pslug>-<n>`.
 * Resolves the original (Drive) URL from the manifest, proxies the bytes, and
 * caches them at the edge for a year (Drive file-IDs are immutable).
 */
async function serveImage(
  ctx: Parameters<PagesFunction<Env>>[0],
  base: Manifest,
  filename: string,
): Promise<Response> {
  const parsed = parseImageFilename(filename);
  if (!parsed) return new Response('Not found', { status: 404 });

  const slugMap = uniqueProductSlugs(base.products, DEFAULT_LANG);
  const product = base.products.find((p) => (slugMap.get(p.id) ?? p.id) === parsed.pslug);
  const original = product?.images?.[parsed.index];
  if (!original || !/^https?:\/\//i.test(original)) {
    return new Response('Not found', { status: 404 });
  }

  // caches.default is a Cloudflare Workers extension not in the DOM lib types.
  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(new URL(ctx.request.url).toString());
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  let upstream: Response;
  try {
    upstream = await fetch(original);
  } catch {
    return new Response('Upstream fetch failed', { status: 502 });
  }
  if (!upstream.ok) return new Response('Upstream error', { status: 502 });

  const headers = new Headers();
  headers.set('Content-Type', upstream.headers.get('Content-Type') ?? 'image/jpeg');
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  const resp = new Response(upstream.body, { status: 200, headers });
  ctx.waitUntil(cache.put(cacheKey, resp.clone()));
  return resp;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  // ctx.params.path is either a string or string[] depending on wrangler version
  const rawParam = ctx.params.path;
  const rawPath = Array.isArray(rawParam) ? rawParam.join('/') : (rawParam ?? '');

  // Split segments, filter empty
  const segments = rawPath.split('/').filter(Boolean);

  if (segments.length === 0) {
    return htmlResponse(notFoundHtml('Mağaza bulunamadı / Store not found'), 404);
  }

  // Parse URL pattern
  let slug: string;
  let lang: string | undefined;
  let productSlugReq: string | undefined;

  slug = segments[0];

  // Detect product + lang patterns:
  // [slug, "product", pslug]
  // [slug, lang, "product", pslug]
  // [slug, lang]
  // [slug]
  if (segments.length >= 3 && segments[1] === 'product') {
    // /store/<slug>/product/<pslug>
    productSlugReq = segments[2];
  } else if (segments.length >= 4 && segments[2] === 'product') {
    // /store/<slug>/<lang>/product/<pslug>
    lang = segments[1];
    productSlugReq = segments[3];
  } else if (segments.length === 2) {
    // /store/<slug>/<lang>
    lang = segments[1];
  }
  // else: just slug

  const record = await getStore(ctx.env.STORE_KV, slug);
  if (!record || !record.manifest?.store) {
    return htmlResponse(notFoundHtml('Mağaza bulunamadı / Store not found'), 404);
  }

  const base = record.manifest;

  // SEO görsel proxy: /store/<slug>/img/<pslug>-<n> → orijinal Drive URL'i sun.
  // Çeviriden ÖNCE; orijinal (proxy'lenmemiş) manifest görsellerini kullanır.
  if (segments[1] === 'img' && segments[2]) {
    return serveImage(ctx, base, segments.slice(2).join('/'));
  }

  // Kaynak dil = app'in yazdığı dil. İstenen dil 12-set içindeyse onu, yoksa varsayılanı kullan.
  const sourceLang = base.store.languages?.[0] ?? DEFAULT_LANG;
  const locale = (lang && SUPPORTED_LOCALES.includes(lang)) ? lang : DEFAULT_LANG;

  // İstenen dil kaynaktan farklıysa on-demand çevir (KV cache + Workers AI). Graceful fallback.
  const translated = await getTranslatedManifest(ctx.env.AI, ctx.env.STORE_KV, slug, base, sourceLang, locale);

  // Render manifest'i: dil seçici + hreflang 12 dilin tamamını göstersin.
  const translatedFull = { ...translated, store: { ...translated.store, languages: SUPPORTED_LOCALES } };

  // Legacy kategori id'lerini Google Taxonomy id'lerine normalize et (graceful).
  const manifest = applyLegacyMapToManifest(translatedFull, legacyMap as Record<string, string>);

  // Taxonomy service: kategori adı çözümleme + breadcrumb için (graceful fallback).
  let svc; try { svc = await getTaxonomyService(locale); } catch { svc = undefined; }

  // Origin for absolute SEO URLs (canonical / hreflang / og), derived from the request.
  const origin = new URL(ctx.request.url).origin;
  const languages = SUPPORTED_LOCALES;

  // Görsel URL'lerini SEO proxy yollarına çevir (gallery + card + schema + og).
  // Yeni ürün nesneleri üretir; KV cache'indeki orijinal görseller değişmez.
  const imgSlugMap = uniqueProductSlugs(manifest.products, DEFAULT_LANG);
  manifest.products = manifest.products.map((p) => ({
    ...p,
    images: toProxyImages(origin, slug, imgSlugMap.get(p.id) ?? p.id, p.images),
  }));

  let htmlBody: string;
  let pageTitle: string;
  let pageDesc: string;
  let canonical: string;
  let alternates: AlternateLink[];
  let ogImage: string | undefined;
  let jsonLd: string[];

  if (productSlugReq) {
    // Find product by slug
    const slugMap = uniqueProductSlugs(manifest.products, DEFAULT_LANG);
    const product = manifest.products.find((p) => slugMap.get(p.id) === productSlugReq);

    if (!product) {
      return htmlResponse(notFoundHtml('Ürün bulunamadı / Product not found'), 404);
    }

    const pSlug = slugMap.get(product.id) ?? product.id;
    htmlBody = renderProductBody(manifest, product, locale, DEFAULT_LANG, svc);
    pageTitle = resolveLocalized(product.title, locale) + ' — ' + manifest.store.displayName;
    pageDesc = resolveLocalized(product.description, locale).slice(0, 160);
    canonical = origin + productUrl(slug, pSlug, locale, DEFAULT_LANG);
    alternates = languages.map((l) => ({ lang: l, href: origin + productUrl(slug, pSlug, l, DEFAULT_LANG) }));
    alternates.push({ lang: 'x-default', href: origin + productUrl(slug, pSlug, DEFAULT_LANG, DEFAULT_LANG) });
    ogImage = product.images[0] ?? manifest.store.logo ?? `${origin}/og-image.png`;
    jsonLd = [
      buildProductJsonLd(manifest, product, locale, canonical),
      buildBreadcrumbJsonLd(manifest, product, locale, origin, svc, DEFAULT_LANG),
      buildOrganizationJsonLd(manifest, origin, DEFAULT_LANG),
      buildFaqJsonLd(manifest.store, locale),
    ].filter(Boolean);
  } else {
    htmlBody = renderStoreBody(manifest, locale, DEFAULT_LANG, svc);
    pageTitle = manifest.meta.seo?.title ?? manifest.store.displayName;
    pageDesc = manifest.meta.seo?.description ?? resolveLocalized(manifest.store.tagline, locale);
    canonical = origin + storeUrl(slug, locale, DEFAULT_LANG);
    alternates = languages.map((l) => ({ lang: l, href: origin + storeUrl(slug, l, DEFAULT_LANG) }));
    alternates.push({ lang: 'x-default', href: origin + storeUrl(slug, DEFAULT_LANG, DEFAULT_LANG) });
    ogImage = manifest.store.logo ?? manifest.products[0]?.images[0] ?? `${origin}/og-image.png`;
    jsonLd = [
      buildStoreJsonLd(manifest, locale, canonical),
      buildOrganizationJsonLd(manifest, origin, DEFAULT_LANG),
      buildWebSiteJsonLd(manifest, origin, DEFAULT_LANG),
    ];
  }

  const html = renderDocument({
    title: pageTitle,
    description: pageDesc,
    lang: locale,
    body: htmlBody,
    canonical,
    alternates,
    ogImage,
    jsonLd,
  });

  return htmlResponse(html);
};
