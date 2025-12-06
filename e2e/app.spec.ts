import { test, expect } from '@playwright/test';

test('should load the landing page', async ({ page }) => {
  await page.goto('/');

  // Check that the page loads
  await expect(page).toHaveURL(/.*\/$/);
});

test('should navigate to sign in page', async ({ page }) => {
  await page.goto('/');

  const signInLink = page.getByRole('link', { name: /login/i });
  if (await signInLink.isVisible()) {
    await signInLink.click();
    await expect(page).toHaveURL(/.*\/login/);
  }
});
