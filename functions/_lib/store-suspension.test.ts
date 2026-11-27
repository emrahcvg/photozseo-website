import { describe, it, expect } from 'vitest';
import { isStoreSuspended, isSuspendedPath, suspendedResponse } from './store-suspension';

describe('store suspension', () => {
  it('defaults to suspended, reopens only with STORE_SUSPENDED=false', () => {
    expect(isStoreSuspended(undefined)).toBe(true);
    expect(isStoreSuspended({})).toBe(true);
    expect(isStoreSuspended({ STORE_SUSPENDED: 'true' })).toBe(true);
    expect(isStoreSuspended({ STORE_SUSPENDED: 'false' })).toBe(false);
  });
  it('blocks store/market paths but keeps legal and auth channels open', () => {
    for (const p of ['/market', '/market/stores', '/store/acme', '/marketplace-sitemap', '/api/orders', '/api/store/acme/cart']) {
      expect(isSuspendedPath(p)).toBe(true);
    }
    for (const p of ['/', '/pricing', '/marketplace-rules', '/marketplace-image-sizes', '/api/report', '/api/admin/takedown', '/api/account/delete', '/api/auth/me', '/q/abc', '/storefront-x']) {
      expect(isSuspendedPath(p)).toBe(false);
    }
  });
  it('returns 503 + noindex, JSON for api and HTML otherwise', async () => {
    const page = suspendedResponse('/market');
    expect(page.status).toBe(503);
    expect(page.headers.get('X-Robots-Tag')).toContain('noindex');
    expect(page.headers.get('Retry-After')).toBe('86400');
    expect(page.headers.get('Content-Type')).toContain('text/html');
    const api = suspendedResponse('/api/orders');
    expect(api.status).toBe(503);
    expect((await api.json()).error).toBe('store_suspended');
  });
});
