const { chromium } = require('playwright');
const { trapEventsOnPage } = require("../playwrightHelper");

const fs = require("fs");
const request = require('request')
const IMAGE_PATH = `${__dirname}/images/`

const movie = async (title) => {
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()
    const page = await context.newPage()
    let navigationPromise = page.waitForNavigation()
    await page.goto(`https://www.imdb.com/find?q=${encodeURI(title)}`)

    // debug all events raised in the browser page
    //trapEventsOnPage(page)
    await page.click('tr.findResult > td > a');

    // post is image  $('div.poster > a > img')
    await sleep(1200)

    const posterUrl = await page.$eval("div.poster > a > img", (el) => el.src);
    console.log(`Downloading ${posterUrl}`)

    var stream = function () {
        request(posterUrl).pipe(fs.createWriteStream(`${IMAGE_PATH}${title}.jpg`));
    }
    stream();

    const year = await page.$eval("#titleYear > a ", (el) => el.innerText);
    const rating = await page.$eval(".ratingValue > strong > span ", (el) => el.innerText);
    const time = await page.$eval("time", (el) => el.innerText);
    const releaseDate = await page.$eval('a[title="See more release dates"]', (el) => el.innerText);
    const fullTitle = await page.$eval('div.title_wrapper > h1', (el) => el.innerText); 
    const summary = await page.$eval('div.summary_text', (el) => el.innerText);

    // div.credit_summary_item has an h4 with as innerText Stars: | Director: | Writers:
    // and a  number of a elements in that category whose innerText contains a name
    const credits = await page.$$eval("div.credit_summary_item", (divs) => {
        return divs.map(div => { console.log(`credit : ${div}`)
            const creds = {"category": div.firstElementChild.innerText, "items": []}
            let item = div.firstElementChild
            do {
                item=item.nextElementSibling
                creds.items.push(item.innerText);
            } while (item.nextElementSibling && item.nextElementSibling.innerText != "|");
            return creds ;
        })
    });
    console.log(`${JSON.stringify(credits)}`)

    const movieResult = {
        "title": fullTitle
        , releaseDate
        , "duration": time
        , rating
        , year
        , summary
    }
    credits.forEach( (credits) => {movieResult[credits.category]= credits.items})

    //await sleep(80000)
    await browser.close()
    return movieResult
}

const lookupMovie = async function (title) {
    const movieResult = await movie(title)
    console.log(`Movie result ${JSON.stringify(movieResult)}`)
}

exports.lookupMovie = lookupMovie

lookupMovie("Grease")
lookupMovie("Groundhog Day")
lookupMovie("Forrest Gump")



const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
