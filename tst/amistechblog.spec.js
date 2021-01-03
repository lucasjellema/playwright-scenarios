const { it, expect } = require('@playwright/test');

it('is a test of the AMIS Technology Blog', async ({ page }) => {
  await page.goto('https://technology.amis.nl/');
  await page.click('.fa-search')
  await page.waitForSelector('.search-field')
  await page.fill('.search-field','playwright')
  await page.click('.search-submit')
  await page.waitForSelector('h1.page-title')
  //verify that post 58717 exists
  expect(await page.$('#post-58717')).toBeTruthy();
});

