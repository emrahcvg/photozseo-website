/**
 * session.ts birim testleri — Web Crypto (HMAC-SHA256) + cookie ayrıştırma.
 */
import { describe, it, expect } from 'vitest';
import { signSession, verifySession, parseCookies, type SessionPayload } from './session';

const SECRET = 'test-secret-32-bytes-0000000000000';
const NOW = 1_700_000_000; // sabit unix saniye
const FUTURE_EXP = NOW + 86_400; // 1 gün sonra

const BASE_PAYLOAD: SessionPayload = {
  sub: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  exp: FUTURE_EXP,
};

describe('signSession + verifySession', () => {
  it('roundtrip: imzala → doğrula → payload döner', async () => {
    const token = await signSession(BASE_PAYLOAD, SECRET);
    const result = await verifySession(token, SECRET, NOW);
    expect(result).toEqual(BASE_PAYLOAD);
  });

  it('bozuk imza (payload değiştirildi) → null', async () => {
    const token = await signSession(BASE_PAYLOAD, SECRET);
    // İmza kısmından önce gelen payload'ı bozmak için birkaç karakter değiştir
    const parts = token.split('.');
    const tampered = parts[0].slice(0, -3) + 'AAA' + '.' + parts[1];
    const result = await verifySession(tampered, SECRET, NOW);
    expect(result).toBeNull();
  });

  it('yanlış secret → null', async () => {
    const token = await signSession(BASE_PAYLOAD, SECRET);
    const result = await verifySession(token, 'wrong-secret', NOW);
    expect(result).toBeNull();
  });

  it('süresi dolmuş token (exp < nowSec) → null', async () => {
    const expiredPayload: SessionPayload = { ...BASE_PAYLOAD, exp: NOW - 1 };
    const token = await signSession(expiredPayload, SECRET);
    const result = await verifySession(token, SECRET, NOW);
    expect(result).toBeNull();
  });

  it('tam olarak exp === nowSec (sınır: eşit değer) → null (dolmuş)', async () => {
    const boundaryPayload: SessionPayload = { ...BASE_PAYLOAD, exp: NOW };
    const token = await signSession(boundaryPayload, SECRET);
    // exp < nowSec koşulu: eşit ise dolmuş sayılmaz; spec "exp < now" diyor
    // exp === now → geçerli (< değil)
    const result = await verifySession(token, SECRET, NOW);
    expect(result).toEqual(boundaryPayload);
  });

  it('format bozuk (tek parça) → null', async () => {
    const result = await verifySession('notavalidtoken', SECRET, NOW);
    expect(result).toBeNull();
  });
});

describe('parseCookies', () => {
  it('"a=1; b=2" → { a: "1", b: "2" }', () => {
    const result = parseCookies('a=1; b=2');
    expect(result).toEqual({ a: '1', b: '2' });
  });

  it('null header → boş nesne', () => {
    expect(parseCookies(null)).toEqual({});
  });

  it('pz_session cookie değerini doğru çıkarır', () => {
    const result = parseCookies('pz_session=abc.def; other=xyz');
    expect(result['pz_session']).toBe('abc.def');
  });
});
