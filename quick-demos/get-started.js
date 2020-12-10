const { chromium } = require('playwright');
//navigate to whatsmyuseragent.org and take a screenshot.
(async () => {
  const browser = await chromium.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('http://whatsmyuseragent.org/');
  await page.screenshot({ path: `example.png` });
  await browser.close();
})();