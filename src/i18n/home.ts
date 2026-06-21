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
    eyebrow: 'Now on iPhone · iPad · Mac',
    h1Line1Words: ['Shoot', 'once.'],
    h1Line2Words: ['Sell', 'on', '46', 'marketplaces.'],
    h1A11y: 'Shoot once. Sell on 46 marketplaces.',
    sub: 'Shoot a product photo. photoZseo resizes, renames and SEO-fills it for 46 marketplaces in seconds — 100% on your device, works offline.',
    btnAppSmall: 'Get Early',
    btnAppBig: 'Access',
    ctaTrial: 'Get Early Access',
    ctaCard: 'Early access · No card needed',
    bullets: [
      '7-angle template camera — Front, Back, Side, Detail, Top, Label, Lifestyle',
      'AI fills 13 SEO fields in 15 languages from a single photo',
      '46 marketplaces, one tap · 100% on-device · works offline',
    ],
  },
  pain: {
    kicker: 'Why this exists',
    title: 'Selling on every marketplace is broken.',
    sub: "You're a seller, not a Photoshop technician. photoZseo gives the hours back.",
    cards: [
      {
        bad: '"Editing photos for every platform takes my whole evening."',
        goodTitle: 'AI does it in 2 seconds.',
        goodDesc: 'Saliency crop, white-balance, 31 export sizes — every platform, automatically.',
      },
      {
        bad: '"I re-type the title, tags and description for every marketplace."',
        goodTitle: 'One photo. 13 SEO fields. Filled.',
        goodDesc: 'Title, slug, meta, alt text, keywords — written by on-device AI in 12 languages.',
      },
      {
        bad: '"My B2B quotes are an embarrassing Word document."',
        goodTitle: 'Branded PDFs in 3 steps.',
        goodDesc: 'VAT, IBAN, HS codes, e-signature, amount-in-words — looks like a Fortune 500 invoice.',
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
        sub: 'A template-driven camera that walks you through the 7 angles every marketplace wants. Saliency-based auto-zoom (4×), HDR, anti-flicker and live OCR in 12 languages — every shot exported as JPEG, PNG and WebP at once.',
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
          'Pro: 100 removals/mo · Business: unlimited',
        ],
      },
      {
        eyebrow: 'Privacy First',
        h: 'No tracking. No ads. No clouds.',
        sub: "Built for sellers who don't trust the cloud. GDPR, KVKK and CCPA compliant. 15 languages including 3 RTL scripts. GPS stripped on export by default.",
        bullets: [
          'GDPR · KVKK · CCPA — no analytics, no third-party SDKs',
          'EN · TR · DE · ES · IT · FR · PT · JA · KO · ZH · AR · HI · FA · PL · UR',
          'AI runs on-device — your photos never leave',
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
      noTrackers: 'trackers · ads · clouds',
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
    note: 'On-device · 100% private · 12 languages',
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
    title: 'Designed by an indie seller.\nTested by buyers in 12 countries.',
    labels: {
      marketplaces: 'Marketplaces & channels',
      seoFields: 'SEO fields per photo',
      languages: 'Languages — 3 RTL',
      zero: 'Ads. Trackers. Data harvested.',
    },
    pills: {
      gdpr: 'GDPR', kvkk: 'KVKK', ccpa: 'CCPA',
      wcag: 'WCAG 2.1 AA', noTracking: 'No tracking, ever',
    },
  },
  pricing: {
    kicker: 'Pricing',
    title: 'Start free. Grow at your pace.',
    sub: 'Three tiers built for every stage — from solo seller to full team. Annual plans save 40%, 7-day free trial included.',
    badge: 'Most Popular',
    plans: [
      {
        name: 'Starter',
        pricePer: '$9.99/mo',
        trial: 'or $71.99/yr · save 40%',
        features: [
          '**Watermark-free** exports',
          '**Batch export** all photos at once',
          'Video recording',
          '15 platform presets',
          'SEO filenames & WebP conversion',
          '100 images / month',
        ],
        cta: 'Get Starter',
      },
      {
        name: 'Pro',
        pricePer: '$19.99/mo',
        trial: 'or $143.99/yr · save 40%',
        featured: true,
        features: [
          '**46 platform** presets',
          '**AI SEO auto-fill** — 13 fields, 15 languages',
          '**AI background removal** — 100/mo',
          '**AI alt text** generation',
          'Online store (photozseo.com)',
          'Marketplace listing push',
          'Inventory & barcode',
          '1,000 images / month',
          'iPhone, iPad & Mac universal',
          'iCloud Drive sync + Trash recovery',
        ],
        cta: 'Get Pro',
      },
      {
        name: 'Business',
        pricePer: '$49.99/mo',
        trial: 'or $359.99/yr · save 40%',
        features: [
          'Everything in Pro',
          '**Unlimited** images',
          '**Unlimited** background removal',
          '**B2B quote builder** (VAT, IBAN, HS, e-sign)',
          '**Shopify API** — direct product push',
          'Team collaboration (3 users)',
          'Priority support',
          '— Annual saves $240/yr',
        ],
        cta: 'Get Business',
      },
    ],
    note: 'Prices in USD. Local pricing in the App Store. 7-day free trial on annual plans. Subscriptions auto-renew — manage in Settings → Apple ID → Subscriptions.',
  },
  faq: {
    kicker: 'Questions',
    title: 'Everything you wanted to ask.',
    items: [
      {
        q: 'Does photoZseo work without internet?',
        a: 'Yes. Photo capture, editing, AI SEO auto-fill, EXIF and exports all run 100% on-device using Apple Foundation Models and Vision. Internet is only needed when you actively push to a remote marketplace.',
      },
      {
        q: 'Can I export to Amazon, Shopify and Etsy at the same time?',
        a: "Yes. Pick the products, pick the platforms, hit Export. photoZseo writes CSV/XLSX/JSON in each platform's exact column order, plus per-platform image sizes — separate per product or one combined file.",
      },
      {
        q: 'Is my photo or product data uploaded anywhere?',
        a: 'No. There are zero third-party analytics, zero tracking SDKs and no cloud account. The only outbound network is App Store / RevenueCat for the subscription, and optional iCloud Drive sync that stays inside your own iCloud.',
      },
      {
        q: 'Does it work on iPad and Mac, or only iPhone?',
        a: 'All three. photoZseo is a universal app — same purchase covers iPhone, iPad and Mac (Catalyst, macOS 14+). Drag-and-drop from Finder, ⌘N/E/F/A keyboard shortcuts, right-click menus and a 3-pane inspector are first-class on iPad and Mac.',
      },
      {
        q: "Which plan is right for me?",
        a: "Starter ($9.99/mo) removes watermarks and enables batch export — great for solo sellers. Pro ($19.99/mo) adds AI SEO auto-fill, AI background removal, 46 marketplaces and online store. Business ($49.99/mo) adds Shopify API, B2B quote builder and team collaboration. All annual plans include a 7-day free trial.",
      },
      {
        q: 'Can I import my existing product list?',
        a: 'Yes. CSV, TSV, XLSX, JSON and photo URLs are all supported. 41 platform import templates included with auto-detect from file headers — drop in an existing Shopify or Amazon export and photoZseo handles the rest.',
      },
    ],
  },
  finalCta: {
    h2: 'Your next sale starts with one photo.',
    p: 'Free to start. No tracking. No ads. Cancel anytime. Built for indie sellers.',
    note: 'Available on the App Store. 7-day free trial on annual plans.',
    notify: 'Get notified of updates',
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
export const homeDict = dict;
