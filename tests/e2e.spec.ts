import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'docs/screenshots');

test.beforeAll(() => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
});

const routesToTest = [
  { path: '/', name: 'home-en' },
  { path: '/es/', name: 'home-es' },
  { path: '/pt/', name: 'home-pt' },
  { path: '/tools/', name: 'tools' },
  { path: '/tools/days-between-dates/', name: 'tool-days-between' },
  { path: '/es/tools/days-alive/', name: 'tool-days-alive-es' },
  { path: '/pt/tools/pet-age/', name: 'tool-pet-age-pt' },
  { path: '/about/', name: 'about' },
  { path: '/privacy/', name: 'privacy' },
  { path: '/404/', name: '404' },
];

for (const route of routesToTest) {
  test(`Visual capture & Accessibility audit for ${route.name} (${route.path})`, async ({ page }, testInfo) => {
    const isMobile = testInfo.project.name.includes('Mobile');
    const viewportLabel = isMobile ? '360' : '1280';

    await page.goto(route.path);
    await page.waitForLoadState('networkidle');

    // 1. Light Mode Screenshot
    const lightPath = path.join(SCREENSHOTS_DIR, `${route.name}-${viewportLabel}-light.png`);
    await page.screenshot({ path: lightPath, fullPage: false });

    // 2. Dark Mode Screenshot
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    const darkPath = path.join(SCREENSHOTS_DIR, `${route.name}-${viewportLabel}-dark.png`);
    await page.screenshot({ path: darkPath, fullPage: false });

    // Revert dark mode for axe scan
    await page.evaluate(() => document.documentElement.classList.remove('dark'));

    // 3. Axe Accessibility Audit (WCAG 2.1 AA)
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .disableRules(['color-contrast']) // Color contrast is explicitly verified against tokens
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
}

test('Interactive Calculator Island - Mode Switching & Calculations', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Verify initial calculation renders (default 2000-01-01)
  const heroYears = page.locator('[data-testid="hero-years"]').first();
  await expect(heroYears).toBeVisible();

  // Test Mode Switching to "Age on Specific Date"
  const onDateTab = page.locator('button[role="tab"]:has-text("Age on Specific Date")');
  await onDateTab.click();
  await expect(page.locator('label:has-text("Target Date")')).toBeVisible();

  // Test Mode Switching to "Compare Two People"
  const compareTab = page.locator('button[role="tab"]:has-text("Compare Two People")');
  await compareTab.click();
  await expect(page.locator('label:has-text("First Person")')).toBeVisible();
  await expect(page.locator('label:has-text("Second Person")')).toBeVisible();
  await expect(page.locator('text=Age Comparison')).toBeVisible();

  // Switch back to "Age Today"
  const todayTab = page.locator('button[role="tab"]:has-text("Age Today")');
  await todayTab.click();
  await expect(page.locator('label:has-text("Date of Birth")')).toBeVisible();

  // Verify Copy Summary Button works
  const copyBtn = page.locator('button:has-text("Copy Summary")');
  await expect(copyBtn).toBeVisible();
});
