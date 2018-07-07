require('dotenv').config();

const Discord = require('discord.js');
const bot = new Discord.Client();

const Command = require('./services/command.js');
const command = new Command(bot);

const CommandParser = require('./services/command-parser');
const commandParser = new CommandParser(command);

bot.login(process.env.API_KEY);

bot.on('ready', () => init());

bot.on('message', message => command.handle(message));

bot.on('voiceStateUpdate', (before, after) => {
    if (before.displayName === 'diet-bot') {
        if (before.voiceChannel === undefined) {
            command.queue.active = true;
        } else {
            setTimeout(() => {
                command.queue.active = false;
            }, 500);
        }
    }
});

const init = () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    // TODO: make add plugins take an array
    command.runner.addPlugins('airhorn');
    command.runner.addPlugins('rave');
    command.runner.addPlugins('buttlord');
    command.runner.addPlugins('trump');
    command.runner.addPlugins('say');
};
