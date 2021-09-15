const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
// const UserAgent = require('user-agents');
const fs = require('fs');
const oldMovies = require("./movies.json");
const {letterBoxd: {user}} = require("./accountInfo.json")
puppeteer.use(pluginStealth());


(async() => {
    const browser = await puppeteer.launch({ userDataDir: __dirname + "/userData" });
    const page = await browser.newPage();
    const watchlistMovie = async(str, inverse = false, nest = false) => {
        // const userAgent = new UserAgent(); 
        // page.setUserAgent(userAgent.toString());
        console.log(`movie ${str}. inverse = ${inverse}`);
        await page.goto("https://www.google.com/search?q=" + str, { waitUntil: 'networkidle2' });
        let [exists,isOnWatchlist] = await page.evaluate(() => {
            if(!document.getElementById("NXD9g")) return ([false,false])
            return ([true,document.getElementById("NXD9g")?.classList?.length === 2]);
        });
        if(!exists && nest) return;
        if(!exists && !nest) return await watchlistMovie(str.split(" ").slice(0,-1).join(" "), inverse,true);
        if (inverse) isOnWatchlist = !isOnWatchlist;
        if (!isOnWatchlist) return;
        await page.click("#NXD9g");
    }
    await page.goto(`https://letterboxd.com/${user}/watchlist/`, { waitUntil: 'networkidle2' });
    const data = await page.evaluate((user) => {
        return fetch(`https://letterboxd.com/${user}/watchlist/export/`, { method: "GET", credentials: "include" }).then(res => res.text())
    }, user);
    const movies = data.split('\n').map(movie => movie.split(",")[1] + " " + movie.split(",")[2]).slice(1, -1);
    for (let i = 0; i < movies.length; i++){
        await watchlistMovie(movies[i]);
        page.waitFor(1000); 
    }
    for (let i = 0; i < oldMovies.length; i++) {
        if (movies.includes(oldMovies[i])) continue;
        await watchlistMovie(oldMovies[i], true);
    }

    fs.writeFileSync('./movies.json', JSON.stringify(movies));
    await browser.close();

})();