Module conclusion-timesheet-deeplink.js will navigate to the Timesheet application, perform the login and expand projects to fully prepare the timesheet for inspection or entry of worked hours.

Module conclusion-timesheet-report.js will navigate to the Timesheet application, perform the login and scrape the number of hours for the current period of five weeks and several earlier periods. All data is made available in a JavaScript array of day records (that provide date, delta in number of hours with expected number, type of day - weekend, vacation, national holiday)

The modules can be ran using:
`node conclusion-timesheet-deeplink.js %1`

where for %1 you need to provide the secret key used to encrypt the contents of conclusion-credentials.js file. 

You need to have username and password and the URL for the Conclusion Timesheet web application, encrypt the first two using the crypt.js module and update the file conclusion-credentials.js with the encrypted values.