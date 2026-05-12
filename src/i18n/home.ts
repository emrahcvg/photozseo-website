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
    h1Line1Words: ['List', 'once.'],
    h1Line2Words: ['Sell', 'on', '46+', 'marketplaces.'],
    h1A11y: 'List once. Sell on 46+ marketplaces.',
    sub: 'Studio-grade product photos, AI-written SEO, B2B quotes and platform-perfect exports — all from your iPhone. No computer. No spreadsheet. No cloud.',
    btnAppSmall: 'Download on the',
    btnAppBig: 'App Store',
    ctaTrial: '3-day free trial',
    ctaCard: 'No card · Cancel anytime',
    bullets: [
      'Pick your aspect — JPEG, PNG and WebP exported together',
      'AI fills 13 SEO fields from a single photo',
      '46+ marketplaces, one tap · 100% on-device · works offline',
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
        goodDesc: 'Background detection, crop, white-balance, export sizes — every platform, automatically.',
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
    sectionTitle: 'Ten reasons to switch.',
    sectionSub: 'Marketplaces, AI camera, SEO auto-fill, B2B quotes, Stories and more — built for indie sellers who ship every day.',
    seeInAction: 'See it in action →',
    items: [
      {
        eyebrow: '46+ Marketplaces',
        h: 'List once. Sell everywhere.',
        sub: 'One photo becomes 46+ marketplace-ready listings — sized, named and SEO-tagged for every platform.',
        bullets: [
          'Amazon · Shopify · Etsy · Walmart · eBay · Trendyol',
          'Cross-border: Temu · SHEIN · DHgate · Tmall · 1688',
          'CSV / XLSX / JSON — separate per product or combined',
        ],
      },
      {
        eyebrow: 'AI Camera · One Shot, Every Format',
        h: 'One shutter press. Every format, at once.',
        sub: 'Pick your aspect (1:1, 4:5, 9:16 or 3:4). Hit the shutter once — photoZseo writes JPEG, PNG and WebP in parallel and resizes for every marketplace. No re-shoots, no batch export.',
        bullets: [
          'One capture → JPEG + PNG + WebP, saved together',
          'Per-platform resize on export: Amazon, Shopify, Etsy, Instagram…',
          'AE Lock · WB Auto · Background detection · Auto-center subject',
          'Burst, volume-button shutter, grid + level overlay · 100% offline',
        ],
      },
      {
        eyebrow: 'AI SEO Auto-Fill',
        h: 'Auto-fill 12 fields in seconds.',
        sub: 'Drop in one photo. photoZseo writes title, slug, category, meta, full description, alt text, tags, keywords and barcode — search-optimized, instantly.',
        bullets: [
          'On-device OCR + Vision: barcode, brand, material, color',
          'SEO title, slug, category, meta, long description, alt & long-tail keywords',
          '12 languages — locale-correct outputs',
        ],
      },
      {
        eyebrow: 'B2B Quote Builder',
        h: 'Branded PDF quotes in 3 steps.',
        sub: 'Pick products, add the buyer, share. VAT, IBAN, Incoterms, HS codes and an e-signature — all on a beautifully branded PDF.',
        bullets: [
          'Per-line VAT · unit · HS code · country of origin',
          'Sender profile with logo, IBAN, Incoterms — saved once',
          'Amount-in-words, e-signature, sequential quote IDs',
        ],
      },
      {
        eyebrow: 'Stories That Sell',
        h: 'WhatsApp, Telegram & Instagram — one tap.',
        sub: 'Build a status / story queue for every contact. 9:16 for Instagram, 1:1 for WeChat, 3:4 for RED — auto-formatted.',
        bullets: [
          'Smart stickers: price, badge, discount, new-arrival',
          'Round-robin queue with 7-day cooldown per contact',
          'Share to Stories, Catalog, or save locally',
        ],
      },
      {
        eyebrow: 'Product Detail',
        h: 'Manage like a pro.',
        sub: 'One product, every channel. Photos, prices, SEO, EXIF and stories live inside a single, beautifully organized record.',
        bullets: [
          'Photo carousel, media inspector, EXIF inline editor',
          'Per-product markup, MSRP, B2B price, VAT mode',
          'Quick share to Quote, Story, Catalog or Marketplace',
        ],
      },
      {
        eyebrow: 'Pro Metadata',
        h: 'Camera-grade EXIF, every shot.',
        sub: 'EXIF, dimensions and format written for every platform. GPS stripped automatically. IPTC and Artist tags preserved.',
        bullets: [
          '9 EXIF fields editable inline (Artist, Copyright, Software…)',
          'GPS data stripped on export by default — privacy first',
          'Every shot saved in JPEG + PNG + WebP at once — no re-export, no quality loss',
        ],
      },
      {
        eyebrow: 'Universal App',
        h: 'iPhone. iPad. Mac.',
        sub: 'iOS 17+, iPadOS, and Mac Catalyst. Drag, drop, multi-select, sidebar, inspector — synced through iCloud Drive.',
        bullets: [
          'Drag & drop on iPad and Mac · multi-select export',
          'Keyboard shortcuts, right-click menus, sidebar nav',
          'iCloud Drive sync — every device, never lost',
        ],
      },
      {
        eyebrow: 'Privacy First',
        h: 'No tracking. No ads. No clouds.',
        sub: "Built for sellers who don't trust the cloud. GDPR, KVKK and CCPA compliant. 12 languages including 4 RTL scripts.",
        bullets: [
          'GDPR · KVKK · CCPA — no analytics, no third-party SDKs',
          'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
          'AI runs on-device — your photos never leave',
        ],
      },
      {
        eyebrow: 'Pricing',
        h: 'Free to start. Pro when ready.',
        sub: "Start free. Upgrade only when you're ready to export to every marketplace. Cancel anytime, no card for the trial.",
        bullets: [
          'Free forever for capture, organize & basic export',
          'Pro adds 46+ marketplace formats, AI SEO, B2B quote',
          '3-day free trial · $39.99/yr · just $3.33/mo',
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
      sub: 'marketplace formats — type the title once, every column fills.',
    },
    exif: {
      label: 'Camera-grade EXIF',
      gpsStripped: '— STRIPPED —',
    },
    langs: {
      label: '12 Languages · 3 RTL',
      sublabel: 'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
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
      languages: 'Languages — incl. RTL',
      zero: 'Ads. Trackers. Data harvested.',
    },
    pills: {
      gdpr: 'GDPR', kvkk: 'KVKK', ccpa: 'CCPA',
      wcag: 'WCAG 2.1 AA', noTracking: 'No tracking, ever',
    },
  },
  pricing: {
    kicker: 'Pricing',
    title: 'Sell faster — no watermarks, no limits.',
    sub: 'Three plans, one Pro experience. Try the annual plan free for 3 days, then $3.33/month — cancel anytime in Settings.',
    badge: 'Best value · Save 52%',
    plans: [
      {
        name: 'Weekly',
        pricePer: '$2.99/week',
        features: [
          'Full Pro access',
          'Try it for a week',
          'Cancel any time in Settings',
          '— No long-term commitment',
        ],
        cta: 'Start Weekly',
      },
      {
        name: 'Monthly',
        pricePer: '$6.99/month',
        features: [
          'Full Pro access',
          'Billed monthly, cancel anytime',
          'Same features as annual',
          '— Save 52% with annual',
        ],
        cta: 'Choose Monthly',
      },
      {
        name: 'Annual',
        pricePer: '$39.99/year',
        trial: '3-day free trial · just $3.33/mo · save 52%',
        featured: true,
        features: [
          '**Remove watermark** on all exports',
          '**Batch export** every photo at once',
          '**CSV + XLSX** for 46+ marketplaces',
          '**Video + Pro Tools** (camera studio, background removal)',
          'AI SEO auto-fill (13 fields, 12 languages)',
          'B2B quote builder (VAT, IBAN, HS, e-sign)',
          'Stories & Smart Stickers',
          'EXIF editor & metadata pipeline',
          'iPhone, iPad & Mac universal',
          'iCloud Drive sync',
        ],
        cta: 'Start 3-day free trial',
      },
    ],
    note: 'Prices in USD. Local pricing in the App Store (e.g. ₺39.99/yr in Turkey). Family Sharing supported. Subscriptions auto-renew unless cancelled at least 24h before period end — manage in Settings → Apple ID → Subscriptions.',
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
        a: 'All three. photoZseo is a universal app — same purchase covers iPhone, iPad and Mac (Catalyst). Drag & drop, multi-select, keyboard shortcuts and an inspector panel are first-class on iPad and Mac.',
      },
      {
        q: "What's actually in the 3-day free trial?",
        a: "Everything Pro. All 46+ marketplace formats, AI SEO auto-fill, B2B quote builder, Stories, EXIF tools — full access for 3 days on the annual plan. Cancel any time during the trial in Settings → Apple ID → Subscriptions and you're not charged.",
      },
      {
        q: 'How many platforms is "46+" exactly?',
        a: 'At launch: 46 marketplace presets (Amazon, Shopify, Etsy, eBay, Walmart, WooCommerce, Trendyol, AliExpress, Mercado Libre, Allegro, Temu, SHEIN, DHgate, Tmall, 1688, Made-in-China, Global Sources…) plus social/messaging formats (Instagram Shopping, TikTok Shop, Pinterest, WhatsApp, Telegram, WeChat, RED, Stories). New presets ship in updates.',
      },
      {
        q: 'Will my GPS location be in the exported photos?',
        a: 'No. photoZseo strips GPS data on export by default. Other EXIF — Artist, Copyright, Software, dimensions, camera — is preserved and editable inline. You stay in control.',
      },
      {
        q: 'Is it GDPR / KVKK / CCPA compliant?',
        a: 'Yes — and the app speaks your language: English, Turkish, German, Spanish, French, Portuguese, Japanese, Korean, Chinese, Arabic, Hindi and Persian. RTL layouts for Arabic, Urdu, Persian are first-class.',
      },
      {
        q: 'Can I import my existing product list?',
        a: 'Yes. CSV, TSV, XLSX, JSON, photo URL and bulk photo folders are all supported. 41+ platform import templates included.',
      },
    ],
  },
  finalCta: {
    h2: 'Your next sale starts with one photo.',
    p: 'Free to start. No tracking. No ads. Cancel anytime. Built for indie sellers.',
    note: 'Coming soon to the App Store.',
    notify: 'Notify me at launch',
  },
  footer: {
    tag: 'Sell on 46+ marketplaces from one photo.',
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
