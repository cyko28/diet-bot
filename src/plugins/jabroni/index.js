const fs = require('fs-extra');
const path = require('path');

class Jabroni {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = ['jabroni'];
        this.audioFiles = [];
        this.jabroni = ['j', 'a', 'j', 'b', 'o', 'r', 'i'];
        this.fileNameList = ['j', 'a', 'b', 'o', 'r', 'i', 'n', 'x', 'y', 'z'];
        this.extraroni = [];
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

        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            if (this.extraroni.length >= 100) {
                this.extraroni = [];
            }

            this.react(message, 'success');
            this.react(message, 'rodentrock');

            let filesToPlay = this.jabroni.slice();
            filesToPlay = this.addRandomLetters(filesToPlay);
            filesToPlay.unshift('start');
            filesToPlay.push('end');
            this.playAudioFilesToChannel(connection, filesToPlay);
        } else {
            this.react(message, 'fail');
            message.reply('You need to join a voice channel first!');
        }
    }

    playAudioFilesToChannel(connection, audioFiles) {
        if (audioFiles.length == 0) {
            connection.disconnect();
            return;
        }
        const audioFileName = audioFiles[0];
        const audio = path.join(__dirname, 'audio', `${audioFileName}.mp3`);
        if (audio) {
            const dispatcher = connection.play(audio);
            dispatcher.on('finish', () => {
                audioFiles.shift();
                this.playAudioFilesToChannel(connection, audioFiles);
            });
        }
    }
    findAudioFiles() {
        return fs.readdir(path.join(__dirname, 'audio'));
    }
    addRandomLetters(filesToPlay) {
        for (var i = 0; i < 10; i++) {
            var item = this.fileNameList[
                Math.floor(Math.random() * this.fileNameList.length)
            ];
            if (item === 'x') {
                if (Math.random() < 0.3) {
                    this.extraroni.push(item);
                    this.extraroni.push(item);
                }
            }
            this.extraroni.push(item);
        }
        filesToPlay.push(...this.extraroni);
        return filesToPlay;
    }

    playAudio(fileName) {
        return;
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

module.exports = Jabroni;
