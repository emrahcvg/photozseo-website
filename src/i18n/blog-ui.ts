import type { Lang } from './ui';

export interface BlogUi {
  home: string;
  allPosts: string;
  minRead: string;
  summary: string;
  faq: string;
  ctaKicker: string;
  ctaTitle: string;
  ctaText: string;
}

export const BLOG_UI: Record<Lang, BlogUi> = {
  en: { home: 'Home', allPosts: 'All posts', minRead: 'min read', summary: 'Summary', faq: 'Frequently asked questions', ctaKicker: 'Ready to ship', ctaTitle: 'Stop editing. Start shipping.', ctaText: 'One photo → 46 marketplaces, SEO text, B2B quotes — on your iPhone and iPad. Free to download.' },
  tr: { home: 'Ana sayfa', allPosts: 'Tüm yazılar', minRead: 'dk okuma', summary: 'Özet', faq: 'Sık sorulan sorular', ctaKicker: 'Satışa hazır', ctaTitle: 'Düzenlemeyi bırak. Satmaya başla.', ctaText: "Tek fotoğraf → 46 pazaryeri, SEO metni, B2B teklif; iPhone ve iPad'inde. Ücretsiz indir." },
  de: { home: 'Startseite', allPosts: 'Alle Beiträge', minRead: 'Min. Lesezeit', summary: 'Zusammenfassung', faq: 'Häufig gestellte Fragen', ctaKicker: 'Bereit zum Verkaufen', ctaTitle: 'Weniger bearbeiten. Mehr verkaufen.', ctaText: 'Ein Foto → 46 Marktplätze, SEO-Texte, B2B-Angebote – auf iPhone und iPad. Kostenloser Download.' },
  es: { home: 'Inicio', allPosts: 'Todas las entradas', minRead: 'min de lectura', summary: 'Resumen', faq: 'Preguntas frecuentes', ctaKicker: 'Listo para vender', ctaTitle: 'Deja de editar. Empieza a vender.', ctaText: 'Una foto → 46 marketplaces, textos SEO, presupuestos B2B, en tu iPhone y iPad. Descarga gratuita.' },
  fr: { home: 'Accueil', allPosts: 'Tous les articles', minRead: 'min de lecture', summary: 'Résumé', faq: 'Questions fréquentes', ctaKicker: 'Prêt à vendre', ctaTitle: 'Moins de retouches. Plus de ventes.', ctaText: 'Une photo → 46 marketplaces, textes SEO, devis B2B, sur iPhone et iPad. Téléchargement gratuit.' },
  it: { home: 'Home', allPosts: 'Tutti gli articoli', minRead: 'min di lettura', summary: 'Riepilogo', faq: 'Domande frequenti', ctaKicker: 'Pronto a vendere', ctaTitle: 'Meno editing. Più vendite.', ctaText: 'Una foto → 46 marketplace, testi SEO, preventivi B2B, su iPhone e iPad. Download gratuito.' },
  pt: { home: 'Início', allPosts: 'Todos os artigos', minRead: 'min de leitura', summary: 'Resumo', faq: 'Perguntas frequentes', ctaKicker: 'Pronto para vender', ctaTitle: 'Menos edição. Mais vendas.', ctaText: 'Uma foto → 46 marketplaces, textos de SEO, orçamentos B2B, no iPhone e iPad. Download gratuito.' },
  pl: { home: 'Strona główna', allPosts: 'Wszystkie wpisy', minRead: 'min czytania', summary: 'Podsumowanie', faq: 'Najczęściej zadawane pytania', ctaKicker: 'Gotowe do sprzedaży', ctaTitle: 'Mniej edycji. Więcej sprzedaży.', ctaText: 'Jedno zdjęcie → 46 marketplace’ów, teksty SEO, oferty B2B, na iPhonie i iPadzie. Do pobrania za darmo.' },
  ja: { home: 'ホーム', allPosts: 'すべての記事', minRead: '分で読めます', summary: '要約', faq: 'よくある質問', ctaKicker: '出品の準備はOK', ctaTitle: '編集はもう不要。すぐに出品。', ctaText: '1枚の写真 → 46のマーケットプレイス、SEOテキスト、B2B見積もり。iPhoneとiPadで。無料ダウンロード。' },
  ko: { home: '홈', allPosts: '전체 글', minRead: '분 분량', summary: '요약', faq: '자주 묻는 질문', ctaKicker: '판매 준비 완료', ctaTitle: '편집은 줄이고 판매는 늘리세요.', ctaText: '사진 한 장 → 46개 마켓플레이스, SEO 텍스트, B2B 견적. iPhone과 iPad에서. 무료 다운로드.' },
  zh: { home: '首页', allPosts: '全部文章', minRead: '分钟阅读', summary: '摘要', faq: '常见问题', ctaKicker: '准备上架', ctaTitle: '少修图，多卖货。', ctaText: '一张照片 → 46 个电商平台、SEO 文案、B2B 报价，尽在 iPhone 和 iPad。免费下载。' },
  ar: { home: 'الرئيسية', allPosts: 'كل المقالات', minRead: 'دقائق قراءة', summary: 'ملخص', faq: 'الأسئلة الشائعة', ctaKicker: 'جاهز للبيع', ctaTitle: 'تعديل أقل. مبيعات أكثر.', ctaText: 'صورة واحدة ← 46 متجرًا إلكترونيًا، نصوص SEO، عروض أسعار B2B، على iPhone وiPad. تنزيل مجاني.' },
  hi: { home: 'होम', allPosts: 'सभी लेख', minRead: 'मिनट पढ़ें', summary: 'सारांश', faq: 'अक्सर पूछे जाने वाले प्रश्न', ctaKicker: 'बेचने के लिए तैयार', ctaTitle: 'एडिटिंग कम, बिक्री ज़्यादा।', ctaText: 'एक फ़ोटो → 46 मार्केटप्लेस, SEO टेक्स्ट, B2B कोटेशन — iPhone और iPad पर। मुफ़्त डाउनलोड।' },
  fa: { home: 'خانه', allPosts: 'همه مطالب', minRead: 'دقیقه مطالعه', summary: 'خلاصه', faq: 'پرسش‌های متداول', ctaKicker: 'آماده فروش', ctaTitle: 'ویرایش کمتر، فروش بیشتر.', ctaText: 'یک عکس ← ۴۶ بازارگاه، متن سئو، پیش‌فاکتور B2B، روی iPhone و iPad. دانلود رایگان.' },
  ur: { home: 'ہوم', allPosts: 'تمام مضامین', minRead: 'منٹ مطالعہ', summary: 'خلاصہ', faq: 'اکثر پوچھے جانے والے سوالات', ctaKicker: 'فروخت کے لیے تیار', ctaTitle: 'کم ایڈیٹنگ، زیادہ فروخت۔', ctaText: 'ایک تصویر ← 46 مارکیٹ پلیسز، SEO متن، B2B کوٹیشن، iPhone اور iPad پر۔ مفت ڈاؤن لوڈ۔' },
};
