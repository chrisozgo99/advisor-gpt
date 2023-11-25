import puppeteer from "puppeteer";
import * as pdfjs from 'pdfjs-dist';

import fs from "fs";
import { computerEngineeringFourYearPlanURLs } from "../utils/urls.js"

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

async function fourYearPlanToJson(url, major) {
    const json = {};
    json.major = major;
    json.totalHours = 0;
    json.fourYearPlan = {
        firstYear: {
            fall: {
                courses: [],
                totalHours: 0,
            },
            spring: {
                courses: [],
                totalHours: 0,
            }
        },
        secondYear: {
            fall: {
                courses: [],
                totalHours: 0,
            },
            spring: {
                courses: [],
                totalHours: 0,
            }
        },
        thirdYear: {
            fall: {
                courses: [],
                totalHours: 0,
            },
            spring: {
                courses: [],
                totalHours: 0,
            }
        },
        fourthYear: {
            fall: {
                courses: [],
                totalHours: 0,
            },
            spring: {
                courses: [],
                totalHours: 0,
            }
        }
    };
    
    let year = 'firstYear';
    let semester = 'fall';
    let totalSemesterHours = 'fall'

    return await pdfjs.getDocument(url).promise.then(async function(pdf) {
        return await pdf.getPage(1).then(async function(page) {
            return await page.getTextContent().then(function(textContent) {
                const textItems = textContent.items;
                let concentrationIndex = major === 'Computer Engineering' ? 3 : 1;
                json.concentration = textItems[textItems.length - concentrationIndex]?.str;
                // console.log(textItems[0].str);
                // console.log(textItems[textItems.length - 3]?.str);
                for (let i = 12; i < textItems.length; i+=4) {

                    if (textItems[i].str.toLowerCase().includes('second year')) {
                        year = 'secondYear';
                        semester = 'fall';
                        i += 12;
                    } else if (textItems[i].str.toLowerCase().includes('third year')) {
                        year = 'thirdYear';
                        semester = 'fall';
                        i += 12;
                    } else if (textItems[i].str.toLowerCase().includes('fourth year')) {
                        year = 'fourthYear';
                        semester = 'fall';
                        i += 12;
                    }

                    if (
                        textItems[i].str.toLowerCase().includes('total semester hours') && 
                        year === 'fourthYear' &&
                        totalSemesterHours === 'spring'
                    ) {
                        let totalHoursIndex = major === 'Computer Engineering' ? 7 : 5;
                        json.fourYearPlan[year][totalSemesterHours].totalHours = textItems[i+2]?.str;
                        json.totalHours = textItems[textItems.length - totalHoursIndex]?.str;
                        break;
                    } else if (textItems[i].str.toLowerCase().includes('total semester hours')) {
                        json.fourYearPlan[year][totalSemesterHours].totalHours = textItems[i+2]?.str;
                        totalSemesterHours = totalSemesterHours === 'fall' ? 'spring' : 'fall';
                    } else if (parseInt(textItems[i + 2]?.str) < 10 && parseInt(textItems[i+4]?.str) < 10) {
                        json.fourYearPlan[year][semester].courses.push({
                            course: textItems[i]?.str,
                            creditHours: textItems[i+2]?.str,
                        });
                        i+=2;
                    } else {
                        json.fourYearPlan[year][semester].courses.push({
                            course: textItems[i]?.str,
                            creditHours: textItems[i+2]?.str,
                        });
                    }
                    semester = semester === 'fall' ? 'spring' : 'fall';
                }
                return json;
            });
        });
    })
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

    const pdfUrls = computerEngineeringFourYearPlanURLs;
    pdfUrls.forEach(async (pdfUrl) => {
        try {
            const res = await fourYearPlanToJson(pdfUrl, 'Computer Engineering');
            fs.writeFile(`data/four-year-plans/computer-engineering/${res.concentration}.json`, JSON.stringify(res, null, 4), function(err) {
                if (err) {
                    console.log(err);
                }
            });
        } catch (err) {
            console.log(err);
        }
    });
}

main();