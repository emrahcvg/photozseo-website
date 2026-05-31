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
}

export interface ManifestMeta {
  version: number;
  updatedAt: string;
  // iOS publish'te yazılır; web kanonik taxonomy.json'a göre doğrular (opsiyonel/geriye uyumlu).
  taxonomyVersion?: number;
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
