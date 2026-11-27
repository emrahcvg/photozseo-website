import type { PageSet } from './types';
import { APP } from '../facts';

export const about: PageSet = {
  en: {
    title: 'About photoZseo: product photo and listing tools for online sellers',
    desc: 'photoZseo makes product photo and listing tools for independent online sellers: an iPhone & iPad app and a Chrome extension.',
    crumb: 'About',
    kicker: 'About us',
    h1: 'About photoZseo',
    answer: `**photoZseo** builds tools that turn product photos into marketplace-ready listings. The main product is the **photoZseo: SEO Product Photo** app for iPhone and iPad (App Store, ${APP.launchYear}). There is also a separate **photoZseo extension for Google Chrome**.`,
    facts: [
      { k: 'Founded for', v: 'Independent online sellers' },
      { k: 'Main product', v: 'iPhone & iPad app' },
      { k: 'Website', v: 'photozseo.com' },
      { k: 'Support', v: `[${APP.supportEmail}](mailto:${APP.supportEmail})` },
    ],
    sections: [
      {
        id: 'why',
        h2: 'Why photoZseo exists',
        body: [
          'Every marketplace asks for different photo sizes, background rules, file names and listing columns. A seller on Amazon, Etsy and Trendyol often edits the same photo three times and types the same title three times.',
          'photoZseo was started by an independent seller-developer to remove that repetitive work: shoot once, and let the app prepare the photos, file names and listing text for each marketplace.',
        ],
      },
      {
        id: 'products',
        h2: 'Products',
        bullets: [
          '[photoZseo for iPhone & iPad](/download) — camera, resizing for 46 marketplaces, background removal, listing text, CSV/XLSX export, B2B quotes and Shopify push.',
          '[photoZseo for Chrome](/chrome-extension) — a desktop side-panel extension that collects product photos and details from web pages and exports marketplace-ready ZIP and CSV files. It is a separate product with its own plans.',
        ],
      },
      {
        id: 'principles',
        h2: 'How we build',
        bullets: [
          '**On-device first.** Photo processing and background removal run on the user\'s device.',
          '**No ads.** The apps are paid for by subscriptions, not advertising.',
          `**Built for global sellers.** The app is available in ${APP.languages.length} languages, including three right-to-left languages (Arabic, Persian, Urdu).`,
          '**Accurate marketplace specs.** Presets follow the marketplaces\' own seller documentation; see the [marketplace image size guide](/marketplace-image-sizes).',
        ],
      },
      {
        id: 'contact',
        h2: 'Contact',
        bullets: [
          `Support: [${APP.supportEmail}](mailto:${APP.supportEmail})`,
          `General and press: [${APP.contactEmail}](mailto:${APP.contactEmail})`,
          'Help center: [photozseo.com/support](/support)',
        ],
      },
    ],
    related: [
      { label: 'Download for iPhone & iPad', href: '/download' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
    relatedTitle: 'Related',
    updatedLabel: 'Updated',
  },
  tr: {
    title: 'photoZseo hakkında: online satıcılar için ürün fotoğrafı ve ilan araçları',
    desc: "photoZseo, bağımsız online satıcılar için ürün fotoğrafı ve ilan araçları geliştirir: iPhone ve iPad uygulaması ve Chrome eklentisi.",
    crumb: 'Hakkında',
    kicker: 'Hakkımızda',
    h1: 'photoZseo hakkında',
    answer: `**photoZseo**, ürün fotoğraflarını pazaryerine hazır ilanlara dönüştüren araçlar geliştirir. Ana ürün, iPhone ve iPad için **photoZseo: SEO Product Photo** uygulamasıdır (App Store, ${APP.launchYear}). Ayrıca **Google Chrome için ayrı bir photoZseo eklentisi** vardır.`,
    facts: [
      { k: 'Kimin için', v: 'Bağımsız online satıcılar' },
      { k: 'Ana ürün', v: 'iPhone ve iPad uygulaması' },
      { k: 'Web sitesi', v: 'photozseo.com' },
      { k: 'Destek', v: `[${APP.supportEmail}](mailto:${APP.supportEmail})` },
    ],
    sections: [
      {
        id: 'why',
        h2: 'photoZseo neden var',
        body: [
          'Her pazaryeri farklı fotoğraf ölçüsü, arka plan kuralı, dosya adı ve ilan sütunu ister. Amazon, Etsy ve Trendyol\'da satan biri çoğu zaman aynı fotoğrafı üç kez düzenler, aynı başlığı üç kez yazar.',
          'photoZseo, bu tekrar eden işi ortadan kaldırmak için bağımsız bir satıcı-geliştirici tarafından başlatıldı: Bir kez çek; fotoğrafları, dosya adlarını ve ilan metnini her pazaryeri için uygulama hazırlasın.',
        ],
      },
      {
        id: 'products',
        h2: 'Ürünler',
        bullets: [
          "[iPhone ve iPad için photoZseo](/tr/download): Kamera, 46 pazaryerine göre boyutlandırma, arka plan kaldırma, ilan metni, CSV/XLSX dışa aktarma, B2B teklif ve Shopify'a gönderme.",
          '[Chrome için photoZseo](/tr/chrome-extension): Web sayfalarından ürün fotoğraflarını ve bilgilerini toplayıp pazaryerine hazır ZIP ve CSV dosyaları üreten masaüstü yan panel eklentisi. Kendi planları olan ayrı bir üründür.',
        ],
      },
      {
        id: 'principles',
        h2: 'Nasıl geliştiriyoruz',
        bullets: [
          '**Önce cihaz.** Fotoğraf işleme ve arka plan kaldırma kullanıcının cihazında çalışır.',
          '**Reklam yok.** Uygulamalar reklamla değil abonelikle finanse edilir.',
          `**Global satıcılar için.** Uygulama, sağdan sola yazılan üç dil (Arapça, Farsça, Urduca) dahil ${APP.languages.length} dilde kullanılabilir.`,
          '**Doğru pazaryeri ölçüleri.** Ön ayarlar pazaryerlerinin kendi satıcı belgelerine dayanır; bkz. [pazaryeri görsel ölçüleri rehberi](/tr/marketplace-image-sizes).',
        ],
      },
      {
        id: 'contact',
        h2: 'İletişim',
        bullets: [
          `Destek: [${APP.supportEmail}](mailto:${APP.supportEmail})`,
          `Genel ve basın: [${APP.contactEmail}](mailto:${APP.contactEmail})`,
          'Yardım merkezi: [photozseo.com/tr/support](/tr/support)',
        ],
      },
    ],
    related: [
      { label: 'iPhone ve iPad için indir', href: '/tr/download' },
      { label: 'Fiyatlar', href: '/tr/pricing' },
      { label: 'Gizlilik Politikası', href: '/tr/privacy' },
    ],
    relatedTitle: 'İlgili sayfalar',
    updatedLabel: 'Güncelleme:',
  },
};
