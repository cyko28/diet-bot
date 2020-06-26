require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

const { InputCommand, CommandQueue } = require('./services/command.js');

const pluginNames = ['airhorn', 'buttlord', 'rave', 'trump'];
const commandQueue = new CommandQueue(bot, { pluginNames });

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    nefariousStatuses();
    setInterval(nefariousStatuses, 60 * 1000);
});

bot.on('message', (msg) => {
    const input = new InputCommand(msg);
    commandQueue.add(input);
});

bot.on('voiceStateUpdate', (before, after) =>
    handleVoiceStateUpdate(before, after)
);

const handleVoiceStateUpdate = (before, after) => {
    if (before.member.displayName === 'diet-bot') {
        if (!before.channelID) {
            commandQueue.active = true;
        } else {
            setTimeout(() => {
                commandQueue.active = false;
            }, 100);
        }
    }
};

bot.login(process.env.TOKEN);

const nefariousStatuses = async () => {
    const randomUser = await randomUserDisplayName('Regulars');
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
        `Kidnapping ${randomUser}`,
    ];
    const activity = statuses[randomInt(statuses.length - 1)];
    bot.user.setActivity(activity);
    console.log('\n[Bot Status]');
    console.log(`Bot Status Set to: "${activity}"`);
};

function randomInt(n) {
    return Math.floor(Math.random() * n);
}
const getUserList = async (targetRole = null) => {
    // get the whole diet clan object
    const dietClanID = '169703392749289472';
    const dietClanGuild = bot.guilds.cache
        .array()
        .find((el) => el.id === dietClanID);
    const dietClanMembers = dietClanGuild.members.cache.array();

    // determine if we need to get all users or just one role
    if (targetRole) {
        // get a list of all the roles
        const dietClanRoles = dietClanGuild.roles.cache.array();
        // Check to see if the role requested exists
        if (dietClanRoles.some((role) => role.name === targetRole)) {
            const userList = dietClanMembers.filter((member) => {
                const roles = member.roles.cache.array();
                return roles.some((role) => role.name === targetRole);
            });
            if (userList) {
                return userList.map((users) => users.displayName);
            } else {
                console.log(`Requested Role "${targetRole}" not found...`);
            }
        } else {
            console.log(`Requested Role "${targetRole}" not found...`);
        }
        // get the role only
    } else {
        // Get everyone
        return dietClanMembers.map((members) => members.displayName);
    }
};
const randomUserDisplayName = async (targetRole = null) => {
    const users = await getUserList(targetRole);
    return users[randomInt(users.length - 1)];
};
