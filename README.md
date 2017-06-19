Remarks
----

This is what I have come up with, based on the guidelines provided for the project. I hope you all find it interesting!

I was not sure what was desired as far as caching goes, so I sort of devised my own method of keeping track of previous counts for tag searches. The storage of previous results only persists while the 'program' is active; it resets when the program does - i.e. `CTRL + C` or by typing `quit`.

I am still building upon my Node skills, and honestly this exam definitely challenged (and strengthened) those skills, as well as my abilities to adapt to guidelines and problem solve. I really enjoyed working on it, and I hope that you all will offer me feedback on what you think about the direction I went with it.

I tried to include lots of comments explaining important/complicated parts of my code. I look forward to hearing what you think!


Instructions
----
- In the terminal, navigate into the root directory of the project, then simply run:
```
$ npm start
```
- Follow the instructions in the terminal to enter your list of tags
  - Type 'help' to review instructions when needed

Overview
----
When you enter a list of tags (or just one if you're feeling specific), the high-level overview of what happens is as follows:

1. The program checks to see if 'help' or 'quit' was typed; If not, it sends the entered text to the `getTags()` function in `checks.js`
  - `checks.js` is where almost all of the main functionality happens

2. `getTags()` checks to see whether the inputted text was blank (whether the user entered a list, or just hit `Enter`)
  - If the user did not enter a tag or a list of tags, it asynchronously reads the sample `tags.txt` file and extracts search terms from there
  - If the user did enter a tag or a list, it separates the tags and then sends them to the `checkSearches()` function

3. `checkSearches()` does just what it says: It checks each inputted tag against my DIY "cache" of previous tag counts that were searched for during this session.
  - The function then separates the tags that return matches, and adds their cached count to the final count for this search
  -  Any tags that do not return matches from the cache are separated from the rest, then passed into their own temporary array of counts, which is then passed to the `runCheck()` function

4. The `runCheck()` method takes the unmatched tags and searches through the all `.json` files in the `/data/` directory, counting the instances for each tag
  - `NOTE`: If every tag matches to a previously cached result, `runCheck()` will immediately print out the counts and then prompt the user to search again, skipping the entire file-searching process altogether
  - If the JSON file is invalid/returns an error when being parsed, the program prints the error in the terminal and skips the file
  
5. After the tags have all been counted and all file-searching has finished, the program prints out the count for each searched tag, and then prompts the user to search again, and awaits input
  - Return to step 1. Rinse and repeat.
