---
title: "E-ticaret için B2B teklif oluşturucu: 2026'da KDV, IBAN, HS kodları ve e-imza"
description: "B2B teklifleri oluşturan bağımsız e-ticaret satıcıları için 2026 referansı - KDV modları, IBAN, HS kodları, Incoterms 2020, e-imza yasallığı ve pratik bir iş akışı."
pubDate: 2026-05-12
readingMinutes: 10
tags: [b2b, quote, vat, hs-codes, incoterms, e-signature]
tldr:
  - "2026'da bağımsız e-ticaret satıcıları (toptancılar, hediyelik eşya zincirleri, otel alıcıları) rutin olarak B2B fiyat teklifi talepleri alıyor ve bir Word belgesi artık güvenilir bir yanıt değil."
  - "Gerçek bir B2B teklifinin 12 özel alana ihtiyacı vardır: alıcı bilgisi, KDV ve ölçü birimi içeren satır öğeleri, HS kodları, Incoterms, ödeme koşulları, IBAN ve denetim takibi içeren bir imza."
  - "Cihazdaki fiyat teklifi oluşturucular (photoZseo'nin Fiyat Teklifi modülü dahil), tek bir belgede HS kodu arama, Incoterms 2020 ön ayarları, AB/İngiltere/ABD/Türkiye KDV modları, IBAN doğrulama ve e-imza ile uyumlu fiyat teklifleri oluşturur."
faqs:
  - q: "B2B teklifindeki e-imzanın 2026'da yasal durumu nedir?"
    a: "AB'de, eIDAS (Yönetmelik 910/2014), Basit Elektronik İmzaya (SES), neredeyse tüm üye ülkelerdeki ticari sözleşmeler için ıslak imzayla aynı yasal ağırlığı vermektedir. ABD'de ESIGN Yasası (2000) ve UETA, elektronik imzalara el yazısı imzayla aynı yasal etkiyi vermektedir. Türkiye'de KVKK ve 5070 sayılı Elektronik İmza Kanunu, nitelikli elektronik imzayı (QES) ıslak imzaya eşdeğer olarak kabul etmektedir."
  - q: "Alıcı aynı ülkedeyse B2B teklifinde HS koduna ihtiyacım var mı?"
    a: "Yasal olarak olmasa da, 2026'daki satın alma ekipleri yine de rutin olarak HS kodunu istiyor. Yeniden ihracatta gümrük vergisini tahmin etmek, ürünü ERP'lerine eşlemek ve kısıtlı mal listelerine uygunluğu filtrelemek için bunu kullanıyorlar. Her teklife (yurtiçi ve uluslararası) HS kodunun dahil edilmesi mesleki varsayılandır."
  - q: "Incoterms FOB, EXW ve DDP arasındaki fark nedir?"
    a: "EXW (Ex Works) — alıcı deponuzdan tahsilat yapar, alıcı her şeyi öder. FOB (Gemide Ücretsiz) - teslimatı belirtilen limana yaparsınız, demiryolunda teslimatı alıcı devralır. DDP (Gümrük Vergisi Ödenmiş Olarak Teslim) — gümrük vergileri ödenmiş olarak alıcının kapısına teslim edersiniz. Incoterms 2020'de toplam 11 terim bulunmaktadır; FOB, EXW ve DDP bağımsız B2B tekliflerinin ~%80'ini kapsar."
  - q: "B2B teklifinde toplam tutarı yazıyla yazmam gerekir mi?"
    a: "Türkiye, Almanya, Fransa, İtalya ve Orta Doğu ülkelerinin çoğunda, faturalarda yazılı tutarın belirtilmesi yasal olarak zorunludur ve fiyat tekliflerinde oldukça gelenekseldir. ABD ve İngiltere'de isteğe bağlıdır. Bunu her fiyat teklifine dahil etmek daha güvenli bir varsayılandır; hiçbir maliyeti yoktur ve bir rakamın yanlış kopyalanması durumunda anlaşmazlıkları önler."
  - q: "2026'da Almanya'dan Fransa'daki bir alıcıya satış yaparsam hangi KDV modu uygulanır?"
    a: "AB OSS (Tek Noktadan Hizmet) rejimi kapsamında, AB'deki KDV'ye kayıtlı işletmeler arasındaki B2B satışları ters ücretlendirme mekanizmasını kullanır; %0 KDV üzerinden fatura kesersiniz ve alıcı bunu kendi beyanında hesaplar. Alıcının KDV numarasını kaydetmeli ve bunu VIES sistemi aracılığıyla doğrulamalısınız. B2C için, alıcının ülke KDV oranını OSS'nin üç aylık beyannamesi aracılığıyla tahsil edersiniz."
---

B2B talebi bu şekilde ortaya çıkıyor. Bir toptancı e-posta gönderiyor: "Etsy'de mağazanızı gördük. Ağustos ayına kadar Brüksel depomuza teslim edilecek 100 adet için fiyat teklifi gönderebilir misiniz?"

2026 yılında Word belgesi ve PayPal bağlantısıyla yanıt veren satıcı sözleşmeyi kaybeder. Tedarik ekibinin KDV, IBAN, HS kodları, Incoterms ve imza içeren bir fiyat teklifine ihtiyacı var; bu, bir $50M tedarikçisinden aldıkları paketin aynısıdır. Bağımsız satıcıların çoğu bu barın ne kadar yakın olduğunun farkında değil.

Bu parça referanstır: 2026'da bir B2B teklifinde neler olacak, yasal olarak gerekenler ve telefonunuzdan beş dakikadan kısa bir sürede bir teklifin nasıl oluşturulacağı.

## Bağımsız satıcıların neden Word belgelerine değil de gerçek fiyat tekliflerine ihtiyacı var?

Üç güç bir araya geldi. Tedarik dijitalleştirildi — ERP sistemleri (SAP S/4HANA, Dynamics 365, Odoo), satır başına KDV ve HS kodu içeren yapılandırılmış teklif verileri bekler. Gümrükler daha da sıkılaştı — AB CBAM ve ICS2, birçok kategori için teklif aşamasında HS kodları gerektiriyor. Alıcılar denetim izleri istiyor; imzalı, zaman damgalı bir fiyat teklifi gelecekteki bir anlaşmazlıktan kurtulur; bir Word belgesi bunu yapmaz.

Sonuç: Beş dakika içinde uyumlu bir B2B teklifi üretebilen bağımsız bir satıcı, bir sonraki aşamadaki tedarikçiye giden sözleşmeleri kazanıyor.

## B2B teklifinin anatomisi

Bir alıcının satın alma ekibi on iki alanı kontrol ediyor. Birini kaçırırsanız fiyat teklifi revizyon için geri döner; bu da satışı 2-5 iş günü yavaşlatır.

| # | Alan | Bu ne | Neden önemli? |
|---|------|------------|----------------|
| 1 | Teklif numarası | Teklif başına benzersiz tanımlayıcı | Tedarik dosyalama, anlaşmazlık takibi |
| 2 | Teklif tarihi + geçerlilik tarihine kadar | Teklif verildiğinde ve fiyatların süresi dolduğunda | Bir pencerenin fiyatı kilitleniyor |
| 3 | Satıcı bloğu | Yasal ad, adres, KDV numarası, irtibat kişisi, vergi dairesi | Yasal karşı taraf kimliği |
| 4 | Alıcı bloğu | Alıcının yasal adı, adresi, KDV numarası, iletişim kişisi | Karşı taraf + ters ödemeli KDV tespiti |
| 5 | Satır öğeleri | Satır başına: SKU, açıklama, miktar, birim, birim fiyat, KDV oranı, GTİP kodu, satır toplamı | Gerçek teslim edilebilir |
| 6 | Ara toplam, KDV, toplam | Matematik özeti | Tedarik PO ile mutabakata varıyor |
| 7 | Para birimi | ISO 4217 kodu | Döviz kuru anlaşmazlıklarını önler |
| 8 | Kelimelerle miktar | "Kırk iki bin beş yüz euro" | Dolandırıcılığın önlenmesi; birçok yargı bölgesinde gerekli |
| 9 | Incoterm | 2020 dönemi (örn. FOB Hamburg, DDP Brüksel) | Nakliye/gümrük için kimin ne ödeyeceğini tanımlar |
| 10 | Ödeme koşulları | Net-30, %50 peşin vb. | Nakit akışı sözleşmesi |
| 11 | IBAN / bankacılık | IBAN, SWIFT/BIC, banka adı | Alıcının parayı nereye havale ettiği |
| 12 | İmza | Islak veya elektronik, zaman damgalı | Yasal bağlayıcı |

On iki alan. 2026'daki her B2B teklifinin on ikisine de ihtiyacı var.

## 2026'da KDV modları

KDV (satış vergisi), bağımsız satıcıların en sık yanıldığı alandır. 2026 haritası.

| Bölge | Mod | Uygulandığında | Oran örnekleri |
|--------|------|-----------------|---------------|
| AB üye devleti | Yurtiçi KDV | Aynı ülke, B2B veya B2C | %19 (DE), %20 (FR, IT), %21 (NL, ES, BE) |
| AB sınır ötesi B2B | Ters ücret (faturada %0) | AB satıcısı → AB alıcısı, her ikisi de KDV'ye kayıtlı | %0 (VIES aracılığıyla doğrulandı) |
| AB sınır ötesi B2C | OSS (Tek Durak Mağazası) | AB satıcısı → başka bir AB ülkesindeki tüketici | OSS aracılığıyla beyan edilen alıcı-ülke oranı |
| AB ithalatı | IOSS (Tek Noktadan İthalat) | AB dışı satıcı → AB tüketicisi, ≤150€ | IOSS aracılığıyla beyan edilen alıcı-ülke oranı |
| İngiltere | Birleşik Krallık KDV'si | Birleşik Krallık arzı (Brexit sonrası) | %20 standart, %5 indirimli, %0 sıfır oranlı |
| BİZ | Satış vergisi | Eyalet düzeyinde, bağa göre değişir | duruma bağlı olarak %0–%11 |
| Türkiye | KDV | Yurt içi + seçili ihracat | 1%, 10%, 20% |
| Kanada | GST/HST/QST | Federal + eyalet | %5 GST + il katkısı |
| Avustralya | GST | Standart | 10% |
| BAE / Suudi | KDV | Standart | %5 (BAE), %15 (KSA) |

2026'daki bir B2B fiyat teklifi, başlık düzeyinde KDV modunu (ör. "Ters ödeme - AB topluluk içi tedarik, AB KDV Direktifi Madde 138") ve oran değişirse satır öğesi başına ücreti beyan etmelidir.

## HS kodları — gümrükler neden bunlar olmadan gönderileri engelliyor?

Harmonize Sistem kodu, ticareti yapılan her ürünü sınıflandıran 6 ila 10 haneli bir sayıdır. İlk 6 hane dünya çapında standartlaştırılmıştır (WCO); 7-10 arası rakamlar ülkeye özgüdür (AB TARIC, ABD HTSUS).

Örnekler: 9603.10 (el işi fırçaları), 6109.10 (pamuklu tişörtler), 4202.32 (cüzdanlar), 9405.41 (LED lambalar).

Gümrük, gümrük vergisini hesaplamak, ticaret anlaşmalarını (AB-Japonya EPA, USMCA, RCEP) uygulamak ve kısıtlı malları taramak için HS kodunu kullanır. Yanlış HS koduna sahip bir gönderi 5-30 gün süreyle bekletilebilir. HS kodu olmayan bir gönderi, tedarik edilene kadar bekletilir.

2026'nın en iyi uygulaması: Ürün katılımı sırasında SKU başına HS kodunu arayın, bunu ürün veritabanında saklayın ve her fiyat teklifine yazdırın. photoZseo'nin Teklif modülü, HS aramasını ürün düzeyinde entegre eder, böylece kod bir kez ayarlanır ve her teklife yayılır.

## Incoterms 2020 hızlı referansı

Incoterms 2020 11 terimi tanımlamaktadır. Üçü bağımsız B2B alıntılarının ~%80'ini kapsıyor:

| Terim | Anlam | Nakliyeyi kim ödüyor | Gümrükleri kim ödüyor |
|------|---------|-------------------|------------------|
| EXW | Ex Works — alıcı stüdyonuzdan teslim alır | Alıcı | Alıcı |
| FOB | Gemide Ücretsiz (adlandırılmış bağlantı noktası) | Satıcıdan limana, sonra alıcıya | Alıcı (limandan sonra) |
| DDP | Görevi Ödenerek Teslim Edildi — kapıdan kapıya, hepsi bir arada | Satıcı | Satıcı |

Diğer sekizi (CIF, CIP, DAP, DPU, FCA, CPT, CFR, FAS) endüstriyel ticarette yaygındır ancak bağımsız fiyat tekliflerinde nadiren yer alır. Şüpheye düştüğünüzde, yerel teslim alma için EXW, ihracat için FOB, premium teslimat için DDP teklifleri.

## E-imza yasal durumu

Ticari belgelerde elektronik imzaya ilişkin 2026 yasal haritası:

| Bölge | Geçerli hukuk | Durum |
|--------|---------------|--------|
| AB | eIDAS Yönetmeliği 910/2014 | SES, AES, QES'in tümü geçerlidir; QES = ıslak imza |
| İngiltere | Elektronik İletişim Yasası 2000 | Çoğu ticari sözleşme için geçerlidir |
| BİZ | ESIGN Yasası + UETA | Islak imzaya eşdeğer |
| Türkiye | Elektronik İmza Kanunu 5070 | QES = ıslak imza |
| Kanada / Avustralya / BAE / Hindistan | Yerel yasalar | Elektronik imzalar tanındı |

İki özel şirket arasındaki B2B fiyat teklifi için, zaman damgası ve cihaz denetim takibi içeren basit bir elektronik imza neredeyse her yetki alanında yeterlidir. Düzenlemeye tabi endüstriler (ilaç, savunma, finansal hizmetler) genellikle bağımsız satıcı kapsamı dışında bir AB güven listesi sağlayıcısından Nitelikli Elektronik İmza (QES) gerektirir.

photoZseo'nin Teklif modülü, PDF'ye zaman damgası ve cihaz tanımlayıcıyla birlikte parmakla çizilmiş bir imza yerleştirir. El sanatları, moda, aksesuarlar ve toptan tüketim malları için bu, AB, Birleşik Krallık, ABD, Türkiye, Kanada, Avustralya ve MENA'nın çoğunda sözleşmeye bağlı olarak bağlayıcıdır.

## photoZseo ile pratik iş akışı

2026'da uçtan uca fiyat teklifi oluşturma:

1. Alıcı, kişi seçiciden otomatik doldurmaları engeller (isim, adres, KDV numarası, e-posta).
2. Gönderen profili ön doldurmaları: yasal adınız, adresiniz, KDV numaranız, IBAN'ınız, vergi daireniz. Bir kez yapılandırıldı.
3. Satır öğeleri ekleyin: SKU, miktar, birim (adet/kg/m/top — tam BM kodu listesi), birim fiyat, KDV oranı, satır başına HS kodu.
4. 11 terimli menüden Incoterm'i seçin ve limanı/yeri adlandırın (örn. "FOB Hamburg").
5. Ödeme koşulları, para birimi, geçerlilik aralığı — Net-30, USD/EUR, 14 gün varsayılan.
6. Ara toplam, KDV, toplam otomatik hesaplama. Kelimelerdeki miktar, etkin uygulama dilinde otomatik olarak oluşturulur.
7. Parmağınızla veya Apple Pencil ile imzalayın; Şahsen yapılan anlaşmalar için isteğe bağlı alıcı imza alanı.
8. PDF'yi dışa aktarın - e-posta, AirDrop, WhatsApp Business veya iCloud Drive.

10 satırlık bir teklifin toplam süresi: 3–5 dakika, 12 alanın tümü doldurulmuş, PDF meta verilerinde denetim izi.

## Pratik bir kontrol listesi

Bir B2B teklifi göndermeden önce şunları onaylayın:

- [ ] Teklif numarası benzersiz ve sıralıdır.
- [ ] Geçerlilik tarihi belirlenene kadar (varsayılan 14 gün veya alıcının istediği gün).
- [ ] Alıcının KDV Numarası doğrulandı (AB için VIES, Birleşik Krallık için HMRC).
- [ ] Siparişin sınırı geçmesi durumunda her satırın bir HS kodu vardır.
- [ ] KDV modu doğrudur — yurt içi, ters ödeme, OSS veya sıfır oranlı ihracat.
- [ ] Incoterm, şehri/limanı yalnızca "FOB" değil, "FOB Hamburg" olarak adlandırır.
- [ ] Ödeme koşulları, varsa peşin yüzdeyi belirtir.
- [ ] IBAN ve SWIFT doğru (bir rakam yanlış = hiçbir yere gitmeyen bir kablo).
- [ ] Kelimelerdeki miktar sayısal toplamla eşleşir.
- [ ] İmza bir zaman damgasıyla birlikte sunuluyor.

Eğer on tanesi de kontrol ederse, teklif tedarik için hazır demektir.

## Paket servis

2026'da bağımsız e-ticaret satıcıları için B2B fırsatı gerçek ve büyüyor. Toptancılar, oteller, hediyelik eşya dükkanları, kurumsal hediye alıcıları ve ticari alıcılar Etsy, Instagram, TikTok Shop ve Shopify aracılığıyla bağımsız markalar buluyor ve geniş ölçekte satın almak istiyorlar. Engel, zaten satın aldıkları tedarikçiye benzeyen bir fiyat teklifi üretmektir.

12 alanlı, KDV'si doğru, HS kodlu, e-imzalı PDF artık yalnızca işletmelerin ürettiği bir şey değil. 2026'da bu, bağımsız bir satıcının telefonundan ikinci dilinde beş dakikadan kısa bir sürede yazdığı bir şey.

Bunu içselleştiren satıcılar, hâlâ Word belgesine sayı yapıştıran satıcılardan farklı bir düzeyde çalışıyorlar.

---

photoZseo, iPhone ve iPad için App Store'dedir.
