const gotoTimesheet = async function (conclusionCredentials, context) {
    const page = await context.newPage();
  
    // open page for Conclusion Excellence; then login to the Microsoft account
    await page.goto(conclusionCredentials.CONCLUSION_TIMESHEET_URL);
    const navigationPromise = page.waitForNavigation();
    // at this point, the Microsoft Login Page is open; provide MS account username
    await page.fill('input[type=email]', conclusionCredentials.username);
    await page.click('input[type=submit]');
  
    // the organization's login page is presented and the password must be provided
    await page.waitForSelector('#submitButton');
    await page.fill('#passwordInput', conclusionCredentials.password);
    await page.click('#submitButton');
  
    // at this point, the 2-factor authentication's second leg kicks in and the MS Authenticator App asks for confirmation
  
    await navigationPromise
  
    // a page that says "Stay signed in? Do this to reduce the number of times you are asked to sign in."
    // click on either the Yes or No button to proceed
    await page.waitForSelector('.row #idSIButton9')
    //  await page.click('.row #idSIButton9') // the Yes button's id value = idSIButton9
    await page.click('input[value=Yes]')
  
    await navigationPromise
  
    await page.waitForSelector('#P_C_W_8A4780394194926ED415789A10ADD7D9_Content #P_C_W_8A4780394194926ED415789A10ADD7D9_ctl06')
  
    console.log("go to Uren in new tab")
    // a new tab is opened when the link is clicked; this page is identified through newPage 
    // https://stackoverflow.com/questions/64348468/switch-tabs-in-playwright-test$
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      // click on the uren option in the horizontal icon bar to start navigation to uren module (which opens in a new tab)
      await page.click('a[title=Uren]') // opens new tab
    ])
    await newPage.waitForLoadState();
  
    console.log("Title of new tab: ")
    console.log(await newPage.title());
    await navigationPromise
    //Login Complete, goto AFAS/Conclusion Excellence
    // click on the big button labeled Uren
    //alternatively: execute this javascript:__doPostBack('xecNavigate$rptNavigateLinks$ctl01$lbNavigateButton','')
    await newPage.click('#xecNavigate_rptNavigateLinks_lbNavigateButton_0')
  
    return newPage;
  }
 
  exports.gotoTimesheet = gotoTimesheet