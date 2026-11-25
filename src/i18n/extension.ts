import type { Lang } from './ui';
import de from './ext-locales/de';
import es from './ext-locales/es';
import fr from './ext-locales/fr';
import it from './ext-locales/it';
import pt from './ext-locales/pt';
import ja from './ext-locales/ja';
import ko from './ext-locales/ko';
import zh from './ext-locales/zh';
import ar from './ext-locales/ar';
import hi from './ext-locales/hi';
import ur from './ext-locales/ur';
import fa from './ext-locales/fa';
import pl from './ext-locales/pl';

// Chrome Web Store adresi yayın onayından sonra yazılır; boşken düğme "yakında" gösterir.
export const CHROME_STORE_URL = '';
export const EXT_VERSION = '2.1.1';
export const EXT_UPDATED = '2026-11-25';

export interface ExtContent {
  title: string;
  desc: string;
  crumb: string;
  kicker: string;
  h1a: string;
  h1b: string;
  lead: string;
  ctaStore: string;
  ctaSoon: string;
  ctaNotify: string;
  ctaFree: string;
  trust: string[];
  answerTitle: string;
  answer: string;
  facts: [string, string][];
  howKicker: string;
  howTitle: string;
  steps: { t: string; d: string }[];
  featKicker: string;
  featTitle: string;
  feats: { t: string; d: string }[];
  worksTitle: string;
  worksList?: string[];
  worksNote: string;
  privKicker: string;
  privTitle: string;
  privItems: { t: string; d: string }[];
  privLink: string;
  priceKicker: string;
  priceTitle: string;
  priceSub: string;
  plans: { name: string; price: string; per: string; note: string; items: string[]; featured?: boolean; badge?: string }[];
  priceNote: string;
  cmpTitle: string;
  cmpHead: [string, string, string];
  cmpRows: [string, string, string][];
  cmpAppLink: string;
  faqKicker: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
  finalTitle: string;
  finalText: string;
  updated: string;
  shot: 'tr' | 'en';
  shotAlt: [string, string, string];
  speedKicker: string;
  speedTitle: string;
  speedSub: string;
  stats: [string, string][];
  manualTitle: string;
  manualItems: string[];
  autoTitle: string;
  autoItems: string[];
  treeTitle: string;
  tree: string[];
  measured: string;
  mock: { tab1: string; tab2: string; tab3: string; scan: string; title: string; brand: string; cat: string; price: string; sizes: string; export: string };
}

const en: ExtContent = {
  title: 'photoZseo Chrome Extension — Product Image Resizer for Marketplaces',
  desc: 'Free Chrome extension for online sellers: collect product photos while you browse, resize them to Amazon, Etsy, Shopify and Trendyol sizes, rename for SEO, export ZIP or CSV.',
  crumb: 'Chrome extension',
  kicker: 'Chrome extension · Free to start',
  h1a: 'Product photos, ',
  h1b: 'marketplace-ready in your browser.',
  lead: 'photoZseo for Chrome reads the product page you are viewing, collects its photos, name, brand, category and price, then resizes, renames and exports everything for the marketplaces you sell on. Nothing leaves your computer.',
  ctaStore: 'Add to Chrome',
  ctaSoon: 'Coming soon to the Chrome Web Store',
  ctaNotify: 'Email me when it is live',
  ctaFree: 'Free to try · No account · No credit card',
  trust: ['Runs in the Chrome side panel', 'No server, no sign-up', '15 languages'],
  answerTitle: 'In short',
  answer: 'photoZseo is a Chrome extension for e-commerce sellers. It collects product photos and details from product pages, resizes and compresses them to marketplace image requirements (82 size profiles across 10 regions), gives them SEO-friendly file names and exports a ZIP, CSV or Excel file (50 platform formats). Data stays on your device. The free plan lets you try it with 5 products and 10 new images per day; Pro starts at $4.92/month billed yearly.',
  facts: [
    ['What it is', 'Chrome side-panel extension for product photo preparation'],
    ['Who it is for', 'Marketplace sellers, dropshippers, Shopify store owners, agencies'],
    ['Browser', 'Google Chrome 116 or later on desktop'],
    ['Image sizes', '82 profiles in 10 regions (Amazon, Etsy, Shopify, Trendyol, Instagram…)'],
    ['Exports', 'Folder-organized ZIP, CSV and Excel in 50 platform formats'],
    ['Where data is stored', 'Only in your browser (IndexedDB); no photoZseo server'],
    ['Price', 'Free plan · Pro $7.99/month or $59/year · Team $129/year'],
    ['Languages', '15, including English, Turkish, German, Spanish, Arabic and Japanese'],
  ],
  howKicker: 'How it works',
  howTitle: 'Three clicks from product page to upload file.',
  steps: [
    { t: 'Open a product page', d: 'Click the photoZseo icon. The side panel reads the product name, brand, category, price, color variants and every product image on the page.' },
    { t: 'Pick photos and sizes', d: 'Choose the photos you need and the marketplaces you sell on. Right-click any image or use the optional "+" button to add more from other pages.' },
    { t: 'Export', d: 'Download a ZIP with one folder per category, resized and SEO-renamed photos, plus a CSV or Excel file ready for bulk upload.' },
  ],
  featKicker: 'Features',
  featTitle: 'Everything between "I found the product" and "it is listed".',
  feats: [
    { t: 'Marketplace image sizes', d: '82 resize and compression profiles with the right pixel size, ratio and file-size limit for each platform and region.' },
    { t: 'SEO file names and alt text', d: 'Short, keyword-first file names built from product name, brand, color and category, plus alt text in your language.' },
    { t: 'Bulk export to CSV and Excel', d: '50 platform CSV formats and Shopify, Trendyol and Hepsiburada spreadsheets. You can also fill in the template file you download from your own seller panel.' },
    { t: 'Color variants grouped', d: 'Variants of the same product are detected and grouped, so Shopify options and marketplace variant group codes are filled for you.' },
    { t: 'Prices, profit and margin', d: 'Enter cost and sale price, apply a bulk markup with .90 or .99 rounding, convert currency and see profit and margin per product.' },
    { t: 'Your own photos too', d: 'Drop in photos from your computer. They are kept in your local library next to the products you collected.' },
  ],
  worksTitle: 'Ready-made image sizes for 60+ marketplaces and channels, including',
  worksNote: 'Product pages are read on most online stores that publish structured product data, such as Trendyol, Hepsiburada, Etsy, AliExpress and Shopify stores. Marketplace names describe compatibility only; photoZseo is not affiliated with them.',
  privKicker: 'Privacy',
  privTitle: 'Your product library never leaves your computer.',
  privItems: [
    { t: 'No server, no account', d: 'There is no photoZseo backend. Products, prices and photos live in your browser storage.' },
    { t: 'Reads a page only when you ask', d: 'The extension reads the current tab when you open the panel or press scan. Access to all sites is optional.' },
    { t: 'No tracking', d: 'No analytics, no ads, no data sales. The only network call besides images is the Pro license check.' },
  ],
  privLink: 'Read the extension privacy policy',
  priceKicker: 'Pricing',
  priceTitle: 'Start free. Upgrade when you list at scale.',
  priceSub: 'Pro is a subscription handled by Dodo Payments. Cancel any time; Pro stays active until the end of the paid period.',
  plans: [
    { name: 'Free', price: '$0', per: '', note: 'Try it out', items: ['Up to 5 products', '10 new images per day', '4 image sizes: Amazon, Etsy, Trendyol, Instagram', 'Photo downloads with SEO file names'] },
    { name: 'Pro Monthly', price: '$7.99', per: '/month', note: '3 devices', items: ['Unlimited products and images', 'All 82 image sizes', 'ZIP, CSV and Excel export', 'Marketplace templates', 'Bulk pricing and alt text'] },
    { name: 'Pro Yearly', price: '$59', per: '/year', note: '$4.92/month · 3 devices', items: ['Everything in Pro', 'Save 38% vs monthly'], featured: true, badge: 'Best value' },
    { name: 'Team', price: '$129', per: '/year', note: '10 devices', items: ['Everything in Pro', 'One license for up to 10 browsers'] },
  ],
  priceNote: 'Prices in USD. Sales tax or VAT may be added at checkout depending on your country.',
  cmpTitle: 'Chrome extension or iPhone app?',
  cmpHead: ['', 'Chrome extension', 'iPhone & iPad app'],
  cmpRows: [
    ['Best for', 'Collecting photos from product pages on the web', 'Shooting new product photos with your camera'],
    ['Where it runs', 'Chrome on Mac, Windows, Linux, ChromeOS', 'iPhone, iPad and Mac (Apple silicon)'],
    ['Photo source', 'Existing product pages and your files', 'Camera, photo library and files'],
    ['Export', 'ZIP, CSV, Excel', '60+ export targets, Shopify API'],
    ['Subscription', 'Separate, from $4.92/month', 'Separate, in the App Store'],
  ],
  cmpAppLink: 'See the iPhone app',
  faqKicker: 'FAQ',
  faqTitle: 'Questions sellers ask',
  faq: [
    { q: 'What does the photoZseo Chrome extension do?', a: 'It collects product photos and product details (name, brand, category, price, color variants) from the product page you are viewing, resizes and compresses the photos to marketplace requirements, gives them SEO-friendly file names and exports them as a ZIP plus a CSV or Excel file for bulk upload.' },
    { q: 'Is the photoZseo extension free?', a: 'Yes, there is a free plan to try it, with up to 5 products, 10 new images per day and 4 image sizes. Pro costs $7.99 per month or $59 per year and removes all limits. A Team license costs $129 per year for 10 browsers.' },
    { q: 'Which marketplaces are supported?', a: 'There are 82 image size profiles in 10 regions, including Amazon, eBay, Etsy, Shopify, Walmart, Trendyol, Hepsiburada, AliExpress, Instagram and Pinterest, and 50 CSV formats. You can also fill in an Excel template downloaded from your own marketplace seller panel.' },
    { q: 'Does it upload my photos or product data anywhere?', a: 'No. photoZseo has no server. Your product library and photos are stored only in your browser. The only data sent outside is your license key, to Dodo Payments, when you activate Pro.' },
    { q: 'Why does it ask for access to all websites?', a: 'It does not by default. That permission is optional and is requested only if you turn on the "+" button that appears on product images. Without it, the extension reads only the tab you choose to scan.' },
    { q: 'Can I download all images from an Amazon, Etsy or Trendyol product page?', a: 'Yes. Open the product page and the side panel lists every product image and video it finds. Select them and download them in one ZIP, resized for the marketplace you choose. Please only use images you have the right to use.' },
    { q: 'Does it remove image backgrounds?', a: 'No. The Chrome extension focuses on collecting, resizing, renaming and exporting. Background removal is available in the photoZseo iPhone and iPad app.' },
    { q: 'Which browsers does it work in?', a: 'Google Chrome 116 or later on Windows, macOS, Linux and ChromeOS. It uses the Chrome side panel, so it is not available on mobile browsers.' },
    { q: 'How do I cancel Pro?', a: 'Use the link in your Dodo Payments receipt email to manage or cancel your subscription. Pro stays active until the end of the period you paid for.' },
  ],
  finalTitle: 'List faster this week.',
  finalText: 'Install photoZseo for Chrome, open a product page and export your first marketplace-ready ZIP in under a minute.',
  updated: 'Last updated',
  shot: 'en',
  shotAlt: [
    'photoZseo side panel reading a product page: photos selected, name, brand, color, category and SEO file name filled in',
    'photoZseo product library with 8 products grouped by category',
    'photoZseo export tab: 8 products and 24 photos turned into 120 files for Amazon, eBay, Etsy and Shopify in one ZIP',
  ],
  speedKicker: 'Speed',
  speedTitle: '120 files of photo prep, done in 5 seconds.',
  speedSub: 'Measured with the extension itself: 8 products with 3 photos each, exported to 5 image profiles for Amazon, eBay, Etsy and Shopify.',
  stats: [['120', 'files created'], ['5 s', 'to build the ZIP'], ['1', 'click to export']],
  manualTitle: 'By hand',
  manualItems: ['Save 24 photos one by one', 'Resize every photo for every marketplace: 120 edits', 'Rename 120 files for SEO', 'Sort them into folders', 'Type names, prices and categories into a spreadsheet'],
  autoTitle: 'With photoZseo',
  autoItems: ['Open each product page and press Add: 8 clicks', 'Choose your marketplaces once', 'Press Export: 120 resized, renamed and sorted files plus a CSV'],
  treeTitle: 'Inside the ZIP',
  tree: [
    'wallets-card-holders/',
    '  genuine-leather-card-holder/',
    '    amazon-main/nordvik-genuine-leather-card-holder-tan-1.jpg',
    '    ebay/nordvik-genuine-leather-card-holder-tan-1.jpg',
    '    etsy/nordvik-genuine-leather-card-holder-tan-1.jpg',
    '    shopify/nordvik-genuine-leather-card-holder-tan-1.jpg',
    'home-living/ · electronics/ · stationery/ …',
    'product-list.csv',
  ],
  measured: 'Timed in Chrome on a laptop. Speed depends on photo size and your computer. Product photos: photoZseo demo images.',
  mock: { tab1: 'This page', tab2: 'My products', tab3: 'Export', scan: 'Scan this page', title: 'Leather Crossbody Bag', brand: 'Brand: Nordvik', cat: 'Bags › Crossbody', price: '$49.90', sizes: 'Amazon · Etsy · Trendyol', export: 'Export ZIP + CSV' },
};

const tr: ExtContent = {
  title: 'photoZseo Chrome Eklentisi — Pazaryeri Ürün Görseli Boyutlandırma',
  desc: 'Satıcılar için ücretsiz Chrome eklentisi: gezinirken ürün görsellerini topla, Trendyol, Hepsiburada, Amazon ve Etsy ölçülerine boyutlandır, SEO adı ver, ZIP veya Excel indir.',
  crumb: 'Chrome eklentisi',
  kicker: 'Chrome eklentisi · Ücretsiz başla',
  h1a: 'Ürün görselleri, ',
  h1b: 'tarayıcında pazaryerine hazır.',
  lead: "Chrome için photoZseo, baktığın ürün sayfasını okur; görselleri, ürün adını, markayı, kategoriyi ve fiyatı toplar, sonra hepsini sattığın pazaryerleri için boyutlandırır, adlandırır ve dışa aktarır. Hiçbir şey bilgisayarından çıkmaz.",
  ctaStore: "Chrome'a ekle",
  ctaSoon: "Chrome Web Mağazası'nda yakında",
  ctaNotify: 'Yayına girince bana haber ver',
  ctaFree: 'Ücretsiz dene · Hesap yok · Kart yok',
  trust: ['Chrome yan panelinde çalışır', 'Sunucu yok, kayıt yok', '15 dil'],
  answerTitle: 'Kısaca',
  answer: "photoZseo, e-ticaret satıcıları için bir Chrome eklentisidir. Ürün sayfalarından görselleri ve ürün bilgilerini toplar, görselleri pazaryeri kurallarına göre boyutlandırıp sıkıştırır (10 bölgede 82 ölçü profili), SEO uyumlu dosya adı verir ve ZIP, CSV ya da Excel olarak dışa aktarır (50 platform biçimi). Veriler cihazında kalır. Ücretsiz planla 5 ürün ve günde 10 yeni görselle deneyebilirsin; Pro yıllık ödemede aylık 4,92 $'dan başlar.",
  facts: [
    ['Nedir', 'Ürün görseli hazırlamak için Chrome yan panel eklentisi'],
    ['Kimin için', 'Pazaryeri satıcıları, dropshipping yapanlar, Shopify mağazaları, ajanslar'],
    ['Tarayıcı', 'Masaüstünde Google Chrome 116 ve üstü'],
    ['Görsel ölçüleri', '10 bölgede 82 profil (Trendyol, Hepsiburada, Amazon, Etsy, Instagram…)'],
    ['Dışa aktarma', 'Kategori klasörlü ZIP, 50 platform biçiminde CSV ve Excel'],
    ['Veri nerede', 'Yalnız tarayıcında (IndexedDB); photoZseo sunucusu yok'],
    ['Fiyat', 'Ücretsiz plan · Pro aylık 7,99 $ veya yıllık 59 $ · Ekip yıllık 129 $'],
    ['Diller', "Türkçe, İngilizce, Almanca, Arapça dahil 15 dil"],
  ],
  howKicker: 'Nasıl çalışır',
  howTitle: 'Ürün sayfasından yükleme dosyasına üç tık.',
  steps: [
    { t: 'Ürün sayfasını aç', d: 'photoZseo simgesine tıkla. Yan panel ürün adını, markayı, kategoriyi, fiyatı, renk varyantlarını ve sayfadaki tüm ürün görsellerini okur.' },
    { t: 'Görselleri ve ölçüleri seç', d: 'İhtiyacın olan görselleri ve sattığın pazaryerlerini seç. Başka sayfalardan eklemek için görsele sağ tıkla ya da isteğe bağlı "+" düğmesini kullan.' },
    { t: 'Dışa aktar', d: 'Her kategori için ayrı klasörde, boyutlandırılmış ve SEO adlı görsellerden oluşan ZIP ile toplu yüklemeye hazır CSV veya Excel dosyasını indir.' },
  ],
  featKicker: 'Özellikler',
  featTitle: '"Ürünü buldum" ile "ilana çıktı" arasındaki her şey.',
  feats: [
    { t: 'Pazaryeri görsel ölçüleri', d: 'Her platform ve bölge için doğru piksel, oran ve dosya boyutu sınırıyla 82 boyutlandırma ve sıkıştırma profili.' },
    { t: 'SEO dosya adı ve alt metin', d: 'Ürün adı, marka, renk ve kategoriden kısa, anahtar kelimeyle başlayan dosya adları; kendi dilinde alt metin.' },
    { t: "CSV ve Excel'e toplu aktarma", d: '50 platform CSV biçimi ve Trendyol, Hepsiburada, Shopify tabloları. Satıcı panelinden indirdiğin şablon dosyasını da doldurabilirsin.' },
    { t: 'Renk varyantları gruplanır', d: 'Aynı ürünün renkleri bulunup gruplanır; Trendyol model kodu, Hepsiburada varyant grubu ve Shopify seçenekleri dolar.' },
    { t: 'Fiyat, kâr ve marj', d: 'Alış ve satış fiyatını gir, ,90 veya ,99 yuvarlamayla toplu kâr ekle, kur çevir, ürün başına kâr ve marjı gör.' },
    { t: 'Kendi fotoğrafların da', d: 'Bilgisayarındaki fotoğrafları sürükle bırak; topladığın ürünlerin yanında yerel kütüphanende saklanır.' },
  ],
  worksTitle: '60+ pazaryeri ve kanal için hazır görsel ölçüleri; aralarında',
  worksList: ['Trendyol', 'Hepsiburada', 'Amazon', 'Etsy', 'Shopify mağazaları', 'AliExpress'],
  worksNote: 'Ürün sayfasını; Trendyol, Hepsiburada, Çiçeksepeti, Etsy, AliExpress ve Shopify mağazaları gibi yapılandırılmış ürün verisi yayınlayan çoğu online mağazada okur. Pazaryeri adları yalnız uyumluluğu belirtir; photoZseo bu şirketlerle bağlantılı değildir.',
  privKicker: 'Gizlilik',
  privTitle: 'Ürün kütüphanen bilgisayarından hiç çıkmaz.',
  privItems: [
    { t: 'Sunucu yok, hesap yok', d: 'photoZseo arka ucu yoktur. Ürünler, fiyatlar ve görseller tarayıcı depolamanda durur.' },
    { t: 'Sayfayı yalnız sen isteyince okur', d: 'Eklenti, paneli açtığında ya da tara dediğinde yalnız açık sekmeyi okur. Tüm sitelere erişim isteğe bağlıdır.' },
    { t: 'İzleme yok', d: 'Analitik yok, reklam yok, veri satışı yok. Görseller dışındaki tek ağ isteği Pro lisans kontrolüdür.' },
  ],
  privLink: 'Eklenti gizlilik politikasını oku',
  priceKicker: 'Fiyatlar',
  priceTitle: 'Ücretsiz başla. Çok ürün listelediğinde yükselt.',
  priceSub: 'Pro, Dodo Payments üzerinden abonelikle alınır. İstediğin zaman iptal et; Pro ödediğin dönemin sonuna kadar açık kalır.',
  plans: [
    { name: 'Ücretsiz', price: '0 $', per: '', note: 'Denemek için', items: ['5 ürüne kadar', 'Günde 10 yeni görsel', '4 ölçü: Trendyol, Amazon, Etsy, Instagram', 'SEO adlı görsel indirme'] },
    { name: 'Pro Aylık', price: '7,99 $', per: '/ay', note: '3 cihaz', items: ['Sınırsız ürün ve görsel', '82 ölçünün tamamı', 'ZIP, CSV ve Excel', 'Pazaryeri şablonları', 'Toplu fiyat ve alt metin'] },
    { name: 'Pro Yıllık', price: '59 $', per: '/yıl', note: 'Aylık 4,92 $ · 3 cihaz', items: ["Pro'daki her şey", 'Aylığa göre %38 tasarruf'], featured: true, badge: 'En avantajlı' },
    { name: 'Ekip', price: '129 $', per: '/yıl', note: '10 cihaz', items: ["Pro'daki her şey", '10 tarayıcıya kadar tek lisans'] },
  ],
  priceNote: 'Fiyatlar ABD doları. Ülkene göre ödeme sırasında KDV veya satış vergisi eklenebilir.',
  cmpTitle: 'Chrome eklentisi mi, iPhone uygulaması mı?',
  cmpHead: ['', 'Chrome eklentisi', 'iPhone ve iPad uygulaması'],
  cmpRows: [
    ['En uygun olduğu iş', "Web'deki ürün sayfalarından görsel toplamak", 'Kamerayla yeni ürün fotoğrafı çekmek'],
    ['Nerede çalışır', "Mac, Windows, Linux, ChromeOS'ta Chrome", 'iPhone, iPad ve Mac (Apple çipli)'],
    ['Görsel kaynağı', 'Ürün sayfaları ve kendi dosyaların', 'Kamera, fotoğraf arşivi ve dosyalar'],
    ['Dışa aktarma', 'ZIP, CSV, Excel', '60+ hedef, Shopify API'],
    ['Abonelik', "Ayrı, aylık 4,92 $'dan", "Ayrı, App Store'da"],
  ],
  cmpAppLink: 'iPhone uygulamasını gör',
  faqKicker: 'SSS',
  faqTitle: 'Satıcıların sorduğu sorular',
  faq: [
    { q: 'photoZseo Chrome eklentisi ne işe yarar?', a: 'Baktığın ürün sayfasından görselleri ve ürün bilgilerini (ad, marka, kategori, fiyat, renk varyantları) toplar, görselleri pazaryeri kurallarına göre boyutlandırıp sıkıştırır, SEO uyumlu dosya adı verir ve toplu yükleme için ZIP ile birlikte CSV veya Excel dosyası olarak dışa aktarır.' },
    { q: 'photoZseo eklentisi ücretsiz mi?', a: 'Evet, denemek için 5 ürün, günde 10 yeni görsel ve 4 görsel ölçüsü içeren ücretsiz bir plan var. Pro aylık 7,99 $ veya yıllık 59 $ ve tüm sınırları kaldırır. Ekip lisansı 10 tarayıcı için yıllık 129 $.' },
    { q: 'Hangi pazaryerleri destekleniyor?', a: "10 bölgede 82 görsel ölçü profili var; Trendyol, Hepsiburada, N11, Amazon, eBay, Etsy, Shopify, AliExpress, Instagram ve Pinterest bunlardan bazıları. Ayrıca 50 CSV biçimi var ve kendi satıcı panelinden indirdiğin Excel şablonunu da doldurabilirsin." },
    { q: 'Görsellerimi veya ürün verilerimi bir yere yüklüyor mu?', a: "Hayır. photoZseo'nun sunucusu yok. Ürün kütüphanen ve görsellerin yalnız tarayıcında saklanır. Dışarı giden tek veri, Pro'yu etkinleştirirken Dodo Payments'a gönderilen lisans anahtarındır." },
    { q: 'Neden tüm sitelere erişim istiyor?', a: 'Varsayılan olarak istemez. Bu izin isteğe bağlıdır ve yalnız ürün görsellerinin üstünde çıkan "+" düğmesini açarsan istenir. İzin vermezsen eklenti yalnız taramayı seçtiğin sekmeyi okur.' },
    { q: 'Trendyol, Hepsiburada veya Amazon ürün sayfasındaki tüm görselleri indirebilir miyim?', a: 'Evet. Ürün sayfasını aç; yan panel bulduğu tüm ürün görsellerini ve videolarını listeler. Seç ve seçtiğin pazaryeri ölçüsünde tek ZIP olarak indir. Lütfen yalnız kullanma hakkın olan görselleri kullan.' },
    { q: 'Arka plan temizliyor mu?', a: 'Hayır. Chrome eklentisi toplama, boyutlandırma, adlandırma ve dışa aktarmaya odaklanır. Arka plan temizleme photoZseo iPhone ve iPad uygulamasında var.' },
    { q: 'Hangi tarayıcılarda çalışır?', a: "Windows, macOS, Linux ve ChromeOS'ta Google Chrome 116 ve üstünde. Chrome yan panelini kullandığı için mobil tarayıcılarda yoktur." },
    { q: "Pro'yu nasıl iptal ederim?", a: "Dodo Payments'tan gelen makbuz e-postasındaki bağlantıyla aboneliğini yönet veya iptal et. Pro ödediğin dönemin sonuna kadar açık kalır." },
  ],
  finalTitle: 'Bu hafta daha hızlı listele.',
  finalText: "Chrome için photoZseo'yu kur, bir ürün sayfası aç ve ilk pazaryerine hazır ZIP'ini bir dakikadan kısa sürede indir.",
  updated: 'Son güncelleme',
  shot: 'tr',
  shotAlt: [
    'photoZseo yan paneli bir ürün sayfasını okuyor: fotoğraflar seçili; ad, marka, renk, kategori ve SEO dosya adı dolu',
    'photoZseo ürün kütüphanesi: kategorilere göre gruplanmış 8 ürün',
    'photoZseo dışa aktarma: 8 ürün ve 24 fotoğraf Trendyol, Hepsiburada, Amazon ve Etsy için tek ZIP içinde 96 dosya oldu',
  ],
  speedKicker: 'Hız',
  speedTitle: '96 dosyalık görsel hazırlığı, 3,7 saniyede.',
  speedSub: 'Eklentinin kendisiyle ölçüldü: her birinde 3 fotoğraf olan 8 ürün, Trendyol, Hepsiburada, Amazon ve Etsy için dışa aktarıldı.',
  stats: [['96', 'dosya üretildi'], ['3,7 sn', 'ZIP hazır'], ['1', 'tıkla dışa aktar']],
  manualTitle: 'Elle',
  manualItems: ['24 fotoğrafı tek tek kaydet', 'Her fotoğrafı her pazaryeri için boyutlandır: 96 düzenleme', '96 dosyayı SEO için yeniden adlandır', 'Klasörlere ayır', 'Ad, fiyat ve kategorileri Excel\'e tek tek yaz'],
  autoTitle: 'photoZseo ile',
  autoItems: ['Her ürün sayfasını aç ve Ekle\'ye bas: 8 tık', 'Pazaryerlerini bir kez seç', 'Dışa aktar\'a bas: boyutlandırılmış, adlandırılmış, klasörlenmiş 96 dosya ve CSV'],
  treeTitle: 'ZIP\'in içi',
  tree: [
    'cuzdan-ve-kartlik/',
    '  hakiki-deri-kartlik/',
    '    trendyol/nordvik-hakiki-deri-kartlik-taba-1.jpg',
    '    hepsiburada/nordvik-hakiki-deri-kartlik-taba-1.jpg',
    '    amazon-main/nordvik-hakiki-deri-kartlik-taba-1.jpg',
    '    etsy/nordvik-hakiki-deri-kartlik-taba-1.jpg',
    'ev-tekstili/ · elektronik/ · defter/ …',
    'urun-listesi.csv',
  ],
  measured: 'Bir dizüstü bilgisayarda Chrome ile ölçüldü. Süre fotoğraf boyutuna ve bilgisayarına göre değişir. Ürün fotoğrafları: photoZseo demo görselleri.',
  mock: { tab1: 'Bu sayfa', tab2: 'Ürünlerim', tab3: 'Dışa aktar', scan: 'Bu sayfayı tara', title: 'Deri Çapraz Çanta', brand: 'Marka: Nordvik', cat: 'Çanta › Çapraz', price: '1.749,90 ₺', sizes: 'Trendyol · Hepsiburada · Amazon', export: 'ZIP + Excel indir' },
};

export const extContent: Record<Lang, ExtContent> = { en, tr, de, es, fr, it, pt, ja, ko, zh, ar, hi, ur, fa, pl };
export const extLangs = Object.keys(extContent) as Lang[];
export function getExt(lang: Lang): ExtContent {
  return extContent[lang] ?? en;
}

export const WORKS_ON = ['Amazon', 'Etsy', 'Shopify stores', 'Trendyol', 'Hepsiburada', 'AliExpress'];

// Menü, alt bilgi ve ana sayfa indirme bölümündeki eklenti bağlantısının etiketi (15 dil).
export const EXT_NAV: Record<Lang, string> = {
  en: 'Chrome extension', tr: 'Chrome eklentisi', de: 'Chrome-Erweiterung', es: 'Extensión de Chrome',
  fr: 'Extension Chrome', it: 'Estensione Chrome', pt: 'Extensão do Chrome', ja: 'Chrome 拡張機能',
  ko: 'Chrome 확장 프로그램', zh: 'Chrome 扩展程序', ar: 'إضافة Chrome', hi: 'Chrome एक्सटेंशन',
  ur: 'Chrome ایکسٹینشن', fa: 'افزونه Chrome', pl: 'Rozszerzenie Chrome',
};
export const CHROME_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3.6" fill="currentColor"/><path d="M12 8.4h9.2M8.9 13.8 4.3 5.8M15.1 13.8l-4.6 8" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
