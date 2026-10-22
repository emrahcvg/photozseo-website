// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

const locales = ['en', 'zh', 'tr', 'es', 'de', 'ja', 'pt', 'hi', 'ur', 'ar', 'fa', 'ko', 'fr', 'it', 'pl'];

export default defineConfig({
  site: 'https://photozseo.com',
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: Object.fromEntries(locales.map((l) => [l, l])) },
    }),
    react(),
  ],
  i18n: {
    defaultLocale: 'en',
    locales,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    ssr: {
      noExternal: ['gsap'],
    },
  },
});
