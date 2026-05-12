import type { HomeContent } from '../home';

const tr: HomeContent = {
  nav: {
    features: 'Özellikler', pricing: 'Fiyatlandırma', faq: 'SSS',
    blog: 'Blog', support: 'Destek', getApp: 'Uygulamayı İndir',
  },
  hero: {
    eyebrow: 'Artık iPhone · iPad · Mac üzerinde',
    h1Line1Words: ['Bir', 'kez', 'listele.'],
    h1Line2Words: ['46+', 'pazaryerinde', 'sat.'],
    h1A11y: 'Bir kez listele. 46+ pazaryerinde sat.',
    sub: 'Stüdyo kalitesinde ürün fotoğrafları, yapay zekâ ile yazılmış SEO, B2B teklifleri ve her platforma uygun dışa aktarımlar — hepsi iPhone’unla. Bilgisayar yok. Tablo yok. Bulut yok.',
    btnAppSmall: 'İndir:',
    btnAppBig: 'App Store',
    ctaTrial: '3 gün ücretsiz deneme',
    ctaCard: 'Kart yok · İstediğin zaman iptal',
    bullets: [
      'Oranını seç — JPEG, PNG ve WebP birlikte dışa aktarılır',
      'Yapay zekâ tek fotoğraftan 13 SEO alanını dolduruyor',
      '46+ pazaryeri, tek dokunuş · %100 cihaz üstünde · çevrimdışı çalışır',
    ],
  },
  pain: {
    kicker: 'Neden var?',
    title: 'Her pazaryerinde satış yapmak bozuk bir sistem.',
    sub: 'Sen bir satıcısın, Photoshop teknisyeni değil. photoZseo o saatleri sana geri veriyor.',
    cards: [
      {
        bad: '"Her platform için fotoğraf düzenlemek bütün akşamımı alıyor."',
        goodTitle: 'Yapay zekâ 2 saniyede yapıyor.',
        goodDesc: 'Arka plan algılama, kırpma, beyaz dengesi, dışa aktarım boyutları — her platform için otomatik.',
      },
      {
        bad: '"Her pazaryeri için başlığı, etiketleri ve açıklamayı tekrar tekrar yazıyorum."',
        goodTitle: 'Tek fotoğraf. 13 SEO alanı. Dolduruldu.',
        goodDesc: 'Başlık, slug, meta, alt metin, anahtar kelimeler — cihaz üstünde çalışan yapay zekâ, 12 dilde yazıyor.',
      },
      {
        bad: '"B2B tekliflerim utanç verici bir Word belgesi gibi duruyor."',
        goodTitle: 'Markalı PDF’ler 3 adımda.',
        goodDesc: 'VAT, IBAN, HS kodları, e-imza, tutar yazıyla — Fortune 500 faturası gibi görünüyor.',
      },
    ],
  },
  features: {
    sectionKicker: 'Tüm özellikler, tek bir kaydırmada',
    sectionTitle: 'On özellik. Tek bir kaydırma.',
    sectionSub: 'Yatay kaydır. Mobilde dikey akış.',
    seeInAction: 'İş başında gör →',
    items: [
      {
        eyebrow: '46+ Pazaryeri',
        h: 'Bir kez listele. Her yerde sat.',
        sub: 'Tek bir fotoğraf, 46+ pazaryerine hazır listeye dönüşür — her platform için boyutlandırılmış, isimlendirilmiş ve SEO etiketli.',
        bullets: [
          'Amazon · Shopify · Etsy · Walmart · eBay · Trendyol',
          'Sınır ötesi: Temu · SHEIN · DHgate · Tmall · 1688',
          'CSV / XLSX / JSON — ürün başına ayrı veya birleşik',
        ],
      },
      {
        eyebrow: 'AI Kamera · Tek Çekim, Her Format',
        h: 'Tek deklanşör basışı. Her format aynı anda.',
        sub: 'Oranını seç (1:1, 4:5, 9:16 ya da 3:4). Deklanşöre bir kez bas — photoZseo JPEG, PNG ve WebP\'yi paralel yazar ve her pazaryeri için yeniden boyutlandırır. Yeniden çekim yok, toplu dışa aktarım yok.',
        bullets: [
          'Tek çekim → JPEG + PNG + WebP, birlikte kaydedilir',
          'Dışa aktarımda platform başına yeniden boyutlandırma: Amazon, Shopify, Etsy, Instagram…',
          'AE Lock · WB Auto · Arka plan algılama · Otomatik özne ortalama',
          'Burst, ses tuşu deklanşörü, grid + tesviye katmanı · %100 çevrimdışı',
        ],
      },
      {
        eyebrow: 'AI SEO Otomatik Doldurma',
        h: '13 alanı saniyeler içinde doldur.',
        sub: 'Bir fotoğraf at. photoZseo başlığı, slug’ı, meta açıklamayı, alt metni, etiketleri ve anahtar kelimeleri arama için optimize ederek anında yazar.',
        bullets: [
          'Cihaz üstünde OCR + Vision: barkod, marka, malzeme, renk',
          'SEO seviyesinde başlık, slug, meta, alt metin ve uzun kuyruklu anahtar kelimeler',
          '12 dil — yerel kurallara uygun çıktılar',
        ],
      },
      {
        eyebrow: 'B2B Teklif Oluşturucu',
        h: '3 adımda markalı PDF teklifler.',
        sub: 'Ürünleri seç, alıcıyı ekle, paylaş. VAT, IBAN, Incoterms, HS kodları ve e-imza — hepsi şık, markalı bir PDF üzerinde.',
        bullets: [
          'Satır başına VAT · birim · HS kodu · menşe ülke',
          'Logo, IBAN, Incoterms ile gönderici profili — bir kez kaydet',
          'Tutar yazıyla, e-imza, ardışık teklif numaraları',
        ],
      },
      {
        eyebrow: 'Satış Yapan Story’ler',
        h: 'WhatsApp, Telegram ve Instagram — tek dokunuş.',
        sub: 'Her kişi için durum/story kuyruğu oluştur. Instagram için 9:16, WeChat için 1:1, RED için 3:4 — otomatik biçimlendirilir.',
        bullets: [
          'Akıllı çıkartmalar: fiyat, rozet, indirim, yeni gelen',
          'Kişi başına 7 günlük bekleme süreli round-robin kuyruk',
          'Stories’e, kataloga paylaş veya yerel olarak kaydet',
        ],
      },
      {
        eyebrow: 'Ürün Detayı',
        h: 'Profesyonel gibi yönet.',
        sub: 'Bir ürün, her kanal. Fotoğraflar, fiyatlar, SEO, EXIF ve story’ler tek bir özenle düzenlenmiş kayıtta yaşar.',
        bullets: [
          'Fotoğraf karuseli, medya denetçisi, EXIF satır içi düzenleyici',
          'Ürün başına markup, MSRP, B2B fiyat, VAT modu',
          'Teklif, Story, Katalog veya Pazaryerine hızlı paylaş',
        ],
      },
      {
        eyebrow: 'Profesyonel Metadata',
        h: 'Her karede kamera seviyesinde EXIF.',
        sub: 'Her platform için EXIF, boyutlar ve format yazılır. GPS otomatik olarak silinir. IPTC ve Artist etiketleri korunur.',
        bullets: [
          'Satır içi düzenlenebilen 9 EXIF alanı (Artist, Copyright, Software…)',
          'Dışa aktarımda GPS verisi varsayılan olarak temizlenir — önce gizlilik',
          'Her çekim aynı anda JPEG + PNG + WebP olarak kaydedilir — yeniden dışa aktarım yok, kalite kaybı yok',
        ],
      },
      {
        eyebrow: 'Evrensel Uygulama',
        h: 'iPhone. iPad. Mac.',
        sub: 'iOS 17+, iPadOS ve Mac Catalyst. Sürükle, bırak, çoklu seçim, kenar çubuğu, denetçi — iCloud Drive ile senkron.',
        bullets: [
          'iPad ve Mac’te sürükle-bırak · çoklu seçimle dışa aktarım',
          'Klavye kısayolları, sağ tık menüleri, kenar çubuğu navigasyonu',
          'iCloud Drive senkronu — her cihazda, asla kaybolmaz',
        ],
      },
      {
        eyebrow: 'Önce Gizlilik',
        h: 'Takip yok. Reklam yok. Bulut yok.',
        sub: 'Buluta güvenmeyen satıcılar için yapıldı. GDPR, KVKK ve CCPA uyumlu. 4 RTL alfabesi dahil 12 dil.',
        bullets: [
          'GDPR · KVKK · CCPA — analiz yok, üçüncü taraf SDK yok',
          'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
          'Yapay zekâ cihaz üstünde çalışır — fotoğrafların asla cihazını terk etmez',
        ],
      },
      {
        eyebrow: 'Fiyatlandırma',
        h: 'Başlangıçta ücretsiz. Hazır olunca Pro.',
        sub: 'Ücretsiz başla. Sadece her pazaryerine dışa aktarmaya hazır olduğunda yükselt. İstediğin zaman iptal, deneme için kart gerekmez.',
        bullets: [
          'Çekim, organizasyon ve temel dışa aktarım sonsuza dek ücretsiz',
          'Pro 46+ pazaryeri formatı, AI SEO, B2B teklif ekler',
          '3 gün ücretsiz deneme · $39.99/yıl · ayda yalnızca $3.33',
        ],
      },
    ],
  },
  bento: {
    headKicker: 'Sadece ekran görüntülerinden ibaret değil',
    headTitle: 'Bir güç aleti gibi yapıldı, bir uygulama gibi fiyatlandırıldı.',
    headSub: 'Aşağıdaki her bölüm bugün hazır olan bir özelliktir — yol haritası yok, bekleme listesi yok.',
    csv: {
      label: 'CSV · XLSX · JSON',
      sub: 'pazaryeri formatları — başlığı bir kez yaz, tüm sütunlar dolsun.',
    },
    exif: {
      label: 'Kamera Seviyesinde EXIF',
      gpsStripped: '— TEMİZLENDİ —',
    },
    langs: {
      label: '12 Dil · 3 RTL',
      sublabel: 'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
    },
    stats: {
      label: 'Bağımsız satıcılar için yapıldı',
      marketplaces: 'pazaryeri',
      seoFields: 'fotoğraf başına SEO alanı',
      devices: 'cihaz · tek uygulama',
      noTrackers: 'tracker · reklam · bulut',
    },
  },
  seoDemo: {
    kicker: 'Etkileşimli · Canlı',
    title: 'AI’ın 13 SEO alanını nasıl doldurduğunu izle.',
    sub: 'Bir ürün seç. photoZseo’nun pazaryerinin ihtiyacı olan her alanı — başlık, slug, kategori, meta, tam açıklama, alt metin, etiketler, anahtar kelimeler ve barkod — nasıl yazdığını izle. Kopyalamak için herhangi bir alana dokun.',
    inputLabel: 'Ürün adı',
    inputPlaceholder: 'Bir ürün adı yaz…',
    btnIdle: '✨ 13 SEO alanını otomatik doldur',
    btnBusy: 'Oluşturuluyor…',
    note: 'Cihaz üstünde · %100 gizli · 12 dil',
    fieldLabels: {
      title: 'SEO Başlığı',
      slug: 'Slug',
      filename: 'Dosya Adı (URL)',
      category: 'Kategori',
      meta: 'Meta Açıklama',
      description: 'Açıklama',
      alt: 'Alt Metin',
      tag1: 'Etiket 1',
      tag2: 'Etiket 2',
      tag3: 'Etiket 3',
      tag4: 'Etiket 4',
      keywords: 'Anahtar Kelimeler',
      barcode: 'Barkod',
    },
  },
  stats: {
    kicker: 'Ürünü hareket ettiren rakamlar',
    title: 'Bağımsız bir satıcı tarafından tasarlandı.\n12 ülkedeki alıcılar tarafından test edildi.',
    labels: {
      marketplaces: 'Pazaryerleri ve kanallar',
      seoFields: 'Fotoğraf başına SEO alanı',
      languages: 'Dil — RTL dahil',
      zero: 'Reklam. Tracker. Toplanan veri.',
    },
    pills: {
      gdpr: 'GDPR', kvkk: 'KVKK', ccpa: 'CCPA',
      wcag: 'WCAG 2.1 AA', noTracking: 'Asla takip yok',
    },
  },
  pricing: {
    kicker: 'Fiyatlandırma',
    title: 'Daha hızlı sat — filigran yok, sınır yok.',
    sub: 'Üç plan, tek Pro deneyim. Yıllık planı 3 gün ücretsiz dene, sonra aylık yalnızca $3.33 — istediğin zaman Ayarlar’dan iptal et.',
    badge: 'En iyi değer · %52 tasarruf',
    plans: [
      {
        name: 'Haftalık',
        pricePer: '$2.99/hafta',
        features: [
          'Tam Pro erişim',
          'Bir hafta boyunca dene',
          'Ayarlar’dan istediğin zaman iptal',
          '— Uzun vadeli taahhüt yok',
        ],
        cta: 'Haftalığı Başlat',
      },
      {
        name: 'Aylık',
        pricePer: '$6.99/ay',
        features: [
          'Tam Pro erişim',
          'Aylık faturalı, istediğin zaman iptal',
          'Yıllık ile aynı özellikler',
          '— Yıllık plan ile %52 tasarruf',
        ],
        cta: 'Aylığı Seç',
      },
      {
        name: 'Yıllık',
        pricePer: '$39.99/yıl',
        trial: '3 gün ücretsiz deneme · ayda yalnızca $3.33 · %52 tasarruf',
        featured: true,
        features: [
          '**Filigranı kaldır** tüm dışa aktarımlarda',
          '**Toplu dışa aktar** her fotoğrafı tek seferde',
          '**CSV + XLSX** 46+ pazaryeri için',
          '**Video + Pro Araçlar** (kamera stüdyosu, arka plan kaldırma)',
          'AI SEO otomatik doldurma (13 alan, 12 dil)',
          'B2B teklif oluşturucu (VAT, IBAN, HS, e-imza)',
          'Story’ler ve Akıllı Çıkartmalar',
          'EXIF düzenleyici ve metadata pipeline',
          'iPhone, iPad ve Mac evrensel',
          'iCloud Drive senkronu',
        ],
        cta: '3 gün ücretsiz denemeyi başlat',
      },
    ],
    note: 'Fiyatlar USD cinsindendir. App Store’da yerel fiyatlandırma uygulanır (örn. Türkiye’de ₺39.99/yıl). Aile Paylaşımı desteklenir. Abonelikler dönem bitiminden en az 24 saat önce iptal edilmediğinde otomatik yenilenir — Ayarlar → Apple ID → Abonelikler bölümünden yönet.',
  },
  faq: {
    kicker: 'Sorular',
    title: 'Sormak istediğin her şey.',
    items: [
      {
        q: 'photoZseo internet olmadan çalışır mı?',
        a: 'Evet. Fotoğraf çekimi, düzenleme, AI SEO otomatik doldurma, EXIF ve dışa aktarımların tümü Apple Foundation Models ve Vision kullanılarak %100 cihaz üstünde çalışır. İnternet sadece uzaktaki bir pazaryerine aktif olarak gönderim yaparken gereklidir.',
      },
      {
        q: 'Aynı anda Amazon, Shopify ve Etsy’ye dışa aktarabilir miyim?',
        a: 'Evet. Ürünleri seç, platformları seç, Dışa Aktar’a bas. photoZseo, her platformun tam sütun sırasında CSV/XLSX/JSON yazar, ayrıca platform başına resim boyutları — ürün başına ayrı veya tek bir birleşik dosya olarak.',
      },
      {
        q: 'Fotoğraflarım veya ürün verilerim herhangi bir yere yükleniyor mu?',
        a: 'Hayır. Sıfır üçüncü taraf analiz, sıfır takip SDK’sı ve bulut hesabı yok. Tek dış ağ bağlantısı abonelik için App Store / RevenueCat ve seçeneğe bağlı, kendi iCloud’unda kalan iCloud Drive senkronudur.',
      },
      {
        q: 'iPad ve Mac’te çalışır mı yoksa sadece iPhone mu?',
        a: 'Üçünde de. photoZseo evrensel bir uygulamadır — aynı satın alma iPhone, iPad ve Mac (Catalyst) kapsar. Sürükle-bırak, çoklu seçim, klavye kısayolları ve denetçi paneli iPad ve Mac’te birinci sınıftır.',
      },
      {
        q: '3 günlük ücretsiz denemede tam olarak ne var?',
        a: 'Pro’daki her şey. 46+ pazaryeri formatı, AI SEO otomatik doldurma, B2B teklif oluşturucu, Story’ler, EXIF araçları — yıllık plan üzerinde 3 gün boyunca tam erişim. Deneme sırasında Ayarlar → Apple ID → Abonelikler’den iptal edersen ücretlendirilmezsin.',
      },
      {
        q: '"46+" tam olarak kaç platform demek?',
        a: 'Lansmanda: 46 pazaryeri ön ayarı (Amazon, Shopify, Etsy, eBay, Walmart, WooCommerce, Trendyol, AliExpress, Mercado Libre, Allegro, Temu, SHEIN, DHgate, Tmall, 1688, Made-in-China, Global Sources…) artı sosyal/mesajlaşma formatları (Instagram Shopping, TikTok Shop, Pinterest, WhatsApp, Telegram, WeChat, RED, Stories). Yeni ön ayarlar güncellemelerle gelir.',
      },
      {
        q: 'GPS konumum dışa aktarılan fotoğraflarda olacak mı?',
        a: 'Hayır. photoZseo dışa aktarımda GPS verisini varsayılan olarak siler. Diğer EXIF — Artist, Copyright, Software, boyutlar, kamera — korunur ve satır içi düzenlenebilir. Kontrol sende.',
      },
      {
        q: 'GDPR / KVKK / CCPA uyumlu mu?',
        a: 'Evet — ve uygulama senin dilini konuşuyor: İngilizce, Türkçe, Almanca, İspanyolca, Fransızca, Portekizce, Japonca, Korece, Çince, Arapça, Hintçe ve Farsça. Arapça, Urduca, Farsça için RTL düzenleri birinci sınıftır.',
      },
      {
        q: 'Mevcut ürün listemi içe aktarabilir miyim?',
        a: 'Evet. CSV, TSV, XLSX, JSON, fotoğraf URL’si ve toplu fotoğraf klasörleri desteklenir. 41+ platform içe aktarma şablonu dahildir.',
      },
    ],
  },
  finalCta: {
    h2: 'Bir sonraki satışın tek bir fotoğrafla başlıyor.',
    p: 'Başlangıçta ücretsiz. Takip yok. Reklam yok. İstediğin zaman iptal. Bağımsız satıcılar için yapıldı.',
    note: 'Yakında App Store’da.',
    notify: 'Lansmanda haber ver',
  },
  footer: {
    tag: 'Tek bir fotoğrafla 46+ pazaryerinde sat.',
    privacy: 'Gizlilik', terms: 'Şartlar', support: 'Destek',
    accessibility: 'Erişilebilirlik', deleteAccount: 'Hesabı Sil',
    rights: 'Tüm hakları saklıdır. Bağımsız satıcılar için yapıldı.',
  },
};

export default tr;
