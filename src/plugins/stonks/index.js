const fetch = require('node-fetch');
const Sentiment = require('sentiment');
const AsciiTable = require('ascii-table');
const cron = require('node-cron');

class Stonks {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = ['stock', 'stocks', 'stonk', 'stonks'];
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

    run() {
        this.hitAPI();
    }

    hitAPI() {
        const url = 'https://diet-stonks.herokuapp.com/api';
        fetch(url, { timeout: 60000 })
            .then((res) => {
                this.status = res.status;
                return res.json();
            })
            .then(this.generateTable)
            .then(this.publishTable);
    }
    generateTable = (data) => {
        this.data = data;
        const header = ['POS', 'TIK', 'OCR', 'SNT', 'IDX'];
        const rows = this.data.data.map((stonk, index) => {
            return [
                `${index + 1}`,
                stonk.symbol,
                stonk.occurances,
                stonk.sentiment,
                stonk.index,
            ];
        });
        this.table = new AsciiTable('Diet Stonks');
        this.table.setHeading(...header);
        this.table.addRowMatrix(rows);
    };

    publishTable = () => {
        console.log('\n[Stonks Plugin]');
        console.log(`Publishing Table:`);
        console.log(this.table.toString());

        const channel = this.getDietBotChannel();
        const msg = `\`\`\`\n${this.table.toString()}\n\`\`\``;
        channel.send(msg);
    };

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
