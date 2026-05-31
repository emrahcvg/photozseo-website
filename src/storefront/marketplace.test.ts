import { describe, it, expect } from 'vitest';
import { mt, MK_LOCALES } from './marketplace-i18n';

describe('marketplace i18n', () => {
  it('covers the 12 supported locales', () => {
    expect(MK_LOCALES).toEqual(['en', 'tr', 'de', 'es', 'pt', 'ja', 'ko', 'zh', 'ar', 'fa', 'ur', 'hi']);
  });

  it('returns the locale string when present', () => {
    expect(mt('tr', 'searchPlaceholder')).toBe('Ürün ara…');
    expect(mt('en', 'searchPlaceholder')).toBe('Search products…');
  });

  it('falls back to English for an unknown locale', () => {
    expect(mt('xx', 'newProducts')).toBe(mt('en', 'newProducts'));
  });

  it('returns the key itself for an unknown key (no crash)', () => {
    expect(mt('en', 'totallyMissingKey')).toBe('totallyMissingKey');
  });
});
