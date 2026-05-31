import { describe, it, expect } from 'vitest';
import {
  renderStoreBody,
  renderProductBody,
  buildStoreJsonLd,
  buildProductJsonLd,
} from './render';
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

  it('gives sections anchor ids and a category nav', () => {
    expect(html).toMatch(/<section class="sf-section" id="cat-/);
    expect(html).toContain('sf-catnav__link');
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
  it('produces a Store entity with name and url', () => {
    const ld = JSON.parse(buildStoreJsonLd(manifest, 'tr', 'https://photozseo.com/store/x'));
    expect(ld['@type']).toBe('Store');
    expect(ld.name).toBe(manifest.store.displayName);
    expect(ld.url).toBe('https://photozseo.com/store/x');
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
