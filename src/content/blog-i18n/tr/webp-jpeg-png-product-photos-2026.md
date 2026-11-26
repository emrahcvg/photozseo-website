---
title: "Ürün fotoğrafları için WebP, JPEG ve PNG: 2026 karşılaştırması"
description: "Ürün fotoğrafçılığı için 2026 WebP, JPEG ve PNG karşılaştırması — dosya boyutu, görsel kalite, pazar desteği ve platform başına doğru format."
pubDate: 2026-05-12
readingMinutes: 8
tags: [webp, jpeg, png, image-formats, product-photos, performance]
tldr:
  - "WebP, JPEG ile aynı görsel kaliteyi yaklaşık %30 daha küçük dosya boyutunda sunuyor ve artık tüm modern tarayıcılarda, iOS Safari ve Android Chrome'da gönderiliyor - 2026'da artık 'aşamalı bir geliştirme' değil, varsayılandır."
  - "JPEG, pazarın katı bir şekilde uyguladığı yerlerde hala kazanıyor (Amazon, eBay, Etsy ana görseli). PNG yalnızca şeffaf arka planlar ve piksel mükemmelliğindeki logolar için kazanır."
  - "2026'nın en iyi uygulaması, üç formatın tamamını tek bir kaynaktan paralel olarak yazmak ve yükleme hedefini seçmeye izin vermektir; bu, otomatik araçların fotoğraf başına bir saniyeden kısa sürede tamamladığı bir iş akışıdır."
faqs:
  - q: "WebP, PNG gibi şeffaflığı destekliyor mu?"
    a: "Evet. WebP, hem kayıpsız hem de kayıplı modları ve şeffaflık için bir alfa kanalını destekler. Şeffaf bir WebP genellikle eşdeğer şeffaf PNG'den %25-35 daha küçüktür."
  - q: "WebP 2026'da tüm tarayıcılarda ve cihazlarda destekleniyor mu?"
    a: "Evet. WebP yıllardır Chrome, Firefox, Edge ve Opera'da desteklenmektedir. Safari, iOS 14 (2020) ve macOS Big Sur'a WebP'yi ekledi. 2026 itibarıyla küresel WebP desteği %97,4'tür (caniuse.com verileri, Mayıs 2026). Son anlamlı gecikme (eski Internet Explorer) trafiğin %0,1'inin altında."
  - q: "Pazaryerleri 2026'da WebP yüklemelerini kabul ediyor mu?"
    a: "Shopify, BigCommerce, WooCommerce, Wix ve Squarespace, WebP'yi yerel olarak kabul eder. Amazon, eBay ve Etsy ana ürün görseli için hâlâ JPEG'i öneriyor; yüklediğiniz her şeyi yine de yeniden kodluyorlar. En güvenli yöntem, JPEG'i katı pazarlara ve WebP'yi kendi vitrininize yüklemektir."
  - q: "WebP ürünü için hangi kalite ayarını kullanmalıyım?"
    a: "Kalite 80-85, ürün fotoğrafçılığı için en uygun noktadır. 75'in altındaki değerler, parlak veya metalik yüzeylerde gözle görülür renk şeritlerine neden olur. 90'dan yüksek değer algılanan kaliteyi artırır ve yalnızca dosyayı büyütür."
  - q: "HEIC neden bu listede yok?"
    a: "HEIC, hiçbir büyük pazarın kabul etmediği, Apple'ın tercih ettiği bir kapsayıcıdır. HEIC dosyalarını yükleyen satıcılar neredeyse her zaman reddedilir veya sunucuda otomatik olarak dönüştürülür ve çoğu zaman kalite kaybı olur. Profesyonel işlem hattı JPEG, PNG veya WebP yazar ve hiçbir zaman HEIC gidenini göndermez."
---

Format sorusu eskiden basitti: fotoğraf, JPEG'i dışa aktar, yükle. 2026'da soru artık "JPEG veya PNG" değil, "tek bir fotoğraftan kaç format göndermem gerekiyor ve hangi hedef hangisini istiyor?" sorusudur.

Bu kıyaslama, ölçülen rakamlarla, pazar tablolarıyla ve bağımsız satıcılara yönelik bir iş akışıyla buna yanıt veriyor.

## 2026'da neler değişti

Üç vardiya birleşti.

1. Safari WebP desteği evrenseldir. iOS 14, 2020'de WebP'yi ekledi. Mayıs 2026 itibarıyla küresel taramanın %97,4'ü WebP'yi destekliyor. Geri dönüş durumu istatistiksel olarak ihmal edilebilir.
2. Pazar yerinin benimsenmesi iki kampa bölündü. Shopify, WooCommerce, BigCommerce, Wix ve Squarespace, WebP'yi doğrudan tarayıcıya sunar. Amazon, eBay, Etsy ve Walmart zaten her yüklemeyi kendi JPEG'lerine yeniden kodluyor, bu nedenle kaynak formatı onlar için pek önemli değil - ancak yine de "JPEG tarafından önerilen" kılavuzu yayınlıyorlar.
3. CDN ekonomisi WebP'yi ödüllendirdi. Cloudflare, Fastly ve Bunny CDN, bir ürün sayfası JPEG yerine WebP sunduğunda çıkış bant genişliğinin %28-34 daha düşük olduğunu bildiriyor. Ayda 1 milyon sayfa görüntülemesi yapan bir mağaza için bu ölçülebilir bir satır öğesidir.

Bu nedenle 2026 varsayılanı şu şekildedir: Pazar yerleri için JPEG, kendi vitrininiz için WebP, yalnızca şeffaflığa ihtiyaç duyduğunuzda PNG yazın.

## Yan yana kıyaslama

Tek bir kaynaktan (beyaz zemin üzerindeki ceviz kesme tahtasının 4032×3024 iPhone fotoğrafı) aynı görsel kalite hedefiyle dışa aktarıldı.

| Biçim | Kalite | Dosya boyutu | SSIM (algılanan kalite ve kaynak) | İlk yükleme süresi (4G) | Notlar |
|--------|---------|----------|-----------------------------------|----------------------|-------|
| JPEG | 85 | 412 KB | 0.984 | 412 ms | Referans temel çizgisi |
| JPEG | 75 | 264 KB | 0.971 | 264 ms | Parlak kenarda görünür renkli şeritler |
| WebP | 85 | 287 KB | 0.985 | 287 ms | ~%30 JPEG q85'ten daha küçük, aynı SSIM |
| WebP | 75 | 184 KB | 0.973 | 184 ms | JPEG q75'ten daha küçük, daha iyi SSIM |
| PNG | (kayıpsız) | 1,84 MB | 1.000 | 1840 ms | Kayıpsız ancak JPEG maliyetinin 4,5 katı |
| PNG-8 (256 renk) | (palet) | 412 KB | 0.812 | 412 ms | Ciddi şeritlenme, ürün fotoğrafları için uygun değil |

Sonuç: Aynı algılanan kalitede WebP, JPEG'den %30 daha küçüktür. PNG yalnızca şeffaflık veya mükemmel piksel grafikleri (logolar, arka plan kesilmiş paket görüntüleri, ürün kaplamaları) gerektiğinde doğru yanıttır.

## Pazaryeri uyumluluk matrisi

| platformu | JPEG | PNG | WebP | Tavsiye edilen |
|----------|------|-----|------|-------------|
| Amazon | Evet | Evet | Hayır (yeniden kodlandı) | JPEG |
| eBay | Evet | Evet | HAYIR | JPEG |
| Etsy | Evet | Evet | HAYIR | JPEG |
| Walmart Pazaryeri | Evet | Evet | HAYIR | JPEG |
| Shopify | Evet | Evet | Evet | WebP (mağaza), JPEG (CSV içe aktarma) |
| WooCommerce | Evet | Evet | Evet | WebP |
| Büyük Ticaret | Evet | Evet | Evet | WebP |
| Wix | Evet | Evet | Evet | WebP |
| Kare alanı | Evet | Evet | Evet | WebP |
| TikTok Mağazası | Evet | Evet | Evet | JPEG (çoğu şablon) |
| Instagram'da Alışveriş | Evet | Evet | HAYIR | JPEG |
| Temu / SHEIN | Evet | HAYIR | HAYIR | JPEG |
| DHgate / Çin Malı | Evet | Evet | HAYIR | JPEG |
| Trendyol / Hepsiburada | Evet | Evet | HAYIR | JPEG |
| Pinterest'te Alışveriş | Evet | Evet | Evet | JPEG |

Model tutarlıdır: Yeniden kodlayan pazarlar JPEG girişlerini tercih eder; WebP çıktılarıyla kendi vitrininiz kazanır.

## Hangisi ne zaman kullanılmalı

Basit bir karar ağacı:

- Bir pazaryerine mi yüklüyorsunuz? → JPEG'i seçin.
- Kendi Shopify, WooCommerce veya BigCommerce mağazanızda mı barındırıyorsunuz? → Vitrin için WebP, CSV içe aktarımında yedek olarak JPEG.
- Şeffaflığa mı ihtiyacınız var (kesilmiş ürün, kaplama grafiği, alfa içeren ambalaj fotoğrafı)? → PNG, vitrininiz destekliyorsa ikincil olarak WebP ile.
- Bir matbaaya, üreticiye veya tasarımcıya mı gönderiyorsunuz? → PNG veya TIFF, asla WebP.
- Sosyal medyada mı paylaşım yapıyorsunuz (Instagram, TikTok, Pinterest)? → JPEG'i seçin. Sosyal yükleyiciler diğer her şeyi ortadan kaldırıyor.

Satıcıların giden gönderileri göndermemesi gereken iki format var: HEIC (yalnızca Apple, pazar yeri ile uyumlu değil) ve AVIF (WebP'den daha iyi sıkıştırma ancak eski Safari'de hala tutarsız ve Mayıs 2026 itibarıyla neredeyse hiçbir pazar yeri bunu kabul etmiyor).

## photoZseo üçünü de paralel olarak nasıl yazıyor?

2026'da tek bir kaynaktan üç dosya yazmak tek bir dokunuşla mümkün olacak.

photoZseo'nin görüntü hattı Core Image, vImage ve CGImageDestination üzerine kurulmuştur. Satıcı Dışa Aktar'a bastığında:

1. Ana kod çözme — kaynak fotoğrafın kodu 16 bitlik doğrusal renk arabelleğine dönüştürülür.
2. Renk yönetimi — arabellek sRGB'ye (evrensel ürün fotoğrafı renk alanı) dönüştürülür.
3. Yeniden Boyutlandır — Lanczos-3 yeniden örneklemesi, platformun gerekli boyutunu üretir.
4. Paralel olarak kodlayın — üç yazma işlemi aynı anda gerçekleşir:
   - JPEG, kalite 85, sRGB, EXIF ​​korunmuş (GPS çıkarılmış), Sanatçı ve Yazılım etiketleri yazılı.
   - WebP, kalite 85, sRGB, EXIF, CGImageDestination + UTType.webP aracılığıyla korunur.
   - Kaynağın şeffaflığı varsa PNG, sRGB, alfa korunur.
5. Dosya adı — her dosya, biçim sonekiyle aynı URL güvenli, açıklayıcı adı alır.

WebP yazma işlemi yereldir; üçüncü taraf bir libwebp sarmalayıcısı değil, iOS 14'ün CGImageDestination WebP desteği üzerine kurulmuştur. Bu önemlidir çünkü yerel yol, çoğu libwebp sarmalayıcının sessizce bıraktığı EXIF ​​meta verilerini (Başlık, Açıklama, Sanatçı, Telif Hakkı) korur.

iPhone 15 Pro'de fotoğraf başına toplam süre: üç formatın tümü için 1 saniyenin altında.

## Kalite ayarlarıyla ilgili bir not

Kalite düğmesi tek bir sayıdan daha ayrıntılıdır.

- q70: pürüzsüz yüzeylerde görünür eserler. Küçük resimler için kabul edilebilir, kahraman görselleri için kabul edilemez.
- q75: kayıplı formatlardaki kahraman görselleri için kabul edilebilir, ancak parlak ürünlerde (mücevher, metalik ambalaj, cam) bantlanma görülür.
- q80–85: ürün fotoğrafçılığı için en uygun nokta. SSIM kaynağa göre 0,98'in üzerinde kalıyor.
- q90+: dosya boyutu, algılanan kalite artışı olmadan hızla büyüyor. Yalnızca arşiv ustaları için kullanışlıdır.
- kayıpsız (PNG / WebP kayıpsız): yalnızca şeffaf grafikler, logolar ve paket görüntüleri için.

Her ihracatta varsayılan olarak "maksimum kaliteyi" kullanan satıcılar, fotoğrafın daha iyi görünmesini sağlamadan depolama alanını boşa harcıyor ve sayfalarını yavaşlatıyor.

## CDN ve vitrin ayarı

Üç dosya mevcut olduğunda vitrinin görevi doğru olanı sunmaktır.

- Shopify, CDN'si aracılığıyla tarayıcıları desteklemek için WebP'yi otomatik olarak seçer. İstek başına WebP ve JPEG ve Shopify seçimlerini yükleyin.
- "WebP Express" eklentisine (veya Bluehost, Kinsta, WP Engine gibi modern barındırma) sahip WooCommerce, `Accept: image/webp` başlığı mevcut olduğunda bir `.webp` aynasından WebP'ye hizmet eder.
- BigCommerce, WebP kod dönüştürmesini anında gerçekleştiren Akamai CDN'sini kullanır.
- Özel Astro / Next.js / Hugo vitrinleri, `<source srcset="...webp" type="image/webp">` ile `<picture>` etiketlerini ve `<img src="...jpg">`'de bir JPEG geri dönüşünü kullanmalıdır.

Geri dönüş zinciri önemlidir çünkü WebP'yi desteklemeyen trafiğin %2,6'sı yine de ürün fotoğrafını görmelidir.

## Pratik bir kontrol listesi

Yüklemeden önce şunları onaylayın:

- [ ] Market yüklemeleri için 2000×2000 boyutunda (veya platformun gerekli boyutunda) bir JPEG kalıbınız var.
- [ ] Kendi vitrininiz için aynı görselin WebP sürümüne sahipsiniz.
- [ ] Yalnızca ürünün şeffaflığa ihtiyacı varsa PNG'niz vardır.
- [ ] Dosya adları açıklayıcıdır — `IMG_4421.jpg` değil, `walnut-cutting-board-12in.jpg`.
- [ ] Renk alanı Adobe RGB veya ProPhoto değil, sRGB'dir.
- [ ] GPS verileri EXIF ​​bloğundan çıkarılır.
- [ ] Kalite JPEG ve WebP için q85'tir, PNG için kayıpsızdır.

Bu yedi özelliğin tümünü karşılayan bir ürün sayfası hızlı çalışır, temiz bir şekilde dizine eklenir ve pazarda ve vitrin ekosisteminde aynı görünür.

## Paket servis

Format savaşı bitti. 2026'da doğru yanıt üçünün de paralel olması: talep eden pazar yerleri için JPEG, vitrinler ve CDN'ler için WebP, şeffaflığın tartışılamaz olduğu durumlarda PNG. Satıcının işi artık format seçmek değil. Tek bir dokunuşla üçünü de tek kaynaktan yazan bir iş akışı seçmektir.

---

photoZseo, iPhone ve iPad için App Store'dedir.
