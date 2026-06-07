import { describe, expect, test } from 'vitest';
import { groupProductsByPartType, encodeFitment, fitmentFilterOptions } from './manifest';
import type { Product, ProductFitment } from './types';

const p = (
  id: string,
  partTypeKey?: string,
  partTypeLabel?: Record<string, string>,
): Product => ({ id, title: { en: id }, images: [], partTypeKey, partTypeLabel });

describe('groupProductsByPartType', () => {
  test('groups automotive products by partTypeKey in first-seen order', () => {
    const products = [
      p('a', 'headlight', { en: 'Headlight', tr: 'Far' }),
      p('b', 'mirror', { en: 'Mirror', tr: 'Ayna' }),
      p('c', 'headlight', { en: 'Headlight', tr: 'Far' }),
    ];
    const groups = groupProductsByPartType(products);
    expect(groups.map((g) => g.partTypeKey)).toEqual(['headlight', 'mirror']);
    expect(groups[0].products.map((x) => x.id)).toEqual(['a', 'c']);
    expect(groups[0].label).toEqual({ en: 'Headlight', tr: 'Far' });
  });

  test('products without partTypeKey collapse into a null group at the end', () => {
    const products = [p('a', 'headlight', { en: 'Headlight' }), p('b')];
    const groups = groupProductsByPartType(products);
    expect(groups.map((g) => g.partTypeKey)).toEqual(['headlight', null]);
    expect(groups[1].products.map((x) => x.id)).toEqual(['b']);
    expect(groups[1].label).toBeNull();
  });

  test('returns empty array when no products', () => {
    expect(groupProductsByPartType([])).toEqual([]);
  });
});

describe('encodeFitment', () => {
  test('encodes fitment list as compact [make, model, yearFrom, yearTo] tuples', () => {
    const f: ProductFitment[] = [
      { make: 'Tesla', model: 'Model 3', yearFrom: 2021 },
      { make: 'Tesla', model: 'Model Y' },
    ];
    expect(encodeFitment(f)).toBe('[["Tesla","Model 3",2021,null],["Tesla","Model Y",null,null]]');
  });

  test('empty or missing fitment encodes to empty string', () => {
    expect(encodeFitment(undefined)).toBe('');
    expect(encodeFitment([])).toBe('');
  });
});

describe('fitmentFilterOptions', () => {
  test('collects unique makes and models-per-make in first-seen order', () => {
    const products: Product[] = [
      { id: 'a', title: { en: 'a' }, images: [], fitment: [{ make: 'Tesla', model: 'Model 3' }] },
      { id: 'b', title: { en: 'b' }, images: [], fitment: [{ make: 'Tesla', model: 'Model Y' }] },
      { id: 'c', title: { en: 'c' }, images: [], fitment: [{ make: 'BMW', model: 'i4' }] },
      { id: 'd', title: { en: 'd' }, images: [], fitment: [{ make: 'Tesla', model: 'Model 3' }] },
    ];
    const opts = fitmentFilterOptions(products);
    expect(opts.makes).toEqual(['Tesla', 'BMW']);
    expect(opts.modelsByMake).toEqual({ Tesla: ['Model 3', 'Model Y'], BMW: ['i4'] });
  });

  test('ignores products without fitment', () => {
    const products: Product[] = [{ id: 'a', title: { en: 'a' }, images: [] }];
    expect(fitmentFilterOptions(products)).toEqual({ makes: [], modelsByMake: {} });
  });
});
