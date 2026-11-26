import type { PageSet, PageDoc } from './types';
import type { Lang } from '../ui';
import { pricing } from './pricing';
import { download } from './download';
import { about } from './about';
import { imageSizes } from './image-sizes';
import { alternatives } from './alternatives';

export type InfoSlug = 'pricing' | 'download' | 'about' | 'marketplace-image-sizes' | 'alternatives';

// Otomatik çeviriler: gen/<slug>.<lang>.json (scratchpad/i18n/site.py üretir). Elle yazılmış diller (en, tr) önceliklidir.
const generated = import.meta.glob<{ default: PageDoc }>('./gen/*.json', { eager: true });
function withGenerated(slug: string, set: PageSet): PageSet {
  const out: PageSet = { ...set };
  for (const path in generated) {
    const m = path.match(/\.\/gen\/(.+)\.([a-z]{2})\.json$/);
    if (!m || m[1] !== slug) continue;
    const lang = m[2] as Lang;
    if (!out[lang]) out[lang] = generated[path].default;
  }
  return out;
}

export const INFO_PAGES: Record<InfoSlug, { set: PageSet; pageType: 'WebPage' | 'AboutPage' | 'ItemPage' | 'CollectionPage'; app?: boolean }> = {
  pricing: { set: withGenerated('pricing', pricing), pageType: 'WebPage', app: true },
  download: { set: withGenerated('download', download), pageType: 'ItemPage', app: true },
  about: { set: withGenerated('about', about), pageType: 'AboutPage' },
  'marketplace-image-sizes': { set: withGenerated('marketplace-image-sizes', imageSizes), pageType: 'WebPage' },
  alternatives: { set: withGenerated('alternatives', alternatives), pageType: 'WebPage' },
};
