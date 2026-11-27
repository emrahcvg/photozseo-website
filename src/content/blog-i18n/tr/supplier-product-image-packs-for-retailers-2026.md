---
title: "Bayilere ürün görseli paketi nasıl hazırlanır? Tedarikçi rehberi 2026"
description: "Tedarikçiler için bayi görsel paketi: klasör düzeni, dosya adlandırma, boyut katmanları, kullanım izni notu ve fotoğrafları SKU ile eşleyen CSV."
pubDate: 2026-11-27
readingMinutes: 7
tags: [tedarikçi, görsel paketi, toptan, ürün verisi, bayi]
tldr:
  - "İyi bir bayi görsel paketi tek indirmede üç şeydir: fotoğraflar, her dosyayı bir SKU'ya bağlayan CSV ve kısa bir kullanım izni notu. CSV yoksa bayi hangi fotoğrafın hangi ürüne ait olduğunu tahmin etmek zorunda kalır."
  - "Her fotoğraf için iki veya üç boyut katmanı (ana dosya, web ve küçük önizleme) ile tek bir adlandırma kuralı verin; bayi dosyaları düzenlemeden doğrudan mağazasına veya pazaryerine yükleyebilsin."
  - "Bayinin görselleri neyle kullanabileceğini açık bir dille yazın. Yazılı izin, bayilerin tedarikçi fotoğrafı kullanırken yaşadığı en büyük tereddüdü ortadan kaldırır."
faqs:
  - q: "Tedarikçi olarak görsel paketine neleri koymalıyım?"
    a: "Öngörülebilir bir klasör yapısında fotoğraflar, her dosyayı SKU ve barkodla eşleyen bir CSV veya tablo, kısa bir kullanım izni notu ve adlandırma kuralını anlatan bir okubeni dosyası koyun. Paketin güncel olduğu anlaşılsın diye sürüm tarihi ekleyin."
  - q: "Bayiler için ürün görsellerini nasıl adlandırmalıyım?"
    a: "Her dosya için aynı kuralı kullanın: SKU artı görünüm kodu, örneğin SKU-12345_on.jpg ve SKU-12345_yan.jpg. En güvenli karakterler küçük harf, rakam, tire ve alt çizgidir; Türkçe karakter ve boşluktan kaçının. SKU dosyayı fiyat listenizle eşler."
  - q: "Bayi görsel paketimi doğrudan Trendyol, Hepsiburada veya Shopify'a yükleyebilir mi?"
    a: "Görselleri çoğu zaman yükleyebilir, ama her platformun boyut ve arka plan kuralları vardır ve zamanla değişir. Her platformun güncel yönergesini kontrol edin ya da bayilerin kullandığı kanallar için ayrıca boyutlandırılmış bir klasör verin."
  - q: "Bayilere ürün fotoğraflarını kullanma izni vermem gerekir mi?"
    a: "Kesinlikle önerilir. Fotoğraflar oluşturuldukları anda telif hakkıyla korunur; ABD Telif Hakkı Ofisi de bunu açıklar. Bu yüzden bayi bir fotoğrafın serbest olduğunu varsayamaz. Kısa bir yazılı izin kafa karışıklığını önler. İfadeyi kendi ülkenizdeki bir hukukçuya kontrol ettirin."
  - q: "Dağıttığım görsel paketini ne sıklıkla güncellemeliyim?"
    a: "Ambalaj, renk veya ürünün kendisi değiştiğinde ve yeni SKU eklediğinizde güncelleyin. Paket adına tarih ya da sürüm yazın ve bayilere neyin değiştiğini bildirin; eski fotoğraflar canlı ilanlarda kalmasın."
---

**Tedarikçi görsel paketi; ürün fotoğraflarının SKU'ya göre düzenlendiği, hangi fotoğrafın hangi ürüne ait olduğunu söyleyen bir veri dosyasının ve bayilerin görselleri nasıl kullanabileceğini anlatan kısa bir notun birlikte sunulduğu indirilebilir settir.** Paketi doğrudan mağazasına ya da pazaryerine yükleyebilen bayi ürünleri daha hızlı listeler, daha az hata yapar ve sipariş vermeye daha istekli olur. Bu yazıda uygulanabilir bir paket yapısı, adlandırma kuralı, boyut katmanları, kullanım izni notu ve hepsini bir arada tutan CSV anlatılıyor.

*Son doğrulama: Kasım 2026. Kontrol edilen kaynaklar: ABD Telif Hakkı Ofisi (Copyright FAQ), Shopify Yardım Merkezi (Ürünleri CSV dosyalarıyla içe/dışa aktarma), ICC (Incoterms 2020 sayfası).*

## Bayiler neden görsel paketi ister?

Örneğin 300 kalemlik bir mutfak gereçleri tedarikçisi düşünün. Her sezon yirmi bayi aynı e-postaları gönderir: "Yeni renklerin fotoğrafları var mı?", "24 cm'lik tava hangi dosya?", "Fotoğraftaki kapak ürüne dahil mi?" Tedarikçi ise ortak klasör bağlantısı gönderir; dosya adları IMG_4821.jpg, fiyat listesinin sırası da klasörlerle uyuşmaz.

Bayi saatlerini fotoğrafları satırlarla elle eşleştirmeye harcar. Hata neredeyse kaçınılmazdır: yanlış renk yanlış ilanda, ürüne dahil olmayan aksesuarlı bir set fotoğrafı, aynı fotoğrafın iki üründe birden yüklenmesi. Paket, bu işi ürünü en iyi bilen tarafa, yani tedarikçiye taşır.

## Pakette neler olmalı?

| Öğe | Nedir | Bayi neden ister? |
|---|---|---|
| SKU'ya göre fotoğraflar | Her SKU için bir klasör ya da her dosya adında SKU olan tek klasör | Hızlı yükleme, tahmin yok |
| Ürün veri CSV'si | Her SKU bir satır: ad, barkod, renk, beden ve görsel dosya adları | Fotoğrafı ürüne ve fiyat listesine bağlar |
| Kullanım izni notu | Bir sayfa: bayinin neler yapabileceği ve yapamayacağı | İzin sorusunu kapatır |
| Okubeni | Adlandırma kuralı, boyut katmanları, paket tarihi | Yeni çalışan paketi tek başına kullanır |
| Değişiklik günlüğü | Son paketten bu yana eklenen ve değişenler | Bayi yalnızca değişeni günceller |

İlk sürümü küçük tutun. En çok satan 50 ürünü kapsayan doğru bir paket, yarısı eskimiş eksiksiz bir arşivden daha yararlıdır.

## Bayinin sıralayıp arayabileceği dosya adı kuralı

Her dosya için aynı kalıbı kullanın ve okubeni dosyasında yazın. Basit ve okunaklı bir biçim: SKU, ardından görünüm kodu, gerekirse renk kodu.

- SKU-12345_on.jpg
- SKU-12345_yan.jpg
- SKU-12345_arka-kirmizi.jpg
- SKU-12345_detay-sap.jpg

Dikkat edilecekler: yalnızca küçük harf, rakam, tire ve alt çizgi; boşluk ve Türkçe karakter yok, çünkü bazı yükleme sistemleri bunları sorunlu işler; adlarda "son", "yeni" ya da "kopya" yok. SKU başta olduğu için dosyalar yan yana sıralanır ve fiyat listesiyle basit bir arama ile eşleştirilir.

Arama motoru için açıklayıcı dosya adları yardımcı olur, ama tedarikçi paketi bir kaynak dosyadır. Birçok bayi yayınlarken kendi anahtar kelimeli adlarına çevirir. [Ürün fotoğrafları SEO için nasıl adlandırılır](/blog/how-to-name-product-photos-for-seo) yazısı bu ikinci adımın nasıl göründüğünü gösterir; temiz, SKU'lu bir orijinalin neden en iyi başlangıç olduğunu anlarsınız.

## Boyut katmanları: ana dosya, web ve küçük önizleme

Pazaryerleri görsel kurallarını değiştirir; bu yüzden her platforma uyacak tek dosya hazırlamaya çalışmayın. Her fotoğrafa birkaç katman verin ve bayiye neyin ne olduğunu söyleyin. Aşağıdaki değerler önerilen bir başlangıç setidir, platform şartı değildir.

| Katman | Önerilen kullanım | Önerilen özellik (tedarikçinin tercihi) |
|---|---|---|
| Ana dosya | Arşiv ve yeniden kırpma | Orijinal ya da yüksek çözünürlüklü JPEG/PNG, ağır sıkıştırma yok |
| Web | Mağaza ve çoğu pazaryeri | Kare tuval, uzun kenar yaklaşık 2000 px, JPEG |
| Küçük önizleme | Listeler, teklifler, kataloglar | Uzun kenarda yaklaşık 600 px |

Bayilerinizin belirli bir platformda sattığını biliyorsanız, ona göre boyutlandırılmış bir klasör ekleyin. Önce o platformun güncel satıcı yönergesini kontrol edin. Birkaç pazaryerinin beklediği ölçüler için [pazaryeri görsel boyutları](/marketplace-image-sizes) sayfasına bakın. Trendyol ve Hepsiburada kurallarını ayrıntılı görsel kılavuzları herkese açık değil, satıcı panelinde yayınladığı için panelden kontrol edin.

## Çözünürlükten çok tutarlılık

Farklı günlerde, farklı ışıkta çekilmiş bir paket, her dosya net olsa bile bayinin sayfasında kötü görünür. Çekimden önce üç şeyi sabitleyin: arka plan (tüm ürün grubu için aynı beyaz ya da açık gri), açı seti (örneğin ön, yan, arka, detay, ölçek) ve çerçeveleme; ürün kadrajda benzer bir alanı kaplasın. Tripod ya da sabit mesafe kullanın. Sabit açı seti, bayinin "bir fotoğraf daha" istemesini de azaltır.

Varyantlarda her rengi aynı konumda çekin ve renk koduyla adlandırın. Bir rengi çekip bayiye "düzenleyicide rengi değiştirin" demeyin.

## Kullanım izni notu

Fotoğraflar oluşturuldukları anda telif hakkıyla korunur. ABD Telif Hakkı Ofisi SSS sayfası, bir eserin yaratılıp somut bir biçimde sabitlendiği anda korunduğunu ve tescilin isteğe bağlı olduğunu belirtir. Yani bayi dosyalarınızı serbestçe kullanabileceğini varsayamaz; iyi bir bayi soracaktır. Kısa bir not bunu önceden yanıtlar.

Not genellikle şunları kapsar; kendi cümlelerinizle yazın ve ülkenizde bir hukukçuya okutun:

1. Fotoğrafların sahibi kim (siz mi, yoksa size lisans veren bir fotoğrafçı mı).
2. Kimler kullanabilir (ürünlerinizi satan yetkili bayiler).
3. Nerede (kendi mağazası, pazaryerleri, sosyal medya, basılı kataloglar).
4. Neyi değiştirebilir (boyutlandırma, kırpma, yeniden adlandırma; yanıltıcı yazı ya da başka markaların logosunu eklememek).
5. İlişki bittiğinde ne olur (makul bir sürede görselleri kaldırmak).

Bu bir iletişim aracıdır, hukuki tavsiye değildir. Fotoğraflarınızda bir fotoğrafçının işi, model ya da başkasının markası varsa önce kendi haklarınızı doğrulayın.

## Her şeyi birbirine bağlayan CSV

Bayilerin en çok değer verdiği parça CSV'dir. Her SKU için bir satır, sütunlar sabit sırada. Pratik asgari set:

| Sütun | Örnek |
|---|---|
| sku | SKU-12345 |
| barkod | ürünün EAN veya UPC'si varsa |
| urun_adi | kullanılmasını istediğiniz ad |
| renk, beden | varyant alanları |
| gorsel_ana | SKU-12345_on.jpg |
| gorsel_2 ... gorsel_6 | diğer görünümler |
| paket_surumu | 2026-11 |

Bayileriniz Shopify kullanıyorsa bu yapı ürün CSV'sine doğal olarak oturur. Shopify Yardım Merkezi'ne göre ürün CSV'sinde ürün görsel URL'si, görsel sırası, görsel alternatif metni ve ayrı bir varyant görsel URL'si sütunları bulunur; Shopify, içe aktarma sırasında görselleri herkese açık URL'lerden indirip mağazaya yeniden yükler. Alternatif metin en çok 512 karakter olabilir; Shopify 125 veya daha azını önerir. Web katmanınızı herkese açık bir adrese yükleyip URL'leri CSV'ye eklerseniz, bayi tüm seriyi tek seferde içe aktarabilir. Bir ortağa sütun adı vaat etmeden önce Shopify'ın güncel sayfasını okuyun. [Shopify'da CSV mi API mi](/blog/shopify-csv-vs-api-2026) yazısı, bayilere hangi yolu belgelemeniz gerektiğine karar vermenize yardım eder.

Toptan koşulları da sunuyorsanız, ayrı bir ticaret verisi sekmesine GTİP (HS) kodunu ve menşei ekleyin. Bayiniz ya da gümrük müşaviri sınır ötesi siparişlerde bunları kullanır; doğru sınıflandırmayı yetkili bir uzmanla doğrulayın.

## Örnek haftalık iş akışı

Yukarıdaki 300 kalemlik tedarikçi için varsayımsal bir rutin:

1. Yeni veya değişen ürünleri sabit düzenekte çekin.
2. Orijinalleri SKU kuralıyla yeniden adlandırın.
3. Üç katmanı paket klasörlerine dışa aktarın.
4. CSV satırlarını ve paket sürümünü güncelleyin.
5. Test edin: CSV'yi açın, rastgele beş satır seçin ve her dosya adının klasörlerde olduğunu doğrulayın.
6. Paketi tek bir paylaşım bağlantısında yayınlayın ve bayilere iki satırlık değişiklik notu gönderin.

Beşinci adımı çoğu tedarikçi atlar, oysa hataların neredeyse tamamını yakalar.

## Paketi göndermeden önce kontrol listesi

- [ ] Fiyat listesindeki her SKU için pakette en az bir fotoğraf var.
- [ ] Her dosya adı kurala uyuyor, boşluk yok.
- [ ] CSV'deki her dosya adı mevcut ve tersi de doğru.
- [ ] Arka plan ve açı seti tüm ürün grubunda tutarlı.
- [ ] Üçüncü taraf logosu, filigran ya da lisanssız model görünmüyor.
- [ ] Kullanım izni notu ve sürüm tarihi pakette.
- [ ] Eksik fotoğraf isteyen bayiler için tek satırlık iletişim bilgisi var.

## photoZseo nerede işe yarar?

Kendi ürünlerinizi çekiyorsanız photoZseo iPhone ve iPad uygulaması, görünümleri tutarlı tutmak için yedi açılı bir şablon kamera sunar; fotoğrafları 46 pazaryeri için boyutlandırır, sıkıştırır, yeniden adlandırır ve CSV, XLSX veya JSON olarak dışa aktarır. Bayiler isterse B2B PDF teklif de hazırlayabilir. Uygulama için [indirme sayfasına](/download) bakın. Chrome eklentisi, ürün sayfanızda zaten veri varsa fotoğrafları ve ürün bilgisini toplar, ZIP, CSV veya Excel olarak dışa aktarır. Güncel planlar için [fiyatlar](/pricing) sayfasına bakın.

photoZseo'yu yalnızca kullanım hakkınız olan görsellerde kullanın. Pazaryeri adları yalnızca uyumluluğu anlatır; photoZseo hiçbir pazaryeriyle bağlantılı değildir ve onlar tarafından desteklenmez.
