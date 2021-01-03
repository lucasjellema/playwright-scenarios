const { it, expect } = require('@playwright/test');

it('is a basic test of accessing the Playwright home page', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  expect(await page.innerText('.navbar__title')).toBe('Playwright');
});