import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'functions/**/*.test.ts'],
    environment: 'node',
    setupFiles: ['src/storefront/test-setup.ts'],
    // jsdom-env tests (// @vitest-environment jsdom) need a concrete origin so
    // localStorage is not disabled by the opaque about:blank default.
    environmentOptions: {
      jsdom: { url: 'https://photozseo.com/' },
    },
  },
});
