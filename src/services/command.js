const path = require('path');

class CommandQueue {
    constructor(bot, options) {
        this.bot = bot;
        this.buffer = [];
        this.commands = new Map();
        this.plugins = new Map();
        this.pluginNames = options?.pluginNames ?? [];
        this.pluginDirPath = options?.pluginDirPath ?? './src/plugins';
        this.active = false;
        this.init();
    }
    init() {
        this.loadPlugins();
    }
    add(inputCommand) {
        if (inputCommand.isValid) {
            this.buffer.push(inputCommand);
            this.attemptToRunCommand();
        }
    }
    loadPlugins() {
        // cancel out if no plugins
        if (!this.pluginNames?.length) return;

        this.pluginNames.forEach((name) => {
            // require the path
            const Plugin = require(path.join(
                process.cwd(),
                this.pluginDirPath,
                name,
                'index.js'
            ));

            // get a new instance of the plugin
            const instance = new Plugin(this.bot, this);

            // if the instance has an init function, run it
            if (typeof instance.init == 'function') {
                instance.init();
            }

            // insert the instance into the plugin map
            this.plugins.set(name, instance);

            // register the commands
            instance.commands.forEach((command) =>
                this.commands.set(command, name)
            );
        });
    }
    attemptToRunCommand() {
        if (this.buffer.length < 1) {
            console.info('Command Queue is empty..');
            return;
        }
        if (!this.active) {
            const cmd = this.buffer.shift();
            const pluginName = this.commands.get(cmd.command);
            const plugin = this.plugins.get(pluginName);
            if (cmd && pluginName && plugin) {
                plugin.run(cmd.message, cmd.params);
                this.active = false;
            }
        } else {
            console.log('\n[Command Queue]\nCommand Added');
            console.log(`${this.buffer.length} commands in queue`);
            this.checkBack();
        }
    }
    checkBack(delay = 1000) {
        setTimeout(
            () => (this.active ? this.checkBack() : this.attemptToRunCommand()),
            delay
        );
    }
}

class InputCommand {
    constructor(msg) {
        this.message = msg;
        this.tokens = msg.content.split(' ');
        this.command = this.tokens[0].split('').slice(1).join('');
        this.params = this.tokens.slice(1);
        this.isValid = this.validate();
    }
    validate() {
        const regex = RegExp('![a-zA-Z]+');
        const startsWithExclaim = this.message.content.slice(0, 1) === '!';
        return startsWithExclaim && regex.test(this.message);
    }
}

module.exports = { InputCommand, CommandQueue };
