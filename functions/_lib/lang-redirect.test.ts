import { describe, it, expect } from 'vitest';
import { doubleLangRedirect } from './lang-redirect';

describe('doubleLangRedirect', () => {
  it('collapses doubled language prefixes to the second language', () => {
    expect(doubleLangRedirect('/de/pl/features/platform-presets/')).toBe('/pl/features/platform-presets/');
    expect(doubleLangRedirect('/pl/fr/accessibility/')).toBe('/fr/accessibility/');
    expect(doubleLangRedirect('/zh/pl/features/seo-filenames')).toBe('/pl/features/seo-filenames/');
    expect(doubleLangRedirect('/tr/en/pricing/')).toBe('/pricing/');
  });
  it('ignores normal paths', () => {
    for (const p of ['/', '/de/terms/', '/pl/features/x/', '/blog/post/', '/ja', '/de/privacy']) expect(doubleLangRedirect(p)).toBeNull();
  });
});
