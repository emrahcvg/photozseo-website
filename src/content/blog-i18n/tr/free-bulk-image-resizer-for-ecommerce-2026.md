---
title: "E-ticaret için ücretsiz toplu resim yeniden boyutlandırıcı: nelere dikkat edilmeli ve nasıl yapılmalı (2026)"
description: "Ürün fotoğraflarını Amazon, Etsy ve Shopify için ücretsiz olarak toplu olarak yeniden boyutlandırma: yerleşik işletim sistemi araçları, tarayıcı araçları ve listelemeleri bozan kalite tuzakları."
pubDate: 2026-11-27
readingMinutes: 7
tags: [bulk-resize, product-photos, image-size, e-commerce, free-tools]
tldr:
  - "Bilgisayarınızda bulunan araçları kullanarak ürün fotoğraflarını ücretsiz olarak toplu olarak yeniden boyutlandırabilirsiniz, ancak yeniden boyutlandırma işin kolay kısmıdır. Kırpma, renk ve dosya boyutunu kontrol altında tutmak, listelemelerin yanlış gittiği yerdir."
  - "Pazaryerleri farklı kurallar yayınlıyor: Shopify genellikle en iyi sonucun 2048 x 2048 piksel olduğunu söylüyor, Etsy en az 2000 piksel istiyor, Amazon en uzun tarafta 1000 pikselden fazlasını tercih ediyor."
  - "Bir aracı, işleyebileceği görüntü sayısına göre değil, koruduğu şeye (en boy oranı, sRGB rengi, orijinal dosyalar) göre seçin."
faqs:
  - q: "Ürün resimlerini toplu olarak yeniden boyutlandırmanın en iyi ücretsiz yolu nedir?"
    a: "Tek seferlik bir toplu iş için, işletim sisteminizde yerleşik araçlar veya tarayıcı tabanlı yeniden boyutlandırıcı yeterlidir. Çeşitli pazaryerlerinde tekrarlanan çalışmalar için, pazaryeri başına boyut ön ayarlarını kaydeden bir araç arayın, böylece boyutları her seferinde yeniden girmezsiniz."
  - q: "Shopify için ürün görselleri hangi boyutta olmalıdır?"
    a: "Shopify'ın yardım merkezi, 2048 x 2048 piksel karenin genellikle en iyi sonucu verdiğini, 5000 x 5000 piksele (25 megapiksel) kadar ve 20 MB'ın altındaki resimlerin kabul edildiğini söylüyor."
  - q: "Etsy listeleme fotoğrafları hangi boyutta olmalıdır?"
    a: "Etsy'nin yardım makalesi genişlik ve yükseklikte en az 2000 piksel öneriyor ve ilk fotoğrafın en az 635 piksel olması gerektiğini, böylece aramada daha alt sıralarda yer almayacağını söylüyor."
  - q: "Fotoğrafın yeniden boyutlandırılması kalitesini düşürür mü?"
    a: "Bir görüntüyü küçültmek, orijinalden bir kez yapıldığında keskin kalmasını sağlar. Küçük bir görüntünün büyütülmesi pikselleşmeye neden olur ve bir JPEG dosyasının tekrar tekrar yeniden kaydedilmesi sıkıştırma kusurları ekler; bu nedenle, her zaman orijinal dosyalarınızdan yeniden boyutlandırın."
  - q: "Market yüklemeleri için WebP mi yoksa JPEG mi kullanmalıyım?"
    a: "Yönergelerinde aksi belirtilmediği sürece pazar yerleri için JPEG kullanın çünkü bu, evrensel olarak kabul edilen formattır. WebP, Shopify'ın kabul edilmiş olarak listelediği kendi mağazanızda kullanışlıdır ancak önce her pazaryerinin mevcut yönergelerini kontrol edin."
  - q: "Ücretsiz yeniden boyutlandırma ürün fotoğrafları için güvenli midir?"
    a: "İşlemin nerede gerçekleştiğine bağlıdır. Cihazınızda veya tarayıcınızda çalışan araçları tercih edin ve yayınlanmamış ürün fotoğraflarını bir web servisine yüklemeden önce gizlilik bildirimini okuyun."
---

Evet, ürün fotoğraflarını toplu olarak ücretsiz olarak yeniden boyutlandırabilirsiniz. Bilgisayarınızın yerleşik araçları, ücretsiz tarayıcı tabanlı yeniden boyutlandırıcılar ve bazı uygulamaların ücretsiz katmanlarının tümü, bir toplu işlemi dakikalar içinde gerçekleştirir. İşin zor kısmı yeniden boyutlandırmak değil. Her pazara uygun hedef boyutları seçmek, en boy oranını korumak ve yolda renk veya dosya boyutuna zarar vermemek. Bu kılavuz, ücretsiz seçenekleri, herhangi bir araçta nelerin kontrol edileceğini ve kopyalayabileceğiniz bir ayarlar tablosunu dürüstçe kapsar.

*Son doğrulama: Kasım 2026. Kaynaklar: Shopify Yardım Merkezi ("Ürün medyası"), Etsy Yardım Merkezi ("Listelerinize Fotoğraf Ekleme"), Amazon Seller Central ("Teknik resim dosyası gereksinimleri"), Apple Destek ("Kamera formatlarını değiştirme"). Pazaryerleri kuralları sık sık değiştirir, bu nedenle büyük bir yüklemeden önce mevcut sayfayı kontrol edin.*

## Pazar yerleri aslında ne istiyor?

Yalnızca birkaç sayı kesindir ve internette gördüğünüz bazı "kurallar" aslında tavsiye niteliğindedir.

| platformu | Resmi sayfada ne yazıyor | Kaynak |
|---|---|---|
| Shopify | 2048 x 2048 piksel kare genellikle en iyi sonucu verir; 5000 x 5000 piksele veya 25 megapiksele kadar; 20 MB'ın altında; PNG ve JPEG tercih edilir, WebP ve HEIC de kabul edilir | Shopify Yardım Merkezi, "Ürün medyası" |
| Etsy | Genişlik ve yükseklikte en az 2000 piksel hedefleyin; ilk fotoğraf en az 635 piksel; JPG, GIF, PNG, SVG, HEIC kabul edilir; 1 MB'ın üzerindeki dosyalar yavaş bağlantılarda yüklenemeyebilir; sRGB'yi kullan | Etsy Yardım Merkezi, "Girişlerinize Nasıl Fotoğraf Eklenir?" |
| Amazon | Yakınlaştırma için en uzun kenarı 1000 pikselden büyük olan görüntüleri tercih eder; JPEG önerilir, TIFF, PNG ve animasyonsuz GIF kabul edilir | Amazon Seller Central, "Teknik resim dosyası gereksinimleri" |

Diğer her şey için (minimumlar, maksimumlar, arka plan kuralları) platformun mevcut yönergelerini kontrol edin. Üçüncü taraf bloglar genellikle bir öneriyi kesin sınır olarak belirtir. Tek bir platforma daha derinlemesine bakmak istiyorsanız [Amazon fotoğraf özellikleri](/tr/blog/amazon-product-photo-specs-2026) ve [Shopify görsel boyutları](/tr/blog/shopify-product-image-size-2026) hakkındaki kılavuzlarımıza bakın.

## Fotoğrafları toplu olarak yeniden boyutlandırmanın ücretsiz yolları nelerdir?

| Seçenek | Şunun için iyi: | Dikkat edin |
|---|---|---|
| Yerleşik işletim sistemi araçları (örneğin macOS'ta Preview veya Windows'ta Microsoft'un ücretsiz PowerToys Image Resizer'ı) | Bir klasörün belirli bir boyuta hızla yeniden boyutlandırılması, yükleme yok | Genellikle aynı anda tek bir hedef boyutu; format ve sıkıştırma üzerinde sınırlı kontrol |
| Ücretsiz tarayıcı tabanlı yeniden boyutlandırıcılar | Kurulum yok, herhangi bir cihaz | Dosyaların yerel olarak mı işlendiğini yoksa karşıya mı yüklendiğini kontrol edin; ücretsiz katmanlar genellikle parti boyutunu sınırlar veya filigran ekler |
| Ücretsiz uygulama ve uzantı katmanları | Tek adımda pazar yeri ön ayarları, yeniden adlandırma ve dışa aktarma | Ücretsiz limitler ürüne göre farklılık gösterir; etraflarında bir katalog planlamadan önce bunları okuyun |
| Komut satırı veya komut dosyaları | Tekrarlanabilir binlerce görüntü | Teknik konfora ihtiyaç duyar; orijinallerin üzerine yazmak kolay |

Bunların hiçbiri evrensel olarak en iyisi değil. Doğru seçim, bunu ne sıklıkta yaptığınıza ve kaç pazar yeri için yaptığınıza bağlıdır.

## Toplu yeniden boyutlandırmada nelere dikkat etmelisiniz?

Ücretsiz veya ücretli herhangi bir aracı karşılaştırırken bu kontrol listesini kullanın.

1. Orijinallerinizi korur. Çıktı yeni bir klasöre gider. Yerinde yeniden boyutlandırma, insanların tek tam çözünürlüklü dosyalarını kaybetmelerinin yoludur.
2. En boy oranını korur veya nasıl sığdırılacağını seçmenize olanak tanır. Zorla kırpma, ürünün kenarını kesebilir. Kare bir tuvali doldurmakla kırpmak arasında karar verin ve birkaç sonucu kontrol edin.
3. sRGB'ye dönüşür. Etsy özellikle web görselleri için sRGB kullanılmasını söylüyor. Geniş gam profilindeki bir fotoğraf, bazı izleyiciler için donuk veya aşırı doygun görünebilir.
4. Formatı ve kaliteyi kontrol eder. Dosyayı şişiren veya ezen bir varsayılanı kabul etmek yerine JPEG kalitesini kendiniz seçmek istiyorsunuz.
5. HEIC'i yönetir. iPhone'lar varsayılan olarak HEIC'i kaydedebilir. Apple'ın ayarı, JPEG'i kaydetmek için "En Uyumlu" seçeneğine geçmenize olanak tanır, ancak eski fotoğraflar zaten HEIC'tir, dolayısıyla aracınızın bunları dönüştürmesi gerekir.
6. Sessizce yükseltme yapmaz. Etsy'nin kılavuzu, büyütmenin pikselleşmeye neden olabileceğini belirtiyor. Bir araç küçük dosyaları uyarmalı veya atlamalıdır.
7. Gizliliği yönetir. Fotoğrafların cihazınızdan çıkıp çıkmadığını öğrenin.

## Yaygın kalite tuzakları nelerdir?

- Ürünü kırpma. Kare ön ayarlar, kilim, poster ve aletler gibi uzun ürünleri keser. Nesne çerçeveye dokunduğunda kırpmak yerine tamponlayın.
- EXIF verileri. Telefon fotoğrafları konum ve cihaz verilerini taşıyabilir. Yayınlamadan önce onu çıkarmak mantıklı bir alışkanlıktır, ancak bazı araçlar bunu varsayılan olarak korur. EXIF yönünün de önemli olduğunu unutmayın: telefonunuzda dik görünen bir fotoğraf, kötü bir yeniden boyutlandırma sonrasında döndürülmüş görünebilir.
- Renk profili. Yukarıdaki gibi sRGB'ye dönüştürün. CMYK, Etsy'ye göre baskı içindir.
- Çift sıkıştırma. Her JPEG yeniden kaydetme işlemi biraz kalite kaybeder. Daha önce dışa aktarılan bir kopyadan değil, orijinalden bir kez yeniden boyutlandırın.
- Dosya boyutu ve yükleme hataları. Etsy, 1 MB'ın üzerindeki dosyaların daha yavaş bağlantılarda başarısız olabileceğini belirtiyor; bu nedenle keskinlik ve ağırlık arasında bir denge kurmayı hedefleyin.
- Şeffaf PNG'ler. Etsy, şeffaf alanların siyah göründüğünü söylüyor. Yüklemeden önce sağlam bir arka plan üzerinde düzleştirin.
- WebP ve JPEG. WebP benzer kalitede daha küçüktür ve Shopify bunu kabul eder ancak JPEG, pazaryerleri için güvenli evrensel seçimdir. [WebP, JPEG ve PNG karşılaştırması](/tr/blog/webp-jpeg-png-product-photos-2026)'miz daha da derine iniyor.

## Hangi ayarları kullanmalısınız? (pratik tablo)

Bunları bir başlangıç ​​noktası olarak kullanın ve ardından platformun mevcut yönergeleriyle karşılaştırın.

| Amaç | En uzun kenar | Biçim | Notlar |
|---|---|---|---|
| Kendi Shopify mağazanız | 2048 piksel (kare 2048 x 2048) | Daha küçük dosyalar istiyorsanız JPEG veya WebP | 5000 x 5000 piksel / 20 MB sınırlarının altında kalın |
| Etsy listeleri | 2000 piksel veya daha fazla | JPEG, sRGB | İlk fotoğrafı yatay veya kare yapın; dosya ağırlığını makul tutun |
| Amazon ana görselleri | 1.000 pikselin çok üstünde | JPEG | Arka plan kuralları için Amazon'un güncel görsel yönergelerini inceleyin |
| Arşiv yöneticisi | Orijinal boyut | Orijinal | Hiçbir zaman üzerine yazmayın; kopyaları yeniden boyutlandır |

## Basit ve ücretsiz bir iş akışı

1. Orijinalleri "orijinaller" adlı bir klasöre kopyalayın ve asla düzenlemeyin.
2. Yukarıdaki tablodan hedef boyutlarınızı belirleyin.
3. Kopyaları toplu olarak pazar başına ayrı bir klasöre yeniden boyutlandırın.
4. Beş görüntüyü noktasal olarak kontrol edin: kırpma, yönlendirme, keskinlik, renk.
5. Yüklemeden önce dosyaları açıklayıcı bir adla yeniden adlandırın. Bkz. [SEO için ürün fotoğraflarına nasıl ad verilir?](/tr/blog/how-to-name-product-photos-for-seo).

## photoZseo'nin sığdığı yer

Düzenli olarak birkaç pazar yeri için yeniden boyutlandırma yaparsanız, bunu elle yapmak tekrarlanır hale gelir. photoZseo'nin iOS ve iPadOS uygulaması (iOS 17+), 46 pazar yeri için fotoğrafları yeniden boyutlandırır, sıkıştırır ve yeniden adlandırır ve Ücretsiz bir plana sahiptir; Mevcut plan sınırları için [fiyatlandırma](/tr/pricing)'ye bakın. [Chrome uzantısı](/tr/chrome-extension), 82 boyutlu profillerle Chrome 116+ ürün sayfalarından çalışır. Ücretsiz katmanı günde 5 ürünü ve 10 görseli kapsar ve verileriniz tarayıcıda kalır. Her iki araç da her bir pazaryerinin kendi mevcut kurallarını kontrol etmenin yerini almaz.

photoZseo herhangi bir pazara bağlı değildir veya herhangi bir pazar yeri tarafından desteklenmemektedir. Pazar yeri adları yalnızca uyumluluğu tanımlamak için kullanılır.
