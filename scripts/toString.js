// import a file with fs
import fs from 'fs';

// import a file with path
let file = fs.readFile('consolidated-data/all-four-year-plans.json', 'utf8', (err, data) => {
    if (err) throw err;
    // stringify the data
    let stringifiedData = JSON.stringify(data);
    // save the data to a txt file
    fs.writeFile('consolidated-data/all-four-year-plans.txt', stringifiedData, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });

});

