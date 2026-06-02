import { describe, it, expect } from 'vitest';
import { createTaxonomyService, type TaxNode } from './service';
import tree from './__fixtures__/tree.fixture.json';
import labelsEn from './__fixtures__/labels.en.fixture.json';
import labelsTr from './__fixtures__/labels.tr.fixture.json';

const svc = createTaxonomyService({
  tree: tree as TaxNode[],
  labels: { en: labelsEn as Record<string, string>, tr: labelsTr as Record<string, string> },
  taxonomyVersion: 7,
});

describe('taxonomyService.node', () => {
  it('var olan düğümü döner', () => {
    expect(svc.node('267')).toEqual({ id: '267', parentId: '5181', depth: 3 });
  });
  it('olmayan düğümde undefined döner (throw etmez)', () => {
    expect(svc.node('electronics.phones')).toBeUndefined();
  });
});

describe('taxonomyService.children', () => {
  it('null → depth-0 kökleri döner', () => {
    expect(svc.children(null).map((n) => n.id).sort()).toEqual(['1604', '166', '222']);
  });
  it('bir düğümün doğrudan çocuklarını döner', () => {
    expect(svc.children('222').map((n) => n.id)).toEqual(['262']);
  });
  it('çocuğu olmayan düğümde boş dizi döner', () => {
    expect(svc.children('267')).toEqual([]);
  });
});

describe('taxonomyService.ancestors', () => {
  it('kökten id-1\'e sıralı atalar (id hariç)', () => {
    expect(svc.ancestors('267').map((n) => n.id)).toEqual(['222', '262', '5181']);
  });
  it('kök düğümün atası yok', () => {
    expect(svc.ancestors('222')).toEqual([]);
  });
  it('olmayan düğümde boş dizi (throw etmez)', () => {
    expect(svc.ancestors('nope')).toEqual([]);
  });
});

describe('taxonomyService.label', () => {
  it('istenen dilde label döner', () => {
    expect(svc.label('267', 'tr')).toBe('Cep Telefonları');
  });
  it('eksik dilde en\'e düşer', () => {
    expect(svc.label('267', 'de')).toBe('Mobile Phones');
  });
  it('hiç label yoksa id\'ye düşer (throw etmez)', () => {
    expect(svc.label('999', 'en')).toBe('999');
  });
});

describe('taxonomyService.path', () => {
  it('atalar + self label dizisi (breadcrumb)', () => {
    expect(svc.path('267', 'en')).toEqual(['Electronics', 'Communications', 'Telephony', 'Mobile Phones']);
  });
  it('kök düğümde tek elemanlı', () => {
    expect(svc.path('222', 'tr')).toEqual(['Elektronik']);
  });
  it('olmayan düğümde ham id\'yi tek eleman döner (kırılmaz)', () => {
    expect(svc.path('electronics.phones', 'en')).toEqual(['electronics.phones']);
  });
});

describe('taxonomyService.version', () => {
  it('meta taxonomyVersion döner', () => {
    expect(svc.version()).toBe(7);
  });
});
