import { describe, it, expect } from 'vitest';
import { resolveLocalized, formatPrice, FALLBACK_LOCALE } from './manifest';

describe('resolveLocalized', () => {
  it('istenen dili döndürür', () => {
    expect(resolveLocalized({ tr: 'Merhaba', en: 'Hello' }, 'tr')).toBe('Merhaba');
  });
  it('dil yoksa fallback (en) döner', () => {
    expect(resolveLocalized({ en: 'Hello' }, 'de')).toBe('Hello');
  });
  it('fallback da yoksa ilk değeri döner', () => {
    expect(resolveLocalized({ tr: 'Merhaba' }, 'de', 'en')).toBe('Merhaba');
  });
  it('undefined alanda boş string döner', () => {
    expect(resolveLocalized(undefined, 'tr')).toBe('');
  });
  it('FALLBACK_LOCALE en olmalı', () => {
    expect(FALLBACK_LOCALE).toBe('en');
  });
});

describe('formatPrice', () => {
  it('fiyat undefined ise null döner', () => {
    expect(formatPrice(undefined, 'TRY', 'tr')).toBeNull();
  });
  it('geçerli fiyatı biçimli string döndürür', () => {
    const out = formatPrice(1499, 'TRY', 'tr');
    expect(typeof out).toBe('string');
    expect(out).toContain('499');
  });
  it('geçersiz currency kodunda çökmeyip fallback döner', () => {
    const out = formatPrice(10, 'XXXX_BAD', 'tr');
    expect(out).toContain('10');
  });
});
