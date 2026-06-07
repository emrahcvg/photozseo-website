import { describe, expect, test } from 'vitest';
import { renderStoreBody } from './render';
import type { Manifest } from './types';

function autoManifest(): Manifest {
  return {
    store: {
      slug: 'shop',
      displayName: 'Shop',
      contact: {},
      languages: ['en'],
      currency: 'USD',
    },
    categories: [{ id: 'auto', name: { en: 'Auto Parts' } }],
    products: [
      {
        id: 'a',
        categoryId: 'auto',
        title: { en: 'Front Headlight' },
        images: [],
        partTypeKey: 'headlight_front',
        partTypeLabel: { en: 'Front Headlight' },
        fitment: [{ make: 'Tesla', model: 'Model 3', yearFrom: 2021 }],
      },
      {
        id: 'b',
        categoryId: 'auto',
        title: { en: 'Side Mirror' },
        images: [],
        partTypeKey: 'mirror_side',
        partTypeLabel: { en: 'Side Mirror' },
        fitment: [{ make: 'Tesla', model: 'Model Y' }],
      },
    ],
    meta: { version: 1, updatedAt: '2026-01-01' },
  };
}

function plainManifest(): Manifest {
  return {
    store: { slug: 'shop', displayName: 'Shop', contact: {}, languages: ['en'], currency: 'USD' },
    categories: [{ id: 'cloth', name: { en: 'Clothing' } }],
    products: [{ id: 'x', categoryId: 'cloth', title: { en: 'T-Shirt' }, images: [] }],
    meta: { version: 1, updatedAt: '2026-01-01' },
  };
}

describe('renderStoreBody — part-type sub-grouping (layer 2)', () => {
  test('renders a part-type sub-heading per part-type within an automotive category', () => {
    const html = renderStoreBody(autoManifest(), 'en', 'en');
    expect(html).toContain('sf-subsection__title');
    expect(html).toContain('Front Headlight');
    expect(html).toContain('Side Mirror');
  });

  test('non-automotive category renders no part-type sub-headings (unchanged)', () => {
    const html = renderStoreBody(plainManifest(), 'en', 'en');
    expect(html).not.toContain('sf-subsection__title');
  });
});

describe('renderStoreBody — vehicle fitment filter (layer 3)', () => {
  test('each automotive card embeds an encoded data-sf-fitment attribute', () => {
    const html = renderStoreBody(autoManifest(), 'en', 'en');
    expect(html).toContain('data-sf-fitment=');
    expect(html).toContain('Model 3');
    expect(html).toContain('Model Y');
  });

  test('automotive category renders a fitment filter control with a make option', () => {
    const html = renderStoreBody(autoManifest(), 'en', 'en');
    expect(html).toContain('data-sf-fitment-filter');
    expect(html).toContain('>Tesla<');
  });

  test('non-automotive store renders no fitment filter control', () => {
    const html = renderStoreBody(plainManifest(), 'en', 'en');
    expect(html).not.toContain('data-sf-fitment-filter');
    expect(html).not.toContain('data-sf-fitment=');
  });
});
