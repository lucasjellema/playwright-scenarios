// this program produces a Powerpoint Report for the latest COVID-19 stats
// it visits relevant web pages, gathers images and takes snapshots
// subsequently, a Powerpoint Presentation is created using these images and snapshots
// note: either run npm install (to install dependencies listed in package.json ) or do an explicit npm install pptxgenjs
// also install npm i svg2img
// documentation for pptxgenjs: https://gitbrent.github.io/PptxGenJS/; demo: https://gitbrent.github.io/PptxGenJS/demo/#introduction  
const { chromium } = require('playwright');
const fs = require('fs');
const svg2img = require('svg2img');
const request = require('request')
const PptxGenJS = require("pptxgenjs");

const IMAGE_PATH = `${__dirname}/images/`
const SNAPSHOT_PATH = `${__dirname}/snapshots/`

const addImageFromSVGElement = async function (SVGElement, page, filename) {
    const svg = await page.evaluate((svg) => svg.outerHTML, SVGElement);
    svg2img(svg, function (error, buffer) {
        //returns a Buffer
        fs.writeFileSync(`${filename}`, buffer);
        //  imageCollection.push({ title: title, path: `./${filename}` })
    });
}

var streamImageFromURL = function (imageURL, imageFilename) {
    request(imageURL).pipe(fs.createWriteStream(`${IMAGE_PATH}${imageFilename}`));
}

const prepareCountryReport = async function (context, pptx, country, johnshopkinsCountryLabel, slide) {
    console.log(`prepareCountryReport for ${country}`)
    // prepare slide for the country
    let notes = `Generated using PPTXGenJS and Playwright. 
    Sources: 
    `
    slide.addText(`Daily Report for ${country.charAt(0).toUpperCase()}${country.slice(1)}`
        , { x: 1.43, y: 0.2, w: 8, h: 0.5, fontSize: 26, fontFace: "Calibri (Body)", margin: 0.1, color: "2d2152" });
    const page = await context.newPage();
    await page.goto(`https://www.worldometers.info/coronavirus/country/${country}`)
    notes = notes.concat(`Worldometer for COVID-19: https://www.worldometers.info/coronavirus/country/${country};
    `)
    // add flag to slide
    const imgs = await page.$$('img')
    // imgs[1] = flag image
    const flagSrc = await page.evaluate((img) => img.src, imgs[1]);
    streamImageFromURL(flagSrc, `${country}-flag.gif`);
    slide.addImage({ x: 0.1, y: 0.1, h: 0.65, w: 1.2, path: `${IMAGE_PATH}${country}-flag.gif` })

    const svgNewCases = await page.$('#graph-cases-daily >> svg')

    await addImageFromSVGElement(svgNewCases, page, `${IMAGE_PATH}${country}NewCases.png`)


    const svgDeaths = await page.$('#graph-deaths-daily >> svg')
    await addImageFromSVGElement(svgDeaths, page, `${IMAGE_PATH}${country}DailyDeaths.png`)

    slide.addImage({ x: 0.3, y: 0.9, h: 2.1, w: 3.8, path: `${IMAGE_PATH}${country}NewCases.png` })
    slide.addImage({ x: 0.3, y: 3.3, h: 2.1, w: 3.8, path: `${IMAGE_PATH}${country}DailyDeaths.png` })
    page.close()

    const page2 = await context.newPage();

    await page2.goto(`https://coronavirus.jhu.edu/region/${johnshopkinsCountryLabel}`);
    notes = notes.concat(`Johns Hopkins University: https://coronavirus.jhu.edu/region/${johnshopkinsCountryLabel};
    `)
    await page2.click('button:text("Past Day")')

    await page2.screenshot({ path: `${SNAPSHOT_PATH}johnshopkins${country}Snapshot.png` });

    // original 13.3 width x 7.5 height
    slide.addImage({
        x: 4.2, y: 0.8, h: 4.1, w: 6.8, sizing: { type: 'crop', x: 0.1, y: 1.4, h: 2.1, w: 5.7 }
        , path: `${SNAPSHOT_PATH}johnshopkins${country}Snapshot.png`
    })
    page2.close()
    const page3 = await context.newPage();

    await page3.goto(`https://www.worldometers.info/world-population/${country}-population/`);
    notes = notes.concat(`Worldometer Population: https://www.worldometers.info/world-population/${country}-population/`)

    const continentButton = await page3.$('text="Continent"')
    await continentButton.scrollIntoViewIfNeeded()
    await continentButton.click()
    await page3.screenshot({ path: `${SNAPSHOT_PATH}populationstats${country}Snapshot.png` });
    page3.close()
    slide.addImage({
        x: 4.2, y: 3.3, h: 4.1, w: 6.8, sizing: { type: 'crop', x: 0.5, y: 2.1, h: 1.55, w: 5.6 }
        , path: `${SNAPSHOT_PATH}populationstats${country}Snapshot.png`
    })
    slide.addShape(pptx.shapes.RECTANGLE, { x: 4.2, y: 3.15, w: 5.7, h: 1.73, line: { color: 'F1F1F1', width: 2 } })

    slide.addNotes(`${notes}`)
}

const generateWorldSummarySlide = async function (context, slide) {
    // create a new slide for the world summary
    slide.addText(`Global Summary `
        , { x: -1.67, y: 0.94, w: 8, h: 0.5, rotate:270, fontSize: 16, fontFace: "Calibri (Body)", margin: 0.1, color: "2d2152" });
    const page = await context.newPage();
    await page.setViewportSize({
        width: 1200,
        height: 1400,
      });
    await page.goto(`https://www.worldometers.info/coronavirus`)

// click on link Got it!
// then wait for a little while
await page.click('text="Got it!"')
await sleep(400)

const summaryTitle = await page.$('.col-md-6')
await page.evaluate((el) => { el.scrollIntoView()}, (summaryTitle))

await page.screenshot({ path: `${SNAPSHOT_PATH}globalSummarySnapshot.png` });
page.close()
slide.addImage({
    x: 2.5, y: 3, h: 4.1, w: 6.8, sizing: { type: 'crop', x: 0.5, y: 0, h: 2.3, w: 3.9 }
    , path: `${SNAPSHOT_PATH}globalSummarySnapshot.png`
})

}
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}


(async () => {

    const browser = await chromium.launch({ headless: false }); //snapshots can be taken in both headless and headful mode
    const context = await browser.newContext()

    //  const imageCollection = await collectImages(context)
    let pptx = new PptxGenJS();
    let exportName = `${__dirname}/COVID19-report-${new Date().toISOString().substring(0, 10)}`;
    let slide = pptx.addSlide();
    slide.addText(`COVID19 Report for ${new Date().toISOString().substring(0, 10)}`, { x: 1.5, y: 1.5, w: 6, h: 2, margin: 0.1, fontSize: 26, fill: "FFFCCC" });
    //slide.addShape(pptx.shapes.OVAL_CALLOUT, { x: 6.8, y: 3, w: 3, h: 2, fill: "00FF00", line: "000000", lineSize: 1 });
    // add global summary to opening slide
    await generateWorldSummarySlide(context,slide)

    const countries = [{ country: "spain" }, { country: "germany" }, { country: "china" }, { country: "france" }, { country: "japan" }
        , { country: "us", johnshopkinsCountryLabel: "united-states" }, { country: "uk", johnshopkinsCountryLabel: "united-kingdom" }, { country: "russia" }
    , { country: "netherlands" }]
    for (let i = 0; i < countries.length; i++) {
        let country = countries[i]
        country.slide = pptx.addSlide()
        await prepareCountryReport(context, pptx, country.country
            , country.johnshopkinsCountryLabel ? country.johnshopkinsCountryLabel : country.country, country.slide)
    }
      

 
    // now the country reports can be generated in parallel; note that prepareCountryReport() is an async function and the function call is treated here as Promise 
    // TODO: this currently fails; not sure if the code is incorrect or the load on the browser too high
    // const tasks = countries.map(async  (country) =>  {
    //     await prepareCountryReport(context, pptx, country.country
    //         , country.johnshopkinsCountryLabel ? country.johnshopkinsCountryLabel : country.country, country.slide)
    //     }
    // )
    // await Promise.all(tasks)
    console.log(`done generating all country reports`)
    //  await sleep(500000)
    await browser.close();

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