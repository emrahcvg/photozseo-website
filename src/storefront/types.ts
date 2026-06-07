export type Localized = Record<string, string>;

export interface SocialLink {
  type: string; // instagram | telegram | whatsapp | website | other
  value: string;
}

export interface StoreContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  social?: SocialLink[];
}

export interface StoreLocation {
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

export interface StoreInfo {
  slug: string;
  displayName: string;
  logo?: string;
  tagline?: Localized;
  location?: StoreLocation;
  contact: StoreContact;
  languages: string[];
  currency: string;
  // Marketplace (P3 iOS tarafından yazılır — geriye uyumlu, opsiyonel).
  marketplaceListed?: boolean;
  payment?: {
    iban?: string;
    ibanName?: string;
    swift?: string;
    bankName?: string;
    currencyCode?: string;
  };
}

export interface Category {
  id: string;
  name: Localized;
}

export interface Product {
  id: string;
  categoryId?: string;
  title: Localized;
  description?: Localized;
  price?: number;
  compareAtPrice?: number;
  currency?: string;
  sku?: string;
  inStock?: boolean;
  stockQty?: number;
  images: string[];
  slug?: string;
  tags?: string[];
  attributes?: {
    color?: Localized;
    size?: Localized;
    material?: Localized;
    gender?: Localized;
    ageGroup?: Localized;
    warrantyMonths?: number;
    countryOfOrigin?: string;
    barcode?: string;
  };
  shipping?: {
    weightGrams?: number;
    lengthCM?: number;
    widthCM?: number;
    heightCM?: number;
  };
  // ── Otomotiv (3-katman taksonomi, katman 2+3) ──────────────────────────────
  // photoZseo app publish ederken yazar; web salt-render (A2: etiket gömülü).
  /** automotivePartTypes.json key'i (örn. "headlight_front"). Katman 2 = part-type. */
  partTypeKey?: string;
  /** Part-type'ın çok-dilli görünen adı; senkron derdi olmasın diye manifest'e gömülür. */
  partTypeLabel?: Localized;
  /** Katman 3 = araç uyumu (make/model/yıl aralığı). Bir ürün birden çok araca uyabilir. */
  fitment?: ProductFitment[];
}

export interface ProductFitment {
  make: string;
  model: string;
  yearFrom?: number;
  yearTo?: number;
}

export interface ManifestMeta {
  version: number;
  updatedAt: string;
  // iOS publish'te yazılır; web kanonik taxonomy.json'a göre doğrular (opsiyonel/geriye uyumlu).
  taxonomyVersion?: number;
  // Write-normalize sırasında (#5 dual-write) damgalanır; göç geçmişi takibi için.
  taxonomyMigration?: {
    fromVersion?: number;
    toVersion: number;
    migratedAt: string;
    unmapped: string[];
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface Manifest {
  store: StoreInfo;
  categories: Category[];
  products: Product[];
  meta: ManifestMeta;
}
