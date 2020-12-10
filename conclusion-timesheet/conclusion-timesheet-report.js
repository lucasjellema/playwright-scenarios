const { chromium } = require('playwright');
const { trapEventsOnPage } = require("../playwrightHelper");
const { gotoTimesheet } = require("./conclusion-timesheet-helper");
const { getConclusionCredentials } = require("./conclusion-credentials");
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const secretKey = process.argv[2]
const conclusionCredentials = getConclusionCredentials(secretKey)

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

  }//for
 
  // process the five weeks on the first page that comes up (which includes today)
  let [startDate, hourReport] = await processWeeks(newPage, null);

  // process earlier periods - of five weeks each
  for (var i = 0; i < 4; i++) {
    const [nsd, hr] = await processFiveEarlierWeeks(newPage, startDate);
    startDate = nsd
    hourReport = hr.concat(hourReport)
  }

  console.log(`Hours ${JSON.stringify(hourReport)}`)

  await sleep(50000000) // 1000* 50 seconds
  await browser.close()
})()



async function processFiveEarlierWeeks(newPage, startDate) {
  // navigate to the previous five week block
  await newPage.evaluate(() => { console.log("Five weeks back"); __doPostBack('xecHourRegistration$rptEmployees$ctl00$lbNavigatePeriodLeft', ''); console.log("done with postback"); });
  // wait for navigation to complete
  await newPage.waitForSelector('#project-time-tbl-copy > thead > tr > .align-left > .left > #xecHourRegistration_rptEmployees_lbNavigateLeft > .icon');
  //move startdate back by 5 weeks (35 days)
  let newStartDate = addDays(startDate, -35);
  // process data for these 5 weeks
  const [nsd, hourReport] = await processWeeks(newPage, newStartDate.getMonth());
  // return the new startdate
  return [nsd, hourReport];
}

function addDays(theDate, days) {
  const copy = new Date(theDate)
  copy.setDate(theDate.getDate() + days)
  return copy
}



async function processWeeks(newPage, startMonth) {
  // this returns the column headings with the day of the week abbreviations followed by the day of the month number
  // for some reason, every column (or day) is included in the result twice
  const days = await newPage.$$eval("th.day-title", (ths) => {
    return ths.map(node => { return node.innerText; }
    );
  });
  // remove one (redundant) half of the array 
  const trueDays = days.slice(days.length / 2);

  // this returns the totals of the day columns
  // each total represents the expected number of hours for the daya (usually 8) minus the number of hours written for the day
  // a negative number indicates more hours written than expected, a positive number indicates fewer hours than expected 
  const dayboxes = await newPage.$$eval("th.day-box", (ths) => {
    // if node.className contains day-holiday then this day was marked as a vacation day; day-weekend indicates a weekend day; on both types of day, no hours are expected
    return ths.map((node, index) => {
      let dayType = "work"; let isToday = false
      if (node.className.indexOf("day-holiday") > -1) dayType = "vacation";
      if (node.className.indexOf("day-sick") > -1) dayType = "sick";
      if (node.className.indexOf("day-weekend") > -1) dayType = "weekend";
      if (node.className.indexOf("close") > -1) dayType = "national holiday?";
      // if (node.className.indexOf("day-today")> -1) isToday=true; 

      // special situation: daybox data-hours = 8 but no hours were actually written; in that case there will be no classes  day-availabilitynegative , day-fullyoccupied , day-alloccupationsapproved ; there will be a class day-availability (indicating that less than expected hours were written) 
      return { "hours": parseInt(node.innerText), "dayType": dayType, "today": isToday }
    }
    );
  });

  // let's create a neat array of day objects with for each day the date and the number of hours written for the day
  const dayRecords = [];
  // we want to know the startMonth of the day records if it has not been passed in
  let firstMonth = startMonth
  const today = new Date()
  if (!firstMonth) {  // no startMonth was passed in
    // find out the start month; it is either the current month or the previous one; 
    // if the first day has a lower day of month number than today, it must be in the same month as today 
    if (parseInt(trueDays[trueDays.length / 2]) < today.getDate()) //  getDate() is 1 based : 1-31
      firstMonth = today.getMonth()
    else
      firstMonth = today.getMonth() - 1
    // TODO check for firstMonth <0   , then flip to previous year
  }
  let theMonth = firstMonth
  let previousDayOfMonth = -1
  for (let i = 0; i < trueDays.length / 2; i++) {
    const dayOfWeek = trueDays[i];
    const dayOfMonth = parseInt(trueDays[i + trueDays.length / 2]);
    if (dayOfMonth < previousDayOfMonth) // next month has started
      theMonth++

    const hourTotal = dayboxes[i].hours;
    const dayType = dayboxes[i].dayType;
    dayRecords.push({ "dayOfWeek": dayOfWeek, "dayOfMonth": dayOfMonth, "month": theMonth + 1, "hourTotal": hourTotal, "dayType": dayType });
    previousDayOfMonth = dayOfMonth
  }
  //  dayRecords.forEach((day) => console.log(`${JSON.stringify(day)}`));
  return [new Date(today.getYear(), firstMonth, parseInt(trueDays[trueDays.length / 2])), dayRecords]
}
