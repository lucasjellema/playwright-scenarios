const { chromium } = require('playwright');
const { trapEventsOnPage } = require("../playwrightHelper");
const { retrieveConclusionCredentials } = require("./conclusion-credentials");
const { gotoTimesheet } = require("./conclusion-timesheet-helper");

const secretKey =  process.argv[2];

const conclusionCredentials  = retrieveConclusionCredentials( secretKey)

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// in PowerShell, to set the env var [System.Environment]::SetEnvironmentVariable('MS_PW', 'VALUE',[System.EnvironmentVariableTarget]::user)
// to read [System.Environment]::GetEnvironmentVariable('MS_PW','user')


// this scripts logs in to Conclusion Excellence and navigates to the Uren page
// it does not currently enter or update information or expand any cells - but it could easily do so. 
(async () => {

  // run script as follows
  //$env:MS_PW='ACTUAL_PASSWORD'; node .\conclusion-uren.js; $env:MS_PW=''

  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()


  const newPage = await gotoTimesheet(conclusionCredentials, context);

  // debug all events raised in the browser page
  // trapEventsOnPage(newPage)


  // th with class day-today is header of today's column
  // its attribute data-hours contains the number hours [to be] entered
  // text value for th with class day-title today  contains day of month

  await newPage.waitForSelector('th.day-box.day-today');
  // to expand customers  - click on all tr.customer-row elements 
  await newPage.waitForSelector('.customer-row')

  // get hold of all customerRows (including irrelevant ones)
  const customerRows = await newPage.$$('.customer-row')
  const customerNames = []
  // note: forEach is not processed sequentially; reduce is (map probably too)
  for (let i = 0; i < customerRows.length; i++) {
    const customerRow = customerRows[i]
    await customerRow.scrollIntoViewIfNeeded()
    const customerNameRow = await customerRow.$('b[data-bind="text: Name"]')
    const customerName = await newPage.evaluate(([customerNameRow]) => customerNameRow.innerHTML, [customerNameRow]);
    customerNames.push(customerName)
    console.log(`Evaluating customer ${customerName}; only expand the first three customers)`)
    if (i < 3 ) {
      await customerRow.click()
    }
  }//for
  // expand the second project item under the first customer
  const projectRows = await newPage.$$('.project-item')
  await projectRows[1].click()

  await sleep(4000)
  await newPage.waitForSelector('td.day-today')
  // get hold of the column of TD elements that represent today
  const todayCells = await newPage.$$('td.day-today')

  // bring up popup for today's cell for project item [1]
  await todayCells[1].click()
  // wait for the popup to be available
  await newPage.waitForSelector('.box > #project-time-tbl-original > .user-section > .project-item-activity > .vizor')
  await newPage.click('.box > #project-time-tbl-original > .user-section > .project-item-activity > .vizor')


  await sleep(50000000) // 1000* 50 seconds
  await browser.close()
})()

