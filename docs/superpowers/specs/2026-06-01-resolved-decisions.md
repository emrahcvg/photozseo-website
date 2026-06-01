# Taksonomi Migrasyonu — Çözülen Kararlar (2026-06-01)

Bu dosya #2-#5 alt-projelerinin spec'lerindeki "Açık Kararlar" bölümlerini bağlar. Kullanıcı onayıyla kilitlendi.

## Taban kararlar

- **Veri servis modeli:** Web = build-time **static import** (KV upload değil); iOS = JSON'u app'e **bundle** (offline). Tek kanonik kaynak: #1'in `src/storefront/taxonomy/` çıktısı. Atomik deploy, drift yok.
- **Migrasyon stratejisi (#5):** **Dual-write** — okurken lazy map (non-destructive) + PUT'ta yeni Google id yaz + opsiyonel backfill. Rollback kolay, sessiz kayıp yok.
- **Rollout:** **Atomik** — Web tarafı #3 (render) + #5 (lazy map) aynı sürümde; iOS tarafı #4 birlikte. Feature-flag kademeli değil.
- **Diğer tüm açık kararlar:** İlgili spec'lerin **önerilen default'ları** kabul (aşağıda özet).

## Spec bazında kabul edilen öneriler

### #2 API
- Veri servisi: static import (taban karar).
- `node/:id` endpoint'i: **var** (deep-link/ürün sayfası breadcrumb için).
- Arama: **Orama** (zaten bağımlı, marketplace deseni hazır), per-lang lazy modül-global indeks.
- Cache: **ETag + `?v=` busting**, `immutable`.
- Erişim: **public**, edge-cache'li salt-okunur; abuse görülürse WAF.
- Endpoint seti: meta / tree / labels/:lang / node/:id / search.

### #3 Web render
- Market browse derinliği: **L1+L2 drill** + derinlik için Orama arama.
- Eski→yeni köprü: #5 lazy map ile **atomik** (taban karar).
- Orama: kategori adını **tek indekse göm**.
- Sitemap: **ürünlü L1** kategori URL'leri.
- Store breadcrumb: **store `#cat-<id>` anchor** linkli.
- Market kategori URL: **numeric id** (`/market/c/<id>`) (v1).
- Paylaşılan saf-TS `taxonomyService`; market'in mevcut "ham id'yi label'sız gösterme" bug'ı düzelir.

### #4 iOS picker
- Mevcut `TaxonomyStore` public API'si **korunur**; arkasındaki veri kaynağı #1 formatına döner.
- Dağıtım: **hibrit altyapı kurulur, v1'de FeatureFlag kapalı → bundle-only ship**.
- Bundle formatı: #1'in ham 3-dosya ailesi (web ile kanonik paylaşım, lazy dil).
- Dil: **12 dili bundle'la**, runtime'da sadece aktif+en yükle.
- Picker: mevcut drill-down + arama (arama belirginleştirilir).
- Core Data: `categoryId` zaten optional String → **şema migrasyonu yok**; sadece içerik string-id → numeric-id.
- Eski→numeric eşleme: küçük `legacyMap.json` iOS'ta da bulunur (#5 ile ortak).
- Zamanlama: #4 + Core Data içerik değişimi **birlikte** ship.

### #5 Migrasyon
- Strateji: **dual-write** (taban karar) + tek `legacy-map.json` (web + iOS ortak).
- `categories[]` + `products[].categoryId` **birlikte** çevrilir (manifest invariant'ı gereği).
- Google'da düğümü olmayan çocuklar (womens/mens): **ebeveyne çök** + gender attribute (attribute taşıma sonraki iterasyon).
- Serbest id'ler (`c1`, `c2`): hepsi **`uncategorized` sentinel** + rapora yaz (sessiz kayıp yok).
- Idempotency: her yolda "zaten Google id mi" kontrolü.
- Mapping tablosu id'leri **`tree.json`'a karşı doğrulanır** (CI hard-stop) — #1 build tamamlanınca.

## Bağımlılık & sıra
1. #1 Veri (devam ediyor — throttled çeviri).
2. #2 API (kontratı #3/#4'ü açar).
3. #3 Web (#5 lazy ile atomik) ‖ #4 iOS (bağımsız repo).
4. #5 migrasyon mantığı #3 ile birlikte web'de; iOS legacyMap #4 ile.
