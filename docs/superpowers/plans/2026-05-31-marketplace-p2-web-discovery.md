# P2 – Web Keşif (Marketplace UI + Sepet + Sipariş) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/market` discovery surface (hibrit ana sayfa, faceted arama, mağaza/kategori dizinleri), a store-scoped localStorage cart with a WhatsApp + IBAN order flow, and the i18n / SEO / moderation glue — all framework-free Cloudflare Pages Functions consuming the P1 `functions/_lib/marketplace.ts` contract.

**Architecture:** Pages Functions render the marketplace per-request at the edge (zero-JS-first HTML), calling `searchProducts` / `listNewProducts` / `listStores` from `functions/_lib/marketplace.ts` (D1 + Orama, P1). Pure render functions live in `src/storefront/marketplace.ts` (mirroring the existing `render.ts` pattern, XSS-escaped via `escapeHtml`), wrapped by the existing `renderDocument`. The cart is a self-contained vanilla JS file (`public/marketplace-cart.js`) writing to `localStorage` per store-slug; "Sepeti Gönder" generates a WhatsApp deep-link plus a client-side `SP-XXXXX` reference and shows the seller's IBAN. No backend, no payment, no login.

**Tech Stack:** Cloudflare Pages Functions, D1, Orama, Workers AI, vanilla JS, TypeScript, vitest

**Depends on:** P1 (`functions/_lib/marketplace.ts` — `searchProducts`, `listNewProducts`, `listStores`, types `ProductRow`/`StoreRow`/`Facets`; D1 binding `DB`, AI binding `AI`, KV `STORE_KV`; only `listed=1` stores are returned).

---

## Shared Contract (from P1 — use VERBATIM)

These are the **exact** signatures and types the render/route code in this plan calls. Do not redefine them; import from `../_lib/marketplace` (Functions) — and for unit tests of the render layer, declare the matching TS interfaces locally in `src/storefront/marketplace.ts` so the renderer is framework-free and unit-testable without the D1 binding.

```ts
// functions/_lib/marketplace.ts (P1 — already exists)
export interface ProductRow {
  id: string;            // "<slug>:<product-slug>"
  store_slug: string;
  title: string;
  description: string;
  category_id: string;
  tags: string;          // CSV/JSON string
  price: number | null;
  currency: string;      // "USD"
  stock: number | null;
  image_url: string;
  product_path: string;  // "/store/<slug>/product/<title-slug>"
}
export interface StoreRow {
  slug: string;
  name: string;
  city: string;
  country: string;
  listed: number;        // 1 = visible in marketplace
}
export interface FacetBucket { value: string; count: number; }
export interface Facets {
  categories: { id: string; count: number }[];
  priceRange: { min: number; max: number };
  cities: FacetBucket[];
  inStockCount: number;
}
export interface SearchOpts {
  q?: string; lang?: string; categoryId?: string;
  minPrice?: number; maxPrice?: number; city?: string;
  inStock?: boolean; sort?: 'new' | 'price_asc' | 'price_desc';
  limit?: number; offset?: number;
}
export function searchProducts(db: D1Database, ai: AiBinding | undefined, opts: SearchOpts):
  Promise<{ items: ProductRow[]; facets: Facets; total: number }>;
export function listNewProducts(db: D1Database, opts: { limit?: number; offset?: number; categoryId?: string }):
  Promise<{ items: ProductRow[]; total: number }>;
export function listStores(db: D1Database, opts: { limit?: number; offset?: number }):
  Promise<{ items: StoreRow[]; total: number }>;
```

> The store IBAN / `iban_name` / `whatsapp` needed for the cart order flow are **not** in `StoreRow`. The cart reads them from the existing per-store KV manifest (`store:<slug>`, fields `store.contact.whatsapp`, `payment.iban`, `payment.ibanName`) — the storefront page already serves these, so the cart's order step is rendered on the existing `/store/<slug>` page (Task 11), where the manifest is in scope. The `/market` pages never need IBAN.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/storefront/marketplace-i18n.ts` | UI string table for 12 locales + `mt(locale, key)` lookup. Pure. |
| `src/storefront/marketplace.ts` | Pure render functions: cards, chips, facets, page bodies, sitemap, JSON-LD. Local `ProductRow`/`StoreRow`/`Facets` interfaces matching the P1 contract. XSS-escaped. |
| `src/storefront/marketplace.test.ts` | vitest for every render function + i18n. |
| `functions/market/[[path]].ts` | Edge router: `/market`, `/market/search`, `/market/stores`, `/market/c/<id>`. Calls P1 lib, wraps with `renderDocument`. |
| `functions/marketplace-sitemap.ts` | `GET /marketplace-sitemap.xml` — listed stores + products. |
| `public/marketplace.css` | Mobile-first marketplace styles (`mk-*` classes), calm aesthetic, dark/light, a11y. |
| `public/marketplace-cart.js` | Store-scoped localStorage cart, order form validation, WhatsApp message + `SP-XXXXX` + IBAN display. |
| `public/marketplace-enhance.js` | Hover-prefetch + View Transitions progressive enhancement. |

---

## Task 1: Marketplace i18n string table

**Files:**
- Create: `src/storefront/marketplace-i18n.ts`
- Test: `src/storefront/marketplace.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/storefront/marketplace.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { mt, MK_LOCALES } from './marketplace-i18n';

describe('marketplace i18n', () => {
  it('covers the 12 supported locales', () => {
    expect(MK_LOCALES).toEqual(['en', 'tr', 'de', 'es', 'pt', 'ja', 'ko', 'zh', 'ar', 'fa', 'ur', 'hi']);
  });

  it('returns the locale string when present', () => {
    expect(mt('tr', 'searchPlaceholder')).toBe('Ürün ara…');
    expect(mt('en', 'searchPlaceholder')).toBe('Search products…');
  });

  it('falls back to English for an unknown locale', () => {
    expect(mt('xx', 'newProducts')).toBe(mt('en', 'newProducts'));
  });

  it('returns the key itself for an unknown key (no crash)', () => {
    expect(mt('en', 'totallyMissingKey')).toBe('totallyMissingKey');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: FAIL — `Cannot find module './marketplace-i18n'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/storefront/marketplace-i18n.ts`:

```ts
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
  | 'qty' | 'remove' | 'total' | 'browseAll';

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
  },
  de: { marketTitle: 'Marktplatz', searchPlaceholder: 'Produkte suchen…', newProducts: 'Neue Produkte', stores: 'Shops', featured: 'Empfohlen', categories: 'Kategorien', allCategories: 'Alle', noResults: 'Keine Ergebnisse', filters: 'Filter', apply: 'Anwenden', clear: 'Zurücksetzen', price: 'Preis', city: 'Stadt', inStock: 'Nur auf Lager', sortNew: 'Neueste', sortPriceAsc: 'Preis: aufsteigend', sortPriceDesc: 'Preis: absteigend', sortLabel: 'Sortieren', min: 'Min', max: 'Max', results: 'Ergebnisse', visitStore: 'Shop besuchen', trustBadge: 'Unabhängige Verkäufer · Überweisung · keine gefälschten Bewertungen', report: 'Melden', addToCart: 'In den Warenkorb', cart: 'Warenkorb', sendCart: 'Warenkorb senden', emptyCart: 'Ihr Warenkorb ist leer', name: 'Vollständiger Name', phone: 'Telefon', address: 'Adresse', note: 'Notiz', required: 'Dieses Feld ist erforderlich', submitOrder: 'Bestellung per WhatsApp senden', orderRef: 'Bestellreferenz', payByTransfer: 'Zahlung per Überweisung', iban: 'IBAN', ibanName: 'Kontoinhaber', paymentDesc: 'Verwendungszweck', openWhatsapp: 'WhatsApp öffnen', qty: 'Anz.', remove: 'Entfernen', total: 'Gesamt', browseAll: 'Alle ansehen' },
  es: { marketTitle: 'Mercado', searchPlaceholder: 'Buscar productos…', newProducts: 'Nuevos productos', stores: 'Tiendas', featured: 'Destacados', categories: 'Categorías', allCategories: 'Todas', noResults: 'No se encontraron resultados', filters: 'Filtros', apply: 'Aplicar', clear: 'Limpiar', price: 'Precio', city: 'Ciudad', inStock: 'Solo en stock', sortNew: 'Más nuevos', sortPriceAsc: 'Precio: de menor a mayor', sortPriceDesc: 'Precio: de mayor a menor', sortLabel: 'Ordenar', min: 'Mín', max: 'Máx', results: 'resultados', visitStore: 'Visitar tienda', trustBadge: 'Vendedores independientes · transferencia · sin reseñas falsas', report: 'Reportar', addToCart: 'Añadir al carrito', cart: 'Carrito', sendCart: 'Enviar carrito', emptyCart: 'Tu carrito está vacío', name: 'Nombre completo', phone: 'Teléfono', address: 'Dirección', note: 'Nota', required: 'Este campo es obligatorio', submitOrder: 'Enviar pedido por WhatsApp', orderRef: 'Referencia del pedido', payByTransfer: 'Pago por transferencia', iban: 'IBAN', ibanName: 'Titular de la cuenta', paymentDesc: 'Concepto de pago', openWhatsapp: 'Abrir WhatsApp', qty: 'Cant.', remove: 'Quitar', total: 'Total', browseAll: 'Ver todo' },
  pt: { marketTitle: 'Mercado', searchPlaceholder: 'Buscar produtos…', newProducts: 'Novos produtos', stores: 'Lojas', featured: 'Destaques', categories: 'Categorias', allCategories: 'Todas', noResults: 'Nenhum resultado encontrado', filters: 'Filtros', apply: 'Aplicar', clear: 'Limpar', price: 'Preço', city: 'Cidade', inStock: 'Somente em estoque', sortNew: 'Mais recentes', sortPriceAsc: 'Preço: do menor ao maior', sortPriceDesc: 'Preço: do maior ao menor', sortLabel: 'Ordenar', min: 'Mín', max: 'Máx', results: 'resultados', visitStore: 'Visitar loja', trustBadge: 'Vendedores independentes · transferência · sem avaliações falsas', report: 'Denunciar', addToCart: 'Adicionar ao carrinho', cart: 'Carrinho', sendCart: 'Enviar carrinho', emptyCart: 'Seu carrinho está vazio', name: 'Nome completo', phone: 'Telefone', address: 'Endereço', note: 'Observação', required: 'Este campo é obrigatório', submitOrder: 'Enviar pedido pelo WhatsApp', orderRef: 'Referência do pedido', payByTransfer: 'Pagamento por transferência', iban: 'IBAN', ibanName: 'Nome do titular', paymentDesc: 'Descrição do pagamento', openWhatsapp: 'Abrir WhatsApp', qty: 'Qtd', remove: 'Remover', total: 'Total', browseAll: 'Ver tudo' },
  ja: { marketTitle: 'マーケットプレイス', searchPlaceholder: '商品を検索…', newProducts: '新着商品', stores: 'ストア', featured: 'おすすめ', categories: 'カテゴリー', allCategories: 'すべて', noResults: '結果が見つかりません', filters: 'フィルター', apply: '適用', clear: 'クリア', price: '価格', city: '都市', inStock: '在庫ありのみ', sortNew: '新着順', sortPriceAsc: '価格: 安い順', sortPriceDesc: '価格: 高い順', sortLabel: '並び替え', min: '最小', max: '最大', results: '件', visitStore: 'ストアを見る', trustBadge: '独立した出品者 · 銀行振込 · 偽レビューなし', report: '報告', addToCart: 'カートに追加', cart: 'カート', sendCart: 'カートを送信', emptyCart: 'カートは空です', name: '氏名', phone: '電話番号', address: '住所', note: '備考', required: 'この項目は必須です', submitOrder: 'WhatsAppで注文を送信', orderRef: '注文番号', payByTransfer: '銀行振込でのお支払い', iban: 'IBAN', ibanName: '口座名義', paymentDesc: '振込メモ', openWhatsapp: 'WhatsAppを開く', qty: '数量', remove: '削除', total: '合計', browseAll: 'すべて見る' },
  ko: { marketTitle: '마켓플레이스', searchPlaceholder: '상품 검색…', newProducts: '신규 상품', stores: '스토어', featured: '추천', categories: '카테고리', allCategories: '전체', noResults: '검색 결과가 없습니다', filters: '필터', apply: '적용', clear: '지우기', price: '가격', city: '도시', inStock: '재고 있음만', sortNew: '최신순', sortPriceAsc: '가격: 낮은순', sortPriceDesc: '가격: 높은순', sortLabel: '정렬', min: '최소', max: '최대', results: '개', visitStore: '스토어 보기', trustBadge: '독립 판매자 · 계좌이체 · 가짜 리뷰 없음', report: '신고', addToCart: '장바구니 담기', cart: '장바구니', sendCart: '장바구니 보내기', emptyCart: '장바구니가 비어 있습니다', name: '이름', phone: '전화번호', address: '주소', note: '메모', required: '필수 항목입니다', submitOrder: 'WhatsApp으로 주문 보내기', orderRef: '주문 번호', payByTransfer: '계좌이체로 결제', iban: 'IBAN', ibanName: '예금주', paymentDesc: '입금 설명', openWhatsapp: 'WhatsApp 열기', qty: '수량', remove: '삭제', total: '합계', browseAll: '전체 보기' },
  zh: { marketTitle: '市场', searchPlaceholder: '搜索商品…', newProducts: '新品', stores: '店铺', featured: '精选', categories: '分类', allCategories: '全部', noResults: '未找到结果', filters: '筛选', apply: '应用', clear: '清除', price: '价格', city: '城市', inStock: '仅有货', sortNew: '最新', sortPriceAsc: '价格: 从低到高', sortPriceDesc: '价格: 从高到低', sortLabel: '排序', min: '最低', max: '最高', results: '个结果', visitStore: '访问店铺', trustBadge: '独立卖家 · 银行转账 · 无虚假评价', report: '举报', addToCart: '加入购物车', cart: '购物车', sendCart: '发送购物车', emptyCart: '购物车为空', name: '姓名', phone: '电话', address: '地址', note: '备注', required: '此字段为必填项', submitOrder: '通过 WhatsApp 发送订单', orderRef: '订单编号', payByTransfer: '银行转账付款', iban: 'IBAN', ibanName: '账户名', paymentDesc: '付款说明', openWhatsapp: '打开 WhatsApp', qty: '数量', remove: '移除', total: '合计', browseAll: '查看全部' },
  ar: { marketTitle: 'السوق', searchPlaceholder: 'ابحث عن المنتجات…', newProducts: 'منتجات جديدة', stores: 'المتاجر', featured: 'مميز', categories: 'الفئات', allCategories: 'الكل', noResults: 'لا توجد نتائج', filters: 'التصفية', apply: 'تطبيق', clear: 'مسح', price: 'السعر', city: 'المدينة', inStock: 'المتوفر فقط', sortNew: 'الأحدث', sortPriceAsc: 'السعر: من الأقل للأعلى', sortPriceDesc: 'السعر: من الأعلى للأقل', sortLabel: 'الترتيب', min: 'الأدنى', max: 'الأقصى', results: 'نتيجة', visitStore: 'زيارة المتجر', trustBadge: 'بائعون مستقلون · تحويل بنكي · لا مراجعات مزيفة', report: 'إبلاغ', addToCart: 'أضف إلى السلة', cart: 'السلة', sendCart: 'إرسال السلة', emptyCart: 'سلتك فارغة', name: 'الاسم الكامل', phone: 'الهاتف', address: 'العنوان', note: 'ملاحظة', required: 'هذا الحقل مطلوب', submitOrder: 'إرسال الطلب عبر واتساب', orderRef: 'رقم الطلب', payByTransfer: 'الدفع بالتحويل البنكي', iban: 'IBAN', ibanName: 'اسم صاحب الحساب', paymentDesc: 'وصف الدفع', openWhatsapp: 'فتح واتساب', qty: 'الكمية', remove: 'إزالة', total: 'الإجمالي', browseAll: 'تصفح الكل' },
  fa: { marketTitle: 'بازار', searchPlaceholder: 'جستجوی محصولات…', newProducts: 'محصولات جدید', stores: 'فروشگاه‌ها', featured: 'ویژه', categories: 'دسته‌بندی‌ها', allCategories: 'همه', noResults: 'نتیجه‌ای یافت نشد', filters: 'فیلترها', apply: 'اعمال', clear: 'پاک کردن', price: 'قیمت', city: 'شهر', inStock: 'فقط موجود', sortNew: 'جدیدترین', sortPriceAsc: 'قیمت: کم به زیاد', sortPriceDesc: 'قیمت: زیاد به کم', sortLabel: 'مرتب‌سازی', min: 'حداقل', max: 'حداکثر', results: 'نتیجه', visitStore: 'مشاهده فروشگاه', trustBadge: 'فروشندگان مستقل · حواله بانکی · بدون نظر جعلی', report: 'گزارش', addToCart: 'افزودن به سبد', cart: 'سبد خرید', sendCart: 'ارسال سبد', emptyCart: 'سبد خرید شما خالی است', name: 'نام کامل', phone: 'تلفن', address: 'آدرس', note: 'یادداشت', required: 'این فیلد الزامی است', submitOrder: 'ارسال سفارش از طریق واتساپ', orderRef: 'شماره سفارش', payByTransfer: 'پرداخت با حواله بانکی', iban: 'IBAN', ibanName: 'نام صاحب حساب', paymentDesc: 'توضیح پرداخت', openWhatsapp: 'باز کردن واتساپ', qty: 'تعداد', remove: 'حذف', total: 'مجموع', browseAll: 'مشاهده همه' },
  ur: { marketTitle: 'مارکیٹ', searchPlaceholder: 'مصنوعات تلاش کریں…', newProducts: 'نئی مصنوعات', stores: 'اسٹورز', featured: 'نمایاں', categories: 'زمرے', allCategories: 'تمام', noResults: 'کوئی نتیجہ نہیں ملا', filters: 'فلٹرز', apply: 'لاگو کریں', clear: 'صاف کریں', price: 'قیمت', city: 'شہر', inStock: 'صرف اسٹاک میں', sortNew: 'تازہ ترین', sortPriceAsc: 'قیمت: کم سے زیادہ', sortPriceDesc: 'قیمت: زیادہ سے کم', sortLabel: 'ترتیب دیں', min: 'کم از کم', max: 'زیادہ سے زیادہ', results: 'نتائج', visitStore: 'اسٹور دیکھیں', trustBadge: 'آزاد فروخت کنندگان · بینک ٹرانسفر · کوئی جعلی جائزہ نہیں', report: 'رپورٹ کریں', addToCart: 'کارٹ میں شامل کریں', cart: 'کارٹ', sendCart: 'کارٹ بھیجیں', emptyCart: 'آپ کا کارٹ خالی ہے', name: 'پورا نام', phone: 'فون', address: 'پتہ', note: 'نوٹ', required: 'یہ خانہ لازمی ہے', submitOrder: 'واٹس ایپ کے ذریعے آرڈر بھیجیں', orderRef: 'آرڈر حوالہ', payByTransfer: 'بینک ٹرانسفر سے ادائیگی', iban: 'IBAN', ibanName: 'اکاؤنٹ کا نام', paymentDesc: 'ادائیگی کی تفصیل', openWhatsapp: 'واٹس ایپ کھولیں', qty: 'مقدار', remove: 'ہٹائیں', total: 'کل', browseAll: 'سب دیکھیں' },
  hi: { marketTitle: 'मार्केटप्लेस', searchPlaceholder: 'उत्पाद खोजें…', newProducts: 'नए उत्पाद', stores: 'स्टोर', featured: 'फ़ीचर्ड', categories: 'श्रेणियाँ', allCategories: 'सभी', noResults: 'कोई परिणाम नहीं मिला', filters: 'फ़िल्टर', apply: 'लागू करें', clear: 'साफ़ करें', price: 'मूल्य', city: 'शहर', inStock: 'केवल स्टॉक में', sortNew: 'नवीनतम', sortPriceAsc: 'मूल्य: कम से अधिक', sortPriceDesc: 'मूल्य: अधिक से कम', sortLabel: 'क्रमबद्ध करें', min: 'न्यूनतम', max: 'अधिकतम', results: 'परिणाम', visitStore: 'स्टोर देखें', trustBadge: 'स्वतंत्र विक्रेता · बैंक ट्रांसफ़र · कोई नकली समीक्षा नहीं', report: 'रिपोर्ट करें', addToCart: 'कार्ट में जोड़ें', cart: 'कार्ट', sendCart: 'कार्ट भेजें', emptyCart: 'आपका कार्ट खाली है', name: 'पूरा नाम', phone: 'फ़ोन', address: 'पता', note: 'टिप्पणी', required: 'यह फ़ील्ड आवश्यक है', submitOrder: 'WhatsApp से ऑर्डर भेजें', orderRef: 'ऑर्डर संदर्भ', payByTransfer: 'बैंक ट्रांसफ़र से भुगतान', iban: 'IBAN', ibanName: 'खाताधारक का नाम', paymentDesc: 'भुगतान विवरण', openWhatsapp: 'WhatsApp खोलें', qty: 'मात्रा', remove: 'हटाएँ', total: 'कुल', browseAll: 'सभी देखें' },
};

export function mt(locale: string, key: Key | string): string {
  const table = STRINGS[locale] ?? STRINGS.en;
  const fromLocale = (table as Record<string, string>)[key];
  if (fromLocale != null) return fromLocale;
  const fromEn = (STRINGS.en as Record<string, string>)[key];
  return fromEn ?? key;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/storefront/marketplace-i18n.ts src/storefront/marketplace.test.ts
git commit -m "feat(market): add 12-locale marketplace UI i18n table"
```

---

## Task 2: Shared types + helpers in marketplace.ts (tags, price, escape re-export)

**Files:**
- Create: `src/storefront/marketplace.ts`
- Test: `src/storefront/marketplace.test.ts` (append)

- [ ] **Step 1: Write the failing test** — append to `src/storefront/marketplace.test.ts`:

```ts
import { parseTags, mkFormatPrice } from './marketplace';

describe('marketplace helpers', () => {
  it('parseTags handles JSON array strings', () => {
    expect(parseTags('["a","b"]')).toEqual(['a', 'b']);
  });
  it('parseTags handles CSV strings', () => {
    expect(parseTags('a, b ,c')).toEqual(['a', 'b', 'c']);
  });
  it('parseTags handles empty/garbage', () => {
    expect(parseTags('')).toEqual([]);
    expect(parseTags('   ')).toEqual([]);
  });
  it('mkFormatPrice formats a USD number', () => {
    expect(mkFormatPrice(1499, 'USD', 'en')).toMatch(/1,499/);
  });
  it('mkFormatPrice returns empty for null price', () => {
    expect(mkFormatPrice(null, 'USD', 'en')).toBe('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: FAIL — `Cannot find module './marketplace'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/storefront/marketplace.ts`:

```ts
/**
 * marketplace.ts — Framework-free render layer for the /market discovery surface.
 * Pure TypeScript; no DOM, no Astro. All user strings HTML-escaped (escapeHtml).
 * Local row interfaces mirror the P1 functions/_lib/marketplace.ts contract VERBATIM
 * so this file is unit-testable without the D1 binding.
 */

import { escapeHtml } from './render';
import { mt } from './marketplace-i18n';

// ── P1 contract mirror (keep in sync with functions/_lib/marketplace.ts) ──────────
export interface ProductRow {
  id: string;
  store_slug: string;
  title: string;
  description: string;
  category_id: string;
  tags: string;
  price: number | null;
  currency: string;
  stock: number | null;
  image_url: string;
  product_path: string;
}
export interface StoreRow {
  slug: string;
  name: string;
  city: string;
  country: string;
  listed: number;
}
export interface Facets {
  categories: { id: string; count: number }[];
  priceRange: { min: number; max: number };
  cities: { value: string; count: number }[];
  inStockCount: number;
}

/** Escape a URL/attribute value (escapeHtml is sufficient for attribute context). */
function escapeAttr(s: string): string {
  return escapeHtml(s);
}

/** Parse a tags column that may be a JSON array string or a CSV string. */
export function parseTags(raw: string): string[] {
  const s = (raw ?? '').trim();
  if (!s) return [];
  if (s.startsWith('[')) {
    try {
      const arr = JSON.parse(s);
      if (Array.isArray(arr)) return arr.map((x) => String(x).trim()).filter(Boolean);
    } catch { /* fall through to CSV */ }
  }
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}

/** Format a price; empty string when null (card shows "contact" upstream). */
export function mkFormatPrice(price: number | null, currency: string, locale: string): string {
  if (price == null || Number.isNaN(price)) return '';
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(price);
  } catch {
    return `${price.toFixed(2)} ${currency}`;
  }
}

export { escapeAttr };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: PASS (all helper tests).

- [ ] **Step 5: Commit**

```bash
git add src/storefront/marketplace.ts src/storefront/marketplace.test.ts
git commit -m "feat(market): marketplace render module scaffold + tags/price helpers"
```

---

## Task 3: renderProductCard (marketplace card → store product page)

**Files:**
- Modify: `src/storefront/marketplace.ts`
- Test: `src/storefront/marketplace.test.ts` (append)

- [ ] **Step 1: Write the failing test** — append:

```ts
import { renderProductCard } from './marketplace';

const sampleProduct: ProductRow = {
  id: 'ahmet-oto:paspas',
  store_slug: 'ahmet-oto',
  title: 'Tesla Model Y Floor Mats',
  description: 'All-weather mats',
  category_id: 'vehicles.accessories',
  tags: '["tesla","mats"]',
  price: 49.9,
  currency: 'USD',
  stock: 12,
  image_url: 'https://img.example/mat.avif',
  product_path: '/store/ahmet-oto/product/tesla-model-y-floor-mats',
};

describe('renderProductCard', () => {
  const html = renderProductCard(sampleProduct, 'en');
  it('links to product_path', () => {
    expect(html).toContain('href="/store/ahmet-oto/product/tesla-model-y-floor-mats"');
  });
  it('shows title and formatted price', () => {
    expect(html).toContain('Tesla Model Y Floor Mats');
    expect(html).toMatch(/49/);
  });
  it('lazy-loads the image', () => {
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('https://img.example/mat.avif');
  });
  it('renders a placeholder when out of stock (stock 0)', () => {
    const out = renderProductCard({ ...sampleProduct, stock: 0 }, 'tr');
    expect(out).toContain('Tükendi');
  });
  it('XSS: escapes a malicious title', () => {
    const out = renderProductCard({ ...sampleProduct, title: '<img src=x onerror=alert(1)>' }, 'en');
    expect(out).not.toContain('<img src=x onerror');
    expect(out).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: FAIL — `renderProductCard is not a function`.

- [ ] **Step 3: Write minimal implementation** — append to `src/storefront/marketplace.ts`:

```ts
/** A marketplace product card linking to its store product page. */
export function renderProductCard(p: ProductRow, locale: string): string {
  const title = escapeHtml(p.title);
  const price = mkFormatPrice(p.price, p.currency, locale);
  const soldOut = p.stock === 0;
  const href = escapeAttr(p.product_path);

  let html = `<a class="mk-card-link" href="${href}">\n`;
  html += '  <article class="mk-card">\n';
  html += '    <div class="mk-card__media">\n';
  if (p.image_url) {
    html += `      <img src="${escapeAttr(p.image_url)}" alt="${title}" loading="lazy" decoding="async" width="600" height="600" />\n`;
  } else {
    html += '      <div class="mk-card__media-empty" aria-hidden="true">📷</div>\n';
  }
  if (soldOut) {
    html += `      <span class="mk-card__badge">${escapeHtml(mt(locale, 'inStock') === '' ? '' : (locale === 'tr' ? 'Tükendi' : 'Sold out'))}</span>\n`;
  }
  html += '    </div>\n';
  html += '    <div class="mk-card__body">\n';
  html += `      <h3 class="mk-card__title">${title}</h3>\n`;
  if (price) {
    html += `      <span class="mk-card__price">${escapeHtml(price)}</span>\n`;
  } else {
    html += `      <span class="mk-card__price mk-card__price--contact">${escapeHtml(locale === 'tr' ? 'Fiyat için iletişime geç' : 'Contact for price')}</span>\n`;
  }
  html += '    </div>\n';
  html += '  </article>\n';
  html += '</a>\n';
  return html;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/storefront/marketplace.ts src/storefront/marketplace.test.ts
git commit -m "feat(market): renderProductCard with lazy image + sold-out badge + XSS escaping"
```

---

## Task 4: renderCategoryChips + renderStoreStrip

**Files:**
- Modify: `src/storefront/marketplace.ts`
- Test: `src/storefront/marketplace.test.ts` (append)

- [ ] **Step 1: Write the failing test** — append:

```ts
import { renderCategoryChips, renderStoreStrip } from './marketplace';

describe('renderCategoryChips', () => {
  const facets: Facets = {
    categories: [{ id: 'electronics.phones', count: 5 }, { id: 'vehicles.accessories', count: 3 }],
    priceRange: { min: 0, max: 100 }, cities: [], inStockCount: 8,
  };
  const html = renderCategoryChips(facets.categories, 'en');
  it('renders an "All" chip linking to /market/search', () => {
    expect(html).toContain('href="/market/search"');
    expect(html).toContain('All');
  });
  it('renders one chip per category with its count', () => {
    expect(html).toContain('href="/market/c/electronics.phones"');
    expect(html).toContain('href="/market/c/vehicles.accessories"');
    expect(html).toContain('5');
  });
  it('XSS: escapes a malicious category id', () => {
    const out = renderCategoryChips([{ id: '"><script>', count: 1 }], 'en');
    expect(out).not.toContain('"><script>');
  });
});

describe('renderStoreStrip', () => {
  const stores: StoreRow[] = [
    { slug: 'ahmet-oto', name: 'Ahmet Oto', city: 'Istanbul', country: 'TR', listed: 1 },
    { slug: 'beta', name: 'Beta Shop', city: 'Izmir', country: 'TR', listed: 1 },
  ];
  const html = renderStoreStrip(stores, 'en');
  it('links each store to /store/<slug>', () => {
    expect(html).toContain('href="/store/ahmet-oto"');
    expect(html).toContain('href="/store/beta"');
  });
  it('shows store name and city', () => {
    expect(html).toContain('Ahmet Oto');
    expect(html).toContain('Istanbul');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: FAIL — functions not exported.

- [ ] **Step 3: Write minimal implementation** — append:

```ts
/** Horizontal, thumb-friendly category chip row. "All" → /market/search. */
export function renderCategoryChips(
  categories: { id: string; count: number }[],
  locale: string,
): string {
  let html = `<nav class="mk-chips" aria-label="${escapeHtml(mt(locale, 'categories'))}">\n`;
  html += `  <a class="mk-chip mk-chip--all" href="/market/search">${escapeHtml(mt(locale, 'allCategories'))}</a>\n`;
  for (const c of categories) {
    const href = `/market/c/${encodeURIComponent(c.id)}`;
    html += `  <a class="mk-chip" href="${escapeAttr(href)}">${escapeHtml(c.id)} <span class="mk-chip__count">${c.count}</span></a>\n`;
  }
  html += '</nav>\n';
  return html;
}

/** Horizontal store directory strip. Each item → existing /store/<slug>. */
export function renderStoreStrip(stores: StoreRow[], locale: string): string {
  let html = `<div class="mk-stores" role="list" aria-label="${escapeHtml(mt(locale, 'stores'))}">\n`;
  for (const s of stores) {
    const loc = [s.city, s.country].filter(Boolean).join(', ');
    html += `  <a class="mk-store" role="listitem" href="/store/${escapeAttr(encodeURIComponent(s.slug))}">\n`;
    html += `    <span class="mk-store__name">${escapeHtml(s.name)}</span>\n`;
    if (loc) html += `    <span class="mk-store__loc">📍 ${escapeHtml(loc)}</span>\n`;
    html += '  </a>\n';
  }
  html += '</div>\n';
  return html;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/storefront/marketplace.ts src/storefront/marketplace.test.ts
git commit -m "feat(market): category chips + store directory strip renderers"
```

---

## Task 5: renderMarketHome (hibrit ana sayfa body + trust badge)

**Files:**
- Modify: `src/storefront/marketplace.ts`
- Test: `src/storefront/marketplace.test.ts` (append)

- [ ] **Step 1: Write the failing test** — append:

```ts
import { renderMarketHome } from './marketplace';

describe('renderMarketHome', () => {
  const products: ProductRow[] = [sampleProduct, { ...sampleProduct, id: 'b:2', product_path: '/store/b/product/x', title: 'Second' }];
  const stores: StoreRow[] = [{ slug: 'ahmet-oto', name: 'Ahmet Oto', city: 'Istanbul', country: 'TR', listed: 1 }];
  const cats = [{ id: 'electronics.phones', count: 5 }];
  const html = renderMarketHome({ products, stores, categories: cats, locale: 'en' });

  it('has a search form posting to /market/search (GET)', () => {
    expect(html).toContain('action="/market/search"');
    expect(html).toContain('name="q"');
  });
  it('renders the New products section heading', () => {
    expect(html).toContain('New products');
  });
  it('renders category chips and a store strip', () => {
    expect(html).toContain('/market/c/electronics.phones');
    expect(html).toContain('/store/ahmet-oto');
  });
  it('renders the trust badge', () => {
    expect(html).toContain('Independent sellers · bank transfer · no fake reviews');
  });
  it('renders a Featured slot placeholder (empty, no products)', () => {
    expect(html).toContain('mk-featured');
  });
  it('renders both product cards', () => {
    expect(html).toContain('Tesla Model Y Floor Mats');
    expect(html).toContain('Second');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: FAIL — `renderMarketHome is not a function`.

- [ ] **Step 3: Write minimal implementation** — append:

```ts
function renderSearchBar(locale: string): string {
  const ph = escapeHtml(mt(locale, 'searchPlaceholder'));
  return (
    '<form class="mk-searchbar" action="/market/search" method="get" role="search">\n' +
    `  <input type="search" name="q" class="mk-searchbar__input" placeholder="${ph}" aria-label="${ph}" />\n` +
    `  <button type="submit" class="mk-searchbar__btn">${escapeHtml(mt(locale, 'marketTitle'))}</button>\n` +
    '</form>\n'
  );
}

function renderTrustBadge(locale: string): string {
  return `<p class="mk-trust">${escapeHtml(mt(locale, 'trustBadge'))}</p>\n`;
}

export function renderMarketHome(args: {
  products: ProductRow[];
  stores: StoreRow[];
  categories: { id: string; count: number }[];
  locale: string;
}): string {
  const { products, stores, categories, locale } = args;
  let html = '<div class="mk">\n';
  html += '<header class="mk-top">\n';
  html += `  <a class="mk-logo" href="/market">${escapeHtml(mt(locale, 'marketTitle'))}</a>\n`;
  html += renderSearchBar(locale);
  html += '</header>\n';
  html += renderCategoryChips(categories, locale);

  // Featured slot — reserved, empty for now (no products yet).
  html += '<section class="mk-featured" aria-label="' + escapeHtml(mt(locale, 'featured')) + '" hidden></section>\n';

  // New products grid
  html += '<section class="mk-section">\n';
  html += `  <h2 class="mk-section__title">${escapeHtml(mt(locale, 'newProducts'))}</h2>\n`;
  html += '  <div class="mk-grid">\n';
  for (const p of products) html += renderProductCard(p, locale);
  html += '  </div>\n';
  html += '</section>\n';

  // Stores strip
  html += '<section class="mk-section">\n';
  html += `  <h2 class="mk-section__title">${escapeHtml(mt(locale, 'stores'))}</h2>\n`;
  html += renderStoreStrip(stores, locale);
  html += '</section>\n';

  html += renderTrustBadge(locale);
  html += '</div>\n';
  return html;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/storefront/marketplace.ts src/storefront/marketplace.test.ts
git commit -m "feat(market): renderMarketHome hybrid landing (search + chips + new grid + stores + trust badge)"
```

---

## Task 6: renderSearchPage (faceted results + facets + sort + bottom sheet)

**Files:**
- Modify: `src/storefront/marketplace.ts`
- Test: `src/storefront/marketplace.test.ts` (append)

- [ ] **Step 1: Write the failing test** — append:

```ts
import { renderSearchPage } from './marketplace';

describe('renderSearchPage', () => {
  const facets: Facets = {
    categories: [{ id: 'electronics.phones', count: 5 }],
    priceRange: { min: 10, max: 200 },
    cities: [{ value: 'Istanbul', count: 4 }, { value: 'Izmir', count: 2 }],
    inStockCount: 6,
  };
  const html = renderSearchPage({
    items: [sampleProduct], facets, total: 1, locale: 'en',
    query: { q: 'tesla', sort: 'new', categoryId: 'electronics.phones', city: undefined, minPrice: undefined, maxPrice: undefined, inStock: false },
  });

  it('echoes the query in the search input value', () => {
    expect(html).toContain('value="tesla"');
  });
  it('renders the total result count', () => {
    expect(html).toContain('1');
    expect(html).toContain('results');
  });
  it('renders a sort select with the 3 options', () => {
    expect(html).toContain('name="sort"');
    expect(html).toContain('Newest');
    expect(html).toContain('Price: low to high');
    expect(html).toContain('Price: high to low');
  });
  it('renders category, city and price facets', () => {
    expect(html).toContain('electronics.phones');
    expect(html).toContain('Istanbul');
    expect(html).toContain('name="minPrice"');
    expect(html).toContain('name="maxPrice"');
  });
  it('marks the active sort option as selected', () => {
    expect(html).toMatch(/value="new"\s+selected/);
  });
  it('renders the mobile filter sheet toggle', () => {
    expect(html).toContain('mk-filter-toggle');
  });
  it('renders an inStock checkbox', () => {
    expect(html).toContain('name="inStock"');
  });
  it('shows no-results message when items empty', () => {
    const empty = renderSearchPage({ items: [], facets, total: 0, locale: 'en', query: { q: 'zzz', sort: 'new' } });
    expect(empty).toContain('No results found');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: FAIL — `renderSearchPage is not a function`.

- [ ] **Step 3: Write minimal implementation** — append:

```ts
export interface SearchQuery {
  q?: string;
  sort?: 'new' | 'price_asc' | 'price_desc';
  categoryId?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

function sortOption(value: string, label: string, current: string | undefined): string {
  const sel = value === (current ?? 'new') ? ' selected' : '';
  return `<option value="${escapeAttr(value)}"${sel}>${escapeHtml(label)}</option>`;
}

function renderFacets(facets: Facets, q: SearchQuery, locale: string): string {
  let h = '<aside class="mk-facets" data-mk-facets>\n';

  // Categories
  h += `  <fieldset class="mk-facet"><legend>${escapeHtml(mt(locale, 'categories'))}</legend>\n`;
  for (const c of facets.categories) {
    const checked = q.categoryId === c.id ? ' checked' : '';
    h += `    <label class="mk-facet__opt"><input type="radio" name="categoryId" value="${escapeAttr(c.id)}"${checked} /> ${escapeHtml(c.id)} <span class="mk-facet__count">${c.count}</span></label>\n`;
  }
  h += '  </fieldset>\n';

  // Price range
  h += `  <fieldset class="mk-facet"><legend>${escapeHtml(mt(locale, 'price'))}</legend>\n`;
  h += `    <input type="number" name="minPrice" inputmode="decimal" placeholder="${escapeHtml(mt(locale, 'min'))} (${facets.priceRange.min})" value="${q.minPrice != null ? q.minPrice : ''}" />\n`;
  h += `    <input type="number" name="maxPrice" inputmode="decimal" placeholder="${escapeHtml(mt(locale, 'max'))} (${facets.priceRange.max})" value="${q.maxPrice != null ? q.maxPrice : ''}" />\n`;
  h += '  </fieldset>\n';

  // Cities
  if (facets.cities.length) {
    h += `  <fieldset class="mk-facet"><legend>${escapeHtml(mt(locale, 'city'))}</legend>\n`;
    for (const c of facets.cities) {
      const checked = q.city === c.value ? ' checked' : '';
      h += `    <label class="mk-facet__opt"><input type="radio" name="city" value="${escapeAttr(c.value)}"${checked} /> ${escapeHtml(c.value)} <span class="mk-facet__count">${c.count}</span></label>\n`;
    }
    h += '  </fieldset>\n';
  }

  // In stock
  const inStockChecked = q.inStock ? ' checked' : '';
  h += `  <label class="mk-facet__opt mk-facet__instock"><input type="checkbox" name="inStock" value="1"${inStockChecked} /> ${escapeHtml(mt(locale, 'inStock'))} <span class="mk-facet__count">${facets.inStockCount}</span></label>\n`;

  h += `  <div class="mk-facet__actions"><button type="submit" class="mk-btn">${escapeHtml(mt(locale, 'apply'))}</button> <a class="mk-btn mk-btn--ghost" href="/market/search">${escapeHtml(mt(locale, 'clear'))}</a></div>\n`;
  h += '</aside>\n';
  return h;
}

export function renderSearchPage(args: {
  items: ProductRow[];
  facets: Facets;
  total: number;
  locale: string;
  query: SearchQuery;
}): string {
  const { items, facets, total, locale, query } = args;
  const ph = escapeHtml(mt(locale, 'searchPlaceholder'));

  let html = '<div class="mk mk--search">\n';
  html += '<form class="mk-searchwrap" action="/market/search" method="get" role="search">\n';

  // Top search bar
  html += '  <div class="mk-top">\n';
  html += `    <a class="mk-logo" href="/market">${escapeHtml(mt(locale, 'marketTitle'))}</a>\n`;
  html += `    <input type="search" name="q" class="mk-searchbar__input" placeholder="${ph}" aria-label="${ph}" value="${escapeAttr(query.q ?? '')}" />\n`;
  html += `    <button type="button" class="mk-filter-toggle" data-mk-filter-toggle aria-expanded="false">${escapeHtml(mt(locale, 'filters'))}</button>\n`;
  html += '  </div>\n';

  // Sort + result count bar
  html += '  <div class="mk-resultbar">\n';
  html += `    <span class="mk-resultbar__count">${total} ${escapeHtml(mt(locale, 'results'))}</span>\n`;
  html += `    <label class="mk-sort"><span>${escapeHtml(mt(locale, 'sortLabel'))}</span>\n`;
  html += '      <select name="sort" onchange="this.form.submit()">\n';
  html += '        ' + sortOption('new', mt(locale, 'sortNew'), query.sort) + '\n';
  html += '        ' + sortOption('price_asc', mt(locale, 'sortPriceAsc'), query.sort) + '\n';
  html += '        ' + sortOption('price_desc', mt(locale, 'sortPriceDesc'), query.sort) + '\n';
  html += '      </select>\n    </label>\n';
  html += '  </div>\n';

  // Body: facets + results
  html += '  <div class="mk-search-body">\n';
  html += renderFacets(facets, query, locale);

  html += '    <section class="mk-results">\n';
  if (items.length === 0) {
    html += `      <p class="mk-no-results">${escapeHtml(mt(locale, 'noResults'))}</p>\n`;
  } else {
    html += '      <div class="mk-grid">\n';
    for (const p of items) html += renderProductCard(p, locale);
    html += '      </div>\n';
  }
  html += '    </section>\n';
  html += '  </div>\n'; // mk-search-body

  html += '</form>\n';
  html += `<p class="mk-trust">${escapeHtml(mt(locale, 'trustBadge'))}</p>\n`;
  html += '</div>\n';
  return html;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/storefront/marketplace.ts src/storefront/marketplace.test.ts
git commit -m "feat(market): renderSearchPage with facets, sort, mobile filter sheet, no-results"
```

---

## Task 7: renderStoresPage + renderCategoryPage + JSON-LD builders

**Files:**
- Modify: `src/storefront/marketplace.ts`
- Test: `src/storefront/marketplace.test.ts` (append)

- [ ] **Step 1: Write the failing test** — append:

```ts
import { renderStoresPage, renderCategoryPage, buildItemListJsonLd, buildStoreDirectoryJsonLd } from './marketplace';

describe('renderStoresPage', () => {
  const stores: StoreRow[] = [{ slug: 'ahmet-oto', name: 'Ahmet Oto', city: 'Istanbul', country: 'TR', listed: 1 }];
  const html = renderStoresPage({ stores, total: 1, locale: 'en' });
  it('renders the Stores heading and a store link', () => {
    expect(html).toContain('Stores');
    expect(html).toContain('/store/ahmet-oto');
  });
});

describe('renderCategoryPage', () => {
  const html = renderCategoryPage({ categoryId: 'electronics.phones', items: [sampleProduct], total: 1, locale: 'en' });
  it('shows the category id and a product card', () => {
    expect(html).toContain('electronics.phones');
    expect(html).toContain('Tesla Model Y Floor Mats');
  });
});

describe('JSON-LD builders', () => {
  it('buildItemListJsonLd produces an ItemList with absolute URLs', () => {
    const ld = JSON.parse(buildItemListJsonLd([sampleProduct], 'https://photozseo.com'));
    expect(ld['@type']).toBe('ItemList');
    expect(ld.itemListElement[0].url).toBe('https://photozseo.com/store/ahmet-oto/product/tesla-model-y-floor-mats');
  });
  it('buildStoreDirectoryJsonLd lists stores', () => {
    const ld = JSON.parse(buildStoreDirectoryJsonLd([{ slug: 'ahmet-oto', name: 'Ahmet Oto', city: 'Istanbul', country: 'TR', listed: 1 }], 'https://photozseo.com'));
    expect(ld['@type']).toBe('ItemList');
    expect(ld.itemListElement[0].url).toBe('https://photozseo.com/store/ahmet-oto');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: FAIL — functions not exported.

- [ ] **Step 3: Write minimal implementation** — append:

```ts
export function renderStoresPage(args: { stores: StoreRow[]; total: number; locale: string }): string {
  const { stores, locale } = args;
  let html = '<div class="mk">\n';
  html += '<header class="mk-top">\n';
  html += `  <a class="mk-logo" href="/market">${escapeHtml(mt(locale, 'marketTitle'))}</a>\n`;
  html += '</header>\n';
  html += '<section class="mk-section">\n';
  html += `  <h1 class="mk-section__title">${escapeHtml(mt(locale, 'stores'))}</h1>\n`;
  html += renderStoreStrip(stores, locale);
  html += '</section>\n';
  html += `<p class="mk-trust">${escapeHtml(mt(locale, 'trustBadge'))}</p>\n`;
  html += '</div>\n';
  return html;
}

export function renderCategoryPage(args: { categoryId: string; items: ProductRow[]; total: number; locale: string }): string {
  const { categoryId, items, locale } = args;
  let html = '<div class="mk">\n';
  html += '<header class="mk-top">\n';
  html += `  <a class="mk-logo" href="/market">${escapeHtml(mt(locale, 'marketTitle'))}</a>\n`;
  html += renderSearchBar(locale);
  html += '</header>\n';
  html += '<section class="mk-section">\n';
  html += `  <h1 class="mk-section__title">${escapeHtml(categoryId)}</h1>\n`;
  if (items.length === 0) {
    html += `  <p class="mk-no-results">${escapeHtml(mt(locale, 'noResults'))}</p>\n`;
  } else {
    html += '  <div class="mk-grid">\n';
    for (const p of items) html += renderProductCard(p, locale);
    html += '  </div>\n';
  }
  html += '</section>\n';
  html += `<p class="mk-trust">${escapeHtml(mt(locale, 'trustBadge'))}</p>\n`;
  html += '</div>\n';
  return html;
}

/** ItemList JSON-LD for a product listing page. Returns a JSON string (NOT escaped). */
export function buildItemListJsonLd(items: ProductRow[], origin: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: origin + p.product_path,
      name: p.title,
    })),
  });
}

/** ItemList JSON-LD for the store directory. */
export function buildStoreDirectoryJsonLd(stores: StoreRow[], origin: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: stores.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${origin}/store/${s.slug}`,
      name: s.name,
    })),
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/storefront/marketplace.ts src/storefront/marketplace.test.ts
git commit -m "feat(market): stores/category pages + ItemList/StoreDirectory JSON-LD"
```

---

## Task 8: marketplace.css (mobile-first, calm aesthetic, dark/light, a11y)

**Files:**
- Create: `public/marketplace.css`
- Test: `src/storefront/marketplace.test.ts` (append a smoke test that the class names used by renderers exist in the CSS — guards drift)

- [ ] **Step 1: Write the failing test** — append:

```ts
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

describe('marketplace.css', () => {
  const css = readFileSync(fileURLToPath(new URL('../../public/marketplace.css', import.meta.url)), 'utf8');
  const required = ['.mk-grid', '.mk-card', '.mk-chips', '.mk-stores', '.mk-facets', '.mk-trust', '.mk-searchbar', '.mk-filter-toggle'];
  it.each(required)('defines %s', (sel) => {
    expect(css).toContain(sel);
  });
  it('has a prefers-color-scheme dark block', () => {
    expect(css).toContain('prefers-color-scheme: dark');
  });
  it('uses a responsive grid (2 cols mobile baseline)', () => {
    expect(css).toContain('grid-template-columns');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: FAIL — `ENOENT … public/marketplace.css`.

- [ ] **Step 3: Write minimal implementation**

Create `public/marketplace.css`:

```css
/* marketplace.css — /market discovery layer. Mobile-first, calm, dark/light, a11y. */
:root {
  --mk-bg: #ffffff;
  --mk-fg: #16181d;
  --mk-muted: #6b7280;
  --mk-line: #e7e9ee;
  --mk-accent: #2f6df6;
  --mk-card: #ffffff;
  --mk-radius: 14px;
  --mk-gap: 14px;
  --mk-maxw: 1120px;
}
@media (prefers-color-scheme: dark) {
  :root {
    --mk-bg: #0f1115;
    --mk-fg: #eceef2;
    --mk-muted: #9aa1ac;
    --mk-line: #232733;
    --mk-card: #161a22;
  }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--mk-bg); color: var(--mk-fg);
  font: 16px/1.5 -apple-system, system-ui, "Segoe UI", Roboto, sans-serif; }
a { color: inherit; text-decoration: none; }
.mk { max-width: var(--mk-maxw); margin: 0 auto; padding: 16px; }
.mk-top { display: flex; align-items: center; gap: 12px; padding: 8px 0 16px; flex-wrap: wrap; }
.mk-logo { font-weight: 700; font-size: 1.1rem; }
.mk-searchbar, .mk-searchwrap { display: flex; gap: 8px; flex: 1; min-width: 220px; }
.mk-searchbar__input { flex: 1; padding: 12px 14px; border: 1px solid var(--mk-line);
  border-radius: var(--mk-radius); background: var(--mk-card); color: var(--mk-fg); font-size: 1rem; }
.mk-searchbar__btn, .mk-btn { padding: 12px 16px; border: 0; border-radius: var(--mk-radius);
  background: var(--mk-accent); color: #fff; cursor: pointer; font-size: 1rem; }
.mk-btn--ghost { background: transparent; color: var(--mk-fg); border: 1px solid var(--mk-line); }
.mk-filter-toggle { display: none; }

/* Chips — horizontal thumb scroll */
.mk-chips { display: flex; gap: 8px; overflow-x: auto; padding: 4px 0 12px;
  scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.mk-chips::-webkit-scrollbar { display: none; }
.mk-chip { flex: 0 0 auto; padding: 8px 14px; border: 1px solid var(--mk-line);
  border-radius: 999px; background: var(--mk-card); white-space: nowrap; font-size: .9rem; }
.mk-chip--all { background: var(--mk-accent); color: #fff; border-color: var(--mk-accent); }
.mk-chip__count { color: var(--mk-muted); font-size: .8rem; }

/* Sections + grid (2 cols mobile, 4–5 desktop) */
.mk-section { margin: 18px 0; }
.mk-section__title { font-size: 1.1rem; margin: 0 0 12px; }
.mk-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--mk-gap); }
@media (min-width: 700px) { .mk-grid { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 1000px) { .mk-grid { grid-template-columns: repeat(5, 1fr); } }

/* Cards */
.mk-card-link { display: block; }
.mk-card { background: var(--mk-card); border: 1px solid var(--mk-line);
  border-radius: var(--mk-radius); overflow: hidden; transition: transform .15s ease; }
.mk-card-link:hover .mk-card, .mk-card-link:focus-visible .mk-card { transform: translateY(-2px); }
.mk-card__media { position: relative; aspect-ratio: 1 / 1; background: var(--mk-line); }
.mk-card__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.mk-card__media-empty { display: grid; place-items: center; height: 100%; font-size: 2rem; }
.mk-card__badge { position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,.72);
  color: #fff; padding: 3px 8px; border-radius: 8px; font-size: .75rem; }
.mk-card__body { padding: 10px; }
.mk-card__title { font-size: .92rem; font-weight: 600; margin: 0 0 6px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.mk-card__price { font-weight: 700; }
.mk-card__price--contact { font-weight: 500; color: var(--mk-muted); font-size: .85rem; }

/* Stores strip */
.mk-stores { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; }
.mk-store { flex: 0 0 auto; padding: 12px 16px; border: 1px solid var(--mk-line);
  border-radius: var(--mk-radius); background: var(--mk-card); display: flex; flex-direction: column; gap: 4px; }
.mk-store__name { font-weight: 600; }
.mk-store__loc { color: var(--mk-muted); font-size: .82rem; }

/* Featured slot */
.mk-featured:empty { display: none; }

/* Search page */
.mk-resultbar { display: flex; justify-content: space-between; align-items: center;
  margin: 8px 0 14px; gap: 12px; flex-wrap: wrap; }
.mk-resultbar__count { color: var(--mk-muted); }
.mk-sort { display: flex; align-items: center; gap: 8px; }
.mk-sort select { padding: 8px 10px; border: 1px solid var(--mk-line); border-radius: 10px;
  background: var(--mk-card); color: var(--mk-fg); }
.mk-search-body { display: grid; grid-template-columns: 240px 1fr; gap: 20px; }
.mk-facets { border: 1px solid var(--mk-line); border-radius: var(--mk-radius); padding: 14px; height: fit-content; }
.mk-facet { border: 0; padding: 0 0 14px; margin: 0; }
.mk-facet legend { font-weight: 600; padding: 0 0 8px; }
.mk-facet__opt { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: .9rem; }
.mk-facet__count { margin-left: auto; color: var(--mk-muted); font-size: .8rem; }
.mk-facet input[type="number"] { width: 100%; padding: 8px; margin-bottom: 6px;
  border: 1px solid var(--mk-line); border-radius: 10px; background: var(--mk-card); color: var(--mk-fg); }
.mk-facet__actions { display: flex; gap: 8px; margin-top: 8px; }
.mk-no-results { color: var(--mk-muted); padding: 40px 0; text-align: center; }

/* Mobile: facets become a bottom sheet toggled by the filter button */
@media (max-width: 699px) {
  .mk-filter-toggle { display: inline-block; padding: 12px 16px; border: 1px solid var(--mk-line);
    border-radius: var(--mk-radius); background: var(--mk-card); color: var(--mk-fg); }
  .mk-search-body { grid-template-columns: 1fr; }
  .mk-facets { position: fixed; left: 0; right: 0; bottom: 0; max-height: 80vh; overflow: auto;
    border-radius: 18px 18px 0 0; transform: translateY(100%); transition: transform .25s ease;
    z-index: 50; box-shadow: 0 -8px 32px rgba(0,0,0,.25); }
  .mk-facets[data-mk-open] { transform: translateY(0); }
}

/* Trust badge */
.mk-trust { text-align: center; color: var(--mk-muted); font-size: .85rem;
  padding: 24px 0; border-top: 1px solid var(--mk-line); margin-top: 24px; }

/* a11y: visible focus + reduced motion */
a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible {
  outline: 3px solid var(--mk-accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
[dir="rtl"] .mk-card__badge { left: auto; right: 8px; }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add public/marketplace.css src/storefront/marketplace.test.ts
git commit -m "feat(market): mobile-first marketplace.css with dark/light, bottom-sheet facets, a11y focus"
```

---

## Task 9: marketplace-cart.js (store-scoped localStorage cart + order form + WhatsApp + IBAN + SP-XXXXX)

**Files:**
- Create: `public/marketplace-cart.js`
- Test: `src/storefront/marketplace-cart.test.ts` (jsdom — test the pure helpers exported on `window.__mkCart` for testability)

> This file is loaded on the existing `/store/<slug>` storefront page (wired in Task 11) because IBAN/WhatsApp live in that page's manifest. It exposes pure functions for unit testing while also auto-initializing the DOM behavior.

- [ ] **Step 1: Write the failing test**

Create `src/storefront/marketplace-cart.test.ts`:

```ts
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const src = readFileSync(fileURLToPath(new URL('../../public/marketplace-cart.js', import.meta.url)), 'utf8');

function loadCart() {
  // Execute the IIFE in the jsdom global scope.
  const fn = new Function(src);
  fn();
  // @ts-expect-error injected by the script
  return window.__mkCart;
}

describe('marketplace-cart helpers', () => {
  let cart: any;
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    cart = loadCart();
  });

  it('generateRef returns SP- + 5 uppercase base32 chars', () => {
    const ref = cart.generateRef();
    expect(ref).toMatch(/^SP-[0-9A-Z]{5}$/);
  });

  it('addItem stores per-store and getCart reads it back', () => {
    cart.addItem('ahmet-oto', { id: 'p1', title: 'Mat', price: 49.9, currency: 'USD', qty: 1 });
    const items = cart.getCart('ahmet-oto');
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Mat');
    // different store has its own cart
    expect(cart.getCart('beta')).toHaveLength(0);
  });

  it('addItem increments qty when the same product is added again', () => {
    cart.addItem('s', { id: 'p1', title: 'X', price: 10, currency: 'USD', qty: 1 });
    cart.addItem('s', { id: 'p1', title: 'X', price: 10, currency: 'USD', qty: 1 });
    expect(cart.getCart('s')[0].qty).toBe(2);
  });

  it('cartTotal sums price * qty', () => {
    cart.addItem('s', { id: 'a', title: 'A', price: 10, currency: 'USD', qty: 2 });
    cart.addItem('s', { id: 'b', title: 'B', price: 5, currency: 'USD', qty: 1 });
    expect(cart.cartTotal('s')).toBe(25);
  });

  it('validateOrder flags missing required fields', () => {
    expect(cart.validateOrder({ name: '', phone: '', address: '', note: '' }).valid).toBe(false);
    expect(cart.validateOrder({ name: 'Ali', phone: '5xx', address: 'Addr', note: 'n' }).valid).toBe(true);
  });

  it('buildWhatsappUrl produces a wa.me link with encoded message + ref', () => {
    cart.addItem('s', { id: 'a', title: 'Mat', price: 10, currency: 'USD', qty: 2 });
    const url = cart.buildWhatsappUrl('905551112233', 's', { name: 'Ali', phone: '5551112233', address: 'Addr', note: '' }, 'SP-AB12C');
    expect(url).toContain('https://wa.me/905551112233');
    expect(decodeURIComponent(url)).toContain('SP-AB12C');
    expect(decodeURIComponent(url)).toContain('Mat');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/marketplace-cart.test.ts`
Expected: FAIL — `ENOENT … public/marketplace-cart.js`.

> If jsdom is not installed: `npm i -D jsdom` first (vitest 3 supports `@vitest-environment jsdom` when jsdom is present). Verify with `npm test -- src/storefront/marketplace-cart.test.ts` showing the ENOENT (not an env error).

- [ ] **Step 3: Write minimal implementation**

Create `public/marketplace-cart.js`:

```js
/* marketplace-cart.js — store-scoped localStorage cart + WhatsApp/IBAN order flow.
 * Zero backend, zero payment. Loaded on /store/<slug> pages.
 * Exposes window.__mkCart for unit tests; auto-wires DOM if a cart UI is present. */
(function () {
  'use strict';

  function key(slug) { return 'mk-cart:' + slug; }

  function getCart(slug) {
    try { return JSON.parse(localStorage.getItem(key(slug)) || '[]'); }
    catch (e) { return []; }
  }
  function saveCart(slug, items) {
    try { localStorage.setItem(key(slug), JSON.stringify(items)); } catch (e) {}
  }
  function addItem(slug, item) {
    var items = getCart(slug);
    var existing = null;
    for (var i = 0; i < items.length; i++) { if (items[i].id === item.id) { existing = items[i]; break; } }
    if (existing) { existing.qty += (item.qty || 1); }
    else { items.push({ id: item.id, title: item.title, price: item.price, currency: item.currency, qty: item.qty || 1 }); }
    saveCart(slug, items);
    return items;
  }
  function removeItem(slug, id) {
    var items = getCart(slug).filter(function (x) { return x.id !== id; });
    saveCart(slug, items);
    return items;
  }
  function cartTotal(slug) {
    return getCart(slug).reduce(function (sum, x) { return sum + (x.price || 0) * (x.qty || 1); }, 0);
  }
  function clearCart(slug) { saveCart(slug, []); }

  // SP-XXXXX random reference, client-side only (no persistence/counter → no backend).
  function generateRef() {
    var alphabet = '0123456789ABCDEFGHJKMNPQRSTUVWXYZ';
    var bytes = new Uint8Array(5);
    (self.crypto || window.crypto).getRandomValues(bytes);
    var out = '';
    for (var i = 0; i < 5; i++) { out += alphabet[bytes[i] % alphabet.length]; }
    return 'SP-' + out;
  }

  function validateOrder(form) {
    var errors = {};
    ['name', 'phone', 'address'].forEach(function (f) {
      if (!form[f] || !String(form[f]).trim()) errors[f] = true;
    });
    return { valid: Object.keys(errors).length === 0, errors: errors };
  }

  function buildWhatsappUrl(whatsapp, slug, form, ref) {
    var items = getCart(slug);
    var lines = [];
    lines.push('Order ' + ref);
    items.forEach(function (x) {
      lines.push('- ' + x.title + ' x' + x.qty + ' (' + (x.price != null ? x.price + ' ' + x.currency : '-') + ')');
    });
    lines.push('Total: ' + cartTotal(slug).toFixed(2));
    lines.push('');
    lines.push('Name: ' + form.name);
    lines.push('Phone: ' + form.phone);
    lines.push('Address: ' + form.address);
    if (form.note) lines.push('Note: ' + form.note);
    var num = String(whatsapp).replace(/[^0-9]/g, '');
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  var api = {
    getCart: getCart, saveCart: saveCart, addItem: addItem, removeItem: removeItem,
    cartTotal: cartTotal, clearCart: clearCart, generateRef: generateRef,
    validateOrder: validateOrder, buildWhatsappUrl: buildWhatsappUrl,
  };
  window.__mkCart = api;

  // ── DOM wiring (no-op when the cart UI is absent, e.g. in unit tests) ──────────
  function init() {
    var root = document.querySelector('[data-mk-cart-root]');
    if (!root) return;
    var slug = root.getAttribute('data-mk-slug');
    var whatsapp = root.getAttribute('data-mk-whatsapp') || '';

    document.querySelectorAll('[data-mk-add]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        addItem(slug, {
          id: btn.getAttribute('data-mk-add'),
          title: btn.getAttribute('data-mk-title') || '',
          price: parseFloat(btn.getAttribute('data-mk-price') || '0') || 0,
          currency: btn.getAttribute('data-mk-currency') || 'USD',
          qty: 1,
        });
        render();
      });
    });

    var form = root.querySelector('[data-mk-order-form]');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var data = {
          name: (form.querySelector('[name=name]') || {}).value || '',
          phone: (form.querySelector('[name=phone]') || {}).value || '',
          address: (form.querySelector('[name=address]') || {}).value || '',
          note: (form.querySelector('[name=note]') || {}).value || '',
        };
        var v = validateOrder(data);
        form.querySelectorAll('[data-mk-err]').forEach(function (el) {
          el.hidden = !v.errors[el.getAttribute('data-mk-err')];
        });
        if (!v.valid) return;
        var ref = generateRef();
        var refOut = root.querySelector('[data-mk-ref]');
        if (refOut) refOut.textContent = ref;
        var payBox = root.querySelector('[data-mk-payment]');
        if (payBox) payBox.hidden = false;
        var descOut = root.querySelector('[data-mk-paydesc]');
        if (descOut) descOut.textContent = ref;
        window.open(buildWhatsappUrl(whatsapp, slug, data, ref), '_blank', 'noopener');
      });
    }

    function render() {
      var list = root.querySelector('[data-mk-cart-list]');
      if (!list) return;
      var items = getCart(slug);
      list.innerHTML = '';
      items.forEach(function (x) {
        var li = document.createElement('li');
        li.textContent = x.title + ' ×' + x.qty;
        list.appendChild(li);
      });
      var totalEl = root.querySelector('[data-mk-total]');
      if (totalEl) totalEl.textContent = cartTotal(slug).toFixed(2);
    }
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/storefront/marketplace-cart.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add public/marketplace-cart.js src/storefront/marketplace-cart.test.ts
git commit -m "feat(market): store-scoped localStorage cart + WhatsApp order + SP-XXXXX ref + validation"
```

---

## Task 10: marketplace-enhance.js (hover-prefetch + View Transitions) + filter-sheet toggle

**Files:**
- Create: `public/marketplace-enhance.js`
- Test: `src/storefront/marketplace-enhance.test.ts` (jsdom)

- [ ] **Step 1: Write the failing test**

Create `src/storefront/marketplace-enhance.test.ts`:

```ts
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const src = readFileSync(fileURLToPath(new URL('../../public/marketplace-enhance.js', import.meta.url)), 'utf8');
function load() { new Function(src)(); }

describe('marketplace-enhance', () => {
  beforeEach(() => { document.head.innerHTML = ''; document.body.innerHTML = ''; });

  it('prefetches a link on hover (adds <link rel=prefetch>)', () => {
    document.body.innerHTML = '<a class="mk-card-link" href="/store/x/product/y">card</a>';
    load();
    const a = document.querySelector('a')!;
    a.dispatchEvent(new Event('mouseenter'));
    const pre = document.querySelector('link[rel="prefetch"]');
    expect(pre).not.toBeNull();
    expect(pre!.getAttribute('href')).toBe('/store/x/product/y');
  });

  it('toggles the filter sheet open attribute', () => {
    document.body.innerHTML =
      '<button data-mk-filter-toggle aria-expanded="false">F</button><aside data-mk-facets></aside>';
    load();
    const btn = document.querySelector('[data-mk-filter-toggle]') as HTMLElement;
    btn.click();
    const sheet = document.querySelector('[data-mk-facets]') as HTMLElement;
    expect(sheet.hasAttribute('data-mk-open')).toBe(true);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/marketplace-enhance.test.ts`
Expected: FAIL — `ENOENT … public/marketplace-enhance.js`.

- [ ] **Step 3: Write minimal implementation**

Create `public/marketplace-enhance.js`:

```js
/* marketplace-enhance.js — progressive enhancement for /market.
 * Hover/touch prefetch, View Transitions (if supported), mobile filter-sheet toggle.
 * Everything degrades to plain navigation when JS/APIs are absent. */
(function () {
  'use strict';

  // ── Hover-prefetch ────────────────────────────────────────────────────────────
  var prefetched = {};
  function prefetch(href) {
    if (!href || prefetched[href]) return;
    prefetched[href] = true;
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
  function bindPrefetch() {
    document.querySelectorAll('a.mk-card-link, a.mk-store, a.mk-chip').forEach(function (a) {
      var run = function () { prefetch(a.getAttribute('href')); };
      a.addEventListener('mouseenter', run);
      a.addEventListener('touchstart', run, { passive: true });
    });
  }

  // ── View Transitions on same-origin nav ────────────────────────────────────────
  function bindViewTransitions() {
    if (!document.startViewTransition) return;
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || a.target === '_blank') return;
      var url;
      try { url = new URL(href, location.href); } catch (_) { return; }
      if (url.origin !== location.origin) return;
      e.preventDefault();
      document.startViewTransition(function () { location.href = url.href; });
    });
  }

  // ── Mobile filter sheet toggle ──────────────────────────────────────────────────
  function bindFilterSheet() {
    var btn = document.querySelector('[data-mk-filter-toggle]');
    var sheet = document.querySelector('[data-mk-facets]');
    if (!btn || !sheet) return;
    btn.addEventListener('click', function () {
      var open = sheet.hasAttribute('data-mk-open');
      if (open) { sheet.removeAttribute('data-mk-open'); btn.setAttribute('aria-expanded', 'false'); }
      else { sheet.setAttribute('data-mk-open', ''); btn.setAttribute('aria-expanded', 'true'); }
    });
  }

  function init() { bindPrefetch(); bindViewTransitions(); bindFilterSheet(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/storefront/marketplace-enhance.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add public/marketplace-enhance.js src/storefront/marketplace-enhance.test.ts
git commit -m "feat(market): hover-prefetch + View Transitions + mobile filter-sheet enhancement"
```

---

## Task 11: Wire cart UI + script into the existing storefront product page

**Files:**
- Modify: `src/storefront/render.ts` (`renderProductBody`)
- Modify: `src/storefront/render.test.ts` (append)

> The storefront product page already has a single-product "Order via WhatsApp" button. We ADD a cart-add affordance + an order box (cart list, form, IBAN/SP-XXXXX panel) gated behind `data-mk-cart-root`, and load `marketplace-cart.js`. IBAN/ibanName come from the manifest (`manifest.store` — extend `StoreInfo` consumption defensively; the field may be absent on older manifests).

- [ ] **Step 1: Write the failing test** — append to `src/storefront/render.test.ts`:

```ts
describe('renderProductBody — marketplace cart', () => {
  const html = renderProductBody(manifest, p1, 'tr', 'tr');
  it('renders a cart-add button with product data attributes', () => {
    expect(html).toContain('data-mk-add="' + p1.id + '"');
    expect(html).toContain('data-mk-title=');
    expect(html).toContain('data-mk-price=');
  });
  it('renders a cart root scoped to the store slug', () => {
    expect(html).toContain('data-mk-cart-root');
    expect(html).toContain('data-mk-slug="' + manifest.store.slug + '"');
  });
  it('loads marketplace-cart.js', () => {
    expect(html).toContain('/marketplace-cart.js');
  });
  it('renders the order form with required fields', () => {
    expect(html).toContain('data-mk-order-form');
    expect(html).toContain('name="name"');
    expect(html).toContain('name="phone"');
    expect(html).toContain('name="address"');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/render.test.ts`
Expected: FAIL — `data-mk-add` not found.

- [ ] **Step 3: Write minimal implementation**

In `src/storefront/render.ts`, inside `renderProductBody`, locate the existing WhatsApp order button block:

```ts
  // WhatsApp order button
  if (waHref) {
    html += `      <a class="sf-btn sf-btn--order" href="${escapeAttr(waHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(waLabel)}</a>\n`;
  }
```

Replace it with (keep the WhatsApp button, then add the cart UI):

```ts
  // WhatsApp order button (direct, single-product)
  if (waHref) {
    html += `      <a class="sf-btn sf-btn--order" href="${escapeAttr(waHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(waLabel)}</a>\n`;
  }

  // Marketplace cart (store-scoped). IBAN/ibanName/whatsapp come from the manifest store record.
  const wa = store.contact.whatsapp ?? store.contact.phone ?? '';
  const pay = (store as unknown as { payment?: { iban?: string; ibanName?: string } }).payment;
  const addLabel = locale === 'tr' ? 'Sepete Ekle' : 'Add to cart';
  const sendLabel = locale === 'tr' ? 'Sepeti Gönder' : 'Send cart';
  const nameL = locale === 'tr' ? 'Ad Soyad' : 'Full name';
  const phoneL = locale === 'tr' ? 'Telefon' : 'Phone';
  const addrL = locale === 'tr' ? 'Adres' : 'Address';
  const noteL = locale === 'tr' ? 'Not' : 'Note';
  const reqL = locale === 'tr' ? 'Bu alan zorunludur' : 'This field is required';
  const refL = locale === 'tr' ? 'Sipariş referansı' : 'Order reference';
  const payL = locale === 'tr' ? 'Havale ile ödeme' : 'Pay by bank transfer';
  const priceForCart = product.price != null ? String(product.price) : '';
  const curForCart = product.currency ?? store.currency;

  html += `      <button type="button" class="sf-btn sf-btn--cart" data-mk-add="${escapeAttr(product.id)}" data-mk-title="${escapeAttr(title)}" data-mk-price="${escapeAttr(priceForCart)}" data-mk-currency="${escapeAttr(curForCart)}">${escapeHtml(addLabel)}</button>\n`;

  html += `      <div class="sf-cart" data-mk-cart-root data-mk-slug="${escapeAttr(store.slug)}" data-mk-whatsapp="${escapeAttr(wa)}">\n`;
  html += '        <ul class="sf-cart__list" data-mk-cart-list></ul>\n';
  html += `        <p class="sf-cart__total">${escapeHtml(locale === 'tr' ? 'Toplam' : 'Total')}: <span data-mk-total>0.00</span></p>\n`;
  html += '        <form class="sf-cart__form" data-mk-order-form novalidate>\n';
  html += `          <label>${escapeHtml(nameL)}<input name="name" required /></label><span data-mk-err="name" hidden class="sf-cart__err">${escapeHtml(reqL)}</span>\n`;
  html += `          <label>${escapeHtml(phoneL)}<input name="phone" type="tel" required /></label><span data-mk-err="phone" hidden class="sf-cart__err">${escapeHtml(reqL)}</span>\n`;
  html += `          <label>${escapeHtml(addrL)}<textarea name="address" required></textarea></label><span data-mk-err="address" hidden class="sf-cart__err">${escapeHtml(reqL)}</span>\n`;
  html += `          <label>${escapeHtml(noteL)}<textarea name="note"></textarea></label>\n`;
  html += `          <button type="submit" class="sf-btn sf-btn--order">${escapeHtml(sendLabel)}</button>\n`;
  html += '        </form>\n';
  html += '        <div class="sf-cart__payment" data-mk-payment hidden>\n';
  html += `          <p>${escapeHtml(refL)}: <strong data-mk-ref></strong></p>\n`;
  html += `          <p>${escapeHtml(payL)}</p>\n`;
  if (pay?.iban) {
    html += `          <p>IBAN: <strong>${escapeHtml(pay.iban)}</strong></p>\n`;
  }
  if (pay?.ibanName) {
    html += `          <p>${escapeHtml(locale === 'tr' ? 'Hesap adı' : 'Account name')}: <strong>${escapeHtml(pay.ibanName)}</strong></p>\n`;
  }
  html += `          <p>${escapeHtml(locale === 'tr' ? 'Ödeme açıklaması' : 'Payment description')}: <strong data-mk-paydesc></strong></p>\n`;
  html += '        </div>\n';
  html += '      </div>\n';
  html += '      <script src="/marketplace-cart.js" defer></script>\n';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/storefront/render.test.ts`
Expected: PASS (existing tests + 4 new).

- [ ] **Step 5: Commit**

```bash
git add src/storefront/render.ts src/storefront/render.test.ts
git commit -m "feat(market): add store-scoped cart UI + order form + IBAN panel to product page"
```

---

## Task 12: Market router — /market home (Function calls P1 lib + renderDocument)

**Files:**
- Create: `functions/market/[[path]].ts`
- Test: `src/storefront/market-router.test.ts`

> The router imports P1 lib + the pure renderers. The test injects a fake `DB`/`AI` and a fake `marketplace` lib via the route's pure handler, so we expose a pure `handleMarket(parts, deps)` function plus the Pages `onRequestGet` thin wrapper.

- [ ] **Step 1: Write the failing test**

Create `src/storefront/market-router.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { handleMarket } from '../../functions/market/[[path]]';
import type { ProductRow, StoreRow, Facets } from './marketplace';

const product: ProductRow = {
  id: 's:p', store_slug: 's', title: 'Mat', description: 'd', category_id: 'c1',
  tags: '', price: 49.9, currency: 'USD', stock: 3, image_url: 'i.avif',
  product_path: '/store/s/product/mat',
};
const store: StoreRow = { slug: 's', name: 'Shop', city: 'Istanbul', country: 'TR', listed: 1 };
const facets: Facets = { categories: [{ id: 'c1', count: 1 }], priceRange: { min: 0, max: 100 }, cities: [{ value: 'Istanbul', count: 1 }], inStockCount: 1 };

const deps = {
  searchProducts: async () => ({ items: [product], facets, total: 1 }),
  listNewProducts: async () => ({ items: [product], total: 1 }),
  listStores: async () => ({ items: [store], total: 1 }),
};

describe('handleMarket', () => {
  it('renders /market home with new products + stores', async () => {
    const res = await handleMarket([], { url: 'https://photozseo.com/market', lang: 'en', db: {} as any, ai: undefined, ...deps });
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain('New products');
    expect(html).toContain('Mat');
    expect(html).toContain('/store/s');
    expect(html).toContain('rel="canonical" href="https://photozseo.com/market"');
    // hreflang x-default present
    expect(html).toContain('hreflang="x-default"');
  });

  it('renders /market/search with results + facets', async () => {
    const res = await handleMarket(['search'], { url: 'https://photozseo.com/market/search?q=mat&sort=new', lang: 'en', db: {} as any, ai: undefined, ...deps });
    const html = await res.text();
    expect(html).toContain('value="mat"');
    expect(html).toContain('Istanbul');
    expect(html).toContain('results');
  });

  it('renders /market/stores', async () => {
    const res = await handleMarket(['stores'], { url: 'https://photozseo.com/market/stores', lang: 'en', db: {} as any, ai: undefined, ...deps });
    const html = await res.text();
    expect(html).toContain('Stores');
    expect(html).toContain('/store/s');
  });

  it('renders /market/c/<id>', async () => {
    const res = await handleMarket(['c', 'c1'], { url: 'https://photozseo.com/market/c/c1', lang: 'en', db: {} as any, ai: undefined, ...deps });
    const html = await res.text();
    expect(html).toContain('c1');
    expect(html).toContain('Mat');
  });

  it('404s an unknown subpath', async () => {
    const res = await handleMarket(['nope'], { url: 'https://photozseo.com/market/nope', lang: 'en', db: {} as any, ai: undefined, ...deps });
    expect(res.status).toBe(404);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/market-router.test.ts`
Expected: FAIL — `Cannot find module '../../functions/market/[[path]]'`.

- [ ] **Step 3: Write minimal implementation**

Create `functions/market/[[path]].ts`:

```ts
/**
 * GET /market/*
 *   /market                 → hybrid home
 *   /market/search?q&…      → faceted search
 *   /market/stores          → store directory
 *   /market/c/<id>          → category listing
 *
 * Pure handler `handleMarket` is unit-testable with injected lib deps; the Pages
 * onRequestGet wires the real D1/AI bindings + P1 functions/_lib/marketplace.ts.
 */

import {
  searchProducts as realSearch,
  listNewProducts as realListNew,
  listStores as realListStores,
} from '../_lib/marketplace';
import type { AiBinding } from '../_lib/translate';
import {
  renderMarketHome,
  renderSearchPage,
  renderStoresPage,
  renderCategoryPage,
  buildItemListJsonLd,
  buildStoreDirectoryJsonLd,
  type ProductRow,
  type StoreRow,
  type Facets,
  type SearchQuery,
} from '../../src/storefront/marketplace';
import { mt } from '../../src/storefront/marketplace-i18n';
import { renderDocument, type AlternateLink } from '../../src/storefront/document';
import { SUPPORTED_LOCALES } from '../../src/storefront/manifest';

const DEFAULT_LANG = 'en';

export interface MarketDeps {
  url: string;
  lang: string;
  db: D1Database;
  ai: AiBinding | undefined;
  searchProducts: typeof realSearch;
  listNewProducts: typeof realListNew;
  listStores: typeof realListStores;
}

function buildAlternates(origin: string, path: string): AlternateLink[] {
  const alts: AlternateLink[] = SUPPORTED_LOCALES.map((l) => ({ lang: l, href: `${origin}${path}?lang=${l}` }));
  alts.push({ lang: 'x-default', href: `${origin}${path}` });
  return alts;
}

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60' },
  });
}

export async function handleMarket(parts: string[], deps: MarketDeps): Promise<Response> {
  const u = new URL(deps.url);
  const origin = u.origin;
  const locale = SUPPORTED_LOCALES.includes(deps.lang) ? deps.lang : DEFAULT_LANG;

  // /market
  if (parts.length === 0) {
    const [newP, stores] = await Promise.all([
      deps.listNewProducts(deps.db, { limit: 20 }),
      deps.listStores(deps.db, { limit: 12 }),
    ]);
    const cats: { id: string; count: number }[] = [];
    const seen = new Set<string>();
    for (const p of newP.items) {
      if (p.category_id && !seen.has(p.category_id)) { seen.add(p.category_id); cats.push({ id: p.category_id, count: 0 }); }
    }
    const body = renderMarketHome({ products: newP.items, stores: stores.items, categories: cats, locale });
    const canonical = `${origin}/market`;
    return htmlResponse(renderDocument({
      title: mt(locale, 'marketTitle') + ' — photoZseo',
      description: mt(locale, 'trustBadge'),
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, '/market'),
      jsonLd: buildItemListJsonLd(newP.items, origin),
    }));
  }

  // /market/search
  if (parts[0] === 'search' && parts.length === 1) {
    const q: SearchQuery = {
      q: u.searchParams.get('q') ?? undefined,
      sort: (u.searchParams.get('sort') as SearchQuery['sort']) ?? 'new',
      categoryId: u.searchParams.get('categoryId') ?? undefined,
      city: u.searchParams.get('city') ?? undefined,
      minPrice: u.searchParams.has('minPrice') ? Number(u.searchParams.get('minPrice')) : undefined,
      maxPrice: u.searchParams.has('maxPrice') ? Number(u.searchParams.get('maxPrice')) : undefined,
      inStock: u.searchParams.get('inStock') === '1',
    };
    const result = await deps.searchProducts(deps.db, deps.ai, {
      q: q.q, lang: locale, categoryId: q.categoryId, minPrice: q.minPrice, maxPrice: q.maxPrice,
      city: q.city, inStock: q.inStock, sort: q.sort, limit: 40, offset: 0,
    });
    const body = renderSearchPage({ items: result.items, facets: result.facets, total: result.total, locale, query: q });
    const canonical = `${origin}/market/search`;
    return htmlResponse(renderDocument({
      title: (q.q ? q.q + ' — ' : '') + mt(locale, 'marketTitle'),
      description: mt(locale, 'trustBadge'),
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, '/market/search'),
      jsonLd: buildItemListJsonLd(result.items, origin),
    }));
  }

  // /market/stores
  if (parts[0] === 'stores' && parts.length === 1) {
    const stores = await deps.listStores(deps.db, { limit: 100 });
    const body = renderStoresPage({ stores: stores.items, total: stores.total, locale });
    const canonical = `${origin}/market/stores`;
    return htmlResponse(renderDocument({
      title: mt(locale, 'stores') + ' — photoZseo',
      description: mt(locale, 'trustBadge'),
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, '/market/stores'),
      jsonLd: buildStoreDirectoryJsonLd(stores.items, origin),
    }));
  }

  // /market/c/<id>
  if (parts[0] === 'c' && parts.length === 2) {
    const categoryId = decodeURIComponent(parts[1]);
    const result = await deps.searchProducts(deps.db, deps.ai, { categoryId, lang: locale, sort: 'new', limit: 40 });
    const body = renderCategoryPage({ categoryId, items: result.items, total: result.total, locale });
    const canonical = `${origin}/market/c/${encodeURIComponent(categoryId)}`;
    return htmlResponse(renderDocument({
      title: categoryId + ' — ' + mt(locale, 'marketTitle'),
      description: mt(locale, 'trustBadge'),
      lang: locale, body, canonical,
      alternates: buildAlternates(origin, `/market/c/${encodeURIComponent(categoryId)}`),
      jsonLd: buildItemListJsonLd(result.items, origin),
    }));
  }

  return htmlResponse(renderDocument({
    title: 'Not found — photoZseo', description: '', lang: locale,
    body: '<div class="mk"><p style="padding:2rem;text-align:center">Not found</p></div>',
  }), 404);
}

interface Env {
  MARKET_DB: D1Database;
  AI?: AiBinding;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const raw = ctx.params.path;
  const rawPath = Array.isArray(raw) ? raw.join('/') : (raw ?? '');
  const parts = rawPath.split('/').filter(Boolean);
  const u = new URL(ctx.request.url);
  const lang = u.searchParams.get('lang') ?? DEFAULT_LANG;
  return handleMarket(parts, {
    url: ctx.request.url, lang, db: ctx.env.MARKET_DB, ai: ctx.env.AI,
    searchProducts: realSearch, listNewProducts: realListNew, listStores: realListStores,
  });
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/storefront/market-router.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add functions/market/[[path]].ts src/storefront/market-router.test.ts
git commit -m "feat(market): /market router (home/search/stores/category) calling P1 marketplace lib"
```

---

## Task 13: Load marketplace.css + enhance.js on market pages

**Files:**
- Modify: `src/storefront/document.ts`
- Modify: `src/storefront/document.test.ts` (append)
- Modify: `functions/market/[[path]].ts` (pass `extraHead`/`extraScripts`)

> `renderDocument` currently hardcodes `/storefront.css`. Add an optional `stylesheets` + `bodyScripts` so market pages load `/marketplace.css` + `/marketplace-enhance.js` without affecting existing storefront pages.

- [ ] **Step 1: Write the failing test** — append to `src/storefront/document.test.ts`:

```ts
it('includes extra stylesheets when provided', () => {
  const html = renderDocument({ title: 't', lang: 'en', body: 'x', stylesheets: ['/marketplace.css'] });
  expect(html).toContain('href="/marketplace.css"');
});
it('includes body scripts when provided', () => {
  const html = renderDocument({ title: 't', lang: 'en', body: 'x', bodyScripts: ['/marketplace-enhance.js'] });
  expect(html).toContain('<script src="/marketplace-enhance.js" defer></script>');
});
it('still loads /storefront.css by default (no regression)', () => {
  const html = renderDocument({ title: 't', lang: 'en', body: 'x' });
  expect(html).toContain('/storefront.css');
});
```

> If `document.test.ts` has no import yet, ensure the top of the file has `import { renderDocument } from './document';`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/document.test.ts`
Expected: FAIL — `/marketplace.css` not present.

- [ ] **Step 3: Write minimal implementation**

In `src/storefront/document.ts`, extend `DocumentOptions`:

```ts
export interface DocumentOptions {
  title: string;
  description?: string;
  lang: string;
  body: string;
  canonical?: string;
  alternates?: AlternateLink[];
  ogImage?: string;
  jsonLd?: string;
  stylesheets?: string[];
  bodyScripts?: string[];
}
```

Update the destructure + the stylesheet line. Replace:

```ts
  head += `
<meta name="robots" content="index, follow" />
<link rel="stylesheet" href="/storefront.css" />`;
```

with:

```ts
  head += `
<meta name="robots" content="index, follow" />`;
  const sheets = opts.stylesheets && opts.stylesheets.length ? opts.stylesheets : ['/storefront.css'];
  for (const href of sheets) {
    head += `\n<link rel="stylesheet" href="${esc(href)}" />`;
  }
```

And replace the final return's `<body>${body}</body>` with:

```ts
  let bodyScripts = '';
  for (const src of opts.bodyScripts ?? []) {
    bodyScripts += `<script src="${esc(src)}" defer></script>`;
  }

  return `<!doctype html>
<html lang="${esc(lang)}" dir="${dir}">
<head>
${head}
</head>
<body>${body}${bodyScripts}</body>
</html>`;
```

Then in `functions/market/[[path]].ts`, add to **every** `renderDocument({…})` call in the four route branches:

```ts
      stylesheets: ['/marketplace.css'],
      bodyScripts: ['/marketplace-enhance.js'],
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/storefront/document.test.ts src/storefront/market-router.test.ts`
Expected: PASS for both (market-router still passes; default storefront pages keep `/storefront.css`).

- [ ] **Step 5: Commit**

```bash
git add src/storefront/document.ts src/storefront/document.test.ts functions/market/[[path]].ts
git commit -m "feat(market): optional stylesheets/bodyScripts in renderDocument; load marketplace.css + enhance.js"
```

---

## Task 14: Marketplace sitemap (/marketplace-sitemap.xml)

**Files:**
- Create: `functions/marketplace-sitemap.ts`
- Test: `src/storefront/market-sitemap.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/storefront/market-sitemap.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { buildMarketplaceSitemap } from '../../functions/marketplace-sitemap';
import type { ProductRow, StoreRow } from './marketplace';

const products: ProductRow[] = [
  { id: 's:p', store_slug: 's', title: 'Mat', description: '', category_id: 'c', tags: '', price: 1, currency: 'USD', stock: 1, image_url: '', product_path: '/store/s/product/mat' },
];
const stores: StoreRow[] = [{ slug: 's', name: 'Shop', city: 'Istanbul', country: 'TR', listed: 1 }];

describe('buildMarketplaceSitemap', () => {
  const xml = buildMarketplaceSitemap(stores, products, 'https://photozseo.com');
  it('starts with the urlset declaration', () => {
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset');
  });
  it('includes /market and store + product URLs', () => {
    expect(xml).toContain('<loc>https://photozseo.com/market</loc>');
    expect(xml).toContain('<loc>https://photozseo.com/store/s</loc>');
    expect(xml).toContain('<loc>https://photozseo.com/store/s/product/mat</loc>');
  });
  it('XML-escapes ampersands in paths', () => {
    const x = buildMarketplaceSitemap([], [{ ...products[0], product_path: '/store/s/product/a&b' }], 'https://x.com');
    expect(x).toContain('a&amp;b');
    expect(x).not.toContain('a&b<');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/market-sitemap.test.ts`
Expected: FAIL — `Cannot find module '../../functions/marketplace-sitemap'`.

- [ ] **Step 3: Write minimal implementation**

Create `functions/marketplace-sitemap.ts`:

```ts
/** GET /marketplace-sitemap.xml — listed stores + their products (only listed=1). */
import { listStores as realListStores, listNewProducts as realListNew } from './_lib/marketplace';
import type { AiBinding } from './_lib/translate';
import type { ProductRow, StoreRow } from '../src/storefront/marketplace';

function xmlEscape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function buildMarketplaceSitemap(stores: StoreRow[], products: ProductRow[], origin: string): string {
  const urls: string[] = [`${origin}/market`, `${origin}/market/stores`];
  for (const s of stores) urls.push(`${origin}/store/${s.slug}`);
  for (const p of products) urls.push(`${origin}${p.product_path}`);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const u of urls) {
    xml += `  <url><loc>${xmlEscape(u)}</loc></url>\n`;
  }
  xml += '</urlset>\n';
  return xml;
}

interface Env {
  MARKET_DB: D1Database;
  AI?: AiBinding;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const origin = new URL(ctx.request.url).origin;
  const [stores, products] = await Promise.all([
    realListStores(ctx.env.MARKET_DB, { limit: 5000 }),
    realListNew(ctx.env.MARKET_DB, { limit: 5000 }),
  ]);
  const xml = buildMarketplaceSitemap(stores.items, products.items, origin);
  return new Response(xml, {
    status: 200,
    headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' },
  });
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/storefront/market-sitemap.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add functions/marketplace-sitemap.ts src/storefront/market-sitemap.test.ts
git commit -m "feat(market): /marketplace-sitemap.xml for listed stores + products"
```

---

## Task 15: Report link + moderation note on market pages

**Files:**
- Modify: `src/storefront/marketplace.ts` (add `renderMarketFooter`, call it in home/search/stores/category bodies)
- Test: `src/storefront/marketplace.test.ts` (append)

> Marketplace only surfaces `listed=1` (already moderated at publish time per the moderation design). The market footer adds a "Report" link to the existing `abuse@photozseo.com` channel (same address the storefront footer uses), reinforcing the kill-switch path.

- [ ] **Step 1: Write the failing test** — append:

```ts
import { renderMarketFooter } from './marketplace';

describe('renderMarketFooter', () => {
  const html = renderMarketFooter('en');
  it('has a report mailto to abuse@photozseo.com', () => {
    expect(html).toContain('mailto:abuse@photozseo.com');
    expect(html).toContain('Report');
  });
  it('repeats the trust badge', () => {
    expect(html).toContain('Independent sellers · bank transfer · no fake reviews');
  });
});

describe('renderMarketHome includes footer', () => {
  it('home body contains the report link', () => {
    const html = renderMarketHome({ products: [], stores: [], categories: [], locale: 'en' });
    expect(html).toContain('mailto:abuse@photozseo.com');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storefront/marketplace.test.ts`
Expected: FAIL — `renderMarketFooter is not a function` / home has no report link.

- [ ] **Step 3: Write minimal implementation**

In `src/storefront/marketplace.ts`, add:

```ts
/** Footer: trust badge (repeat) + report link to the moderation/kill-switch channel. */
export function renderMarketFooter(locale: string): string {
  const reportHref = `mailto:abuse@photozseo.com?subject=${encodeURIComponent('Report marketplace listing')}`;
  let html = '<footer class="mk-footer">\n';
  html += `  <p class="mk-trust">${escapeHtml(mt(locale, 'trustBadge'))}</p>\n`;
  html += `  <a class="mk-footer__report" href="${escapeAttr(reportHref)}">${escapeHtml(mt(locale, 'report'))}</a>\n`;
  html += '</footer>\n';
  return html;
}
```

Then in `renderMarketHome`, `renderSearchPage`, `renderStoresPage`, `renderCategoryPage`, replace the single trailing trust-badge line `<p class="mk-trust">…</p>\n` with `renderMarketFooter(locale)`. For `renderMarketHome` specifically, replace:

```ts
  html += renderTrustBadge(locale);
  html += '</div>\n';
```

with:

```ts
  html += renderMarketFooter(locale);
  html += '</div>\n';
```

(`renderTrustBadge` stays defined and may remain used elsewhere; the footer now carries the badge + report link.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/storefront/marketplace.test.ts src/storefront/market-router.test.ts`
Expected: PASS for both (router tests still find the trust badge text via the footer).

- [ ] **Step 5: Commit**

```bash
git add src/storefront/marketplace.ts src/storefront/marketplace.test.ts
git commit -m "feat(market): market footer with report link (kill-switch channel) on all surfaces"
```

---

## Task 16: Full suite + typecheck + build verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full unit suite**

Run: `npm test`
Expected: PASS — all storefront + marketplace test files green, no regressions in `render.test.ts` / `document.test.ts`.

- [ ] **Step 2: Typecheck the new TypeScript**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: No errors. If `functions/**` is excluded from the Astro tsconfig, run a targeted check instead:
`npx tsc --noEmit --strict --moduleResolution bundler --target es2022 --lib es2022,dom functions/market/[[path]].ts functions/marketplace-sitemap.ts src/storefront/marketplace.ts src/storefront/marketplace-i18n.ts`
Expected: No errors (the P1 `functions/_lib/marketplace.ts` must already exist for the imports to resolve).

- [ ] **Step 3: Production build (no broken imports)**

Run: `npm run build`
Expected: Astro build succeeds (the new files are Functions/public assets, not Astro pages, so they don't break the static build).

- [ ] **Step 4: Local edge smoke (optional, manual)**

Run: `npm run pages:dev` (note: this needs a local D1 binding `DB`; if P1 didn't add it to `wrangler.toml`, add `--d1 DB=<local-db>` or skip — the unit tests already cover routing/render).
Expected: `GET /market` returns HTML containing "New products" and the trust badge.

- [ ] **Step 5: Commit (verification marker / any lint fixes)**

```bash
git add -A
git commit -m "test(market): full suite + typecheck + build green for P2 web discovery"
```

---

## Self-Review

**Spec coverage check:**

- Keşif yüzeyleri `/market`, `/market/search`, `/market/stores`, `/market/c/<id>` → Tasks 5, 6, 7, 12. ✅
- Hibrit ana sayfa (arama + chip + Yeni Ürünler 2/4-5 grid + Mağazalar şeridi + boş Featured slot) → Task 5 + Task 8 CSS grid breakpoints + `mk-featured` hidden slot. ✅
- Faceted arama (kategori/fiyat/şehir/stok, mobil bottom sheet, sort new/price↑↓) → Task 6 + Task 8 (`@media max-width:699px` sheet) + Task 10 toggle. ✅
- Sepet (localStorage mağaza-bazlı, vanilla JS) + Sepete Ekle + Sepeti Gönder form (ad/telefon/adres/not, client-side doğrulama) + WhatsApp prefilled + IBAN/ibanName + SP-XXXXX → Tasks 9, 11. ✅
- i18n 12 dil statik UI + arama kartları ziyaretçi dili (router passes `lang` to `searchProducts`) → Tasks 1, 12. ✅
- SEO sitemap + ItemList/Product/Store JSON-LD + hreflang 12+x-default + canonical → Tasks 7, 12 (alternates/canonical), 14 (sitemap). Note: per-product Product JSON-LD already on storefront product page (existing `buildProductJsonLd`); marketplace uses ItemList + StoreDirectory. ✅
- Perf/2027: zero-JS-first edge HTML (renderDocument), hover-prefetch + View Transitions (Task 10), lazy AVIF/WebP img (`loading="lazy"` Task 3; image_url carries the responsive variant from Drive), calm aesthetic + dark/light + a11y focus + reduced-motion (Task 8), zero ads/popup/cookie-wall/login-gate (no such code added anywhere), trust badge (Tasks 5/15). ✅
- Moderasyon: only `listed=1` (enforced by P1 lib queries), report link → kill-switch channel (Task 15). ✅
- P1 contract used verbatim: `searchProducts/listNewProducts/listStores` + `ProductRow/StoreRow/Facets`, bindings `DB`/`AI`/`STORE_KV` → Task 12, 14 imports + Shared Contract section. ✅

**Type consistency:** `ProductRow`/`StoreRow`/`Facets` mirrored once in `marketplace.ts` and re-imported by router + sitemap; `SearchQuery` defined in Task 6 and consumed in Task 12; `MarketDeps.searchProducts` typed as `typeof realSearch` to stay pinned to the P1 signature. `renderMarketFooter` used by all four body renderers (Task 15). No drift.

**Placeholder scan:** No TBD/TODO/"similar to"; every code step shows full code.

**Open dependency note:** This plan assumes P1 added the `DB` binding to `wrangler.toml` and the `pages:dev` script (Task 16 Step 4 flags the fallback). The cart relies on the manifest carrying `payment.iban`/`payment.ibanName`/`contact.whatsapp` (P1/iOS builder contract); Task 11 reads them defensively and degrades gracefully if absent.
