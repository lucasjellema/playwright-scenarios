// read this for background: https://github.com/qawolf/playwright-video
// before you can run this program, first install playwright-video and ffmpeg
// npm i playwright-video @ffmpeg-installer/ffmpeg

// this program creates an MP4 file /playdev-video.mp4
// that shows a brief visit to the Playwright's homepage - with two navigation actions
const { chromium } = require('playwright');
const { saveVideo } = require('playwright-video');
(async () => {
    const browser = await chromium.launch({ headless: true }); // video can be taken in both headless and headful mode
    const context = await browser.newContext()
    // Create a page.
    const page = await context.newPage();
    // start recording
    const capture = await saveVideo(page, __dirname+'./video/playdev-video.mp4');
    // Navigate explicitly, similar to entering a URL in the browser.
    await page.goto('https://playwright.dev/');

    // Navigate implicitly by clicking a link.
    await page.click('a.getStarted_3sli');

    await page.waitForSelector('a[href="/docs/core-concepts"]');
    const link = await page.$('a[href="/docs/core-concepts"]');

    await link.scrollIntoViewIfNeeded()
    await link.click()
    await page.waitForSelector('h1:text("Core concepts")');

    await capture.stop();
    await browser.close();
})();