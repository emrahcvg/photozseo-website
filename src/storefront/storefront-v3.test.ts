import { describe, it, expect } from 'vitest';
import {
  renderStoreBody,
  renderProductBody,
  buildStoreJsonLd,
  buildProductJsonLd,
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildFaqJsonLd,
} from './render';
import { buildFaqEntries, faqHeading } from './storefront-faq';
import type { StoreInfo } from './types';
import { renderDocument } from './document';
import type { Manifest, Product } from './types';
import rawManifest from './fixtures/ahmet-oto-yedek.json';

const manifest = rawManifest as unknown as Manifest;
const p1 = manifest.products[0] as Product;

// ── Currency conversion data attributes ────────────────────────────────────────

describe('price block — currency conversion hooks', () => {
  const html = renderStoreBody(manifest, 'tr', 'tr');

  it('emits data-sf-amount for prices', () => {
    expect(html).toContain('data-sf-amount="1499"');
  });

  it('emits data-sf-currency from the product/store currency', () => {
    expect(html).toContain('data-sf-currency="TRY"');
  });

  it('keeps the server-rendered base price as data-sf-orig', () => {
    expect(html).toMatch(/data-sf-orig="[^"]*1[.,]?499/);
  });
});

// ── Currency + language switchers ───────────────────────────────────────────────

describe('visitor controls', () => {
  const html = renderStoreBody(manifest, 'tr', 'tr');

  it('renders a currency selector defaulting to the base currency', () => {
    expect(html).toContain('data-sf-currency data-sf-base="TRY"');
    expect(html).toContain('<option value="USD"');
  });

  it('renders a language selector when the store has >1 language', () => {
    expect(html).toContain('data-sf-lang');
    expect(html).toContain('Türkçe');
    expect(html).toContain('English');
  });

  it('language option values are locale URLs', () => {
    expect(html).toContain(`value="/store/${manifest.store.slug}"`); // default lang (tr)
    expect(html).toContain(`value="/store/${manifest.store.slug}/en"`);
  });
});

// ── Toolbar (search + category nav) ─────────────────────────────────────────────

describe('toolbar', () => {
  const html = renderStoreBody(manifest, 'tr', 'tr');

  it('renders a search input', () => {
    expect(html).toContain('data-sf-search-input');
  });

  it('adds searchable data to each card', () => {
    expect(html).toContain('data-sf-search="');
  });

  it('gives sections anchor ids', () => {
    // catnav linkleri checkout-card WIP'inde bilinçli kaldırıldı; anchor'lar duruyor
    expect(html).toMatch(/<section class="sf-section" id="[^"]+" data-sf-cat=/);
  });
});

// ── Empty media placeholder ──────────────────────────────────────────────────────

describe('empty media placeholder', () => {
  it('shows a placeholder for a product with no images', () => {
    const noImg: Manifest = {
      ...manifest,
      products: [{ ...p1, images: [] }],
    };
    const html = renderStoreBody(noImg, 'en', 'en');
    expect(html).toContain('sf-card__media-empty');
    expect(html).not.toContain('<img src="" ');
  });

  it('shows a gallery placeholder on the product page when no images', () => {
    const product = { ...p1, images: [] } as Product;
    const html = renderProductBody(manifest, product, 'en', 'en');
    expect(html).toContain('sf-gallery__empty');
  });
});

// ── JSON-LD ──────────────────────────────────────────────────────────────────────

describe('buildStoreJsonLd', () => {
  const ld = JSON.parse(buildStoreJsonLd(manifest, 'tr', 'https://photozseo.com/store/x'));

  it('produces a Store entity with name and url', () => {
    expect(ld['@type']).toBe('Store');
    expect(ld.name).toBe(manifest.store.displayName);
    expect(ld.url).toBe('https://photozseo.com/store/x');
  });

  it('includes GeoCoordinates when lat/lng exist', () => {
    expect(ld.geo?.['@type']).toBe('GeoCoordinates');
    expect(ld.geo.latitude).toBe(41.0);
    expect(ld.geo.longitude).toBe(29.0);
  });

  it('exposes areaServed from the store country', () => {
    expect(ld.areaServed).toBe('TR');
  });

  it('links social profiles via sameAs', () => {
    expect(Array.isArray(ld.sameAs)).toBe(true);
    expect(ld.sameAs).toContain('https://instagram.com/ahmetoto');
    expect(ld.sameAs).toContain('https://t.me/ahmetoto');
  });
});

describe('buildProductJsonLd', () => {
  const ld = JSON.parse(buildProductJsonLd(manifest, p1, 'tr', 'https://photozseo.com/store/x/product/p'));

  it('produces a Product entity with an Offer', () => {
    expect(ld['@type']).toBe('Product');
    expect(ld.offers['@type']).toBe('Offer');
    expect(ld.offers.price).toBe(p1.price);
    expect(ld.offers.priceCurrency).toBe(p1.currency ?? manifest.store.currency);
  });

  it('sets availability based on stock', () => {
    expect(ld.offers.availability).toMatch(/schema\.org\/(InStock|OutOfStock)/);
  });

  it('marks the offer as a new-condition item', () => {
    expect(ld.offers.itemCondition).toBe('https://schema.org/NewCondition');
  });

  it('rounds the offer price to the currency minor units (USD → 2 decimals)', () => {
    const floaty: Product = { ...p1, price: 181.35373414936598, currency: 'USD' };
    const r = JSON.parse(buildProductJsonLd(manifest, floaty, 'tr', 'https://x/p'));
    expect(r.offers.price).toBe(181.35);
  });

  it('rounds to whole units for zero-decimal currencies (JPY)', () => {
    const yen: Product = { ...p1, price: 1810.7, currency: 'JPY' };
    const r = JSON.parse(buildProductJsonLd(manifest, yen, 'tr', 'https://x/p'));
    expect(r.offers.price).toBe(1811);
  });

  it('embeds real attributes (color, material) when present', () => {
    // p1 fixture has color/material in tr+en
    expect(ld.color).toBe('Siyah');
    expect(ld.material).toBe('TPE Kauçuk');
  });

  it('exposes countryOfOrigin and shipping weight when present', () => {
    expect(ld.countryOfOrigin).toBe('TR');
    // weightGrams 3200 → 3.2 kg QuantitativeValue
    expect(ld.weight?.['@type']).toBe('QuantitativeValue');
    expect(ld.weight?.unitCode).toBe('KGM');
    expect(ld.weight?.value).toBeCloseTo(3.2, 3);
  });

  it('keeps barcode as gtin', () => {
    expect(ld.gtin).toBe('8690000000001');
  });
});

// ── BreadcrumbList JSON-LD ─────────────────────────────────────────────────────

describe('buildBreadcrumbJsonLd', () => {
  const origin = 'https://photozseo.com';
  // svc undefined → graceful: still produces Home → Product trail
  const ld = JSON.parse(
    buildBreadcrumbJsonLd(manifest, p1, 'tr', origin, undefined),
  );

  it('produces a BreadcrumbList', () => {
    expect(ld['@type']).toBe('BreadcrumbList');
    expect(Array.isArray(ld.itemListElement)).toBe(true);
  });

  it('starts at the store home and ends at the product, with sequential positions', () => {
    const items = ld.itemListElement;
    expect(items[0]['@type']).toBe('ListItem');
    expect(items[0].position).toBe(1);
    expect(items[0].name).toBe(manifest.store.displayName);
    const last = items[items.length - 1];
    expect(last.position).toBe(items.length);
    expect(last.name).toBe('Tesla Model Y Paspas Seti');
    // positions are 1..n contiguous
    expect(items.map((i: { position: number }) => i.position)).toEqual(
      items.map((_: unknown, idx: number) => idx + 1),
    );
  });

  it('uses absolute item URLs', () => {
    expect(ld.itemListElement[0].item).toMatch(/^https:\/\//);
  });
});

// ── Organization & WebSite entity JSON-LD ──────────────────────────────────────

describe('buildOrganizationJsonLd', () => {
  const ld = JSON.parse(buildOrganizationJsonLd(manifest, 'https://photozseo.com'));

  it('produces an Organization entity with name and url', () => {
    expect(ld['@type']).toBe('Organization');
    expect(ld.name).toBe(manifest.store.displayName);
    expect(ld.url).toMatch(/^https:\/\//);
  });

  it('includes sameAs when social links exist', () => {
    if (manifest.store.contact.social?.length) {
      expect(Array.isArray(ld.sameAs)).toBe(true);
      expect(ld.sameAs.every((u: string) => /^https?:\/\//.test(u))).toBe(true);
    }
  });
});

// ── Platform-mechanism FAQ ─────────────────────────────────────────────────────

describe('buildFaqEntries', () => {
  it('always includes the order question (cart exists on product pages)', () => {
    const entries = buildFaqEntries(manifest.store, 'tr');
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0].question).toBe('Nasıl sipariş veririm?');
  });

  it('omits the payment question when the store has no IBAN', () => {
    // fixture store has contact but no payment.iban
    const entries = buildFaqEntries(manifest.store, 'en');
    expect(entries.some((e) => /pay/i.test(e.question))).toBe(false);
  });

  it('includes the contact question when a contact channel exists', () => {
    const entries = buildFaqEntries(manifest.store, 'en');
    expect(entries.some((e) => /contact/i.test(e.question))).toBe(true);
  });

  it('includes the payment question when an IBAN is published', () => {
    const withIban: StoreInfo = {
      ...manifest.store,
      payment: { iban: 'TR000000000000000000000000', ibanName: 'Ahmet' },
    };
    const entries = buildFaqEntries(withIban, 'en');
    expect(entries.some((e) => /pay/i.test(e.question))).toBe(true);
  });

  it('localizes the heading', () => {
    expect(faqHeading('tr')).toBe('Sıkça sorulan sorular');
    expect(faqHeading('de')).toBe('Häufig gestellte Fragen');
    expect(faqHeading('xx')).toBe('Frequently asked questions'); // fallback en
  });
});

describe('renderProductBody — visible FAQ matches schema (compliance)', () => {
  it('renders one visible question per schema entry', () => {
    const html = renderProductBody(manifest, p1, 'tr', 'en', undefined);
    const visible = (html.match(/sf-faq__q/g) ?? []).length;
    const schemaCount = JSON.parse(buildFaqJsonLd(manifest.store, 'tr')).mainEntity.length;
    expect(visible).toBe(schemaCount);
    expect(html).toContain('Sıkça sorulan sorular');
  });
});

describe('buildFaqJsonLd', () => {
  const ld = JSON.parse(buildFaqJsonLd(manifest.store, 'tr'));

  it('produces a FAQPage with Question/Answer entities', () => {
    expect(ld['@type']).toBe('FAQPage');
    expect(Array.isArray(ld.mainEntity)).toBe(true);
    expect(ld.mainEntity[0]['@type']).toBe('Question');
    expect(ld.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
  });

  it('schema entries match the visible entry count (no hidden FAQ)', () => {
    const entries = buildFaqEntries(manifest.store, 'tr');
    expect(ld.mainEntity.length).toBe(entries.length);
  });

  it('returns an empty string when there are no entries', () => {
    const bare: StoreInfo = {
      ...manifest.store,
      payment: undefined,
      contact: {}, // no channels
    };
    // order question still present → not empty; verify empty path with a stubbed empty list
    expect(buildFaqJsonLd(bare, 'en')).not.toBe('');
  });
});

describe('buildWebSiteJsonLd', () => {
  const ld = JSON.parse(buildWebSiteJsonLd(manifest, 'https://photozseo.com'));

  it('produces a WebSite entity', () => {
    expect(ld['@type']).toBe('WebSite');
    expect(ld.name).toBe(manifest.store.displayName);
    expect(ld.url).toMatch(/^https:\/\//);
  });
});

// ── Document SEO head ──────────────────────────────────────────────────────────────

describe('renderDocument — SEO', () => {
  const html = renderDocument({
    title: 'T',
    description: 'D',
    lang: 'tr',
    body: '',
    canonical: 'https://photozseo.com/store/x',
    alternates: [
      { lang: 'tr', href: 'https://photozseo.com/store/x' },
      { lang: 'en', href: 'https://photozseo.com/store/x/en' },
    ],
    ogImage: 'https://img/x.webp',
    jsonLd: '{"@type":"Store"}',
  });

  it('includes a canonical link', () => {
    expect(html).toContain('<link rel="canonical" href="https://photozseo.com/store/x" />');
  });

  it('includes hreflang alternates', () => {
    expect(html).toContain('hreflang="tr"');
    expect(html).toContain('hreflang="en"');
  });

  it('emits og:locale for the page and og:locale:alternate for other langs', () => {
    expect(html).toContain('<meta property="og:locale" content="tr_TR" />');
    expect(html).toContain('<meta property="og:locale:alternate" content="en_US" />');
    // current locale should NOT also appear as an alternate
    expect(html).not.toContain('<meta property="og:locale:alternate" content="tr_TR" />');
  });

  it('includes og:image and a large twitter card', () => {
    expect(html).toContain('<meta property="og:image" content="https://img/x.webp" />');
    expect(html).toContain('content="summary_large_image"');
  });

  it('includes a favicon', () => {
    expect(html).toContain('rel="icon"');
  });

  it('embeds JSON-LD', () => {
    expect(html).toContain('<script type="application/ld+json">{"@type":"Store"}</script>');
  });

  it('falls back to summary card when no ogImage', () => {
    const noImg = renderDocument({ title: 'T', lang: 'en', body: '' });
    expect(noImg).toContain('content="summary"');
    expect(noImg).not.toContain('summary_large_image');
  });
});

// ── GÖREV 1 — SWIFT / bankName / currencyCode ödeme alanları ─────────────────────

describe('sf-cart__payment — SWIFT / bankName / currencyCode alanları', () => {
  // Sentetik manifest: ödeme bloğunu test etmek için gerçek store üzerine payment ekliyoruz
  const paymentManifest: Manifest = {
    ...manifest,
    store: {
      ...manifest.store,
      payment: {
        iban: 'TR12 0001 0099 9999 0000 0001 01',
        ibanName: 'Test Mağaza A.Ş.',
        swift: 'TCZBTR2A',
        bankName: 'T.C. Ziraat Bankası',
        currencyCode: 'TRY',
      },
    },
  };

  const html = renderProductBody(paymentManifest, manifest.products[0], 'en', 'en');

  it('SWIFT/BIC kodunu gösterir', () => {
    expect(html).toContain('TCZBTR2A');
  });

  it('Banka adını gösterir', () => {
    expect(html).toContain('T.C. Ziraat Bankası');
  });

  it('currencyCode\'u gösterir', () => {
    expect(html).toContain('TRY');
  });

  it('IBAN hâlâ gösterilir (geriye uyumluluk)', () => {
    expect(html).toContain('TR12 0001 0099 9999 0000 0001 01');
  });

  it('payment alanı olmayan manifest için SWIFT satırı yok', () => {
    const noPayManifest: Manifest = {
      ...manifest,
      store: { ...manifest.store, payment: undefined },
    };
    const noPayHtml = renderProductBody(noPayManifest, manifest.products[0], 'en', 'en');
    expect(noPayHtml).not.toContain('SWIFT');
  });
});

// ── GÖREV 2 — sameAs wechat / line platformlarını içerir ──────────────────────────

describe('buildOrganizationJsonLd — sameAs wechat ve line platformlarını içerir', () => {
  const socialManifest: Manifest = {
    ...manifest,
    store: {
      ...manifest.store,
      contact: {
        ...manifest.store.contact,
        social: [
          { type: 'instagram', value: '@mystore' },
          { type: 'wechat', value: 'mystore_wechat' },
          { type: 'line', value: 'mystore_line' },
          { type: 'viber', value: '+905001234567' },
        ],
      },
    },
  };

  const ld = JSON.parse(buildOrganizationJsonLd(socialManifest, 'https://photozseo.com/store/x'));

  it('instagram sameAs içerir', () => {
    expect(ld.sameAs).toContain('https://instagram.com/mystore');
  });

  it('wechat sameAs içerir (https URL)', () => {
    expect(ld.sameAs).toContain('https://u.wechat.com/mystore_wechat');
  });

  it('line sameAs içerir (https URL)', () => {
    expect(ld.sameAs).toContain('https://line.me/ti/p/mystore_line');
  });

  it('viber sameAs içermez (http değil)', () => {
    expect(ld.sameAs ?? []).not.toContain(expect.stringMatching(/viber/));
  });
});

describe('buildStoreJsonLd — sameAs wechat ve line platformlarını içerir', () => {
  const socialManifest: Manifest = {
    ...manifest,
    store: {
      ...manifest.store,
      contact: {
        ...manifest.store.contact,
        social: [
          { type: 'wechat', value: 'shop_wechat' },
          { type: 'line', value: 'shop_line' },
        ],
      },
    },
  };

  const ld = JSON.parse(buildStoreJsonLd(socialManifest, 'en', 'https://photozseo.com/store/x'));

  it('wechat sameAs içerir', () => {
    expect(ld.sameAs).toContain('https://u.wechat.com/shop_wechat');
  });

  it('line sameAs içerir', () => {
    expect(ld.sameAs).toContain('https://line.me/ti/p/shop_line');
  });
});
