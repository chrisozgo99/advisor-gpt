import fs from "fs";
import { computerEngineeringCourseRequirementsURLs, computerEngineeringFourYearPlanURLs, electricalEngineeringThreads } from "../utils/urls.js"
import { consolidateFourYearPlans, courseRequirementsToJson, getThreadInfo, pdfToTxt, scrapeSite } from "./scraping.js";

async function main() {
    // for (let i = 0; i < computerEngineeringCourseRequirementsURLs.length; i++) {
        // const url = computerEngineeringCourseRequirementsURLs[0];
        // if (url) {
        //     const {page, browser} = await scrapeSite(url, false);
        //     const json = await courseRequirementsToJson(page, browser);
        //     // console.log(json);
        // }
    // }

    consolidateFourYearPlans();

    // let res = await pdfToTxt('https://ece.gatech.edu/sites/default/files/documents/graduate/current_grad_handbook.pdf');
    // // save res as a txt file
    // fs.writeFile(`data/grad/graduate-handbook.txt`, res, function(err) {
    //     if (err) {
    //         console.log(err);
    //     }
    // });


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