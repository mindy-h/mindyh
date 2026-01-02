import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:4326/');

  // Expect the page title to contain "Mindy House"
  await expect(page).toHaveTitle(/Mindy House/);
});

test('navigation links work', async ({ page }) => {
  await page.goto('http://localhost:4326/');

  // Get the navigation element first
  const nav = page.locator('nav').first();
  
  // Check that Work link exists in navigation
  await expect(nav.getByRole('link', { name: /work/i })).toBeVisible();
  
  // Check that About link exists in navigation
  await expect(nav.getByRole('link', { name: /about/i })).toBeVisible();
  
  // Check that Process link exists in navigation
  await expect(nav.getByRole('link', { name: /process/i })).toBeVisible();
});
