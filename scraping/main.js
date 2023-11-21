import puppeteer from "puppeteer";

function scrape() {
    return new Promise(async (resolve, reject) => {
        const urlPrefix = "https://gatech.edu"

        try {
            const browser = await puppeteer.launch({
                headless: false,
            });
            const page = await browser.newPage();
            await page.goto(urlPrefix);
            const html = await page.content();
            await browser.close();
            resolve(html);
        } catch (e) {
            reject(e);
        }
    });
}

scrape().then((value) => {
    console.log(value); // Success!
    }
);