const { chromium } = require('playwright');
const { trapEventsOnPage } = require("../playwrightHelper");
const { prepareToolbar } = require('./toolbar')
const { injectCalloutIntoPage, populateCallout } = require('./callout')
const { scenarios, setWaitForUnpause } = require('./scenarios')


const scenarioStatus = { currentScenario: 0, nextScene: 0, scenarios: [], scenarioPaused: false }

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  prepareToolbar(context, director, scenarioStatus)
  const page = await context.newPage();
  await page.goto(scenarioStatus.scenarios[scenarioStatus.currentScenario].url)

  injectCalloutIntoPage(page, scenarioStatus.scenarios[scenarioStatus.currentScenario].title
    , scenarioStatus.scenarios[scenarioStatus.currentScenario].description)

  await sleep(50000000) // 1000* 50 seconds
  await browser.close()
})()

// check if scenario is paused; if not, return; if it is, wait for 500ms, then check again 
const waitForUnpause = async () => {
  if (scenarioStatus.scenarioPaused) {
    await sleep(500)
    return await waitForUnpause()
  }
  return
}

const director = async (source, instruction) => {
  if ('next' == instruction) {
    const scene = scenarioStatus.scenarios[scenarioStatus.currentScenario].scenes[scenarioStatus.nextScene++]
    const f = scene.action
    await injectCalloutIntoPage(source.page, scene.title, scene.description)
    await f(source.page)
    // reinstate the callout at the end of the scene - to make sure any page navigation did not undo it
    await injectCalloutIntoPage(source.page, scene.title, scene.description)
    // if a next scene is available, show the title and description that are coming up
    if (scenarioStatus.nextScene < scenarioStatus.scenarios[scenarioStatus.currentScenario].scenes.length) {
      const nextScene = scenarioStatus.scenarios[scenarioStatus.currentScenario].scenes[scenarioStatus.nextScene]
      await populateCallout(source.page, "Coming Up: " + nextScene.title, nextScene.description)
    }
  }
  if ('skip' == instruction) {
    const scene = scenarioStatus.scenarios[scenarioStatus.currentScenario].scenes[scenarioStatus.nextScene++]
    await injectCalloutIntoPage(source.page, scene.title, scene.description)
    // if a next scene is available, show the title and description that are coming up
    if (scenarioStatus.nextScene < scenarioStatus.scenarios[scenarioStatus.currentScenario].scenes.length) {
      const nextScene = scenarioStatus.scenarios[scenarioStatus.currentScenario].scenes[scenarioStatus.nextScene]
      await populateCallout(source.page, "Coming Up: " + nextScene.title, nextScene.description)
    }
  }
  if ('reset' == instruction) {
    scenarioStatus.nextScene = 0
    const nextScene = scenarioStatus.scenarios[scenarioStatus.currentScenario].scenes[scenarioStatus.nextScene]
    await populateCallout(source.page, "Coming Up: " + nextScene.title, nextScene.description)
  }
  if ('pause' == instruction) {
    scenarioStatus.scenarioPaused = !scenarioStatus.scenarioPaused
  }
  if ('switch' == instruction) {
    scenarioStatus.currentScenario++
    if (scenarioStatus.currentScenario >= scenarioStatus.scenarios.length) {
      scenarioStatus.currentScenario = 0
    }
    scenarioStatus.nextScene = 0
    await source.page.goto(scenarioStatus.scenarios[scenarioStatus.currentScenario].url)
    const title = scenarioStatus.scenarios[scenarioStatus.currentScenario].title
    injectCalloutIntoPage(source.page, title, scenarioStatus.scenarios[scenarioStatus.currentScenario].description)
    const scenarioTitle = await source.page.$('#scenarioTitle')
    // set the current scenario title in the toolbar's scenario element
    await source.page.evaluate(({ scenarioTitle, title }) => {
      scenarioTitle.innerText = title
    }, ({ scenarioTitle, title }))
  }
}

// load scenarios from module scenarios.js
scenarioStatus.scenarios = scenarios
setWaitForUnpause(waitForUnpause)