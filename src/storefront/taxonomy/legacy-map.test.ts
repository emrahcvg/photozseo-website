import { describe, it, expect } from 'vitest';
import { isGoogleId, mapLegacyId, UNCATEGORIZED } from './legacy-map';
import legacyMap from './legacy-map.json';

describe('isGoogleId', () => {
  it('saf numeric string için true', () => {
    expect(isGoogleId('267')).toBe(true);
    expect(isGoogleId('1')).toBe(true);
  });
  it('eski dot-id / serbest id için false', () => {
    expect(isGoogleId('electronics.phones')).toBe(false);
    expect(isGoogleId('c1')).toBe(false);
    expect(isGoogleId('')).toBe(false);
  });
});

describe('mapLegacyId', () => {
  const map = legacyMap as Record<string, string>;
  it('zaten google id ise dokunmaz (idempotent)', () => {
    expect(mapLegacyId('267', map)).toBe('267');
  });
  it('haritada olmayan numeric id de değişmez (idempotency niyeti)', () => {
    expect(mapLegacyId('9999999', map)).toBe('9999999');
  });
  it('eski id\'yi google id\'ye çevirir', () => {
    expect(mapLegacyId('electronics.phones', map)).toBe(map['electronics.phones']);
    expect(isGoogleId(mapLegacyId('clothing.shoes', map))).toBe(true);
  });
  it('serbest/bilinmeyen id → UNCATEGORIZED sentinel', () => {
    expect(mapLegacyId('c1', map)).toBe(UNCATEGORIZED);
    expect(mapLegacyId('rastgele', map)).toBe(UNCATEGORIZED);
  });
  it('boş/undefined → UNCATEGORIZED', () => {
    expect(mapLegacyId('', map)).toBe(UNCATEGORIZED);
    expect(mapLegacyId(undefined, map)).toBe(UNCATEGORIZED);
  });
});

describe('legacy-map tablosu yapısı', () => {
  it('31 girdi içerir', () => {
    expect(Object.keys(legacyMap).length).toBe(31);
  });
  it('tüm hedefler google id (numeric string)', () => {
    for (const v of Object.values(legacyMap as Record<string, string>)) {
      expect(isGoogleId(v)).toBe(true);
    }
  });
});

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

describe('legacy-map → tree.json doğrulama (CI hard-stop)', () => {
  const treePath = fileURLToPath(new URL('./tree.json', import.meta.url));
  const ready = existsSync(treePath);
  const maybe = ready ? it : it.skip;

  maybe('her google_id tree.json\'da var olmalı', () => {
    const tree = JSON.parse(readFileSync(treePath, 'utf8')) as { id: string }[];
    const ids = new Set(tree.map((n) => n.id));
    const missing = Object.entries(legacyMap as Record<string, string>)
      .filter(([, gid]) => !ids.has(gid))
      .map(([old, gid]) => `${old}→${gid}`);
    expect(missing, `tree.json'da eksik hedefler: ${missing.join(', ')}`).toEqual([]);
  });
});
