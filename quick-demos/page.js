const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ headless: false , slowMo:3000}); // https://playwright.dev/docs/api/class-browsertype#browsertypelaunchoptions
    const context = await browser.newContext()
    // Create a page.
    const page = await context.newPage();

    // Navigate explicitly, similar to entering a URL in the browser.
    await page.goto('http://example.com');
  
    // Navigate implicitly by clicking a link.
    await page.click('a');

    // Expect a new url.
    console.log(page.url());

    // Create a second page.
    const page2 = await context.newPage();
    await page2.goto('https://github.com/lucasjellema/playwright-scenarios/tree/main/workshop');
    await page2.click('"main"');


    await browser.close();
})();