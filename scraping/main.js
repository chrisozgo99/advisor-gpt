import fs from "fs";
import { computerEngineeringFourYearPlanURLs, electricalEngineeringThreads } from "../utils/urls.js"
import { courseScheduleToJson, getThreadInfo, scrapeSite } from "./scraping.js";

async function main() {
    // for (let i = 0; i < computerEngineeringCourseRequirementsURLs.length; i++) {
    //     const url = computerEngineeringCourseRequirementsURLs[i];
    //     if (url) {
    //         const {page, browser} = await scrapeSite(url, false);
    //         await courseRequirementsToJson(page, browser);
    //     }
    // }

    let res = await courseScheduleToJson('https://ece.gatech.edu/sites/default/files/documents/undergraduate/course_schedule.pdf');


    // const pdfUrls = computerEngineeringFourYearPlanURLs;
    // pdfUrls.forEach(async (pdfUrl) => {
    //     try {
    //         const res = await fourYearPlanToJson(pdfUrl, 'Computer Engineering');
    //         fs.writeFile(`data/four-year-plans/computer-engineering/${res.concentration}.json`, JSON.stringify(res, null, 4), function(err) {
    //             if (err) {
    //                 console.log(err);
    //             }
    //         });
    //     } catch (err) {
    //         console.log(err);
    //     }
    // });
}

main();