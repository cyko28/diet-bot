require('dotenv').config();

const Discord = require('discord.js');
const bot = new Discord.Client();

const command = require('./services/command.js').getInstance(bot);

bot.login(process.env.API_KEY);

bot.on('ready', () => init());

bot.on('message', message => command.handle(message));

bot.on('voiceStateUpdate', (before, after) =>
    handleVoiceStateUpdate(before, after)
);

const init = () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    // TODO: make add plugins take an array
    command.runner.addPlugins('airhorn');
    command.runner.addPlugins('rave');
    command.runner.addPlugins('buttlord');
    command.runner.addPlugins('trump');
    command.runner.addPlugins('say');
};

const handleVoiceStateUpdate = (before, after) => {
    if (before.displayName === 'diet-bot') {
        if (before.voiceChannel === undefined) {
            command.queue.active = true;
        } else {
            setTimeout(() => {
                command.queue.active = false;
            }, 500);
        }
    }
};
