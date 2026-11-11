import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Read LAUNCH_LANGS from environment or default to 'en,es,pt'
const launchLangs = (process.env.LAUNCH_LANGS || 'en,es,pt')
  .split(',')
  .map((l) => l.trim().toLowerCase());

const siteUrl = (process.env.SITE_URL || 'https://yearsdays.com').replace(/\/$/, '');

const LOCALE_TO_HREFLANG = {
  en: 'en',
  es: 'es',
  pt: 'pt-BR',
  de: 'de',
  fr: 'fr',
  it: 'it',
  tr: 'tr',
};

// Explicit multilingual clusters for routes with localized slugs
const CUSTOM_CLUSTERS = [
  { en: '/age-on-a-date/', es: '/es/edad-en-una-fecha/', pt: '/pt/idade-em-uma-data/' },
  { en: '/days-alive/', es: '/es/dias-de-vida/', pt: '/pt/dias-de-vida/' },
  { en: '/age-difference/', es: '/es/diferencia-de-edad/', pt: '/pt/diferenca-de-idade/' },
];

function getHreflangLinksForUrl(url) {
  const pathname = new URL(url).pathname;

  // 1. Check custom localized slug clusters first
  const customCluster = CUSTOM_CLUSTERS.find((cluster) =>
    Object.values(cluster).includes(pathname)
  );
  if (customCluster) {
    const links = launchLangs
      .filter((lang) => customCluster[lang])
      .map((lang) => ({
        lang: LOCALE_TO_HREFLANG[lang] || lang,
        url: `${siteUrl}${customCluster[lang]}`,
      }));
    if (customCluster.en) {
      links.push({ lang: 'x-default', url: `${siteUrl}${customCluster.en}` });
    }
    return links;
  }

  // 2. Standard shared-slug routes (/, /tools/, /about/, etc.)
  const baseSlug = pathname.replace(/^\/([a-z]{2})(\/|$)/, '/');
  const links = launchLangs.map((lang) => {
    const localizedPath = lang === 'en' ? baseSlug : `/${lang}${baseSlug}`;
    return {
      lang: LOCALE_TO_HREFLANG[lang] || lang,
      url: `${siteUrl}${localizedPath}`,
    };
  });
  links.push({ lang: 'x-default', url: `${siteUrl}${baseSlug}` });
  return links;
}

const buildDate = new Date().toISOString();

// Ensure dist/sitemap.xml is always written alongside sitemap-index.xml / sitemap-0.xml
function directSitemapPlugin() {
  return {
    name: 'direct-sitemap-copy',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const src = path.join(outDir, 'sitemap-0.xml');
        const dest = path.join(outDir, 'sitemap.xml');
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      },
    },
  };
}

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
      filter: (page) => {
        const pathname = new URL(page).pathname;
        if (pathname.includes('/404')) return false;
        if (
          pathname === '/tools/days-alive/' ||
          pathname === '/es/tools/days-alive/' ||
          pathname === '/pt/tools/days-alive/'
        ) {
          return false;
        }
        return true;
      },
      namespaces: {
        news: false,
        xhtml: true,
        image: false,
        video: false,
      },
      serialize: (item) => ({
        ...item,
        lastmod: buildDate,
        links: getHreflangLinksForUrl(item.url),
      }),
    }),
    directSitemapPlugin(),
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
