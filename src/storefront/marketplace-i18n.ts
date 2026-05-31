/**
 * marketplace-i18n.ts — Static UI strings for the /market discovery layer, 12 locales.
 * Product card content is translated separately (visitor language) via the storefront
 * translation cache; THIS table is only chrome (labels, buttons, headings).
 */

export const MK_LOCALES = ['en', 'tr', 'de', 'es', 'pt', 'ja', 'ko', 'zh', 'ar', 'fa', 'ur', 'hi'] as const;
export type MkLocale = (typeof MK_LOCALES)[number];

type Key =
  | 'marketTitle' | 'searchPlaceholder' | 'newProducts' | 'stores' | 'featured'
  | 'categories' | 'allCategories' | 'noResults' | 'filters' | 'apply' | 'clear'
  | 'price' | 'city' | 'inStock' | 'sortNew' | 'sortPriceAsc' | 'sortPriceDesc'
  | 'sortLabel' | 'min' | 'max' | 'results' | 'visitStore' | 'trustBadge'
  | 'report' | 'addToCart' | 'cart' | 'sendCart' | 'emptyCart' | 'name'
  | 'phone' | 'address' | 'note' | 'required' | 'submitOrder' | 'orderRef'
  | 'payByTransfer' | 'iban' | 'ibanName' | 'paymentDesc' | 'openWhatsapp'
  | 'qty' | 'remove' | 'total' | 'browseAll' | 'soldOut' | 'contactForPrice';

const STRINGS: Record<string, Partial<Record<Key, string>>> = {
  en: {
    marketTitle: 'Marketplace', searchPlaceholder: 'Search products…',
    newProducts: 'New products', stores: 'Stores', featured: 'Featured',
    categories: 'Categories', allCategories: 'All', noResults: 'No results found',
    filters: 'Filters', apply: 'Apply', clear: 'Clear', price: 'Price',
    city: 'City', inStock: 'In stock only', sortNew: 'Newest',
    sortPriceAsc: 'Price: low to high', sortPriceDesc: 'Price: high to low',
    sortLabel: 'Sort', min: 'Min', max: 'Max', results: 'results',
    visitStore: 'Visit store', trustBadge: 'Independent sellers · bank transfer · no fake reviews',
    report: 'Report', addToCart: 'Add to cart', cart: 'Cart', sendCart: 'Send cart',
    emptyCart: 'Your cart is empty', name: 'Full name', phone: 'Phone',
    address: 'Address', note: 'Note', required: 'This field is required',
    submitOrder: 'Send order via WhatsApp', orderRef: 'Order reference',
    payByTransfer: 'Pay by bank transfer', iban: 'IBAN', ibanName: 'Account name',
    paymentDesc: 'Payment description', openWhatsapp: 'Open WhatsApp', qty: 'Qty',
    remove: 'Remove', total: 'Total', browseAll: 'Browse all',
    soldOut: 'Sold out', contactForPrice: 'Contact for price',
  },
  tr: {
    marketTitle: 'Pazar Yeri', searchPlaceholder: 'Ürün ara…',
    newProducts: 'Yeni Ürünler', stores: 'Mağazalar', featured: 'Öne Çıkanlar',
    categories: 'Kategoriler', allCategories: 'Tümü', noResults: 'Sonuç bulunamadı',
    filters: 'Filtreler', apply: 'Uygula', clear: 'Temizle', price: 'Fiyat',
    city: 'Şehir', inStock: 'Sadece stoktakiler', sortNew: 'En yeni',
    sortPriceAsc: 'Fiyat: düşükten yükseğe', sortPriceDesc: 'Fiyat: yüksekten düşüğe',
    sortLabel: 'Sırala', min: 'En az', max: 'En çok', results: 'sonuç',
    visitStore: 'Mağazaya git', trustBadge: 'Bağımsız satıcı · havale ile ödeme · sahte yorum yok',
    report: 'Şikayet et', addToCart: 'Sepete Ekle', cart: 'Sepet', sendCart: 'Sepeti Gönder',
    emptyCart: 'Sepetiniz boş', name: 'Ad Soyad', phone: 'Telefon',
    address: 'Adres', note: 'Not', required: 'Bu alan zorunludur',
    submitOrder: 'WhatsApp ile sipariş gönder', orderRef: 'Sipariş referansı',
    payByTransfer: 'Havale ile ödeme', iban: 'IBAN', ibanName: 'Hesap adı',
    paymentDesc: 'Ödeme açıklaması', openWhatsapp: 'WhatsApp’ı aç', qty: 'Adet',
    remove: 'Kaldır', total: 'Toplam', browseAll: 'Tümünü gör',
    soldOut: 'Tükendi', contactForPrice: 'Fiyat için iletişime geç',
  },
  de: { marketTitle: 'Marktplatz', searchPlaceholder: 'Produkte suchen…', newProducts: 'Neue Produkte', stores: 'Shops', featured: 'Empfohlen', categories: 'Kategorien', allCategories: 'Alle', noResults: 'Keine Ergebnisse', filters: 'Filter', apply: 'Anwenden', clear: 'Zurücksetzen', price: 'Preis', city: 'Stadt', inStock: 'Nur auf Lager', sortNew: 'Neueste', sortPriceAsc: 'Preis: aufsteigend', sortPriceDesc: 'Preis: absteigend', sortLabel: 'Sortieren', min: 'Min', max: 'Max', results: 'Ergebnisse', visitStore: 'Shop besuchen', trustBadge: 'Unabhängige Verkäufer · Überweisung · keine gefälschten Bewertungen', report: 'Melden', addToCart: 'In den Warenkorb', cart: 'Warenkorb', sendCart: 'Warenkorb senden', emptyCart: 'Ihr Warenkorb ist leer', name: 'Vollständiger Name', phone: 'Telefon', address: 'Adresse', note: 'Notiz', required: 'Dieses Feld ist erforderlich', submitOrder: 'Bestellung per WhatsApp senden', orderRef: 'Bestellreferenz', payByTransfer: 'Zahlung per Überweisung', iban: 'IBAN', ibanName: 'Kontoinhaber', paymentDesc: 'Verwendungszweck', openWhatsapp: 'WhatsApp öffnen', qty: 'Anz.', remove: 'Entfernen', total: 'Gesamt', browseAll: 'Alle ansehen', soldOut: 'Ausverkauft', contactForPrice: 'Preis auf Anfrage' },
  es: { marketTitle: 'Mercado', searchPlaceholder: 'Buscar productos…', newProducts: 'Nuevos productos', stores: 'Tiendas', featured: 'Destacados', categories: 'Categorías', allCategories: 'Todas', noResults: 'No se encontraron resultados', filters: 'Filtros', apply: 'Aplicar', clear: 'Limpiar', price: 'Precio', city: 'Ciudad', inStock: 'Solo en stock', sortNew: 'Más nuevos', sortPriceAsc: 'Precio: de menor a mayor', sortPriceDesc: 'Precio: de mayor a menor', sortLabel: 'Ordenar', min: 'Mín', max: 'Máx', results: 'resultados', visitStore: 'Visitar tienda', trustBadge: 'Vendedores independientes · transferencia · sin reseñas falsas', report: 'Reportar', addToCart: 'Añadir al carrito', cart: 'Carrito', sendCart: 'Enviar carrito', emptyCart: 'Tu carrito está vacío', name: 'Nombre completo', phone: 'Teléfono', address: 'Dirección', note: 'Nota', required: 'Este campo es obligatorio', submitOrder: 'Enviar pedido por WhatsApp', orderRef: 'Referencia del pedido', payByTransfer: 'Pago por transferencia', iban: 'IBAN', ibanName: 'Titular de la cuenta', paymentDesc: 'Concepto de pago', openWhatsapp: 'Abrir WhatsApp', qty: 'Cant.', remove: 'Quitar', total: 'Total', browseAll: 'Ver todo', soldOut: 'Agotado', contactForPrice: 'Consultar precio' },
  pt: { marketTitle: 'Mercado', searchPlaceholder: 'Buscar produtos…', newProducts: 'Novos produtos', stores: 'Lojas', featured: 'Destaques', categories: 'Categorias', allCategories: 'Todas', noResults: 'Nenhum resultado encontrado', filters: 'Filtros', apply: 'Aplicar', clear: 'Limpar', price: 'Preço', city: 'Cidade', inStock: 'Somente em estoque', sortNew: 'Mais recentes', sortPriceAsc: 'Preço: do menor ao maior', sortPriceDesc: 'Preço: do maior ao menor', sortLabel: 'Ordenar', min: 'Mín', max: 'Máx', results: 'resultados', visitStore: 'Visitar loja', trustBadge: 'Vendedores independentes · transferência · sem avaliações falsas', report: 'Denunciar', addToCart: 'Adicionar ao carrinho', cart: 'Carrinho', sendCart: 'Enviar carrinho', emptyCart: 'Seu carrinho está vazio', name: 'Nome completo', phone: 'Telefone', address: 'Endereço', note: 'Observação', required: 'Este campo é obrigatório', submitOrder: 'Enviar pedido pelo WhatsApp', orderRef: 'Referência do pedido', payByTransfer: 'Pagamento por transferência', iban: 'IBAN', ibanName: 'Nome do titular', paymentDesc: 'Descrição do pagamento', openWhatsapp: 'Abrir WhatsApp', qty: 'Qtd', remove: 'Remover', total: 'Total', browseAll: 'Ver tudo', soldOut: 'Esgotado', contactForPrice: 'Consultar preço' },
  ja: { marketTitle: 'マーケットプレイス', searchPlaceholder: '商品を検索…', newProducts: '新着商品', stores: 'ストア', featured: 'おすすめ', categories: 'カテゴリー', allCategories: 'すべて', noResults: '結果が見つかりません', filters: 'フィルター', apply: '適用', clear: 'クリア', price: '価格', city: '都市', inStock: '在庫ありのみ', sortNew: '新着順', sortPriceAsc: '価格: 安い順', sortPriceDesc: '価格: 高い順', sortLabel: '並び替え', min: '最小', max: '最大', results: '件', visitStore: 'ストアを見る', trustBadge: '独立した出品者 · 銀行振込 · 偽レビューなし', report: '報告', addToCart: 'カートに追加', cart: 'カート', sendCart: 'カートを送信', emptyCart: 'カートは空です', name: '氏名', phone: '電話番号', address: '住所', note: '備考', required: 'この項目は必須です', submitOrder: 'WhatsAppで注文を送信', orderRef: '注文番号', payByTransfer: '銀行振込でのお支払い', iban: 'IBAN', ibanName: '口座名義', paymentDesc: '振込メモ', openWhatsapp: 'WhatsAppを開く', qty: '数量', remove: '削除', total: '合計', browseAll: 'すべて見る', soldOut: '売り切れ', contactForPrice: '価格はお問い合わせ' },
  ko: { marketTitle: '마켓플레이스', searchPlaceholder: '상품 검색…', newProducts: '신규 상품', stores: '스토어', featured: '추천', categories: '카테고리', allCategories: '전체', noResults: '검색 결과가 없습니다', filters: '필터', apply: '적용', clear: '지우기', price: '가격', city: '도시', inStock: '재고 있음만', sortNew: '최신순', sortPriceAsc: '가격: 낮은순', sortPriceDesc: '가격: 높은순', sortLabel: '정렬', min: '최소', max: '최대', results: '개', visitStore: '스토어 보기', trustBadge: '독립 판매자 · 계좌이체 · 가짜 리뷰 없음', report: '신고', addToCart: '장바구니 담기', cart: '장바구니', sendCart: '장바구니 보내기', emptyCart: '장바구니가 비어 있습니다', name: '이름', phone: '전화번호', address: '주소', note: '메모', required: '필수 항목입니다', submitOrder: 'WhatsApp으로 주문 보내기', orderRef: '주문 번호', payByTransfer: '계좌이체로 결제', iban: 'IBAN', ibanName: '예금주', paymentDesc: '입금 설명', openWhatsapp: 'WhatsApp 열기', qty: '수량', remove: '삭제', total: '합계', browseAll: '전체 보기', soldOut: '품절', contactForPrice: '가격 문의' },
  zh: { marketTitle: '市场', searchPlaceholder: '搜索商品…', newProducts: '新品', stores: '店铺', featured: '精选', categories: '分类', allCategories: '全部', noResults: '未找到结果', filters: '筛选', apply: '应用', clear: '清除', price: '价格', city: '城市', inStock: '仅有货', sortNew: '最新', sortPriceAsc: '价格: 从低到高', sortPriceDesc: '价格: 从高到低', sortLabel: '排序', min: '最低', max: '最高', results: '个结果', visitStore: '访问店铺', trustBadge: '独立卖家 · 银行转账 · 无虚假评价', report: '举报', addToCart: '加入购物车', cart: '购物车', sendCart: '发送购物车', emptyCart: '购物车为空', name: '姓名', phone: '电话', address: '地址', note: '备注', required: '此字段为必填项', submitOrder: '通过 WhatsApp 发送订单', orderRef: '订单编号', payByTransfer: '银行转账付款', iban: 'IBAN', ibanName: '账户名', paymentDesc: '付款说明', openWhatsapp: '打开 WhatsApp', qty: '数量', remove: '移除', total: '合计', browseAll: '查看全部', soldOut: '售罄', contactForPrice: '询价' },
  ar: { marketTitle: 'السوق', searchPlaceholder: 'ابحث عن المنتجات…', newProducts: 'منتجات جديدة', stores: 'المتاجر', featured: 'مميز', categories: 'الفئات', allCategories: 'الكل', noResults: 'لا توجد نتائج', filters: 'التصفية', apply: 'تطبيق', clear: 'مسح', price: 'السعر', city: 'المدينة', inStock: 'المتوفر فقط', sortNew: 'الأحدث', sortPriceAsc: 'السعر: من الأقل للأعلى', sortPriceDesc: 'السعر: من الأعلى للأقل', sortLabel: 'الترتيب', min: 'الأدنى', max: 'الأقصى', results: 'نتيجة', visitStore: 'زيارة المتجر', trustBadge: 'بائعون مستقلون · تحويل بنكي · لا مراجعات مزيفة', report: 'إبلاغ', addToCart: 'أضف إلى السلة', cart: 'السلة', sendCart: 'إرسال السلة', emptyCart: 'سلتك فارغة', name: 'الاسم الكامل', phone: 'الهاتف', address: 'العنوان', note: 'ملاحظة', required: 'هذا الحقل مطلوب', submitOrder: 'إرسال الطلب عبر واتساب', orderRef: 'رقم الطلب', payByTransfer: 'الدفع بالتحويل البنكي', iban: 'IBAN', ibanName: 'اسم صاحب الحساب', paymentDesc: 'وصف الدفع', openWhatsapp: 'فتح واتساب', qty: 'الكمية', remove: 'إزالة', total: 'الإجمالي', browseAll: 'تصفح الكل', soldOut: 'نفد', contactForPrice: 'تواصل لمعرفة السعر' },
  fa: { marketTitle: 'بازار', searchPlaceholder: 'جستجوی محصولات…', newProducts: 'محصولات جدید', stores: 'فروشگاه‌ها', featured: 'ویژه', categories: 'دسته‌بندی‌ها', allCategories: 'همه', noResults: 'نتیجه‌ای یافت نشد', filters: 'فیلترها', apply: 'اعمال', clear: 'پاک کردن', price: 'قیمت', city: 'شهر', inStock: 'فقط موجود', sortNew: 'جدیدترین', sortPriceAsc: 'قیمت: کم به زیاد', sortPriceDesc: 'قیمت: زیاد به کم', sortLabel: 'مرتب‌سازی', min: 'حداقل', max: 'حداکثر', results: 'نتیجه', visitStore: 'مشاهده فروشگاه', trustBadge: 'فروشندگان مستقل · حواله بانکی · بدون نظر جعلی', report: 'گزارش', addToCart: 'افزودن به سبد', cart: 'سبد خرید', sendCart: 'ارسال سبد', emptyCart: 'سبد خرید شما خالی است', name: 'نام کامل', phone: 'تلفن', address: 'آدرس', note: 'یادداشت', required: 'این فیلد الزامی است', submitOrder: 'ارسال سفارش از طریق واتساپ', orderRef: 'شماره سفارش', payByTransfer: 'پرداخت با حواله بانکی', iban: 'IBAN', ibanName: 'نام صاحب حساب', paymentDesc: 'توضیح پرداخت', openWhatsapp: 'باز کردن واتساپ', qty: 'تعداد', remove: 'حذف', total: 'مجموع', browseAll: 'مشاهده همه', soldOut: 'ناموجود', contactForPrice: 'برای قیمت تماس بگیرید' },
  ur: { marketTitle: 'مارکیٹ', searchPlaceholder: 'مصنوعات تلاش کریں…', newProducts: 'نئی مصنوعات', stores: 'اسٹورز', featured: 'نمایاں', categories: 'زمرے', allCategories: 'تمام', noResults: 'کوئی نتیجہ نہیں ملا', filters: 'فلٹرز', apply: 'لاگو کریں', clear: 'صاف کریں', price: 'قیمت', city: 'شہر', inStock: 'صرف اسٹاک میں', sortNew: 'تازہ ترین', sortPriceAsc: 'قیمت: کم سے زیادہ', sortPriceDesc: 'قیمت: زیادہ سے کم', sortLabel: 'ترتیب دیں', min: 'کم از کم', max: 'زیادہ سے زیادہ', results: 'نتائج', visitStore: 'اسٹور دیکھیں', trustBadge: 'آزاد فروخت کنندگان · بینک ٹرانسفر · کوئی جعلی جائزہ نہیں', report: 'رپورٹ کریں', addToCart: 'کارٹ میں شامل کریں', cart: 'کارٹ', sendCart: 'کارٹ بھیجیں', emptyCart: 'آپ کا کارٹ خالی ہے', name: 'پورا نام', phone: 'فون', address: 'پتہ', note: 'نوٹ', required: 'یہ خانہ لازمی ہے', submitOrder: 'واٹس ایپ کے ذریعے آرڈر بھیجیں', orderRef: 'آرڈر حوالہ', payByTransfer: 'بینک ٹرانسفر سے ادائیگی', iban: 'IBAN', ibanName: 'اکاؤنٹ کا نام', paymentDesc: 'ادائیگی کی تفصیل', openWhatsapp: 'واٹس ایپ کھولیں', qty: 'مقدار', remove: 'ہٹائیں', total: 'کل', browseAll: 'سب دیکھیں', soldOut: 'ختم', contactForPrice: 'قیمت کے لیے رابطہ کریں' },
  hi: { marketTitle: 'मार्केटप्लेस', searchPlaceholder: 'उत्पाद खोजें…', newProducts: 'नए उत्पाद', stores: 'स्टोर', featured: 'फ़ीचर्ड', categories: 'श्रेणियाँ', allCategories: 'सभी', noResults: 'कोई परिणाम नहीं मिला', filters: 'फ़िल्टर', apply: 'लागू करें', clear: 'साफ़ करें', price: 'मूल्य', city: 'शहर', inStock: 'केवल स्टॉक में', sortNew: 'नवीनतम', sortPriceAsc: 'मूल्य: कम से अधिक', sortPriceDesc: 'मूल्य: अधिक से कम', sortLabel: 'क्रमबद्ध करें', min: 'न्यूनतम', max: 'अधिकतम', results: 'परिणाम', visitStore: 'स्टोर देखें', trustBadge: 'स्वतंत्र विक्रेता · बैंक ट्रांसफ़र · कोई नकली समीक्षा नहीं', report: 'रिपोर्ट करें', addToCart: 'कार्ट में जोड़ें', cart: 'कार्ट', sendCart: 'कार्ट भेजें', emptyCart: 'आपका कार्ट खाली है', name: 'पूरा नाम', phone: 'फ़ोन', address: 'पता', note: 'टिप्पणी', required: 'यह फ़ील्ड आवश्यक है', submitOrder: 'WhatsApp से ऑर्डर भेजें', orderRef: 'ऑर्डर संदर्भ', payByTransfer: 'बैंक ट्रांसफ़र से भुगतान', iban: 'IBAN', ibanName: 'खाताधारक का नाम', paymentDesc: 'भुगतान विवरण', openWhatsapp: 'WhatsApp खोलें', qty: 'मात्रा', remove: 'हटाएँ', total: 'कुल', browseAll: 'सभी देखें', soldOut: 'स्टॉक ख़त्म', contactForPrice: 'मूल्य के लिए संपर्क करें' },
};

export function mt(locale: string, key: Key | string): string {
  const table = STRINGS[locale] ?? STRINGS.en;
  const fromLocale = (table as Record<string, string>)[key];
  if (fromLocale != null) return fromLocale;
  const fromEn = (STRINGS.en as Record<string, string>)[key];
  return fromEn ?? key;
}
