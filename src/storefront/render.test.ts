import { describe, it, expect } from 'vitest';
import { escapeHtml, renderStoreBody, renderProductBody } from './render';
import type { Manifest, Product } from './types';
import rawManifest from './fixtures/ahmet-oto-yedek.json';
import { createTaxonomyService, type TaxNode } from './taxonomy/service';
import treeFix from './taxonomy/__fixtures__/tree.fixture.json';
import labelsEnFix from './taxonomy/__fixtures__/labels.en.fixture.json';

const manifest = rawManifest as unknown as Manifest;
const p1 = manifest.products[0] as Product; // tesla-model-y-paspas-seti

// ── escapeHtml ────────────────────────────────────────────────────────────────

describe('escapeHtml', () => {
  it('escapes < and >', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    expect(escapeHtml('</div>')).toBe('&lt;/div&gt;');
  });

  it('escapes double and single quotes', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
    expect(escapeHtml("it's")).toBe('it&#39;s');
  });

  it('escapes ampersand', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('leaves safe strings unchanged', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });
});

// ── renderStoreBody ───────────────────────────────────────────────────────────

describe('renderStoreBody', () => {
  const html = renderStoreBody(manifest, 'tr', 'tr');

  it('contains store displayName', () => {
    expect(html).toContain('Ahmet Oto Yedek');
  });

  it('contains a product title', () => {
    expect(html).toContain('Tesla Model Y Paspas Seti');
  });

  it('contains a price fragment "499"', () => {
    // ₺1.499,00 or similar — 499 appears in both
    expect(html).toMatch(/499/);
  });

  it('contains stock pill text', () => {
    // p1 inStock=true, stockQty=12 → "Stokta 12 adet"
    expect(html).toContain('Stokta 12 adet');
    // p2 inStock=false → "Tükendi"
    expect(html).toContain('Tükendi');
  });

  it('contains a wa.me/ link', () => {
    expect(html).toContain('wa.me/');
  });

  it('ortak app-footer (photoZseo marka + şikâyet) içerir', () => {
    expect(html).toContain('app-footer');
    expect(html).toContain('https://photozseo.com');
    expect(html).toContain('mailto:support@photozseo.com');
  });

  it('ortak app-header (marka + sepet) içerir', () => {
    expect(html).toContain('app-header');
    expect(html).toContain('app-brand');
    expect(html).toContain('/market/cart');
  });

  it('contains productUrl for p1', () => {
    expect(html).toContain('/store/ahmet-oto-yedek/product/tesla-model-y-paspas-seti');
  });

  it('ürün kartlarında favori (kalp) butonu ürün slug ile var', () => {
    expect(html).toContain('class="sf-fav"');
    expect(html).toContain('data-sf-fav="tesla-model-y-paspas-seti"');
  });

  it('storefront-buyer.js script etiketi enjekte edilir', () => {
    expect(html).toContain('/storefront-buyer.js');
  });

  it('XSS: escapes malicious displayName', () => {
    const malicious: Manifest = {
      ...manifest,
      store: {
        ...manifest.store,
        displayName: '<img src=x onerror=alert(1)>',
      },
    };
    const out = renderStoreBody(malicious, 'tr', 'tr');
    expect(out).not.toContain('<img src=x onerror');
    expect(out).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });
});

// ── renderProductBody ─────────────────────────────────────────────────────────

describe('renderProductBody', () => {
  const html = renderProductBody(manifest, p1, 'tr', 'tr');

  it('contains <h1> with product title', () => {
    expect(html).toContain('<h1');
    expect(html).toContain('Tesla Model Y Paspas Seti');
  });

  it('contains "Ürün Özellikleri" heading (tr locale)', () => {
    expect(html).toContain('Ürün Özellikleri');
  });

  it('contains spec value "Siyah" (color tr)', () => {
    expect(html).toContain('Siyah');
  });

  it('contains shipping text fragment with "kg" or "cm"', () => {
    expect(html).toMatch(/kg|cm/);
  });

  it('contains tag #tesla', () => {
    expect(html).toContain('#tesla');
  });

  it('contains sf-btn--order class with wa.me/ href', () => {
    expect(html).toContain('sf-btn--order');
    expect(html).toContain('wa.me/');
  });
});

describe('renderProductBody — buyer payment safety', () => {
  it('injects an irreversible-transfer safety notice into the payment panel', () => {
    const html = renderProductBody(manifest, p1, 'tr', 'tr');
    expect(html).toContain('sf-pay-safety');
    expect(html).toContain('geri alınamaz');
  });
  it('places the safety notice before the bank details (IBAN), if any', () => {
    const html = renderProductBody(manifest, p1, 'tr', 'tr');
    const safetyIdx = html.indexOf('sf-pay-safety');
    expect(safetyIdx).toBeGreaterThan(-1);
    const ibanIdx = html.indexOf('IBAN');
    if (ibanIdx > -1) expect(safetyIdx).toBeLessThan(ibanIdx);
  });
});

describe('renderProductBody — marketplace cart', () => {
  const html = renderProductBody(manifest, p1, 'tr', 'tr');
  it('renders a cart-add button with product data attributes', () => {
    expect(html).toContain('data-mk-add="' + p1.id + '"');
    expect(html).toContain('data-mk-title=');
    expect(html).toContain('data-mk-price=');
  });
  it('renders a cart root scoped to the store slug', () => {
    expect(html).toContain('data-mk-cart-root');
    expect(html).toContain('data-mk-slug="' + manifest.store.slug + '"');
  });
  it('loads marketplace-cart.js', () => {
    expect(html).toContain('/marketplace-cart.js');
  });
  it('renders the order form with required fields', () => {
    expect(html).toContain('data-mk-order-form');
    expect(html).toContain('name="name"');
    expect(html).toContain('name="phone"');
    expect(html).toContain('name="address"');
  });
});

// ── renderProductBody — store breadcrumb (#cat anchor, D5=B) ─────────────────

const taxSvc = createTaxonomyService({
  tree: treeFix as TaxNode[],
  labels: { en: labelsEnFix as Record<string, string> },
  taxonomyVersion: 1,
});

function mkProdManifest(catId: string | undefined): Manifest {
  return {
    store: { slug: 'shop', displayName: 'Shop', contact: {}, languages: ['en'], currency: 'USD' },
    categories: [],
    products: [{ id: 'p1', categoryId: catId, title: { en: 'Item' }, images: [], price: 10 }],
    meta: { version: 1, updatedAt: '' },
  } as unknown as Manifest;
}

describe('renderProductBody — store breadcrumb (#cat anchor, D5=B)', () => {
  it('çözülen kategori için breadcrumb + #cat-<id> anchor link', () => {
    const m = mkProdManifest('267');
    const html = renderProductBody(m, m.products[0], 'en', 'en', taxSvc);
    expect(html).toContain('sf-breadcrumb');
    expect(html).toContain('#cat-222');
    expect(html).toContain('Mobile Phones');
  });
  it('çözülemeyen categoryId → breadcrumb satırı YOK (gizli)', () => {
    const m = mkProdManifest('electronics.phones');
    const html = renderProductBody(m, m.products[0], 'en', 'en', taxSvc);
    expect(html).not.toContain('sf-breadcrumb');
  });
  it('svc verilmezse breadcrumb yok (geri uyumlu)', () => {
    const m = mkProdManifest('267');
    const html = renderProductBody(m, m.products[0], 'en', 'en');
    expect(html).not.toContain('sf-breadcrumb');
  });
});
