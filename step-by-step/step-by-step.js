const { chromium } = require('playwright');
const { trapEventsOnPage } = require("../playwrightHelper");
const { prepareToolbar } = require('./toolbar')
const { injectCalloutIntoPage } = require('./callout')


const PLAY_URL = "https://en.wikipedia.org/wiki/Main_Page"

const scenarioStatus = { currentScenario: 0, nextScene: 0 , scenarios:[]}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  prepareToolbar(context, director, scenarioStatus)

  // the function to take a snapshot of the current page
  const page = await context.newPage();
  await page.goto(PLAY_URL)
  injectCalloutIntoPage(page, scenarioStatus.scenarios[scenarioStatus.currentScenario].title,"...")

  await sleep(50000000) // 1000* 50 seconds
  await browser.close()
})()

const director = async (source, instruction) => {
  if ('next' == instruction) {
    const scene = scenarioStatus.scenarios[scenarioStatus.currentScenario].scenes[scenarioStatus.nextScene++]
    const f = scene.action
    injectCalloutIntoPage(source.page, scene.title,"***")
  
    await f(source.page)
  }
  if ('reset' == instruction) {
    scenarioStatus.nextScene = 0
  }
  if ('switch' == instruction) {
    scenarioStatus.currentScenario++ 
    if (scenarioStatus.currentScenario >= scenarioStatus.scenarios.length) {
      scenarioStatus.currentScenario = 0
    }
    scenarioStatus.nextScene = 0
    const title = scenarioStatus.scenarios[scenarioStatus.currentScenario].title
    injectCalloutIntoPage(source.page, scenarioStatus.scenarios[scenarioStatus.currentScenario].title,"...")
    const scenarioTitle = await source.page.$('#scenarioTitle')    
    await source.page.evaluate( ({scenarioTitle, title}) => {
      scenarioTitle.innerText = title
    }, ({scenarioTitle, title}))
  }
}

const tourNL = {
  title: "Tour of The Netherlands"
  , scenes:
    [{
      title: "Welcome to The Netherlands"
      , action: async (page) => {
        await page.type('#searchInput', 'The Netherlands', { delay: 100 });
        await page.click('#searchButton')
      }
    },
    {
      title: "A little history",
      action: async (page) => {
        await page.waitForSelector('#History')
        console.log('go scroll')
        const history = await page.$('#History')
        await history.scrollIntoViewIfNeeded()
        //await history.selectText()

      }
    }
    ]
}

const tourFR = {
  title: "Tour of France"
  , scenes:
    [{
      title: "Bienvenue en France"
      , action: async (page) => {
        await page.type('#searchInput', 'France', { delay: 100 });
        await page.click('#searchButton')
      }
    },
    {
      title: "A little history",
      action: async (page) => {
        await page.waitForSelector('"Show globe"')
        await page.click('"Show globe"')

      }
    }
    ]
}


const tourUK = {
  title: "Excursion in Great Britain"
  , scenes:
    [{
      title: "Welcome in the UK"
      , action: async (page) => {
        await page.type('#searchInput', 'United Kingdom', { delay: 100 });
        await page.click('#searchButton')
      }
    },
    {
      title: "Wandering around",
      action: async (page) => {
        await page.waitForSelector('"Show globe"')
        await page.click('"Show globe"')

      }
    }
    ]
}
scenarioStatus.scenarios = [tourNL, tourFR, tourUK]
