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
        let nameArray = name;
        if (!Array.isArray(nameArray)) {
            nameArray = [nameArray];
            nameArray.push(name);
        }

        nameArray.forEach(name => {
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
        });
    }
    run(cmd) {
        const plugin = this.commands.get(cmd.instruction);
        console.log('\n' + chalk.blue('[' + plugin + ']'));
        if (cmd.params.length >= 1) {
            console.log('Params: ' + cmd.params);
        }
        if (plugin) {
            this.plugins.get(plugin).run(cmd.message, cmd.params);
        }
    }
    mock(pluginName, cmdMessage, cmdParams) {
        console.log('\n' + chalk.blue('[MOCKING: ' + pluginName + ']'));
        if (cmdParams.length >= 1) {
            console.log('Params: ' + cmdParams);
        }
        if (pluginName) {
            this.plugins.get(pluginName).run(cmdMessage, cmdParams);
        }
    }
}

module.exports = CommandRunner;
