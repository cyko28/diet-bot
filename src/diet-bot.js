require('dotenv').config();

const Discord = require('discord.js');
const bot = new Discord.Client();

let util = require('./services/util.js').getInstance(bot);

const command = require('./services/command.js').getInstance(bot);

bot.login(process.env.API_KEY);

bot.on('ready', bot => init(bot));

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
    nefariousStatuses();
    setInterval(nefariousStatuses, 60 * 1000);
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

const nefariousStatuses = () => {
    const randomUser = util.randomUserDisplayName('Regulars');
    const statuses = [
        `Stealing ${randomUser}'s CC info`,
        `Logging ${randomUser}'s bank password`,
        `Screensharing ${randomUser}'s screen`,
        `SWATing ${randomUser}`,
        `Sending Pizzas to ${randomUser}`,
        `Cutting ${randomUser}'s Ethernet Connection`,
        `Submitting ${randomUser}'s Application to ISIS`,
        `Firing Low Orbiting Ion Cannon at ${randomUser}`,
        `Sicking Twitter Hate Mobs on ${randomUser}`,
        `DDoSing ${randomUser}`,
        `Impersonating ${randomUser}`,
        `Swiping Left on ${randomUser}`,
        `Swiping Right on ${randomUser}`,
        `Catfishing ${randomUser}`,
        `Finding ${randomUser}'s porn`,
        `Drone Striking ${randomUser}`,
        `Watching ${randomUser} masturbate`,
        `Going to Flavortown`,
        `Hanging With Satan`,
        `Restarting Simulation`,
        `Bagging Milk with Catcher`
    ];
    const game = statuses[util.randomInt(statuses.length - 1)];
    bot.user.setGame(game);
    console.log(`Bot Status Set to: "${game}"`);
};
