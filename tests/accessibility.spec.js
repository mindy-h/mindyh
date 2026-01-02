import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { url: 'http://localhost:4326/', name: 'home' },
  { url: 'http://localhost:4326/pricing', name: 'pricing' }
];

for (const { url, name } of pages) {
  test(`a11y: ${name}`, async ({ page }) => {
    await page.goto(url);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}