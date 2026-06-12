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
import { findBuyerById } from '../_lib/b2b-buyers';
import { listTransactions, getBuyerBalance } from '../_lib/b2b-ledger';
import { parseImageFilename, toProxyImages } from '../../src/storefront/image-proxy';
import type { Manifest } from '../../src/storefront/types';
import legacyMap from '../../src/storefront/taxonomy/legacy-map.json';

interface Env {
  STORE_KV: KVNamespace;
  AI?: AiBinding;
  MARKET_DB?: D1Database;
}

const DEFAULT_LANG = 'en';

function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get('cookie') ?? '';
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = header.match(new RegExp('(?:^|;\\s*)' + escaped + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

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
  let manifest = applyLegacyMapToManifest(translatedFull, legacyMap as Record<string, string>);

  // Taxonomy service: kategori adı çözümleme + breadcrumb için (graceful fallback).
  let svc; try { svc = await getTaxonomyService(locale); } catch { svc = undefined; }

  // Origin for absolute SEO URLs (canonical / hreflang / og), derived from the request.
  const origin = new URL(ctx.request.url).origin;
  const languages = SUPPORTED_LOCALES;

  // B2B: cookie kontrolü — geçersiz/eksik ise b2b ürünleri gizle
  const b2bCookieName = `b2b_${slug}`;
  const buyerCookieId = getCookie(ctx.request, b2bCookieName);
  let hasBuyer = false;
  let buyerDisplayName: string | undefined;
  let buyerSession: { buyer_id: string; buyer_name: string } | undefined;

  if (buyerCookieId && ctx.env.MARKET_DB) {
    const buyer = await findBuyerById(ctx.env.MARKET_DB, slug, buyerCookieId);
    if (buyer) {
      hasBuyer = true;
      buyerDisplayName = buyer.buyer_name;
      buyerSession = { buyer_id: buyer.id, buyer_name: buyer.buyer_name };
    }
  }

  if (!hasBuyer) {
    manifest = { ...manifest, products: manifest.products.filter((p) => !p.b2b) };
  }

  // B2B kart için: mağazanın aktif B2B alıcısı var mı?
  let hasB2BBuyers = false;
  if (ctx.env.MARKET_DB) {
    const row = await ctx.env.MARKET_DB.prepare(
      'SELECT COUNT(*) as cnt FROM store_buyers WHERE store_slug = ? AND is_active = 1'
    ).bind(slug).first<{ cnt: number }>();
    hasB2BBuyers = (row?.cnt ?? 0) > 0;
  }

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

    // B2B Hesabım / ekstre section
    let accountTabHtml = '';
    let accountBtnHtml = '';
    if (buyerSession && ctx.env.MARKET_DB) {
      const [transactions, balance] = await Promise.all([
        listTransactions(ctx.env.MARKET_DB, slug, buyerSession.buyer_id),
        getBuyerBalance(ctx.env.MARKET_DB, slug, buyerSession.buyer_id),
      ]);

      const balanceSign = balance >= 0 ? '+' : '';
      const balanceClass = balance >= 0 ? 'b2b-balance-debit' : 'b2b-balance-credit';

      const txRows = transactions.map(tx => {
        const isDebit = tx.type === 'debit' || tx.type === 'order';
        const amtFormatted = tx.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
        const dateFormatted = tx.created_at.slice(0, 10);
        const badge = tx.type === 'order' ? '<span class="b2b-tx-badge">Sipariş</span>' : '';
        return `<tr>
    <td>${escapeHtml(dateFormatted)}</td>
    <td>${escapeHtml(tx.description ?? '')}${badge}</td>
    <td class="b2b-tx-debit">${isDebit ? amtFormatted : ''}</td>
    <td class="b2b-tx-credit">${!isDebit ? amtFormatted : ''}</td>
  </tr>`;
      }).join('');

      accountTabHtml = `
<div class="b2b-account-section" id="b2b-account">
  <div class="b2b-account-header">
    <h2 class="b2b-account-title">Hesabım</h2>
    <div class="b2b-balance-card ${balanceClass}">
      <span class="b2b-balance-label">Bakiye</span>
      <span class="b2b-balance-amount">${balanceSign}${balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${transactions[0]?.currency ?? 'TRY'}</span>
    </div>
  </div>
  ${transactions.length === 0
    ? '<p class="b2b-no-tx">Henüz işlem yok.</p>'
    : `<div class="b2b-tx-table-wrap">
        <table class="b2b-tx-table">
          <thead><tr><th>Tarih</th><th>Açıklama</th><th>Borç</th><th>Alacak</th></tr></thead>
          <tbody>${txRows}</tbody>
        </table>
      </div>`
  }
</div>`;

      accountBtnHtml = `<a href="#b2b-account" class="b2b-account-btn">📋 Hesabım</a>`;
    }

    if (hasB2BBuyers) {
      const b2bCard = hasBuyer
        ? `<div class="sf-b2b-card sf-b2b-card--unlocked">
             <span class="sf-b2b-card__icon">✓</span>
             <div>
               <div class="sf-b2b-card__title">B2B Erişimi Aktif</div>
               <div class="sf-b2b-card__subtitle">Merhaba, ${escapeHtml(buyerDisplayName ?? '')} — toptan ürünler görüntüleniyor</div>
             </div>
           </div>`
        : `<div class="sf-b2b-card" id="sf-b2b-card">
             <span class="sf-b2b-card__icon">🔒</span>
             <div>
               <div class="sf-b2b-card__title">Toptan / B2B</div>
               <div class="sf-b2b-card__subtitle">Erişim kodunuz varsa <button class="sf-b2b-card__btn" onclick="document.getElementById('sf-b2b-modal').style.display='flex'">giriş yapın</button></div>
             </div>
           </div>
           <div class="sf-b2b-modal" id="sf-b2b-modal" style="display:none">
             <div class="sf-b2b-modal__box">
               <button class="sf-b2b-modal__close" onclick="document.getElementById('sf-b2b-modal').style.display='none'">✕</button>
               <h3>B2B Erişim Kodu</h3>
               <input id="sf-b2b-input" maxlength="6" placeholder="Erişim kodunuz" style="text-transform:uppercase">
               <div id="sf-b2b-error" style="color:red;display:none">Geçersiz kod</div>
               <button onclick="b2bLogin('${escapeHtml(slug)}')">Giriş Yap</button>
             </div>
           </div>
           <script>
           async function b2bLogin(slug){
             const code=document.getElementById('sf-b2b-input').value.toUpperCase();
             const r=await fetch('/api/store/'+slug+'/b2b/auth',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({access_code:code})});
             if(r.ok){location.reload();}else{document.getElementById('sf-b2b-error').style.display='block';}
           }
           <\/script>`;
      htmlBody = b2bCard + htmlBody;
    }

    // Inject Hesabım button (before product grid) and account section (after product grid)
    if (accountBtnHtml || accountTabHtml) {
      htmlBody = accountBtnHtml + htmlBody + accountTabHtml;
    }

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
