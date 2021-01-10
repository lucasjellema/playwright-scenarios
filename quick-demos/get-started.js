const { chromium } = require('playwright');
//navigate to whatsmyuseragent.org and take a screenshot.
(async () => {
  const browser = await chromium.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('http://whatsmyuseragent.org/');
  const myip = await page.$eval('p:text("My IP")', (p)=> p.innerText)
  console.log(`my ip: ${myip}`)
  await page.screenshot({ path: `example.png` });
  await browser.close();
})();