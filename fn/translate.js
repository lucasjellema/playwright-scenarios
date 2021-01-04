const { chromium } = require("playwright-chromium");


const translate = async (sourceText, sourceLanguage, targetLanguage) => {
    const browser = await chromium.launch({
        executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      });
    const context = await browser.newContext()
    const page = await context.newPage()
    const navigationPromise = page.waitForNavigation()
    await page.goto(`https://translate.google.com/?sl=${sourceLanguage}&tl=${targetLanguage}`)

    await navigationPromise

    await page.waitForSelector('textarea')
    await page.fill('textarea', sourceText);
    await sleep(800)
    const translatedLines = await page.$$eval(".VIiyi > span > span", (spans) => {
        return spans.map(span => span.innerText);
    });

    const translation = translatedLines.reduce((accumulator, line) => accumulator + line)
    await browser.close()
    return translation
}

exports.translate = translate

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
