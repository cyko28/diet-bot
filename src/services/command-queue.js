class CommandQueue {
    constructor() {
        this.queue = [];
    }

    add(cmd) {
        this.queue.push(cmd);
    }

    fetch() {
        // TODO: confirm it is ready to run
        if (this.queue.length < 1) {
            console.info('Command Queue is empty..');
            return;
        }
        return this.queue.shift();
    }
}
