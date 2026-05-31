# Online Mağaza Moderasyon — Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `photozseo-website` tarafında online mağaza yayın platformu için yasal/tepkisel moderasyon katmanını kur — AUP sayfası (i18n), mağaza footer'ında AUP linki + bağımsız-satıcı sorumluluk reddi, denetim alanları KV registry'de, kill switch endpoint'i prod'a deploy.

**Architecture:** Astro statik site + Cloudflare Pages Functions hibrit. Canlı mağaza sayfaları `functions/store/[[path]].ts` → `src/storefront/render.ts` ile çizilir (Astro component DEĞİL). Legal sayfalar Astro `src/pages/` + `src/pages/[lang]/`. Denetim verisi manifest `meta.compliance` ile gelir, `StoreRecord`'a kopyalanır.

**Tech Stack:** Astro 6, TypeScript, Cloudflare Pages Functions + KV, Vitest, wrangler.

**İlgili spec:** `~/Desktop/photoZseo/docs/superpowers/specs/2026-05-31-online-magaza-moderasyon-yasal-design.md`

---

### Task 1: Manifest `meta.compliance` tipini ekle (denetim sözleşmesi)

Denetim alanları manifest PUT gövdesi içinde `meta.compliance` olarak gelecek. Önce TS tipi.

**Files:**
- Modify: `src/storefront/types.ts` (Manifest `meta` alanı)
- Test: `src/storefront/manifest.test.ts` (mevcut, yeni test ekle)

- [ ] **Step 1: `types.ts`'i incele ve `StoreMeta`/`meta` tipini bul**

Run: `grep -n "meta\|seo\|version\|updatedAt" src/storefront/types.ts`
Expected: `meta: { version: number; updatedAt: string; seo?: ... }` benzeri bir tip.

- [ ] **Step 2: `meta` tipine opsiyonel `compliance` ekle**

`src/storefront/types.ts` içinde `meta` tipinin yanına ekle (mevcut `seo?` alanından sonra):

```typescript
export interface StoreCompliance {
  aupVersion: string;       // ör. "2026-05-31"
  acceptedAt: string;       // ISO 8601
  publisherEmail?: string;  // yayınlayan Google hesabı (denetim izi)
}
```

ve `meta` tipine alan ekle:

```typescript
  compliance?: StoreCompliance;
```

- [ ] **Step 3: Test yaz — geçerli manifest compliance ile parse edilebilmeli**

`src/storefront/manifest.test.ts` sonuna ekle:

```typescript
import type { StoreCompliance } from './types';

it('accepts a manifest with meta.compliance', () => {
  const c: StoreCompliance = { aupVersion: '2026-05-31', acceptedAt: '2026-05-31T10:00:00Z', publisherEmail: 'a@b.com' };
  expect(c.aupVersion).toBe('2026-05-31');
  expect(c.acceptedAt).toContain('2026');
});
```

- [ ] **Step 4: Testi çalıştır**

Run: `npx vitest run src/storefront/manifest.test.ts`
Expected: PASS (tip importu derlenir, assert geçer).

- [ ] **Step 5: Commit**

```bash
git add src/storefront/types.ts src/storefront/manifest.test.ts
git commit -m "feat(store): add meta.compliance type for audit trail"
```

---

### Task 2: `StoreRecord`'a denetim alanları + PUT handler'da persist

KV kaydı yayınlayanı izlemeli. `StoreRecord`'a alanlar ekle, PUT handler manifest'ten kopyalasın.

**Files:**
- Modify: `functions/_lib/registry.ts` (StoreRecord interface)
- Modify: `functions/api/store/[slug].ts:35-41` (putStore çağrısı)
- Test: `functions/_lib/registry.test.ts` (yoksa oluştur)

- [ ] **Step 1: Test yaz — putStore/getStore denetim alanlarını korumalı**

`functions/_lib/registry.test.ts` (yoksa oluştur):

```typescript
import { describe, it, expect } from 'vitest';
import { putStore, getStore, type StoreRecord } from './registry';

function memoryKV() {
  const m = new Map<string, string>();
  return {
    get: async (k: string) => m.get(k) ?? null,
    put: async (k: string, v: string) => { m.set(k, v); },
    delete: async (k: string) => { m.delete(k); },
  } as unknown as KVNamespace;
}

describe('registry audit fields', () => {
  it('round-trips publisherEmail/aupVersion/acceptedAt', async () => {
    const kv = memoryKV();
    const rec = {
      manifest: { store: { slug: 'x', displayName: 'X', contact: {}, languages: ['en'], currency: 'USD' }, categories: [], products: [], meta: { version: 1, updatedAt: 'now' } },
      status: 'active', version: 1, updatedAt: 'now',
      publisherEmail: 'seller@example.com', aupVersion: '2026-05-31', acceptedAt: '2026-05-31T10:00:00Z',
    } as unknown as StoreRecord;
    await putStore(kv, 'x', rec);
    const got = await getStore(kv, 'x');
    expect(got?.publisherEmail).toBe('seller@example.com');
    expect(got?.aupVersion).toBe('2026-05-31');
  });
});
```

- [ ] **Step 2: Testi çalıştır — başarısız olmalı**

Run: `npx vitest run functions/_lib/registry.test.ts`
Expected: FAIL — `publisherEmail` tipte yok (TS) veya assert undefined.

- [ ] **Step 3: `StoreRecord`'a alanları ekle**

`functions/_lib/registry.ts` `StoreRecord` interface'ine ekle (mevcut alanların altına):

```typescript
  publisherEmail?: string;
  aupVersion?: string;
  acceptedAt?: string;
```

- [ ] **Step 4: Testi çalıştır — geçmeli**

Run: `npx vitest run functions/_lib/registry.test.ts`
Expected: PASS.

- [ ] **Step 5: PUT handler manifest.meta.compliance'tan kopyalasın**

`functions/api/store/[slug].ts` içinde `putStore` çağrısını (satır ~35-41) güncelle:

```typescript
  const compliance = manifest.meta?.compliance;
  await putStore(ctx.env.STORE_KV, slug, {
    manifest,
    phone: manifest.store.contact?.phone,
    status: 'active',
    version,
    updatedAt: new Date().toISOString(),
    publisherEmail: compliance?.publisherEmail,
    aupVersion: compliance?.aupVersion,
    acceptedAt: compliance?.acceptedAt,
  });
```

- [ ] **Step 6: Tüm testleri çalıştır**

Run: `npx vitest run`
Expected: PASS (mevcut 93 + yeni testler).

- [ ] **Step 7: Commit**

```bash
git add functions/_lib/registry.ts functions/_lib/registry.test.ts functions/api/store/[slug].ts
git commit -m "feat(store): persist publisher audit trail (email/aupVersion/acceptedAt) in KV"
```

---

### Task 3: Mağaza footer'ına AUP linki + bağımsız-satıcı sorumluluk reddi + e-posta düzeltmesi

Canlı sayfa footer'ı `render.ts:renderStoreFooter`. Şikayet linki var ama `abuse@` adresi inbound değil (yalnız `support@` aktif). AUP linki + disclaimer ekle, e-postayı `support@`'a çevir.

**Files:**
- Modify: `src/storefront/render.ts:159-172` (renderStoreFooter)
- Test: `src/storefront/render.test.ts`

- [ ] **Step 1: Test yaz — footer AUP linki + disclaimer + support@ içermeli**

`src/storefront/render.test.ts` sonuna ekle:

```typescript
import { renderStoreBody } from './render';

it('store footer has AUP link, disclaimer, and support@ report address', () => {
  const manifest = {
    store: { slug: 'demo', displayName: 'Demo', contact: {}, languages: ['en'], currency: 'USD', tagline: {} },
    categories: [], products: [], meta: { version: 1, updatedAt: 'now' },
  } as any;
  const html = renderStoreBody(manifest, 'en', 'en');
  expect(html).toContain('/aup');
  expect(html).toContain('independent seller');
  expect(html).toContain('mailto:support@photozseo.com');
  expect(html).not.toContain('abuse@photozseo.com');
});
```

- [ ] **Step 2: Testi çalıştır — başarısız olmalı**

Run: `npx vitest run src/storefront/render.test.ts -t "AUP link"`
Expected: FAIL — `/aup` ve `independent seller` yok, `abuse@` hâlâ var.

- [ ] **Step 3: `renderStoreFooter`'ı güncelle**

`src/storefront/render.ts` `renderStoreFooter` fonksiyonunu değiştir:

```typescript
function renderStoreFooter(slug: string, locale: string): string {
  const tr = locale === 'tr';
  const poweredBy = tr ? 'Bu mağaza photoZseo ile oluşturuldu' : 'This store was created with photoZseo';
  const reportLabel = tr ? 'Bu mağazayı şikayet et' : 'Report this store';
  const aupLabel = tr ? 'Kullanım Politikası' : 'Acceptable Use Policy';
  const disclaimer = tr
    ? 'Bu mağaza bağımsız bir satıcı tarafından işletilir; photoZseo yalnızca barındırma sağlar.'
    : 'This store is operated by an independent seller; photoZseo only provides hosting.';
  const reportHref = `mailto:support@photozseo.com?subject=${encodeURIComponent('[ABUSE] Report store: ' + slug)}`;
  const aupHref = tr ? '/tr/aup' : '/aup';

  return (
    '<footer class="sf-footer">\n' +
    `  <p class="sf-footer__disclaimer">${escapeHtml(disclaimer)}</p>\n` +
    '  <div class="sf-footer__links">\n' +
    `    <a class="sf-footer__brand" href="https://photozseo.com" target="_blank" rel="noopener noreferrer">${escapeHtml(poweredBy)}</a>\n` +
    '    <span class="sf-footer__sep">·</span>\n' +
    `    <a class="sf-footer__aup" href="${escapeAttr(aupHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(aupLabel)}</a>\n` +
    '    <span class="sf-footer__sep">·</span>\n' +
    `    <a class="sf-footer__report" href="${escapeAttr(reportHref)}">${escapeHtml(reportLabel)}</a>\n` +
    '  </div>\n' +
    '</footer>\n'
  );
}
```

- [ ] **Step 4: Testi çalıştır — geçmeli**

Run: `npx vitest run src/storefront/render.test.ts -t "AUP link"`
Expected: PASS.

- [ ] **Step 5: Eski Astro footer component'ini de hizala (tutarlılık)**

`src/components/storefront/StoreFooter.astro` canlı yolda kullanılmıyor ama tutarlılık için aynı değişikliği yap: `reportHref`'i `support@photozseo.com` + `[ABUSE]` yap, AUP linki + disclaimer ekle. (render.ts ile aynı metinler.)

- [ ] **Step 6: storefront.css'e footer disclaimer stili ekle**

`public/storefront.css` sonuna ekle:

```css
.sf-footer__disclaimer { font-size: 0.75rem; color: #6b7280; margin: 0 0 0.5rem; text-align: center; }
.sf-footer__links { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; align-items: center; }
```

- [ ] **Step 7: Tüm testleri çalıştır + commit**

```bash
npx vitest run
git add src/storefront/render.ts src/storefront/render.test.ts src/components/storefront/StoreFooter.astro public/storefront.css
git commit -m "feat(store): footer AUP link + independent-seller disclaimer + support@ report address"
```

---

### Task 4: AUP (Kabul Edilebilir Kullanım Politikası) sayfası — i18n çeviri anahtarları

Legal sayfa pattern'i: `src/i18n/` çeviri anahtarları + `src/pages/aup.astro` (default) + `src/pages/[lang]/aup.astro`. Önce çeviri anahtarları (EN + TR elle, kalan 10 dil translation-swarm ile).

**Files:**
- Modify: `src/i18n/ui.ts` (veya `src/i18n/locales/*.ts` — Step 1'de hangisi olduğu belirlenecek)
- Test: yeni `src/i18n/aup.test.ts` (anahtar varlığı)

- [ ] **Step 1: Çeviri anahtarlarının nerede tutulduğunu belirle**

Run: `grep -rn "terms.title\|terms.acceptance" src/i18n/`
Expected: `terms.*` anahtarlarının hangi dosyada (ui.ts veya locales/en.ts) tanımlı olduğunu gösterir. AUP anahtarlarını aynı dosyaya/yapıya ekleyeceğiz.

- [ ] **Step 2: EN + TR için `aup.*` anahtarlarını ekle**

Step 1'de bulunan dosyaya, `terms.*` bloğunun yanına ekle (EN ve TR için). Anahtar seti:

```
aup.title            = "Acceptable Use Policy" / "Kabul Edilebilir Kullanım Politikası"
aup.updated          = "Last updated:" / "Son güncelleme:"
aup.date             = "May 31, 2026" / "31 Mayıs 2026"
aup.intro.title      = "Scope" / "Kapsam"
aup.intro.desc       = "This policy governs stores published through photoZseo at photozseo.com/store/. By publishing a store you agree to these rules. photoZseo only provides hosting; the seller is solely responsible for published content. The English version governs in case of conflict." /
                       "Bu politika, photoZseo ile photozseo.com/store/ altında yayınlanan mağazaları kapsar. Bir mağaza yayınlayarak bu kurallara uymayı kabul edersiniz. photoZseo yalnızca barındırma sağlar; yayınlanan içerikten satıcı tek başına sorumludur. Uyuşmazlık halinde İngilizce sürüm esastır."
aup.prohibited.title = "Prohibited items" / "Yasaklı ürünler"
aup.prohibited.desc  = "You may NOT publish or offer:" / "Şunları yayınlayamaz veya satışa sunamazsınız:"
aup.prohibited.list  = 10 maddelik liste (aşağıda)
aup.enforcement.title= "Enforcement" / "Uygulama"
aup.enforcement.desc = "photoZseo may remove any store or product at its sole discretion, with or without notice. We use automated checks at publish time and act on reports. Removal disables the public page; images in your own Google Drive are not affected." /
                       "photoZseo herhangi bir mağaza veya ürünü, bildirimli veya bildirimsiz, tek taraflı olarak kaldırabilir. Yayın anında otomatik kontroller uygularız ve şikayetlere göre işlem yaparız. Kaldırma yalnızca herkese açık sayfayı devre dışı bırakır; kendi Google Drive'ınızdaki görseller etkilenmez."
aup.report.title     = "Report a store" / "Mağaza şikayeti"
aup.report.desc      = "To report a store that violates this policy, email support@photozseo.com with the store address and reason." /
                       "Bu politikayı ihlal eden bir mağazayı bildirmek için mağaza adresi ve gerekçeyle support@photozseo.com adresine yazın."
```

10 maddelik yasaklı liste (her dil için):
EN: Adult/sexual (18+) content; weapons, firearms, ammunition, explosives; drugs, illegal substances, prescription medication; counterfeit/replica goods or trademark infringement; stolen or illegally obtained goods; hate speech, incitement to violence, extremist material; live animals or endangered-species products; tobacco, e-cigarettes, alcohol; financial fraud, forged documents, sale of personal data; human organs, bodily fluids, medical waste.
TR: Yetişkin/cinsel (18+) içerik; silah, ateşli silah, mühimmat, patlayıcı; uyuşturucu, yasadışı maddeler, reçeteli ilaç; sahte/taklit ürün veya marka ihlali; çalıntı veya yasadışı elde edilmiş mal; nefret söylemi, şiddete teşvik, aşırılıkçı materyal; canlı hayvan veya nesli tükenen tür ürünleri; tütün, e-sigara, alkol; finansal dolandırıcılık, sahte belge, kişisel veri satışı; insan organı, vücut sıvısı, tıbbi atık.

- [ ] **Step 3: Test yaz — aup anahtarları EN + TR'de tanımlı**

`src/i18n/aup.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { useTranslations } from './ui';

describe('aup translations', () => {
  for (const lang of ['en', 'tr'] as const) {
    it(`has aup.title and aup.prohibited.desc for ${lang}`, () => {
      const t = useTranslations(lang);
      expect(t('aup.title')).toBeTruthy();
      expect(t('aup.title')).not.toBe('aup.title');
      expect(t('aup.prohibited.desc')).toBeTruthy();
    });
  }
});
```

- [ ] **Step 4: Testi çalıştır**

Run: `npx vitest run src/i18n/aup.test.ts`
Expected: PASS.

- [ ] **Step 5: Kalan 10 dili translation-swarm ile çevir**

Diğer 10 dil (de, ar, es, ur, fa, zh, hi, pt, ko, ja) için `aup.*` anahtarlarını makine çevirisiyle doldur. translation-swarm aracı (`~/Desktop/translation-swarm/`, Google Translate, bedava, [[reference_translation_swarm]]) ile EN kaynaktan toplu çevir. AUP "English governs" maddesi içerdiğinden makine çevirisi kabul edilebilir.

Run (araç kullanımına göre): `cd ~/Desktop/translation-swarm && <batch komutu> --keys "aup.*" --source en`
Expected: 10 dil dosyasına `aup.*` anahtarları eklenir.

- [ ] **Step 6: Commit**

```bash
git add src/i18n
git commit -m "feat(legal): add AUP i18n keys (EN+TR authored, 10 langs machine-translated)"
```

---

### Task 5: AUP Astro sayfaları (default + [lang])

**Files:**
- Create: `src/pages/aup.astro`
- Create: `src/pages/[lang]/aup.astro`

- [ ] **Step 1: `src/pages/aup.astro` oluştur (terms.astro pattern'i birebir)**

```astro
---
import Layout from '../layouts/Layout.astro';
import { defaultLang, useTranslations } from '../i18n/ui';
import '../styles/legal.css';

const lang = defaultLang;
const t = useTranslations(lang);
const prohibited = t('aup.prohibited.list').split('; ');
---

<Layout title={t('aup.title')} lang={lang}>
  <article class="legal">
    <a href="/" class="legal-back">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      <span>Home</span>
    </a>
    <header class="legal-head">
      <span class="kicker">Policy</span>
      <h1>{t('aup.title')}</h1>
      <p class="updated"><strong>{t('aup.updated')}</strong> {t('aup.date')}</p>
    </header>
    <h2>{t('aup.intro.title')}</h2>
    <p>{t('aup.intro.desc')}</p>
    <h2>{t('aup.prohibited.title')}</h2>
    <p>{t('aup.prohibited.desc')}</p>
    <ul>{prohibited.map((item) => <li>{item}</li>)}</ul>
    <h2>{t('aup.enforcement.title')}</h2>
    <p>{t('aup.enforcement.desc')}</p>
    <h2>{t('aup.report.title')}</h2>
    <p>{t('aup.report.desc')}</p>
  </article>
</Layout>
```

> Not: `aup.prohibited.list` anahtarını Task 4'te 10 maddeyi `; ` ile ayrılmış tek string olarak ekle (her dil için), böylece `.split('; ')` ile listeye dönüşür.

- [ ] **Step 2: `src/pages/[lang]/aup.astro` oluştur ([lang]/terms.astro pattern'i)**

```astro
---
import Layout from '../../layouts/Layout.astro';
import { languages, defaultLang, type Lang, useTranslations } from '../../i18n/ui';
import '../../styles/legal.css';

export function getStaticPaths() {
  return Object.keys(languages)
    .filter((l) => l !== defaultLang)
    .map((lang) => ({ params: { lang } }));
}

const lang = Astro.params.lang as Lang;
const t = useTranslations(lang);
const prohibited = t('aup.prohibited.list').split('; ');
---

<Layout title={t('aup.title')} lang={lang}>
  <article class="legal">
    <a href={`/${lang}/`} class="legal-back">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      <span>Home</span>
    </a>
    <header class="legal-head">
      <span class="kicker">Policy</span>
      <h1>{t('aup.title')}</h1>
      <p class="updated"><strong>{t('aup.updated')}</strong> {t('aup.date')}</p>
    </header>
    <h2>{t('aup.intro.title')}</h2>
    <p>{t('aup.intro.desc')}</p>
    <h2>{t('aup.prohibited.title')}</h2>
    <p>{t('aup.prohibited.desc')}</p>
    <ul>{prohibited.map((item) => <li>{item}</li>)}</ul>
    <h2>{t('aup.enforcement.title')}</h2>
    <p>{t('aup.enforcement.desc')}</p>
    <h2>{t('aup.report.title')}</h2>
    <p>{t('aup.report.desc')}</p>
  </article>
</Layout>
```

- [ ] **Step 3: Build et — sayfalar derlenmeli**

Run: `npm run build`
Expected: SUCCESS; çıktıda `/aup` ve `/<lang>/aup` sayfaları oluşur (build log'da görülür).

- [ ] **Step 4: Commit**

```bash
git add src/pages/aup.astro "src/pages/[lang]/aup.astro"
git commit -m "feat(legal): add AUP page (default + 11 locales)"
```

---

### Task 6: Kill switch + footer'ı prod'a deploy ve canlı doğrula

DELETE endpoint kodu var ama prod deploy bekliyor (memory). Footer + AUP da deploy edilmeli.

**Files:** (deploy — kod değişikliği yok)

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: SUCCESS.

- [ ] **Step 2: Cloudflare Pages'e deploy**

Run: `npx wrangler pages deploy dist --project-name photozseo --branch main`
Expected: Deploy URL döner. (Sandbox'tan `*.pages.dev` erişilemez; doğrulama photozseo.com üzerinden — [[reference_website_deploy]].)

- [ ] **Step 3: AUP sayfası canlı mı doğrula**

Run: `curl -s -o /dev/null -w "%{http_code}" https://photozseo.com/aup`
Expected: `200`.

- [ ] **Step 4: Mevcut demo mağaza footer'ında AUP linki + support@ var mı doğrula**

Run: `curl -s https://photozseo.com/store/ahmet-oto-yedek | grep -o 'mailto:support@photozseo.com\|/aup\|independent seller' | sort -u`
Expected: üçü de görünür. (Demo seed yoksa önce bir test mağazası seed et veya bu adımı iOS yayını sonrası yap.)

- [ ] **Step 5: Kill switch canlı doğrula (write-key ile)**

Run (STORE_WRITE_KEY kullanıcıda):
```bash
curl -s -X DELETE -H "x-store-write-key: $STORE_WRITE_KEY" https://photozseo.com/api/store/__doesnotexist__ -w "\n%{http_code}"
```
Expected: `{"ok":true,...}` + `200` (olmayan slug için bile DELETE idempotent döner). Anahtarsız çağrı `401` vermeli:
```bash
curl -s -X DELETE https://photozseo.com/api/store/__x__ -w "\n%{http_code}"
```
Expected: `401`.

- [ ] **Step 6: Demo seed temizliği (opsiyonel)**

`ahmet-oto-yedek` demo seed canlıysa kaldır:
```bash
npx wrangler kv key delete --namespace-id e81c06c817004a22ad3620dcd75e63ac store:ahmet-oto-yedek
```

---

## Self-Review (web)

- **Spec coverage:** AUP belgesi → Task 4+5 · footer disclaimer/AUP link/report → Task 3 · denetim kaydı (KV) → Task 1+2 · kill switch → Task 6. ✅ Mağaza Şartları ayrı sayfa DEĞİL — bilinçli olarak AUP sayfasının "Scope/Enforcement" bölümlerine katlandı (YAGNI; satıcı sorumluluğu + kaldırma hakkı orada).
- **Email tutarlılığı:** `support@photozseo.com` (kanıtlı inbox) — `abuse@` kaldırıldı.
- **Type consistency:** `StoreCompliance` (TS) ↔ iOS plan `StoreCompliance` (Swift) aynı alanlar: `aupVersion`, `acceptedAt`, `publisherEmail`.
- **Kapsam dışı:** ölçeklenebilirlik (ayrı tur), otomatik N-şikayet aksiyonu.
