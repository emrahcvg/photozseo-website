import { describe, it, expect } from 'vitest';
import { normalizePath, normalizeHtml } from '../../scripts/fix-internal-links.mjs';

describe('fix-internal-links', () => {
  it('adds trailing slash to page paths, keeps hash/query', () => {
    expect(normalizePath('/pricing')).toBe('/pricing/');
    expect(normalizePath('/de/blog/foo-2026')).toBe('/de/blog/foo-2026/');
    expect(normalizePath('/pricing#faq')).toBe('/pricing/#faq');
    expect(normalizePath('/blog?x=1')).toBe('/blog/?x=1');
  });
  it('leaves files, root, slashed paths and excluded prefixes alone', () => {
    for (const p of ['/', '/robots.txt', '/og-image.png', '/sitemap-index.xml', '/pricing/', '/api/orders', '/ai/faq.json', '/chrome', '/img/figures/a-en.webp', '//cdn.x.com/a', '/market', '/store/acme']) {
      expect(normalizePath(p)).toBe(p);
    }
  });
  it('rewrites href and absolute site URLs in JSON-LD, not assets', () => {
    const out = normalizeHtml('<a href="/support">x</a><a href="https://photozseo.com/about">y</a><a href="https://example.com/a">z</a><script>{"url":"https://photozseo.com/de/terms","@id":"https://photozseo.com/#org","image":"https://photozseo.com/og-image.png"}</script>');
    expect(out).toContain('href="/support/"');
    expect(out).toContain('href="https://photozseo.com/about/"');
    expect(out).toContain('href="https://example.com/a"');
    expect(out).toContain('"url":"https://photozseo.com/de/terms/"');
    expect(out).toContain('"@id":"https://photozseo.com/#org"');
    expect(out).toContain('og-image.png"');
  });
});
