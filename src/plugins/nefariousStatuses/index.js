class NefariousStatuses {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = [];
        this.interval = null;
    }
    init() {
        this.nefariousStatuses();
        this.interval = setInterval(this.nefariousStatuses, 60 * 1000);
    }
    nefariousStatuses = async () => {
        const randomUser = await this.randomUserDisplayName('Regulars');
        const statuses = this.getStatusArray(randomUser);
        const activity = statuses[this.randomInt(statuses.length - 1)];
        this.bot.user.setActivity(activity);
        console.log('\n[Bot Status]');
        console.log(`Bot Status Set to: "${activity}"`);
    };
    randomInt(n) {
        return Math.floor(Math.random() * n);
    }
    getUserList = async (targetRole = null) => {
        // get the whole diet clan object
        const dietClanID = '169703392749289472';
        const dietClanGuild = this.bot.guilds.cache
            .array()
            .find((el) => el.id === dietClanID);
        const voiceChannels = dietClanGuild;
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
    randomUserDisplayName = async (targetRole = null) => {
        const users = await this.getUserList(targetRole);
        return users[this.randomInt(users.length - 1)];
    };
    getStatusArray(user) {
        return [
            `Stealing ${user}'s CC info`,
            `Logging ${user}'s bank password`,
            `Screensharing ${user}'s screen`,
            `SWATing ${user}`,
            `Sending Pizzas to ${user}`,
            `Cutting ${user}'s Ethernet Connection`,
            `Submitting ${user}'s Application to ISIS`,
            `Firing Low Orbiting Ion Cannon at ${user}`,
            `Sicking Twitter Hate Mobs on ${user}`,
            `DDoSing ${user}`,
            `Impersonating ${user}`,
            `Swiping Left on ${user}`,
            `Swiping Right on ${user}`,
            `Catfishing ${user}`,
            `Finding ${user}'s porn`,
            `Drone Striking ${user}`,
            `Watching ${user} masturbate`,
            `Going to Flavortown`,
            `Hanging With Satan`,
            `Restarting Simulation`,
            `Bagging Milk with Catcher`,
            `Wire Tapping USER`,
            `Selling ${user}'s Personal Data for Profit`,
            `Getting Comfy with the Russians`,
            `Deleting ${user}'s System 32 Files`,
            `BSoDing ${user}`,
            `Triggering ${user}`,
            `Making a Wawa Run`,
            `Hogtying ${user}`,
            `Spamming @${user}`,
            `Kidnapping ${user}`,
        ];
    }
}

module.exports = NefariousStatuses;
