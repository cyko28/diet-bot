const fs = require('fs-extra');
const path = require('path');

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
}

module.exports = Rave;
