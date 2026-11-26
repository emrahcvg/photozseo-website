// Tek doğru kaynak: fiyat, limit, platform ve sürüm bilgileri.
// Ana sayfa, /pricing, /download, /about, JSON-LD ve llms.txt bu değerlerle tutarlı olmalı.
// Kaynak: iOS EntitlementService.swift + SubscriptionContracts.swift + App Store Connect (26 Kas 2026).

import { APP_STORE_ID, APP_STORE_URL } from './meta';

export const FACTS_UPDATED = '2026-11-26';

export const APP = {
  name: 'photoZseo',
  storeName: 'photoZseo: SEO Product Photo',
  appStoreId: APP_STORE_ID,
  appStoreUrl: APP_STORE_URL,
  devices: 'iPhone & iPad',
  minOS: 'iOS 17.0 / iPadOS 17.0',
  category: 'Business',
  launchYear: 2026,
  supportEmail: 'support@photozseo.com',
  contactEmail: 'hello@photozseo.com',
  site: 'https://photozseo.com',
  marketplaces: 46,
  exportTargets: '60+',
  csvFormats: 49,
  seoFields: 13,
  languages: ['en', 'tr', 'de', 'es', 'fr', 'it', 'pt', 'pl', 'ja', 'ko', 'zh', 'ar', 'hi', 'fa', 'ur'] as const,
  languageNames: 'English, Turkish, German, Spanish, French, Italian, Portuguese, Polish, Japanese, Korean, Chinese, Arabic, Hindi, Persian, Urdu',
};

export type PlanId = 'free' | 'starter' | 'pro' | 'business';

export interface Plan {
  id: PlanId;
  name: string;
  monthly: number | null;
  yearly: number | null;
  monthlyImports: number | null; // null = sınırsız
  activePlatforms: number | null;
  bgRemovals: number | null | 0;
  watermark: boolean;
}

export const PLANS: Plan[] = [
  { id: 'free', name: 'Free', monthly: 0, yearly: 0, monthlyImports: 3, activePlatforms: 5, bgRemovals: 0, watermark: true },
  { id: 'starter', name: 'Starter', monthly: 9.99, yearly: 71.99, monthlyImports: 100, activePlatforms: 15, bgRemovals: 0, watermark: false },
  { id: 'pro', name: 'Pro', monthly: 19.99, yearly: 143.99, monthlyImports: 1000, activePlatforms: null, bgRemovals: 100, watermark: false },
  { id: 'business', name: 'Business', monthly: 49.99, yearly: 359.99, monthlyImports: null, activePlatforms: null, bgRemovals: null, watermark: false },
];

export const TRIAL_DAYS = 7; // yalnız yıllık planlarda

export const usd = (n: number) => `$${n.toFixed(2)}`;

export function offersJsonLd() {
  const out: Record<string, unknown>[] = [
    { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD', url: APP_STORE_URL || undefined },
  ];
  for (const p of PLANS.filter((p) => p.id !== 'free')) {
    out.push({
      '@type': 'Offer', name: `${p.name} Monthly`, price: String(p.monthly), priceCurrency: 'USD',
      priceSpecification: { '@type': 'UnitPriceSpecification', price: String(p.monthly), priceCurrency: 'USD', billingDuration: 'P1M' },
    });
    out.push({
      '@type': 'Offer', name: `${p.name} Yearly`, price: String(p.yearly), priceCurrency: 'USD',
      priceSpecification: { '@type': 'UnitPriceSpecification', price: String(p.yearly), priceCurrency: 'USD', billingDuration: 'P1Y' },
    });
  }
  return out;
}

export function appJsonLd(pageUrl: string, description: string, featureList?: string[]) {
  return {
    '@type': 'MobileApplication',
    '@id': 'https://photozseo.com/#app',
    name: APP.name,
    alternateName: APP.storeName,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'E-commerce product photo & listing tool',
    operatingSystem: 'iOS 17.0+, iPadOS 17.0+',
    softwareRequirements: 'Requires iOS 17.0 or later (iPhone) or iPadOS 17.0 or later (iPad). Apple Intelligence text generation requires iOS 26 on a supported device.',
    description,
    url: pageUrl,
    ...(APP_STORE_URL ? { downloadUrl: APP_STORE_URL, installUrl: APP_STORE_URL, sameAs: [APP_STORE_URL] } : {}),
    image: 'https://photozseo.com/icon-512.png',
    inLanguage: [...APP.languages],
    isAccessibleForFree: true,
    ...(featureList ? { featureList } : {}),
    offers: offersJsonLd(),
    publisher: { '@id': 'https://photozseo.com/#org' },
    dateModified: FACTS_UPDATED,
  };
}

export const ORG_JSONLD = {
  '@type': 'Organization',
  '@id': 'https://photozseo.com/#org',
  name: 'photoZseo',
  url: 'https://photozseo.com',
  logo: 'https://photozseo.com/icon-512.png',
  email: 'support@photozseo.com',
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'customer support', email: 'support@photozseo.com', availableLanguage: ['English', 'Turkish'] },
  ],
  ...(APP_STORE_URL ? { sameAs: [APP_STORE_URL] } : {}),
};

export const WEBSITE_JSONLD = {
  '@type': 'WebSite',
  '@id': 'https://photozseo.com/#website',
  name: 'photoZseo',
  url: 'https://photozseo.com',
  publisher: { '@id': 'https://photozseo.com/#org' },
  inLanguage: [...APP.languages],
};
