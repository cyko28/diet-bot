# To do List

## Next (for 1.0)
- Instant kick for !k & !kick commands, no queue
- long say commands are killing the bot...
  - ```
  events.js:182
        throw er; // Unhandled 'error' event
        ^
        Error: ENOENT: no such file or directory, open 'C:\Users\Scott\GitHub\diet-bot\audio\1499664061026.mp3'
  ```
  
## Soon
- bot.leave & bot.join should be custom functions with cQ.ready true/false built in
- make rave, and trump work like !i where it can search for a string match
- search for substring in string for completion
- pass CQ object instead of children

## Someday
- solve the awodjon problem
