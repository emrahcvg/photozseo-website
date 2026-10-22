import { describe, it, expect } from 'vitest';
import { isCrossSiteBrowserPost } from './google';

const req = (h: Record<string, string>) => new Request('https://photozseo.com/api/auth/google', { method: 'POST', headers: h });

describe('isCrossSiteBrowserPost (giriş CSRF)', () => {
  it('aynı origin tarayıcı isteğine izin verir', () => {
    expect(isCrossSiteBrowserPost(req({ origin: 'https://photozseo.com', 'sec-fetch-site': 'same-origin' }))).toBe(false);
  });
  it('Origin göndermeyen yerel uygulama isteğine izin verir (iOS URLSession)', () => {
    expect(isCrossSiteBrowserPost(req({}))).toBe(false);
  });
  it('başka siteden gelen form POST\'unu reddeder', () => {
    expect(isCrossSiteBrowserPost(req({ origin: 'https://evil.example' }))).toBe(true);
    expect(isCrossSiteBrowserPost(req({ 'sec-fetch-site': 'cross-site' }))).toBe(true);
    expect(isCrossSiteBrowserPost(req({ origin: 'null' }))).toBe(true);
  });
});
