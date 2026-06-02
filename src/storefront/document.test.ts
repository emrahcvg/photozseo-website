import { describe, it, expect } from 'vitest';
import { renderDocument } from './document';

describe('renderDocument', () => {
  it('starts with <!doctype html', () => {
    const html = renderDocument({ title: 'Test', lang: 'en', body: '<p>hi</p>' });
    expect(html).toContain('<!doctype html');
  });

  it('escapes the title', () => {
    const html = renderDocument({ title: 'A & B <script>', lang: 'en', body: '' });
    expect(html).toContain('A &amp; B &lt;script&gt;');
    expect(html).not.toContain('<script>');
  });

  it('includes the css link', () => {
    const html = renderDocument({ title: 'T', lang: 'en', body: '' });
    expect(html).toContain('<link rel="stylesheet" href="/storefront.css?v=aura27" />');
  });

  it('sets lang="tr" and dir="ltr" for Turkish', () => {
    const html = renderDocument({ title: 'T', lang: 'tr', body: '' });
    expect(html).toContain('lang="tr"');
    expect(html).toContain('dir="ltr"');
  });

  it('sets dir="rtl" for Arabic', () => {
    const html = renderDocument({ title: 'T', lang: 'ar', body: '' });
    expect(html).toContain('dir="rtl"');
  });

  it('sets dir="rtl" for Urdu', () => {
    const html = renderDocument({ title: 'T', lang: 'ur', body: '' });
    expect(html).toContain('dir="rtl"');
  });

  it('sets dir="rtl" for Farsi', () => {
    const html = renderDocument({ title: 'T', lang: 'fa', body: '' });
    expect(html).toContain('dir="rtl"');
  });

  it('includes OpenGraph tags', () => {
    const html = renderDocument({ title: 'My Store', lang: 'en', description: 'Great store', body: '' });
    expect(html).toContain('og:title');
    expect(html).toContain('og:description');
    expect(html).toContain('og:site_name" content="photoZseo"');
    expect(html).toContain('og:type" content="website"');
  });

  it('includes meta description', () => {
    const html = renderDocument({ title: 'T', lang: 'en', description: 'A nice description', body: '' });
    expect(html).toContain('name="description" content="A nice description"');
  });

  it('includes body content unescaped', () => {
    const html = renderDocument({ title: 'T', lang: 'en', body: '<div class="sf-store"><h1>Hello</h1></div>' });
    expect(html).toContain('<div class="sf-store"><h1>Hello</h1></div>');
  });

  it('includes robots meta tag', () => {
    const html = renderDocument({ title: 'T', lang: 'en', body: '' });
    expect(html).toContain('name="robots" content="index, follow"');
  });

  it('overrides robots when provided (noindex for search pages)', () => {
    const html = renderDocument({ title: 'T', lang: 'en', body: '', robots: 'noindex, follow' });
    expect(html).toContain('name="robots" content="noindex, follow"');
    expect(html).not.toContain('content="index, follow"');
  });

  it('includes extra stylesheets when provided', () => {
    const html = renderDocument({ title: 't', lang: 'en', body: 'x', stylesheets: ['/marketplace.css'] });
    expect(html).toContain('href="/marketplace.css"');
  });
  it('includes body scripts when provided', () => {
    const html = renderDocument({ title: 't', lang: 'en', body: 'x', bodyScripts: ['/marketplace-enhance.js'] });
    expect(html).toContain('<script src="/marketplace-enhance.js" defer></script>');
  });
  it('still loads /storefront.css by default (no regression)', () => {
    const html = renderDocument({ title: 't', lang: 'en', body: 'x' });
    expect(html).toContain('/storefront.css');
  });
});
