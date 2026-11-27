import type { PageSet } from './types';
import { PLANS, TRIAL_DAYS, usd, APP } from '../facts';

const [free, starter, pro, business] = PLANS;
const lim = (n: number | null, unl: string) => (n === null ? unl : n.toLocaleString('en-US'));

export const pricing: PageSet = {
  en: {
    title: 'photoZseo pricing 2026: a free plan plus Starter, Pro and Business subscriptions',
    desc: `photoZseo is free to download with a free plan. Paid plans: Starter ${usd(starter.monthly!)}/mo, Pro ${usd(pro.monthly!)}/mo, Business ${usd(business.monthly!)}/mo. Annual plans save 40% and include a ${TRIAL_DAYS}-day free trial.`,
    crumb: 'Pricing',
    kicker: 'Pricing · iPhone & iPad',
    h1: 'photoZseo pricing',
    answer: `**photoZseo is free to download** on the App Store and has a **free plan** (exports carry a small photoZseo watermark). Paid plans remove the watermark and raise the limits: **Starter ${usd(starter.monthly!)}/month** (${usd(starter.yearly!)}/year), **Pro ${usd(pro.monthly!)}/month** (${usd(pro.yearly!)}/year) and **Business ${usd(business.monthly!)}/month** (${usd(business.yearly!)}/year). Annual plans cost 40% less than paying monthly and start with a **${TRIAL_DAYS}-day free trial**.`,
    facts: [
      { k: 'Download', v: 'Free on the App Store' },
      { k: 'Free plan', v: 'Yes, watermarked exports' },
      { k: 'Paid plans from', v: `${usd(starter.monthly!)}/month` },
      { k: 'Free trial', v: `${TRIAL_DAYS} days (annual plans)` },
    ],
    sections: [
      {
        id: 'compare',
        h2: 'Plan comparison',
        table: {
          caption: 'Prices in USD. The App Store shows the local price for your country.',
          head: ['', 'Free', 'Starter', 'Pro', 'Business'],
          rows: [
            ['Monthly price', '$0', `${usd(starter.monthly!)}`, `${usd(pro.monthly!)}`, `${usd(business.monthly!)}`],
            ['Annual price', '$0', `${usd(starter.yearly!)}`, `${usd(pro.yearly!)}`, `${usd(business.yearly!)}`],
            ['Photo imports from Photos / Files per month', lim(free.monthlyImports, ''), lim(starter.monthlyImports, ''), lim(pro.monthlyImports, ''), 'Unlimited'],
            ['Active marketplace platforms', String(free.activePlatforms), String(starter.activePlatforms), 'All', 'All'],
            ['Watermark on exports', 'Yes', 'No', 'No', 'No'],
            ['All image sizes and formats (JPEG, PNG, WebP)', '✓', '✓', '✓', '✓'],
            ['Template camera (7 angles)', '✓', '✓', '✓', '✓'],
            ['Batch export & sharing', '—', '✓', '✓', '✓'],
            ['Video recording', '—', '✓', '✓', '✓'],
            ['AI alt text', '—', '—', '✓', '✓'],
            ['AI background removal', '—', '—', '100 / month', 'Unlimited'],
            ['Shopify integration (direct product push)', '—', '—', '—', '✓'],
            ['B2B quote builder (PDF)', '—', '—', '—', '✓'],
            ['Create a team (up to 3 members)', '—', '—', '—', '✓'],
          ],
        },
        note: 'Photos taken with the in-app camera do not count toward the monthly import limit. Joining an existing team with an invite code is free on every plan.',
      },
      {
        id: 'which',
        h2: 'Which plan should I choose?',
        bullets: [
          '**Free** — try the full workflow: shoot with the template camera, resize for up to 5 marketplaces and export in every format. Exports carry a watermark.',
          `**Starter (${usd(starter.monthly!)}/mo)** — for sellers who list a few products a week: no watermark, batch export, video, 100 imports a month and 15 platforms.`,
          `**Pro (${usd(pro.monthly!)}/mo)** — for sellers on several marketplaces: every platform, AI alt text and 100 AI background removals a month.`,
          `**Business (${usd(business.monthly!)}/mo)** — for brands, wholesalers and teams: unlimited imports and background removal, Shopify product push, branded B2B PDF quotes and a shared team.`,
        ],
      },
      {
        id: 'billing',
        h2: 'Billing, trial and cancellation',
        bullets: [
          `The ${TRIAL_DAYS}-day free trial applies to annual plans. Apple decides eligibility; the App Store shows it before you confirm.`,
          'Subscriptions are billed by Apple and renew automatically unless cancelled at least 24 hours before the period ends.',
          'Cancel any time in iPhone **Settings → [your name] → Subscriptions**. Your plan stays active until the end of the paid period.',
          'One subscription covers the app on your iPhone and iPad with the same Apple Account.',
          'Refunds are handled by Apple at [reportaproblem.apple.com](https://reportaproblem.apple.com).',
        ],
      },
    ],
    faqTitle: 'Pricing FAQ',
    faq: [
      { q: 'Is photoZseo free?', a: `Yes. photoZseo is free to download and has a free plan with watermarked exports, 3 photo imports a month and up to 5 active platforms. Paid plans start at ${usd(starter.monthly!)} a month.` },
      { q: 'How much does photoZseo Pro cost?', a: `Pro costs ${usd(pro.monthly!)} per month or ${usd(pro.yearly!)} per year in the US. The annual plan includes a ${TRIAL_DAYS}-day free trial.` },
      { q: 'Is there a free trial?', a: `Yes, the annual Starter, Pro and Business plans start with a ${TRIAL_DAYS}-day free trial for eligible Apple Accounts.` },
      { q: 'Do prices differ by country?', a: 'Yes. The prices on this page are in US dollars. The App Store converts them to local prices, including tax, for each country.' },
      { q: 'Is there an Android or Mac version?', a: 'Not yet. photoZseo is currently available for iPhone and iPad only. A separate photoZseo extension is available for Google Chrome on desktop.' },
    ],
    related: [
      { label: 'Download for iPhone & iPad', href: '/download' },
      { label: 'Marketplace image sizes', href: '/marketplace-image-sizes' },
      { label: 'photoZseo alternatives', href: '/alternatives' },
    ],
    relatedTitle: 'Related',
    cta: { h: 'Start free on iPhone or iPad', p: 'Download photoZseo, try the free plan and upgrade only when you need more.', btn: 'Download on the App Store' },
    updatedLabel: 'Prices checked',
  },
  tr: {
    title: 'photoZseo Fiyatları 2026: Ücretsiz, Starter, Pro ve Business planları',
    desc: `photoZseo ücretsiz indirilir ve ücretsiz planı vardır. Ücretli planlar: Starter ${usd(starter.monthly!)}/ay, Pro ${usd(pro.monthly!)}/ay, Business ${usd(business.monthly!)}/ay. Yıllık planlar %40 daha ucuzdur ve ${TRIAL_DAYS} gün ücretsiz deneme içerir.`,
    crumb: 'Fiyatlar',
    kicker: 'Fiyatlar · iPhone ve iPad',
    h1: 'photoZseo fiyatları',
    answer: `**photoZseo App Store'dan ücretsiz indirilir** ve **ücretsiz planı** vardır (dışa aktarılan görsellerde küçük bir photoZseo filigranı olur). Ücretli planlar filigranı kaldırır ve limitleri yükseltir: **Starter ayda ${usd(starter.monthly!)}** (yıllık ${usd(starter.yearly!)}), **Pro ayda ${usd(pro.monthly!)}** (yıllık ${usd(pro.yearly!)}) ve **Business ayda ${usd(business.monthly!)}** (yıllık ${usd(business.yearly!)}). Yıllık planlar aylık ödemeye göre %40 daha ucuzdur ve **${TRIAL_DAYS} gün ücretsiz deneme** ile başlar.`,
    facts: [
      { k: 'İndirme', v: "App Store'da ücretsiz" },
      { k: 'Ücretsiz plan', v: 'Var, filigranlı dışa aktarma' },
      { k: 'Ücretli planlar', v: `Aylık ${usd(starter.monthly!)}'dan başlar` },
      { k: 'Ücretsiz deneme', v: `${TRIAL_DAYS} gün (yıllık planlar)` },
    ],
    sections: [
      {
        id: 'compare',
        h2: 'Plan karşılaştırması',
        table: {
          caption: "Fiyatlar ABD doları cinsindendir. App Store, ülkene göre yerel fiyatı gösterir.",
          head: ['', 'Ücretsiz', 'Starter', 'Pro', 'Business'],
          rows: [
            ['Aylık fiyat', '$0', `${usd(starter.monthly!)}`, `${usd(pro.monthly!)}`, `${usd(business.monthly!)}`],
            ['Yıllık fiyat', '$0', `${usd(starter.yearly!)}`, `${usd(pro.yearly!)}`, `${usd(business.yearly!)}`],
            ["Fotoğraflar / Dosyalar'dan aylık içe aktarma", '3', '100', '1.000', 'Sınırsız'],
            ['Aktif pazaryeri platformu', String(free.activePlatforms), String(starter.activePlatforms), 'Tümü', 'Tümü'],
            ['Dışa aktarmada filigran', 'Var', 'Yok', 'Yok', 'Yok'],
            ['Tüm görsel boyutları ve formatlar (JPEG, PNG, WebP)', '✓', '✓', '✓', '✓'],
            ['Şablonlu kamera (7 açı)', '✓', '✓', '✓', '✓'],
            ['Toplu dışa aktarma ve paylaşma', '—', '✓', '✓', '✓'],
            ['Video kaydı', '—', '✓', '✓', '✓'],
            ['Yapay zekâ alt metni', '—', '—', '✓', '✓'],
            ['Yapay zekâ arka plan kaldırma', '—', '—', 'Ayda 100', 'Sınırsız'],
            ['Shopify entegrasyonu (doğrudan ürün gönderme)', '—', '—', '—', '✓'],
            ['B2B teklif oluşturucu (PDF)', '—', '—', '—', '✓'],
            ['Ekip kurma (en fazla 3 üye)', '—', '—', '—', '✓'],
          ],
        },
        note: 'Uygulama içi kamerayla çekilen fotoğraflar aylık içe aktarma limitine sayılmaz. Davet koduyla mevcut bir ekibe katılmak her planda ücretsizdir.',
      },
      {
        id: 'which',
        h2: 'Hangi planı seçmeliyim?',
        bullets: [
          '**Ücretsiz:** Tüm akışı dene. Şablonlu kamerayla çek, en fazla 5 pazaryerine göre boyutlandır ve her formatta dışa aktar. Dışa aktarılan görsellerde filigran olur.',
          `**Starter (${usd(starter.monthly!)}/ay):** Haftada birkaç ürün listeleyen satıcılar için. Filigran yok, toplu dışa aktarma, video, ayda 100 içe aktarma ve 15 platform.`,
          `**Pro (${usd(pro.monthly!)}/ay):** Birden fazla pazaryerinde satanlar için. Tüm platformlar, yapay zekâ alt metni ve ayda 100 yapay zekâ arka plan kaldırma.`,
          `**Business (${usd(business.monthly!)}/ay):** Markalar, toptancılar ve ekipler için. Sınırsız içe aktarma ve arka plan kaldırma, Shopify'a ürün gönderme, markalı B2B PDF teklifleri ve ortak ekip.`,
        ],
      },
      {
        id: 'billing',
        h2: 'Ödeme, deneme ve iptal',
        bullets: [
          `${TRIAL_DAYS} günlük ücretsiz deneme yıllık planlarda geçerlidir. Uygunluğa Apple karar verir; onaylamadan önce App Store'da görünür.`,
          'Abonelikler Apple üzerinden faturalanır ve dönem bitiminden en az 24 saat önce iptal edilmezse otomatik yenilenir.',
          "İstediğin zaman iPhone'da **Ayarlar → [adın] → Abonelikler** bölümünden iptal edebilirsin. Planın ödenen dönemin sonuna kadar açık kalır.",
          'Tek abonelik, aynı Apple Hesabı ile iPhone ve iPad\'de geçerlidir.',
          'İadeleri Apple yönetir: [reportaproblem.apple.com](https://reportaproblem.apple.com).',
        ],
      },
    ],
    faqTitle: 'Fiyatlarla ilgili sorular',
    faq: [
      { q: 'photoZseo ücretsiz mi?', a: `Evet. photoZseo ücretsiz indirilir. Ücretsiz planda dışa aktarmalar filigranlıdır, ayda 3 fotoğraf içe aktarılabilir ve en fazla 5 platform açık olur. Ücretli planlar ayda ${usd(starter.monthly!)}'dan başlar.` },
      { q: 'photoZseo Pro ne kadar?', a: `Pro, ABD'de aylık ${usd(pro.monthly!)} veya yıllık ${usd(pro.yearly!)}. Yıllık plan ${TRIAL_DAYS} gün ücretsiz deneme içerir.` },
      { q: 'Ücretsiz deneme var mı?', a: `Evet. Yıllık Starter, Pro ve Business planları uygun Apple Hesapları için ${TRIAL_DAYS} gün ücretsiz denemeyle başlar.` },
      { q: 'Türkiye\'de fiyat ne kadar?', a: 'Bu sayfadaki fiyatlar ABD dolarıdır. App Store, her ülke için vergiler dahil yerel fiyatı otomatik gösterir; Türkiye fiyatını satın almadan önce App Store\'da görürsün.' },
      { q: 'Android veya Mac sürümü var mı?', a: 'Henüz yok. photoZseo şu an yalnızca iPhone ve iPad için. Masaüstünde Google Chrome için ayrı bir photoZseo eklentisi var.' },
    ],
    related: [
      { label: 'iPhone ve iPad için indir', href: '/tr/download' },
      { label: 'Pazaryeri görsel ölçüleri', href: '/tr/marketplace-image-sizes' },
      { label: 'photoZseo alternatifleri', href: '/tr/alternatives' },
    ],
    relatedTitle: 'İlgili sayfalar',
    cta: { h: "iPhone veya iPad'de ücretsiz başla", p: 'photoZseo\'yu indir, ücretsiz planı dene; daha fazlasına ihtiyaç duyduğunda yükselt.', btn: "App Store'dan indir" },
    updatedLabel: 'Fiyatların kontrol tarihi:',
  },
};

export const PRICING_APP = APP;
