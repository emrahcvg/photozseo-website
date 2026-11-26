---
title: "Shopify CSV yüklemesi ve doğrudan API karşılaştırması: aslında 2026'da bağımsız satıcılar için ölçekleniyor"
description: "CSV aracılığıyla Shopify ürünlerinin içe aktarımının Admin API ile karşılaştırmalı olarak 2026'da pratik bir dökümü: oran sınırları, hata kurtarma, denetim takibi ve her yolun ne zaman kazandığı."
pubDate: 2026-05-12
readingMinutes: 9
tags: [shopify, csv, api, product-import, e-commerce]
tldr:
  - "Shopify, 2026'da ürün yüklemek için iki yol sunar: yerleşik CSV içe aktarma (yönetici kullanıcı arayüzü, kimlik doğrulama yok) ve Admin GraphQL/REST API (uygulama jetonu gerektirir, hız sınırlı)."
  - "CSV, 500'ün altında SKU'ya ve toplu iş akışına sahip bağımsız satıcılar için basitlik, denetim takibi ve geri döndürülebilirlik açısından avantajlıdır. Gerçek zamanlı envanteri ve 10.000'den fazla SKU'su olan kuruluşlar için API, hız ve otomasyon açısından avantajlıdır."
  - "Modern ürün araçları (photoZseo dahil), satıcının manuel olarak yüklediği Shopify'a hazır CSV, XLSX veya DOCX dosyalarını dışa aktarır; doğrudan Shopify Yönetici API'sine bağlanmazlar, bu da iş akışını denetlenebilir tutar ve kimlik bilgilerinin işlenmesini önler."
faqs:
  - q: "2026'da Shopify CSV ile Admin API arasındaki gerçek fark nedir?"
    a: "CSV, Shopify'ın yönetici arayüzünde Ürünler → İçe Aktarma bölümünde yüklediğiniz bir dosyadır. Manueldir, ücretsizdir, belirteç gerektirmez ve Shopify, değişiklikleri bir arka plan işinde doğrulayıp uygular. Admin API (GraphQL veya REST), onu çağırmak için bir uygulama, erişim belirteci ve kod gerektiren programlı bir arayüzdür. CSV, parti başına birkaç yüz ürüne ölçeklenir; API milyonlara ölçeklenir ancak oran sınırı bütçenizi tüketir."
  - q: "Shopify'ın 2026'daki API oranı sınırı nedir?"
    a: "GraphQL Admin API, maliyete dayalı bir kısıtlama kullanır: standart mağazalar için 50 maliyet puanı/saniye, Shopify Plus için 100 maliyet puanı. REST Admin API, paket patlamalarıyla birlikte standart için 2 çağrı/saniye, Plus için 4/saniyedir. REST aracılığıyla toplu içe aktarma işlemi genellikle 5.000 ürünlük çalıştırma sınırına ulaşır ve geri alma işlemi gerektirir."
  - q: "Shopify CSV içe aktarma işlemini geri alabilir miyim?"
    a: "Kısmen. Shopify, içe aktarılan ürünlerin kaydını tutar ancak tek tıklamayla geri alma olanağı sağlamaz. Pratik geri dönüş, bir CSV'yi orijinal değerlerle yeniden içe aktarmak veya içe aktarılan ürünleri silmektir. CSV dosyasının kendisi denetim takibidir; her sürümü saklayın."
  - q: "Neden tüm ürün araçları doğrudan Shopify API'sine bağlanmıyor?"
    a: "Üç neden: belirteç güvenliği (bağlı her uygulama bir saldırı yüzeyidir), oran sınırı sahipliği (satıcının API bütçesi doğrudan kontrolü olmadan tüketilir) ve geri alınabilirlik (otomatik bir gönderimin geri alınması CSV dosyasından daha zordur). Manuel yükleme için CSV/XLSX/DOCX dosyalarını dışa aktaran araçlar kontrolün satıcıda olmasını sağlar."
  - q: "2026'da Shopify CSV sütun sayısı nedir?"
    a: "Mayıs 2026 itibarıyla standart ürün CSV'sinde 53 sütun bulunmaktadır. Bunlardan 7'si gereklidir (Tanıtıcı, Başlık, Gövde HTML'si, Satıcı, Ürün Kategorisi, Tür, Etiketler), 12'si yaygın olarak kullanılır (varyant SKU'su, fiyat, ağırlık, envanter takibi, resim, alt metin vb.) ve geri kalanı isteğe bağlı/meta alana özeldir."
---

2026'da 500 ürünü Shopify'a aktarmanın iki yolu vardır: yönetici kullanıcı arayüzü aracılığıyla bir CSV yüklemek veya Yönetici GraphQL/REST uç noktası aracılığıyla 500 API çağrısı göndermek. İkisi de çalışıyor. Farklı ölçeklenirler, farklı şekilde başarısız olurlar ve çok farklı satıcılara uyarlar.

Bu parça her iki yolu da parçalara ayırıyor, bir karşılaştırma tablosu oluşturuyor, Shopify CSV sütun referansını gözden geçiriyor ve photoZseo dahil çoğu ürün aracının neden doğrudan API entegrasyonu yerine dosya dışa aktarmayı seçtiğini açıklıyor.

## Shopify'a giden iki yol

| Yol | Bu ne | Yetki | Hız | Oran sınırı |
|------|-----------|------|-------|------------|
| CSV'yi içe aktarma | Shopify yöneticisi aracılığıyla dosya yükleme → Ürünler → İçe Aktarma | Yok (oturum açmış yönetici) | ~500 ürün / 5 dakika | Yok — Shopify kuyrukları |
| REST Yönetici API'si | Ürün veya kaynak başına HTTP POST | Özel/özel uygulama aracılığıyla jetona erişim | ~2 ürün/saniye | 2 çağrı/sn standart, 4 Plus |
| GraphQL Yönetici API'si | Tek uç nokta, toplu mutasyonlar | Erişim jetonu | Toplu işlemlerde ~5–10 ürün/saniye | 50 puan/sn standart, 100 Plus |
| Toplu İşlemler API'si | Büyük işler için Async GraphQL toplu | Erişim belirteci + yoklama | Zaman uyumsuz, tamamlanmasına saatler kaldı | Tek bir işlem olarak sayılır |

Başlık: Hız sınırları devreye girdiğinde CSV insanların düşündüğünden daha hızlı, API ise insanların düşündüğünden daha yavaştır.

## Maliyet karşılaştırması

| Faktör | CSV yükleme | Yönetici API'sı |
|--------|-----------|-----------|
| Kurulum süresi | 0 dakika — Shopify'da yerleşik | Bir uygulamayı kaydetmek, jeton oluşturmak, istemciye yazmak 1-4 saat |
| İthalat başına maliyet | Özgür | Ücretsiz (ücret limitleri dahilinde) |
| Hız (100 SKU) | 1–2 dakika yükleme + 2–5 dakika işleme | 1-2 dakikalık API + devam eden hız sınırı gerilemesi |
| Hız (10.000 SKU) | 10 dakika yükleme + 30–60 dakika işleme | Hız sınırına bağlı olarak 30 dakika ila 4 saat |
| Hata kurtarma | Shopify, başarısız satırları içeren ayrıntılı bir CSV döndürür | API, çağrı başına hatalar döndürüyor; kodunuzun toplanıp yeniden denenmesi gerekiyor |
| Denetim izi | CSV dosyasının kendisi kayıttır | Geliştiricinin uygulaması gereken özel bir günlük dosyası |
| Geri alınabilirlik | Önceki bir CSV'yi yeniden yükleyin | Kaynak başına özel geri alma mantığı |
| Kimlik doğrulama riski | Yok — sızdırılacak jeton yok | Tokenlar saklanmalı, döndürülmeli ve denetlenmelidir |
| Beceri gerekli | Elektronik tablo becerileri | Yazılım mühendisliği |
| Başarısızlığın maliyeti | Kötü bir CSV, toplu olarak silebileceğiniz 500 ürün ekler | Kötü bir API döngüsü hız sınırına ulaşabilir ve çalışmanın ortasında başarısız olabilir |

Shopify mağazası, ürün fotoğraflarıyla dolu bir iPhone ve piyasaya sürülecek 200 SKU'su olan bağımsız bir satıcı için CSV yolu daha hızlı, daha ucuz, daha güvenli ve daha geri döndürülebilirdir.

## CSV kazandığında

- 1.000'den az ürününüz var. CSV bu toplu iş boyutunu temiz bir şekilde işler.
- Sürekli envanter senkronizasyonu değil, periyodik lansmanlar gerçekleştirirsiniz. Üç aylık katalog yenilemeleri CSV şeklindedir.
- Kod yazmadan bir denetim izi istiyorsunuz. Her CSV yüklemesi, Dropbox/iCloud/Google Drive'da saklayabileceğiniz bir dosyadır.
- API belirteçlerini yönetmek istemezsiniz. Yüklenecek uygulama yok, döndürülecek jeton yok.
- Değişiklikler yayınlanmadan önce önizlemek istiyorsunuz. "Ürünleri tüm satış kanallarına yayınla" seçeneğinin işaretini kaldırırsanız Shopify'ın CSV içe aktarımı, değişiklik uygulanmadan önce etkilenen ürünleri gösterir.
- Birden fazla mağazada faaliyet gösteriyorsunuz. Aynı CSV, tüm Shopify mağazalarında çalışır. Aynı API istemcisinin mağaza başına bir jetona ihtiyacı vardır.

## API kazandığında

- 10.000'den fazla ürününüz var ve her gece yayınlanıyorsunuz.
- Bir depo sisteminden veya ERP'den gerçek zamanlı envanter güncellemelerine ihtiyacınız var.
- Verilerin gidiş-dönüş olması gereken özel bir POS'u, bir 3PL'yi veya bir ERP'yi bağlarsınız.
- Entegrasyonu sürdürmek için mühendislik kaynaklarınız var.
- B2B'de dakikadan kısa sürede yayılmayı gerektiren sık fiyat değişiklikleriyle çalışıyorsunuz.

2026'daki çoğu bağımsız satıcı için dönüm noktası, haftalık ciroyla birlikte 2.000-3.000 SKU civarındadır. Bunun altında CSV. Bunun üzerinde API veya Make, Zapier, Shopify Flow veya n8n gibi yönetilen bir iPaaS bulunur.

## Shopify CSV sütun referansı

2026 CSV, 53 sütunla birlikte gelir. Yüksek etkili alt küme:

| Kolon | Gerekli | Notlar |
|--------|----------|-------|
| Halletmek | Evet | URL sorunu. Deterministik veri tekilleştirme anahtarı — aynı tanıtıcı = aynı ürün. |
| Başlık | Evet | Ürün başlığı, düz metin. |
| Gövde (HTML) | Tavsiye edilen | Tam açıklama, HTML'ye izin verilir. |
| Satıcı | Evet | Marka veya üretici. |
| Ürün Kategorisi | Evet | Shopify'ın standart sınıflandırmasıyla eşleşir. |
| Etiketler | Tavsiye edilen | Virgülle ayrılmış, koleksiyonları ve filtreleri yönlendirir. |
| Yayınlandı | Evet | Vitrin görünürlüğü için DOĞRU/YANLIŞ. |
| Varyant SKU / Gram / Fiyat / Barkod | Tavsiye edilen | Varyant başına envanter ve tanımlayıcı alanları. |
| Resim Kaynağı | Evet | Ürün görselinin genel URL'si. |
| Resim Alternatif Metni | Kesinlikle tavsiye edilir | Görsel Arama ve AI Genel Bakışları için SEO alanı. |
| SEO Başlığı / SEO Açıklaması | İsteğe bağlı | Sayfa başlığı ve meta açıklaması geçersiz kılınır. |
| Durum | Evet | "aktif", "taslak" veya "arşivlenmiş". |

Geriye kalan 30'dan fazla sütun meta alanlar, Google Alışveriş alanları ve vergi bölgesi sütunlarıdır; bağımsız satıcılar, uluslararası alanda genişleyene kadar bunları göz ardı edebilir.

## CSV içindeki görsel SEO

Fotoğraflarınızın sıralanıp sıralanmayacağını belirleyen iki sütun Image Src ve Image Alt Text'tir.

- Image Src genel bir URL olmalıdır. Shopify CSV'yi aldığında görselin erişilebilir olması gerekir. Dosya özel bir CDN'nin veya jeton korumalı bir grubun arkasındaysa içe aktarma işlemi sessizce başarısız olur.
- Görsel Alt Metni, Google Görsel Arama, Pinterest ve AI Genel Bakış alıntılarının okunduğu alandır. 100 karakterin altında tutun. Markayla değil ürünle yola çıkın.

Yaygın bir bağımsız satıcı hatası: Image Src sütunu dolu ancak Image Alt Text sütunu boş olarak CSV yoluyla 200 ürün yüklemek. Shopify fotoğrafları memnuniyetle içe aktarır. Mağaza, görsel SEO yüzeyinin tamamını kaybeder.

## photoZseo'nin yaklaşımı

photoZseo, Shopify'a hazır dosyaları üç formatta dışa aktarır:

1. CSV — 53 sütunlu standart Shopify ürün içe aktarma biçimi. Satıcı bunu Shopify Yöneticisi → Ürünler → İçe Aktarma'ya bırakır.
2. XLSX (Excel) — yüklemeden önce e-tablolarda düzenleme yapan satıcılar için, satırın görsel olarak önizlenmesi için gömülü görsel küçük resimleriyle.
3. DOCX — dokümantasyon, tedarikçi teklifleri veya kataloğun yazdırılması için.

Araç doğrudan Shopify Yönetici API'sine bağlanmaz. "Shopify'a Bağlan" düğmesi yok, token depolama yok, gerçek zamanlı gönderim yok. Satıcı gelişmelerden haberdar kalır: CSV'yi Excel/Numaralar'da inceler, Shopify yöneticisi aracılığıyla yükler ve dosyayı bir denetim izi olarak tutar.

Bu bir tasarım seçimidir. Özellik bayrağı `shopifyAPIEnabled`, 2026 sürümünde `false` olarak gönderilir. Gerekçe:

- Satıcı, hangi değişiklikler üzerinde tam kontrole sahiptir. Hiçbir otomatik iş hatalı biçimlendirilmiş bir partiyi zorlamaz.
- Denetim izi dosyadır. Her içe aktarma, satıcının yeniden yükleyebileceği, arşivleyebileceği veya geri alabileceği bir CSV'dir.
- Belirteç saldırı yüzeyi yok. Uygulama hiçbir zaman Shopify kimlik bilgilerini tutmaz.
- Platformlar arası tutarlılık. Shopify'a aynı CSV yüklenir, aynı XLSX Amazon ve Etsy'yi besler, aynı DOCX bir kataloğa yazdırılır. Bir iş akışı, on hedef.

Sürekli API senkronizasyonu isteyen satıcılar için (örneğin, 3PL'ye sahip bir Shopify Plus operatörü) özel bir ara katman yazılımı (Shopify Flow, Make, n8n) doğru araçtır. Lansman çeyreği ve 200 ürünü olan bağımsız bir satıcı için CSV yolu kalıcı yanıttır.

## 5 adımlı Shopify lansman iş akışı

1. Ürün fotoğraflarını iPhone'da çekin. Beyaz arka plan, sRGB, 2000×2000.
2. Ürün başına 13 SEO alanını otomatik olarak doldurun (başlık, bilgi, dosya adı, kategori, meta açıklama, tam açıklama, alternatif metin, dört etiket, anahtar kelimeler, barkod).
3. Shopify CSV'yi, Image Src (CDN'nizde veya Shopify'ın kendi görsel yüklemesinde barındırılan), Image Alt Metni ve SEO Açıklaması dahil olmak üzere, uygun olduğu yerde doldurulmuş 53 sütunun tamamıyla birlikte dışa aktarın.
4. Son bir inceleme için CSV'yi Numbers, Excel veya Google E-Tablolar'da açın.
5. Shopify Yöneticisi → Ürünler → İçe Aktar aracılığıyla yükleme yapın, güncelleme yapıyorsanız "Aynı tanıtıcıya sahip mevcut ürünlerin üzerine yaz" seçeneğini işaretleyin ve gönderin.

Satıcının 200 ürün başına lansman süresi, çok günlük bir süreçten tek bir öğleden sonraya düşüyor.

## Paket servis

2026'da bağımsız bir satıcı için doğru Shopify içe aktarma yolu CSV'dir. İnsanların varsaydığından daha hızlıdır, API'den daha geri döndürülebilirdir ve kayıt olarak saklayabileceğiniz bir dosya üretir. Admin API, geniş ölçekte mühendislik odaklı katalog işlemleri için doğru araçtır; ancak 200 SKU'lu vitrin için CSV daha iyi bir yanıttır.

Bu tercihe saygı duyan ürün araçları, "her şeyi otomatikleştirmeye" çalışan ve sonunda tokenları elinde tutan, oran sınırlarına ulaşan ve envanteri sessizce kıranlardan daha uzun ömürlü olacak.

---

photoZseo, iPhone ve iPad için App Store'dedir.
