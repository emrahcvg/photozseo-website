import { describe, it, expect } from 'vitest';
import { renderSafetyBlock, parseSafetyJson } from './product-safety';
import { storeRecordToProductRows, upsertStoreToD1, getProductById } from '../../functions/_lib/marketplace';
import { makeSqliteD1 } from '../../functions/_lib/sqliteD1';

describe('renderSafetyBlock (GPSR)', () => {
  it('satıcı hiçbir alan girmediyse hiçbir şey basmaz', () => {
    expect(renderSafetyBlock({}, 'en')).toBe('');
    expect(renderSafetyBlock(null, 'en')).toBe('');
  });
  it('üretici, AB sorumlusu, kimlik ve uyarıları etiketleriyle gösterir', () => {
    const html = renderSafetyBlock({
      manufacturerName: 'Anadolu Dokuma Ltd.', manufacturerAddress: 'Uşak, TR', manufacturerContact: 'info@anadolu.example',
      euResponsibleName: 'EU Rep GmbH', identifiers: ['SKU-1', '8690000000001'], warnings: 'Keep away from fire.',
    }, 'de');
    expect(html).toContain('Hersteller');
    expect(html).toContain('Verantwortliche Person in der EU');
    expect(html).toContain('SKU-1 · 8690000000001');
    expect(html).toContain('Keep away from fire.');
  });
  it('satıcı girdisini kaçışlar (XSS yok)', () => {
    const html = renderSafetyBlock({ manufacturerName: '<script>alert(1)</script>' }, 'en');
    expect(html).not.toContain('<script>alert');
  });
  it('bozuk JSON → null', () => {
    expect(parseSafetyJson('{bozuk')).toBeNull();
  });
});

describe('GPSR verisi D1 → pazar yeri ürün sayfası', () => {
  const record = {
    updatedAt: '2026-10-22T00:00:00Z',
    manifest: {
      version: 1, languages: ['tr'],
      store: { slug: 'acme', displayName: 'ACME', currency: 'TRY', marketplaceListed: true, contact: {}, city: 'Uşak', country: 'TR' },
      products: [
        { id: 'p1', title: { tr: 'Kilim' }, images: [], sku: 'K-45', safety: { manufacturerName: 'ACME', warnings: { tr: 'Ateşten uzak tutun', en: 'Keep away from fire' } } },
        { id: 'p2', title: { tr: 'Tava' }, images: [] },
      ],
    },
  } as never;
  it('yalnız bilgi olan ürüne safety_json yazar', () => {
    const rows = storeRecordToProductRows('acme', record);
    expect(JSON.parse(rows[0].safety_json!)).toMatchObject({ manufacturerName: 'ACME', identifiers: ['K-45'] });
    const safety = parseSafetyJson(rows[0].safety_json);
    expect(renderSafetyBlock(safety, 'tr')).toContain('Ateşten uzak tutun');
    expect(renderSafetyBlock(safety, 'en')).toContain('Keep away from fire');
    expect(rows[1].safety_json).toBeNull();
  });
  it('gerçek SQLite\'ta kaydedilir ve ürün sayfası sorgusunda döner', async () => {
    const { db } = makeSqliteD1();
    await upsertStoreToD1(db as never, 'acme', record);
    const row = await getProductById(db as never, 'acme:kilim');
    expect(parseSafetyJson(row?.safety_json)?.manufacturerName).toBe('ACME');
  });
});
