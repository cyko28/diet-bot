const fs = require('fs-extra');
const path = require('path');

const TextToSpeech = require('@google-cloud/text-to-speech');
const tts = new TextToSpeech.TextToSpeechClient();

class TTS {
    run(params, connection, filename) {
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
                './src/plugins/say/generated/' + filename + '.mp3',
                response.audioContent,
                'binary',
                err => {
                    if (err) {
                        console.error('ERROR:', err);
                        return;
                    }
                    console.log(
                        'Audio content written to file: ' + filename + '.mp3'
                    );
                    const intent = connection.playFile(
                        this.playAudio(filename)
                    );

                    intent.on('end', () => connection.disconnect());
                }
            );
        });
    }
    playAudio(filename) {
        return path.join(
            __dirname,
            '../',
            'plugins',
            filename,
            'generated',
            filename + '.mp3'
        );
    }
}

module.exports = TTS;
