import type { Lang } from './ui';

// App Store Connect → App Information → Apple ID. Boşken smart banner ve rozet basılmaz.
export const APP_STORE_ID = '';
export const APP_STORE_URL = APP_STORE_ID ? `https://apps.apple.com/app/id${APP_STORE_ID}` : '';

export interface PageMeta {
  homeTitle: string;
  homeDesc: string;
  a11yTitle: string;
  a11yDesc: string;
  defaultDesc: string;
}

export const ogLocales: Record<Lang, string> = {
  en: 'en_US', zh: 'zh_CN', tr: 'tr_TR', es: 'es_ES', de: 'de_DE', ja: 'ja_JP', pt: 'pt_BR', hi: 'hi_IN',
  ur: 'ur_PK', ar: 'ar_SA', fa: 'fa_IR', ko: 'ko_KR', fr: 'fr_FR', it: 'it_IT', pl: 'pl_PL',
};

export const meta: Record<Lang, PageMeta> = {
  en: {
    homeTitle: 'photoZseo — Product Photos & SEO for 46 Marketplaces',
    homeDesc: 'Turn one iPhone photo into 46 marketplace-ready listings. AI fills SEO, exports to Amazon, Shopify, Etsy, Trendyol & more. 7-day free trial on annual plans.',
    a11yTitle: 'Accessibility Statement | photoZseo',
    a11yDesc: 'photoZseo follows WCAG 2.1 AA: VoiceOver, Dynamic Type, color-blind safe palettes, RTL layouts and keyboard navigation on iPhone, iPad and the web.',
    defaultDesc: 'photoZseo turns iPhone product photos into marketplace-ready listings with AI SEO for Amazon, Shopify, Etsy, Trendyol and 40+ more marketplaces.',
  },
  tr: {
    homeTitle: 'photoZseo — 46 Pazaryeri için Ürün Fotoğrafı ve SEO',
    homeDesc: "Tek iPhone fotoğrafını 46 pazaryerine hazır ilana dönüştürün. Yapay zekâ SEO'yu doldurur; Amazon, Shopify, Etsy, Trendyol'a aktarır. Yıllık planda 7 gün ücretsiz.",
    a11yTitle: 'Erişilebilirlik Beyanı | photoZseo',
    a11yDesc: "photoZseo WCAG 2.1 AA'yı izler: VoiceOver, Dinamik Yazı, renk körlüğüne uygun paletler, RTL düzenler ve iPhone, iPad ile web'de klavye gezintisi.",
    defaultDesc: "photoZseo, iPhone ürün fotoğraflarını yapay zekâ SEO'suyla Amazon, Shopify, Etsy, Trendyol ve 40'tan fazla pazaryeri için hazır ilanlara dönüştürür.",
  },
  de: {
    homeTitle: 'photoZseo — Produktfotos & SEO für 46 Marktplätze',
    homeDesc: 'Aus einem iPhone-Foto 46 marktplatzfertige Angebote. KI füllt die SEO-Felder und exportiert zu Amazon, Shopify, Etsy, Trendyol & mehr. 7 Tage gratis im Jahresabo.',
    a11yTitle: 'Erklärung zur Barrierefreiheit | photoZseo',
    a11yDesc: 'photoZseo folgt WCAG 2.1 AA: VoiceOver, dynamische Schrift, farbenblind-sichere Paletten, RTL-Layouts und Tastaturnavigation auf iPhone, iPad und im Web.',
    defaultDesc: 'photoZseo macht aus iPhone-Produktfotos marktplatzfertige Angebote mit KI-SEO für Amazon, Shopify, Etsy, Trendyol und über 40 weitere Marktplätze.',
  },
  es: {
    homeTitle: 'photoZseo — Fotos de producto y SEO para 46 marketplaces',
    homeDesc: 'Convierte una foto de iPhone en anuncios para 46 marketplaces. La IA completa el SEO y exporta a Amazon, Shopify, Etsy y más. 7 días gratis en el plan anual.',
    a11yTitle: 'Declaración de accesibilidad | photoZseo',
    a11yDesc: 'photoZseo sigue WCAG 2.1 AA: VoiceOver, texto dinámico, paletas aptas para daltónicos, diseños RTL y navegación por teclado en iPhone, iPad y la web.',
    defaultDesc: 'photoZseo convierte fotos de producto de iPhone en anuncios listos con SEO por IA para Amazon, Shopify, Etsy, Trendyol y más de 40 marketplaces.',
  },
  fr: {
    homeTitle: 'photoZseo — Photos produit et SEO pour 46 marketplaces',
    homeDesc: "Transformez une photo iPhone en annonces prêtes pour 46 marketplaces. L'IA remplit le SEO et exporte vers Amazon, Shopify, Etsy et plus. 7 jours gratuits en annuel.",
    a11yTitle: "Déclaration d'accessibilité | photoZseo",
    a11yDesc: 'photoZseo suit le WCAG 2.1 AA : VoiceOver, Dynamic Type, palettes adaptées au daltonisme, mises en page RTL et navigation clavier sur iPhone, iPad et le web.',
    defaultDesc: 'photoZseo transforme vos photos produit iPhone en annonces prêtes, avec un SEO par IA pour Amazon, Shopify, Etsy, Trendyol et plus de 40 marketplaces.',
  },
  it: {
    homeTitle: 'photoZseo — Foto prodotto e SEO per 46 marketplace',
    homeDesc: "Trasforma una foto iPhone in inserzioni pronte per 46 marketplace. L'IA compila la SEO ed esporta su Amazon, Shopify, Etsy e altri. 7 giorni gratis con il piano annuale.",
    a11yTitle: 'Dichiarazione di accessibilità | photoZseo',
    a11yDesc: 'photoZseo segue le WCAG 2.1 AA: VoiceOver, testo dinamico, palette adatte ai daltonici, layout RTL e navigazione da tastiera su iPhone, iPad e web.',
    defaultDesc: "photoZseo trasforma le foto prodotto dell'iPhone in inserzioni pronte con SEO tramite IA per Amazon, Shopify, Etsy, Trendyol e oltre 40 marketplace.",
  },
  pt: {
    homeTitle: 'photoZseo — Fotos de produto e SEO para 46 marketplaces',
    homeDesc: 'Transforme uma foto do iPhone em anúncios prontos para 46 marketplaces. A IA preenche o SEO e exporta para Amazon, Shopify, Etsy e mais. 7 dias grátis no plano anual.',
    a11yTitle: 'Declaração de acessibilidade | photoZseo',
    a11yDesc: 'O photoZseo segue a WCAG 2.1 AA: VoiceOver, texto dinâmico, paletas seguras para daltônicos, layouts RTL e navegação por teclado no iPhone, iPad e web.',
    defaultDesc: 'O photoZseo transforma fotos de produto do iPhone em anúncios prontos com SEO por IA para Amazon, Shopify, Etsy, Trendyol e mais de 40 marketplaces.',
  },
  pl: {
    homeTitle: "photoZseo — Zdjęcia produktów i SEO dla 46 marketplace'ów",
    homeDesc: "Zamień jedno zdjęcie z iPhone'a w oferty gotowe na 46 marketplace'ów. AI uzupełnia SEO i eksportuje do Amazon, Shopify, Etsy i innych. 7 dni za darmo w planie rocznym.",
    a11yTitle: 'Deklaracja dostępności | photoZseo',
    a11yDesc: 'photoZseo spełnia WCAG 2.1 AA: VoiceOver, dynamiczny tekst, palety bezpieczne dla daltonistów, układy RTL i nawigacja klawiaturą na iPhonie, iPadzie i w sieci.',
    defaultDesc: "photoZseo zamienia zdjęcia produktów z iPhone'a w gotowe oferty z SEO opartym na AI dla Amazon, Shopify, Etsy, Allegro i ponad 40 marketplace'ów.",
  },
  zh: {
    homeTitle: 'photoZseo — 面向 46 个电商平台的产品照片与 SEO',
    homeDesc: '一张 iPhone 照片即可生成适用于 46 个电商平台的商品刊登。AI 自动填写 SEO，一键导出到 Amazon、Shopify、Etsy、Trendyol 等。年度方案享 7 天免费试用。',
    a11yTitle: '无障碍声明 | photoZseo',
    a11yDesc: 'photoZseo 遵循 WCAG 2.1 AA：在 iPhone、iPad 和网页上支持 VoiceOver、动态字体、色盲友好配色、RTL 布局和键盘导航。',
    defaultDesc: 'photoZseo 借助 AI SEO，将 iPhone 产品照片转化为可直接上架 Amazon、Shopify、Etsy、Trendyol 等 40 多个平台的商品刊登。',
  },
  ja: {
    homeTitle: 'photoZseo — 46のマーケットプレイス向け商品写真とSEO',
    homeDesc: 'iPhoneで撮った1枚の写真から、46のマーケットプレイス向け出品データを作成。AIがSEOを自動入力し、Amazon・Shopify・Etsy・Trendyolなどへ書き出し。年額プランは7日間無料。',
    a11yTitle: 'アクセシビリティ方針 | photoZseo',
    a11yDesc: 'photoZseoはWCAG 2.1 AAに準拠。iPhone・iPad・WebでVoiceOver、Dynamic Type、色覚多様性に配慮した配色、RTLレイアウト、キーボード操作に対応。',
    defaultDesc: 'photoZseoはiPhoneの商品写真を、AI SEOでAmazon・Shopify・Etsy・Trendyolなど40以上のマーケットプレイスにすぐ出品できるデータに変換します。',
  },
  ko: {
    homeTitle: 'photoZseo — 46개 마켓플레이스용 상품 사진 & SEO',
    homeDesc: 'iPhone 사진 한 장으로 46개 마켓플레이스용 상품 등록을 완성하세요. AI가 SEO를 채우고 Amazon, Shopify, Etsy, Trendyol 등으로 내보냅니다. 연간 플랜 7일 무료.',
    a11yTitle: '접근성 선언문 | photoZseo',
    a11yDesc: 'photoZseo는 WCAG 2.1 AA를 따릅니다. iPhone, iPad, 웹에서 VoiceOver, 다이내믹 타입, 색약 친화 팔레트, RTL 레이아웃, 키보드 탐색을 지원합니다.',
    defaultDesc: 'photoZseo는 iPhone 상품 사진을 AI SEO로 Amazon, Shopify, Etsy, Trendyol 등 40개 이상 마켓플레이스에 바로 올릴 수 있는 상품 등록으로 바꿉니다.',
  },
  hi: {
    homeTitle: 'photoZseo — 46 मार्केटप्लेस के लिए प्रोडक्ट फ़ोटो और SEO',
    homeDesc: 'एक iPhone फ़ोटो को 46 मार्केटप्लेस के लिए तैयार लिस्टिंग में बदलें। AI SEO भरता है और Amazon, Shopify, Etsy, Trendyol आदि पर एक्सपोर्ट करता है। वार्षिक प्लान पर 7 दिन मुफ़्त।',
    a11yTitle: 'सुलभता वक्तव्य | photoZseo',
    a11yDesc: 'photoZseo WCAG 2.1 AA का पालन करता है: iPhone, iPad और वेब पर VoiceOver, डायनामिक टाइप, कलर-ब्लाइंड सुरक्षित पैलेट, RTL लेआउट और कीबोर्ड नेविगेशन।',
    defaultDesc: 'photoZseo AI SEO के साथ iPhone प्रोडक्ट फ़ोटो को Amazon, Shopify, Etsy, Trendyol और 40+ मार्केटप्लेस के लिए तैयार लिस्टिंग में बदलता है।',
  },
  ur: {
    homeTitle: 'photoZseo — 46 مارکیٹ پلیسز کے لیے پروڈکٹ فوٹوز اور SEO',
    homeDesc: 'ایک iPhone تصویر کو 46 مارکیٹ پلیسز کے لیے تیار لسٹنگز میں بدلیں۔ AI خود SEO بھرتا ہے اور Amazon، Shopify، Etsy، Trendyol وغیرہ پر ایکسپورٹ کرتا ہے۔ سالانہ پلان پر 7 دن مفت۔',
    a11yTitle: 'رسائی کا بیان | photoZseo',
    a11yDesc: 'photoZseo WCAG 2.1 AA پر عمل کرتا ہے: iPhone، iPad اور ویب پر VoiceOver، ڈائنامک ٹائپ، کلر بلائنڈ محفوظ رنگ، RTL لے آؤٹ اور کی بورڈ نیویگیشن۔',
    defaultDesc: 'photoZseo، AI SEO کے ساتھ iPhone پروڈکٹ تصاویر کو Amazon، Shopify، Etsy، Trendyol اور 40 سے زائد مارکیٹ پلیسز کے لیے تیار لسٹنگز میں بدلتا ہے۔',
  },
  ar: {
    homeTitle: 'photoZseo — صور المنتجات وتحسين SEO لـ 46 منصة بيع',
    homeDesc: 'حوّل صورة واحدة من iPhone إلى قوائم جاهزة لـ 46 منصة بيع. يملأ الذكاء الاصطناعي حقول SEO ويصدّر إلى Amazon وShopify وEtsy وTrendyol وغيرها. 7 أيام مجانًا في الخطة السنوية.',
    a11yTitle: 'بيان إمكانية الوصول | photoZseo',
    a11yDesc: 'يلتزم photoZseo بمعيار WCAG 2.1 AA: قارئ VoiceOver والخط الديناميكي وألوان آمنة لعمى الألوان وتخطيطات RTL والتنقل بلوحة المفاتيح على iPhone وiPad والويب.',
    defaultDesc: 'يحوّل photoZseo صور منتجات iPhone إلى قوائم جاهزة مع تحسين SEO بالذكاء الاصطناعي لـ Amazon وShopify وEtsy وTrendyol وأكثر من 40 منصة بيع.',
  },
  fa: {
    homeTitle: 'photoZseo — عکس محصول و سئو برای ۴۶ مارکت‌پلیس',
    homeDesc: 'یک عکس آیفون را به آگهی‌های آماده برای ۴۶ مارکت‌پلیس تبدیل کنید. هوش مصنوعی سئو را پر می‌کند و به Amazon، Shopify، Etsy، Trendyol و غیره خروجی می‌دهد. ۷ روز رایگان در طرح سالانه.',
    a11yTitle: 'بیانیه دسترس‌پذیری | photoZseo',
    a11yDesc: 'photoZseo از WCAG 2.1 AA پیروی می‌کند: VoiceOver، فونت پویا، پالت‌های مناسب کوررنگی، چیدمان RTL و پیمایش با صفحه‌کلید در آیفون، آیپد و وب.',
    defaultDesc: 'photoZseo عکس‌های محصول آیفون را با سئوی هوش مصنوعی به آگهی‌های آماده برای Amazon، Shopify، Etsy، Trendyol و بیش از ۴۰ مارکت‌پلیس تبدیل می‌کند.',
  },
};
