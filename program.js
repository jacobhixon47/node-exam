const checks = require('./checks');

let dir = __dirname + '/data/';

let printInstructions = () => {
  console.log("\n--> Type or paste a tag or list of tags to search for, separated by commas (minimum 2 characters) then press [Enter]");
  console.log("--> To use the default list of tags, simply press [Enter] without entering anything else.");
  console.log("--> To exit, type 'quit' and press [Enter]\n");
};

process.stdin.resume();
process.stdin.setEncoding('utf8');

console.log("##### - TAG SEARCH - #####");
printInstructions();
// when user presses enter
process.stdin.on('data', function (text) {
  if (text === 'quit\n') {
    console.log("\n-------> Exiting...\n");
    process.exit();
  } else if (text === 'help\n') {
    printInstructions();
  } else {
    checks.getTags(text);
  }
});
