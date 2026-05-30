/**
 * GET /store/*
 * Patterns:
 *   /store/<slug>                          → store page, default lang
 *   /store/<slug>/<lang>                   → store page, that lang
 *   /store/<slug>/product/<pslug>          → product page, default lang
 *   /store/<slug>/<lang>/product/<pslug>   → product page, that lang
 */

import { getStore } from '../_lib/registry';
import { renderStoreBody, renderProductBody } from '../../src/storefront/render';
import { renderDocument } from '../../src/storefront/document';
import {
  resolveStoreLocale,
  uniqueProductSlugs,
  resolveLocalized,
} from '../../src/storefront/manifest';

interface Env {
  STORE_KV: KVNamespace;
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

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  // ctx.params.path is either a string or string[] depending on wrangler version
  const rawParam = ctx.params.path;
  const rawPath = Array.isArray(rawParam) ? rawParam.join('/') : (rawParam ?? '');

  // Split segments, filter empty
  const segments = rawPath.split('/').filter(Boolean);

  if (segments.length === 0) {
    return new Response(notFoundHtml('Mağaza bulunamadı / Store not found'), {
      status: 404,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
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
    return new Response(notFoundHtml('Mağaza bulunamadı / Store not found'), {
      status: 404,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  const { manifest } = record;
  const locale = resolveStoreLocale(manifest, lang);

  let htmlBody: string;
  let pageTitle: string;
  let pageDesc: string;

  if (productSlugReq) {
    // Find product by slug
    const slugMap = uniqueProductSlugs(manifest.products, DEFAULT_LANG);
    const product = manifest.products.find((p) => slugMap.get(p.id) === productSlugReq);

    if (!product) {
      return new Response(notFoundHtml('Ürün bulunamadı / Product not found'), {
        status: 404,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }

    htmlBody = renderProductBody(manifest, product, locale, DEFAULT_LANG);
    pageTitle = resolveLocalized(product.title, locale) + ' — ' + manifest.store.displayName;
    pageDesc = resolveLocalized(product.description, locale).slice(0, 160);
  } else {
    htmlBody = renderStoreBody(manifest, locale, DEFAULT_LANG);
    pageTitle = manifest.meta.seo?.title ?? manifest.store.displayName;
    pageDesc = manifest.meta.seo?.description ?? resolveLocalized(manifest.store.tagline, locale);
  }

  const html = renderDocument({
    title: pageTitle,
    description: pageDesc,
    lang: locale,
    body: htmlBody,
  });

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=60',
    },
  });
};
