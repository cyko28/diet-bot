class CommandQueue {
    constructor() {
        this.queue = [];
        this.active = false;
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
    checkBack(delay = 1000) {
        setTimeout(() => (this.active ? checkBack() : fetch()), delay);
    }
}
