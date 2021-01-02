const { chromium } = require('playwright');
const { trapEventsOnPage } = require("../playwrightHelper");

const WHATSAPP_WEB_URL = "https://web.whatsapp.com/"
const whatsappContact = "Mezelf, mij en ik"

const message = "My message from the WhatsApp robot"

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage();

  await page.goto(WHATSAPP_WEB_URL);

  // wait for element search box
  await page.waitForSelector('._1awRl')
  // enter name of contact in search box
  await page.fill('._1awRl', whatsappContact);

  // page filters list of contacts
  await page.waitForSelector(`span[title="${whatsappContact}"]`)
  // click on the contact - this refreshes the right pane with recent messages and a box for sending new messages
  await page.click(`span[title="${whatsappContact}"]`)
  
  // wait for the field to send a message
  await page.waitForSelector('text=Type a message')
  // type the message to send
  await page.type('text=Type a message', message)
  // click button to send message
  await page.click('button._2Ujuu')

  await sleep(50000000) // 1000* 50 seconds
  await browser.close()
})()

