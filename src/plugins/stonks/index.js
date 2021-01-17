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
        const url = 'https://diet-stonks.herokuapp.com/api/v1/wsa';
        fetch(url, { timeout: 20000 })
            .then((res) => {
                this.status = res.status;
                return res.json();
            })
            .then(this.generateTable)
            .then(this.publishTable)
            .catch((error) => {
                const channel = this.getDietBotChannel();
                const msg = `\`\`\`\n${error.message}\n\`\`\``;
                channel.send(msg);
            });
    }
    generateTable = (data) => {
        this.data = data;
        const time = new Date(data.raw.unixTimestamp);
        const cosmeticTime = `${time.toLocaleTimeString('en-US')}`;
        const header = ['POS', 'TIK', 'OCR', 'SNT', 'IDX', 'CUR', 'CNG'];
        const rows = this.data.data.map((stonk, index) => {
            return [
                `${index + 1}`,
                stonk.symbol,
                stonk.occurances,
                stonk.sentiment,
                stonk.index,
                `$${stonk.price.current.toFixed(2)}`,
                `${stonk.price.changePercentage.toFixed(2)}%`,
            ];
        });
        this.table = new AsciiTable(`Diet Stonks @ ${cosmeticTime}`);
        this.table.setHeading(...header);
        this.table.addRowMatrix(rows);
        this.table.setAlign(6, AsciiTable.RIGHT);
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
