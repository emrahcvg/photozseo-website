import { describe, it, expect } from 'vitest';
import { ownerKeyFromDevice, isValidSlug } from './buyer';

describe('ownerKeyFromDevice', () => {
  it('geçerli UUID için d: önekli anahtar döner', () => {
    expect(ownerKeyFromDevice('1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')).toBe(
      'd:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    );
  });
  it('boş/biçimsiz cihaz kimliği için null döner', () => {
    expect(ownerKeyFromDevice('')).toBeNull();
    expect(ownerKeyFromDevice('not-a-uuid')).toBeNull();
    expect(ownerKeyFromDevice('d:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')).toBeNull();
  });
});

describe('isValidSlug', () => {
  it('makul slug kabul eder', () => {
    expect(isValidSlug('ahmet-oto-yedek')).toBe(true);
    expect(isValidSlug('deri-defter-2')).toBe(true);
  });
  it('boş/aşırı uzun/yasak karakter reddeder', () => {
    expect(isValidSlug('')).toBe(false);
    expect(isValidSlug('a'.repeat(200))).toBe(false);
    expect(isValidSlug('boşluk var')).toBe(false);
    expect(isValidSlug('../etc')).toBe(false);
  });
});
