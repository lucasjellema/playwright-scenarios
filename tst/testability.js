const { chromium } = require('playwright');

async function readFile(path) {
    const fsPromises = require('fs').promises;
    const data = await fsPromises.readFile(path)
        .catch((err) => console.error('Failed to read file', err));
    return data.toString();
}

const runAndTestPage = async () => {
    const pageContent = await readFile(`${__dirname}/page2test.html`)
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.setContent(pageContent)
    // test the UI
    const x = 21
    const y =2
    await page.fill('#firstNumber',`${x}`)
    await page.fill('#secondNumber',`${y}`)
    await page.click('"Multiply"')
    const uiResult = await page.$eval('#result', (span)=> span.innerText)
    console.log(`ui result ${uiResult}`)

    // test the logic in the page - the business function multiply 
    const logicResult = await page.evaluate(({x,y}) => multiply(x,y), {x:x,y:y})
    console.log(`result = ${logicResult}`)
}

runAndTestPage()