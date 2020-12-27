const { chromium } = require('playwright');
const { trapEventsOnPage } = require("../playwrightHelper");

const URL = "https://www.knltb.nl/"
const SNAPSHOT_PATH = "./snapshots/"

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  // the function to take a snapshot of the current page
  await context.exposeBinding('snapshotFunction', snapshotter)
  // the function to create the toolbar - HTML and CSS
  await context.exposeBinding('prepareToolbarFunction', prepareToolbar)

  // this script invokes the function that creates the toolbar in the page 
  // it is executed when a page or frame is created or navigated (https://microsoft.github.io/playwright/docs/1.6.1/api/class-browsercontext#browsercontextaddinitscriptscript-arg)
  await context.addInitScript({
    content: `console.log('initializing toolbar');
              window.prepareToolbarFunction();
             `
  });
  const page = await context.newPage();
  await page.goto(URL);
  await sleep(50000000) // 1000* 50 seconds
  await browser.close()
})()

const prepareToolbar = async (source) => {
  await source.page.addStyleTag({ content: menuStyleTag })
  const containerElement = await source.page.$('body')
  if (containerElement) {
    addHTML(navBar, containerElement, source.page)
  }
}

const snapshotter = async (source, label) => {
  console.log(`go take screenshot of page`)
  // using the page object in source.page
  // hide toolbar, take the snapshot, show toolbar
  await source.page.$eval(`#${TOOLBAR_ID}`, (toolbar) => { toolbar.style.display = "none"; })
  const snapshotNameUnderConstruction = `${SNAPSHOT_PATH}${new Date().toISOString().substr(0, 19)}-${label}Snapshot.png`
  const snapshotName = snapshotNameUnderConstruction.replace(/:/g, "");
  console.log(`saving snapshot file: ${snapshotName}`)
  await source.page.screenshot({ path: snapshotName });
  // display the toolbar
  await source.page.$eval(`#${TOOLBAR_ID}`, (toolbar) => { toolbar.style.display = "block"; })
  return ""
}

const TOOLBAR_ID = "my-playwright-floating-tool-bar"
const addHTML = async function (html, parentElementHandle, page) {  
  await page.evaluate((args) => {
    // check if div#args.TOOLBAR_ID exists; if so, do not add again!
    const toolbar = document.getElementById(args.TOOLBAR_ID)
    if (!toolbar) {
      const div = document.createElement('div');
      div.setAttribute("id", args.TOOLBAR_ID);
      div.classList.add('toolbar');
      div.innerHTML = args.html
      args.parentElementHandle.appendChild(div);
    }
  }, { parentElementHandle, html, TOOLBAR_ID });
}

const menuStyleTag = ` 

#${TOOLBAR_ID} {
  z-index:150;
  position: fixed;
  bottom: 50px;
  width: 70%;
  }

ul.toolbar {
  list-style-type: none;
  margin-left: 15%;
  padding: 0;
  overflow: hidden;
  border: 1px solid #e7e7e7;
  background: rgba(176, 175, 80, 0.8);
}

.toolbar > li {
  float: left;
}

.toolbar > li a {
  display: block;
  color: #666;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

.toolbar > li a:hover:not(.active) {
  background-color: #111;
}

.toolbar > .active {
  background-color: #4CAF50;
}
.toolbar > li a.active:hover {
  background-color: red;
}
 
`
const navBar = `<ul class="toolbar">
<li ><a href="#home" >Reset</a></li>
<li ><a href="#news" >Pause</a></li>
<li><a href="#contact">Next Step</a></li>
<li style="float:right"><a class="active" onclick="window.snapshotFunction('FloatingDemo')">Take Snapshot</a></li>
</ul>    
`

