module.exports = (object, counts, callback) => {
  // set local instance of the tag counts
  var tagCounts = counts;
  // if tags property exists in current scope
  if (object["tags"]) {
    // sort through each tag in "tags" property object
    object["tags"].forEach( (tag) => {
      // for each tag in "tags", look through tagCounts tags, see if any match this tag
      for (var i = 0; i < tagCounts.length; i++) {
        // if this tag matches a tag in the count, add 1 to the count of that tag
        if (tagCounts[i][0] === tag) {
          tagCounts[i][1] += 1;
        }
      }
    });
  }
  for (var prop in object) {
    // check if each property is an object
    if (prop !== "tags" && typeof object[prop] === 'object') {
      // if property is an object, run this same checker method on it (recursive)
      module.exports(object[prop], tagCounts, callback);
    }
  }
  // run callback to push count back up to main program
  callback(tagCounts);
};
