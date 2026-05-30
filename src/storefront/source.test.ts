import { describe, it, expect } from 'vitest';
import { getAllManifests, getManifestBySlug } from './source';

describe('source', () => {
  it('fixture klasöründeki manifestleri yükler', () => {
    const all = getAllManifests();
    expect(all.length).toBeGreaterThan(0);
  });
  it('slug ile manifest bulur', () => {
    const m = getManifestBySlug('ahmet-oto-yedek');
    expect(m?.store.displayName).toBe('Ahmet Oto Yedek');
  });
  it('olmayan slug için undefined döner', () => {
    expect(getManifestBySlug('yok-boyle-bir-magaza')).toBeUndefined();
  });
});
