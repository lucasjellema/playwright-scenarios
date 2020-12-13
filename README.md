# playwright-scenarios
Some scenarios using Playwright - deeplink bookmarks, tactical integration, RPA, UI Healthcheck, Test Automation of User Interface, documenting web applications, customzing the client side of a web application.

You need to locally install the NPM module Playwright:

`npm i -D playwright`

This installs Playwright and browser binaries for Chromium, Firefox and WebKit. Once installed, you can require Playwright in a Node.js script and automate web browser interactions. See [Playwright on NPM site](https://www.npmjs.com/package/playwright)

## Timesheet
Folder *conclusion-timesheet* contains an example of how to deeplink bookmark a webapplication that requires Microsoft login and multiple navigation steps to make the application ready for use by the user. It also has an example of that same timesheet application: how to scrape data in order to do offline processing/analysis.

## Translate
Folder Translate contains a Node appplication `translate.js` that interacts through Playwright with Google Translate. Node application `translate-api.js` uses the function exported by `translate.js` to implement an API. If you run `translate-api.js`, an HTTP listener is started that will process HTTP requests, use translate.js and indirectly Google Translate for making the desired translation and returns the translated text. At present it is restricted to texts of 5000 characters, but it could fairly easily be extended by making multiple - possibly parallel - calls to Google Translate.

## IMDb
Folder imdb contains a Node application `movie.js`. Using Playwright, this application opens the IMDb web site and searches for a movie by title. It scrapes the IMDb page for movie properties and returns a JSON object with these attributes such as director, actors, writers, release date, duration. It also writes a JPG file with the movie poster. 

## Search
Folder search contains a Node application `search.js`. This application runs the search site DuckDuckGo and customizes it a little: 
* a header is injected
* a button is added to search in the context of a specific site
* a button is added to perform a vanity search (search on the author's name for recent results)
* a button is added to perform the search in parallel on multiple search sites (each site in its own tab)
Note how JavaScript is added to the DuckDuckGo web application and how functions running in the Node context are invoked from within the browser context.