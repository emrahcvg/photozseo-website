---
title: "Ürün veri feed'i görseli gereksinimleri: Google Merchant Center ve Meta Katalog (2026)"
description: "Google Merchant Center ve Meta Katalog feed'leri için resim özellikleri: minimum piksel, önerilen boyut, biçimler, dosya sınırları ve resimlerin neden işaretlendiği."
pubDate: 2026-11-27
readingMinutes: 6
tags: [google-shopping, meta-catalog, product-feed, product-photos]
tldr:
  - "Google Merchant Center: 16 MB'a kadar JPEG, WebP, PNG, GIF, BMP veya TIFF; 31 Ocak 2027'den itibaren tüm ürünler için minimum 500 x 500 piksel; 1500 x 1500 piksel veya daha fazlası önerilir."
  - "Meta Katalog: JPEG veya PNG, maksimum 8 MB, en az 500 x 500 piksel; Facebook ve Instagram'daki Mağazalar için 1024 x 1024 piksel kare önerilir."
  - "Temiz bir arka plana sahip, metin kaplamaları ve filigran içermeyen tek bir 1500 x 1500 piksel kare JPEG, her iki beslemeyi de karşılar."
faqs:
  - q: "2026'da Google Merchant Center resim gereksinimleri nelerdir?"
    a: "JPEG, WebP, PNG, GIF, BMP veya TIFF biçiminde, 16 MB'a ve 64 megapiksele kadar bir http/https resim_bağlantısı kullanın. Google, 1500 x 1500 piksel veya daha büyük çözünürlüğü önerir ve 31 Ocak 2027'den itibaren tüm ürünler için minimum 500 x 500 piksel geçerli olacaktır."
  - q: "Meta kataloğu için minimum resim boyutu nedir?"
    a: "Meta'nın ürün verileri spesifikasyonu, ana görsel için JPEG veya PNG formatında 8 MB'ın altında en az 500 x 500 piksel gerektirir. Meta, Facebook ve Instagram'daki Mağazalar için 1024 x 1024 pikseli önerir."
  - q: "Bir ürün feed'ine kaç adet ek resim ekleyebilirim?"
    a: "Google'ın ek_resim_bağlantısı en fazla 10 ek resim kabul eder. Meta'nın katalog alanları referansı en fazla 50 ek resim URL'sine izin verir."
  - q: "Aynı resim dosyasını Google Alışveriş ve Meta için kullanabilir miyim?"
    a: "Genellikle evet. Gerçek ürünü, metin veya filigran olmadan temiz bir arka plan üzerinde gösteren, 1500 x 1500 piksel veya daha fazla kare JPEG, her iki platformun da yayınlanmış kurallarına uygundur."
  - q: "Meta veya Google neden ürün görselimi işaretliyor?"
    a: "Yaygın nedenler; yer paylaşımlı metinler, tanıtım rozetleri, filigranlar, kenarlıklar, \"resim yakında gelecek\" gibi yer tutucu resimler, çok küçük resimler ve tarayıcıları engelleyen veya dosya türüyle eşleşmeyen resim URL'leridir."
---

Kısa cevap: Hem Google Merchant Center hem de Meta Katalog için, gerçek ürünü temiz bir arka plan üzerinde gösteren, metin, rozet veya filigran içermeyen, en az 1500 x 1500 piksel boyutunda kare bir JPEG gönderin. Google'ın sert zemini 500 x 500 pikseldir (31 Ocak 2027'den itibaren tüm ürünler için) ve Meta'nınki de 500 x 500 pikseldir, ancak her iki platform da daha büyük dosyalar önerir. Aşağıdaki tablolar her platformun kendi belgelerindeki kesin sayıları vermektedir.

*Son doğrulama: Kasım 2026. Kaynaklar: Google Merchant Center Yardımı ("Resim bağlantısı [image_link]", "Ek resim bağlantısı [additional_image_link]", "Nasıl düzeltilir: Resim çok küçük"); Meta Business Yardım Merkezi ("Kataloglar için ürün görseli özellikleri"); Geliştiriciler için Meta ("Katalog alanları").*

## Google Merchant Center ve Meta Katalog: yan yana

| Gereklilik | Google Merchant Center | Meta Katalog |
|---|---|---|
| Ana resim alanı | `image_link` | `image_link` |
| Kabul edilen formatlar | JPEG, WebP, PNG, GIF, BMP, TIFF | JPEG, PNG |
| Maksimum dosya boyutu | 16 MB (ve 64 megapiksel) | 8MB |
| Minimum boyut | 31 Ocak 2027 tarihinden itibaren tüm ürünler için 500 x 500 piksel (bundan önce: 100 x 100 piksel veya giyim için 250 x 250 piksel) | 500 x 500 piksel |
| Önerilen boyut | 1500 x 1500 piksel veya daha büyük | 1024 x 1024 piksel (Facebook ve Instagram'daki mağazalar) |
| En boy oranı | Sabit bir oran belirtilmemiştir; Google ince kırpma uygulayabilir | Mağazalar 1:1 kare görüntüler; Dönen reklamlar, tüm resimler aynı oranı (1:1 veya 4:5) paylaştığında en iyi sonucu verir |
| Ek resimler | 10'a kadar (`additional_image_link`) | 50'ye kadar (`additional_image_link`) |
| Ürün çerçeveleme | Ürün görselin yaklaşık %75 ila %90'ını doldurmalıdır | Ana resim ürünün tamamını göstermelidir |
| URL kuralları | http/https, yalnızca ASCII, RFC 3986, 1 - 2.000 karakter | Mevcut ürün görselinin URL'sini kullanın |

Google'ın son teslim tarihini ayrıntılı olarak öğrenmek için [Google Alışveriş minimum 500 x 500 piksel](/tr/blog/google-merchant-center-500px-image-requirement-2027) ile ilgili önceki yayınımıza bakın.

## Google 500 x 500 piksel kuralı neyi değiştiriyor?

31 Ocak 2027'ye kadar Google'ın sorun giderme sayfasında daha düşük eşikler listelenmeye devam ediyor: Çoğu ürün için 100 x 100 piksel ve giysiler için 250 x 250 piksel. Bu tarihten sonra her kategori için minimum 500 x 500 piksel sınırı geçerlidir. Google, ürünün kendisi onaylanmasa da minimumun altındaki görsellerin gösterilmeyeceğini belirtiyor. Google ayrıca YouTube Alışveriş reklamlarının TV'de görünmesi için en az 500 x 500 piksel boyutunda görsellere ihtiyaç duyulduğunu da belirtiyor.

Pratik sonuç: 300 piksellik küçük resimlerle dolu bir yayın, listelerinizi doğrudan bozmaz, ancak bu ürünler, önemli olduğu yerde imajını kaybeder. Küçük resmin boyutunu yükseltmek yerine orijinallerden yeniden dışa aktarın.

## Meta katalog görselleri için ne gerektirir?

Meta'nın yardım makalesi şu temel bilgileri listeler: Ürün başına en az bir resim, JPEG veya PNG, maksimum 8 MB ve resim, satışa sunulan spesifik ürünü doğru şekilde temsil etmelidir. Facebook ve Instagram'daki Mağazalar için ürün görselleri kare şeklinde (1:1) gösterilir; minimum 500 x 500 piksel ve 1024 x 1024 piksel önerilir.

Meta ayrıca ürün başına dört veya daha fazla resim, tüm ürünü gösteren net bir ana resim, çeşitli açılar ve yakın çekimler, web sitenizdekiyle aynı görseller, beyaz bir arka plan ve görüntü kalitesi için PNG üzerinden JPEG önerir.

### Meta katalog resimlerini nasıl kırpar?

Ticaret Yöneticisi'nde (Ayarlar, ardından Katalog) üç kırpma modundan birini seçersiniz: çerçeveyi görselle doldurun (varsayılan, yakınlaştırılır), görüntünün tamamını çerçeve içinde gösterin (beyaz alan eklenebilir) veya çerçeveye sığacak şekilde kırpın ve yeniden boyutlandırın. Meta, Instagram ürün sayfası ayarı dışında, görsellerin Instagram'daki Mağazalar'da başka hiçbir yerde kırpılmadığını ve Facebook'taki Mağazalar'da da hiçbir şekilde kırpılmadığını söylüyor. Kataloğunuzda en boy oranları karışıksa dönen reklamlar bunları otomatik olarak ayarlayabilir; her görüntünün aynı oranda (1:1 veya 4:5) sağlanması bunu önler.

## Ürün resimleri neden işaretleniyor veya onaylanmıyor?

Her iki platform da neredeyse aynı sorunları listeliyor. Öncelikle feed'inizi aşağıdakiler açısından kontrol edin:

| Sorun | Google | Meta |
|---|---|---|
| Metin kaplamaları, promosyon kodları, harekete geçirici mesajlar | İzin verilmiyor (fiyat, nakliye, tanıtım metni) | Önerilmez (yer paylaşımlı metin, harekete geçirici mesajlar, promosyon kodları) |
| Filigranlar, eklenen logolar | Ürünün fiziksel bir parçası olmadığı sürece izin verilmez | Tavsiye edilmez |
| Yer tutucu resimler ("resim yakında gelecek") | İzin verilmiyor | Kaçınmak; yeni görsellerin yenilenmesi için yeni bir URL'ye ihtiyacı var |
| Kenarlıklar | İzin verilmiyor | Spesifikasyonda belirtilmemiş |
| Ürün yerine genel grafikler | İzin verilmiyor (bazı donanım, araç ve yazılım kategorileri için istisnalar) | Resim tam ürünü temsil etmelidir |
| Çok küçük | Resim gösterilmiyor (31 Ocak 2027'den sonra) | 500 x 500 pikselin altı teknik özelliklere uymuyor |
| Tarayıcı erişimi | Robots.txt dosyasında Googlebot'a ve Googlebot görüntüsüne izin verin; değişiklikler 24 ila 48 saat sürer | Spesifikasyonda belirtilmemiş |
| Dosya türü uyuşmazlığı | Uzantı gerçek formatla eşleşmelidir | Yalnızca JPEG veya PNG |

Feed'e özgü iki tuzağın gözden kaçırılması kolaydır. İlk olarak Google, zaman damgaları veya oturum kimlikleri gibi dinamik parametreler içermeyen kararlı URL'ler ister. İkincisi, Meta yalnızca yeni dosyanın farklı bir URL'si varsa değiştirilen görüntüyü yeniler; dolayısıyla `shoe.jpg`'nin üzerine yazmak kataloğunuzu güncellemez.

## Her iki feed'i de karşılayan tek bir ihracat

1. Orijinal, sıkıştırılmamış fotoğraftan başlayın.
2. 1:1 kareyi 1500 x 1500 piksel veya daha yüksek çözünürlükte JPEG olarak dışa aktarın (8 MB'ın altında, her iki sınırın da rahatlıkla altında).
3. Ürünü çerçevenin yaklaşık %75 ila %90'ı oranında temiz bir arka plan üzerinde tutun.
4. Besleme görüntüsündeki kaplamaları, rozetleri, filigranları ve sınırları kaldırın; reklamlar için promosyon sürümlerini saklayın.
5. Açıklayıcı bir dosya adı ve kararlı, taranabilir bir URL kullanın.
6. `additional_image_link`'ye ekstra açılar koyun (Google: 10'a kadar).

## photoZseo'nin sığdığı yer

Birçok pazaryeri ve yayın için görseller hazırlıyorsanız, iPhone ve iPad'deki [fotoğrafZseo](/tr/download), tek bir fotoğraftan 46 pazaryerine ait ürün fotoğraflarını yeniden boyutlandırır, sıkıştırır ve yeniden adlandırır; [Chrome uzantısı](/tr/chrome-extension), SEO dosya adları ve toplu dışa aktarma içeren ürün sayfalarından da aynısını yapar. [pazar yeri resim boyutu kılavuzu](/tr/marketplace-image-sizes)'miz pazara özel numaraları listeler.

*photoZseo herhangi bir pazar yeri, Google veya Meta ile bağlantılı değildir veya bunlar tarafından desteklenmemektedir. Büyük bir yüklemeden önce daima platformun güncel yönergelerini kontrol edin.*
