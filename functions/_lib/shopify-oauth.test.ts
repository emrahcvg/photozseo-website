/**
 * shopify-oauth.ts birim testleri — shop doğrulama, authorize URL (scope fix),
 * HMAC doğrulaması (Web Crypto impl'ini bağımsız Node crypto ile çapraz-kontrol).
 */
import { describe, it, expect } from 'vitest';
import { createHmac } from 'node:crypto';
import {
  SHOPIFY_SCOPES,
  isValidShop,
  normalizeShop,
  authorizeUrl,
  verifyHmac,
} from './shopify-oauth';

const SECRET = 'shpss_test_secret_0000';

describe('isValidShop', () => {
  it('geçerli myshopify subdomain → true', () => {
    expect(isValidShop('acme.myshopify.com')).toBe(true);
    expect(isValidShop('a-b-1.myshopify.com')).toBe(true);
  });
  it('injection / yanlış host → false', () => {
    expect(isValidShop('evil.com')).toBe(false);
    expect(isValidShop('acme.myshopify.com.evil.com')).toBe(false);
    expect(isValidShop('acme.myshopify.com/../x')).toBe(false);
    expect(isValidShop('@evil.com')).toBe(false);
    expect(isValidShop('')).toBe(false);
  });
});

describe('normalizeShop', () => {
  it('çıplak ad → .myshopify.com ekler', () => {
    expect(normalizeShop('acme')).toBe('acme.myshopify.com');
    expect(normalizeShop('ACME')).toBe('acme.myshopify.com');
  });
  it('tam alan / https / trailing path → temizler', () => {
    expect(normalizeShop('acme.myshopify.com')).toBe('acme.myshopify.com');
    expect(normalizeShop('https://acme.myshopify.com/admin')).toBe('acme.myshopify.com');
  });
  it('geçersiz → null', () => {
    expect(normalizeShop('evil.com.evil')).toBe(null);
    expect(normalizeShop('a b')).toBe(null);
  });
});

describe('authorizeUrl (scope fix)', () => {
  it('doğru scope + paramları içerir', () => {
    const u = new URL(
      authorizeUrl('acme.myshopify.com', 'CID', 'https://photozseo.com/api/shopify/callback', 'NONCE'),
    );
    expect(u.origin + u.pathname).toBe('https://acme.myshopify.com/admin/oauth/authorize');
    expect(u.searchParams.get('client_id')).toBe('CID');
    expect(u.searchParams.get('scope')).toBe(SHOPIFY_SCOPES);
    expect(u.searchParams.get('scope')).toContain('write_inventory'); // stok izni şart
    expect(u.searchParams.get('redirect_uri')).toBe('https://photozseo.com/api/shopify/callback');
    expect(u.searchParams.get('state')).toBe('NONCE');
  });
});

describe('verifyHmac', () => {
  // Shopify imzası: hmac dışı paramlar lexicographic sıralı, key=value, & ile birleşik.
  function signedUrl(params: Record<string, string>, secret: string): URL {
    const message = Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&');
    const hmac = createHmac('sha256', secret).update(message).digest('hex');
    const sp = new URLSearchParams({ ...params, hmac });
    return new URL(`https://photozseo.com/api/shopify/callback?${sp.toString()}`);
  }

  const PARAMS = {
    code: 'authcode123',
    shop: 'acme.myshopify.com',
    state: 'nonce1',
    timestamp: '1700000000',
  };

  it('geçerli imza → true', async () => {
    expect(await verifyHmac(signedUrl(PARAMS, SECRET), SECRET)).toBe(true);
  });

  it('param değiştirilmiş (imza eski) → false', async () => {
    const url = signedUrl(PARAMS, SECRET);
    url.searchParams.set('shop', 'attacker.myshopify.com');
    expect(await verifyHmac(url, SECRET)).toBe(false);
  });

  it('yanlış secret → false', async () => {
    expect(await verifyHmac(signedUrl(PARAMS, SECRET), 'wrong_secret')).toBe(false);
  });

  it('hmac eksik → false', async () => {
    const sp = new URLSearchParams(PARAMS);
    expect(await verifyHmac(new URL(`https://photozseo.com/cb?${sp}`), SECRET)).toBe(false);
  });
});
