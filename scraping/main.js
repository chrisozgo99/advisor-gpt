import puppeteer from "puppeteer";
import fs from "fs";
import { computerEngineeringCourseRequirementsURLs } from "../utils/urls.js"

function scrape() {
    return new Promise(async (resolve, reject) => {
        const urlPrefix = "gatech.edu"

        try {
            const browser = await puppeteer.launch({
                headless: false,
            });
            const page = await browser.newPage();
            await page.goto("https://degreeworks.gatech.edu/files/concentration_mgt.pdf");
            const html = await page.content();
            await browser.close();
            // save html to a file
            fs.writeFile("data/test.html", html, function(err) {
                if (err) {
                    console.log(err);
                }
            });
            resolve(html);
        } catch (e) {
            reject(e);
        }
    });
}

async function scrapeSite(url, headless = true) {
    const browser = await puppeteer.launch({
        headless: headless,
    });
    const page = await browser.newPage();
    await page.goto(url);
    return {page, browser};
}

async function courseRequirementsToJson(page, browser) {
    const json = {};

    const contentArea = await page.$('#contentarea');

    json.major = await contentArea.$eval('h1', (el) => el.innerText.split(' - ')[0]);
    json.concentration = await contentArea.$eval('h1', (el) => el.innerText.split(' - ')[1]);
    
    const requirementsTable = await contentArea.$('table');

    let header;
    let creditHours;

    const rows = await requirementsTable.$$eval('tr', (els) => els.map((el) => {        
        const className = el.className;
        const text = el.innerText;
        return [className, text];        
    }));

    for (let i = 0; i < rows.length; i++) {
        if (i === rows.length - 1) {
            json.totalHours = rows[i][1].split('\t')[1];
        } else if (i === rows.length - 2) {
            json.freeElectives = rows[i][1].split('\t')[1];
        } else if (rows[i][0].includes('areaheader')) {
            json[rows[i][1].split('\t')[0]] = [];
            header = rows[i][1].split('\t')[0];
        } else if (!rows[i][0].includes('orclass')) {
            const courseInfo = rows[i][1].split('\t');
            creditHours = courseInfo[2] ? courseInfo[2] : creditHours;

            if (!courseInfo[0].toLowerCase().includes('select')) {
                json[header]?.push({
                    cc: courseInfo[0].split('\n')[0],
                    name: courseInfo[1],
                    hours: creditHours,
                });
            }
        } else if (rows[i][0].includes('orclass')){
            const courseInfo = rows[i][1].split('\t');
            json[header]?.push({
                cc: courseInfo[0].split('\n')[0],
                name: courseInfo[1],
                hours: creditHours,
            });        
        }
    }

    await browser.close();
    
    fs.writeFile(`data/course-requirements/computer-engineering/${json.concentration}.json`, JSON.stringify(json, null, 4), function(err) {
        if (err) {
            console.log(err);
        }
    });

    return json;
}

async function processHtml(page) {
    // return text from the webpage
    const text = await page.$eval('*', (el) => el.innerText);
    await page.close();
    return text;
}

async function main() {
    for (let i = 0; i < computerEngineeringCourseRequirementsURLs.length; i++) {
        const url = computerEngineeringCourseRequirementsURLs[i];
        if (url) {
            const {page, browser} = await scrapeSite(url, false);
            await courseRequirementsToJson(page, browser);
        }
    }
}

main();