const { chromium } = require('playwright');
//navigate to cnn.com and generate a PDF with the entire page's content (without header and footer) .
(async () => {
  const browser = await chromium.launch({headless: true}); // note: PDF generation only work in headless mode, and only for the chromium browser engine
  const page = await browser.newPage();
  await page.goto('https://edition.cnn.com/');
  // see https://playwright.dev/docs/api/class-page?_highlight=pdf#pagepdfoptions for details on this command
  await page.pdf({ path: `cnn.pdf` , scale:0.4});
  await browser.close();
})();