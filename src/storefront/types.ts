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
  images: string[];
}

export interface ManifestMeta {
  version: number;
  updatedAt: string;
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
