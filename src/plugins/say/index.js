const fs = require('fs-extra');
const path = require('path');

const TTS = require('../../services/util-tts');
const tts = new TTS();

class Say {
    constructor() {
        this.commands = ['s', 'say'];
        this.audioFiles = new Map();
    }
    run(message, params = []) {
        // Voice only works in guilds, if the message does not come from a guild,
        // we ignore it
        if (!message.guild) return;

        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voiceChannel) {
            message.member.voiceChannel
                .join()
                .then(connection => {
                    tts.run(params, connection, 'say');
                })
                .catch(console.error);
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
    findAudioFiles() {
        return fs.readdir(path.join(__dirname, 'audio'));
    }
}

module.exports = Say;
