import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');

if (!fs.existsSync(DIST_DIR)) {
  console.error('Error: dist directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(DIST_DIR);
console.log(`Auditing ${htmlFiles.length} generated HTML pages for Technical SEO & Broken Links...\n`);

let errorsCount = 0;
let warningsCount = 0;

for (const filePath of htmlFiles) {
  const relPath = path.relative(DIST_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf-8');

  // 1. Verify Title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  if (!titleMatch) {
    console.error(`❌ [${relPath}]: Missing <title> tag`);
    errorsCount++;
  } else {
    const titleText = titleMatch[1].trim();
    if (titleText.length > 60) {
      console.warn(`⚠️ [${relPath}]: Title length is ${titleText.length} (> 60 chars): "${titleText}"`);
      warningsCount++;
    }
  }

  // 2. Verify Meta Description
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  if (!descMatch && !relPath.includes('404')) {
    console.error(`❌ [${relPath}]: Missing meta description`);
    errorsCount++;
  } else if (descMatch) {
    const descText = descMatch[1].trim();
    if (descText.length > 155) {
      console.warn(`⚠️ [${relPath}]: Meta description is ${descText.length} (> 155 chars): "${descText}"`);
      warningsCount++;
    }
  }

  // 3. Verify exactly one <h1>
  const h1Matches = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
  if (!h1Matches) {
    console.error(`❌ [${relPath}]: Missing <h1> tag`);
    errorsCount++;
  } else if (h1Matches.length > 1) {
    console.error(`❌ [${relPath}]: Multiple <h1> tags found (${h1Matches.length})`);
    errorsCount++;
  }

  // 4. Verify Canonical Tag (Trailing Slash)
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  if (!canonicalMatch && !relPath.includes('404')) {
    console.error(`❌ [${relPath}]: Missing canonical tag`);
    errorsCount++;
  } else if (canonicalMatch) {
    const canonicalUrl = canonicalMatch[1];
    if (!canonicalUrl.endsWith('/')) {
      console.error(`❌ [${relPath}]: Canonical URL "${canonicalUrl}" is missing trailing slash`);
      errorsCount++;
    }
  }

  // 5. Verify Internal Links Exist in dist/
  const linkMatches = [...content.matchAll(/<a\s+[^>]*href=["']([^"']*)["']/gi)];
  for (const match of linkMatches) {
    const href = match[1];
    // Skip anchor hashes, tel, mailto, javascript, and external URLs
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('http') ||
      href.startsWith('javascript:')
    ) {
      continue;
    }

    const cleanHref = href.split('?')[0].split('#')[0];
    let expectedPath;
    if (cleanHref.endsWith('/')) {
      expectedPath = path.join(DIST_DIR, cleanHref, 'index.html');
    } else if (
      cleanHref.endsWith('.html') ||
      cleanHref.endsWith('.svg') ||
      cleanHref.endsWith('.txt') ||
      cleanHref.endsWith('.xml')
    ) {
      expectedPath = path.join(DIST_DIR, cleanHref);
    } else {
      expectedPath = path.join(DIST_DIR, cleanHref, 'index.html');
    }

    if (!fs.existsSync(expectedPath) && !expectedPath.endsWith('/404/index.html')) {
      console.error(`❌ [${relPath}]: Broken internal link to "${href}" (Expected: ${expectedPath})`);
      errorsCount++;
    }
  }
}

// 6. Verify 404 page exists
const notFoundPath = path.join(DIST_DIR, '404.html');
if (!fs.existsSync(notFoundPath)) {
  console.error('❌ dist/404.html does not exist!');
  errorsCount++;
} else {
  console.log('✓ dist/404.html exists.');
}

// 7. Verify Sitemap Index & Direct Sitemap
const sitemapPath = path.join(DIST_DIR, 'sitemap-index.xml');
const directSitemapPath = path.join(DIST_DIR, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('❌ dist/sitemap-index.xml does not exist!');
  errorsCount++;
} else {
  console.log('✓ dist/sitemap-index.xml exists.');
}
if (!fs.existsSync(directSitemapPath)) {
  console.error('❌ dist/sitemap.xml does not exist!');
  errorsCount++;
} else {
  console.log('✓ dist/sitemap.xml exists (with all URLs).');
}

// 8. Verify robots.txt
const robotsPath = path.join(DIST_DIR, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  console.error('❌ dist/robots.txt does not exist!');
  errorsCount++;
} else {
  console.log('✓ dist/robots.txt exists.');
}

console.log(`\nAudit completed: ${errorsCount} Errors, ${warningsCount} Warnings.`);

if (errorsCount > 0) {
  process.exit(1);
} else {
  console.log('✅ Technical SEO & Link Validation Passed with 0 Errors!');
  process.exit(0);
}

