# Age & Date Calculator (`agecalc`)

A modern, high-precision, multilingual Age and Date Calculator platform built with Astro (static output), Preact islands, and Tailwind CSS v4, architected for zero-latency client-side computation, 100% privacy, and immediate Google AdSense policy approval.

---

## Key Features & Architecture

### 1. Mathematical Accuracy & Calendar Edge Cases
- **Gregorian Calendar Alignment:** Accurate calculations accounting for 4-year leap years, 100-year non-leap years, and 400-year leap rules.
- **Daylight Saving Time (DST) Neutrality:** UTC day numbers avoid 23/25-hour day transition artifacts.
- **Client-Side Privacy:** 100% of calculations execute directly in the user's browser. Zero dates or personal milestones are ever transmitted to any server.

### 2. Linear Software-Craft Design System
- **Dark Theme:** Deep obsidian canvas (`#010102`), sleek card surfaces (`#0f1011`, `#141516`), hairline borders (`#23252a`), and lavender-blue accent (`#5e6ad2`).
- **Day Mode (Light Theme):** Professional high-contrast day theme (`#ffffff` canvas, `#f8f9fa` cards, `#e2e4e8` borders, `#0f1011` text).
- **Strict Zero-Emoji Policy:** Clean, vector-only iconography (`favicon.svg`, `logo.svg`, breadcrumb chevrons, theme toggles, and status indicators) without a single emoji anywhere in the codebase.
- **Generous Layout Spacing:** Proportional margins and padding across all desktop and mobile viewports.

### 3. Chronological Fact Engine
- Dynamically generates single, mathematically precise astronomical, biological, historical, and geological facts tied directly to the exact calculation result (e.g. Earth's orbital distance in km, human heartbeats, planetary orbits).

### 4. Internationalization & Search Keyword Goldmine
- High-intent localized terminology, educational guides, and FAQs across English (`en`), Spanish (`es`), and Portuguese (`pt`).
- Bidirectional `hreflang` tags, strict trailing slash enforcement, XML sitemaps, and Schema.org rich snippets (`WebApplication`, `FAQPage`, `BreadcrumbList`).

### 5. Google AdSense & CMP Compliance
- **Google Consent Mode v2:** Default denial for `ad_storage`, `ad_user_data`, `ad_personalization`, and `analytics_storage`.
- **Auto-Ads Ready:** Automated script loader ready to trigger Google Auto-Ads cleanly after account verification.
- **Valid `ads.txt`:** Fully compliant IAB format located in `public/ads.txt`.
- **Comprehensive Trust Pages:** Complete About, Contact, Privacy Policy, Terms of Service, Cookies, and Methodology in all supported languages.

---

## Suite of Calculators

1. **Age Calculator (`/`, `/es/`, `/pt/`):** Exact age in discrete years, months, and days, total elapsed units, astrological sign, life milestones, and dynamic chronological facts.
2. **Days Between Dates (`/tools/days-between-dates/`):** Exact calendar duration, inclusive vs exclusive counts, calendar weeks, working days (Monday-Friday), weekend days, and elapsed hours.
3. **Days Alive Calculator (`/tools/days-alive/`):** Total days lived on Earth and countdown to next 5,000 / 10,000-day milestone.
4. **Add or Subtract Days (`/tools/add-subtract-days/`):** Date shifting with month-end boundary clamping.
5. **Birthday Countdown (`/tools/birthday-countdown/`):** Real-time countdown to next anniversary with leap year detection.
6. **Half-Birthday Calculator (`/tools/half-birthday/`):** Exact 6-month halfway celebration point.
7. **Pet Age in Human Years (`/tools/pet-age/`):** Veterinary non-linear physiological stage conversion for dogs and cats.

---

## Project Structure

```
agecalc/
├── docs/
│   ├── cloudflare-setup.md           # Production Cloudflare settings & WAF rules
│   ├── seo-launch-checklist.md       # Search Console & indexing checklist
│   ├── adsense-readiness-checklist.md# AdSense audit report
│   └── design-implementation-notes.md# Design system tokens and styling notes
├── public/
│   ├── _headers                      # HSTS, CSP, and immutable cache rules
│   ├── _redirects                    # Trailing slash and canonical redirects
│   ├── ads.txt                       # Certified IAB ads.txt file
│   ├── robots.txt                    # Mediapartners-Google & Googlebot rules
│   ├── favicon.svg                   # Branded chronometer vector mark
│   ├── logo.svg                      # Master vector brand mark
│   └── og/                           # Localized Open Graph social images
├── src/
│   ├── components/
│   │   ├── Calculator.tsx            # Main age calculator island
│   │   ├── InterestingFactsCard.tsx  # Dynamic chronological facts island
│   │   ├── ToolsHub.astro            # Localized tools showcase
│   │   └── tools/                    # Dedicated tool calculator islands
│   ├── i18n/                         # Translations and localized dictionaries
│   ├── layouts/
│   │   └── BaseLayout.astro          # SEO, Consent Mode v2, and metadata layout
│   ├── lib/
│   │   ├── age.ts                    # Core age calculation library
│   │   ├── dateTools.ts              # Date tools calculation library
│   │   └── interestingFacts.ts       # Chronological fact calculation engine
│   ├── pages/                        # Static localized page routes
│   └── styles/
│       └── global.css                # Linear design system & Day Mode styling
├── tests/
│   ├── age.test.ts                   # Vitest unit tests (80 tests)
│   ├── dateTools.test.ts             # Vitest unit tests (22 tests)
│   └── e2e.spec.ts                   # Playwright visual & axe-core a11y tests
├── scripts/
│   ├── validate-seo-and-links.mjs    # SEO, broken link, and trailing slash auditor
│   └── verify-adsense-readiness.mjs  # AdSense compliance & policy verification
└── wrangler.jsonc                    # Cloudflare Workers Static Assets config
```

---

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Local Development Server
```bash
npm run dev
```
Open `http://localhost:4321` in your browser.

### 3. Unit Tests
```bash
npm run test:unit
```
Runs 102 comprehensive Vitest unit tests covering leap years, DST transitions, negative spans, milestone projections, and boundary conditions.

### 4. Technical SEO & AdSense Policy Audit
```bash
npm run audit
```
Audits all 45 generated static HTML pages for:
- Exact canonical links and trailing slash enforcement
- Bidirectional `hreflang` alternates
- Meta title ($\le 60$ chars) and description ($\le 155$ chars) lengths
- Word count sufficiency ($> 800$ words per homepage)
- Required trust pages, `ads.txt`, and Google Consent Mode v2 tags

### 5. Playwright E2E & Accessibility Tests
```bash
npm run test:e2e
```
Executes WCAG 2.1 AA accessibility checks and captures desktop and mobile screenshots across both Dark Mode and Day Mode.

---

## Deployment to Cloudflare

### Method 1: Cloudflare Workers Static Assets (Default)
```bash
# Build production bundle and publish to Cloudflare Workers
npm run deploy
```

### Method 2: Cloudflare Pages Fallback
1. Connect your repository to **Cloudflare Dashboard > Workers & Pages > Create > Pages > Connect to Git**.
2. **Build command:** `npm run build`
3. **Build output directory:** `dist`
4. **Environment variables:** Set `NODE_VERSION` to `20.18.0` or higher.
5. Deploy. Cloudflare automatically applies `_headers` and `_redirects`.

For full configuration instructions (SSL Full Strict, Rocket Loader OFF, WAF crawler exemptions), see [docs/cloudflare-setup.md](file:///Users/aaradhyapathak/agecalc/docs/cloudflare-setup.md).

---

## License
MIT

