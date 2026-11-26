---
title: "2026'da Amazon ürün fotoğrafı gereksinimleri"
description: "Amazon'un ürün görselleri üzerinde uyguladığı tam boyutlar, dosya türleri ve arka plan kuralları ve bunların ilk yüklemede nasıl iletileceği."
pubDate: 2026-05-08
readingMinutes: 5
tags: [amazon, product-photos, seo]
tldr:
  - "Amazon'un ana görseli minimum 1000×1000 (2000×2000 önerilir), 1:1 kare, saf beyaz #FFFFFF arka plan, JPEG, sRGB, 10 MB'ın altında olmalıdır."
  - "En hızlı reddetme nedenleri: gerçek beyaz yerine beyaza yakın, ürünün çerçevenin %85'inden küçük olması, ana görüntüde filigran veya metin."
  - "Sıkıştırma sonrasında görüntü başına 600 KB'nin altında kalın — Amazon'un CDN'si, daha büyük olan her şeyi ve sayfa hızı ağırlıklarını dönüşüm sıralamanıza yeniden kodlar."
faqs:
  - q: "Amazon ürün fotoğrafları için minimum görsel boyutu nedir?"
    a: "En uzun kenardaki 1000 piksel mutlak minimum değerdir. Bunun altında Amazon, listelemenizdeki yakınlaştırma özelliğini devre dışı bırakır ve yakınlaştırmasız listelemelerin sıralaması algoritma tarafından düşürülür. Amazon'un yumuşamadan yeniden sıkıştırması için yer açmak için 2000×2000'i hedefleyin."
  - q: "Amazon listeleri için JPEG mi yoksa PNG mi daha iyi?"
    a: "JPEG'dir. Amazon TIFF, PNG ve GIF'i de kabul eder, ancak JPEG daha küçük sıkıştırılır, Amazon'un CDN'sinde daha hızlı işlenir ve #FFFFFF arka planında şeffaflık avantajı yoktur. sRGB renk alanında, kalite 80-85'te kaydedin."
  - q: "Amazon her fotoğraf için saf beyaz arka planlar gerektiriyor mu?"
    a: "Yalnızca ana görsel; Amazon'un otomatik kontrollerde uyguladığı kural budur. İkincil görseller ürünü bağlam içinde, model üzerinde, ambalajla birlikte veya yaşam tarzı sahnelerinde gösterebilir. İlk fotoğraf kapı bekçisidir."
  - q: "Ürün çerçevede ne kadar büyük olmalı?"
    a: "Amazon'un kılavuzu görselin en az %85'ini oluşturur. Bundan daha küçük ürünler genellikle otomatik incelemede başarısız olur veya kategori denetimlerinde manuel olarak işaretlenir. Ürünü ortalayın ve sıkı bir şekilde kırpın."
  - q: "HEIC fotoğraflarını iPhone'umdan Amazon'a yükleyebilir miyim?"
    a: "Hayır. Amazon, JPEG, TIFF, PNG veya GIF'i bekler. Yüklemeden önce HEIC'i JPEG'e dönüştürün — photoZseo'nin Amazon ön ayarı bunu otomatik olarak yapar ve gözle görülür bir kalite kaybı olmadan dosyayı 200-600 KB'ye kısaltır."
---

Amazon, çoğu satıcı görmeden listeleri reddeder. Suçlu neredeyse her zaman fotoğraftır; çok ağır bir dosya, tam anlamıyla beyaz olmayan bir arka plan veya platformun sessizce reddettiği bir en boy oranı.

İşte Amazon'un satıcı belgelerinden alınan ve canlı listelemelerle test edilen 2026 spesifikasyon hile sayfası.

## Ana görüntü kuralları

- Boyutlar: Minimum 1000×1000, 2000×2000 önerilir. En uzun tarafta 1000'in altında Amazon yakınlaştırmayı etkinleştirmiyor ve algoritma, yakınlaştırmasız listeleri daha düşük kaliteli olarak değerlendiriyor.
- En boy oranı: Ana görüntü için kare (1:1). İkincil görüntüler 4:5 veya 16:9 olabilir.
- Arka plan: Saf beyaz, altıgen `#FFFFFF`. "Beyaza yakın" fotoğraflanan stüdyolar, otomatik kontrollerde satıcıların beklediğinden daha sık başarısız oluyor.
- Format: JPEG (`.jpg`) en güvenli seçimdir. TIFF, PNG ve GIF kabul edilir ancak JPEG, Amazon'un CDN'sinde daha iyi sıkıştırılır ve daha hızlı işlenir.
- Renk alanı: sRGB. Adobe RGB veya ProPhoto'ya kaydedilen görüntüler, Amazon'un yeniden kodlamasından sonra donuk görünüyor.
- Dosya boyutu: Resim başına 10 MB'ın altında. Sıkıştırmadan sonra 200-600 KB'yi hedefleyin; büyük dosyalar ürün sayfasının yüklenmesini yavaşlatır ve sayfa hızı ağırlıkları dönüşüme dönüşür.

## Bir listelemenin engellenmesine ne sebep olur?

1. Ürün resminde filigranlar, metin kaplamaları veya logolar.
2. Müşterinin alacağına dahil olmayan aksesuarlar.
3. Ana görüntü için saf beyaz dışında herhangi bir kenarlık, çerçeve veya arka plan.
4. Ürün, görüntü çerçevesinin %85'inden azını kaplıyor.
5. Mankenler (giysi için) veya görünür destek teçhizatları.

## photoZseo spesifikasyonu nasıl uygular?

photoZseo içindeki Amazon ön ayarı aynı anda dört şeyi yapar:

1. Ürünün tuvalin %85'inde ortalandığı kare bir çerçeveye kırpılır.
2. En uzun kenarı 2000 piksele yeniden boyutlandırır (kaynak daha küçükse akıllıca büyütülür).
3. sRGB kalitesinde, 85 kalitesinde, genellikle 250-450 KB boyutunda temiz bir JPEG yazar.
4. Arka plan kaldırma etkinse, fotoğrafını çektiğiniz arka planı saf #FFFFFF ile değiştirir ve ürünün kesilip yapıştırılmış gibi görünmemesi için kenarları yumuşatır.

Tüm boru hattı telefonda çalışıyor. Hiçbir şey cihazınızdan ayrılmaz.

## Hızlı bir uyumluluk kontrol listesi

Yüklemeden önce şunları onaylayın:

- [ ] En uzun kenar ≥1000 pikseldir (2000 piksel tercih edilir)
- [ ] Arka plan bir "beyaz seçici" testini geçer; dört köşe `#FFFFFF` olarak okunur
- [ ] Dosya 10 MB'ın altında ve JPEG olarak kaydedildi
- [ ] Ana görüntünün en boy oranı 1:1'dir
- [ ] Metin, filigran veya çerçeve yok

Beşi de kontrol ederse, liste ilk denemede Amazon'un otomatik doğrulamasını geçecektir ve lansman zamanlamasını bozan ileri geri hareketini atlamış olursunuz.
