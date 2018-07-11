const fs = require('fs');
const path = require('path');

class Airhorn {
    constructor() {
        this.commands = ['a', 'airhorn', 'audio'];
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
                    const intent = connection.playFile(
                        this.getAudio(params[0])
                    );
                    intent.on('end', () => connection.disconnect());
                })
                .catch(console.error);
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
    getAudio(requestedName) {
        let filepath = path.join(
            __dirname,
            'audio',
            'airhorn-' + requestedName + '.mp3'
        );
        if (!fs.existsSync(filepath)) {
            filepath = path.join(__dirname, 'audio', 'airhorn.mp3');
        }
        return filepath;
    }
}

module.exports = Airhorn;
