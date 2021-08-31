const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
puppeteer.use(pluginStealth());
const user = "gip2000";
(async() => {
    const browser = await puppeteer.launch({
        // executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        userDataDir: "./userData",
        headless: false
    });
    const page = await browser.newPage();
    await page.goto("https://accounts.google.com");
    const page2 = await browser.newPage();
    await page2.goto(`https://letterboxd.com/${user}/watchlist/`);



})();