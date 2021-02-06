const path = require('path');
const storage = require('node-persist');

class CommandQueue {
    constructor(bot, options) {
        this.bot = bot;
        this.buffer = [];
        this.commands = new Map();
        this.plugins = new Map();
        this.pluginNames = options?.pluginNames ?? [];
        this.pluginDirPath = options?.pluginDirPath ?? './src/plugins';
        this.active = false;
        storage.init({
            dir: 'src/.storage',
            stringify: JSON.stringify,
            parse: JSON.parse,
            encoding: 'utf8',
            logging: false,
            expiredInterval: 3000,
            forgiveParseErrors: true,
        });
    }

    init() {
        this.loadPlugins();
    }

    getBotStorage() {
        return storage;
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
            //Todo: add warning for commands which are overwritten (similar command names in different plugins)
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
                plugin.run(cmd.message, cmd.params, cmd.command);
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
    // takes msg object as input
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
        return startsWithExclaim && regex.test(this.message.content);
    }
}

module.exports = { InputCommand, CommandQueue };
