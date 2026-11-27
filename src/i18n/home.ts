import type { Lang } from './ui';

export interface HomeContent {
  nav: { features: string; pricing: string; faq: string; blog: string; support: string; getApp: string };
  hero: {
    eyebrow: string;
    h1Line1Words: string[];
    h1Line2Words: string[];
    h1A11y: string;
    sub: string;
    btnAppSmall: string;
    btnAppBig: string;
    ctaTrial: string;
    ctaCard: string;
    bullets: [string, string, string];
  };
  pain: {
    kicker: string;
    title: string;
    sub: string;
    cards: Array<{ bad: string; goodTitle: string; goodDesc: string }>;
  };
  features: {
    sectionKicker: string;
    sectionTitle: string;
    sectionSub: string;
    seeInAction: string;
    items: Array<{ eyebrow: string; h: string; sub: string; bullets: string[] }>;
  };
  bento: {
    headKicker: string;
    headTitle: string;
    headSub: string;
    csv: { label: string; sub: string };
    exif: { label: string; gpsStripped: string };
    langs: { label: string; sublabel: string };
    stats: {
      label: string;
      marketplaces: string;
      seoFields: string;
      devices: string;
      noTrackers: string;
    };
  };
  seoDemo: {
    kicker: string;
    title: string;
    sub: string;
    inputLabel: string;
    inputPlaceholder: string;
    btnIdle: string;
    btnBusy: string;
    note: string;
    copyHint?: string;
    copiedToast?: string;
    fieldLabels: {
      title: string;
      slug: string;
      filename: string;
      category: string;
      meta: string;
      description: string;
      alt: string;
      tag1: string;
      tag2: string;
      tag3: string;
      tag4: string;
      keywords: string;
      barcode: string;
    };
  };
  stats: {
    kicker: string;
    title: string;
    labels: { marketplaces: string; seoFields: string; languages: string; zero: string };
    pills: { gdpr: string; kvkk: string; ccpa: string; wcag: string; noTracking: string };
  };
  pricing: {
    kicker: string;
    title: string;
    sub: string;
    badge: string;
    plans: Array<{
      name: string;
      pricePer: string;
      trial?: string;
      featured?: boolean;
      features: string[];
      cta: string;
    }>;
    note: string;
    compareLink?: string;
  };
  faq: {
    kicker: string;
    title: string;
    items: Array<{ q: string; a: string }>;
  };
  finalCta: {
    h2: string;
    p: string;
    note: string;
    notify: string;
  };
  footer: {
    tag: string;
    privacy: string;
    terms: string;
    support: string;
    accessibility: string;
    deleteAccount: string;
    rights: string;
  };
}

const en: HomeContent = {
  nav: {
    features: 'Features', pricing: 'Pricing', faq: 'FAQ',
    blog: 'Blog', support: 'Support', getApp: 'Get the App',
  },
  hero: {
    eyebrow: 'Now on the App Store · iPhone & iPad',
    h1Line1Words: ['Shoot', 'once.'],
    h1Line2Words: ['Sell', 'on', '46', 'marketplaces.'],
    h1A11y: 'Shoot once. Sell on 46 marketplaces.',
    sub: 'Shoot a product photo. photoZseo resizes, renames and SEO-fills it for 46 marketplaces in seconds — processed on your device, works offline.',
    btnAppSmall: 'Download on the',
    btnAppBig: 'App Store',
    ctaTrial: 'Free to download',
    ctaCard: 'Free plan · 7-day trial on annual plans',
    bullets: [
      '7-angle template camera — Front, Back, Side, Detail, Top, Label, Lifestyle',
      'Fills 13 SEO fields in 15 languages from your photo and product details',
      '46 marketplaces, one tap · photos processed on-device · works offline',
    ],
  },
  pain: {
    kicker: 'Why this exists',
    title: 'Selling on every marketplace is broken.',
    sub: "You're a seller, not a Photoshop technician. photoZseo gives the hours back.",
    cards: [
      {
        bad: '"Editing photos for every platform takes my whole evening."',
        goodTitle: 'The app does it for you.',
        goodDesc: 'Subject-aware crop, white balance and the right size for every marketplace — automatically.',
      },
      {
        bad: '"I re-type the title, tags and description for every marketplace."',
        goodTitle: 'One photo. 13 SEO fields. Filled.',
        goodDesc: 'Title, slug, meta, alt text, keywords — written on your device in 15 languages.',
      },
      {
        bad: '"My B2B quotes are an embarrassing Word document."',
        goodTitle: 'Branded PDFs in 3 steps.',
        goodDesc: 'VAT, IBAN, HS codes, e-signature, amount in words — clean, branded and ready to send.',
      },
    ],
  },
  features: {
    sectionKicker: 'Every feature, in one place',
    sectionTitle: 'Six tools. Every marketplace covered.',
    sectionSub: 'Marketplaces, 7-angle AI camera, SEO auto-fill, bulk import, B2B quotes, iCloud sync and more — built for indie sellers who ship every day.',
    seeInAction: 'See it in action →',
    items: [
      {
        eyebrow: '46 Marketplaces',
        h: 'List once. Sell everywhere.',
        sub: 'One photo becomes 46 marketplace-ready listings — sized, named and SEO-tagged for every platform.',
        bullets: [
          'Amazon · Shopify · Etsy · Walmart · eBay · Trendyol',
          'Cross-border: Temu · SHEIN · DHgate · Made-in-China · Global Sources',
          'CSV / XLSX / JSON — separate per product or combined',
        ],
      },
      {
        eyebrow: 'AI Camera · 7 Angles, One Shutter',
        h: 'Front, Back, Side, Detail, Top, Label, Lifestyle.',
        sub: 'A template-driven camera that walks you through the 7 angles every marketplace wants. Saliency-based auto-zoom (4×), HDR, anti-flicker and live text recognition — every shot exported as JPEG, PNG and WebP at once.',
        bullets: [
          '7-angle templates with direction auto-advance',
          'Smart auto-zoom (25% subject fill, max 4×) · AE Lock · WB Auto',
          'On-device Vision: saliency, classification, barcode, live OCR',
          'Volume-button shutter · 4K capture · 100% offline',
        ],
      },
      {
        eyebrow: 'AI SEO Auto-Fill',
        h: 'Auto-fill 13 fields in seconds.',
        sub: 'Drop in one photo. photoZseo writes title, slug, category, meta, full description, alt text, tags, keywords and barcode — search-optimized, instantly, in 15 languages.',
        bullets: [
          'On-device OCR + Vision: barcode, brand, material, color',
          'SEO title, slug, category, meta, long description, alt & long-tail keywords',
          '15 languages — locale-correct outputs, RTL aware',
        ],
      },
      {
        eyebrow: 'B2B Quote Builder',
        h: 'Branded PDF quotes in 3 steps.',
        sub: 'Pick products, add the buyer, share. A4 PDFs in 12 languages with VAT, IBAN, Incoterms, HS codes and an e-signature — beautifully branded.',
        bullets: [
          'Per-line VAT · unit · HS code · country of origin',
          'Sender profile with logo, IBAN, Incoterms — saved once',
          'Business card scan (Vision OCR) auto-populates buyer details',
        ],
      },
      {
        eyebrow: 'AI Background Removal',
        h: 'Clean product photos in one tap.',
        sub: 'On-device AI removes backgrounds instantly — no cloud, no subscription per photo. Export transparent PNG, white background or custom color for every platform.',
        bullets: [
          'Batch removal across all photos at once',
          'Transparent PNG · white background · custom color',
          '100% on-device — photos never leave your device',
          'Pro: 100 removals/month · Business: unlimited',
        ],
      },
      {
        eyebrow: 'Privacy First',
        h: 'No ads. No ad tracking. Photos stay on your device.',
        sub: 'Built for sellers who care about their data. Designed around GDPR, KVKK and CCPA. 15 languages including 3 right-to-left scripts. GPS stripped on export by default.',
        bullets: [
          'No ads, no advertising ID · anonymous usage analytics can be turned off',
          'EN · TR · DE · ES · IT · FR · PT · JA · KO · ZH · AR · HI · FA · PL · UR',
          'Photo processing and background removal run on-device',
          'GPS data stripped on export · software tag preserved',
        ],
      },
    ],
  },
  bento: {
    headKicker: 'More than screenshots',
    headTitle: 'Built like a power tool, priced like an app.',
    headSub: 'Every section below is a feature that ships today — no roadmap, no waitlist.',
    csv: {
      label: 'CSV · XLSX · JSON',
      sub: '46 marketplace formats — type the title once, every column fills.',
    },
    exif: {
      label: 'Camera-grade EXIF',
      gpsStripped: '— STRIPPED —',
    },
    langs: {
      label: '15 Languages · 3 RTL',
      sublabel: 'EN · TR · DE · ES · IT · FR · PT · JA · KO · ZH · AR · HI · FA · PL · UR',
    },
    stats: {
      label: 'Built for indie sellers',
      marketplaces: 'marketplaces',
      seoFields: 'SEO fields per photo',
      devices: 'devices · one app',
      noTrackers: 'ads · ad trackers',
    },
  },
  seoDemo: {
    kicker: 'Interactive · Live',
    title: 'Watch the AI fill 13 SEO fields.',
    sub: 'Pick a product. Watch photoZseo write every field your marketplace needs — title, slug, filename, category, meta, full description, alt text, tags, keywords and barcode. Tap any field to copy.',
    inputLabel: 'Product name',
    inputPlaceholder: 'Type a product name…',
    btnIdle: '✨ Auto-fill 13 SEO fields',
    btnBusy: 'Generating…',
    note: 'On-device · private · 15 languages',
    copyHint: 'Copy',
    copiedToast: 'Copied',
    fieldLabels: {
      title: 'SEO Title',
      slug: 'Slug',
      filename: 'Filename (URL)',
      category: 'Category',
      meta: 'Meta Desc',
      description: 'Description',
      alt: 'Alt Text',
      tag1: 'Tag 1',
      tag2: 'Tag 2',
      tag3: 'Tag 3',
      tag4: 'Tag 4',
      keywords: 'Keywords',
      barcode: 'Barcode',
    },
  },
  stats: {
    kicker: 'Numbers that move product',
    title: 'Designed by an indie seller.\nBuilt for sellers in 15 languages.',
    labels: {
      marketplaces: 'Marketplaces & channels',
      seoFields: 'SEO fields per photo',
      languages: 'Languages — 3 RTL',
      zero: 'Ads. Ad trackers. Data sold.',
    },
    pills: {
      gdpr: 'GDPR', kvkk: 'KVKK', ccpa: 'CCPA',
      wcag: 'WCAG 2.1 AA', noTracking: 'No ad tracking',
    },
  },
  pricing: {
    kicker: 'Pricing',
    title: 'Start free. Grow at your pace.',
    sub: 'A free plan to get started and three paid plans for every stage — from solo seller to full team. Annual plans save 40% and include a 7-day free trial.',
    badge: 'Most Popular',
    plans: [
      {
        name: 'Free',
        pricePer: '$0/mo',
        trial: 'Free forever · no card needed',
        features: [
          '**Template camera** — 7 angles',
          'All image sizes & formats (JPEG, PNG, WebP)',
          '**5 active** marketplace platforms',
          '3 photo imports / month (camera shots unlimited)',
          'iPhone & iPad · iCloud sync',
          '— Exports include a watermark',
        ],
        cta: 'Download free',
      },
      {
        name: 'Starter',
        pricePer: '$9.99/mo',
        trial: 'or $71.99/yr · save 40%',
        features: [
          '**Watermark-free** exports',
          '**Batch export** & sharing',
          'Video recording',
          '**15 active** platforms',
          'SEO filenames & WebP conversion',
          '100 photo imports / month',
        ],
        cta: 'Get Starter',
      },
      {
        name: 'Pro',
        pricePer: '$19.99/mo',
        trial: 'or $143.99/yr · save 40%',
        featured: true,
        features: [
          'Everything in Starter',
          '**All platforms** — 46 marketplaces + social',
          '**AI background removal** — 100/month',
          '**AI alt text** generation',
          '1,000 photo imports / month',
        ],
        cta: 'Get Pro',
      },
      {
        name: 'Business',
        pricePer: '$49.99/mo',
        trial: 'or $359.99/yr · save 40%',
        features: [
          'Everything in Pro',
          '**Unlimited** photo imports',
          '**Unlimited** background removal',
          '**B2B quote builder** (VAT, IBAN, HS, e-sign)',
          '**Shopify integration** — direct product push',
          'Create a team (up to 3 members)',
          '— Annual saves $240/yr',
        ],
        cta: 'Get Business',
      },
    ],
    note: 'Prices in USD; the App Store shows your local price. 7-day free trial on annual plans. Subscriptions auto-renew — cancel any time in Settings → [your name] → Subscriptions.',
    compareLink: 'Compare all plans →',
  },
  faq: {
    kicker: 'Questions',
    title: 'Everything you wanted to ask.',
    items: [
      {
        q: 'Does photoZseo work without internet?',
        a: 'Yes. Photo capture, editing, background removal, SEO auto-fill, EXIF and exports run on your device (Apple Vision; Apple Intelligence on iOS 26). Internet is only needed to publish to Shopify or your online store, to sync with iCloud, or to buy a subscription.',
      },
      {
        q: 'Can I export to Amazon, Shopify and Etsy at the same time?',
        a: "Yes. Pick the products, pick the platforms, hit Export. photoZseo writes CSV/XLSX/JSON in each platform's exact column order, plus per-platform image sizes — separate per product or one combined file.",
      },
      {
        q: 'Is my photo or product data uploaded anywhere?',
        a: 'Your photos are not uploaded for processing — they are processed on your device. photoZseo shows no ads and uses no advertising ID. Network use is limited to subscriptions (App Store / RevenueCat), optional iCloud Drive sync inside your own iCloud, optional publishing (Shopify, online store) and anonymous usage analytics that you can turn off in Settings.',
      },
      {
        q: 'Does it work on iPad, or only iPhone?',
        a: 'Both. photoZseo is a universal app — one purchase covers iPhone and iPad. Drag-and-drop, keyboard shortcuts, right-click menus and a 3-pane inspector are first-class on iPad.',
      },
      {
        q: 'Is photoZseo free?',
        a: 'Yes. photoZseo is free to download and has a free plan: the template camera, all image sizes and formats, 5 active platforms and 3 photo imports a month, with a watermark on exports. Starter ($9.99/mo) removes the watermark and adds batch export. Pro ($19.99/mo) adds all platforms, AI background removal, AI alt text and an online store. Business ($49.99/mo) adds Shopify integration, the B2B quote builder, unlimited usage and teams.',
      },
      {
        q: 'Is photoZseo available for Android or Mac?',
        a: 'Not yet — photoZseo is available for iPhone and iPad (iOS / iPadOS 17 or later). On a computer you can use the separate photoZseo extension for Google Chrome.',
      },
      {
        q: 'Can I import my existing product list?',
        a: 'Yes. CSV, TSV, XLSX, JSON and photo URLs are supported, with import templates for the major marketplaces and auto-detection from the file headers — drop in an existing Shopify or Amazon export and photoZseo maps the columns.',
      },
    ],
  },
  finalCta: {
    h2: 'Your next sale starts with one photo.',
    p: 'Free to download, with a free plan. No ads. Cancel anytime. Built for indie sellers.',
    note: 'Available now on the App Store for iPhone and iPad.',
    notify: 'App details & requirements →',
  },
  footer: {
    tag: 'Sell on 46 marketplaces from one photo.',
    privacy: 'Privacy', terms: 'Terms', support: 'Support',
    accessibility: 'Accessibility', deleteAccount: 'Delete Account',
    rights: 'All rights reserved. Built for independent sellers.',
  },
};

// Locale dictionary — populated by translation files (eager-loaded via Vite glob import).
// Each locale file in ./locales/*.ts default-exports its HomeContent object.
const localeModules = import.meta.glob<{ default: HomeContent }>('./locales/*.ts', { eager: true });
const dict: Partial<Record<Lang, HomeContent>> = { en };
for (const path in localeModules) {
  const match = path.match(/\.\/locales\/([a-z]{2})\.ts$/);
  if (match) {
    const code = match[1] as Lang;
    dict[code] = localeModules[path].default;
  }
}

export function getHomeContent(lang: Lang): HomeContent {
  return dict[lang] ?? en;
}

export { en as enHomeContent };

// Ana sayfa metni yayın sonrası güncellenen diller. Diğerlerinde fiyat bloğu İngilizceye düşer.
export const HOME_UPDATED_LANGS: Lang[] = ['en', 'tr', 'de', 'es', 'fr', 'it', 'pt', 'pl', 'ja', 'ko', 'zh', 'ar', 'hi', 'fa', 'ur'];
export const homeDict = dict;
