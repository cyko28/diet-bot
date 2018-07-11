const fs = require('fs-extra');
const path = require('path');
const util = require('../../services/util').getInstance();
const stringSimilarity = require('string-similarity');

class Trump {
    constructor() {
        this.commands = ['t', 'trump'];
        this.audioFiles = [];
    }
    init() {
        this.findAudioFiles()
            .then(files => {
                this.audioFiles = files;
            })
            .then(() => {
                this.findBestMatch(['we', 'eat', 'mcdonalds']);
            });
    }
    run(message, params = []) {
        // Voice only works in guilds, if the message does not come from a guild,
        // we ignore it
        if (!message.guild) return;

        // if its looking for help, paste in command list
        if (params.includes('help') || params.includes('list')) {
            return message.reply(this.getCommandList(), {
                code: true,
                split: true
            });
        }

        if (message.member.voiceChannel) {
            // Only try to join the sender's voice channel if they are in one themselves
            message.member.voiceChannel
                .join()
                .then(connection => {
                    // TODO: Add Random
                    const intent = connection.playFile(
                        this.determineAudio(params, 0.5, message)
                    );
                    intent.on('end', () => connection.disconnect());
                })
                .catch(console.error);
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
        const arr = this.audioFiles.map(string =>
            string
                .split('.mp3')[0]
                .split('_')
                .join(' ')
        );

        // we find the best match in the array of choices
        const bestMatch = stringSimilarity.findBestMatch(query, arr).bestMatch;

        // we build a results object to return
        const results = {
            file: this.audioFiles[arr.indexOf(bestMatch.target)],
            rating: bestMatch.rating
        };
        return results;
    }
    determineAudio(params, threshold, message) {
        const bestMatch = this.findBestMatch(params);

        if (bestMatch.rating > threshold && params.length > 0) {
            console.log(
                `Best Match: ${
                    bestMatch.file
                }, Rating: ${bestMatch.rating.toFixed(4)}`
            );
            util.react(message, 'success');
            return this.playAudio(bestMatch.file);
        }
        // return this.playRandomAudio();
        return util.react(message, 'fail');
    }
    playRandomAudio() {
        const random = util.randomInt(this.audioFiles.length);
        console.log(`Playing File: "${this.audioFiles[random]}"`);
        return path.join(__dirname, 'audio', this.audioFiles[random]);
    }
    playAudio(fileName) {
        return path.join(__dirname, 'audio', fileName);
    }
    getCommandList(message) {
        // we clean the input
        const arr = this.audioFiles.map(string =>
            string
                .split('.mp3')[0]
                .split('_')
                .join(' ')
        );
        return arr;
    }
}

module.exports = Trump;
