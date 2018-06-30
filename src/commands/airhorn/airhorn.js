const fs = require('fs');
const stream = fs.createReadStream('./src/commands/airhorn/audio/airhorn.mp3');

class Airhorn {
    playAirhorn(message) {
        // Voice only works in guilds, if the message does not come from a guild,
        // we ignore it
        if (!message.guild) return;

        if (message.content === '/join') {
            // Only try to join the sender's voice channel if they are in one themselves
            if (message.member.voiceChannel) {
                message.member.voiceChannel
                    .join()
                    .then(connection => {
                        const intent = connection.playStream(stream);
                        intent.on('end', () => connection.disconnect());
                    })
                    .catch(console.log);
            } else {
                message.reply('You need to join a voice channel first!');
            }
        }
    }
}

module.exports = Airhorn;
