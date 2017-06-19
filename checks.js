const fs = require('fs');
const path = require('path');
const util = require('util');
const lookForTags = require('./look-for-tags');

let dir = __dirname + '/data/';
let finalCounts = [];

module.exports = {
  // create method so it can be called in either conditional in getTags() method (DRY)
  createTagCounts: (list) => {
    finalCounts = [];
    list.forEach( (tag) => {
      if (tag.length >= 1) {
        finalCounts.push([tag, 0]);
      }
    });
  },
  getTags: (list) => {
    // if CLI argument(s) provided
    if (list.length <= 2) {
      console.log("-------> Using default list...");
      fs.readFile(__dirname + '/tags.txt', 'utf8', (err, data) => {
        let tags = data.split('\n');
        module.exports.createTagCounts(tags);
        module.exports.runCheck(dir);
      });
    } else {
      console.log('-------> Recieved Search Tags...');
      let tags = list.replace(/\s/g, '').split(',');
      module.exports.createTagCounts(tags);
      module.exports.runCheck(dir);
      // if no CLI arguments, use tags from sample tags.txt file
    }
  },
  runCheck: (dir) => {
    let fileCount = 0;
    console.log('\n-------> Starting Check\n');
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
          console.log('-------> CHECKING /data/' + file);
          if (err) {
            return console.error(err);
          } else {
            // parse json and catch errors if invalid
            try {
              let myjson = JSON.parse(data);
              // check object for tags
              lookForTags(myjson, finalCounts, (returnedCounts) => {
                finalCounts = returnedCounts;
              });
            } catch (error) {
              // catch invalid json
              return console.error("\n" + error + "\n\n//////// Skipping file...\n");
            } finally {
              fileCount++;
              // if all relevant files have been checked
              if (fileCount === list.length) {
                console.log("-------> DONE CHECKING FILES!\n");
                // sort tags by count (highest to lowest)
                finalCounts.sort( (a, b) => {
                  return b[1] - a[1];
                });
                // print each tag and its count to the console
                finalCounts.forEach( (count) => {
                  console.log(count[0] + ": " + count[1]);
                });
                console.log("\n\n##### - TAG SEARCH - #####");
                console.log("\n--> To review instructions, type 'help' and press [Enter]\n");
              }
            }
          }
        });
      });
    });
  }
}
