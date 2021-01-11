# Hands On Instructions

This document suggests steps to get started with Playwright. It describes steps to install Playwright, to run a number of demonstrations and to get going with your own applications leveraging Playwright.

## 1. Installation

You can work with Playwright in various environments. For headful scenarios, you need to be able to display a graphical (desktop) UI. Working on Windows, MacOS or a Linux Desktop is recommended. You can go through this workshop in your regular Node development environment or (when on Windows) use a Windows Sandbox (an isolated, clean environment).

### Run in Local Environment
In order to run the scenarios in a local environment, you only need a recent Node runtime environment including npm.

Install all workshop resources:
`git clone https://github.com/lucasjellema/playwright-scenarios`

Navigate into the root directory `playwright-scenarios` for the repository created locally by this clone operation

Next install the NPM module Playwright:

`npm i playwright`

This installs Playwright and browser binaries for Chromium, Firefox and WebKit. See [Playwright on NPM site](https://www.npmjs.com/package/playwright) for details on the npm module.

### Run in isolated Windows Sandbox
To explore these scenarios on Windows, you can work most easily in a Windows Sandbox (see [this article](https://technology.amis.nl/frontend-technology/quickly-run-nodejs-demos-in-vanilla-windows-sandbox-featuring-scoop/) for detailed instructions and step by step picture).

#### Quick Instructions for running in Windows Sandbox

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


## 2. Run Demonstrations