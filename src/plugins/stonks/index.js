const fetch = require('node-fetch');
const Sentiment = require('sentiment');
const AsciiTable = require('ascii-table');
const cron = require('node-cron');

class Stonks {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = [];
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
        cron.schedule('0 0 9,12,16,18 * * *', () => {
            this.hitAPI();
        });
    }
    hitAPI() {
        const url = 'https://wall-street-analyzer.herokuapp.com/api/dietbot';
        fetch(url, { timeout: 60000 })
            .then((res) => {
                this.status = res.status;
                return res.json();
            })
            .then(this.processData)
            .then(this.generateTable.bind(this))
            .then(this.publishTable.bind(this));
    }

    processData = (json) => {
        this.data = json;
        this.ready = true;

        // add key for concatenated comment strings
        this.data.data = this.data.data.map((stonk) => {
            const mergedComments = stonk.comments.reduce((acc, comment) => {
                return `${acc} ${comment.comment}`;
            }, '');
            const sentiment = new Sentiment().analyze(mergedComments).score;
            stonk.mergeComments = mergedComments;
            stonk.sentiment = sentiment;
            return stonk;
        });
    };
    generateTable() {
        this.table = new AsciiTable('Stonks');
        const header = ['pos', 'stonk', 'name', 'score', 'sent.'];
        const rows = this.data.data.map((stonk) => {
            return [
                stonk.position,
                stonk.symbol,
                `${stonk.name.substr(0, 10)}.`,
                stonk.score,
                stonk.sentiment,
            ];
        });
        this.table.setHeading(...header);
        this.table.addRowMatrix(rows);
    }
    publishTable() {
        const channel = this.getDietBotChannel();

        console.log('\n[Stonks Plugin]');
        console.log(`Publishing Table:`);
        console.log(this.table.toString());

        const msg = `\`\`\`\n${this.table.toString()}\n\`\`\``;
        channel.send(msg);
    }

    getDietBotChannel() {
        const dietClanID = '169703392749289472';
        const dietClanGuild = this.bot.guilds.cache
            .array()
            .find((el) => el.id === dietClanID);
        const dietBotChannelID = '462447510456107029';
        return dietClanGuild.channels.cache.get(dietBotChannelID);
    }
}

module.exports = Stonks;
