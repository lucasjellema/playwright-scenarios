# Hands On Instructions

This document suggests steps to get started with Playwright. It describes steps to install Playwright, to run a number of demonstrations and to get going with your own applications leveraging Playwright.

## 1. Installation

You can work with Playwright in various environments. For headful scenarios, you need to be able to display a graphical (desktop) UI. Working on Windows, MacOS or a Linux Desktop is recommended. You can go through this workshop in your regular Node development environment or (when on Windows) use a Windows Sandbox (an isolated, clean environment).

### Run in Local Environment
In order to run the scenarios in a local environment, you only need a recent Node runtime environment including npm.

Install all workshop resources:
```git clone https://github.com/lucasjellema/playwright-scenarios```

Navigate into the root directory `playwright-scenarios` for the repository created locally by this clone operation

Next install the NPM module Playwright:

```npm i playwright```

This installs Playwright and browser binaries for Chromium, Firefox and WebKit. See [Playwright on NPM site](https://www.npmjs.com/package/playwright) for details on the npm module.

### Run in isolated Windows Sandbox
To explore these scenarios on Windows, you can work most easily in a Windows Sandbox (see [this article](https://technology.amis.nl/frontend-technology/quickly-run-nodejs-demos-in-vanilla-windows-sandbox-featuring-scoop/) for detailed instructions and step by step picture).

#### Quick Instructions for running in Windows Sandbox

Start Windows Sandbox.
Open Command Line as Administrator.
Execute `notepad script.ps1`
Confirm that notepad should create the file
Paste this snippet to the the file script.ps1:
```
Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')

# Note: if you get an error you might need to change the execution policy (i.e. enable Powershell) with
# Set-ExecutionPolicy RemoteSigned -scope CurrentUser

# this one line is all it takes to install a git client and the latest nodejs runtime environment 
scoop install git nodejs 
# these two lines install a distribution of VS Code (this is optional and these lines can be removed to save time)
scoop bucket add extras 
scoop install vscodium

node --version
```
Save and close the file.

Execute this command - which basically runs the file `script.ps1` that you have just created:
```
%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command ".\script.ps1"
```
This will install Scoop into the Sandbox and subsequently use Scoop to install a Git client and the Node runtime.

Close the command line (window). Then open a new command line - either as Admin or not.

Paste the following lines:
```
git clone https://github.com/lucasjellema/playwright-scenarios
cd playwright-scenarios
npm install -D playwright
node .\step-by-step\step-by-step.js
```
The last step runs a demonstration that shows a Wikipedia tutorial with three scenarios for Netherlands, France and UK. Please maximize the Windows Sandbox window as well as the browser window.


## 2. Run Demonstrations
Each of the demo scenarios can be ran from the command line, from the root directory `playwright-scenarios`. Most are headful, some are headless.

### Quick Demos

There are a few very small, simple and quick demos you can run to get going.

For example, run:
```node quick-demos\get-started.js```
This runs a Chromium browser, navigates to website *http://whatsmyuseragent.org/*, retrieves the IP address of your laptop and takes a screenshot (saving it as *example.png*). You can change *chromium* to *firefox* (twice) in file *get-started.js* and run the program again. This time, a Firefox browser is started - and the same actions are performed.

Now run 
```node quick-demos\page.js```

This demo opens a page ("http://example.com"), then clicks on the first link it can find on this page which causes a navigation to take place. The URL of the new page is written to the console. A second page (i.e. browser tab) is opened. This page navigates to the GitHub Repo for this workshop. Finally, the button labeled *main* is clicked and the dropdown for selecting branches or tags is opened. Note: the call to *chromium* contains parameter *sloMo*, set to 3000. This is the number of miliseconds added by Playwright between each action it takes. This is a useful feature for debugging the actions our program is taking. When the scenario is done, we can remove the parameter or set it to a very low value. You may want to try this right now.

To see how Playwright can also take a video of the action it takes, run
```node quick-demos\generateVideo.js```
An MP4 file is generated in folder *quick-demos\video* which shows exactly what was seen in the browser as the scenario was executed. Note that you do not need to run in headful mode in order to generate the video. A video is especially useful in case the scenario fails.

Somewhat similarly, Playwright can also generate a PDF file that contains the full content of a web page. Run
```node quick-demos\generatePDF.js```
This will take a quick tour of the CNN website and generate the file *cnn.pdf*. Note: generating PDF documents currently only works with the Chromium browser and when running in *headless* mode.

### IMDb
Folder imdb contains a Node application `movie.js`. Using Playwright, this application opens the IMDb web site and searches for a movie by title. It scrapes the IMDb page for movie properties and returns a JSON object with these attributes such as director, actors, writers, release date, duration. It also writes a JPG file with the movie poster. 

Run
```node .\imdb\movies.js```
to get a JSON document on the command line with details about three movies. In the directory imdb/images, you will find the movie posters for these movies. Add calls to *lookupMovie()* in order to scrape IMDb for additional movies.


### Translate
Folder Translate contains a Node appplication `translate.js` that interacts through Playwright with Google Translate. You can run this application with
`node translate\translate.js`

You will get the translation into French of the sentence *De boodschappen voor vandaag zijn melk, boter en eieren. Neem ook een stuk kaas mee. En ik lust ook een pot met stroop.* (this is Dutch). You can change the target language and the source text and language by editing the call to function *doTranslation()* at line 41 of this file.

Node application `translate-api.js` uses the function exported by `translate.js` to implement an API. If you run `translate-api.js`, an HTTP listener is started that will process HTTP requests, use translate.js and indirectly Google Translate for making the desired translation and returns the translated text. At present it is restricted to texts of 5000 characters, but it could fairly easily be extended by making multiple - possibly parallel - calls to Google Translate.

`node  .\translate\translate-api` – this runs a REST API at port 3000 listening for HTTP requests such as http://localhost:3000/?sourceLanguage=nl&targetLanguage=fr&sourceText=Goedendag ; This API leverages the Google Translate Web UI to perform a translation.

### Step by Step Tutorial
Run demonstrations or instructions of browser actions. Allow the user to pause and skip acts, and to reset and switch scenarios. Allow the user to interact with the browser before, after and during the scenarios. This demonstration shows three scenarios (The Netherlands, France, UK). Each country is introduced – using specific pages and sections on Wikipedia as well as through supporting sites. A callout is used to explain the scenario and each act. Balloon texts are used to further guide the user,

This article introduces the demo in detail:[Run Automated Step-by-Step Browser Scenarios for Instruction or Demo from NodeJS applications with Playwright]
(https://technology.amis.nl/frontend-technology/run-automated-step-by-step-browser-scenarios-for-instruction-or-demo-from-nodejs-applications-with-playwright/)

Run with
`node .\step-by-step\step-by-step.js`

