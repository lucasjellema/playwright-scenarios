const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext()
    // Create a page.
    const page = await context.newPage();

    // Navigate explicitly, similar to entering a URL in the browser.
    await page.goto('http://example.com');
  
    // Navigate implicitly by clicking a link.
    await page.click('a');

    // Expect a new url.
    console.log(page.url());

    await browser.close();
})();