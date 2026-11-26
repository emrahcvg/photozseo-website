import type { PageSet } from './types';
import { PLANS, TRIAL_DAYS, usd, APP } from '../facts';

const starter = PLANS[1];

export const download: PageSet = {
  en: {
    title: 'photoZseo for iPhone & iPad: SEO Product Photo app (App Store)',
    desc: `Download photoZseo: SEO Product Photo free on the App Store. Shoot product photos, resize them for ${APP.marketplaces} marketplaces, remove backgrounds and auto-fill SEO titles, descriptions and alt text. iOS 17+.`,
    crumb: 'iPhone & iPad app',
    kicker: 'Now on the App Store',
    h1: 'photoZseo: SEO Product Photo for iPhone & iPad',
    answer: `**photoZseo** is an iPhone and iPad app for online sellers. You shoot a product once and the app resizes, compresses and SEO-renames the photos for **${APP.marketplaces} marketplaces** (Amazon, eBay, Etsy, Shopify, Walmart, Trendyol, Hepsiburada and more), removes backgrounds on the device and fills in titles, descriptions, tags and alt text. It is **free to download** on the App Store and works on **iOS 17 or later**.`,
    facts: [
      { k: 'Price', v: `Free · plans from ${usd(starter.monthly!)}/mo` },
      { k: 'Devices', v: 'iPhone & iPad' },
      { k: 'Requires', v: 'iOS / iPadOS 17.0+' },
      { k: 'Languages', v: `${APP.languages.length} languages` },
    ],
    sections: [
      {
        id: 'what',
        h2: 'What you can do with photoZseo',
        bullets: [
          '**Shoot with a template camera** that guides you through 7 angles marketplaces ask for: front, back, side, detail, top, label and lifestyle.',
          `**Resize and compress for every channel** — ${APP.exportTargets} export targets, including ${APP.marketplaces} marketplaces plus social and ad platforms (Instagram, TikTok Shop, Pinterest, Facebook Shops, WhatsApp Catalog). Export JPEG, PNG and WebP.`,
          '**SEO file names and metadata** — each photo gets a keyword-based file name, alt text and clean EXIF data; GPS location is removed on export by default.',
          '**AI background removal** on the device: transparent PNG, pure white or a custom color, one photo or a whole batch.',
          `**Listing text auto-fill** — title, slug, category, meta description, long description, tags, keywords and barcode (${APP.seoFields} fields) from your photo and product details.`,
          `**Listing files** — CSV / XLSX / JSON in each marketplace\'s column layout (${APP.csvFormats} platform formats), separate per product or combined.`,
          '**B2B quote builder** — branded A4 PDF quotes with VAT, IBAN, Incoterms, HS codes and e-signature.',
          '**Shopify integration** — push products directly to your Shopify store (Business plan).',
        ],
      },
      {
        id: 'how',
        h2: 'How it works',
        steps: [
          { t: 'Shoot or import.', d: 'Use the template camera or import photos from Photos and Files.' },
          { t: 'Pick your marketplaces.', d: 'Choose where you sell, e.g. Amazon, Etsy and Trendyol.' },
          { t: 'Let the app prepare everything.', d: 'Each photo is cropped, resized, compressed and renamed for every marketplace; listing text is filled in.' },
          { t: 'Export or publish.', d: 'Save a folder of ready images plus a CSV/XLSX listing file, share them, or push to Shopify.' },
        ],
      },
      {
        id: 'ai',
        h2: 'On-device AI and privacy',
        body: [
          'Photo processing, background removal (Apple Vision) and text recognition run **on your iPhone or iPad**; your product photos are not uploaded to a photoZseo server for processing.',
          'On **iOS 26 with Apple Intelligence**, listing text is written by Apple\'s on-device Foundation Models. On iOS 17–25 the app fills the same fields from on-device image analysis and templates.',
          'photoZseo shows **no ads** and does not track you across other apps. Anonymous usage analytics can be switched off in the app\'s Settings. Details: [Privacy Policy](/privacy).',
        ],
      },
      {
        id: 'requirements',
        h2: 'Requirements and availability',
        table: {
          head: ['', ''],
          rows: [
            ['App Store name', APP.storeName],
            ['Compatibility', 'iPhone with iOS 17.0 or later · iPad with iPadOS 17.0 or later'],
            ['Apple Intelligence features', 'iOS 26 on a supported device (optional)'],
            ['Price', `Free download with a free plan; Starter, Pro and Business subscriptions — see [pricing](/pricing)`],
            ['Free trial', `${TRIAL_DAYS} days on annual plans`],
            ['Languages', APP.languageNames],
            ['Android / Mac', 'Not available yet'],
            ['Desktop alternative', '[photoZseo for Chrome](/chrome-extension) (separate extension)'],
          ],
        },
      },
    ],
    faqTitle: 'Download FAQ',
    faq: [
      { q: 'Where can I download photoZseo?', a: 'On the Apple App Store, search for "photoZseo" or open apps.apple.com/app/id6762639768 on your iPhone or iPad.' },
      { q: 'Is photoZseo available for Android?', a: 'Not yet. photoZseo is available for iPhone and iPad. On a computer you can use the photoZseo extension for Google Chrome.' },
      { q: 'Does photoZseo work offline?', a: 'Yes. Shooting, resizing, background removal and exports work without an internet connection. You only need a connection to publish to an online store or Shopify, to sync with iCloud, or to buy a subscription.' },
      { q: 'Which marketplaces does photoZseo support?', a: 'Amazon, eBay, Etsy, Shopify, Walmart, WooCommerce, Trendyol, Hepsiburada, N11, AliExpress, Temu, SHEIN, Mercado Libre, Allegro, Zalando, Otto, Kaufland, Noon, Shopee, Lazada, Coupang, Flipkart and more, plus Instagram, TikTok Shop, Pinterest, Facebook Shops and WhatsApp Catalog.' },
    ],
    related: [
      { label: 'Pricing and free plan', href: '/pricing' },
      { label: 'Marketplace image sizes', href: '/marketplace-image-sizes' },
      { label: 'About photoZseo', href: '/about' },
    ],
    relatedTitle: 'Related',
    cta: { h: 'Get photoZseo on the App Store', p: 'Free to download. Works on iPhone and iPad.', btn: 'Download on the App Store' },
    updatedLabel: 'Updated',
  },
  tr: {
    title: 'iPhone ve iPad için photoZseo: SEO Product Photo uygulaması (App Store)',
    desc: `photoZseo: SEO Product Photo'yu App Store'dan ücretsiz indir. Ürün fotoğrafı çek, ${APP.marketplaces} pazaryerine göre boyutlandır, arka planı kaldır, SEO başlık, açıklama ve alt metni otomatik doldur. iOS 17+.`,
    crumb: 'iPhone ve iPad uygulaması',
    kicker: "App Store'da yayında",
    h1: 'iPhone ve iPad için photoZseo: SEO Product Photo',
    answer: `**photoZseo**, online satıcılar için bir iPhone ve iPad uygulamasıdır. Ürünü bir kez çekersin; uygulama fotoğrafları **${APP.marketplaces} pazaryeri** (Amazon, eBay, Etsy, Shopify, Walmart, Trendyol, Hepsiburada ve diğerleri) için boyutlandırır, sıkıştırır ve SEO uyumlu adlandırır, arka planı cihaz üzerinde kaldırır; başlık, açıklama, etiket ve alt metni doldurur. App Store'dan **ücretsiz indirilir** ve **iOS 17 ve üzeri** ile çalışır.`,
    facts: [
      { k: 'Fiyat', v: `Ücretsiz · planlar ${usd(starter.monthly!)}/ay'dan` },
      { k: 'Cihazlar', v: 'iPhone ve iPad' },
      { k: 'Gereksinim', v: 'iOS / iPadOS 17.0+' },
      { k: 'Diller', v: `${APP.languages.length} dil` },
    ],
    sections: [
      {
        id: 'what',
        h2: 'photoZseo ile neler yapabilirsin',
        bullets: [
          '**Şablonlu kamerayla çek:** Pazaryerlerinin istediği 7 açıda yönlendirir: ön, arka, yan, detay, üst, etiket ve kullanım (lifestyle).',
          `**Her kanala göre boyutlandır ve sıkıştır:** ${APP.marketplaces} pazaryeri ile sosyal ve reklam platformları (Instagram, TikTok Shop, Pinterest, Facebook Shops, WhatsApp Katalog) dahil ${APP.exportTargets} dışa aktarma hedefi. JPEG, PNG ve WebP.`,
          '**SEO dosya adları ve metadata:** Her fotoğraf anahtar kelimeli dosya adı, alt metin ve temiz EXIF verisi alır; GPS konumu dışa aktarırken varsayılan olarak silinir.',
          '**Cihaz üzerinde yapay zekâ ile arka plan kaldırma:** Şeffaf PNG, saf beyaz veya özel renk; tek fotoğraf ya da toplu.',
          `**İlan metni otomatik doldurma:** Fotoğraf ve ürün bilgilerinden başlık, slug, kategori, meta açıklama, uzun açıklama, etiketler, anahtar kelimeler ve barkod (${APP.seoFields} alan).`,
          `**İlan dosyaları:** Her pazaryerinin sütun düzeninde CSV / XLSX / JSON (${APP.csvFormats} platform formatı), ürün başına ayrı veya tek dosya.`,
          '**B2B teklif oluşturucu:** KDV, IBAN, Incoterms, GTİP (HS) kodu ve e-imzalı, markalı A4 PDF teklifler.',
          "**Shopify entegrasyonu:** Ürünleri doğrudan Shopify mağazana gönder (Business planı).",
        ],
      },
      {
        id: 'how',
        h2: 'Nasıl çalışır',
        steps: [
          { t: 'Çek veya içe aktar.', d: "Şablonlu kamerayı kullan ya da Fotoğraflar ve Dosyalar'dan içe aktar." },
          { t: 'Pazaryerlerini seç.', d: 'Nerede satıyorsan onu seç: ör. Trendyol, Hepsiburada ve Amazon.' },
          { t: 'Gerisini uygulama hazırlar.', d: 'Her fotoğraf her pazaryeri için kırpılır, boyutlandırılır, sıkıştırılır ve yeniden adlandırılır; ilan metni doldurulur.' },
          { t: 'Dışa aktar veya yayınla.', d: "Hazır görsel klasörünü ve CSV/XLSX ilan dosyasını kaydet, paylaş ya da Shopify'a gönder." },
        ],
      },
      {
        id: 'ai',
        h2: 'Cihaz üzerinde yapay zekâ ve gizlilik',
        body: [
          "Fotoğraf işleme, arka plan kaldırma (Apple Vision) ve metin tanıma **iPhone veya iPad'inde** çalışır; ürün fotoğrafların işlenmek için photoZseo sunucusuna yüklenmez.",
          "**Apple Intelligence destekli iOS 26**'da ilan metinlerini Apple'ın cihaz içi Foundation Models modeli yazar. iOS 17–25'te uygulama aynı alanları cihaz üzerindeki görüntü analizi ve şablonlarla doldurur.",
          'photoZseo\'da **reklam yoktur** ve seni diğer uygulamalar arasında takip etmez. Anonim kullanım analitiği uygulamanın Ayarlar bölümünden kapatılabilir. Ayrıntılar: [Gizlilik Politikası](/tr/privacy).',
        ],
      },
      {
        id: 'requirements',
        h2: 'Gereksinimler ve erişilebilirlik',
        table: {
          head: ['', ''],
          rows: [
            ["App Store'daki adı", APP.storeName],
            ['Uyumluluk', 'iOS 17.0 veya üzeri iPhone · iPadOS 17.0 veya üzeri iPad'],
            ['Apple Intelligence özellikleri', 'Desteklenen cihazda iOS 26 (isteğe bağlı)'],
            ['Fiyat', 'Ücretsiz indirme ve ücretsiz plan; Starter, Pro ve Business abonelikleri: [fiyatlar](/tr/pricing)'],
            ['Ücretsiz deneme', `Yıllık planlarda ${TRIAL_DAYS} gün`],
            ['Diller', 'İngilizce, Türkçe, Almanca, İspanyolca, Fransızca, İtalyanca, Portekizce, Lehçe, Japonca, Korece, Çince, Arapça, Hintçe, Farsça, Urduca'],
            ['Android / Mac', 'Henüz yok'],
            ['Masaüstü seçeneği', '[Chrome için photoZseo](/tr/chrome-extension) (ayrı eklenti)'],
          ],
        },
      },
    ],
    faqTitle: 'İndirme hakkında sorular',
    faq: [
      { q: 'photoZseo\'yu nereden indirebilirim?', a: 'Apple App Store\'da "photoZseo" diye arat ya da iPhone veya iPad\'inde apps.apple.com/app/id6762639768 adresini aç.' },
      { q: 'photoZseo Android\'de var mı?', a: 'Henüz yok. photoZseo iPhone ve iPad için. Bilgisayarda Google Chrome için photoZseo eklentisini kullanabilirsin.' },
      { q: 'photoZseo internetsiz çalışır mı?', a: "Evet. Çekim, boyutlandırma, arka plan kaldırma ve dışa aktarma internet olmadan çalışır. İnternet yalnızca online mağazaya veya Shopify'a yayınlarken, iCloud eşitlemesinde ve abonelik satın alırken gerekir." },
      { q: 'Hangi pazaryerlerini destekliyor?', a: 'Trendyol, Hepsiburada, N11, Amazon, eBay, Etsy, Shopify, Walmart, WooCommerce, Çiçeksepeti, PttAVM, Pazarama, AliExpress, Temu, SHEIN, Allegro, Zalando, Otto, Kaufland, Noon ve daha fazlası; ayrıca Instagram, TikTok Shop, Pinterest, Facebook Shops ve WhatsApp Katalog.' },
    ],
    related: [
      { label: 'Fiyatlar ve ücretsiz plan', href: '/tr/pricing' },
      { label: 'Pazaryeri görsel ölçüleri', href: '/tr/marketplace-image-sizes' },
      { label: 'photoZseo hakkında', href: '/tr/about' },
    ],
    relatedTitle: 'İlgili sayfalar',
    cta: { h: "photoZseo'yu App Store'dan indir", p: 'Ücretsiz indirilir. iPhone ve iPad\'de çalışır.', btn: "App Store'dan indir" },
    updatedLabel: 'Güncelleme:',
  },
};
