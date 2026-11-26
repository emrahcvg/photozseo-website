import { readFileSync, writeFileSync } from 'node:fs';
import { pricing } from './src/i18n/pages/pricing';
import { download } from './src/i18n/pages/download';
import { about } from './src/i18n/pages/about';
import { imageSizes } from './src/i18n/pages/image-sizes';
import { alternatives } from './src/i18n/pages/alternatives';

const src = readFileSync('./src/i18n/home.ts', 'utf8');
const start = src.indexOf('const en: HomeContent = {');
const end = src.indexOf('};\n\n// Locale dictionary');
const objText = src.slice(start + 'const en: HomeContent = '.length, end + 1);
const home = new Function(`return (${objText});`)();

const out = {
  home,
  pages: {
    pricing: pricing.en, download: download.en, about: about.en,
    'marketplace-image-sizes': imageSizes.en, alternatives: alternatives.en,
  },
  nav: JSON.parse(readFileSync(process.argv[2], 'utf8')).nav,
};
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log('ok', Object.keys(out.pages).length);
