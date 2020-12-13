const { chromium } = require('playwright');
const { trapEventsOnPage } = require("../playwrightHelper");

const logoREAL = 'https://www.redexpertalliance.com/wp-content/uploads/2014/10/Red_Expert_Alliance.jpg'
const AMISblog = 'technology.amis.nl:'

const runSearch = async () => {
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext()
    const page = await context.newPage()
    const navigationPromise = page.waitForNavigation()
    await page.goto(`https://duckduckgo.com/?q=red+expert+alliance&t=h_&ia=web`)

    // debug all events raised in the browser page
    trapEventsOnPage(page)


    await navigationPromise
    await page.waitForSelector('#search_form_input')

    // get our hands on the header area
    const header = await page.$('#header')
    
    // add a JavaScript function to the page
    const searchInSite = "function searchSite( site){ const searchField= document.getElementById('search_form_input'); searchField.value = site + searchField.value;}"
    await page.addScriptTag({ content: searchInSite })
    await page.addScriptTag({ content: b64toBlob })
    // function vanitySearch is injected into the window object in the browser; JavaScript running in the browser can invoke this function, even though it lives and runs in the Node context
    //https://github.com/microsoft/playwright/blob/master/docs/api.md#pageexposefunctionname-playwrightfunction 
    await page.exposeBinding('vanitySearch', async ({ page }) => {
        await page.fill('#search_form_input', '"Lucas Jellema"');
        await page.click('text=Any Time')
        await page.click('text=Past Week')
    });
    await page.exposeBinding('multiSearch', async ({ page }) => {
        const search = await page.$eval('#search_form_input', el => el.value); 
        const searchTerm= encodeURI(search)

        const bingPage = await context.newPage()
        bingPage.goto(`https://bing.com/?q=${searchTerm}&t=h_&ia=web`)
        
        const googlePage = await context.newPage()
        googlePage.goto(`https://www.google.com/search?q=${searchTerm}&oq=${searchTerm}`)

        const yahooPage = await context.newPage()
        yahooPage.goto(`https://search.yahoo.com/search?p=${searchTerm}&fr=altavista&fr2=sb-top-search&iscqry=`)

        const yandexPage = await context.newPage()
        yandexPage.goto(`https://yandex.com/search/?text=${searchTerm}&lr=21396`)

        const ccPage = await context.newPage()
        ccPage.goto(`https://search.creativecommons.org/search?q=${searchTerm}`)

        // now also run search in DuckDuck Go page 
        await page.click('.search__button');
    
    });
    // add a custom header and a button to the search page
    await page.evaluate((args) => {
        const h1 = document.createElement('h1');
        var textnode = document.createTextNode("The Special Red Expert Alliance Edition");
        h1.appendChild(textnode);
        args.header.appendChild(h1);
        args.header.insertBefore(h1, args.header.firstChild);
        const amisblogbutton = document.createElement("input");
        amisblogbutton.type = "button";
        amisblogbutton.value = "Search in context AMIS Blog";
        amisblogbutton.classList.add('zcm-wrap');
        amisblogbutton.onclick = () => { searchSite(`${args.AMISblog} `) }
        args.header.appendChild(amisblogbutton)
        const vanitysearchbutton = document.createElement("input");
        vanitysearchbutton.type = "button";
        vanitysearchbutton.value = "Vanity Search";
        vanitysearchbutton.classList.add('zcm-wrap');
        vanitysearchbutton.onclick = () => { window.vanitySearch() }
        args.header.appendChild(vanitysearchbutton)
        const multisearchbutton = document.createElement("input");
        multisearchbutton.type = "button";
        multisearchbutton.value = "Multi Search";
        multisearchbutton.classList.add('zcm-wrap');
        multisearchbutton.onclick = () => { window.multiSearch() }
        args.header.appendChild(multisearchbutton)
        
    }, { header, logoREAL, AMISblog });


    // this code adds an image into the page - based on the base64 decoded representation of the PNG image (https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript)
    // however - DuckDuckGo does not allow this: it has a security policy thatr prevents images to be loaded from any other location than the three defined in the policy
    await page.evaluate((args) => {
        const img = document.createElement('img');
        const contentType = 'image/png';
        const b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
        const blob = b64toBlob(b64Data, contentType);
        const blobUrl = URL.createObjectURL(blob);
        img.src = blobUrl;
    }, { header, logoREAL });

    // set a value to search on
    await page.fill('#search_form_input', "red expert alliance");
    // vanity search



    // automatically perform the search; note: this causes the frame to navigate, resulting in a new page object (I think)
    //  await page.click('.search__button');


    await navigationPromise

    await sleep(50000000) // 1000* 50 seconds
    await browser.close()
}

runSearch()

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// definition of a JavaScript function to be injected into the browser, used to turn a Base64 encoded definition of an image
// into a blob - that can be used as source for an img tag. (https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript)
const b64toBlob = `const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }`

