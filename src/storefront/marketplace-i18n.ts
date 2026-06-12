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
  | 'qty' | 'remove' | 'total' | 'browseAll' | 'soldOut' | 'contactForPrice'
  | 'backToStore' | 'backToMarket' | 'currency' | 'language' | 'rateNote'
  | 'contact' | 'call' | 'other' | 'poweredBy' | 'reportStore'
  | 'productDetails' | 'orderViaWhatsApp' | 'favorite'
  | 'deliveryInfo' | 'addNote'
  // Hesap/giriş UI metinleri (üst bar)
  | 'signIn' | 'signOut' | 'myFavorites' | 'myOrders' | 'discover'
  // Sipariş sayfası
  | 'noOrders' | 'orderStatus' | 'orderItems'
  // Favori/Sepet kullanıcı sayfaları
  | 'myCart' | 'emptyFavorites'
  // Uluslararası transfer alanları
  | 'bankName' | 'swift'
  // Otomotiv araç-uyumu filtresi (katman 3)
  | 'fitsVehicle' | 'allMakes' | 'allModels'
  // Alıcı ödeme güvenliği (dolandırıcılık önleme)
  | 'paySafetyTitle' | 'paySafetyTip'
  // Satıcı işletme türü rozeti (şeffaflık)
  | 'sellerTypeIndividual' | 'sellerTypeManufacturer' | 'sellerTypeTradingCompany'
  | 'sellerTypeManufacturerTrader' | 'sellerTypeBrandOwner' | 'sellerTypeDistributor'
  // Alıcı güvenlik bölümü (ürün sayfası, CTA öncesi)
  | 'buyerSafetyTitle' | 'sellerReachable' | 'sellerNotReachable'
  | 'largeDiscountWarning' | 'publisherNote';

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
    backToStore: 'Back to store', backToMarket: '← Marketplace',
    currency: 'Currency', language: 'Language', rateNote: '≈ approx · rates updated daily',
    contact: 'Contact', call: 'Call', other: 'Other',
    poweredBy: 'This store was created with photoZseo',
    reportStore: 'Report this store',
    productDetails: 'Product details', orderViaWhatsApp: 'Order via WhatsApp',
    deliveryInfo: 'Delivery details', addNote: 'Add a note (optional)',
    favorite: 'Add to favorites',
    signIn: 'Sign in', signOut: 'Sign out',
    myFavorites: 'My Favorites', myOrders: 'My Orders',
    discover: 'Discover',
    noOrders: 'No orders yet', orderStatus: 'Status', orderItems: 'Items',
    myCart: 'My Cart', emptyFavorites: 'No favorites yet',
    bankName: 'Bank', swift: 'SWIFT/BIC',
    fitsVehicle: 'Filter by vehicle', allMakes: 'All makes', allModels: 'All models',
    paySafetyTitle: 'Before you pay',
    paySafetyTip: "Bank transfers can't be reversed. Make sure you trust this seller, never pay extra “fees”, and prefer a payment method with buyer protection when possible. photoZseo only publishes this store — it does not process payments or guarantee orders.",
    sellerTypeIndividual: 'Individual seller',
    sellerTypeManufacturer: 'Manufacturer',
    sellerTypeTradingCompany: 'Trading company',
    sellerTypeManufacturerTrader: 'Manufacturer & trader',
    sellerTypeBrandOwner: 'Brand owner',
    sellerTypeDistributor: 'Distributor',
    buyerSafetyTitle: 'Buyer info',
    sellerReachable: 'Seller can be contacted',
    sellerNotReachable: 'No contact details provided',
    largeDiscountWarning: 'Large discount – verify the price before paying',
    publisherNote: 'photoZseo publishes this store only – it does not process payments or guarantee orders.',
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
    backToStore: 'Mağazaya dön', backToMarket: '← Pazar Yeri',
    currency: 'Para birimi', language: 'Dil', rateNote: '≈ yaklaşık · kur günlük güncellenir',
    contact: 'İletişim', call: 'Ara', other: 'Diğer',
    poweredBy: 'Bu mağaza photoZseo ile oluşturuldu',
    reportStore: 'Bu mağazayı şikayet et',
    productDetails: 'Ürün Özellikleri', orderViaWhatsApp: 'WhatsApp ile sipariş ver',
    deliveryInfo: 'Teslimat bilgileri', addNote: 'Not ekle (isteğe bağlı)',
    favorite: 'Favorilere ekle',
    signIn: 'Giriş yap', signOut: 'Çıkış yap',
    myFavorites: 'Favorilerim', myOrders: 'Siparişlerim',
    discover: 'Keşfet',
    noOrders: 'Henüz siparişin yok', orderStatus: 'Durum', orderItems: 'Ürünler',
    myCart: 'Sepetim', emptyFavorites: 'Henüz favorin yok',
    bankName: 'Banka', swift: 'SWIFT/BIC',
    fitsVehicle: 'Araca göre filtrele', allMakes: 'Tüm markalar', allModels: 'Tüm modeller',
    paySafetyTitle: 'Ödemeden önce',
    paySafetyTip: 'Banka havalesi geri alınamaz. Bu satıcıya güvendiğinizden emin olun, asla ekstra “ücret” ödemeyin ve mümkünse alıcı korumalı bir ödeme yöntemi tercih edin. photoZseo yalnızca bu mağazayı yayınlar — ödemeleri işlemez ve siparişleri garanti etmez.',
    sellerTypeIndividual: 'Şahıs satıcı',
    sellerTypeManufacturer: 'Üretici',
    sellerTypeTradingCompany: 'Ticaret firması',
    sellerTypeManufacturerTrader: 'Üretici & ticaret',
    sellerTypeBrandOwner: 'Marka sahibi',
    sellerTypeDistributor: 'Distribütör',
    buyerSafetyTitle: 'Alıcı bilgisi',
    sellerReachable: 'Satıcıya ulaşılabilir',
    sellerNotReachable: 'İletişim bilgisi belirtilmemiş',
    largeDiscountWarning: 'Büyük indirim – ödemeden önce fiyatı doğrulayın',
    publisherNote: 'photoZseo yalnızca bu mağazayı yayınlar – ödeme işlemez, sipariş garantisi vermez.',
  },
  de: { marketTitle: 'Marktplatz', searchPlaceholder: 'Produkte suchen…', newProducts: 'Neue Produkte', stores: 'Shops', featured: 'Empfohlen', categories: 'Kategorien', allCategories: 'Alle', noResults: 'Keine Ergebnisse', filters: 'Filter', apply: 'Anwenden', clear: 'Zurücksetzen', price: 'Preis', city: 'Stadt', inStock: 'Nur auf Lager', sortNew: 'Neueste', sortPriceAsc: 'Preis: aufsteigend', sortPriceDesc: 'Preis: absteigend', sortLabel: 'Sortieren', min: 'Min', max: 'Max', results: 'Ergebnisse', visitStore: 'Shop besuchen', trustBadge: 'Unabhängige Verkäufer · Überweisung · keine gefälschten Bewertungen', report: 'Melden', addToCart: 'In den Warenkorb', cart: 'Warenkorb', sendCart: 'Warenkorb senden', emptyCart: 'Ihr Warenkorb ist leer', name: 'Vollständiger Name', phone: 'Telefon', address: 'Adresse', note: 'Notiz', required: 'Dieses Feld ist erforderlich', submitOrder: 'Bestellung per WhatsApp senden', orderRef: 'Bestellreferenz', payByTransfer: 'Zahlung per Überweisung', iban: 'IBAN', ibanName: 'Kontoinhaber', paymentDesc: 'Verwendungszweck', openWhatsapp: 'WhatsApp öffnen', qty: 'Anz.', remove: 'Entfernen', total: 'Gesamt', browseAll: 'Alle ansehen', soldOut: 'Ausverkauft', contactForPrice: 'Preis auf Anfrage', backToStore: 'Zurück zum Shop', backToMarket: '← Marktplatz', currency: 'Währung', language: 'Sprache', rateNote: '≈ ca. · Kurse täglich aktualisiert', contact: 'Kontakt', call: 'Anrufen', other: 'Sonstige', poweredBy: 'Dieser Shop wurde mit photoZseo erstellt', reportStore: 'Diesen Shop melden', productDetails: 'Produktdetails', orderViaWhatsApp: 'Per WhatsApp bestellen', deliveryInfo: 'Lieferdetails', addNote: 'Fügen Sie eine Notiz hinzu (optional)', favorite: 'Zu Favoriten hinzufügen', signIn: 'anmelden', signOut: 'Abmelden', myFavorites: 'Meine Favoriten', myOrders: 'Meine Bestellungen', discover: 'Entdecken', noOrders: 'Noch keine Bestellungen', orderStatus: 'Status', orderItems: 'Artikel', myCart: 'Mein Warenkorb', emptyFavorites: 'Noch keine Favoriten', bankName: 'Bank', swift: 'SWIFT/BIC', fitsVehicle: 'Nach Fahrzeug filtern', allMakes: 'Alle Marken', allModels: 'Alle Modelle', paySafetyTitle: 'Bevor Sie bezahlen', paySafetyTip: 'Banküberweisungen können nicht rückgängig gemacht werden. Stellen Sie sicher, dass Sie diesem Verkäufer vertrauen, zahlen Sie niemals zusätzliche „Gebühren“ und bevorzugen Sie nach Möglichkeit eine Zahlungsmethode mit Käuferschutz. photoZseo veröffentlicht diesen Shop nur – er verarbeitet keine Zahlungen und garantiert keine Bestellungen.', sellerTypeIndividual: 'Einzelverkäufer', sellerTypeManufacturer: 'Hersteller', sellerTypeTradingCompany: 'Handelsunternehmen', sellerTypeManufacturerTrader: 'Hersteller & Händler', sellerTypeBrandOwner: 'Markeninhaber', sellerTypeDistributor: 'Verteiler' },
  es: { marketTitle: 'Mercado', searchPlaceholder: 'Buscar productos…', newProducts: 'Nuevos productos', stores: 'Tiendas', featured: 'Destacados', categories: 'Categorías', allCategories: 'Todas', noResults: 'No se encontraron resultados', filters: 'Filtros', apply: 'Aplicar', clear: 'Limpiar', price: 'Precio', city: 'Ciudad', inStock: 'Solo en stock', sortNew: 'Más nuevos', sortPriceAsc: 'Precio: de menor a mayor', sortPriceDesc: 'Precio: de mayor a menor', sortLabel: 'Ordenar', min: 'Mín', max: 'Máx', results: 'resultados', visitStore: 'Visitar tienda', trustBadge: 'Vendedores independientes · transferencia · sin reseñas falsas', report: 'Reportar', addToCart: 'Añadir al carrito', cart: 'Carrito', sendCart: 'Enviar carrito', emptyCart: 'Tu carrito está vacío', name: 'Nombre completo', phone: 'Teléfono', address: 'Dirección', note: 'Nota', required: 'Este campo es obligatorio', submitOrder: 'Enviar pedido por WhatsApp', orderRef: 'Referencia del pedido', payByTransfer: 'Pago por transferencia', iban: 'IBAN', ibanName: 'Titular de la cuenta', paymentDesc: 'Concepto de pago', openWhatsapp: 'Abrir WhatsApp', qty: 'Cant.', remove: 'Quitar', total: 'Total', browseAll: 'Ver todo', soldOut: 'Agotado', contactForPrice: 'Consultar precio', backToStore: 'Volver a la tienda', backToMarket: '← Mercado', currency: 'Moneda', language: 'Idioma', rateNote: '≈ aprox. · tasas actualizadas diariamente', contact: 'Contacto', call: 'Llamar', other: 'Otros', poweredBy: 'Esta tienda fue creada con photoZseo', reportStore: 'Reportar esta tienda', productDetails: 'Detalles del producto', orderViaWhatsApp: 'Pedir por WhatsApp', deliveryInfo: 'Detalles de entrega', addNote: 'Agregar una nota (opcional)', favorite: 'Añadir a favoritos', signIn: 'Iniciar sesión', signOut: 'desconectar', myFavorites: 'Mis favoritos', myOrders: 'Mis pedidos', discover: 'Descubrir', noOrders: 'Aún no hay pedidos', orderStatus: 'Estado', orderItems: 'Elementos', myCart: 'Mi carrito', emptyFavorites: 'Aún no hay favoritos', bankName: 'Banco', swift: 'SWIFT/BIC', fitsVehicle: 'Filtrar por vehículo', allMakes: 'Todas las marcas', allModels: 'Todos los modelos', paySafetyTitle: 'antes de pagar', paySafetyTip: 'Las transferencias bancarias no se pueden revertir. Asegúrese de confiar en este vendedor, nunca pague “tarifas” adicionales y, cuando sea posible, prefiera un método de pago con protección del comprador. photoZseo solo publica esta tienda; no procesa pagos ni garantiza pedidos.', sellerTypeIndividual: 'vendedor individual', sellerTypeManufacturer: 'Fabricante', sellerTypeTradingCompany: 'Compañía comercial', sellerTypeManufacturerTrader: 'Fabricante y comerciante', sellerTypeBrandOwner: 'Propietario de la marca', sellerTypeDistributor: 'Distribuidor' },
  pt: { marketTitle: 'Mercado', searchPlaceholder: 'Buscar produtos…', newProducts: 'Novos produtos', stores: 'Lojas', featured: 'Destaques', categories: 'Categorias', allCategories: 'Todas', noResults: 'Nenhum resultado encontrado', filters: 'Filtros', apply: 'Aplicar', clear: 'Limpar', price: 'Preço', city: 'Cidade', inStock: 'Somente em estoque', sortNew: 'Mais recentes', sortPriceAsc: 'Preço: do menor ao maior', sortPriceDesc: 'Preço: do maior ao menor', sortLabel: 'Ordenar', min: 'Mín', max: 'Máx', results: 'resultados', visitStore: 'Visitar loja', trustBadge: 'Vendedores independentes · transferência · sem avaliações falsas', report: 'Denunciar', addToCart: 'Adicionar ao carrinho', cart: 'Carrinho', sendCart: 'Enviar carrinho', emptyCart: 'Seu carrinho está vazio', name: 'Nome completo', phone: 'Telefone', address: 'Endereço', note: 'Observação', required: 'Este campo é obrigatório', submitOrder: 'Enviar pedido pelo WhatsApp', orderRef: 'Referência do pedido', payByTransfer: 'Pagamento por transferência', iban: 'IBAN', ibanName: 'Nome do titular', paymentDesc: 'Descrição do pagamento', openWhatsapp: 'Abrir WhatsApp', qty: 'Qtd', remove: 'Remover', total: 'Total', browseAll: 'Ver tudo', soldOut: 'Esgotado', contactForPrice: 'Consultar preço', backToStore: 'Voltar à loja', backToMarket: '← Mercado', currency: 'Moeda', language: 'Idioma', rateNote: '≈ aprox. · taxas atualizadas diariamente', contact: 'Contato', call: 'Ligar', other: 'Outros', poweredBy: 'Esta loja foi criada com photoZseo', reportStore: 'Denunciar esta loja', productDetails: 'Detalhes do produto', orderViaWhatsApp: 'Pedir pelo WhatsApp', deliveryInfo: 'Detalhes da entrega', addNote: 'Adicione uma nota (opcional)', favorite: 'Adicionar aos favoritos', signIn: 'Entrar', signOut: 'sair', myFavorites: 'Meus favoritos', myOrders: 'Meus pedidos', discover: 'Descobrir', noOrders: 'Ainda não há pedidos', orderStatus: 'Status', orderItems: 'Unid', myCart: 'Meu carrinho', emptyFavorites: 'Ainda não há favoritos', bankName: 'Banco', swift: 'SWIFT/BIC', fitsVehicle: 'Filtrar por veículo', allMakes: 'Todas as marcas', allModels: 'Todos os modelos', paySafetyTitle: 'Antes de pagar', paySafetyTip: 'As transferências bancárias não podem ser revertidas. Certifique-se de confiar neste vendedor, nunca pague “taxas” extras e prefira um método de pagamento com proteção ao comprador, quando possível. photoZseo publica apenas esta loja - não processa pagamentos nem garante pedidos.', sellerTypeIndividual: 'Vendedor individual', sellerTypeManufacturer: 'Fabricante', sellerTypeTradingCompany: 'Empresa comercial', sellerTypeManufacturerTrader: 'Fabricante e comerciante', sellerTypeBrandOwner: 'Proprietário da marca', sellerTypeDistributor: 'Distribuidor' },
  ja: { marketTitle: 'マーケットプレイス', searchPlaceholder: '商品を検索…', newProducts: '新着商品', stores: 'ストア', featured: 'おすすめ', categories: 'カテゴリー', allCategories: 'すべて', noResults: '結果が見つかりません', filters: 'フィルター', apply: '適用', clear: 'クリア', price: '価格', city: '都市', inStock: '在庫ありのみ', sortNew: '新着順', sortPriceAsc: '価格: 安い順', sortPriceDesc: '価格: 高い順', sortLabel: '並び替え', min: '最小', max: '最大', results: '件', visitStore: 'ストアを見る', trustBadge: '独立した出品者 · 銀行振込 · 偽レビューなし', report: '報告', addToCart: 'カートに追加', cart: 'カート', sendCart: 'カートを送信', emptyCart: 'カートは空です', name: '氏名', phone: '電話番号', address: '住所', note: '備考', required: 'この項目は必須です', submitOrder: 'WhatsAppで注文を送信', orderRef: '注文番号', payByTransfer: '銀行振込でのお支払い', iban: 'IBAN', ibanName: '口座名義', paymentDesc: '振込メモ', openWhatsapp: 'WhatsAppを開く', qty: '数量', remove: '削除', total: '合計', browseAll: 'すべて見る', soldOut: '売り切れ', contactForPrice: '価格はお問い合わせ', backToStore: 'ストアに戻る', backToMarket: '← マーケット', currency: '通貨', language: '言語', rateNote: '≈ 概算 · レートは毎日更新', contact: 'お問い合わせ', call: '電話', other: 'その他', poweredBy: 'このストアはphotoZseoで作成されました', reportStore: 'このストアを報告', productDetails: '商品詳細', orderViaWhatsApp: 'WhatsAppで注文', deliveryInfo: '配送詳細', addNote: 'メモを追加します (オプション)', favorite: 'お気に入りに追加', signIn: 'サインイン', signOut: 'サインアウト', myFavorites: '私のお気に入り', myOrders: '私の注文', discover: '発見する', noOrders: 'まだ注文はありません', orderStatus: '状態', orderItems: 'アイテム', myCart: 'マイカート', emptyFavorites: 'まだお気に入りはありません', bankName: '銀行', swift: 'スイフト/ビック', fitsVehicle: '車両で絞り込む', allMakes: 'すべてのメーカー', allModels: '全モデル', paySafetyTitle: 'お支払いの前に', paySafetyTip: '銀行振込を取り消すことはできません。この販売者を信頼していることを確認し、余分な「手数料」を決して支払わないようにし、可能であれば購入者保護のある支払い方法を選択してください。 photoZseo はこのストアのみを公開します。支払いの処理や注文の保証は行いません。', sellerTypeIndividual: '個人販売者', sellerTypeManufacturer: 'メーカー', sellerTypeTradingCompany: '商社', sellerTypeManufacturerTrader: 'メーカー＆トレーダー', sellerTypeBrandOwner: 'ブランドオーナー', sellerTypeDistributor: '卸売業者' },
  ko: { marketTitle: '마켓플레이스', searchPlaceholder: '상품 검색…', newProducts: '신규 상품', stores: '스토어', featured: '추천', categories: '카테고리', allCategories: '전체', noResults: '검색 결과가 없습니다', filters: '필터', apply: '적용', clear: '지우기', price: '가격', city: '도시', inStock: '재고 있음만', sortNew: '최신순', sortPriceAsc: '가격: 낮은순', sortPriceDesc: '가격: 높은순', sortLabel: '정렬', min: '최소', max: '최대', results: '개', visitStore: '스토어 보기', trustBadge: '독립 판매자 · 계좌이체 · 가짜 리뷰 없음', report: '신고', addToCart: '장바구니 담기', cart: '장바구니', sendCart: '장바구니 보내기', emptyCart: '장바구니가 비어 있습니다', name: '이름', phone: '전화번호', address: '주소', note: '메모', required: '필수 항목입니다', submitOrder: 'WhatsApp으로 주문 보내기', orderRef: '주문 번호', payByTransfer: '계좌이체로 결제', iban: 'IBAN', ibanName: '예금주', paymentDesc: '입금 설명', openWhatsapp: 'WhatsApp 열기', qty: '수량', remove: '삭제', total: '합계', browseAll: '전체 보기', soldOut: '품절', contactForPrice: '가격 문의', backToStore: '스토어로 돌아가기', backToMarket: '← 마켓', currency: '통화', language: '언어', rateNote: '≈ 약 · 환율 매일 업데이트', contact: '연락', call: '전화', other: '기타', poweredBy: '이 스토어는 photoZseo로 만들어졌습니다', reportStore: '이 스토어 신고', productDetails: '상품 상세', orderViaWhatsApp: 'WhatsApp으로 주문', deliveryInfo: '배송 세부정보', addNote: '메모 추가(선택사항)', favorite: '즐겨찾기에 추가', signIn: '로그인', signOut: '로그아웃', myFavorites: '내 즐겨찾기', myOrders: '내 주문', discover: '발견하다', noOrders: '아직 주문이 없습니다', orderStatus: '상태', orderItems: '품목', myCart: '내 장바구니', emptyFavorites: '아직 즐겨찾기가 없습니다.', bankName: '은행', swift: '스위프트/빅', fitsVehicle: '차량으로 필터링', allMakes: '모든 브랜드', allModels: '모든 모델', paySafetyTitle: '결제하기 전에', paySafetyTip: '은행 송금은 되돌릴 수 없습니다. 이 판매자를 신뢰하는지 확인하고, 추가 "수수료"를 지불하지 말고, 가능하면 구매자 보호가 포함된 결제 방법을 선호하세요. photoZseo은(는) 이 매장만 게시하며 결제를 처리하거나 주문을 보장하지 않습니다.', sellerTypeIndividual: '개인판매자', sellerTypeManufacturer: '제조업체', sellerTypeTradingCompany: '무역회사', sellerTypeManufacturerTrader: '제조자 & 상인', sellerTypeBrandOwner: '브랜드 소유자', sellerTypeDistributor: '살수 장치' },
  zh: { marketTitle: '市场', searchPlaceholder: '搜索商品…', newProducts: '新品', stores: '店铺', featured: '精选', categories: '分类', allCategories: '全部', noResults: '未找到结果', filters: '筛选', apply: '应用', clear: '清除', price: '价格', city: '城市', inStock: '仅有货', sortNew: '最新', sortPriceAsc: '价格: 从低到高', sortPriceDesc: '价格: 从高到低', sortLabel: '排序', min: '最低', max: '最高', results: '个结果', visitStore: '访问店铺', trustBadge: '独立卖家 · 银行转账 · 无虚假评价', report: '举报', addToCart: '加入购物车', cart: '购物车', sendCart: '发送购物车', emptyCart: '购物车为空', name: '姓名', phone: '电话', address: '地址', note: '备注', required: '此字段为必填项', submitOrder: '通过 WhatsApp 发送订单', orderRef: '订单编号', payByTransfer: '银行转账付款', iban: 'IBAN', ibanName: '账户名', paymentDesc: '付款说明', openWhatsapp: '打开 WhatsApp', qty: '数量', remove: '移除', total: '合计', browseAll: '查看全部', soldOut: '售罄', contactForPrice: '询价', backToStore: '返回店铺', backToMarket: '← 市场', currency: '货币', language: '语言', rateNote: '≈ 约 · 汇率每日更新', contact: '联系', call: '致电', other: '其他', poweredBy: '此店铺由 photoZseo 创建', reportStore: '举报此店铺', productDetails: '商品详情', orderViaWhatsApp: '通过 WhatsApp 下单', deliveryInfo: '交货详情', addNote: '添加注释（可选）', favorite: '添加到收藏夹', signIn: '登入', signOut: '登出', myFavorites: '我的最爱', myOrders: '我的订单', discover: '发现', noOrders: '还没有订单', orderStatus: '地位', orderItems: '项目', myCart: '我的购物车', emptyFavorites: '还没有收藏夹', bankName: '银行', swift: '环球银行金融电信协会/银行代码', fitsVehicle: '按车辆过滤', allMakes: '所有品牌', allModels: '所有型号', paySafetyTitle: '付款之前', paySafetyTip: '银行转账无法撤销。确保您信任该卖家，绝不支付额外的“费用”，并尽可能选择有买家保护的付款方式。 photoZseo 仅发布该商店 - 它不处理付款或保证订单。', sellerTypeIndividual: '个人卖家', sellerTypeManufacturer: '制造商', sellerTypeTradingCompany: '贸易公司', sellerTypeManufacturerTrader: '制造商和贸易商', sellerTypeBrandOwner: '品牌拥有者', sellerTypeDistributor: '经销商' },
  ar: { marketTitle: 'السوق', searchPlaceholder: 'ابحث عن المنتجات…', newProducts: 'منتجات جديدة', stores: 'المتاجر', featured: 'مميز', categories: 'الفئات', allCategories: 'الكل', noResults: 'لا توجد نتائج', filters: 'التصفية', apply: 'تطبيق', clear: 'مسح', price: 'السعر', city: 'المدينة', inStock: 'المتوفر فقط', sortNew: 'الأحدث', sortPriceAsc: 'السعر: من الأقل للأعلى', sortPriceDesc: 'السعر: من الأعلى للأقل', sortLabel: 'الترتيب', min: 'الأدنى', max: 'الأقصى', results: 'نتيجة', visitStore: 'زيارة المتجر', trustBadge: 'بائعون مستقلون · تحويل بنكي · لا مراجعات مزيفة', report: 'إبلاغ', addToCart: 'أضف إلى السلة', cart: 'السلة', sendCart: 'إرسال السلة', emptyCart: 'سلتك فارغة', name: 'الاسم الكامل', phone: 'الهاتف', address: 'العنوان', note: 'ملاحظة', required: 'هذا الحقل مطلوب', submitOrder: 'إرسال الطلب عبر واتساب', orderRef: 'رقم الطلب', payByTransfer: 'الدفع بالتحويل البنكي', iban: 'IBAN', ibanName: 'اسم صاحب الحساب', paymentDesc: 'وصف الدفع', openWhatsapp: 'فتح واتساب', qty: 'الكمية', remove: 'إزالة', total: 'الإجمالي', browseAll: 'تصفح الكل', soldOut: 'نفد', contactForPrice: 'تواصل لمعرفة السعر', backToStore: 'العودة إلى المتجر', backToMarket: '← السوق', currency: 'العملة', language: 'اللغة', rateNote: '≈ تقريبي · يُحدَّث يومياً', contact: 'تواصل', call: 'اتصل', other: 'أخرى', poweredBy: 'تم إنشاء هذا المتجر بواسطة photoZseo', reportStore: 'الإبلاغ عن هذا المتجر', productDetails: 'تفاصيل المنتج', orderViaWhatsApp: 'اطلب عبر واتساب', deliveryInfo: 'تفاصيل التسليم', addNote: 'إضافة ملاحظة (اختياري)', favorite: 'أضف إلى المفضلة', signIn: 'تسجيل الدخول', signOut: 'تسجيل الخروج', myFavorites: 'المفضلة', myOrders: 'طلباتي', discover: 'يكتشف', noOrders: 'لا توجد أوامر حتى الآن', orderStatus: 'حالة', orderItems: 'أغراض', myCart: 'سلة التسوق الخاصة بي', emptyFavorites: 'لا يوجد مفضلة بعد', bankName: 'بنك', swift: 'سويفت/بيك', fitsVehicle: 'تصفية حسب السيارة', allMakes: 'جميع الماركات', allModels: 'جميع الموديلات', paySafetyTitle: 'قبل أن تدفع', paySafetyTip: 'لا يمكن عكس التحويلات المصرفية. تأكد من ثقتك بهذا البائع، وعدم دفع "رسوم" إضافية أبدًا، وتفضيل طريقة الدفع مع حماية المشتري عندما يكون ذلك ممكنًا. photoZseo ينشر هذا المتجر فقط - ولا يعالج المدفوعات أو يضمن الطلبات.', sellerTypeIndividual: 'بائع فردي', sellerTypeManufacturer: 'الشركة المصنعة', sellerTypeTradingCompany: 'شركة تجارية', sellerTypeManufacturerTrader: 'الصانع والتاجر', sellerTypeBrandOwner: 'مالك العلامة التجارية', sellerTypeDistributor: 'موزع' },
  fa: { marketTitle: 'بازار', searchPlaceholder: 'جستجوی محصولات…', newProducts: 'محصولات جدید', stores: 'فروشگاه‌ها', featured: 'ویژه', categories: 'دسته‌بندی‌ها', allCategories: 'همه', noResults: 'نتیجه‌ای یافت نشد', filters: 'فیلترها', apply: 'اعمال', clear: 'پاک کردن', price: 'قیمت', city: 'شهر', inStock: 'فقط موجود', sortNew: 'جدیدترین', sortPriceAsc: 'قیمت: کم به زیاد', sortPriceDesc: 'قیمت: زیاد به کم', sortLabel: 'مرتب‌سازی', min: 'حداقل', max: 'حداکثر', results: 'نتیجه', visitStore: 'مشاهده فروشگاه', trustBadge: 'فروشندگان مستقل · حواله بانکی · بدون نظر جعلی', report: 'گزارش', addToCart: 'افزودن به سبد', cart: 'سبد خرید', sendCart: 'ارسال سبد', emptyCart: 'سبد خرید شما خالی است', name: 'نام کامل', phone: 'تلفن', address: 'آدرس', note: 'یادداشت', required: 'این فیلد الزامی است', submitOrder: 'ارسال سفارش از طریق واتساپ', orderRef: 'شماره سفارش', payByTransfer: 'پرداخت با حواله بانکی', iban: 'IBAN', ibanName: 'نام صاحب حساب', paymentDesc: 'توضیح پرداخت', openWhatsapp: 'باز کردن واتساپ', qty: 'تعداد', remove: 'حذف', total: 'مجموع', browseAll: 'مشاهده همه', soldOut: 'ناموجود', contactForPrice: 'برای قیمت تماس بگیرید', backToStore: 'بازگشت به فروشگاه', backToMarket: '← بازار', currency: 'ارز', language: 'زبان', rateNote: '≈ تقریبی · نرخ‌ها روزانه به‌روز', contact: 'تماس', call: 'تماس', other: 'سایر', poweredBy: 'این فروشگاه با photoZseo ساخته شده است', reportStore: 'گزارش این فروشگاه', productDetails: 'جزئیات محصول', orderViaWhatsApp: 'سفارش از طریق واتساپ', deliveryInfo: 'جزئیات تحویل', addNote: 'اضافه کردن یادداشت (اختیاری)', favorite: 'به علاقه مندی ها اضافه کنید', signIn: 'وارد شوید', signOut: 'از سیستم خارج شوید', myFavorites: 'موارد دلخواه من', myOrders: 'سفارشات من', discover: 'کشف کنید', noOrders: 'هنوز سفارشی وجود ندارد', orderStatus: 'وضعیت', orderItems: 'موارد', myCart: 'سبد خرید من', emptyFavorites: 'هنوز موارد دلخواه وجود ندارد', bankName: 'بانک', swift: 'SWIFT/BIC', fitsVehicle: 'فیلتر با وسیله نقلیه', allMakes: 'همه می سازد', allModels: 'همه مدل ها', paySafetyTitle: 'قبل از اینکه پرداخت کنید', paySafetyTip: 'نقل و انتقالات بانکی قابل برگشت نیست. اطمینان حاصل کنید که به این فروشنده اعتماد دارید، هرگز «کارمزد» اضافی پرداخت نکنید و در صورت امکان، روش پرداختی را با حمایت از خریدار ترجیح دهید. photoZseo فقط این فروشگاه را منتشر می کند — پرداخت ها را پردازش نمی کند یا سفارشات را تضمین نمی کند.', sellerTypeIndividual: 'فروشنده انفرادی', sellerTypeManufacturer: 'سازنده', sellerTypeTradingCompany: 'شرکت بازرگانی', sellerTypeManufacturerTrader: 'تولید کننده و تاجر', sellerTypeBrandOwner: 'صاحب برند', sellerTypeDistributor: 'توزیع کننده' },
  ur: { marketTitle: 'مارکیٹ', searchPlaceholder: 'مصنوعات تلاش کریں…', newProducts: 'نئی مصنوعات', stores: 'اسٹورز', featured: 'نمایاں', categories: 'زمرے', allCategories: 'تمام', noResults: 'کوئی نتیجہ نہیں ملا', filters: 'فلٹرز', apply: 'لاگو کریں', clear: 'صاف کریں', price: 'قیمت', city: 'شہر', inStock: 'صرف اسٹاک میں', sortNew: 'تازہ ترین', sortPriceAsc: 'قیمت: کم سے زیادہ', sortPriceDesc: 'قیمت: زیادہ سے کم', sortLabel: 'ترتیب دیں', min: 'کم از کم', max: 'زیادہ سے زیادہ', results: 'نتائج', visitStore: 'اسٹور دیکھیں', trustBadge: 'آزاد فروخت کنندگان · بینک ٹرانسفر · کوئی جعلی جائزہ نہیں', report: 'رپورٹ کریں', addToCart: 'کارٹ میں شامل کریں', cart: 'کارٹ', sendCart: 'کارٹ بھیجیں', emptyCart: 'آپ کا کارٹ خالی ہے', name: 'پورا نام', phone: 'فون', address: 'پتہ', note: 'نوٹ', required: 'یہ خانہ لازمی ہے', submitOrder: 'واٹس ایپ کے ذریعے آرڈر بھیجیں', orderRef: 'آرڈر حوالہ', payByTransfer: 'بینک ٹرانسفر سے ادائیگی', iban: 'IBAN', ibanName: 'اکاؤنٹ کا نام', paymentDesc: 'ادائیگی کی تفصیل', openWhatsapp: 'واٹس ایپ کھولیں', qty: 'مقدار', remove: 'ہٹائیں', total: 'کل', browseAll: 'سب دیکھیں', soldOut: 'ختم', contactForPrice: 'قیمت کے لیے رابطہ کریں', backToStore: 'اسٹور پر واپس جائیں', backToMarket: '← مارکیٹ', currency: 'کرنسی', language: 'زبان', rateNote: '≈ تخمیناً · شرح روزانہ', contact: 'رابطہ', call: 'کال', other: 'دیگر', poweredBy: 'یہ اسٹور photoZseo سے بنایا گیا', reportStore: 'اس اسٹور کی رپورٹ کریں', productDetails: 'پروڈکٹ کی تفصیل', orderViaWhatsApp: 'WhatsApp سے آرڈر', deliveryInfo: 'ڈیلیوری کی تفصیلات', addNote: 'ایک نوٹ شامل کریں (اختیاری)', favorite: 'پسندیدہ میں شامل کریں۔', signIn: 'سائن ان کریں۔', signOut: 'سائن آؤٹ کریں۔', myFavorites: 'میرے پسندیدہ', myOrders: 'میرے احکامات', discover: 'دریافت کریں۔', noOrders: 'ابھی تک کوئی آرڈر نہیں ہے۔', orderStatus: 'حیثیت', orderItems: 'اشیاء', myCart: 'میری ٹوکری', emptyFavorites: 'ابھی تک کوئی پسندیدہ نہیں ہے۔', bankName: 'بینک', swift: 'SWIFT/BIC', fitsVehicle: 'گاڑی سے فلٹر کریں۔', allMakes: 'سب بناتا ہے۔', allModels: 'تمام ماڈلز', paySafetyTitle: 'اس سے پہلے کہ آپ ادائیگی کریں۔', paySafetyTip: 'بینک ٹرانسفرز کو تبدیل نہیں کیا جا سکتا۔ یقینی بنائیں کہ آپ اس بیچنے والے پر بھروسہ کرتے ہیں، کبھی بھی اضافی "فیس" ادا نہیں کریں، اور جب ممکن ہو خریدار کے تحفظ کے ساتھ ادائیگی کے طریقہ کو ترجیح دیں۔ photoZseo صرف اس اسٹور کو شائع کرتا ہے — یہ ادائیگیوں پر کارروائی نہیں کرتا اور نہ ہی آرڈر کی ضمانت دیتا ہے۔', sellerTypeIndividual: 'انفرادی فروخت کنندہ', sellerTypeManufacturer: 'کارخانہ دار', sellerTypeTradingCompany: 'تجارتی کمپنی', sellerTypeManufacturerTrader: 'صنعت کار اور تاجر', sellerTypeBrandOwner: 'برانڈ کا مالک', sellerTypeDistributor: 'تقسیم کرنے والا' },
  hi: { marketTitle: 'मार्केटप्लेस', searchPlaceholder: 'उत्पाद खोजें…', newProducts: 'नए उत्पाद', stores: 'स्टोर', featured: 'फ़ीचर्ड', categories: 'श्रेणियाँ', allCategories: 'सभी', noResults: 'कोई परिणाम नहीं मिला', filters: 'फ़िल्टर', apply: 'लागू करें', clear: 'साफ़ करें', price: 'मूल्य', city: 'शहर', inStock: 'केवल स्टॉक में', sortNew: 'नवीनतम', sortPriceAsc: 'मूल्य: कम से अधिक', sortPriceDesc: 'मूल्य: अधिक से कम', sortLabel: 'क्रमबद्ध करें', min: 'न्यूनतम', max: 'अधिकतम', results: 'परिणाम', visitStore: 'स्टोर देखें', trustBadge: 'स्वतंत्र विक्रेता · बैंक ट्रांसफ़र · कोई नकली समीक्षा नहीं', report: 'रिपोर्ट करें', addToCart: 'कार्ट में जोड़ें', cart: 'कार्ट', sendCart: 'कार्ट भेजें', emptyCart: 'आपका कार्ट खाली है', name: 'पूरा नाम', phone: 'फ़ोन', address: 'पता', note: 'टिप्पणी', required: 'यह फ़ील्ड आवश्यक है', submitOrder: 'WhatsApp से ऑर्डर भेजें', orderRef: 'ऑर्डर संदर्भ', payByTransfer: 'बैंक ट्रांसफ़र से भुगतान', iban: 'IBAN', ibanName: 'खाताधारक का नाम', paymentDesc: 'भुगतान विवरण', openWhatsapp: 'WhatsApp खोलें', qty: 'मात्रा', remove: 'हटाएँ', total: 'कुल', browseAll: 'सभी देखें', soldOut: 'स्टॉक ख़त्म', contactForPrice: 'मूल्य के लिए संपर्क करें', backToStore: 'स्टोर पर वापस जाएं', backToMarket: '← मार्केट', currency: 'मुद्रा', language: 'भाषा', rateNote: '≈ लगभग · दरें रोज़ अपडेट', contact: 'संपर्क', call: 'कॉल', other: 'अन्य', poweredBy: 'यह स्टोर photoZseo से बनाया गया है', reportStore: 'इस स्टोर की रिपोर्ट करें', productDetails: 'उत्पाद विवरण', orderViaWhatsApp: 'WhatsApp से ऑर्डर करें', deliveryInfo: 'वितरण विवरण', addNote: 'एक नोट जोड़ें (वैकल्पिक)', favorite: 'पसंदीदा में जोड़े', signIn: 'दाखिल करना', signOut: 'साइन आउट', myFavorites: 'मेरे प्रिय', myOrders: 'मेरे आदेश', discover: 'खोज करना', noOrders: 'अभी तक कोई आदेश नहीं', orderStatus: 'स्थिति', orderItems: 'सामान', myCart: 'मेरी गाड़ी', emptyFavorites: 'अभी तक कोई पसंदीदा नहीं', bankName: 'किनारा', swift: 'गिरगिट', fitsVehicle: 'वाहन द्वारा फ़िल्टर करें', allMakes: 'सब बनाता है', allModels: 'सभी मॉडल', paySafetyTitle: 'इससे पहले कि आप भुगतान करें', paySafetyTip: 'बैंक हस्तांतरण को उलटा नहीं किया जा सकता. सुनिश्चित करें कि आप इस विक्रेता पर भरोसा करते हैं, कभी भी अतिरिक्त "शुल्क" का भुगतान न करें, और जब संभव हो तो खरीदार सुरक्षा के साथ भुगतान विधि को प्राथमिकता दें। photoZseo केवल इस स्टोर को प्रकाशित करता है - यह भुगतान या गारंटी ऑर्डर संसाधित नहीं करता है।', sellerTypeIndividual: 'व्यक्तिगत विक्रेता', sellerTypeManufacturer: 'उत्पादक', sellerTypeTradingCompany: 'ट्रेडिंग कंपनी', sellerTypeManufacturerTrader: 'निर्माता एवं व्यापारी', sellerTypeBrandOwner: 'ब्रांड के मालिक', sellerTypeDistributor: 'वितरक' },
};

export function mt(locale: string, key: Key | string): string {
  const table = STRINGS[locale] ?? STRINGS.en;
  const fromLocale = (table as Record<string, string>)[key];
  if (fromLocale != null) return fromLocale;
  const fromEn = (STRINGS.en as Record<string, string>)[key];
  return fromEn ?? key;
}

// İşletme türü rawValue → i18n anahtarı (iOS BusinessType ile aynı kodlar).
const SELLER_TYPE_KEYS: Record<string, Key> = {
  individual: 'sellerTypeIndividual',
  manufacturer: 'sellerTypeManufacturer',
  tradingCompany: 'sellerTypeTradingCompany',
  manufacturerTrader: 'sellerTypeManufacturerTrader',
  brandOwner: 'sellerTypeBrandOwner',
  distributor: 'sellerTypeDistributor',
};

/**
 * Satıcı işletme türü rozet etiketi (buyer dilinde). Bilinmeyen/eksik kod → null
 * (rozet gösterilmez). manifest rawValue saklar, etiket burada üretilir.
 */
export function sellerTypeLabel(code: string | undefined, locale: string): string | null {
  if (!code) return null;
  const key = SELLER_TYPE_KEYS[code];
  if (!key) return null;
  return mt(locale, key);
}
