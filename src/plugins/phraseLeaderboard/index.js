const fs = require('fs-extra');
const path = require('path');
const Discord = require('discord.js');
const { debug, timeStamp } = require('console');
const stringSimilarity = require('string-similarity');

class PhraseLeaderboard {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = [];
        this.trackedPhrases = ['rip']; // Include custom phrases to be tracked here
        this.phraseLeaderboardTrackingMap = {};
    }
    init() {
        setTimeout(
            function () {
                const trumpAudioNames = this.commandQueue.plugins
                    .get('trump')
                    .audioFiles.map((fileName) => {
                        return fileName.split('.mp3')[0].split('_').join(' ');
                    });

                const airhornAudioNames = this.commandQueue.plugins
                    .get('airhorn')
                    .audioFiles.map((fileName) => {
                        if (!fileName.split('airhorn-')[1]) {
                            return 'airhorn';
                        }
                        return fileName
                            .split('airhorn-')[1]
                            .split('.mp3')[0]
                            .split('_')
                            .join(' ');
                    });

                this.trackedPhrases = [
                    ...this.trackedPhrases,
                    ...trumpAudioNames,
                    ...airhornAudioNames,
                ];

                this.trackedPhrases.forEach((element) => {
                    this.phraseLeaderboardTrackingMap[element] = {};
                });
                this.leaderboard();
            }.bind(this),
            1000
        );
    }
    leaderboard = async () => {
        this.bot.on('message', (message) => {
            const messageContent = message.content.toLowerCase().trim();

            // we find the best match in the array of choices
            const matches = stringSimilarity.findBestMatch(
                messageContent,
                this.trackedPhrases
            );
            if (matches.bestMatch.rating > 0.7) {
                console.log('\n[Leaderboard Plugin]');
                console.log(
                    `${messageContent} is a tracked phrase in the leaderboard.`
                );
                const sendByUserId = message.author.id;
                this.updatePhraseCountForUser(
                    sendByUserId,
                    this.phraseLeaderboardTrackingMap,
                    matches.bestMatch.target
                );
                this.outputStatsToChannel(
                    message.channel,
                    matches.bestMatch.target,
                    this.phraseLeaderboardTrackingMap[matches.bestMatch.target]
                );
            }
        });
    };

    outputStatsToChannel(channel, phrase, phraseCountMap) {
        const dietClanID = '169703392749289472';
        const dietClanGuild = this.bot.guilds.cache.get(dietClanID);

        // Iterate through the sorted map
        const embeddedMessage = Object.keys(phraseCountMap)
            .sort(function (a, b) {
                return phraseCountMap[b] - phraseCountMap[a];
            })
            .map((id) => {
                const member = dietClanGuild.members.cache.get(id);
                return `**${member.displayName}**: ${phraseCountMap[id]}\n`;
            });

        const exampleEmbed = new Discord.MessageEmbed()
            .setTitle(
                `(╯°□°)╯ ${this.capitalizeFirstLetter(phrase)}  Leaderboard`
            )
            .setDescription(embeddedMessage);
        channel.send(exampleEmbed);
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    updatePhraseCountForUser(
        sendByUserId,
        phraseLeaderboardTrackingMap,
        phrase
    ) {
        let phraseCountMap = this.phraseLeaderboardTrackingMap[phrase];
        if (!phraseCountMap) {
            phraseCountMap = {};
            phraseCountMap[sendByUserId] = 1;
        } else {
            if (!phraseCountMap[sendByUserId]) {
                phraseCountMap[sendByUserId] = 1;
            } else {
                phraseCountMap[sendByUserId] = ++phraseCountMap[sendByUserId];
            }
        }
        this.phraseLeaderboardTrackingMap[phrase] = phraseCountMap;
        console.log('\n[Leaderboard Plugin]');
        console.log(
            `User ${sendByUserId} has now said ${phrase} ${phraseCountMap[sendByUserId]} times.`
        );
    }
}

module.exports = PhraseLeaderboard;
