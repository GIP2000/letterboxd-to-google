const puppeteer = require('puppeteer');
const user = "gip2000";

(async() => {
    const browser = await puppeteer.launch({ userDataDir: __dirname + "/userData" });
    const page = await browser.newPage();
    const watchlistMovie = async(str) => {
        await page.goto("https://www.google.com/search?q=" + str, { waitUntil: 'networkidle2' });
        const bool = await page.evaluate(() => {
            return document.getElementById("NXD9g").classList.length === 2;
        });
        if (!bool) return;
        await page.click("#NXD9g");
    }
    await page.goto(`https://letterboxd.com/${user}/watchlist/`, { waitUntil: 'networkidle2' });
    const data = await page.evaluate((user) => {
        return fetch(`https://letterboxd.com/${user}/watchlist/export/`, { method: "GET", credentials: "include" }).then(res => res.text())
    }, user);
    const movies = data.split('\n').map(movie => movie.split(",")[1] + " " + movie.split(",")[2]).slice(1, -1);
    for (let i = 0; i < movies.length; i++)
        await watchlistMovie(movies[i]);
    await browser.close();

})();