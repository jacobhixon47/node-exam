const fs = require('fs');
const path = require('path');
const checkForTags = require('./check-for-tags');

let dir = __dirname + '/data/';
let finalCounts = [];
module.exports = {
  // create method so it can be called in either conditional below (DRY)
  createTagCounts: (list) => {
    list.forEach( (tag) => {
      if (tag.length >= 1) {
        finalCounts.push([tag, 0]);
      }
    });
  },
  getTags: (tags) => {
    if (process.argv[2]) {
      tags = process.argv[2].split(',');
      module.exports.createTagCounts(tags);
    } else {
      // if no CLI args, use tags from sample tags.txt file
      fs.readFile(__dirname + '/tags.txt', 'utf8', (err, data) => {
        tags = data.split('\n');
        module.exports.createTagCounts(tags);
      });
    }
  },
  runCheck: (dir) => {
    console.log('\n-------> Starting Check\n');
    fs.readdir(dir, (err, fileList) => {
      var fileCount = 0;
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
              var myjson = JSON.parse(data);
              // check object for tags
              checkForTags(myjson, finalCounts, (returnedCounts) => {
                finalCounts = returnedCounts;
              });
            } catch (error) {
              // catch invalid json
              return console.error("\n" + error + "\n\n//////// Skipping file...\n");
            } finally {
              fileCount++;
              // if all relevant files have been checked
              if (fileCount === list.length) {
                console.log("\n-------> DONE CHECKING FILES!\n");
                // sort tags by count (highest to lowest)
                finalCounts.sort( (a, b) => {
                  return b[1] - a[1];
                });
                // print each tag and its count to the console
                finalCounts.forEach( (count) => {
                  console.log(count[0] + ": " + count[1]);
                });
              }
            }
          }
        });
      });
    });
  }
}
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'application/json'});
//   var search = JSON.parse({
//     "tags": tags,
//     "counts": finalCounts
//   })
//   res.write(search);
// }).listen('8000');
