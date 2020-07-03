require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

const { InputCommand, CommandQueue } = require('./services/command.js');

const pluginNames = [
    'airhorn',
    'buttlord',
    'rave',
    'trump',
    'nefariousStatuses',
    'say',
    'insult',
    'bully',
    'phraseLeaderboard',
    'shutdown',
    'joinLeaveBinds',
];
const commandQueue = new CommandQueue(bot, { pluginNames });

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    commandQueue.init();
});

bot.on('message', (msg) => {
    const input = new InputCommand(msg);
    commandQueue.add(input);
});

bot.on('voiceStateUpdate', handleVoiceStateUpdate);

function handleVoiceStateUpdate(before) {
    if (before.member.displayName === 'diet-bot') {
        if (!before.channelID) {
            commandQueue.active = true;
        } else {
            setTimeout(() => {
                commandQueue.active = false;
            }, 100);
        }
    }
}

bot.login(process.env.TOKEN);
