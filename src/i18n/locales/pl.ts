// Polski (pl) — PLACEHOLDER: English content copied from home.ts `en`.
// Structure identical to other locales/*.ts. Translation Swarm fills real Polski text.
import type { HomeContent } from '../home';

const pl: HomeContent = {
  nav: {
    features: 'Features', pricing: 'Pricing', faq: 'FAQ',
    blog: 'Blog', support: 'Support', getApp: 'Get the App',
  },
  hero: {
    eyebrow: 'Now on iPhone · iPad · Mac',
    h1Line1Words: ['Shoot', 'once.'],
    h1Line2Words: ['Sell', 'on', '46', 'marketplaces.'],
    h1A11y: 'Shoot once. Sell on 46 marketplaces.',
    sub: 'A 7-angle AI camera, on-device SEO in 12 languages, 31 size presets up to 4K and platform-perfect exports — straight from your iPhone, iPad or Mac.',
    btnAppSmall: 'Get Early',
    btnAppBig: 'Access',
    ctaTrial: 'Get Early Access',
    ctaCard: 'Early access · No card needed',
    bullets: [
      '7-angle template camera — Front, Back, Side, Detail, Top, Label, Lifestyle',
      'AI fills 13 SEO fields in 12 languages from a single photo',
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
    sectionTitle: 'Ten reasons to switch.',
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
        sub: 'Drop in one photo. photoZseo writes title, slug, category, meta, full description, alt text, tags, keywords and barcode — search-optimized, instantly, in 12 languages.',
        bullets: [
          'On-device OCR + Vision: barcode, brand, material, color',
          'SEO title, slug, category, meta, long description, alt & long-tail keywords',
          '12 languages — locale-correct outputs, RTL aware',
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
        eyebrow: 'iCloud Sync & Trash Recovery',
        h: 'Sync everywhere. Restore anything.',
        sub: 'Every project syncs through your own iCloud Drive. Deleted items wait 30 days before purge, with safe restore across iPhone, iPad and Mac.',
        bullets: [
          'iCloud Drive sync — opt-in, last-write-wins',
          'Recently Deleted folder with safe restore',
          '30-day auto-purge with retention preset (7 / 14 / 30 / 60 days)',
          'Cross-device hard-delete propagation',
        ],
      },
      {
        eyebrow: 'Product Detail',
        h: 'Manage like a pro.',
        sub: 'One product, every channel. Photos, prices, SEO, EXIF and stories live inside a single, beautifully organized record — with a 13-color contact palette for B2B.',
        bullets: [
          'Photo carousel, media inspector, EXIF inline editor',
          'Per-product markup, MSRP, B2B price, VAT mode',
          'Quick share to Quote, Catalog or Marketplace',
        ],
      },
      {
        eyebrow: 'Bulk CSV / XLSX Import',
        h: 'Drop a catalog. Match 41 platforms.',
        sub: 'Drop a catalog file — photoZseo auto-detects 41 platform signatures and pulls product photos in parallel. Existing Shopify or Amazon catalogs are live in minutes.',
        bullets: [
          'CSV · TSV · XLSX · JSON catalog import',
          '41 platform signature auto-detect from headers',
          'Photo URL parallel download · Wi-Fi only toggle',
          'Batch ZIP export per platform',
        ],
      },
      {
        eyebrow: 'Mac + iPhone + iPad',
        h: 'Native Mac app. Universal binary.',
        sub: 'iOS 17+, iPadOS and macOS 14+ via Mac Catalyst. Keyboard shortcuts, Finder drag-drop, a 3-pane inspector and iCloud-synced projects across every device.',
        bullets: [
          '⌘N / ⌘E / ⌘F / ⌘A keyboard shortcuts',
          'Drag-and-drop from Finder · right-click context menus',
          '3-pane inspector: sidebar · grid · detail',
          'iCloud Drive sync across iPhone, iPad and Mac',
        ],
      },
      {
        eyebrow: 'Privacy First',
        h: 'No tracking. No ads. No clouds.',
        sub: "Built for sellers who don't trust the cloud. GDPR, KVKK and CCPA compliant. 12 languages including 3 RTL scripts. GPS stripped on export by default.",
        bullets: [
          'GDPR · KVKK · CCPA — no analytics, no third-party SDKs',
          'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
          'AI runs on-device — your photos never leave',
          'GPS data stripped on export · software tag preserved',
        ],
      },
      {
        eyebrow: 'Pricing',
        h: 'Free to start. Pro when ready.',
        sub: "Start free. Upgrade only when you're ready to export to every marketplace. Cancel anytime, no card for early access.",
        bullets: [
          'Free forever for capture, organize & basic export',
          'Pro adds 46 marketplace formats, AI SEO, B2B quote, bulk import',
          'Weekly $2.99 · Monthly $6.99 · Annual $39.99 (best value)',
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
    title: 'Sell faster — no watermarks, no limits.',
    sub: 'Three plans, one Pro experience. The annual plan is the best value at $3.33/month — cancel anytime in Settings.',
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
        trial: 'Just $3.33/mo · save 52%',
        featured: true,
        features: [
          '**Remove watermark** on all exports',
          '**Batch export** every photo at once',
          '**CSV + XLSX** for 46 marketplaces',
          '**7-angle template camera** + Pro Tools',
          'AI SEO auto-fill (13 fields, 12 languages)',
          'B2B quote builder (VAT, IBAN, HS, e-sign)',
          'Bulk CSV / XLSX / JSON catalog import',
          'EXIF editor & metadata pipeline (GPS stripped)',
          'iPhone, iPad & Mac universal',
          'iCloud Drive sync + Trash recovery',
        ],
        cta: 'Get Annual',
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
        a: 'All three. photoZseo is a universal app — same purchase covers iPhone, iPad and Mac (Catalyst, macOS 14+). Drag-and-drop from Finder, ⌘N/E/F/A keyboard shortcuts, right-click menus and a 3-pane inspector are first-class on iPad and Mac.',
      },
      {
        q: "What's actually in Pro?",
        a: "Everything: all 46 marketplace formats, AI SEO auto-fill (13 fields, 12 languages), B2B quote builder, 7-angle template camera, bulk CSV/XLSX import, watermark removal and iCloud sync with Trash recovery.",
      },
      {
        q: 'How many platforms is "46" exactly?',
        a: 'At launch: 46 marketplace presets (Amazon, Shopify, Etsy, eBay, Walmart, WooCommerce, Trendyol, AliExpress, Mercado Libre, Coupang, Lazada, Shopee, Temu, SHEIN, DHgate, Made-in-China, Global Sources…) plus social/messaging formats (Instagram Shopping, TikTok Shop, Pinterest, WeChat, RED, Stories). New presets ship in updates.',
      },
      {
        q: 'Will my GPS location be in the exported photos?',
        a: 'No. photoZseo strips GPS data on export by default. Other EXIF — Artist, Copyright, Software, dimensions, camera — is preserved and editable inline. You stay in control.',
      },
      {
        q: 'Is it GDPR / KVKK / CCPA compliant?',
        a: 'Yes — and the app speaks your language: English, Turkish, German, Spanish, French, Portuguese, Japanese, Korean, Chinese, Arabic, Hindi and Persian. RTL layouts for Arabic, Persian and Urdu are first-class.',
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
    note: 'Coming soon to the App Store.',
    notify: 'Notify me at launch',
  },
  footer: {
    tag: 'Sell on 46 marketplaces from one photo.',
    privacy: 'Privacy', terms: 'Terms', support: 'Support',
    accessibility: 'Accessibility', deleteAccount: 'Delete Account',
    rights: 'All rights reserved. Built for independent sellers.',
  },
};

export default pl;
