import { describe, it, expect } from 'vitest';
import type { StoreInfo } from './types';

describe('StoreInfo marketplace alanları', () => {
  it('marketplaceListed ve payment opsiyonel olarak set edilebilir', () => {
    const s: StoreInfo = {
      slug: 'x',
      displayName: 'ACME',
      contact: {},
      languages: ['tr'],
      currency: 'USD',
      marketplaceListed: true,
      payment: { iban: 'TR000', ibanName: 'Ad Soyad' },
    };
    expect(s.marketplaceListed).toBe(true);
    expect(s.payment?.ibanName).toBe('Ad Soyad');
  });
});
