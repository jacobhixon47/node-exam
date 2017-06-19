const checks = require('./checks');

let dir = __dirname + '/data/';

process.stdin.resume();
process.stdin.setEncoding('utf8');

console.log("\n--> Please type or paste a tag or list of tags to search for, separated by commas. Then press [Enter]");
console.log("--> To exit, type 'quit' and press [Enter]");
process.stdin.on('data', function (text) {
  if (text === 'quit\n') {
    console.log("Exiting...");
    process.exit();
  }
  else {
    checks.getTags(text);
  }
});
