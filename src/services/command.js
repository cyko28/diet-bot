const Parser = require('./command-parser');
const Queue = require('./command-queue');
const Runner = require('./command-runner');
class Command {
    constructor(bot) {
        this.parser = new Parser();
        this.runner = new Runner();
        this.queue = new Queue(this.runner, bot);
    }
    handle(message) {
        let tokens = this.parser.handle(message);
        if (tokens) {
            this.queue.add(message, tokens.instruction, tokens.params);
        }
    }
}

module.exports = {
    getInstance: function(bot) {
        return new Command(bot);
    }
};
