# Taksonomi Veri Pipeline'ı — Tasarım (Alt-proje #1)

**Tarih:** 2026-06-01
**Durum:** Onaylandı (brainstorm), implementasyon planı bekliyor
**Kapsam:** Bu, daha büyük "Google taksonomisine tam migrasyon (web + iOS)" işinin **ilk** alt-projesidir. Sadece veri pipeline'ı; API (#2), web render (#3), iOS picker (#4) ve veri migrasyonu (#5) ayrı spec'ler.

## Amaç

photoZseo store & market alanlarındaki elle yazılmış ~31 düğümlü taksonomiyi (`src/storefront/taxonomy.json`), Google Product Taxonomy'ye dayalı tam (~6.6k düğüm) bir kanonik veri setiyle değiştirmek. Bu alt-proje yalnızca **kanonik veriyi üretir**; tüketim sonraki alt-projelerde.

## Master kaynak kararı

- **Google Product Taxonomy** (master). Sebep: sayısal ID zaten Google Shopping + Meta Catalog export'unun dili; sade, parse'ı kolay, KV+API'ye temiz oturur; ücretsiz/atıfsız gömülebilir.
- Shopify taksonomisi ve attribute/mapping katmanı **kapsam dışı** (gerekirse sonraki faz — YAGNI).

## Doğrulanmış kaynak gerçekleri

- İndirme: `https://www.google.com/basepages/producttype/taxonomy-with-ids.{locale}.txt`
- Satır formatı: `ID - A > B > C` — ID-yol ayıracı ` - `, seviye ayıracı ` > `, satır başına bir giriş.
- Versiyon başlığı (ilk satır): `#google_product_taxonomy_version: YYYY-MM-DD`
- ~6.600 kategori, derinlik 7 seviyeye kadar (çoğu 2-5).
- **Sayısal ID kararlı**, text path değişebilir → ID kanonik anahtar.
- Lisans: ücretsiz, atıf gerekmez, uygulamaya gömülebilir.
- **Eksik diller:** Google `ar`, `fa`, `hi`, `ur` taksonomi dosyalarını yayınlamıyor (build anında `zh-CN`/`zh-TW`/`ko` varlığı da doğrulanacak). Eksik diller bizde çevrilir.

## Mimari

Website repo'sunda tek bir build script: `scripts/build-taxonomy.mjs`.
- Manuel / çeyreklik çalışır (her deploy'da DEĞİL).
- Delta-aware: yalnızca yeni/değişen yaprakları çevirir.

### Akış
1. **İndir:** Bizim 12 dille örtüşen, Google'da mevcut locale dosyalarını indir (en, de, es, pt-BR, ja, ko, zh-CN, zh-TW, tr — varlık build anında kontrol edilir). en-US her zaman indirilir (kanonik yapı + fallback).
2. **Parse:** `ID - path` satırlarını ayrıştır; her düğüm için `{id, parentId, depth}` türet. parentId = aynı yolun bir kısa hâlinin ID'si (yol→id haritasından çözülür). Versiyon başlığını oku.
3. **Hazır diller:** Google'da mevcut her dil için label = o dosyadaki yaprak metni (son ` > ` parçası). Çeviri maliyeti yok.
4. **Eksik diller:** EN yaprak label'larını `{id: en_label}` map'i olarak mevcut **translation-swarm** aracına `--once` batch modunda ver → `{id: çeviri}` al. Yalnızca ar/fa/hi/ur (+ Google'da olmayan diğerleri).
5. **Yaz:** Kanonik çıktıyı üret (aşağıdaki şekil).

### translation-swarm'a ilave
Mevcut araca küçük bir batch-map modu: girdi `{id: en_label}`, çıktı `{id: çeviri}`. Yeni çeviri motoru yazılmaz; var olan `--once` akışına I/O formatı eklenir.

## Kanonik çıktı şekli

`src/storefront/taxonomy/` altında ayrık dosyalar:

```
tree.json          [{ id, parentId, depth }]          # dil-bağımsız yapı (~6.6k)
labels.<lang>.json { "<id>": "<yaprak label>" }       # dil başına bir dosya (12 dil)
meta.json          { googleVersion, taxonomyVersion, generatedAt }
```

- **Neden ayrık:** web ağaç + yalnızca kullanıcının dilini çeker (küçük transfer); iOS hepsini bundle'lar (offline). Versiyonlaması temiz.
- `labels.*` yalnızca yaprak metni tutar; tam yol istemcide `tree` + parentId zinciriyle kurulur (tekrar veri yok).

## Versiyonlama

- Google `#...version: 2025-06-19` → bizim integer `taxonomyVersion` (her ingest'te artar), `meta.json`'a yazılır.
- Mevcut `StorefrontDocument.taxonomyVersion` alanıyla uyumlu.
- ID kararlı olduğundan versiyon atlamaları referansları nadiren bozar (#5 migrasyonunu kolaylaştırır).

## Token / maliyet kısıtı

- Build seyrek çalışır (çeyreklik).
- Çeviri yalnızca eksik diller + yalnızca delta yapraklar → ilk üretimden sonra ~sıfır token.
- `id + en-label hash` cache'i ile değişmeyen yaprak tekrar çevrilmez.

## Bu alt-projenin sınırları (kapsam dışı)

- API endpoint'leri (#2)
- Web store/market render adaptasyonu (#3)
- iOS kategori picker (#4)
- Eski `categoryId` → Google ID veri migrasyonu (#5)
- Shopify attribute/mapping katmanı (gerekirse gelecek faz)

## Başarı kriteri

- `npm run build:taxonomy` çalıştırıldığında `src/storefront/taxonomy/` altında geçerli `tree.json`, 12 `labels.<lang>.json` ve `meta.json` üretilir.
- `tree.json` Google'ın güncel sürümüyle aynı düğüm sayısına sahip; her düğümün geçerli bir `parentId` (kök hariç) ve `depth` değeri var.
- Her dil dosyası `tree.json`'daki tüm ID'leri kapsar (eksik dil için bile, fallback EN değil çeviri).
- Tekrar çalıştırmada değişmeyen yapraklar için çeviri çağrısı yapılmaz (delta doğrulaması).
