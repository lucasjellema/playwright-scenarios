# playwright-scenarios
This repo contains a collection of scenarios using Playwright - deeplink bookmarks, tactical integration, RPA, UI Healthcheck, Test Automation of User Interface, documenting web applications, customzing the client side of a web application.

## Run in isolated Windows Sandbox
To explore these scenarios on Windows, you can work most easily in a Windows Sandbox (see [this article](https://technology.amis.nl/frontend-technology/quickly-run-nodejs-demos-in-vanilla-windows-sandbox-featuring-scoop/) for detailed instructions and step by step picture).

### quick instructions

Start Windows Sandbox.
Open Command Line as Administrator.
Execute `notepad script.ps1`
Confirm that notepad should create the file
Paste this snippet to the the file:
```
Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')

# Note: if you get an error you might need to change the execution policy (i.e. enable Powershell) with
# Set-ExecutionPolicy RemoteSigned -scope CurrentUser

# this one line is all it takes to install a git client, the latest nodejs runtime environment and a distribution of VS Code (the latter is optional and can be removed to save time)
scoop install git nodejs 
scoop bucket add extras 
scoop install vscodium

node --version
```
Execute this command:
```
%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command ".\script.ps1"
```
This will install Scoop into the Sandbox and subsequently use Scoop to install a Git client and the Node runtime.

Close the command line (window)
Open a new command line - either as Admin or not
Paste the following lines:
```
git clone https://github.com/lucasjellema/playwright-scenarios
cd playwright-scenarios
npm install -D playwright
node .\step-by-step\step-by-step.js
```
The last step runs the demonstration that shows a Wikipedia tutorial with three scenarios for Netherlands, France and UK. Please maximize the Windows Sandbox window as well as the browser window.


## Run in Local Environment
In order to run the scenarios in a local environment, you only need a recent Node runtime environment including npm.

Next you need to locally install the NPM module Playwright:

`npm i -D playwright`

This installs Playwright and browser binaries for Chromium, Firefox and WebKit. Once installed, you can require Playwright in a Node.js script and automate web browser interactions. See [Playwright on NPM site](https://www.npmjs.com/package/playwright)

## The Scenarios

Each of these scenarios can be ran from the command line; instructions are provided to run the scenario from the root directory of this repository:

### Floating Menu
Shows how a floating toolbar can be injected into virtually any web application. [This article](https://technology.amis.nl/frontend-technology/inject-generic-floating-toolbar-into-any-web-application-or-site-using-playwright/) provides background on this scenario.

`node .\floating_menu\floating-menu.js`


### Shortcut Key Injection
To show how a shortcut key combination can be injected into almost any page. This demo shows the shortcut key combination to download all images in a web page to local files. See [this article for details](https://technology.amis.nl/tech/use-playwright-to-inject-shortcut-keys-into-any-web-page-for-example-to-download-all-images/) 

`node .\inject-shortcuts\inject-shortcut-download-all-images.js`

### Step by Step Tutorial
Run demonstrations or instructions of browser actions. Allow the user to pause and skip acts, and to reset and switch scenarios. Allow the user to interact with the browser before, after and during the scenarios. This demonstration shows three scenarios (The Netherlands, France, UK). Each country is introduced – using specific pages and sections on Wikipedia as well as through supporting sites. A callout is used to explain the scenario and each act. Balloon texts are used to further guide the user,

This article introduces the demo in detail:[Run Automated Step-by-Step Browser Scenarios for Instruction or Demo from NodeJS applications with Playwright]
(https://technology.amis.nl/frontend-technology/run-automated-step-by-step-browser-scenarios-for-instruction-or-demo-from-nodejs-applications-with-playwright/)

Run with
`node .\step-by-step\step-by-step.js`

### Timesheet
Folder *conclusion-timesheet* contains an example of how to deeplink bookmark a webapplication that requires Microsoft login and multiple navigation steps to make the application ready for use by the user. It also has an example of that same timesheet application: how to scrape data in order to do offline processing/analysis.

### Translate
Folder Translate contains a Node appplication `translate.js` that interacts through Playwright with Google Translate. Node application `translate-api.js` uses the function exported by `translate.js` to implement an API. If you run `translate-api.js`, an HTTP listener is started that will process HTTP requests, use translate.js and indirectly Google Translate for making the desired translation and returns the translated text. At present it is restricted to texts of 5000 characters, but it could fairly easily be extended by making multiple - possibly parallel - calls to Google Translate.

`node  .\translate\translate-api` – this runs a REST API at port 3000 listening for HTTP requests such as http://localhost:3000/?sourceLanguage=nl&targetLanguage=fr&sourceText=Goedendag ; This API leverages the Google Translate Web UI to perform a translation.

### IMDb
Folder imdb contains a Node application `movie.js`. Using Playwright, this application opens the IMDb web site and searches for a movie by title. It scrapes the IMDb page for movie properties and returns a JSON object with these attributes such as director, actors, writers, release date, duration. It also writes a JPG file with the movie poster. 

`node .\imdb\movies.js`

### Search
Folder search contains a Node application `search.js`. This application runs the search site DuckDuckGo and customizes it a little: 
* a header is injected
* a button is added to search in the context of a specific site
* a button is added to perform a vanity search (search on the author's name for recent results)
* a button is added to perform the search in parallel on multiple search sites (each site in its own tab)
Note how JavaScript is added to the DuckDuckGo web application and how functions running in the Node context are invoked from within the browser context.

`node .\search\search.js`

### WhatsApp

Module whatsapp.js navigates to the WhatsApp Web application. It runs in headful mode and it will present a QR code that you need to scan in the WhatsApp App on your mobile device. The module will then send a message to a WhatsApp contact. The contact and the message are defined in the constants `whatsappContact` and `message`. 

The modules can be ran using:
`node .\whatsapp\whatsapp.js`

See [this article: How to APIfy WhatsApp – Programmatic interaction with WhatsApp from Node using Playwright](https://technology.amis.nl/languages/node-js/how-to-apify-whatsapp-programmatic-interaction-with-whatsapp-from-node-using-playwright/)