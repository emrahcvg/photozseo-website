// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// jsdom sets import.meta.url to a non-file (http) URL, so resolve from cwd (repo root).
const src = readFileSync(resolve(process.cwd(), 'public/marketplace-enhance.js'), 'utf8');
function load() { new Function(src)(); }

describe('marketplace-enhance', () => {
  beforeEach(() => { document.head.innerHTML = ''; document.body.innerHTML = ''; });

  it('prefetches a link on hover (adds <link rel=prefetch>)', () => {
    document.body.innerHTML = '<a class="mk-card-link" href="/store/x/product/y">card</a>';
    load();
    const a = document.querySelector('a')!;
    a.dispatchEvent(new Event('mouseenter'));
    const pre = document.querySelector('link[rel="prefetch"]');
    expect(pre).not.toBeNull();
    expect(pre!.getAttribute('href')).toBe('/store/x/product/y');
  });

  it('toggles the filter sheet open attribute', () => {
    document.body.innerHTML =
      '<button data-mk-filter-toggle aria-expanded="false">F</button><aside data-mk-facets></aside>';
    load();
    const btn = document.querySelector('[data-mk-filter-toggle]') as HTMLElement;
    btn.click();
    const sheet = document.querySelector('[data-mk-facets]') as HTMLElement;
    expect(sheet.hasAttribute('data-mk-open')).toBe(true);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });
});
