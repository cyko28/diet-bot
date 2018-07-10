require('dotenv').config();

const util = require('./services/util.js').getInstance();

const Discord = require('discord.js');
const bot = new Discord.Client();

const command = require('./services/command.js').getInstance(bot);

bot.login(process.env.API_KEY);

bot.on('ready', () => init());

bot.on('message', message => command.handle(message));

bot.on('voiceStateUpdate', (before, after) =>
    handleVoiceStateUpdate(before, after)
);

bot.on('channelUpdate', (before, after) => {
    // Anti Rudy Measures
    if (after.name !== '🍆  General' && after.id === '169703393277902848') {
        console.log('General Name Change Detected, Reverting in 5 mintes');
        setTimeout(() => {
            bot.channels.get(after.id).setName('🍆  General');
        }, 5 * 60 * 1000);
    }
});

const init = () => {
    console.log(util.bootBanner());
    console.log(`Logged in as ${bot.user.tag}!`);
    const plugins = ['airhorn', 'rave', 'buttlord', 'trump', 'say'];
    command.runner.addPlugins(plugins);
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
