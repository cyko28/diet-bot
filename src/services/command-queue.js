class CommandQueue {
    constructor(runner, bot) {
        this.runner = runner;
        this.buffer = [];
        this.active = false;
        this.bot = bot;
    }

    add(message, instruction, params) {
        const cmd = {
            message: message,
            instruction: instruction,
            params: params
        };
        this.buffer.push(cmd);
        this.fetch();
    }

    fetch() {
        // TODO: confirm it is ready to run
        if (this.buffer.length < 1) {
            console.info('Command Queue is empty..');
            return;
        }
        if (!this.active) {
            let cmd = this.buffer.shift();
            this.runner.run(cmd);
        } else {
            console.log('\nCommand Added');
            console.log(`${this.buffer.length} commands in queue`);
            this.checkBack();
        }
    }
    checkBack(delay = 1000) {
        setTimeout(
            () => (this.active ? this.checkBack() : this.fetch()),
            delay
        );
    }
    isBotActive() {}
}

module.exports = CommandQueue;
