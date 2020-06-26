const fs = require('fs-extra');
const path = require('path');
const say = require('say');

class Say {
    constructor() {
        this.commands = ['s', 'say'];
        this.audioFiles = new Map();
        this.pathToFile = path.join(__dirname, 'audio', 'say.wav');
    }
    async run(message, params = []) {
        this.generateSpeech(params.join(' '));
        // Voice only works in guilds, if the message does not come from a guild,
        // we ignore it
        if (!message.guild) return;

        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();

            const dispatcher = connection.play(this.pathToFile);
            dispatcher.on('finish', () => {
                connection.disconnect();
            });
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
    generateSpeech(phrase) {
        say.export(
            phrase,
            'Microsoft Zira Desktop',
            1,
            this.pathToFile,
            (err) => {
                if (err) {
                    return console.error(err);
                }

                console.log(`\n[Say Plugin]\n"${phrase}" saved to say.mp3`);
            }
        );
    }
    findAudioFiles() {
        return fs.readdir(path.join(__dirname, 'audio'));
    }
}

module.exports = Say;
