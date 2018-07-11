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
        console.log(`General Name Change Detected
${before.name} has become ${after.name}
Reverting in 5 minutes`);
        setTimeout(() => {
            const originalName = '🍆  General';
            bot.channels.get(after.id).setName(originalName);
            console.log(`General Name Restored to ${originalName}`);
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
            }, 1000);
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
        `Bagging Milk with Catcher`,
        `Wire Tapping USER`,
        `Selling ${randomUser}'s Personal Data for Profit`,
        `Getting Comfy with the Russians`,
        `Deleting ${randomUser}'s System 32 Files`,
        `BSoDing ${randomUser}`,
        `Triggering ${randomUser}`,
        `Making a Wawa Run`,
        `Hogtying ${randomUser}`,
        `Spamming @${randomUser}`,
        `Kidnapping ${randomUser}`
    ];
    const activity = statuses[util.randomInt(statuses.length - 1)];
    bot.user.setActivity(activity);
    console.log('\n[Bot Status]');
    console.log(`Bot Status Set to: "${activity}"`);
};
