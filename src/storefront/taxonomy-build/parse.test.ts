import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from './parse';

const sample = readFileSync(
  fileURLToPath(new URL('./fixtures/sample-en.txt', import.meta.url)),
  'utf-8',
);

describe('parse', () => {
  it('versiyon başlığını okur', () => {
    expect(parse(sample).version).toBe('2026-03-15');
  });

  it('her veri satırını id + path dizisine ayırır', () => {
    const { entries } = parse(sample);
    expect(entries).toContainEqual({
      id: '212',
      path: ['Apparel & Accessories', 'Clothing', 'Shirts & Tops'],
    });
  });

  it('başlık ve boş satırları atlar', () => {
    const { entries } = parse(sample);
    expect(entries).toHaveLength(7);
    expect(entries.every((e) => e.id && e.path.length > 0)).toBe(true);
  });

  it('path içindeki & ve > etrafındaki boşlukları korur', () => {
    const { entries } = parse(sample);
    const root = entries.find((e) => e.id === '1');
    expect(root!.path).toEqual(['Animals & Pet Supplies']);
  });

  it('boş path segmenti olan satırı atlar', () => {
    const broken = '# version: 2026-03-15\n212 -  > Foo\n166 - Apparel\n';
    const { entries } = parse(broken);
    expect(entries).toEqual([{ id: '166', path: ['Apparel'] }]);
  });
});
