const fs = require("fs");
const fspromises = fs.promises
const request = require('request')

const SNAPSHOT_PATH = `${__dirname}/snapshots/`
const TOOLBAR_ID = "my-playwright-floating-tool-bar"

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

let scenarioStatusProxy = null;

const prepareToolbar = async function(context, director,scenarioStatus) {
    scenarioStatusProxy = scenarioStatus
    await context.exposeBinding('directorFunction', director)
    await context.exposeBinding('snapshotFunction', snapshotter)

    // the function to create the toolbar - HTML and CSS
    await context.exposeBinding('prepareToolbarFunction', injectToolbarIntoPage)
    await context.exposeBinding('saveAllImagesFunction', allImageDownloader )
      
    // this script invokes the function that creates the toolbar in the page 
    // it is executed when a page or frame is created or navigated (https://microsoft.github.io/playwright/docs/1.6.1/api/class-browsercontext#browsercontextaddinitscriptscript-arg)
    await context.addInitScript({
      content: `console.log('initializing script after page or frame DOM recreate');
                window.prepareToolbarFunction();
                ${shortCutJS}               
               `
    });
  
}

exports.prepareToolbar = prepareToolbar

const shortCutJS = `function handleShortCutKey(e) { 
    if ('KeyB'==e.code && e.ctrlKey) toggleToolbar()
 }
 const toggleToolbar = () => {
   const toolbar = document.getElementById('${TOOLBAR_ID}')
   if ('none'==toolbar.style.display)
      toolbar.style.display = "block"
   else   
      toolbar.style.display = "none"
 }
 // create a shortcut key (ctrl + b) that triggers the JS function to toggle the toolbar
 document.addEventListener('keyup', handleShortCutKey);                      
 `

 const injectToolbarIntoPage = async (source) => {
    await source.page.addStyleTag({ content: menuStyleTag })
    const containerElement = await source.page.$('body')
    const currentScenarioTitle = scenarioStatusProxy.scenarios[scenarioStatusProxy.currentScenario].title
    if (containerElement) {
      addHTML(navBar, containerElement, source.page, currentScenarioTitle)
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
  
  const IMAGE_PATH = "./images/"
  var streamImageFromURL = function (imageURL, imageFilename) {
    request(imageURL).pipe(fs.createWriteStream(`${IMAGE_PATH}${imageFilename}`));
  }
  
  const allImageDownloader = async (source) => {
  console.log(`go download all images in the page`)
  // using the page object in source.page, get all img elements and return a collection of image objects to be processed in the Node context
  const images = await source.page.$$eval("img", (images) => 
          images.map((image) => { return {src: image.src, alt: image.alt, width:image.clientWidth, height:image.clientHeight}})
     )
  // for each image of substantial size - determine the name of the image file and invoke the function streamImageFromURL to download the image and save it locally  
  images.forEach((image,index) => { if (image.width * image.height > 2500) {
                              const startIndex = image.src.lastIndexOf("/") + 1 // do not include /
                              const endIndex = image.src.indexOf("?")> -1?  image.src.indexOf("?"):500
                              const imageFileNameUnderConstruction = `${new Date().toISOString().substr(0, 19)}-${index}-${image.src.substring(startIndex,endIndex)}`
                              const imageFilename = 
                              imageFileNameUnderConstruction.replace(/:/g, "");
                              console.log(`download ${image.src} as ${imageFilename}`)
                              streamImageFromURL(image.src, imageFilename);
                            }                        
  });
  return images.length
  }
  
  
  
  
  const addHTML = async function (html, parentElementHandle, page, scenarioTitle) {  
    await page.evaluate((args) => {
      // check if div#args.TOOLBAR_ID exists; if so, do not add again!
      const toolbar = document.getElementById(args.TOOLBAR_ID)
      if (!toolbar) {
        const div = document.createElement('div');
        div.setAttribute("id", args.TOOLBAR_ID);
        div.classList.add('toolbar');
        div.innerHTML = args.html.replace('my_scenario_title', args.scenarioTitle)
        args.parentElementHandle.appendChild(div);
        document.getElementsByTagName("BODY")[0].style['scroll-behavior']  = 'smooth';

      }
    }, { parentElementHandle, html, TOOLBAR_ID , scenarioTitle});
    
  }
  
  const menuStyleTag = ` 
  
  #${TOOLBAR_ID} {
    z-index:150;
    position: fixed;
    bottom: 20px;
    width: 85%;
    }
  
  ul.toolbar {
    list-style-type: none;
    margin-left: 10%;
    padding: 0;
    overflow: hidden;
    border: 1px solid #e7e7e7;
    background: rgba(176, 175, 80, 0.8);
  }
  
  .toolbar > li {
    float: left;
    list-style-image: URL('')
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
  <li><a onclick="window.directorFunction('next')">Play</a></li>
  <li><a onclick="window.directorFunction('skip')">Skip</a></li>
  <li><a onclick="window.directorFunction('reset')">Reset</a></li>
  <li><a onclick="window.directorFunction('pause')">Pause</a></li>
  <li><a onclick="window.directorFunction('switch')">Switch Scenario</a></li>

  <li><h4 id="scenarioTitle">my_scenario_title</h4></li>

  <li><a alt="Save all images in the current page or frame" onclick="window.saveAllImagesFunction('FloatingDemo')">Save Images</a></li>
  <li style="float:right"><a class="active" onclick="window.snapshotFunction('FloatingDemo')">Snapshot</a></li>
  </ul>    

  `
  