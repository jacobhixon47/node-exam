const findAndCount = require('./find-and-count');

let tags = process.argv[2].split(',');
findAndCount(tags);
