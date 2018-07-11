class Util {
    constructor(bot) {
        this.bot = bot;
    }
    bootBanner() {
        return `
                                                                 
██████╗ ██╗███████╗████████╗   ██████╗  ██████╗ ████████╗
██╔══██╗██║██╔════╝╚══██╔══╝   ██╔══██╗██╔═══██╗╚══██╔══╝
██║  ██║██║█████╗     ██║█████╗██████╔╝██║   ██║   ██║
██║  ██║██║██╔══╝     ██║╚════╝██╔══██╗██║   ██║   ██║
██████╔╝██║███████╗   ██║      ██████╔╝╚██████╔╝   ██║
╚═════╝ ╚═╝╚══════╝   ╚═╝      ╚═════╝  ╚═════╝    ╚═╝

        ██╗███████╗
        ██║██╔════╝
        ██║███████╗
   ██   ██║╚════██║
██╗╚█████╔╝███████║
╚═╝ ╚════╝ ╚══════╝


        `;
    }

    randomInt(n) {
        return Math.floor(Math.random() * n);
    }
    getUserList(targetRole = null) {
        // get the whole diet clan object
        const dietClan = this.bot.guilds.values().next().value;

        // determine if we need to get all users or just one role
        if (targetRole) {
            // get a list of all the roles
            const roleList = Array.from(dietClan.roles).map(
                role => role[1].name
            );
            // Check to see if the role requested exists
            if (roleList.indexOf(targetRole) > 0) {
                let userList = null;
                dietClan.roles.forEach(
                    role =>
                        role.name === targetRole
                            ? (userList = role.members)
                            : (userList = userList)
                );
                if (userList) {
                    return userList;
                } else {
                    console.log(`Requested Role "${targetRole}" not found...`);
                }
            } else {
                console.log(`Requested Role "${targetRole}" not found...`);
            }
            // get the role only
        } else {
            // Get everyone
            return dietClan.members;
        }
    }
    randomUserDisplayName(targetRole = null) {
        const users = [...this.getUserList(targetRole).values()];
        return users[this.randomInt(users.length)].displayName;
    }
    react(message, emojiString) {
        const target = message.guild.emojis.find('name', emojiString);
        message.react(target);
    }
}

module.exports = {
    getInstance: bot => new Util(bot)
};
