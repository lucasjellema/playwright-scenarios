Module inject-shortcuts demonstrates how functionality can be added to a website that is loaded by Playwright in headful mode. One or more short cut key combinations can be configured in the website that - when activated - cause JavaScript to be executed in the browser context that can call (back) to functions in the Node application.

A simple example in inject-shortcut-download-all-images.js: the web site of AMIS | Conclusion is loaded. Then two short cuts are added: 
* CTRL + y to take a snapshot of the page as it currently looks (and save it as a PNG image)
* CTRL + b to download all images in the page to the local file system (that have width and height both larger than 50 x 50 pixels)

The interesting bits here are:
* use context.exposeBinding() to make a function in the Node application available in the browser context 
* use page.addScriptTag() to add new JavaScript functions to the browser context and/or execute JavaScript snippets in the browser context
* document.addEventListener('keyup', somefunction) to add an event handler for the key up event to the browser context  