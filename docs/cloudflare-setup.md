# Cloudflare Production Deployment & Configuration Guide

This guide details the exact Cloudflare dashboard settings, Workers / Pages deployment steps, and security configurations required for **Age & Date Calculator** (`agecalc`).

---

## 1. Cloudflare Workers Static Assets (Recommended)

The project includes a pre-configured `wrangler.jsonc` targeting Cloudflare Workers Static Assets.

### Deployment Command
```bash
# Build production bundle and publish to Cloudflare Workers
npm run deploy
```

If deploying for the first time:
```bash
npx wrangler login
npm run deploy
```

`wrangler.jsonc` configuration details:
- **name:** `agecalc`
- **compatibility_date:** Current release timestamp
- **assets.directory:** `./dist` (pre-rendered static HTML, SVG, and JS bundles)
- **assets.not_found_handling:** `404-page` (routes missing requests directly to `/404/index.html`)
- **assets.html_handling:** `auto-trailing-slash` (enforces canonical trailing slash structure required for SEO)

---

## 2. Cloudflare Pages Fallback (Alternative Deployment)

If you prefer using the Cloudflare Pages git-connected dashboard:
1. Link your GitHub or GitLab repository in **Cloudflare Dashboard > Workers & Pages > Create application > Pages > Connect to Git**.
2. Set **Build command**: `npm run build`
3. Set **Build output directory**: `dist`
4. Set Node.js environment variable: `NODE_VERSION` = `20.18.0` or higher.
5. Click **Save and Deploy**. Both `_headers` and `_redirects` in `public/` are automatically copied to `dist/` and respected by Cloudflare Pages.

---

## 3. Cloudflare Dashboard Settings

### A. SSL / TLS Encryption
- **Mode:** **Full (Strict)**
- **Edge Certificates:**
  - **Always Use HTTPS:** `ON`
  - **Minimum TLS Version:** `TLS 1.2`
  - **Opportunistic Encryption:** `ON`
  - **TLS 1.3:** `ON`
  - **Automatic HTTPS Rewrites:** `ON`

### B. Speed & Optimization
- **Rocket Loader:** **OFF** (CRITICAL: Rocket Loader modifies inline scripts and breaks client-side Preact island hydration, as well as Google Consent Mode v2 defaults).
- **Auto Minify:** **OFF** for JavaScript and CSS (Vite builds pre-optimized, gzipped chunks; Cloudflare re-minification can introduce syntax regressions).
- **Early Hints:** `ON`
- **Brotli:** `ON`

### C. Security & WAF Rules for AdSense & Googlebot
To ensure Google AdSense reviewers and automated quality bots are never blocked or challenged:
1. **Zero Geo-Blocking:** Do not block any country. Google AdSense evaluation bots and manual human reviewers operate from the United States, Ireland, Singapore, Poland, and India.
2. **Security Level:** Set to `Medium` or `Essentially Off` during domain onboarding.
3. **WAF Bypass Rule for Googlebot:**
   Create a custom WAF Skip Rule under **Security > WAF > Custom Rules**:
   - **Rule Name:** `Allow Googlebot and Mediapartners`
   - **Expression:**
     ```
     (cf.client.bot) or (http.user_agent contains "Googlebot") or (http.user_agent contains "Mediapartners-Google")
     ```
   - **Action:** `Skip > All remaining security features (WAF, Rate Limiting, Managed Rules)`

---

## 4. Custom Domain & DNS Setup

1. In Cloudflare DNS management:
   - **Apex record (`@`):** CNAME pointing to `<your-worker-or-pages-domain>` (Proxied / Orange Cloud).
   - **Subdomain (`www`):** CNAME pointing to `@` (Proxied / Orange Cloud).
2. Ensure `public/_redirects` or Cloudflare Page Rules redirect `www` to apex or vice versa according to your preferred canonical domain.

---

## 5. Post-Deployment Verification

After deployment, verify the following headers on your live domain:
```bash
curl -I https://yourdomain.com/
```
Verify the response includes:
- `x-content-type-options: nosniff`
- `strict-transport-security: max-age=31536000; includeSubDomains; preload`
- `referrer-policy: strict-origin-when-cross-origin`
- Proper `cache-control` headers on HTML and `_astro/` assets.

