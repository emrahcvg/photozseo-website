# Eski `categoryId` Migrasyonu — Tasarım (Alt-proje #5)

**Tarih:** 2026-06-01
**Durum:** Taslak tasarım (implementasyon YOK)
**Kapsam:** Daha büyük "Google taksonomisine tam migrasyon" işinin **5. ve son** alt-projesi. Eski elle yazılmış ~31 düğümlü taksonomiye (`electronics.phones` gibi nokta- id) bağlı ürünlerin `categoryId` değerlerini, alt-proje #1'in ürettiği **Google sayısal ID** kanonik anahtarına taşımak. Odak: **web/KV'de saklanan storefront dokümanları**. iOS tarafı (#4) için yalnızca koordinasyon notu.

---

## 1. Migre edilen veri — bağlam

KV kaydının şekli (`functions/_lib/registry.ts` → `StoreRecord`):

```
store:<slug>  →  StoreRecord {
  manifest: Manifest {
    store:      StoreInfo,
    categories: Category[]   // { id, name: Localized }   ← eski id'ler burada
    products:   Product[]    // { id, categoryId?, ... }  ← eski id'ler burada
    meta:       ManifestMeta { version, updatedAt, taxonomyVersion? }
  },
  phone?, status, version, updatedAt
}
```

İki yerde eski id geçer:
1. `manifest.categories[].id` — store sahibinin gösterdiği kategori listesi (eski taksonomiden ya da serbest "c1/c2" gibi olabilir — `fixtures/ahmet-oto-yedek.json` `c1`/`c2` kullanıyor; `marketplace.test.ts` `electronics.phones` kullanıyor).
2. `manifest.products[].categoryId` — ürünün ait olduğu kategori; `manifest.categories[].id`'ye veya doğrudan eski taxonomy id'sine işaret eder.

**Kritik gözlem (`manifest.ts:132-141`):** render zaten `categoryId`'yi `categories[].id` ile *string eşitliği* üzerinden eşler; eşleşmeyen ürünler `category: null` (uncategorized) grubuna düşer, **sessizce kaybolmaz** ama "Diğer" altında toplanır. Migrasyon bu invariant'ı korumalı: id'leri değiştirirken `products[].categoryId` ile `categories[].id` arasındaki bağ **birlikte** güncellenmeli, yoksa her şey uncategorized olur.

**İki tür veri var:**
- **Taksonomi-uyumlu id'ler** (`electronics.phones`) — tablo ile maplenebilir.
- **Serbest/keyfi id'ler** (`c1`, `c2`, store sahibinin yazdığı rastgele) — tablo ile **maplenemez**; bunlar `manifest.categories[].name` (Localized) üzerinden ya korunur ya da fallback'e gider (bkz. Açık Karar 3).

---

## 2. Önerilen Mapping Tablosu (eski id → Google sayısal ID)

Google Product Taxonomy sayısal ID'leri kararlıdır; aşağıdaki ID'ler kanonik üst düzey/ara düğümlere denk gelir. **`google_path` yalnızca akıl sağlığı (sanity) içindir** — kanonik anahtar `google_id`'dir; gerçek path build edilen `tree.json` + `labels.<lang>.json`'dan çözülür. Implementasyon sırasında her `google_id`'nin `tree.json`'da var olduğu **doğrulanmalıdır** (bkz. Açık Karar 5).

| eski id | google_id | google_path (sanity) | not |
|---|---|---|---|
| `electronics` | `222` | Electronics | üst düzey |
| `electronics.phones` | `267` | Electronics > Communications > Telephony > Mobile Phones | "& Accessories" kısmı geniş; çekirdek = telefon |
| `electronics.computers` | `278` | Electronics > Computers | tablet de bu dalın altında |
| `electronics.audio` | `223` | Electronics > Audio | kulaklık bu dalın altında |
| `clothing` | `1604` | Apparel & Accessories > Clothing | "Apparel" kökü 166; çekirdek giyim 1604 |
| `clothing.womens` | `1604` | Apparel & Accessories > Clothing | Google'da cinsiyet attribute'tur, ayrı düğüm değil → Clothing kökü (bkz. Açık Karar 3) |
| `clothing.mens` | `1604` | Apparel & Accessories > Clothing | aynı; cinsiyet `attributes.gender` ile taşınır |
| `clothing.kids` | `5424` | Apparel & Accessories > Clothing > Baby & Toddler Clothing | en yakın çocuk dalı; ageGroup attribute |
| `clothing.shoes` | `187` | Apparel & Accessories > Shoes | net eşleşme |
| `home` | `536` | Home & Garden | üst düzey |
| `home.furniture` | `436` | Furniture | Google'da Furniture ayrı üst düzeydir (Home & Garden değil) |
| `home.kitchen` | `730` | Home & Garden > Kitchen & Dining | net |
| `home.decor` | `696` | Home & Garden > Decor | net |
| `beauty` | `469` | Health & Beauty > Personal Care | "Beauty & Personal Care" → Personal Care dalı |
| `beauty.makeup` | `2915` | Health & Beauty > Personal Care > Cosmetics > Makeup | net |
| `beauty.skincare` | `567` | Health & Beauty > Personal Care > Cosmetics > Skin Care | net |
| `beauty.fragrance` | `2882` | Health & Beauty > Personal Care > Cosmetics > Perfume & Cologne | net |
| `jewelry` | `188` | Apparel & Accessories > Jewelry | "& Accessories" → Jewelry çekirdeği |
| `jewelry.rings` | `194` | Apparel & Accessories > Jewelry > Rings | net |
| `jewelry.necklaces` | `196` | Apparel & Accessories > Jewelry > Necklaces | net |
| `jewelry.watches` | `201` | Apparel & Accessories > Jewelry > Watches | net |
| `toys` | `1239` | Toys & Games > Toys | "Toys & Games" kökü 1253; çekirdek Toys 1239 (bkz. Açık Karar 3) |
| `sports` | `499713` | Sporting Goods | Google'da "Sporting Goods" ayrı üst düzey |
| `books` | `784` | Media > Books | "& Stationery" karışık → Books çekirdeği (kırtasiye Office'e düşer) |
| `food` | `412` | Food, Beverages & Tobacco > Food Items | net (içecek alt dalı 413) |
| `pets` | `1` | Animals & Pet Supplies > Pet Supplies (~5) | "Animals & Pet Supplies" kökü 1; çekirdek Pet Supplies |
| `automotive` | `888` | Vehicles & Parts > Vehicle Parts & Accessories | "& Parts" → parça dalı |
| `baby` | `537` | Baby & Toddler | "& Maternity" → Baby & Toddler kökü (maternity giyim ayrıdır) |
| `health` | `491` | Health & Beauty > Health Care | "Wellness" → Health Care |
| `office` | `922` | Office Supplies | "& Industrial" karışık → Office Supplies çekirdeği |
| `art` | `505370` | Arts & Entertainment > Hobbies & Creative Arts > Arts & Crafts | "& Handmade" → Arts & Crafts |

> **Uyarı (implementasyon-zamanı doğrulama):** Yukarıdaki ID'ler Google taksonomisinin uzun süredir kararlı çekirdek düğümleridir, ancak bazıları (`267`, `499713`, `505370`, `5424`, `2882`) build edilen sürüme göre değişebilir. Tablo, kod yazılmadan önce `tree.json`'a karşı **birebir doğrulanmalı**; eksik çıkan her id Açık Karar 5'teki davranışa tabi.

---

## 3. Mapping nerede uygulanır — strateji karşılaştırması

| Strateji | Nasıl | Artı | Eksi |
|---|---|---|---|
| **A. Lazy / read-time (destructive değil)** | KV ham kalır; eski id'ler `getStore` sonrası, render/market index oluşturmadan önce bellekte `OLD_TO_GOOGLE` haritasıyla çevrilir. | Sıfır veri riski, anında rollback (haritayı sil), KV dokunulmaz | Her okumada maliyet (küçük), eski id KV'de sonsuza kadar kalır, D1 market indeksi yine eski id tutar |
| **B. One-time rewrite (destructive)** | Tüm `store:*` anahtarları taranır, manifest içindeki `categories[].id` + `products[].categoryId` Google id'ye yeniden yazılır, `version`++ ve `taxonomyVersion` damgalanır. | KV temizlenir, D1 sync doğru id alır, render kodu hiç eski id görmez | Geri dönüş zor (eski değer kaybolur, yedek gerekir), iOS yeniden publish ederse eski id geri gelir (bkz. Açık Karar 1) |
| **C. Dual-write geçiş** | Önce A (lazy) canlıya alınır; eş zamanlı PUT akışında gelen manifestler kaydedilirken Google id'ye normalize edilir → KV doğal olarak yeni id'ye akar; eski kayıtlar lazy ile çevrilir. | Risk düşük, KV zamanla kendiliğinden temizlenir, rollback A kadar kolay | İki kod yolu (read-map + write-normalize) bir süre birlikte yaşar |

**Öneri:** **C (dual-write geçiş), B'ye doğru evrimleşen.**
1. Önce **lazy map (A)** ile canlıya çık — okuma anında çevir, hiçbir veri silme. #2/#3 render'ı yeni id'lerle çalışır, KV güvende.
2. Aynı sürümde **write-normalize** ekle: `onRequestPut` manifesti kaydetmeden önce eski id'leri Google id'ye normalize etsin (idempotent — zaten Google id ise dokunma). Böylece her yeni publish KV'yi temizler.
3. İsteğe bağlı **opportunistic backfill (B-lite):** lazy okuma sırasında "bu kayıt henüz migre değil" tespit edilirse, render'ı bloklamadan (`waitUntil`) düzeltilmiş manifesti geri yaz. Tam tarama batch'i yerine trafik-güdümlü migrasyon → büyük tek seferlik script riski yok.

`OLD_TO_GOOGLE` haritası tek kaynak: `src/storefront/taxonomy/legacy-map.json` (yeni dosya) — hem read-map hem write-normalize hem iOS bundle aynı dosyayı kullanır.

---

## 4. Unmapped / belirsiz id'ler — fallback (sessiz kayıp YOK)

Çevrilemeyen `categoryId` üç sınıfa ayrılır:
1. **Boş/yok** (`categoryId` undefined) — zaten uncategorized; değişmez.
2. **Serbest id** (`c1`, `c2`, store sahibinin rastgele yazdığı) — `OLD_TO_GOOGLE`'da yok.
3. **Eski taksonomi id'si ama haritada eksik** (gelecekte eski taxonomy'ye düğüm eklenirse).

**Fallback davranışı:**
- Maplenmeyen id → özel sabit **`uncategorized`** sentinel'e set edilir (yeni Google id değil; render'da "Diğer / Other"). `manifest.ts:138` zaten `!known.has(categoryId)` ile bunu "Diğer"e atıyor — sentinel bu yolu netleştirir.
- **Sessiz kayıp önleme:** her maplenmeyen id, migrasyon raporuna yazılır:
  - Lazy yolda: `console.warn('[taxonomy-migrate] unmapped categoryId', { slug, oldId })` (Cloudflare logs'ta görünür).
  - Backfill yolda: migrasyon kaydı `meta`'ya eklenir → `manifest.meta.taxonomyMigration = { unmapped: ["c1","c2"], migratedAt }`. Böylece hangi store'da ne maplenmediği KV'de denetlenebilir.
- **Serbest id'ler için kurtarma:** `categories[].name.en` (Localized) varsa, ileride yarı-otomatik label-eşleştirme için saklanır; bu spec kapsamında otomatik tahmin **yok** (YAGNI) — sadece raporlanır.

---

## 5. Versiyonlama & idempotency

- `Manifest.meta.taxonomyVersion` zaten var (`types.ts:81`). Migre edilen manifest, #1'in `meta.json`'undaki `taxonomyVersion` değeriyle damgalanır.
- **Migre işareti:** `meta.taxonomyMigration = { fromVersion: 1, toVersion: <#1 version>, migratedAt, unmapped: [] }`. Varlığı = "bu doküman Google id'ye taşındı".
- **Idempotency:** write-normalize ve backfill, bir id'yi çevirmeden önce **zaten Google id mi** kontrol eder (saf sayısal string + `tree.json`'da var). Google id ise dokunmaz. Böylece:
  - Aynı kayıt iki kez işlenirse ikinci kez no-op.
  - Lazy map'te de aynı kontrol: `isGoogleId(id) ? id : (OLD_TO_GOOGLE[id] ?? 'uncategorized')`.
- `StoreRecord.version` yalnızca backfill **gerçekten** bir şey değiştirdiğinde artar (gereksiz versiyon şişmesi yok).

---

## 6. Sıralama — diğer alt-projelere göre ne zaman çalışır

```
#1 veri pipeline (tree/labels/meta)         ✅ committed (feat/taxonomy-pipeline)
        │
        ▼
#2 API endpoint (taxonomy serve)            ── canlı OLMALI ki #3 render edebilsin
        │
        ▼
#3 web render (store/market Google id ile)  ── #5 lazy-map'e BAĞIMLI değil ama birlikte gitmeli
        │
   ┌────┴────┐
   ▼         ▼
#5 lazy-map  #4 iOS picker (yeni publish'ler Google id yazar)
(read-time)
        │
        ▼
#5 write-normalize + opportunistic backfill (KV temizliği, trafik güdümlü)
```

**Öneri:**
- **#5'in lazy-map kısmı, #3 ile AYNI sürümde canlıya çıkmalı.** Sebep: #3 render'ı Google id beklerse ama KV hâlâ eski id tutuyorsa, lazy-map olmadan tüm eski ürünler uncategorized'a düşer. İkisi atomik gitmeli.
- **#5'in write-normalize kısmı #4 ile koordine.** İdeal: #4 (iOS) Google id yazmaya başlamadan önce web write-normalize devrede olsun → karışık dönemde gelen her manifest (eski iOS sürümü hâlâ eski id gönderebilir) KV'de normalize edilir.
- **Backfill (B-lite) en son**, render + write-normalize stabilse açılır; aceleye gerek yok (lazy map zaten doğru render veriyor).

---

## 7. iOS tarafı notu (#4 ile koordinasyon)

- Cihazdaki ürünlerin `categoryId`'si Core Data'da eski id tutuyor olabilir. #4 iOS picker'ı Google id'ye geçtiğinde, **aynı `legacy-map.json`** uygulamaya bundle'lanıp tek seferlik on-device migration (Core Data) ile çevrilmeli — web ile birebir aynı harita, tutarlılık için.
- **Geriye uyumluluk riski:** Eski iOS sürümü (güncellenmemiş kullanıcı) hâlâ eski id ile publish edebilir → bu yüzden web **write-normalize** kalıcı bir savunma katmanı; iOS migrasyonu tamamlandı diye kaldırılmaz.
- Bu spec web/KV'ye odaklanır; iOS Core Data migrasyonu #4'ün detay kapsamındadır, burada yalnızca "aynı harita dosyası" kuralı bağlayıcıdır.

---

## 8. Başarı kriteri

- `legacy-map.json` 31 eski id için geçerli (`tree.json`'da var olan) Google id içerir; maplenemeyen üst/alt düğüm raporlanır, sessizce düşmez.
- Lazy-map devredeyken: eski id'li bir KV store'u render edildiğinde ürünler doğru Google kategorisinde gruplanır; hiçbir ürün beklenmedik şekilde "Diğer"e düşmez (serbest id'ler hariç — onlar bilinçli "Diğer").
- Write-normalize sonrası yeni PUT edilen manifest KV'de Google id ile yazılır; aynı manifesti iki kez PUT etmek idempotenttir.
- Backfill çalıştırıldığında: yalnızca migre olmamış kayıtlar değişir, `taxonomyMigration` damgası eklenir, ikinci çalıştırma no-op.

---

## Açık Kararlar (Open Decisions)

**OD-1 — Lazy-map mı, one-time rewrite mı, dual-write mı?**
Seçenekler: (A) sadece read-time lazy, (B) tek seferlik destructive rewrite, (C) lazy + write-normalize + opportunistic backfill.
→ **Öneri: C.** Lazy ile sıfır-risk başla; write-normalize ile KV doğal akışla temizlensin; backfill'i opsiyonel/trafik-güdümlü tut. B'nin tek-script riski ve A'nın "KV sonsuza kadar kirli" dezavantajını birlikte çözer. **Karar gereken:** backfill'i hiç açmayalım mı (sadece A+write-normalize yeterli mi)?

**OD-2 — Çocuk düğümlerde tam Google eşleşmesi yokken ne yapalım?**
`clothing.womens` / `clothing.mens` Google'da ayrı düğüm değil (cinsiyet bir *attribute*). Seçenekler: (a) ebeveyne (`1604` Clothing) çök ve cinsiyeti `attributes.gender`'a taşı; (b) en yakın spesifik alt düğümü tahminle seç; (c) ebeveyne çök, attribute'a dokunma.
→ **Öneri: (a)** — ebeveyne çök + cinsiyet/yaş bilgisini attribute'a taşı (Google'ın kendi modeli bu). **Karar gereken:** attribute taşımayı bu alt-projede mi yapalım yoksa veri kaybı olmadan sadece ebeveyne çöküp attribute'u #4'e mi bırakalım?

**OD-3 — Serbest/keyfi id'ler (`c1`, `c2`, store-sahibi yazımı) nasıl ele alınsın?**
Seçenekler: (a) hepsi `uncategorized` + rapor; (b) `categories[].name.en` üzerinden label-tabanlı best-effort otomatik eşleştirme; (c) store sahibine yeniden kategori seçtir (manuel).
→ **Öneri: (a)** bu sürümde — otomatik tahmin YAGNI ve hatalı eşleşme riski yüksek; raporla ve "Diğer"de tut. **Karar gereken:** label-eşleştirme (b) sonraki iterasyona alınsın mı, yoksa hiç mi?

**OD-4 — `categories[]` dizisini de yeniden mi yazalım, yoksa sadece `products[].categoryId`'yi mi?**
Render iki dizinin id'lerini string-eşitlikle bağlıyor (`manifest.ts:135`); biri değişip diğeri kalırsa her şey uncategorized'a düşer. Seçenekler: (a) ikisini birlikte yeniden yaz; (b) `categories[]`'i tamamen at, kategorileri `tree.json`+`labels`'tan türet (store artık kendi kategori adını taşımaz).
→ **Öneri: (a) atomik birlikte yeniden yaz** (lazy yolda da ikisini birlikte çevir). (b) daha temiz ama store-özel kategori adlarını/sıralamasını kaybeder. **Karar gereken:** store'lar kendi kategori etiketlerini koruyacak mı (a) yoksa kanonik Google label'a mı geçecek (b)?

**OD-5 — Tablodaki bir Google id, build edilen `tree.json`'da bulunmazsa?**
Seçenekler: (a) build-time doğrulama testi → eksikse CI fail (deploy bloklanır); (b) runtime'da eksik id'yi `uncategorized`'a düşür + logla.
→ **Öneri: ikisi de — (a) hard-stop CI testi** (`legacy-map.json`'daki her hedef `tree.json`'da var mı) **+ (b) runtime savunma**. **Karar gereken:** CI testini bu alt-projenin zorunlu çıktısı mı sayalım?

**OD-6 — #5 lazy-map ile #3 render aynı PR/sürümde mi gitsin?**
Seçenekler: (a) atomik tek sürüm (#3+#5-lazy birlikte); (b) önce #5-lazy ayrı (eski id'leri zaten Google'a çevirir, #3 sonra gelir).
→ **Öneri: (a) atomik.** #3 Google id beklerken KV eski id tutarsa lazy-map olmadan tüm geçmiş ürünler "Diğer"e düşer; ikisi ayrılamaz. **Karar gereken:** feature-flag ile #3 render'ı eski+yeni id'yi de aynı anda tolere etsin mi (daha güvenli kademeli açılım)?
