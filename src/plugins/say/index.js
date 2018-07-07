const fs = require('fs-extra');
const path = require('path');

const TextToSpeech = require('@google-cloud/text-to-speech');
const tts = new TextToSpeech.TextToSpeechClient();

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
                    // Construct the request
                    const request = {
                        input: { text: params.join(' ') },
                        // Select the language and SSML Voice Gender (optional)
                        voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
                        // Select the type of audio encoding
                        audioConfig: { audioEncoding: 'MP3' }
                    };

                    // Performs the Text-to-Speech request
                    tts.synthesizeSpeech(request, (err, response) => {
                        if (err) {
                            console.error('ERROR:', err);
                            return;
                        }

                        // Write the binary audio content to a local file
                        fs.writeFile(
                            './src/plugins/say/audio/output.mp3',
                            response.audioContent,
                            'binary',
                            err => {
                                if (err) {
                                    console.error('ERROR:', err);
                                    return;
                                }
                                console.log(
                                    'Audio content written to file: output.mp3'
                                );
                                const intent = connection.playFile(
                                    this.playAudio()
                                );

                                intent.on('end', () => connection.disconnect());
                            }
                        );
                    });
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
        return path.join(__dirname, 'audio', 'output.mp3');
    }
    randomInt(n) {
        return Math.floor(Math.random() * n);
    }
}

module.exports = Say;
