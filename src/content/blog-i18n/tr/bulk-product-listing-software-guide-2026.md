---
title: "Toplu ürün listeleme yazılımı: Amazon, eBay, Etsy, Shopify ve Trendyol'da CSV/XLSX yüklemeleri nasıl çalışır (2026)"
description: "Ürünleri toplu olarak yükleme: her platformun şablonu, Amazon, eBay, Etsy, Shopify ve Trendyol için gerekli alanlar ve görsel URL kuralları ve ayrıca bir kontrol listesi."
pubDate: 2026-11-27
readingMinutes: 7
tags: [bulk-upload, csv, xlsx, marketplaces, product-listing]
tldr:
  - "eBay, Shopify, Amazon ve Trendyol e-tablo yüklemelerini kabul etmektedir. Etsy bunu yapmıyor: Yardım merkezi, yeni listeleri toplu olarak yükleyemeyeceğinizi, yalnızca mevcut listeleri toplu olarak düzenleyemeyeceğinizi söylüyor."
  - "Bir e-tablodaki görseller neredeyse her zaman URL'lerdir, ekli dosyalar değildir. URL herkese açık, doğrudan olmalı ve (Shopify ve eBay'de) https:// ile başlamalıdır."
  - "Amazon, eBay ve Trendyol'da şablonlar kategoriye göre farklılık gösterir; bu nedenle her kategori için yeni bir şablon indirin ve hiçbir zaman başlıklarını yeniden adlandırmayın."
faqs:
  - q: "Ürünleri eBay'e nasıl toplu olarak yüklerim?"
    a: "Satıcı Merkezi'nde Raporlar'a, ardından Yükle'ye gidin ve Listeleme kaynağıyla şablonu al'ı seçin. Dosyayı doldurun ve yükleyin; eBay, öğeleri belirtildiği gibi listeler. CSV veya XLSX'i kullanın."
  - q: "Yeni listeleri CSV ile Etsy'ye toplu olarak yükleyebilir miyim?"
    a: "Etsy'nin yardım merkezi, yeni listeleri toplu olarak yükleyemeyeceğinizi söylüyor, ancak listeleri kopyalayabilir ve mevcut olanları toplu olarak düzenleyebilirsiniz. Üçüncü taraf araçlar mevcuttur ancak bunlar bir Etsy özelliği değildir."
  - q: "Shopify'ın CSV'de resim URL'lerine ihtiyacı var mı?"
    a: "Evet. CSV'deki resim URL'leri herkese açık olmalı, https:// kullanılmalı ve şifre korumasına sahip olmamalıdır. Shopify, görselleri içe aktarma sırasında indirir."
  - q: "Shopify ürünü CSV'si hangi dosya kodlamasını kullanmalıdır?"
    a: "Shopify'ın yardım merkezi, başlıkların ilk satırda olacağı, virgülle ayrılmış, LF tarzı satır sonlarına sahip UTF-8'i ister. E-tablo uygulamanızın dışa aktarma ayarlarını kontrol edin."
  - q: "Trendyol'da Excel ürün dosyasını nereye yüklerim?"
    a: "Satıcı panelinde Ürün altından, ardından Toplu Ürün İşlemleri'ne Excel ürün girişi seçeneği ve Yeni Ürün yükleme tipini kullanarak ulaşabilirsiniz. Her kategorinin kendi şablonu vardır."
  - q: "Toplu yüklemem neden reddedildi?"
    a: "Bunun genel nedenleri arasında düzenlenmiş sütun başlıkları, gerekli alanların eksik olması, özel veya yönlendirmeli resim URL'leri ve yanlış kategoriden bir şablon yer alır. Dosyayı düzeltip yeniden yükleyin."
---

Toplu ürün yükleme, her listeyi elle oluşturmak yerine, ürün başına bir satır içeren bir e-tablo (CSV veya XLSX) hazırlayıp bunu bir kez yüklemek anlamına gelir. eBay, Shopify, Amazon ve Trendyol bunu destekliyor; Etsy, yeni listelemelerin toplu olarak oluşturulmasına izin vermez. Çoğu başarısızlığa neden olan iki kural her yerde aynıdır: şablonun başlıklarını tam olarak verildiği gibi tutun ve her görseli genel, doğrudan URL olarak verin.

*Son doğrulama: Kasım 2026. Kontrol edilen kaynaklar: Shopify Yardım Merkezi, "Ürünleri içe ve dışa aktarmak için CSV dosyalarını kullanma"; eBay Satıcı Merkezi yardımı, "Toplu liste oluşturma" (Satıcı Merkezi Raporları > Yükleme); Etsy Yardım Merkezi, "Birden fazla ilanı aynı anda oluşturabilir veya düzenleyebilir miyim?"; Amazon Satıcı Merkezi yardımı, "Envanter dosyası şablonları" ve "Görüntü sorunları" (arama alıntılarıyla okuyun, aşağıdaki nota bakın); Trendyol Akademi Satıcı Bilgi Merkezi, "Excel Ürün Girişi" ve "Ürün Görsel Seçimi ve Yükleme" (arama alıntılarıyla okuyun).*

## Her platform toplu yüklemeyi nasıl gerçekleştiriyor?

| platformu | Toplu oluşturulsun mu? | Nerede | Dosya türü | Resim kuralı |
|---|---|---|---|---|
| Shopify | Evet | Ürünler > İthalat | CSV, UTF-8, virgülle ayrılmış | Herkese açık https:// URL'leri |
| eBay | Evet | Satıcı Merkezi > Raporlar > Yükle > Şablonu al | CSV veya XLSX | https:// URL'leri, liste başına en fazla 12 adet, \ ile ayrılmış |  |
| Amazon | Evet | Yükleme Yoluyla Ürün Ekleme (Satıcı Merkezi) | Kategoriye özel envanter dosyası şablonu | Doğrudan URL; yönlendirmeler ve pop-up'lar reddedilir |
| Trendyol | Evet | Ürün > Toplu Ürün İşlemleri > Excel ürün girişi | Excel, kategori başına bir şablon | Resim Bağlantısı sütunundaki bağlantı |
| Etsy | Hayır (yalnızca düzenleme) | Mağaza Yöneticisi > İlanlar | Uygulanamaz | Uygulanamaz |

## Ürünleri Shopify'a toplu olarak nasıl yüklersiniz?

Shopify'ın yardım merkezi formatı belirler: İlk satır sütun başlıkları olmalı, sütunlar virgülle ayrılmalı ve dosya LF satır sonlarıyla UTF-8 olmalıdır. Yeni ürünler için yalnızca `Title` gereklidir; Varyantları kullanıyorsanız `URL handle` de gereklidir. SKU gibi varyant sütunlarının da `Option1 name` ve `Option1 value`'ye ihtiyacı vardır, aksi takdirde Shopify, güncelleme sırasında varsayılan bir varyant oluşturur ve mevcut olanları siler.

Resimler, şifre koruması olmayan, herkese açık `https://` URL'leri olmalıdır. Shopify bunları içe aktarma sırasında indirir, böylece daha sonra kaldırabilirsiniz. Resim dosyası adları yükleme sonrasında düzenlenemez ve `_thumb`, `_small` veya `_medium` soneklerini içeremez. CSV'de videolar ve 3D modeller desteklenmez.

| Sınır | Değer (Shopify Yardım Merkezi) |
|---|---|
| Ürün başına seçenekler | 3 |
| Ürün başına görseller | 250 |
| Ürün başına etiketler | 250 |
| Alternatif metin | Maksimum 512 karakter, 125 veya daha az önerilir |
| SEO başlığı | 70 karakter |
| SEO açıklaması | 320 karakter |

Bilinen hata nedenleri aynı sayfadır: hem `Barcode` hem de `Barcodes` sütunlarına sahip bir dosya başarısız olur; kısmi bir paketlenmiş boyutlu sütun kümesi başarısız olur; Üzerine yazma açıkken boş hücreler mevcut değerleri siler. API rotasıyla daha derin bir karşılaştırma için bkz. [Shopify CSV ve API karşılaştırması](/tr/blog/shopify-csv-vs-api-2026).

## Listeleri eBay'e nasıl toplu olarak yüklersiniz?

eBay'in mevcut aracı Satıcı Merkezi Raporları'dır. Yükleme'ye gidin, Şablonu al'a tıklayın, Listeleme kaynağını ve bir dosya türü seçin. XLSX varsayılandır ve gelişmiş satıcılar için CSV önerilir; Bir XLSX indirmesi, her biri kendi sayfasında olmak üzere en fazla 10 kategori içerebilir. Tamamlanan dosyayı yükleyin ve eBay, öğeleri belirtildiği gibi listeler.

Liste eklemek için gerekli alanlar arasında Eylem, Kategori Kimliği, Başlık (en fazla 80 karakter), Biçim, Süre, Başlangıç ​​fiyatı, Miktar, Durum Kimliği, Açıklama ve Öğe fotoğraf URL'si bulunur. ABD sitesi ayrıca eşleşen öğeye özel sütunda bir UPC (veya eşdeğeri) gerektirir ve kitap kategorilerinin bir ISBN'si olması gerekir.

Resim URL'leri `https://` ile başlamalı, `.jpg` veya `.png` gibi bir dosya uzantısıyla bitmeli, 2048 karakterin altında kalmalı ve boşlukları `%20` ile değiştirmelidir. Her listede dikey çizgi (`|`) karakteriyle ayrılmış en fazla 12 resim listeleyebilirsiniz. Görüntüler kendi kendine barındırılabilir veya eBay Resim Hizmetlerinde barındırılabilir. Çeşitlemeler için ana satır miktar ve fiyatı boş bırakır ve her alt satırın kendine ait bir satırı vardır.

## Ürünleri Amazon'a toplu olarak nasıl yüklersiniz?

Amazon, Seller Central'daki Yükleme Yoluyla Ürün Ekle sayfasından oluşturulan kategoriye özel envanter dosyası şablonlarını kullanır. Henüz katalogda yer almayan öğeler için gerekli, koşullu olarak gerekli veya önerilen nitelikleri işaretleyen ürün şablonunu kullanırsınız. Zaten katalogda bulunan ürünler için ürün kimliğine göre arama yapabilir ve önceden doldurulmuş bir dosya kullanabilirsiniz. Yüklemeden sonra eşleşen dosya türünü seçin ve her SKU'ya ilişkin işleme raporunu inceleyin.

Görseller için Amazon'un "Görüntü sorunları" yardım sayfası, açılır pencere veya yönlendirme URL'sinin kabul edilmeyeceğini ve yüklemenin işlenmeyeceğini, dolayısıyla URL'nin doğrudan görüntü dosyasına işaret etmesi gerektiğini söylüyor. Menü yolları ve kabul edilen dosya türleri pazar bölgesine göre değişiklik gösterir; bu nedenle indirdiğiniz şablondaki talimatları izleyin. Görüntü boyutları için bkz. [Amazon ürün fotoğrafı özellikleri](/tr/blog/amazon-product-photo-specs-2026).

## Etsy'ye toplu yükleme yapabilir misiniz?

Yeni listeler için değil. Etsy'nin yardım merkezi, yeni listeleri toplu olarak yükleyemeyeceğinizi belirtiyor ve bir liste oluşturup onu kopyalamanızı öneriyor. Başlıklar, etiketler, açıklamalar, fiyatlar, özel seçenekler, işleme profili ve teslimat profilleri dahil olmak üzere mevcut listelemeleri Shop Manager'dan toplu olarak düzenleyebilirsiniz. Etsy listelerini toplu olarak oluşturduğunu iddia eden araçlar üçüncü taraf ürünlerdir ve bir Etsy özelliği değildir; bu nedenle şartlarını ve API erişimini kendiniz doğrulayın.

## Trendyol'a toplu ürün yükleme nasıl yapılır?

Satıcı panelinde Ürün'ü, ardından Toplu Ürün İşlemleri'ni açın ve Excel ürün girişi seçeneğini kullanın. Trendyol Satıcı Bilgi Merkezi, kategori başına bir kategori koduyla tanımlanan bir şablonu ve "Yeni Ürün Ekle" (yeni ürün ekle) yükleme türünü açıklar. Görseller Resim Bağlantısı (Görsel Linki) sütununda verilmiştir. Trendyol ayrıca bir galeri yöntemini de belgeliyor: önce görselleri, ürün barkoduna eşit dosya adlarıyla (birkaç görsel için, barkod_1, barkod_2) Resim Galerisi'ne yükleyin, ardından bu adları sütuna kopyalayın. Yüklemeden önce şablonun biçimini değiştirmeyin.

Panel ifadeleri değişebilir, bu nedenle adımları kendi satıcı hesabınızdaki şablona göre onaylayın. Trendyol ve Hepsiburada görsel kuralları için [Trendyol ve Hepsiburada ürün fotoğrafları](/tr/blog/trendyol-hepsiburada-product-photos) sayfasına bakınız.

## En yaygın toplu yükleme hataları nelerdir?

1. Başlıklar düzenlendi veya yeniden adlandırıldı. Şablonlar başlık metnine göre eşleştirilir. Bunları tercüme etmeyin veya yeniden sıralamayın.
2. Yanlış kategori şablonu. Amazon, eBay ve Trendyol şablonları kategoriye göre farklılık göstermektedir.
3. Doğrudan olmayan resim URL'leri. Bir web sayfasına, yönlendirmeye veya oturum açma korumalı klasöre bağlantı başarısız oluyor.
4. URL'lerdeki boşluklar ve özel karakterler. Boşlukları kodlayın (eBay `%20`'yi ister).
5. Yanlış kodlama veya sınırlayıcı. Excel, noktalı virgülleri veya UTF-8 olmayan metni dışa aktarabilir.
6. Yinelenen veya eksik tanımlayıcılar (SKU, barkod, URL tanıtıcı).
7. Sürprizlerin üzerine yazın. Shopify'da boş hücreler mevcut verileri silebilir.

## Yükleme öncesi kontrol listesi

- Her kategori ve platform için yeni bir şablon indirin.
- Kataloğun tamamından önce 5 satırla test edin.
- Her görsel URL'sini özel bir tarayıcı penceresinde açın; görüntünün kendisini göstermesi gerekir.
- Platformun mevcut yönergelerine göre başlığı, açıklamayı ve etiket sınırlarını kontrol edin.
- Kaynak dosyanın ve platformun hata raporunun yedeğini alın.

## photoZseo'nin sığdığı yer

Toplu yükleme dosyaları yalnızca içlerindeki resimler ve metinlerle birlikte çalışır. photoZseo, 46 pazar yeri için ürün fotoğrafları hazırlar (yeniden boyutlandırma, sıkıştırma, SEO dosya adları, cihazdaki arka planı kaldırma) ve iPhone ve iPad uygulamasından CSV, XLSX veya JSON'u dışa aktarır. Shopify'a ürün göndermek dışında sizin için görsel barındırmaz veya pazaryerlerine yükleme yapmaz. Uygulamayı [indirme sayfası](/tr/download)'den edinin. [Chrome uzantısı](/tr/chrome-extension), bilgisayarda göz attığınız ürün sayfaları için de aynısını yapar.

*photoZseo herhangi bir pazara bağlı değildir veya herhangi bir pazar yeri tarafından desteklenmemektedir. Pazar yeri adları yalnızca uyumluluğu açıklamak için kullanılır.*

*Not: Doğrulama sırasında Amazon Seller Central ve Trendyol Akademi sayfaları tam olarak açılamadığından bu iki platforma ilişkin ayrıntılar resmi sayfaların arama alıntılarından alınmıştır. Her zaman kendi hesabınızdaki şablon talimatlarını kontrol edin.*
