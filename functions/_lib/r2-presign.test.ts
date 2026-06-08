import { describe, it, expect } from 'vitest';
import { r2KeyForAsset, isSafeKeySegment, presignR2Url } from './r2-presign';

describe('r2KeyForAsset', () => {
  it('company prefix\'li anahtar üretir', () => {
    expect(r2KeyForAsset('c:co-1', 'p1', 'a1', 'jpg')).toBe('companies/c:co-1/projects/p1/original/a1.jpg');
  });
  it('uzantı baştaki noktayı temizler', () => {
    expect(r2KeyForAsset('c:co-1', 'p1', 'a1', '.png')).toBe('companies/c:co-1/projects/p1/original/a1.png');
  });
});

describe('isSafeKeySegment', () => {
  it('UUID/slug kabul, path traversal red', () => {
    expect(isSafeKeySegment('a1b2')).toBe(true);
    expect(isSafeKeySegment('1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')).toBe(true);
    expect(isSafeKeySegment('../etc')).toBe(false);
    expect(isSafeKeySegment('a/b')).toBe(false);
    expect(isSafeKeySegment('')).toBe(false);
  });
});

describe('presignR2Url', () => {
  const cfg = {
    accountId: 'acct123',
    accessKeyId: 'AKIA',
    secretAccessKey: 'SECRET',
    bucket: 'photozseo-team-pool',
  };
  it('PUT için imzalı URL üretir (host + key + imza param)', async () => {
    const url = await presignR2Url(cfg, { method: 'PUT', key: 'companies/c/projects/p/original/a.jpg', expiresSeconds: 900 });
    expect(url).toContain('acct123.r2.cloudflarestorage.com');
    expect(url).toContain('/photozseo-team-pool/companies/c/projects/p/original/a.jpg');
    expect(url).toContain('X-Amz-Signature=');
    expect(url).toContain('X-Amz-Expires=900');
  });
  it('GET için imzalı URL üretir', async () => {
    const url = await presignR2Url(cfg, { method: 'GET', key: 'companies/c/projects/p/original/a.jpg', expiresSeconds: 600 });
    expect(url).toContain('X-Amz-Signature=');
  });
});
