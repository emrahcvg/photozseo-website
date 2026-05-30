import type { Localized, Manifest, Category, Product } from './types';

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
