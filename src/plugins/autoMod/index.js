const Discord = require('discord.js');
const { debug, timeStamp } = require('console');
const { InputCommand } = require('../../services/command');

class AutoMod {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = [];
        this.interval = null;
    }
    init() {
        this.autoMod();
    }
    autoMod = async () => {
        this.bot.on('message', (message) => {
            // Only check messages which are not diet bot
            if (!this.isDietBot(message)) {
                // 1. Delete messages in invalid channels to reduce spam.
                this.handleDeleteMessageIfInvalidChannel(message);
            }
        });
    };

    handleDeleteMessageIfInvalidChannel(message, delay = 5000) {
        setTimeout(
            async function () {
                const input = new InputCommand(message);
                if (
                    !this.isDietBotChannel(message.channel) &&
                    input.validate()
                ) {
                    const messageAuthor = message.author;
                    // Valid command, delete message from user and from diet bot.
                    message.delete();

                    // Fetch the last 30 messages, delete the last 10 from diet bot (if exists).
                    message.channel.messages
                        .fetch({
                            limit: 30,
                        })
                        .then((messages) => {
                            const dietBotId = '279879398323257346';
                            const amountToDelete = 10;
                            messages = messages
                                .filter((m) => m.author.id === dietBotId)
                                .array()
                                .slice(0, amountToDelete);
                            message.channel
                                .bulkDelete(messages)
                                .catch((error) => console.log(error.stack));
                        });

                    messageAuthor.send(
                        `Your message in #${message.channel.name} was removed. Please remember to keep bot related commands in #diet-bot.`
                    );
                }
            }.bind(this),
            delay
        );
    }

    isDietBotChannel(channel) {
        const dietBotChannelId = '462447510456107029';
        return channel.id == dietBotChannelId;
    }

    isDietBot(message) {
        const dietBotId = '279879398323257346';
        return message.author.id === dietBotId;
    }
}

module.exports = AutoMod;
