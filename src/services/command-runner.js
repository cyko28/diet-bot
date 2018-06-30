const path = require('path');
const chalk = require('chalk');

class CommandRunner {
    constructor() {
        this.commands = new Map();
        this.plugins = new Map();
        this.pluginDirPath = './src/plugins';
    }

    addCommands(commandArray, pluginName) {
        commandArray.forEach(command => {
            this.commands.set(command, pluginName);
        });
    }

    addPlugins(name) {
        console.log();
        const Plugin = require(path.join(
            process.cwd(),
            this.pluginDirPath,
            name,
            'index.js'
        ));
        const instance = new Plugin();
        this.plugins.set(name, instance);
        this.addCommands(instance.commands, name);
    }
    run(message, command, params) {
        const plugin = this.commands.get(command);
        console.log(chalk.blue('[' + plugin + ']'));
        console.log('Params: ' + params);
        this.plugins.get(plugin).run(message, params);
    }
}

module.exports = CommandRunner;
