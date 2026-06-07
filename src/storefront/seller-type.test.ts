import { describe, expect, test } from 'vitest';
import { sellerTypeLabel } from './marketplace-i18n';
import { renderStoreBody } from './render';
import type { Manifest } from './types';

describe('sellerTypeLabel', () => {
  test('maps a known business-type code to a localized label', () => {
    expect(sellerTypeLabel('individual', 'tr')).toBe('Şahıs satıcı');
    expect(sellerTypeLabel('manufacturer', 'en')).toBe('Manufacturer');
  });

  test('returns null for missing or unknown codes', () => {
    expect(sellerTypeLabel(undefined, 'tr')).toBeNull();
    expect(sellerTypeLabel('garbage', 'tr')).toBeNull();
  });
});

describe('renderStoreBody — seller type badge (transparency)', () => {
  function mkManifest(businessType?: string): Manifest {
    return {
      store: {
        slug: 's',
        displayName: 'Shop',
        contact: {},
        languages: ['tr'],
        currency: 'USD',
        businessType,
      },
      categories: [],
      products: [],
      meta: { version: 1, updatedAt: '2026-01-01' },
    };
  }

  test('shows a seller-type badge when businessType is set', () => {
    const html = renderStoreBody(mkManifest('individual'), 'tr', 'tr');
    expect(html).toContain('sf-seller-type');
    expect(html).toContain('Şahıs satıcı');
  });

  test('omits the badge when businessType is absent', () => {
    const html = renderStoreBody(mkManifest(undefined), 'tr', 'tr');
    expect(html).not.toContain('sf-seller-type');
  });
});
