const fs = require('fs-extra');
const path = require('path');
const Discord = require('discord.js');

class Rave {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = ['r', 'rave'];
        this.audioFilePaths = [];
    }
    init() {
        this.findAudioFiles().then((files) => {
            this.audioFilePaths = files;
        });
    }
    async run(message, params = []) {
        // Voice only works in guilds, if the message does not come from a guild,
        // we ignore it
        if (!message.guild) return;

        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            this.sendDanceEmbed();
            const dispatcher = connection.play(this.playAudio());
            dispatcher.on('finish', () => {
                connection.disconnect();
            });
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
    findAudioFiles() {
        return fs.readdir(path.join(__dirname, 'audio'));
    }
    playAudio() {
        const random = Math.floor(Math.random() * this.audioFilePaths.length);
        return path.join(__dirname, 'audio', this.audioFilePaths[random]);
    }
    sendDanceEmbed() {
        const showDance = Math.random() < 0.09 ? true : false;

        if (showDance) {
            const channel = this.getDietBotChannel();
            let danceEmbed = new Discord.MessageEmbed().attachFiles(
                'https://thumbs.gfycat.com/CourteousRemarkableArrowcrab-max-1mb.gif'
            );
            channel.send(danceEmbed);

            // Delete the message after 5 seconds
            setTimeout(
                async function () {
                    channel.messages
                        .fetch({
                            limit: 10,
                        })
                        .then((messages) => {
                            const dietBotId = '279879398323257346';
                            const amountToDelete = 1;
                            messages = messages
                                .filter((m) => m.author.id === dietBotId)
                                .array()
                                .slice(0, amountToDelete);
                            channel
                                .bulkDelete(messages)
                                .catch((error) => console.log(error.stack));
                        });
                }.bind(this),
                7000
            );
        }
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

module.exports = Rave;
