const fetch = require('node-fetch');
const Sentiment = require('sentiment');
const Discord = require('discord.js');
const cron = require('node-cron');

class TrendingStonks {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = [];
        this.data = null;
        this.ready = false;
        this.status = null;
    }
    init() {
        cron.schedule('0 0 9,12,16 * * *', () => {
            this.hitAPI();
        });
    }

    run() {}

    hitAPI() {
        const stonksChannel = this.getStonksChannel();

        let messageLimitDate = new Date();
        messageLimitDate.setHours(0, 0, 0, 0); // Set limit to midnight of the current date.

        // Fetch last 100 messages (max allowed with fetch), and only consider those for the curret day.
        stonksChannel.messages
            .fetch({
                limit: 100,
            })
            .then((messages) => {
                const dietBotId = '279879398323257346';
                messages = messages
                    .filter(
                        (m) =>
                            m.author.id === dietBotId ||
                            m.createdAt > messageLimitDate
                    )
                    .array();
                let tickers = Array.from(this.getPotentialTickers(messages));
                if (tickers !== null && tickers.length > 0) {
                    const url =
                        'http://wall-street-analyzer.herokuapp.com/api/v1/dietbot/quote?symbol=' +
                        tickers.join(',');
                    fetch(url, { timeout: 20000 })
                        .then((res) => {
                            this.status = res.status;
                            return res.json();
                        })
                        .then(this.publishToChannel)
                        .catch((error) => {
                            console.log(error);
                        });
                }
            });
    }
    publishToChannel = (data) => {
        if (data !== undefined && data.length > 0) {
            const outputChannel = this.getStonksChannel();

            const channelEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .addFields(...data);
            outputChannel.send(channelEmbed);
        }
    };

    getPotentialTickers(messages) {
        var lazySymbolRegex = /\b([A-Z]{2,5})+\b/g;
        let potentialTickets = new Set();

        messages.forEach(function (message, index) {
            let match;
            while ((match = lazySymbolRegex.exec(message.content))) {
                potentialTickets.add(match[0]);
            }
        });
        return potentialTickets;
    }

    getStonksChannel() {
        const dietClanID = '169703392749289472';
        const dietClanGuild = this.bot.guilds.cache
            .array()
            .find((el) => el.id === dietClanID);
        const dietBotChannelID = '796814431815598160';
        return dietClanGuild.channels.cache.get(dietBotChannelID);
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

module.exports = TrendingStonks;
