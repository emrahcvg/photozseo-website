import { describe, it, expect } from 'vitest';
import { extractLabels } from './labels';
import type { RawEntry } from './types';

const entries: RawEntry[] = [
  { id: '166', path: ['Apparel & Accessories'] },
  { id: '212', path: ['Apparel & Accessories', 'Clothing', 'Shirts & Tops'] },
];

describe('extractLabels', () => {
  it('her id için yol son parçasını (yaprak) label yapar', () => {
    expect(extractLabels(entries)).toEqual({
      '166': 'Apparel & Accessories',
      '212': 'Shirts & Tops',
    });
  });
});
