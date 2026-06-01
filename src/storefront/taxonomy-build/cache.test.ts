import { describe, it, expect } from 'vitest';
import { hashLabel, selectStale, mergeCache } from './cache';
import type { LabelCache } from './cache';

describe('cache', () => {
  it('hashLabel aynı metin için aynı, farklı için farklı', () => {
    expect(hashLabel('Shirts')).toBe(hashLabel('Shirts'));
    expect(hashLabel('Shirts')).not.toBe(hashLabel('Tops'));
  });

  it('selectStale yalnız yeni veya enHash değişen id leri döndürür', () => {
    const enLabels = { '1': 'Animals', '2': 'Clothing' };
    const cache: LabelCache = {
      '1': { enHash: hashLabel('Animals'), value: 'Hayvanlar' },
    };
    expect(selectStale(enLabels, cache)).toEqual(['2']);
  });

  it('selectStale enHash değişince o id yi döndürür', () => {
    const enLabels = { '1': 'Pets' };
    const cache: LabelCache = {
      '1': { enHash: hashLabel('Animals'), value: 'Hayvanlar' },
    };
    expect(selectStale(enLabels, cache)).toEqual(['1']);
  });

  it('mergeCache yeni çevirileri enHash ile yazar, eskileri korur', () => {
    const enLabels = { '1': 'Animals', '2': 'Clothing' };
    const cache: LabelCache = {
      '1': { enHash: hashLabel('Animals'), value: 'Hayvanlar' },
    };
    const merged = mergeCache(cache, enLabels, { '2': 'Giyim' });
    expect(merged['2']).toEqual({ enHash: hashLabel('Clothing'), value: 'Giyim' });
    expect(merged['1'].value).toBe('Hayvanlar');
  });
});
