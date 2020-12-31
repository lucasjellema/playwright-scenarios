const { injectCalloutIntoPage, populateCallout } = require('./callout')
const { plotBubble } = require('./bubbles')

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const tourNL = {
    title: "Tour of The Netherlands",
    description: "Quick introduction to the Low Countries"
    , scenes:
        [{
            title: "Welcome to The Netherlands"
            , description: "First steps in that small country largely below sea level. Note: Holland is not the correct name for this country."
            , action: async (page) => {
                await plotBubble(page,'#searchInput', 'Type our search Term into the Search Box', "LU", {left:-355, top:-33})
                await page.type('#searchInput', 'The Netherlands', { delay: 100 });
                await page.click('#searchButton')
                await page.waitForSelector('#searchInput')
                await plotBubble(page, '#searchInput',"No more searches at this time", "LU", {left:-355, top:-33}, 3000)                
            }
        },
        {
            title: "A little history"
            , description: "The Pre-History of The Netherlands ended around 800 BC"
            , action: async (page) => {
                await page.waitForSelector('#History')
                const history = await page.$('#History')
                await history.scrollIntoViewIfNeeded({behavior: 'smooth' })
                await sleep(3000)
                const republic = await page.$('a[title="Edit section: Dutch Republic (1581–1795)"]')
                await scrollToElement(page, republic)
                populateCallout(page,"Birth of a Nation", "The rise of the Republic was the result of the failure to come to an agreement with the Spanish overlords.")
                await sleep(2500);
            }
        },
        {
            title: "Sports"
            , description: "The Orange Army - competing in almost any event"
            , action: async (page) => {
                const sports = await page.$('a[title="Edit section: Sports"]')
                await sports.scrollIntoViewIfNeeded()
                populateCallout(page,"Heroes of Past and Future", "Dutch sport heroes of old include Ard and Keessie, Anton Geesink and Bep van Klaveren. Current heroes are Max Verstappen and Estevana Polman")
                await sleep(2000)
                const maxText = await page.$('a:text("was the first Dutchman to win a Grand Prix")') 
                await page.evaluate(({maxText}) => {
                    const p = maxText.parentElement                    
                    let newhtml = `<mark>${p.innerHTML }</mark>`;
                    p.innerHTML = newhtml;
                    p.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                }, ({maxText}))
                await sleep(3500);
            }
        },
        ]
}
// browser - highlight searched
//      let re = new RegExp(searched,"g"); // search for all instances
// 		let el = document.getElementById("text");
//   	let newText = el.innerHTML.replace(re, `<mark>${searched}</mark>`);
// 		el.innerHTML = newText;

const tourFR = {
    title: "Tour of France"
    , description: "We will pay a brief visit to France"
    , scenes:
        [{
            title: "Bienvenue en France"
            , description: "Welcome dans la douce France."
            , action: async (page) => {
                await page.type('#searchInput', 'France', { delay: 100 });
                await page.click('#searchButton')
            }
        },
        {
            title: "A little history",
            description: "Un peu de Histoire"
            , action: async (page) => {
                await page.waitForSelector('"Show globe"')
                await page.click('"Show globe"')

            }
        }
        ]
}


const tourUK = {
    title: "Excursion in Great Britain",
    description: "Brief tour of the United Kingdom of Northern Ireland, Scotland, Wales and England"
    , scenes:
        [{
            title: "Welcome in the UK",
            description: "Let's visit the Wikipedia page on the UK, shall we?"
            , action: async (page) => {
                await page.type('#searchInput', 'United Kingdom', { delay: 100 });
                await page.click('#searchButton')
            }
        },
        {
            title: "Wandering around",
            description: "Checking out the country side",
            action: async (page) => {
                await page.waitForSelector('"Show globe"')
                await page.click('"Show globe"')

            }
        }
        ]
}

const scenarios = [tourNL, tourFR, tourUK]


exports.scenarios = scenarios

async function scrollToElement(page, element) {
    await page.evaluate((el) => {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }, (element))
}
