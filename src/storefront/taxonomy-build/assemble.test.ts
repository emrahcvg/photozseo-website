import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { assemble } from './assemble';

const read = (f: string) =>
  readFileSync(fileURLToPath(new URL(`./fixtures/${f}`, import.meta.url)), 'utf-8');

const sources: Record<string, string | null> = {
  en: read('sample-en.txt'),
  de: read('sample-de.txt'),
  ar: null, // Google'da yok → çeviri yolu
};

// Sahte çevirmen: id->en map alır, deterministik "AR:<en>" döndürür.
const fakeTranslate = async (lang: string, idToEn: Record<string, string>) => {
  const out: Record<string, string> = {};
  for (const [id, en] of Object.entries(idToEn)) out[id] = `${lang.toUpperCase()}:${en}`;
  return out;
};

describe('assemble', () => {
  it('en kaynağından tree üretir', async () => {
    const r = await assemble(sources, fakeTranslate);
    expect(r.tree.find((n) => n.id === '212')).toEqual({
      id: '212', parentId: '1604', depth: 2,
    });
  });

  it('Google locale olan dilin label larını o kaynaktan alır', async () => {
    const r = await assemble(sources, fakeTranslate);
    expect(r.labels.de['166']).toBe('Bekleidung & Accessoires');
  });

  it('Google locale olmayan dili translateFn ile doldurur', async () => {
    const r = await assemble(sources, fakeTranslate);
    expect(r.labels.ar['166']).toBe('AR:Apparel & Accessories');
  });

  it('her dil tree deki tüm id leri kapsar', async () => {
    const r = await assemble(sources, fakeTranslate);
    const ids = r.tree.map((n) => n.id).sort();
    for (const lang of Object.keys(sources)) {
      expect(Object.keys(r.labels[lang]).sort()).toEqual(ids);
    }
  });

  it('meta.googleVersion en başlığından gelir', async () => {
    const r = await assemble(sources, fakeTranslate);
    expect(r.meta.googleVersion).toBe('2026-03-15');
  });

  it('Google locale dosyası bir id i içermiyorsa hata fırlatır', async () => {
    const broken = { en: sources.en, de: read('sample-en.txt').replace(/^212 .*$/m, '') };
    await expect(assemble(broken, fakeTranslate)).rejects.toThrow(/eksik id/);
  });

  it('en kaynağı hiç giriş içermiyorsa (hata sayfası) hata fırlatır', async () => {
    const broken = { en: '<html>error page</html>' };
    await expect(assemble(broken, fakeTranslate)).rejects.toThrow(/en kaynağı boş\/geçersiz/);
  });
});
