import { describe, it, expect } from 'vitest';
import { buildTree } from './tree';
import type { RawEntry } from './types';

const entries: RawEntry[] = [
  { id: '166', path: ['Apparel & Accessories'] },
  { id: '1604', path: ['Apparel & Accessories', 'Clothing'] },
  { id: '212', path: ['Apparel & Accessories', 'Clothing', 'Shirts & Tops'] },
  { id: '1', path: ['Animals & Pet Supplies'] },
];

describe('buildTree', () => {
  it('kök düğümün parentId null, depth 0 olur', () => {
    const node = buildTree(entries).find((n) => n.id === '166');
    expect(node).toEqual({ id: '166', parentId: null, depth: 0 });
  });

  it('alt düğümün parentId ve depth değerini path zincirinden çözer', () => {
    const node = buildTree(entries).find((n) => n.id === '212');
    expect(node).toEqual({ id: '212', parentId: '1604', depth: 2 });
  });

  it('her giriş için bir düğüm üretir', () => {
    expect(buildTree(entries)).toHaveLength(4);
  });

  it('parent path bir giriş olarak yoksa hata fırlatır', () => {
    const orphan: RawEntry[] = [{ id: '9', path: ['A', 'B'] }];
    expect(() => buildTree(orphan)).toThrow(/parent bulunamadı/);
  });

  it('iki giriş aynı path e map lenince hata fırlatır', () => {
    const dup: RawEntry[] = [
      { id: '1', path: ['A'] },
      { id: '2', path: ['A'] },
    ];
    expect(() => buildTree(dup)).toThrow(/çakışan path/);
  });
});
