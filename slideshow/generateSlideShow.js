// this program does a quick tour of the playwright.dev website, visiting four different pages
// snapshots are taken of each page; these snapshots are saved to disk
// subsequently, a Powerpoint Presentation is created with an introductory slide and one additional slide for each snapshot taken
// note: either run npm install (to install dependencies listed in package.json ) or do an explicit npm install pptxgenjs
// documentation for pptxgenjs: https://gitbrent.github.io/PptxGenJS/; demo: https://gitbrent.github.io/PptxGenJS/demo/#introduction  
const { chromium } = require('playwright');

let PptxGenJS = require("pptxgenjs");

const SNAPSHOT_PATH = `${__dirname}/snapshots/`

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
const collectImages = async () => {
    const imageCollection = []
    const browser = await chromium.launch({ headless: false }); //snapshots can be taken in both headless and headful mode
    const context = await browser.newContext()
    // Create a page.
    const page = await context.newPage();
    // Navigate explicitly, similar to entering a URL in the browser.
    await page.goto('https://playwright.dev/');

    await page.screenshot({ path: `${SNAPSHOT_PATH}page1Snapshot.png` });
    imageCollection.push({ title: "Home of Playwright: playright.dev", path: `${SNAPSHOT_PATH}page1Snapshot.png` })
    // Navigate implicitly by clicking a link.
    await page.click('a.getStarted_3sli');

    await page.waitForSelector('a[href="/docs/core-concepts"]');
    await page.screenshot({ path: `${SNAPSHOT_PATH}page2Snapshot.png` });
    imageCollection.push({ title: "Getting Started", path: `${SNAPSHOT_PATH}page2Snapshot.png` })
    const link = await page.$('a[href="/docs/core-concepts"]');
    await link.scrollIntoViewIfNeeded()
    await link.click()
    await page.waitForSelector('h1:text("Core concepts")');
    await page.screenshot({ path: `${SNAPSHOT_PATH}page3Snapshot.png` });
    imageCollection.push({ title: "Core Concepts", path: `${SNAPSHOT_PATH}page3Snapshot.png` })

    //  Element Handle
    const elHandleLink = await page.$('a[href="#example-elementhandle"]');
    await elHandleLink.scrollIntoViewIfNeeded()
    await elHandleLink.click()
    await page.waitForSelector('h3:text("Example: JSHandle")');
    await page.screenshot({ path: `${SNAPSHOT_PATH}page4Snapshot.png` });
    imageCollection.push({ title: "Example: Element Handle - evaluated in browser context", path: `${SNAPSHOT_PATH}page4Snapshot.png` })



    //  API Documentation
    const apiLink = await page.$('a[href="/docs/api/class-playwright"]');
    await apiLink.scrollIntoViewIfNeeded()
    await apiLink.click()
    await page.waitForSelector('h1:text("Playwright")');
    await page.screenshot({ path: `${SNAPSHOT_PATH}page5Snapshot.png` });
    imageCollection.push({ title: "API Documentation", path: `${SNAPSHOT_PATH}page5Snapshot.png` })

    // await sleep(500000)
    await browser.close();
    return imageCollection
}

(async () => {
    const imageCollection = await collectImages()
    let pptx = new PptxGenJS();
    let exportName = "PlaywrightWeb";
    let slide = pptx.addSlide();
    slide.addText("Presenting the Playwright Website", { x: 1.5, y: 1.5, w: 6, h: 2, margin: 0.1, fill: "FFFCCC" });
    slide.addShape(pptx.shapes.OVAL_CALLOUT, { x: 6, y: 2, w: 3, h: 2, fill: "00FF00", line: "000000", lineSize: 1 });
    for (let i = 0; i < imageCollection.length; i++) {
        slide = pptx.addSlide();
        slide.addText(`Step ${i + 1}: ${imageCollection[i].title}`, { x: 0.5, y: 0.2, w: 8, h: 0.5, fontSize: 26, fontFace: "Calibri (Body)", margin: 0.1, color: "2d2152" });

        slide.addImage({ x: 1.53, y: 1, h: 4.3, w: 7.1, path: imageCollection[i].path })
        slide.addNotes(`slide created from screenshot taken by Playwright script`)
    }
    // Saves output file to the local directory where this process is running
    pptx.writeFile(exportName)
        .catch((err) => {
            throw new Error(err);
        })
        .then((fileName) => {
            console.log(`Powerpoint document exported: ${fileName}`);
        })
        .catch((err) => {
            console.log(`ERROR: ${err}`);
        });

})();