const cron = require('node-cron');
const { InputCommand } = require('../../services/command');

class CronSounds {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = ['dietchime'];
        this.nextCheck = 0;
        this.data = null;
        this.ready = false;
        this.status = null;
        this.interval = null;
        this.intervalDelay = 1000 * 60 * 5;
        this.testIntervalDelay = 1000 * 3;
        this.hitApiInterval = 1000 * 60 * 60;
        this.testHitApiInterval = 1000 * 5;
        this.table = '';
    }
    init() {
        cron.schedule('0 0 20 * * 1', () => {
            this.run();
        });
        cron.schedule('0 0 21 * * 6', () => {
            this.run();
        });
    }

    run() {
        this.runCommand(
            this.getSomeoneInRocketLeaugeChannel(),
            '!a diet league horn'
        );
        console.log(`\n[CRON Sounds]\nCRON Sounds: Playing a sound.`);
    }

    runCommand(member, commandString) {
        if (member) {
            const fakeMessage = {
                content: commandString,
                author: { id: member.id },
                guild: true,
                member: member,
            };
            const cmd = new InputCommand(fakeMessage);
            if (cmd.isValid) {
                this.commandQueue.add(cmd);
            }
        }
    }

    getSomeoneInRocketLeaugeChannel() {
        const dietClanID = '169703392749289472';
        const rocketLeagueChannelID = '546768661944336394';
        const dietClanGuild = this.bot.guilds.cache
            .array()
            .find((el) => el.id === dietClanID);
        const rlUser = dietClanGuild.members.cache
            .array()
            .find((el) => el.voice.channelID === rocketLeagueChannelID);
        return rlUser ? rlUser : dietClanGuild.members.cache.array()[0];
    }
}

module.exports = CronSounds;
