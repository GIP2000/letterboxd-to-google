const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const { letterBoxd, google } = require('./accountInfo.json')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(pluginStealth());
puppeteer.use(AdblockerPlugin()); 

const checkExists = async(selector, page) => {
    const elementHandle = await page.$(selector);
    return elementHandle !== null;
}

const checkIfSignIn = async(selector, page) => {
    return page.evaluate((selector) => {
        const DOM = document.querySelector(selector);
        return DOM?.innerText?.includes("SIGN IN");
    }, selector);
    
}


const googleSignIn = async(page = null) => {
    let browser;
    if (page == null) {
        browser = await puppeteer.launch({
            userDataDir: __dirname + "/userData",
            headless: false
        });
        page = await browser.newPage();
    }

    await page.goto("https://accounts.google.com");
    const exists = await checkExists('input[type=email]', page);
    if (!exists) return;
    await page.type('input[type=email]', google.email);
    await page.click(".VfPpkd-RLmnJb");
    await page.waitForSelector("input[type=password]", { visible: true, timeout: 0 });
    await page.type('input[type=password]', google.password);
    await page.click(".VfPpkd-RLmnJb");
    await page.waitForSelector(".B1tEqd",{ visible: true, timeout: 0 })
    if (browser != null)
        await browser.close();
}

const letterBoxdSignIn = async(page = null) => {
        let browser = null;
        if (page == null) {
            browser = await puppeteer.launch({
                userDataDir: __dirname + "/userData",
                headless: false
            });
            page = await browser.newPage();
        }
        await page.goto(`https://letterboxd.com/${letterBoxd.user}/watchlist/`);
        if(!(await checkIfSignIn("a.navlink.has-icon", page))) return;
        await page.click("a.navlink.has-icon");
        await page.type("input#username[type=email]", letterBoxd.email);
        await page.type("input#password[type=password]", letterBoxd.password);
        await page.click("input#remember[type=checkbox]");
        await page.click("input.button.-action.button-green[type=submit]");
        await page.waitForSelector("a.has-icon.toggle-menu", { visible: true, timeout: 0 });
        
        if (browser != null)
            await browser.close();

    }
(async() => {
    const browser = await puppeteer.launch({
        userDataDir: __dirname + "/userData",
    });
    const page = await browser.newPage();
    await googleSignIn(page);
    await letterBoxdSignIn(page);
    await browser.close();
})();