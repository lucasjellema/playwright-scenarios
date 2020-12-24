const { chromium } = require('playwright');
const fs = require("fs");
const request = require('request')

const URL = "https://www.amis.nl/"
const IMAGE_PATH = "./images/"
const SNAPSHOT_PATH = "./snapshots/"

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

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
  images.forEach(image => { if (image.width * image.height > 2500) {
                              const startIndex = image.src.lastIndexOf("/") + 1 // do not include /
                              const endIndex = image.src.indexOf("?")> -1?  image.src.indexOf("?"):500
                              const imageFilename = image.src.substring(startIndex,endIndex)
                              console.log(`download ${image.src} as ${imageFilename}`)
                              streamImageFromURL(image.src, imageFilename);
                            }                        
  });
  return images.length
}

const snapshotter = async (source, text) => {
  console.log(`go take screenshot of page`)
  // using the page object in source.page
  await source.page.screenshot({ path: `${SNAPSHOT_PATH}pageSnapshot.png` });
  return ""
}

(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  // expose a Node function as binding to the page (to be invoked from the function)
  await context.exposeBinding('imageDownloadFunction', allImageDownloader)
  await context.exposeBinding('snapshotFunction', snapshotter)
  const page = await context.newPage();

  await page.goto(URL);
  
  // create a shortcut key (ctrl + b) that triggers the JS function to download all images
  // create a shortcut key (ctrl + y) that triggers the JS function to take a snapshot of the page
  const shortCutJS  = `async function handleShortCutKey(e) { if ('KeyB'==e.code && e.ctrlKey) { // ctrl + b
                             const result = await window.imageDownloadFunction() ;  // invoke the Node function that was exposed to the browser context
                             console.log(result+" images were downloaded")
                         }
                         if ('KeyY'==e.code && e.ctrlKey) // ctrl + y
                             window.snapshotFunction() ;  // invoke the Node function that was exposed to the browser context
                       }
                       document.addEventListener('keyup', handleShortCutKey); 
                       `
  await page.addScriptTag({ content: shortCutJS })

  await sleep(50000000) // 1000* 50 seconds
  await browser.close()
})()



