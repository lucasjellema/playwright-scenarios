const { chromium } = require('playwright');
const { trapEventsOnPage } = require("../playwrightHelper");

const translate = async (sourceText, sourceLanguage, targetLanguage) => {
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()
    const page = await context.newPage()
    const navigationPromise = page.waitForNavigation()
    await page.goto(`https://translate.google.com/?sl=${sourceLanguage}&tl=${targetLanguage}`)

    // debug all events raised in the browser page
    //trapEventsOnPage(page)


//    await page.setViewportSize({ width: 1514, height: 696 })
    await navigationPromise

    await page.waitForSelector('textarea')
    // set text to translate in the source textarea
    await page.fill('textarea', sourceText);
    // give Google Translate a little time to perform the translation
    await sleep(800)
    // get translations from target area (which consists of one or more spans): '.VIiyi > span > span'
    const translatedLines = await page.$$eval(".VIiyi > span > span", (spans) => {
        return spans.map(span => span.innerText);
    });

    const translation = translatedLines.reduce((accumulator, line) => accumulator + line)
    //await sleep(80000)
    await browser.close()
    return translation
}

const doTranslation = async function (sourceText, sourceLanguage, targetLanguage) {
    const translation = await translate(sourceText, sourceLanguage, targetLanguage)
    console.log(`Translation result ${translation}`)
}

exports.translate = translate

doTranslation("De boodschappen voor vandaag zijn melk, boter en eieren. Neem ook een stuk kaas mee. En ik lust ook een pot met stroop.", "nl", "fr")

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
