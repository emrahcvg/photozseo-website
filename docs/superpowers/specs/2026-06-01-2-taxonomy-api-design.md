# Web Taksonomi API — Tasarım (Alt-proje #2)

**Tarih:** 2026-06-01
**Durum:** Tasarım taslağı (implementasyon DEĞİL); brainstorm + onay bekliyor
**Kapsam:** "Google taksonomisine tam migrasyon" işinin **ikinci** alt-projesi. Alt-proje #1 (veri pipeline'ı, `feat/taxonomy-pipeline`) tarafından üretilen kanonik veriyi (`src/storefront/taxonomy/*.json`) web'e (store + market render #3, ileride iOS picker #4) servis eden Cloudflare Pages Functions API katmanı. Sadece HTTP sözleşmesi + servis stratejisi; tüketici UI ayrı spec'lerde.

## Amaç

Kanonik taksonomi verisini (`tree.json` ~5595 düğüm + 12 `labels.<lang>.json` + `meta.json`) tüketicilere düşük transfer maliyetiyle, çok dilli ve versiyonlanmış olarak sunan bir okuma-API'si. Yazma yok — veri build-time üretiliyor, API salt-okunur ve public (mevcut render endpoint'leri gibi).

## Mevcut stack ile uyum (incelendi)

- **Pages Functions** `functions/api/...` altında, dosya-bazlı routing. Mevcut örnekler: `functions/api/store/[slug].ts`, `functions/api/rates/[base].ts`.
- **KV binding** `STORE_KV` (bkz. `package.json` `pages:dev`). `rates/[base].ts` deseni: KV'den oku → miss'te kaynaktan üret → TTL ile yaz → `cache-control` ile dön.
- **`functions/_lib/`** helper'ları: `registry.ts` (key-prefix + get/put), `auth.ts` (write-key; bu API'de gerekmez — salt okunur public), `html-response.ts`. Yeni helper: `functions/_lib/taxonomy.ts`.
- **Orama** zaten dependency; `marketplace.ts` deseni: modül-global lazy cache + `version` damgası (`getOrama` → `_oramaCache.version === version` ise yeniden kurma), `create/insertMultiple/search` import'ları. Bu deseni birebir taşıyacağız.
- **Tipler:** `src/storefront/types.ts` → `Category { id; name: Localized }`, `ManifestMeta.taxonomyVersion?: number`. API yanıtları bununla uyumlu kalmalı (özellikle `taxonomyVersion`).

## Endpoint sözleşmesi

Hepsi `GET`, public, `application/json; charset=utf-8`. Prefix: `/api/taxonomy`.

### 1) Meta / versiyon
```
GET /api/taxonomy/meta
→ 200 { "googleVersion": "2025-06-19", "taxonomyVersion": 7, "generatedAt": "<iso>",
        "nodeCount": 5595, "langs": ["en","tr","de","es","pt","ja","ko","zh","ar","fa","hi","ur"] }
```
İstemci açılışta bunu çeker; `taxonomyVersion` ETag/cache anahtarı ve diğer çağrıların `?v=` parametresi için kullanılır.

### 2) Tam ağaç (dil-bağımsız yapı)
```
GET /api/taxonomy/tree
→ 200 [ { "id": "1", "parentId": null, "depth": 0 }, ... ]   # ~5595 düğüm, label YOK
Headers: ETag: "tax-tree-v7", Cache-Control: public, max-age=86400, immutable
```
Sadece `tree.json` aynen. Label içermez (dilden bağımsız, agresif cache'lenir).

### 3) Dil başına label'lar
```
GET /api/taxonomy/labels/:lang        (lang ∈ langs; geçersizse en'e fallback)
→ 200 { "1": "Animals & Pet Supplies", "3237": "Bird Cages", ... }
Headers: ETag: "tax-labels-<lang>-v7", Cache-Control: public, max-age=86400, immutable
```
İstemci `tree` (1 kez) + yalnızca kullanıcının dili için `labels/:lang` çeker. Tam yol istemcide `tree.parentId` zinciri + `labels` ile kurulur (sunucu yol birleştirmez → tekrar veri yok).

### 4) Tek düğüm + atalar (breadcrumb)
```
GET /api/taxonomy/node/:id?lang=tr
→ 200 {
    "id": "3237",
    "depth": 2,
    "label": "Kuş Kafesleri",
    "path": "tr" çözümlü: [ {"id":"1","label":"..."}, {"id":"...","label":"..."}, {"id":"3237","label":"..."} ],
    "childIds": ["...","..."]
  }
→ 404 { "error": "Unknown node", "id": "<id>" }
```
Breadcrumb + alt-kategori navigasyonu için tek-çağrı kolaylığı. `lang` verilmezse `en`. Sunucu burada atalar zincirini çözer (küçük yanıt; istemcinin tüm `tree`'yi indirmeden breadcrumb göstermesi için).

### 5) Arama / autocomplete
```
GET /api/taxonomy/search?q=kuş&lang=tr&limit=10
→ 200 {
    "query": "kuş", "lang": "tr",
    "results": [
      { "id": "3237", "label": "Kuş Kafesleri", "path": "Hayvanlar > Evcil Hayvan > Kuş Kafesleri", "depth": 2, "score": 0.91 }
    ]
  }
```
- `q` zorunlu (min 1–2 char), `lang` opsiyonel (default `en`, geçersizse `en`), `limit` opsiyonel (default 10, max 25).
- Boş/eksik `q` → `400 { "error": "q required" }`.
- `path` insan-okunur tam yol (sonuç listesinde ayırt edicilik için; ataları indekste/ön-hesapta tutarız).

## Veri servis stratejisi (KV vs bundled)

İki gerçek seçenek var (Açık Kararlar #1'de detay):

- **A — Static import (önerilen):** `tree.json` + `labels.*.json` repo'da; Pages Function bunları doğrudan `import` eder (build'e bundle'lanır). Avantaj: ekstra altyapı yok, deploy atomik (veri + kod aynı sürüm), KV upload adımı yok, `rates` gibi runtime fetch yok. Dezavantaj: tüm label dosyaları (~12) Worker bundle'ına girer (her biri ~150–250 KB → toplam birkaç MB; Pages Functions limiti içinde ama izlenmeli).
- **B — KV upload:** build sonrası bir script `STORE_KV`'ye `tax:tree:v<N>`, `tax:labels:<lang>:v<N>`, `tax:meta` yazar; Function KV'den okur (rates deseni). Avantaj: Worker bundle küçük; veri sürümü koddan bağımsız güncellenebilir. Dezavantaj: ekstra upload adımı + KV/kod sürüm drift riski + `tree.json` ~5595 düğüm tek KV value (≤25 MB limit OK ama büyük read).

Her iki durumda **kaynak dosyalar** `src/storefront/taxonomy/` (alt-proje #1 çıktısı). Fark yalnızca Function'ın bunları nereden okuduğu.

## Cache / ETag / versiyonlama

- `tree` ve `labels/:lang` **immutable** kabul edilir: içerik yalnızca `taxonomyVersion` değişince değişir. ETag = `"tax-<kind>-<lang?>-v<taxonomyVersion>"`.
- Function `If-None-Match` eşleşirse `304` döner (transfer sıfır).
- `Cache-Control: public, max-age=86400, immutable` + Cloudflare edge cache.
- İstemci-tarafı versiyonlama: client `?v=<taxonomyVersion>`'i URL'e koyarsa farklı sürümler ayrı cache key olur; sürüm artınca otomatik bust.
- `meta` kısa cache (`max-age=300`) — sürüm değişimini görmek için.

## Lokalizasyon

- `lang` query/path param `labels.<lang>.json` dosyasını seçer.
- Geçerli diller `meta.langs` (12). Bilinmeyen/eksik `lang` → **`en` fallback** (404 değil; UI bozulmasın).
- Pipeline her dil dosyasının TÜM id'leri kapsadığını garanti ettiğinden (#1 başarı kriteri), id-bazlı label fallback'e gerek yok; yalnızca dil-seçimi fallback'i var.
- `node` ve `search` yanıtlarındaki tüm label'lar tek `lang`'a göre çözülür (karışık dil yok).

## Arama (Orama)

- **Şema:** `{ id: 'string', label: 'string', path: 'string', depth: 'number' }`. `path` = o dildeki tam insan-okunur yol (ata label'ları birleştirilmiş) → "Bird Cages" araması "Animals > ... > Bird Cages" üzerinden de eşleşir.
- **Çok dillilik:** Orama dil-başına ayrı indeks. `marketplace.ts`'teki gibi **modül-global lazy cache**, ama `Map<lang, { db, version }>` ile (her dil ayrı indeks, ilk istekte kurulur, `taxonomyVersion` damgalı).
- **Kurulum zamanı:** on-demand (ilk `search?lang=tr` isteğinde o dil için indeks kurulur, sonraki istekler cache'ten). 5595 düğüm × tek dil indeks kurulumu hızlı; tüm 12 dili build-time kurmak gereksiz (çoğu dil hiç sorgulanmayabilir). Bkz. Açık Kararlar #4.
- **Sorgu çevirisi YOK:** marketplace'teki LLM query-translate burada gerekmez — kullanıcı kendi dilinde arar, o dilin indeksinde eşleşir.
- Orama tokenizer dil-duyarlı kurulabilir (`components.tokenizer.language`); en azından `en` için stemming; CJK/ar için tokenizer davranışı build sırasında doğrulanmalı (Açık Kararlar #4).

## Payload boyut stratejisi

- **12 label dosyasının tamamı asla tek istemciye gitmez.** Web istemci yalnızca aktif UI dilinin `labels/:lang`'ını çeker (~150–250 KB, edge-cache + gzip ile ~30–60 KB).
- `tree.json` (label'sız, ~5595 × küçük obje) tek seferde çekilir, immutable cache → tekrar indirilmez.
- Breadcrumb/derin görünüm için `tree` zaten istemcide; ekstra çağrı gerekmez. `node/:id` yalnızca `tree`'yi hiç indirmeyen hafif sayfalar (örn. tek ürün sayfası) için kolaylık.
- iOS (alt-proje #4) hepsini bundle'lar — bu API'yi kullanmaz; API web-öncelikli.

## `_lib` kompozisyonu

Yeni dosya `functions/_lib/taxonomy.ts`:
- `loadTree()`, `loadLabels(lang)`, `loadMeta()` — seçilen servis stratejisine (static import veya KV) göre tek noktadan veri erişimi; Function'lar buradan okur.
- `resolveAncestors(tree, id)` — `parentId` zinciri.
- `getTaxonomyOrama(lang, version)` — `marketplace.ts`'teki `getOrama` desenini birebir izleyen lazy, version-damgalı, dil-başına cache.
- `taxonomyEtag(kind, lang?, version)` + `json304(...)` — `rates`/`html-response` cache deseniyle uyumlu yanıt yardımcıları.
- `auth.ts` kullanılmaz (salt-okunur public). `registry.ts` key-prefix konvansiyonu KV seçilirse taklit edilir (`tax:` prefix).

## Bu alt-projenin sınırları (kapsam dışı)

- Store/market render adaptasyonu (#3) — bu API'yi tüketir.
- iOS picker (#4).
- Eski `categoryId` → Google ID migrasyonu (#5).
- Yazma/admin endpoint'i (veri build-time üretilir).

## Başarı kriteri

- 5 endpoint canlı, `meta.taxonomyVersion` pipeline çıktısıyla aynı.
- `tree` + tek dil `labels` ile istemci tam yol/breadcrumb kurabiliyor; ikinci yükte `304`.
- `search?q=...&lang=tr` ilgili düğümleri doğru dilde, `path` ile döndürüyor.
- Bilinmeyen `lang` → `en` fallback, çökme yok.

## Açık Kararlar (Open Decisions)

1. **Veri servis stratejisi: static import mı, KV upload mı?**
   - Seçenek A: dosyaları Function'a `import` et (bundle'lanır).
   - Seçenek B: build sonrası `STORE_KV`'ye yükle, Function KV'den okusun (rates deseni).
   - **Önerim: A (static import).** Veri seyrek değişiyor (çeyreklik build), deploy atomik olur, KV/kod sürüm drift'i ve ekstra upload adımı yok. Bundle boyutu izlenir; sorun olursa B'ye geçilir.

2. **Endpoint granülerliği: `node/:id` ayrı endpoint olarak gerekli mi?**
   - Seçenek A: 5 endpoint (meta, tree, labels, node, search) — node breadcrumb'ı sunucuda çözer.
   - Seçenek B: 4 endpoint, `node`'u at — istemci `tree`+`labels`'tan ataları kendi çözsün.
   - **Önerim: A.** `node/:id` ucuz ve `tree`'yi indirmeyen hafif sayfalar (tek ürün, deep-link) için değerli; maliyeti düşük.

3. **Arama indeks motoru: Orama mı, basit ön-hesap mı?**
   - Seçenek A: Orama (mevcut dependency, full-text + skor + typo-tolerans).
   - Seçenek B: build-time düz substring/prefix indeksi (JSON), Worker'da basit filtre — daha küçük, motor yok.
   - **Önerim: A (Orama).** Zaten bağımlı, `marketplace.ts` deseni hazır, autocomplete kalitesi belirgin daha iyi.

4. **Orama indeks kurulum zamanı + tokenizer: on-demand per-lang mı, build-time mı?**
   - Seçenek A: on-demand, dil-başına lazy cache (ilk sorguda kur).
   - Seçenek B: build-time tüm 12 dil indeksini önceden serialize et, Function yükle.
   - **Önerim: A**, fakat CJK (zh/ja/ko) ve ar/fa/ur tokenizer davranışı doğrulanmalı; kötüyse o diller için build-time özel tokenizer/serialize'e geçilir.

5. **Cache sürtüşmesi: ETag versiyonlama mı, URL `?v=` mı, ikisi de mi?**
   - Seçenek A: yalnızca ETag + `immutable` (sunucu `taxonomyVersion`'a bağlar).
   - Seçenek B: ek olarak istemci URL'e `?v=<taxonomyVersion>` koyar (sürüm artınca cache otomatik bust).
   - **Önerim: ikisi de.** ETag transferi sıfırlar; `?v=` istemci-tarafı eski cache'i sürüm artışında temiz şekilde geçersiz kılar.

6. **API public mi kalsın, yoksa rate-limit/origin kısıtı mı?**
   - Seçenek A: tamamen public (mevcut render endpoint'leri gibi), kısıt yok.
   - Seçenek B: Cloudflare edge rate-limit / origin (CORS) kısıtı.
   - **Önerim: A** (salt-okunur, statik, edge-cache'li → kötüye kullanım maliyeti düşük); abuse görülürse Cloudflare WAF/rate-limit eklenir. Kod değişmez.
