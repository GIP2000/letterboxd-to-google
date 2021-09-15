const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin()); 

(async() => {
    const browser = await puppeteer.launch({
        userDataDir: __dirname + "/userData",
        headless: false
    });
    const page = await browser.newPage();
    await page.goto("https://accounts.google.com"); 
})();