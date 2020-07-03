const fs = require('fs-extra');
const path = require('path');
const stringSimilarity = require('string-similarity');

class Airhorn {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = ['ja'];
        this.audioFiles = [];
    }
    init() {
        this.findAudioFiles().then((files) => {
            this.audioFiles = files;
        });
    }
    async run(message, params = []) {
        // Voice only works in guilds, if the message does not come from a guild,
        // we ignore it
        if (!message.guild) return;

        // if its looking for help, paste in command list
        if (params.includes('help') || params.includes('list')) {
            return message.reply(this.getCommandList(), {
                code: true,
                split: true,
            });
        }

        if (message.member.voice.channel) {
            const audio = this.determineAudio(params, 0.5, message);

            if (audio) {
                const connection = await message.member.voice.channel.join();

                const dispatcher = connection.play(audio);
                dispatcher.on('finish', () => {
                    connection.disconnect();
                });
            }
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
    findAudioFiles() {
        return fs.readdir(path.join(__dirname, 'audio'));
    }
    findBestMatch(params) {
        // we get a query from the params
        const query = params.join(' ');

        // we clean the input
        const arr = this.audioFiles.map((string) =>
            string
                .split('.mp3')[0]
                .split('-')
                .slice(1)
                .map((str) => str.toLowerCase())
                .join(' ')
        );

        // we find the best match in the array of choices
        const bestMatch = stringSimilarity.findBestMatch(query, arr).bestMatch;

        // we build a results object to return
        const results = {
            file: this.audioFiles[arr.indexOf(bestMatch.target)],
            rating: bestMatch.rating,
        };
        return results;
    }
    determineAudio(params, threshold, message) {
        const bestMatch = this.findBestMatch(params);

        if (bestMatch.rating > threshold && params.length > 0) {
            console.log(
                `\n[Join Audio]\nBest Match: ${
                    bestMatch.file
                }, Rating: ${bestMatch.rating.toFixed(4)}`
            );
            this.react(message, 'success');
            this.react(message, 'airhorn');
            return path.join(__dirname, 'audio', bestMatch.file);
        }
        if (params.length > 0) {
            this.react(message, 'fail');
        }
        this.react(message, 'airhorn');
        return path.join(__dirname, 'audio', 'airhorn.mp3');
    }
    playAudio(fileName) {
        return;
    }
    getCommandList(message) {
        // we clean the input
        const arr = this.audioFiles.map((string) =>
            string.split('.mp3')[0].split('-').slice(1).join(' ')
        );
        return arr;
    }
    react(message, emojiString) {
        if (message?.guild?.emojis) {
            const target = message.guild.emojis.cache.find(
                (emoji) => emoji.name === emojiString
            );
            message.react(target);
        }
    }
}

module.exports = Airhorn;
