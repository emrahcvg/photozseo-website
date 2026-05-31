// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// jsdom sets import.meta.url to a non-file (http) URL, so resolve from cwd (repo root).
const src = readFileSync(resolve(process.cwd(), 'public/marketplace-cart.js'), 'utf8');

function loadCart() {
  // Execute the IIFE in the jsdom global scope.
  const fn = new Function(src);
  fn();
  // @ts-expect-error injected by the script
  return window.__mkCart;
}

describe('marketplace-cart helpers', () => {
  let cart: any;
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    cart = loadCart();
  });

  it('generateRef returns SP- + 5 uppercase base32 chars', () => {
    const ref = cart.generateRef();
    expect(ref).toMatch(/^SP-[0-9A-Z]{5}$/);
  });

  it('addItem stores per-store and getCart reads it back', () => {
    cart.addItem('ahmet-oto', { id: 'p1', title: 'Mat', price: 49.9, currency: 'USD', qty: 1 });
    const items = cart.getCart('ahmet-oto');
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Mat');
    // different store has its own cart
    expect(cart.getCart('beta')).toHaveLength(0);
  });

  it('addItem increments qty when the same product is added again', () => {
    cart.addItem('s', { id: 'p1', title: 'X', price: 10, currency: 'USD', qty: 1 });
    cart.addItem('s', { id: 'p1', title: 'X', price: 10, currency: 'USD', qty: 1 });
    expect(cart.getCart('s')[0].qty).toBe(2);
  });

  it('cartTotal sums price * qty', () => {
    cart.addItem('s', { id: 'a', title: 'A', price: 10, currency: 'USD', qty: 2 });
    cart.addItem('s', { id: 'b', title: 'B', price: 5, currency: 'USD', qty: 1 });
    expect(cart.cartTotal('s')).toBe(25);
  });

  it('validateOrder flags missing required fields', () => {
    expect(cart.validateOrder({ name: '', phone: '', address: '', note: '' }).valid).toBe(false);
    expect(cart.validateOrder({ name: 'Ali', phone: '5xx', address: 'Addr', note: 'n' }).valid).toBe(true);
  });

  it('buildWhatsappUrl produces a wa.me link with encoded message + ref', () => {
    cart.addItem('s', { id: 'a', title: 'Mat', price: 10, currency: 'USD', qty: 2 });
    const url = cart.buildWhatsappUrl('905551112233', 's', { name: 'Ali', phone: '5551112233', address: 'Addr', note: '' }, 'SP-AB12C');
    expect(url).toContain('https://wa.me/905551112233');
    expect(decodeURIComponent(url)).toContain('SP-AB12C');
    expect(decodeURIComponent(url)).toContain('Mat');
  });
});
