// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://photozseo.com',
  integrations: [sitemap(), react()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'tr', 'es', 'de', 'ja', 'pt', 'hi', 'ur', 'ar', 'fa', 'ko'],
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
