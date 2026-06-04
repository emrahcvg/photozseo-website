import { describe, it, expect } from 'vitest';
import {
  isExternalImage,
  seoImagePath,
  parseImageFilename,
  toProxyImages,
} from './image-proxy';

describe('isExternalImage', () => {
  it('detects http(s) URLs', () => {
    expect(isExternalImage('https://lh3.googleusercontent.com/d/abc')).toBe(true);
    expect(isExternalImage('http://x/y.jpg')).toBe(true);
  });
  it('treats relative/same-origin paths as non-external', () => {
    expect(isExternalImage('/store/x/img/y-1')).toBe(false);
    expect(isExternalImage('icon.png')).toBe(false);
  });
});

describe('seoImagePath', () => {
  it('builds a 1-based descriptive path', () => {
    expect(seoImagePath('fetra', 'nexo-ring-rose-gold', 0)).toBe(
      '/store/fetra/img/nexo-ring-rose-gold-1',
    );
    expect(seoImagePath('fetra', 'nexo-ring-rose-gold', 4)).toBe(
      '/store/fetra/img/nexo-ring-rose-gold-5',
    );
  });
});

describe('parseImageFilename', () => {
  it('round-trips with seoImagePath filename', () => {
    expect(parseImageFilename('nexo-ring-rose-gold-1')).toEqual({
      pslug: 'nexo-ring-rose-gold',
      index: 0,
    });
    expect(parseImageFilename('nexo-ring-rose-gold-5')).toEqual({
      pslug: 'nexo-ring-rose-gold',
      index: 4,
    });
  });
  it('rejects malformed names', () => {
    expect(parseImageFilename('no-number-here')).toBeNull();
    expect(parseImageFilename('slug-0')).toBeNull(); // n must be >= 1
    expect(parseImageFilename('12345')).toBeNull(); // no slug part
  });
});

describe('toProxyImages', () => {
  it('rewrites external URLs to absolute proxy URLs, leaves others', () => {
    const out = toProxyImages(
      'https://photozseo.com',
      'fetra',
      'nexo-ring',
      ['https://lh3.googleusercontent.com/d/aaa', '/local/already.png'],
    );
    expect(out[0]).toBe('https://photozseo.com/store/fetra/img/nexo-ring-1');
    expect(out[1]).toBe('/local/already.png');
  });

  it('round-trips index through path → parse', () => {
    const imgs = ['https://x/a', 'https://x/b', 'https://x/c'];
    const proxied = toProxyImages('https://o', 'fetra', 'nexo-ring', imgs);
    proxied.forEach((u, i) => {
      const file = u.split('/img/')[1];
      expect(parseImageFilename(file)).toEqual({ pslug: 'nexo-ring', index: i });
    });
  });
});
