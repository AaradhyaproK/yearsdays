import fs from 'node:fs';
import path from 'node:path';

console.log('--- Verifying Google AdSense Readiness & Policy Compliance ---');

let errors = 0;
let warnings = 0;

function reportPass(msg) {
  console.log(`✓ ${msg}`);
}

function reportFail(msg) {
  console.error(`✗ ERROR: ${msg}`);
  errors++;
}

function reportWarn(msg) {
  console.warn(`! WARNING: ${msg}`);
  warnings++;
}

// 1. Check ads.txt
const adsTxtPath = path.resolve('dist/ads.txt');
if (fs.existsSync(adsTxtPath)) {
  const content = fs.readFileSync(adsTxtPath, 'utf8');
  if (content.includes('google.com, pub-') && content.includes('DIRECT, f08c47fec0942fa0')) {
    reportPass('ads.txt exists in dist/ with valid format and certification ID.');
  } else {
    reportFail('ads.txt exists but does not match standard IAB format.');
  }
} else {
  reportFail('dist/ads.txt is missing.');
}

// 2. Check robots.txt for Mediapartners-Google and Googlebot
const robotsPath = path.resolve('dist/robots.txt');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (robots.includes('User-agent: Mediapartners-Google') && robots.includes('Allow: /')) {
    reportPass('robots.txt explicitly allows Mediapartners-Google.');
  } else {
    reportFail('robots.txt missing explicit Mediapartners-Google allow rule.');
  }
  if (robots.includes('User-agent: Googlebot') && robots.includes('Allow: /')) {
    reportPass('robots.txt explicitly allows Googlebot.');
  } else {
    reportFail('robots.txt missing Googlebot allow rule.');
  }
} else {
  reportFail('dist/robots.txt is missing.');
}

// 3. Check Trust Pages
const requiredTrustPages = [
  'about/index.html',
  'contact/index.html',
  'privacy/index.html',
  'terms/index.html',
  'cookies/index.html',
  'methodology/index.html',
  'es/about/index.html',
  'es/contact/index.html',
  'es/privacy/index.html',
  'es/terms/index.html',
  'es/cookies/index.html',
  'es/methodology/index.html',
  'pt/about/index.html',
  'pt/contact/index.html',
  'pt/privacy/index.html',
  'pt/terms/index.html',
  'pt/cookies/index.html',
  'pt/methodology/index.html',
];

for (const page of requiredTrustPages) {
  const pagePath = path.resolve('dist', page);
  if (fs.existsSync(pagePath)) {
    reportPass(`Trust page verified: ${page}`);
  } else {
    reportFail(`Missing required trust page: ${page}`);
  }
}

// 4. Content Sufficiency Check (Word Count >= 800 for major landing pages)
const editorialPages = [
  { file: 'dist/index.html', name: 'English Homepage' },
  { file: 'dist/es/index.html', name: 'Spanish Homepage' },
  { file: 'dist/pt/index.html', name: 'Portuguese Homepage' },
];

for (const { file, name } of editorialPages) {
  const fullPath = path.resolve(file);
  if (fs.existsSync(fullPath)) {
    const html = fs.readFileSync(fullPath, 'utf8');
    // Strip scripts, styles, and HTML tags to estimate visible prose words
    const textOnly = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const wordCount = textOnly.split(/\s+/).length;

    if (wordCount >= 800) {
      reportPass(`${name} content sufficiency: ${wordCount} words (>= 800 words target).`);
    } else {
      reportFail(`${name} content is too thin: ${wordCount} words (target >= 800).`);
    }
  } else {
    reportFail(`Page not found for word count check: ${file}`);
  }
}

// 5. Check Privacy Policy Disclosures
const privacyHtml = fs.readFileSync(path.resolve('dist/privacy/index.html'), 'utf8');
const disclosures = [
  { pattern: /Google AdSense/i, desc: 'Mentions Google AdSense' },
  { pattern: /cookie/i, desc: 'Mentions cookies' },
  { pattern: /adssettings\.google\.com|google\.com\/settings\/ads/i, desc: 'Google Ad Settings opt-out link' },
  { pattern: /optout\.networkadvertising\.org/i, desc: 'NAI opt-out link' },
  { pattern: /youronlinechoices|aboutads\.info/i, desc: 'EDAA / DAA opt-out link' },
  { pattern: /GDPR|RGPD|LGPD|CCPA/i, desc: 'Privacy regulation disclosures (GDPR/LGPD/CCPA)' },
  { pattern: /support@(yearsdays\.info|agecalc\.pages\.dev)/i, desc: 'Official contact email' },
];

for (const { pattern, desc } of disclosures) {
  if (pattern.test(privacyHtml)) {
    reportPass(`Privacy policy disclosure: ${desc}.`);
  } else {
    reportFail(`Privacy policy missing required disclosure: ${desc}`);
  }
}

// 6. Check Google Consent Mode v2 in <head>
const indexHtml = fs.readFileSync(path.resolve('dist/index.html'), 'utf8');
if (indexHtml.includes("'ad_storage': 'denied'") && indexHtml.includes("'analytics_storage': 'denied'")) {
  reportPass('Google Consent Mode v2 default denial script verified in <head>.');
} else {
  reportFail('Google Consent Mode v2 script is missing or misconfigured in <head>.');
}

// 7. Check Google AdSense Auto-Ads Readiness
const baseLayoutSrc = fs.readFileSync(path.resolve('src/layouts/BaseLayout.astro'), 'utf8');
if (baseLayoutSrc.includes('pagead2.googlesyndication.com') && baseLayoutSrc.includes('adsEnabled')) {
  reportPass('Google Auto-Ads tag loader configured for seamless post-approval injection.');
} else {
  reportFail('Google Auto-Ads tag loader missing in BaseLayout.astro.');
}

console.log('-----------------------------------------------------------');
console.log(`AdSense Readiness Audit Completed: ${errors} Errors, ${warnings} Warnings.`);

if (errors > 0) {
  process.exit(1);
} else {
  console.log('✅ 100% AdSense Policy & Layout Compliant!');
}
