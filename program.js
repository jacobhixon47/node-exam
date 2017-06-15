const checks = require('./checks');

let dir = __dirname + '/data/';
let tags = [];

checks.getTags(tags);
checks.runCheck(dir);
