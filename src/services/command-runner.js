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
        // require the path
        const Plugin = require(path.join(
            process.cwd(),
            this.pluginDirPath,
            name,
            'index.js'
        ));

        // get a new instance of the plugin
        const instance = new Plugin();

        // if the instance has an init function, run it
        if (typeof instance.init == 'function') {
            instance.init();
        }

        // insert the instance into the plugin map
        this.plugins.set(name, instance);

        // register the commands
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
