# Tasarım Spesifikasyonu — Sub-Project #3: Web Store/Market Render Adaptasyonu

**Tarih:** 2026-06-01
**Durum:** Design spec (implementation YOK)
**Bağlam:** photoZseo taksonomi migrasyonu. Eski el yapımı `taxonomy.json` (~31 düğüm, 2 seviye) yerini Google tabanlı kanonik ağaca (~5595 düğüm, depth ≤ 7, 12 dil) bırakıyor. Bu spec sadece **web render katmanını** (`/store` + `/market`) yeni veriye nasıl adapte edeceğimizi tanımlar.

---

## 1. Mevcut Durumun Özeti (kod incelemesi sonucu)

Önemli bulgu: **render katmanı bugün `taxonomy.json`'u doğrudan import etmiyor.** Kategori verisi iki ayrı yoldan geliyor:

- **Store tarafı (`/store/<slug>`):** Kategoriler manifest'in içinde taşınıyor — `Manifest.categories: Category[]` (`{ id, name: Localized }`). `groupProductsByCategory` (manifest.ts) ürünleri `product.categoryId === category.id` ile gruplar; eşleşmeyen ürünler `category: null` grubuna ("Diğer"/"Other") düşer. `CategorySection.astro` başlığı `resolveLocalized(group.category.name, locale)` ile çizer. Yani store, label'ı **kendi manifest'inden** okur, global taksonomiden değil.
- **Market tarafı (`/market`):** D1'e flatten edilmiş satırlar (`ProductRow.category_id` = ham id string). `marketplace.ts` içindeki chip/facet/breadcrumb render'ları kategori adını **çevirmeden, ham `c.id`'yi olduğu gibi** basıyor (`renderCategoryChips`, `renderFacets`, `renderCategoryPage` → `escapeHtml(c.id)`). Bugün `categoryId = "electronics.phones"` ekranda aynen "electronics.phones" yazıyor.

`taxonomy.json` bugün yalnızca **referans/doğrulama artefaktı** (iOS publish'te `taxonomyVersion` karşılaştırması, `types.ts` yorumları). Render'ı kırmadan değiştirme alanımız bu yüzden geniş.

Kanonik veri kaynağı (sub-project #1, commit'li):
- `src/storefront/taxonomy/tree.json` → `[{ id, parentId, depth }]`, ~5595 düğüm, numeric-string id.
- `src/storefront/taxonomy/labels.<lang>.json` → `{ id: leafLabel }`, **her düğüm için** kayıt var (Google .txt'nin her satırı tam yol, her seviyenin kendi id'si). 12 dil.
- `src/storefront/taxonomy/meta.json` → `{ googleVersion, taxonomyVersion, generatedAt }`.

---

## 2. Hedefler

1. ~5595 düğümlük derin ağacı kullanıcıyı boğmadan sunmak: `/market`'te **browse cephe** (üst 1–2 seviye) + arama/filtre derinlik için.
2. Kategori adlarını kullanıcının dilinde göstermek (id → label lookup).
3. Store ürün sayfasında **tam breadcrumb yolu** (parentId zinciri çözülerek).
4. `/market` faceted browse'ı yeni ağaç + Orama arama ile çalıştırmak.
5. Eski `categoryId` taşıyan ürünler için (migrasyon #5 koşana kadar) zarif **"uncategorized" fallback**.
6. SEO: kategori sayfaları + sitemap etkileri.

---

## 3. Veri Erişim Modeli — `taxonomyService` (yeni, paylaşılan)

Render katmanına tek bir okuma yüzeyi tanımlıyoruz. Hem Astro (store, build-time) hem Pages Functions (market, request-time) tüketir. Saf TS, DOM yok — `marketplace.ts` ile aynı test edilebilirlik standardı.

```ts
// src/storefront/taxonomy/service.ts (öneri)
export interface TaxNode { id: string; parentId: string | null; depth: number; }

export interface TaxonomyService {
  node(id: string): TaxNode | undefined;
  children(id: string | null): TaxNode[];     // parentId === id; null → kökler (depth 0)
  ancestors(id: string): TaxNode[];           // kökten id'ye (id hariç), sıralı
  label(id: string, lang: string): string;    // labels[lang][id] ?? labels.en[id] ?? id
  path(id: string, lang: string): string[];   // ancestors+self label dizisi → breadcrumb
  version(): number;                           // meta.taxonomyVersion (cache-bust)
}
```

İç indeksler (bir kez kurulur, bellekte tutulur): `byId: Map<id, TaxNode>`, `childrenOf: Map<parentId|"__root__", TaxNode[]>`. 5595 düğüm × ~3 alan = önemsiz bellek (~birkaç yüz KB). Lang label haritaları **lazy** yüklenir (yalnızca istenen dil).

> **API sözleşmesi notu (sub-project #2).** Verilen sözleşme: `GET /api/taxonomy/tree`, `/labels/:lang`, `/search?q=&lang=`, `/node/:id (+ancestors)`. **Değişiklik önerisi:** Astro store sayfaları build-time statik üretiliyor; orada HTTP fetch yerine `tree.json`/`labels.<lang>.json`'u **doğrudan import** etmek daha hızlı ve deploy-bağımsız. Bu yüzden `taxonomyService` iki adaptöre sahip olsun: (a) **local adapter** (JSON import — store/build ve market/edge için tercih edilen) ve (b) **HTTP adapter** (sözleşmedeki endpoint'ler — yalnızca client-side dinamik tüketici gerekirse). Endpoint'lerin kendisi sub-project #2'de kalsın ama web render'ın **default yolu local import** olsun; `/api/taxonomy/*` cache-bust için `taxonomyVersion` query'sini desteklemeye devam etsin. `/search` endpoint'i Orama'yı sarmalıyorsa market arama bunu kullanır (bkz. §6).

---

## 4. `/market` — Browse Cephe + Derinlik için Arama

### 4.1 Browse façade (üst seviyeler)

`/market` ana sayfası ve facet'ler **tüm 5595 düğümü göstermez.** Sunum stratejisi:

- **Curated Collections + chip satırı:** `children(null)` ile **depth-0 kökler** (Google L1, ~21 üst kategori) chip/kart olarak. Her chip `/market/c/<id>` linki.
- **Kategori sayfası (`/market/c/<id>`) drill-down:** O düğümün çocukları (`children(id)`) alt-kategori chip'leri olarak ürün gridinin üstünde gösterilir; tıklayınca bir seviye daha derine inilir. Böylece kullanıcı 7 seviyeyi sayfa-sayfa gezer, hiçbir ekranda boğulmaz.
- **Facet (`renderFacets`) kategori bloğu:** Mevcut arama bağlamındaki ürünlerin ait olduğu kategorilerin **yalnızca ilk-seviye atalarını** (veya o anki drill seviyesini) gösterir — facet listesi binlerce satıra şişmez. Sayım (`count`) D1 facet'inden gelir.
- **Derinlik = arama:** L2'nin altını chip'le gezmek yerine kullanıcı arama kutusuna yazar; Orama hem ürün hem kategori adı üzerinde eşleşir (bkz. §6).

### 4.2 Label çözümü (market)

Bugün ham id basan üç fonksiyon **`taxonomyService.label(id, locale)`** kullanacak şekilde değişir:

| Fonksiyon | Bugün | Yeni |
|---|---|---|
| `renderCategoryChips` | `escapeHtml(c.id)` | `escapeHtml(svc.label(c.id, locale))` |
| `renderFacets` (kategori opt) | `escapeHtml(c.id)` | `escapeHtml(svc.label(c.id, locale))` |
| `renderCategoryPage` (h1 + breadcrumb) | `escapeHtml(categoryId)` | breadcrumb = `svc.path(categoryId, locale)`, h1 = son eleman |
| `renderMarketHome` Curated kartları | `escapeHtml(c.id)` | `svc.label(c.id, locale)` |

`marketplace.ts` saf-TS kalmalı → `svc` parametresi (veya `labelOf: (id)=>string` callback'i) router'dan **inject edilir**. Router (`functions/market/[[path]].ts`) `taxonomyService`'i kurar, locale'e göre label fonksiyonunu render çağrılarına geçirir. Bu, mevcut `adaptFacets` inject pattern'iyle birebir tutarlı.

### 4.3 Category sayfası breadcrumb (market)

`renderCategoryPage` bugün düz `Market › <id>`. Yeni: `Market › L1 › L2 › … › <leaf>`, her segment `svc.path()`'ten, ara segmentler `/market/c/<ancestorId>` linkli. Bu hem UX hem SEO (BreadcrumbList JSON-LD, §7) kazandırır.

---

## 5. `/store/<slug>` — Tam Breadcrumb + Label

Store tarafı manifest-içi `categories[].name` kullanmaya **devam edebilir** (geriye uyumlu) ama yeni ürünler artık manifest'e zengin localized ad gömmek yerine sadece numeric `categoryId` taşıyabilir. İki katmanlı çözüm:

1. **Grup başlığı (`CategorySection`):** `group.category.name` doluysa onu kullan (eski manifest'ler / iOS'un gömdüğü ad). Boşsa/yoksa `taxonomyService.label(categoryId, locale)`'a düş.
2. **Ürün sayfası breadcrumb (`ProductDetail.astro`):** Bugün breadcrumb YOK (sadece "← Mağazaya dön"). Yeni: `svc.path(product.categoryId, locale)` ile tam yol gösterilir:
   `Mağaza adı › L1 › L2 › … › Leaf`. Store içi kategori sayfası olmadığından ara segmentler **link değil, düz metin** (veya store ana sayfasındaki ilgili `#cat-<id>` anchor'ına — Açık Karar D5). `categoryId` çözülemezse breadcrumb satırı **gizlenir** (render edilmez), kırık zincir gösterilmez.

`manifest.ts` değişiklikleri:
- `groupProductsByCategory`: `category: null` grubunun label'ı bugün sabit "Diğer/Other". Yeni: eğer ürünün `categoryId`'si **yeni ağaçta çözülüyorsa** o grup `category: null` yerine taksonomi-çözümlü bir sentetik grup olur. Yalnızca gerçekten çözülemeyen id'ler "Other"a düşer.
- Yeni helper: `resolveCategoryName(categoryId, manifestCategory, locale, svc)` → öncelik sırası `manifestCategory.name` → `svc.label` → "Other".

Astro store sayfaları build/SSR sırasında `svc`'yi **local adapter** ile alır (JSON import), HTTP gerektirmez.

---

## 6. Faceted Browse + Orama Arama Entegrasyonu

- **D1 facet'leri** (`functions/_lib/marketplace.ts`) ham `category_id` üzerinden sayıyor — bu **değişmez**; facet hâlâ id+count döner. Adaptasyon yalnızca **görüntüleme** katmanında (label lookup, §4.2).
- **Drill-down facet'i:** Router, facet'teki id'leri `svc.ancestors` ile gruplayıp yalnızca **o anki drill seviyesini** üreterek render'a verebilir (binlerce satır yerine birkaç). Bu router-seviyesi bir reduce; render saf kalır.
- **Orama arama** (`/search` veya P2 `searchProducts`): Kategori adlarını da aranabilir yapmak için iki seçenek (Açık Karar D3): (a) ürün indeksine ürünün **kategori yol label'larını** (tüm dillerde veya aktif dilde) bir alan olarak gömmek → "running shoes" araması kategori adıyla da eşleşir; (b) ayrı bir taksonomi arama indeksi (`/api/taxonomy/search`) ile kategori önerileri + ürün sonuçlarını birleştirmek. Öneri: (a) — tek indeks, daha basit, mevcut `searchProducts` akışına minimum dokunuş.
- **Geçersiz `categoryId` filtresi:** `/market/c/<id>` veya `?categoryId=` çözülemezse → ürün sonucu boş olabilir; sayfa "noResults" gösterir, breadcrumb leaf yerine ham id'yi gösterir (kırılmaz). H1 için `svc.label` zaten id'ye fallback ediyor.

---

## 7. SEO

- **Kategori sayfaları (`/market/c/<id>`):** `<title>` ve `<h1>` artık **localized leaf label** (ham id değil) → anlamlı, indekslenebilir. Şu an indeksleniyor (search sayfasının aksine `robots` yok) — korunur.
- **BreadcrumbList JSON-LD:** `renderCategoryPage` ve `ProductDetail`'e `svc.path()`'ten üretilen `BreadcrumbList` eklenir. `marketplace.ts`'te `buildBreadcrumbJsonLd(path, hrefs, origin)` helper'ı (mevcut `buildItemListJsonLd` komşusu).
- **Sitemap (`functions/marketplace-sitemap.ts`):** Bugün `/market` + store + ürün URL'leri var, **kategori URL'leri yok.** Karar (D4): üst-seviye kategori sayfalarını (`/market/c/<L1-id>`, ~21 URL, lang-alternatif'siz veya `?lang=` ile) sitemap'e eklemek SEO'ya yardımcı olur. **5595 kategorinin tamamı sitemap'e EKLENMEZ** — ürünsüz kategoriler thin-content + crawl israfı. Yalnızca **ürün barındıran** kategoriler (D1'den distinct `category_id` → atalarıyla birlikte) dahil edilmeli.
- **hreflang:** Mevcut `buildAlternates` (`?lang=`) kategori sayfaları için zaten çalışıyor; label dile göre değiştiğinden alternatifler doğru.
- **Canonical:** `/market/c/<id>` numeric id ile canonical kalır (label slug DEĞİL) — id kararlı, label çevrilebilir/değişebilir. Açık Karar D6'da insan-okunur slug tartışılıyor.

---

## 8. Geriye Uyumluluk (migration #5 öncesi)

Migrasyon #5 ürünlerin eski `categoryId`'lerini (`"electronics.phones"`) yeni numeric id'lere taşıyana kadar **karışık veri** olacak:

- `svc.node("electronics.phones")` → `undefined` (yeni ağaçta yok).
- **Fallback zinciri** her yerde aynı: `manifestCategory.name` → `svc.label` → ham id (market) / **breadcrumb gizle + "Other" grubu** (store).
- Market `renderCategoryChips`/`renderFacets`: çözülemeyen id'ler ham string olarak görünmeye devam eder (bugünkü davranış) — **regression yok**, sadece çözülenler güzelleşir.
- **Köprü tablosu (opsiyonel, D2):** Eski ~31 id → yeni numeric id eşlemesi (`legacyCategoryMap.json`) eklenirse, render katmanı migrasyon #5'ten ÖNCE bile eski ürünleri doğru göstrebilir. Render'da: `svc.node(id) ?? svc.node(legacyMap[id])`. Bu, #5'i beklemeden tutarlı UX verir; #5 koştuğunda harita silinir.
- Hiçbir kod yolu çözülemeyen id'de **throw etmez**; her zaman zarif düşüş.

---

## 9. Migration Touchpoint Özeti

| Dosya | Değişiklik (tasarım) |
|---|---|
| `src/storefront/taxonomy/service.ts` | **YENİ** — `taxonomyService` (local + HTTP adapter), tree+label index. |
| `src/storefront/marketplace.ts` | `renderCategoryChips`/`renderFacets`/`renderCategoryPage`/`renderMarketHome`'a `labelOf`/`svc` inject; ham id yerine label; breadcrumb `svc.path`; `buildBreadcrumbJsonLd`. |
| `functions/market/[[path]].ts` | `taxonomyService`'i kurar, locale label fn'i inject; facet drill-down reduce; kategori sayfası breadcrumb JSON-LD. |
| `src/storefront/manifest.ts` | `resolveCategoryName` helper; `groupProductsByCategory` taksonomi-fallback; "Other" yalnızca gerçekten çözülemeyenler. |
| `src/components/storefront/CategorySection.astro` | Başlık `resolveCategoryName` ile (manifest adı → svc → Other). |
| `src/components/storefront/ProductDetail.astro` | **YENİ** breadcrumb satırı (`svc.path`), çözülemezse gizli. |
| `functions/marketplace-sitemap.ts` | Ürün barındıran üst-seviye kategori URL'leri eklenir. |
| `src/storefront/taxonomy.json` | Migrasyon #5 sonrası **silinir** (artık referans değil). |

Test: her yeni saf fonksiyon (`service`, `resolveCategoryName`, breadcrumb builder) için vitest; mevcut `marketplace.test.ts`/`render.test.ts` label-inject ile güncellenir.

---

## Açık Kararlar (Open Decisions)

**D1 — `/market` browse derinliği (kaç seviye chip ile gezilebilsin?)**
- A) Yalnızca L1 chip + gerisi arama. B) L1 + L2 drill (kategori sayfasında alt-chip'ler), L3+ arama. C) Sınırsız drill (her kategori sayfası çocuklarını gösterir, 7 seviyeye kadar).
- **Öneri: B.** L1+L2 keşfi kapsar, 5595 düğümü asla tek ekrana koymaz, arama derinliği halleder. C teknik mümkün ama çoğu seviye ürünsüz olur (thin).

**D2 — Eski→yeni kategori köprü tablosu (`legacyCategoryMap.json`) migrasyon #5'ten önce eklensin mi?**
- A) Evet — ~31 eski id'yi elle eşle, render hemen doğru gösterir. B) Hayır — #5'i bekle, o zamana kadar eski ürünler ham id / "Other" görünsün.
- **Öneri: A** (eğer #5 yakın değilse). Düşük maliyet (31 satır), kullanıcı/SEO için tutarlı görünüm; #5 koşunca dosya silinir.

**D3 — Kategori adları aramada nasıl eşleşsin (Orama)?**
- A) Ürün indeksine kategori yol-label'larını gömmek (tek indeks). B) Ayrı `/api/taxonomy/search` + sonuç birleştirme.
- **Öneri: A.** Mevcut `searchProducts`'a minimum dokunuş, "eco-friendly running shoes" gibi sorgular kategori adıyla da yakalanır. B yalnızca kategori-keşfi başlı başına özellik olursa.

**D4 — Sitemap'e hangi kategori URL'leri girsin?**
- A) Hiçbiri (bugünkü durum). B) Yalnızca ürün barındıran üst-seviye (L1, ~21). C) Ürün barındıran her seviye (atalar dahil).
- **Öneri: B.** SEO kazancı + crawl israfı yok; ürünsüz/derin kategoriler thin-content riskini doğurmaz. C ileride trafik gerekçesi olursa.

**D5 — Store ürün sayfası breadcrumb segmentleri linkli mi?**
- A) Düz metin (store içi kategori sayfası yok). B) Store ana sayfasındaki `#cat-<id>` anchor'ına link. C) `/market/c/<id>`'ye (market'e sıçratır) link.
- **Öneri: B.** Kullanıcıyı mağazada tutar, mevcut anchor altyapısını kullanır. C kullanıcıyı mağazadan koparır.

**D6 — `/market/c/<id>` URL'i numeric id mi, insan-okunur slug mı?**
- A) Numeric id (`/market/c/212`) — kararlı, çeviri-bağımsız, canonical net. B) Slug (`/market/c/shirts-tops`) — okunur ama hangi dilde? çeviri değişince kırılır. C) Hibrit `/market/c/212-shirts-tops` (id kanonik, slug kozmetik).
- **Öneri: A** (v1, basit + kararlı). C bir sonraki iterasyonda SEO için değerlendirilir; B tek başına çok-dilli sitede sorunlu.
