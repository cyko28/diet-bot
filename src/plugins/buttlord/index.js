const fs = require('fs-extra');
const path = require('path');

class Buttlord {
    constructor() {
        this.commands = ['b', 'buttlord'];
        this.soundFiles = [];
    }
    init() {
        this.findAudioFiles();
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
                    const intent = connection.playStream(this.playAudio());
                    intent.on('end', () => connection.disconnect());
                })
                .catch(console.error);
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
    findAudioFiles() {
        fs.readdir(path.join(__dirname, 'audio'), (err, files) => {
            this.soundFiles = files;
        });
    }
    playAudio() {
        const randomFile = this.soundFiles[
            this.randomInt(this.soundFiles.length)
        ];
        return fs.createReadStream(path.join(__dirname, 'audio', randomFile));
    }
    randomInt(n) {
        return Math.floor(Math.random() * n);
    }
}

module.exports = Buttlord;
