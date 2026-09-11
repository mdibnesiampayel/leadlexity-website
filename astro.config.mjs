import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || undefined,
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'never',
  server: { host: '0.0.0.0', port: 4321, allowedHosts: true },
  vite: {
    server: { host: '0.0.0.0', allowedHosts: true },
    preview: { host: '0.0.0.0', allowedHosts: true },
  },
  build: { inlineStylesheets: 'never' },
});
