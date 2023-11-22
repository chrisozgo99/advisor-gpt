import puppeteer from "puppeteer";
import * as pdfjs from 'pdfjs-dist';

import fs from "fs";
import { computerEngineeringCourseRequirementsURLs } from "../utils/urls.js"

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

async function fourYearPlanToJson(url) {
    let finalString = '';
    pdfjs.getDocument(url).promise.then(function(pdf) {
        pdf.getPage(1).then(function(page) {
            page.getTextContent().then(function(textContent) {
                const textItems = textContent.items;
                finalString = textItems.map(function(item) {
                    return item.str;
                }).join(' ');
                console.log(finalString);
            });
        });
    });

    return finalString;

}

async function processHtml(page) {
    // return text from the webpage
    const text = await page.$eval('*', (el) => el.innerText);
    await page.close();
    return text;
}

async function main() {
    // for (let i = 0; i < computerEngineeringCourseRequirementsURLs.length; i++) {
    //     const url = computerEngineeringCourseRequirementsURLs[i];
    //     if (url) {
    //         const {page, browser} = await scrapeSite(url, false);
    //         await courseRequirementsToJson(page, browser);
    //     }
    // }

    const pdfUrl = 'https://ece.gatech.edu/sites/default/files/documents/undergraduate/curriculum-threads/ee/bioees.pdf';
    fourYearPlanToJson(pdfUrl);
}

main();