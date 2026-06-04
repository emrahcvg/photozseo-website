/**
 * storefront-faq.ts — Platform-mechanism FAQ for store product pages.
 *
 * Truth-safe by design: every entry is CONDITIONED on real store data
 * (cart always exists → order Q; payment.iban → payment Q; contact → contact Q).
 * No seller-specific promises (shipping times, return policy) are invented here —
 * those require a per-store `faq` field written by the iOS app (backlog).
 *
 * The SAME entries feed both the visible <section> and the FAQPage JSON-LD,
 * satisfying Google's "FAQ content must be visible on the page" rule.
 */

import type { StoreInfo } from './types';

export interface FaqEntry {
  question: string;
  answer: string;
}

interface FaqStrings {
  heading: string;
  orderQ: string;
  orderA: string;
  payQ: string;
  payA: string;
  contactQ: string;
  contactA: string;
}

const FAQ_I18N: Record<string, FaqStrings> = {
  en: {
    heading: 'Frequently asked questions',
    orderQ: 'How do I place an order?',
    orderA:
      'Add the items you want to your cart, then submit your order with your name, phone, and address. The seller receives it directly.',
    payQ: 'How do I pay?',
    payA: "After you submit your order, you'll receive an order reference and the seller's bank details to complete payment by transfer.",
    contactQ: 'How can I contact the seller?',
    contactA: 'Use the contact details shown on this page to reach the seller directly.',
  },
  tr: {
    heading: 'Sıkça sorulan sorular',
    orderQ: 'Nasıl sipariş veririm?',
    orderA:
      'İstediğiniz ürünleri sepete ekleyin, ardından adınız, telefonunuz ve adresinizle siparişinizi gönderin. Satıcı siparişi doğrudan alır.',
    payQ: 'Nasıl öderim?',
    payA: 'Siparişinizi gönderdikten sonra bir sipariş numarası ve havaleyle ödemeyi tamamlamanız için satıcının banka bilgilerini alırsınız.',
    contactQ: 'Satıcıyla nasıl iletişime geçerim?',
    contactA: 'Satıcıya doğrudan ulaşmak için bu sayfada gösterilen iletişim bilgilerini kullanın.',
  },
  de: {
    heading: 'Häufig gestellte Fragen',
    orderQ: 'Wie gebe ich eine Bestellung auf?',
    orderA:
      'Legen Sie die gewünschten Artikel in den Warenkorb und senden Sie dann Ihre Bestellung mit Name, Telefon und Adresse. Der Verkäufer erhält sie direkt.',
    payQ: 'Wie bezahle ich?',
    payA: 'Nach dem Absenden Ihrer Bestellung erhalten Sie eine Bestellreferenz und die Bankdaten des Verkäufers, um die Zahlung per Überweisung abzuschließen.',
    contactQ: 'Wie kann ich den Verkäufer kontaktieren?',
    contactA: 'Nutzen Sie die auf dieser Seite angezeigten Kontaktdaten, um den Verkäufer direkt zu erreichen.',
  },
  es: {
    heading: 'Preguntas frecuentes',
    orderQ: '¿Cómo hago un pedido?',
    orderA:
      'Añade los artículos que quieras al carrito y luego envía tu pedido con tu nombre, teléfono y dirección. El vendedor lo recibe directamente.',
    payQ: '¿Cómo pago?',
    payA: 'Tras enviar tu pedido, recibirás una referencia y los datos bancarios del vendedor para completar el pago por transferencia.',
    contactQ: '¿Cómo puedo contactar al vendedor?',
    contactA: 'Usa los datos de contacto que aparecen en esta página para comunicarte directamente con el vendedor.',
  },
  pt: {
    heading: 'Perguntas frequentes',
    orderQ: 'Como faço um pedido?',
    orderA:
      'Adicione os itens desejados ao carrinho e envie seu pedido com nome, telefone e endereço. O vendedor o recebe diretamente.',
    payQ: 'Como faço o pagamento?',
    payA: 'Após enviar seu pedido, você receberá uma referência e os dados bancários do vendedor para concluir o pagamento por transferência.',
    contactQ: 'Como posso entrar em contato com o vendedor?',
    contactA: 'Use os dados de contato exibidos nesta página para falar diretamente com o vendedor.',
  },
  ja: {
    heading: 'よくある質問',
    orderQ: '注文方法を教えてください。',
    orderA:
      'ご希望の商品をカートに追加し、お名前・電話番号・住所を入力して注文を送信してください。出品者に直接届きます。',
    payQ: '支払い方法を教えてください。',
    payA: '注文を送信すると、注文番号と、銀行振込で支払いを完了するための出品者の口座情報が届きます。',
    contactQ: '出品者にどうやって連絡できますか？',
    contactA: 'このページに表示されている連絡先を使って、出品者に直接ご連絡ください。',
  },
  ko: {
    heading: '자주 묻는 질문',
    orderQ: '주문은 어떻게 하나요?',
    orderA:
      '원하는 상품을 장바구니에 담은 뒤 이름, 전화번호, 주소를 입력해 주문을 보내세요. 판매자에게 바로 전달됩니다.',
    payQ: '결제는 어떻게 하나요?',
    payA: '주문을 보내면 주문 번호와 계좌 이체로 결제를 완료할 수 있는 판매자의 은행 정보가 제공됩니다.',
    contactQ: '판매자에게 어떻게 연락하나요?',
    contactA: '이 페이지에 표시된 연락처를 사용해 판매자에게 직접 연락하세요.',
  },
  zh: {
    heading: '常见问题',
    orderQ: '我该如何下单？',
    orderA: '将想要的商品加入购物车，然后填写姓名、电话和地址提交订单。卖家会直接收到。',
    payQ: '我该如何付款？',
    payA: '提交订单后，您会收到订单编号和卖家的银行信息，以便通过转账完成付款。',
    contactQ: '我该如何联系卖家？',
    contactA: '使用本页面显示的联系方式直接联系卖家。',
  },
  ar: {
    heading: 'الأسئلة الشائعة',
    orderQ: 'كيف أقوم بتقديم طلب؟',
    orderA:
      'أضف المنتجات التي تريدها إلى السلة، ثم أرسل طلبك مع اسمك ورقم هاتفك وعنوانك. يصل الطلب إلى البائع مباشرة.',
    payQ: 'كيف أدفع؟',
    payA: 'بعد إرسال طلبك، ستتلقى رقم الطلب والتفاصيل المصرفية للبائع لإتمام الدفع عبر التحويل.',
    contactQ: 'كيف يمكنني التواصل مع البائع؟',
    contactA: 'استخدم تفاصيل الاتصال الموضحة في هذه الصفحة للتواصل مع البائع مباشرة.',
  },
  fa: {
    heading: 'پرسش‌های متداول',
    orderQ: 'چگونه سفارش ثبت کنم؟',
    orderA:
      'کالاهای موردنظر را به سبد خرید اضافه کنید، سپس سفارش خود را همراه با نام، تلفن و آدرس ارسال کنید. فروشنده آن را مستقیماً دریافت می‌کند.',
    payQ: 'چگونه پرداخت کنم؟',
    payA: 'پس از ارسال سفارش، شماره سفارش و اطلاعات بانکی فروشنده را برای تکمیل پرداخت از طریق انتقال دریافت می‌کنید.',
    contactQ: 'چگونه می‌توانم با فروشنده تماس بگیرم؟',
    contactA: 'برای تماس مستقیم با فروشنده از اطلاعات تماس نمایش‌داده‌شده در این صفحه استفاده کنید.',
  },
  ur: {
    heading: 'اکثر پوچھے گئے سوالات',
    orderQ: 'میں آرڈر کیسے دوں؟',
    orderA:
      'اپنی پسند کی اشیاء کارٹ میں شامل کریں، پھر اپنا نام، فون اور پتہ درج کر کے آرڈر بھیجیں۔ بیچنے والے کو یہ براہ راست موصول ہوتا ہے۔',
    payQ: 'میں ادائیگی کیسے کروں؟',
    payA: 'اپنا آرڈر بھیجنے کے بعد، آپ کو آرڈر نمبر اور ٹرانسفر کے ذریعے ادائیگی مکمل کرنے کے لیے بیچنے والے کی بینک تفصیلات موصول ہوں گی۔',
    contactQ: 'میں بیچنے والے سے کیسے رابطہ کروں؟',
    contactA: 'بیچنے والے سے براہ راست رابطہ کرنے کے لیے اس صفحے پر دکھائی گئی رابطہ تفصیلات استعمال کریں۔',
  },
  hi: {
    heading: 'अक्सर पूछे जाने वाले प्रश्न',
    orderQ: 'मैं ऑर्डर कैसे करूँ?',
    orderA:
      'जो वस्तुएँ चाहिए उन्हें कार्ट में जोड़ें, फिर अपना नाम, फ़ोन और पता भरकर ऑर्डर भेजें। विक्रेता को यह सीधे मिल जाता है।',
    payQ: 'मैं भुगतान कैसे करूँ?',
    payA: 'ऑर्डर भेजने के बाद, आपको एक ऑर्डर संदर्भ और ट्रांसफ़र द्वारा भुगतान पूरा करने के लिए विक्रेता की बैंक जानकारी मिलेगी।',
    contactQ: 'मैं विक्रेता से कैसे संपर्क करूँ?',
    contactA: 'विक्रेता से सीधे संपर्क करने के लिए इस पृष्ठ पर दिखाए गए संपर्क विवरण का उपयोग करें।',
  },
};

function strings(locale: string): FaqStrings {
  return FAQ_I18N[locale] ?? FAQ_I18N.en;
}

/** Localized heading for the visible FAQ section. */
export function faqHeading(locale: string): string {
  return strings(locale).heading;
}

/**
 * Build the conditional FAQ entry list for a store. Each entry is gated on the
 * real data that makes its answer true; absent data → entry omitted entirely.
 */
export function buildFaqEntries(store: StoreInfo, locale: string): FaqEntry[] {
  const s = strings(locale);
  const entries: FaqEntry[] = [];

  // Cart/order flow always exists on a product page.
  entries.push({ question: s.orderQ, answer: s.orderA });

  // Payment-by-transfer answer only when the seller actually published an IBAN.
  if (store.payment?.iban) {
    entries.push({ question: s.payQ, answer: s.payA });
  }

  // Contact answer only when at least one contact channel exists.
  const c = store.contact;
  if (c.whatsapp || c.phone || c.email || (c.social && c.social.length > 0)) {
    entries.push({ question: s.contactQ, answer: s.contactA });
  }

  return entries;
}
