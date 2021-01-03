const { it, expect } = require('@playwright/test');

it('is a test of the AMIS Technology Blog', async ({ page }) => {
  await page.goto('https://technology.amis.nl/');
  // click on search icon
  await page.click('.fa-search')
  await page.waitForSelector('.search-field')
  // enter search string
  await page.fill('.search-field','playwright')
  // click on search button
  await page.click('.search-submit')
  // wait for results page
  await page.waitForSelector('h1.page-title')
  //verify that post 58717 exists - Run Automated Step-by-Step Browser Scenarios for Instruction or Demo from NodeJS applications with Playwright
  expect(await page.$('#post-58717')).toBeTruthy();
});

