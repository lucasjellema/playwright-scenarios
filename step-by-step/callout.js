const CALLOUT_ID = "my-playwright-floating-callout"

const injectCalloutIntoPage = async (page, title, bodyText) => {
  await page.addStyleTag({ content: calloutStyleTag })
  const containerElement = await page.$('body')
  const html = callout.replace("callout_title", title).replace("callout_body", bodyText)
  if (containerElement) {
    addHTML(html, containerElement, page)
  }
}
exports.injectCalloutIntoPage = injectCalloutIntoPage

const addHTML = async function (html, parentElementHandle, page) {
  await page.evaluate((args) => {
    // check if div#args.CALLOUT_ID exists; if so, do not add again!
    const callout = document.getElementById(args.CALLOUT_ID)
    if (!callout) {
      const div = document.createElement('div');
      div.setAttribute("id", args.CALLOUT_ID);
      //         div.classList.add('callout');
      div.innerHTML = args.html
      args.parentElementHandle.appendChild(div);
    } else {
      callout.innerHTML = args.html
    }
  }, { parentElementHandle, html, CALLOUT_ID });
}

const calloutStyleTag = ` 
  
  /* Callout box - fixed position at the bottom of the page */
  .callout {
    position: fixed;
    bottom: 35px;
    right: 20px;
    margin-left: 20px;
    max-width: 400px;
  }
  
  /* Callout header */
  .callout-header {
    padding: 25px 15px;
    background: #555;
    font-size: 30px;
    color: white;
  }
  
  /* Callout container/body */
  .callout-container {
    padding: 15px;
    background-color: #ccc;
    color: black
  }
  
  /* Close button */
  .closebtn {
    position: absolute;
    top: 5px;
    right: 15px;
    color: white;
    font-size: 30px;
    cursor: pointer;
  }
  
  /* Change color on mouse-over */
  .closebtn:hover {
    color: lightgrey;
  }
   
  `
const callout = `<div class="callout">
  <div class="callout-header">callout_title</div>
  <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
  <div class="callout-container">
    <p>callout_body</p>
  </div>
</div>    
  `
