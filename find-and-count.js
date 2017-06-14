const fs = require('fs');
const path = require('path');

var dir = __dirname + "/data";
var tagCounts = {};

var checkForTags = (object, key) => {
  // if json object has property key "tags"
  if (object[key]) {
    console.log("//// TAGS FOUND ////\n-------> LOADING TAGS....");
    object[key].forEach( (tag) => {
      console.log("TAG: " + tag);
      console.log("PART OF SEARCH? " + Object.keys(tagCounts).includes(tag));
      if (Object.keys(tagCounts).includes(tag)) {
        tagCounts[tag] += 1;
        for (var tg in tagCounts) {
          console.log(tg + ": " + tagCounts[tg]);
        }
      }
    });
  }
  for (var prop in object) {
    if (prop !== key && typeof object[prop] === 'object') {
      console.log("----------> CHECKING " + prop + " FOR TAGS...")
      checkForTags(object[prop], key);
    }
  }
};

module.exports = (userTags, callback) => {
  userTags.forEach( (tag) => {
    tagCounts[tag] = 0;
  });
  fs.readdir(dir, (err, fileList) => {
    if (err) return console.error(err);
    let list = fileList.filter( (file) => {
      return path.extname(file) === ".json";
    });
    list.forEach( (file) => {
      fs.readFile(__dirname + '/data/' + file, (err, data) => {
        if (err) {
          return console.error(err);
        } else {
          // parse json and catch errors if invalid
          try {
            var myjson = JSON.parse(data);
            checkForTags(myjson, "tags");
          } catch (error) {
            return console.error(error);
          }
        }
      });
    });
    callback(null, tagCounts);
  });
}
