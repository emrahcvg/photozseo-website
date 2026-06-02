import { describe, it, expect } from 'vitest';
import { createTaxonomyService, type TaxNode } from './service';
import { resolveCategoryName, categoryBreadcrumb } from './category-resolve';
import tree from './__fixtures__/tree.fixture.json';
import labelsEn from './__fixtures__/labels.en.fixture.json';
import labelsTr from './__fixtures__/labels.tr.fixture.json';

const svc = createTaxonomyService({
  tree: tree as TaxNode[],
  labels: { en: labelsEn as Record<string, string>, tr: labelsTr as Record<string, string> },
  taxonomyVersion: 1,
});

describe('resolveCategoryName', () => {
  it('manifest adı varsa onu kullanır (öncelik 1)', () => {
    expect(resolveCategoryName('267', { en: 'My Custom Phones' }, 'en', svc)).toBe('My Custom Phones');
  });
  it("manifest adı boşsa svc.label'a düşer", () => {
    expect(resolveCategoryName('267', undefined, 'tr', svc)).toBe('Cep Telefonları');
    expect(resolveCategoryName('267', {}, 'en', svc)).toBe('Mobile Phones');
  });
  it('hiçbiri çözülmezse "Other"/"Diğer" döner', () => {
    expect(resolveCategoryName('c1', undefined, 'en', svc)).toBe('Other');
    expect(resolveCategoryName('c1', undefined, 'tr', svc)).toBe('Diğer');
  });
  it('null categoryId → "Other"', () => {
    expect(resolveCategoryName(undefined, undefined, 'en', svc)).toBe('Other');
  });
});

describe('categoryBreadcrumb', () => {
  it('çözülen id için tam yol + id segmentleri', () => {
    expect(categoryBreadcrumb('267', 'en', svc)).toEqual([
      { id: '222', label: 'Electronics' },
      { id: '262', label: 'Communications' },
      { id: '5181', label: 'Telephony' },
      { id: '267', label: 'Mobile Phones' },
    ]);
  });
  it('çözülemeyen id → null (breadcrumb gizlenir)', () => {
    expect(categoryBreadcrumb('electronics.phones', 'en', svc)).toBeNull();
    expect(categoryBreadcrumb(undefined, 'en', svc)).toBeNull();
  });
});
