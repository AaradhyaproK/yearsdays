import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Read LAUNCH_LANGS from environment or default to 'en,es,pt'
const launchLangs = (process.env.LAUNCH_LANGS || 'en,es,pt')
  .split(',')
  .map((l) => l.trim().toLowerCase());

const siteUrl = process.env.SITE_URL || 'https://yearsdays.com';

export default defineConfig({
  site: siteUrl,
  output: 'static',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    preact(),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          es: 'es',
          pt: 'pt-BR',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: launchLangs,
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
});

