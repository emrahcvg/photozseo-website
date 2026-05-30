import type { Localized, Manifest, Category, Product, StoreLocation } from './types';

// ── Slug helpers ────────────────────────────────────────────────────────────

const TR_MAP: Record<string, string> = {
  ç: 'c', Ç: 'c',
  ğ: 'g', Ğ: 'g',
  ı: 'i', İ: 'i',
  ö: 'o', Ö: 'o',
  ş: 's', Ş: 's',
  ü: 'u', Ü: 'u',
};

export function slugify(text: string): string {
  if (!text) return '';
  // Transliterate Turkish chars first
  let s = text.replace(/[çÇğĞıİöÖşŞüÜ]/g, (c) => TR_MAP[c] ?? c);
  // Strip remaining diacritics via NFD decomposition
  s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  // Lowercase, replace non-alphanumeric runs with dash
  s = s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return s;
}

export function productSlug(product: Product, primaryLocale: string): string {
  if (product.slug && product.slug.trim() !== '') return product.slug;
  return slugify(resolveLocalized(product.title, primaryLocale));
}

export function uniqueProductSlugs(products: Product[], primaryLocale: string): Map<string, string> {
  const map = new Map<string, string>();
  const taken = new Set<string>();
  for (const p of products) {
    const base = productSlug(p, primaryLocale);
    let candidate = base;
    let n = 2;
    while (taken.has(candidate)) {
      candidate = `${base}-${n++}`;
    }
    taken.add(candidate);
    map.set(p.id, candidate);
  }
  return map;
}

// ── Spec rows ────────────────────────────────────────────────────────────────

export function specRows(
  product: Product,
  locale: string,
): { label: string; value: string }[] {
  const a = product.attributes;
  if (!a) return [];
  const tr = locale === 'tr';
  const rows: { label: string; value: string }[] = [];

  const add = (labelTr: string, labelEn: string, value: string | undefined) => {
    if (value && value.trim() !== '') rows.push({ label: tr ? labelTr : labelEn, value });
  };

  add('Renk', 'Color', resolveLocalized(a.color, locale) || undefined);
  add('Beden', 'Size', resolveLocalized(a.size, locale) || undefined);
  add('Malzeme', 'Material', resolveLocalized(a.material, locale) || undefined);
  add('Cinsiyet', 'Gender', resolveLocalized(a.gender, locale) || undefined);
  add('Yaş grubu', 'Age group', resolveLocalized(a.ageGroup, locale) || undefined);
  if (typeof a.warrantyMonths === 'number' && a.warrantyMonths > 0) {
    rows.push({ label: tr ? 'Garanti' : 'Warranty', value: tr ? `${a.warrantyMonths} ay` : `${a.warrantyMonths} mo` });
  }
  add('Menşei', 'Origin', a.countryOfOrigin);
  add('Barkod', 'Barcode', a.barcode);

  return rows;
}

// ── Shipping text ────────────────────────────────────────────────────────────

export function formatWeight(grams: number, locale: string): string {
  if (grams >= 1000) {
    const kg = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(grams / 1000);
    return `${kg} kg`;
  }
  return `${grams} g`;
}

export function shippingText(
  shipping: Product['shipping'] | undefined,
  locale: string,
): string | null {
  if (!shipping) return null;
  const { weightGrams, lengthCM, widthCM, heightCM } = shipping;
  const hasDims = lengthCM != null && widthCM != null && heightCM != null;
  const hasWeight = weightGrams != null;
  if (!hasDims && !hasWeight) return null;
  let text = '';
  if (hasDims) text += `${lengthCM}×${widthCM}×${heightCM} cm`;
  if (hasWeight) text += `${text ? ', ' : ''}${formatWeight(weightGrams, locale)}`;
  return text || null;
}

export const FALLBACK_LOCALE = 'en';

export function resolveLocalized(
  field: Localized | undefined,
  locale: string,
  fallback: string = FALLBACK_LOCALE,
): string {
  if (!field) return '';
  return field[locale] ?? field[fallback] ?? Object.values(field)[0] ?? '';
}

export function formatPrice(
  amount: number | undefined,
  currency: string,
  locale: string,
): string | null {
  if (amount == null) return null;
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export interface CategoryGroup {
  category: Category | null;
  products: Product[];
}

export function groupProductsByCategory(manifest: Manifest): CategoryGroup[] {
  const groups: CategoryGroup[] = manifest.categories.map((c) => ({
    category: c,
    products: manifest.products.filter((p) => p.categoryId === c.id),
  }));
  const known = new Set(manifest.categories.map((c) => c.id));
  const uncategorized = manifest.products.filter((p) => !p.categoryId || !known.has(p.categoryId));
  if (uncategorized.length) groups.push({ category: null, products: uncategorized });
  return groups.filter((g) => g.products.length > 0);
}

export function resolveStoreLocale(manifest: Manifest, requested?: string): string {
  const langs = manifest.store.languages ?? [];
  if (requested && langs.includes(requested)) return requested;
  if (langs.includes(FALLBACK_LOCALE)) return FALLBACK_LOCALE;
  return langs[0] ?? FALLBACK_LOCALE;
}

export function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;
}

export function socialHref(type: string, value: string): string {
  if (/^https?:\/\//.test(value)) return value;
  const handle = value.replace(/^@/, '');
  switch (type) {
    case 'instagram':
      return `https://instagram.com/${handle}`;
    case 'telegram':
      return `https://t.me/${handle}`;
    case 'whatsapp':
      return whatsappHref(value);
    default:
      return value;
  }
}

export function stockLabel(product: Product, locale: string): string | null {
  const tr = locale === 'tr';
  if (product.inStock === false || product.stockQty === 0) return tr ? 'Tükendi' : 'Sold out';
  if (typeof product.stockQty === 'number') {
    if (product.stockQty <= 5) return tr ? `Son ${product.stockQty}!` : `Only ${product.stockQty} left!`;
    return tr ? `Stokta ${product.stockQty} adet` : `${product.stockQty} in stock`;
  }
  if (product.inStock === true) return tr ? 'Stokta var' : 'In stock';
  return null;
}

export function mapHref(location: StoreLocation | undefined): string | null {
  if (!location) return null;
  if (typeof location.lat === 'number' && typeof location.lng === 'number') {
    return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  }
  const q = [location.city, location.country].filter(Boolean).join(', ');
  if (!q) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function productWhatsappHref(phone: string, productTitle: string, locale: string): string {
  const msg = locale === 'tr'
    ? `Merhaba, "${productTitle}" ürünü hakkında bilgi almak istiyorum.`
    : `Hello, I'd like info about "${productTitle}".`;
  return `${whatsappHref(phone)}?text=${encodeURIComponent(msg)}`;
}

export function storeUrl(slug: string, locale: string, defaultLang: string): string {
  return locale === defaultLang ? `/store/${slug}` : `/store/${slug}/${locale}`;
}

export function productUrl(slug: string, productId: string, locale: string, defaultLang: string): string {
  return locale === defaultLang
    ? `/store/${slug}/product/${productId}`
    : `/store/${slug}/${locale}/product/${productId}`;
}
