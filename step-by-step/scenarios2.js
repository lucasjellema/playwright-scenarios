const { injectCalloutIntoPage, populateCallout } = require('./callout')
const { plotBubble } = require('./bubbles')

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

let waitForUnpause = null
const setWaitForUnpause = (waitForUnpauseReference) => { waitForUnpause = waitForUnpauseReference }
exports.setWaitForUnpause = setWaitForUnpause

const tourPlaywrightDev = {
    title: "Introducing Playwright",
    description: "Quick introduction to Playwright.dev website"
    , url: "https://playwright.dev/"
    , scenes:
        [{
            title: "Getting Started"
            , description: "Quick tour of Playwright"
            , action: async (page) => {
                //await page.click('text="Get started instantly"');
                
                await plotBubble(page, '.header-github-link', 'Go to the GitHub Repository for Playwright', "LU", { left: -305, top: -33 },2100)
               
                await sleep(2100)
                populateCallout(page, "Mocking Network calls", `Playwright can intercept network calls and produce mock responses`)
                
                const mock = await page.$('text="Intercept network activity"')
                await mock.scrollIntoViewIfNeeded({ behavior: 'smooth' })
                await sleep(3000)
                await page.click('text="Get started"');
            }
        },
        {
            title: "External Resources"
            , description: "Community resources on Playwright"
            , action: async (page) => {
                populateCallout(page, "Video: Introduction of Test Runner", `Demonstration of the built in Playwright Test Runner (opens in a new browser tab; click "No Thanks" and I agree"). Note: the homepage for the Test Runner is also opened`)
                await sleep(3000)
                // homepage for testrunner: https://github.com/microsoft/playwright-test
                const testrunnerHomePage = await page.context().newPage();
                await testrunnerHomePage.goto('https://github.com/microsoft/playwright-test');
                // scroll into view: 
                const title = await testrunnerHomePage.$('text=" Playwright test runner "')
                await title.scrollIntoViewIfNeeded({ behavior: 'smooth' })
                await sleep(1000)
                // video on test runner 
                const testrunnerVideoPage = await page.context().newPage();
                await testrunnerVideoPage.goto('https://youtu.be/m60Hj4zHlLc');
                // bring that page in focus - for 5 seconds - then return to main page
                await testrunnerVideoPage.bringToFront()


                await sleep(5000)
                // TODO this call fails; callout is not recreated in new page it seems
                //  UnhandledPromiseRejectionWarning: page.addScriptTag: Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'report-sample' 'nonce-DRT66+QsDfzeYsv8VvMTgg' 'unsafe-inline' 'unsafe-eval'". 
                // injectCalloutIntoPage(testrunnerVideoPage, "Introduction of Test Runner", "Demonstration of the built in Playwright Test Runner")

                await sleep(15000)

                // return to main page
                await page.bringToFront()
                await waitForUnpause()
                await sleep(2500);
            }
        }
        ]
}


// browser - highlight searched
//      let re = new RegExp(searched,"g"); // search for all instances
// 		let el = document.getElementById("text");
//   	let newText = el.innerHTML.replace(re, `<mark>${searched}</mark>`);
// 		el.innerHTML = newText;

const tourFR = {
    title: "External Resources"
    , description: "Community resources on Playwright"
, url: "https://lucasjellema.medium.com/what-you-could-do-if-you-had-a-free-tireless-browser-operator-introducing-playwright-1ecd31ace3ad"
    , scenes:
        [{
            title: "Playwright Test Runner"
            , description: "Introducing the Test Runner for running end 2 end browser based UI tests through Playwright"
            , action: async (page) => {
                populateCallout(page, "Video: Introduction of Test Runner", `Demonstration of the built in Playwright Test Runner (opens in a new browser tab; click "No Thanks" and I agree"). Note: the homepage for the Test Runner is also opened`)
                await sleep(3000)
                // homepage for testrunner: https://github.com/microsoft/playwright-test
                const testrunnerHomePage = await page.context().newPage();
                await testrunnerHomePage.goto('https://github.com/microsoft/playwright-test');
                // scroll into view: 
                const title = await testrunnerHomePage.$('text=" Playwright test runner "')
                await title.scrollIntoViewIfNeeded({ behavior: 'smooth' })
                await sleep(1000)
                // video on test runner 
                const testrunnerVideoPage = await page.context().newPage();
                await testrunnerVideoPage.goto('https://youtu.be/m60Hj4zHlLc');
                // bring that page in focus - for 5 seconds - then return to main page
                await testrunnerVideoPage.bringToFront()


                await sleep(5000)
                // TODO this call fails; callout is not recreated in new page it seems
                //  UnhandledPromiseRejectionWarning: page.addScriptTag: Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'report-sample' 'nonce-DRT66+QsDfzeYsv8VvMTgg' 'unsafe-inline' 'unsafe-eval'". 
                // injectCalloutIntoPage(testrunnerVideoPage, "Introduction of Test Runner", "Demonstration of the built in Playwright Test Runner")

                await sleep(15000)

                // return to main page
                await page.bringToFront()
                await waitForUnpause()
                await sleep(2500);
            }
        
        },
        {
            title: "A little history",
            description: "Un peu de Histoire"
            , action: async (page) => {
                await page.waitForSelector('"Show globe"')
                await page.click('"Show globe"')

            }
        }
        ]
}


const tourUK = {
    title: "Excursion in Great Britain",
    description: "Brief tour of the United Kingdom of Northern Ireland, Scotland, Wales and England"
    , url: "https://en.wikipedia.org/wiki/Main_Page"
    , scenes:
        [{
            title: "Welcome in the UK",
            description: "Let's visit the Wikipedia page on the UK, shall we?"
            , action: async (page) => {
                await page.type('#searchInput', 'United Kingdom', { delay: 100 });
                await page.click('#searchButton')
            }
        },
        {
            title: "Wandering around",
            description: "Checking out the country side",
            action: async (page) => {
                await page.waitForSelector('"Show globe"')
                await page.click('"Show globe"')

            }
        }
        ]
}

const scenarios = [tourPlaywrightDev, tourFR, tourUK]


exports.scenarios = scenarios

async function scrollToElement(page, element) {
    await page.evaluate((el) => {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }, (element))
}
