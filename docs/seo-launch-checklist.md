# SEO & AdSense Launch Verification Checklist

Complete this checklist upon pointing your custom domain to Cloudflare to guarantee immediate indexing, flawless multilingual routing, and first-attempt Google AdSense approval.

---

## 1. Google Search Console & Bing Webmaster Verification

- [ ] **Domain Property Verification:** Add the domain using DNS TXT record in Cloudflare DNS for complete domain coverage (all protocols and subdomains).
- [ ] **Sitemap Submission:**
  - Submit URL: `https://yourdomain.com/sitemap-index.xml`
  - Verify that Search Console fetches all child sitemaps (`sitemap-0.xml`) and discovers all 45+ localized URLs.
- [ ] **URL Inspection & Live Test:**
  - Test `https://yourdomain.com/`
  - Test `https://yourdomain.com/es/`
  - Test `https://yourdomain.com/pt/`
  - Test `https://yourdomain.com/tools/days-between-dates/`
  - Verify that Googlebot renders the client-side calculator without errors and reads all semantic copy.

---

## 2. Technical SEO & Hreflang Validation

- [ ] **Canonical URL Matching:** Every page must specify its own absolute canonical URL with strict trailing slash.
- [ ] **Bidirectional Hreflang Clustering:**
  - `en` canonical -> `es`, `pt`, `x-default`
  - `es` canonical -> `en`, `pt`, `x-default`
  - `pt` canonical -> `en`, `es`, `x-default`
  - All hreflang alternate URLs must exist, return HTTP 200, and include trailing slashes.
- [ ] **Schema.org Rich Results Test:**
  - Run Google Rich Results Test (`https://search.google.com/test/rich-results`).
  - Verify `WebApplication` schema.
  - Verify `BreadcrumbList` schema.
  - Verify `FAQPage` schema on all tool pages.
  - Ensure zero warnings and zero schema errors.

---

## 3. Google AdSense Application Preparation

- [ ] **Domain Maturity & Quality Check:**
  - 100% original copy (over 1,200 words on English homepage, 1,500 on Spanish, 1,400 on Portuguese).
  - High-intent long-tail keywords and localized terminology in all tools.
  - Zero placeholder content, zero broken links, zero dummy texts.
- [ ] **Trust & Compliance Pages Live:**
  - About Us (`/about/`, `/es/about/`, `/pt/about/`)
  - Contact Us (`/contact/`, `/es/contact/`, `/pt/contact/`) with legitimate contact email.
  - Privacy Policy (`/privacy/`, `/es/privacy/`, `/pt/privacy/`) with AdSense cookie disclosures and opt-out links.
  - Terms of Service (`/terms/`, `/es/terms/`, `/pt/terms/`)
  - Cookie Policy (`/cookies/`, `/es/cookies/`, `/pt/cookies/`)
  - Calculation Methodology (`/methodology/`, `/es/methodology/`, `/pt/methodology/`)
- [ ] **`ads.txt` Accessibility:**
  - Access `https://yourdomain.com/ads.txt` in an incognito window.
  - Replace `pub-0000000000000000` with your actual AdSense publisher ID once your account is created.
- [ ] **Google Consent Mode v2 Check:**
  - Verify in DevTools Console that `ad_storage`, `ad_user_data`, `ad_personalization`, and `analytics_storage` are initially `'denied'`.
  - When approval is granted, configure Google Auto-Ads in the AdSense console (`Sites > Auto ads ON`).

---

## 4. Performance & Core Web Vitals (CWV)

- [ ] **PageSpeed Insights Test:**
  - Target: **95+ on Mobile**, **99+ on Desktop**.
  - **LCP (Largest Contentful Paint):** < 1.2s
  - **INP (Interaction to Next Paint):** < 50ms (Pure client-side synchronous state calculation)
  - **CLS (Cumulative Layout Shift):** 0.00 (Reserved layouts with zero shifts)
- [ ] **No Emojis:** Zero emoji characters across all pages and metadata.
- [ ] **Dark & Light Mode:** Tested across mobile and desktop viewports with WCAG 2.1 AA compliant contrast.

