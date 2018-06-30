class CommandParser {
    constructor(runner) {
        this.queue = [];
        this.runner = runner;
    }

    handle(message) {
        if (!this.validate(message)) return;
        const cmd = this.tokenize(message);
        this.runner.run(message, cmd.instruction, cmd.params);
    }
    validate(message) {
        if (message.content.split('')[0] !== '!') return false;
        return true;
    }
    tokenize(message) {
        const tokens = message.content.split(' ');
        const instruction = tokens.shift();
        const cmd = {
            instruction: instruction.substring(1),
            params: []
        };
        if (tokens.length >= 1) {
            cmd.params = tokens;
        }
        return cmd;
    }
}

module.exports = CommandParser;
