const fs = require('fs');
const path = require('path');
const lookForTags = require('./look-for-tags');

let dir = __dirname + '/data/';
let prevCounts = [];
let currentCounts = [];
let finalCounts = [];

let checkSearches = (tags) => {
  let matched = [];
  console.log("\n-------> Checking previous searches...");
  // loop through tags
  tags.forEach((tag) => {
    if (tag.length > 0) {
      // for each tag, loop through all prev search results
      prevCounts.forEach((count) => {
        // if the current count name matches the current tag...
        if (count[0] === tag) {
          // add current count to finalCounts
          console.log("\n-------> ## Found previous results for " + tag);
          finalCounts.push(count);
          // push tag to matched array
          matched.push(tag);
        }
      });
      // after searching is done, if this tag is not in matched array
      if (!matched.includes(tag)) {
        // create count in currentCounts for this tag
        currentCounts.push([tag, 0]);
      }
    }
  });
};
let getTags = (input) => {
  finalCounts = [];
  currentCounts = [];
  if (input.length <= 2) {
    // if no CLI argument(s) provided, use tags from sample tags.txt file
    console.log("\n-------> Using default list...");
    fs.readFile(__dirname + '/tags.txt', 'utf8', (err, data) => {
      let tags = data.split('\n');
      checkSearches(tags);
      runCheck(dir);
    });
  } else {
    // if CLI argument(s) provided
    console.log('\n-------> Recieved search tags...');
    // use regex to eliminate spaces
    let tags = input.replace(/\s/g, '').split(',');
    checkSearches(tags);
    runCheck(dir);
  }
};

let showResults = (currentCounts) => {
  console.log("\n-------> Printing final counts...");
  currentCounts.forEach((count) => {
    // push to DIY cache
    prevCounts.push(count);
    // push to final count
    finalCounts.push(count);
  });
  // sort tags by count (highest to lowest)
  finalCounts.sort( (a, b) => {
    return b[1] - a[1];
  });
  console.log("\n<><><><><><><>\n");
  // print each tag and its count to the console
  finalCounts.forEach( (count) => {
    console.log(count[0] + ": " + count[1]);
  });
  console.log("\n<><><><><><><>");
  console.log("\n\n##### - TAG SEARCH - #####");
  console.log("\n--> To review instructions, type 'help' and press [Enter]\n");
};

let runCheck = (dir) => {
  let fileCount = 0;
  // if there are inputted tags that did NOT return a match from the cache
  if (currentCounts.length >= 1) {
    console.log('\n-------> Starting data check...');
    // asyncronously read /data/ directory
    fs.readdir(dir, (err, fileList) => {
      if (err) return console.error(err);
      // filter fileList for only files with .json extension
      let list = fileList.filter( (file) => {
        return path.extname(file) === ".json";
      });
      // loop through each .json file
      list.forEach( (file) => {
        // read the file (async)
        fs.readFile(__dirname + '/data/' + file, (err, data) => {
          // after file is read, evaluate data
          console.log('\n-------> CHECKING /data/' + file);
          if (err) {
            return console.error(err);
          } else {
            // parse json and catch errors if invalid
            try {
              let myjson = JSON.parse(data);
              lookForTags(myjson, currentCounts, (returnedCounts) => {
                currentCounts = returnedCounts;
              });
            } catch (error) {
              // catch invalid json
              return console.error("\n" + error + "\n\n-------> ## Skipping file...");
            } finally {
              fileCount++;
              // if all relevant files have been checked
              if (fileCount === list.length) {
                console.log("\n-------> DONE CHECKING FILES!");
                showResults(currentCounts);
              }
            }
          }
        });
      });
    });
  } else {
    showResults(currentCounts);
  }
}

module.exports = {
  getTags: getTags
}
