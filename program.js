const findAndCount = require('./find-and-count');

let tags = process.argv[2].split(',');

findAndCount(tags, (err, count) => {
  console.log("COUNT: " + count);
});
