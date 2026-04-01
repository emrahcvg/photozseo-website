// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'tr', 'es', 'de', 'ja', 'pt', 'hi', 'ur', 'ar', 'fa', 'ko'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
