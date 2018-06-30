const fs = require('fs-extra');
const path = require('path');

class Buttlord {
    constructor() {
        this.commands = ['b', 'buttlord'];
        this.audioFiles = new Map();
    }
    init() {
        this.findAudioFiles().then(files => {
            this.audioFiles = files;
        });
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
                    const intent = connection.playFile(this.playAudio());
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
    playAudio() {
        const random = this.randomInt(this.audioFiles.length);
        return path.join(__dirname, 'audio', this.audioFiles[random]);
    }
    randomInt(n) {
        return Math.floor(Math.random() * n);
    }
}

module.exports = Buttlord;
