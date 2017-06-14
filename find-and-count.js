const fs = require('fs');
const path = require('path');

var dir = __dirname + "/data";

module.exports = (userTags) => {
  // console.log("TAGS: " + userTags);

  fs.readdir(dir, (err, fileList) => {
    let count = 0;
    if (err) return console.error(err);
    let list = fileList.filter( (file) => {
      return path.extname(file) === ".json";
    });
    list.forEach( (file) => {
      fs.readFile(__dirname + '/data/' + file, (err, data) => {
        if (err) return console.error(err);
        // parse json and catch errors if invalid
        try {
          var myjson = JSON.parse(data);
        } catch (error) {
          return console.error(error);
        }
        console.log(myjson);
      });
      // count++;
      // console.log('+1');
    });
  });
}
