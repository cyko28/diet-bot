const fs = require('fs-extra');
const path = require('path');
const Discord = require('discord.js');
const { debug, timeStamp } = require('console');
const stringSimilarity = require('string-similarity');
const storage = require('node-persist');

class PhraseLeaderboard {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = ['leaderboard'];
        this.trackedPhrases = []; // Include custom phrases to be tracked here
        this.phraseLeaderboardTrackingMap = {};
    }
    init() {
        // init storage
        storage.init({
            dir: '.storage/phraseLeaderboard',
            stringify: JSON.stringify,
            parse: JSON.parse,
            encoding: 'utf8',
            logging: false,
            ttl: false,
            expiredInterval: 2 * 60 * 1000,
            forgiveParseErrors: false,
        });

        setTimeout(
            async function () {
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
                const localStorageKey = 'phraseLeaderboardTrackingMap';
                let storageTrackingMap = await storage.getItem(localStorageKey);

                // If the storage map is populated, set that as the tracking map.
                if (storageTrackingMap) {
                    this.phraseLeaderboardTrackingMap = storageTrackingMap;
                }

                this.leaderboard();
            }.bind(this),
            1000
        );
    }
    async run(message, params = []) {
        // Voice only works in guilds, if the message does not come from a guild,
        // we ignore it
        if (!message.guild) return;

        const dietClanID = '169703392749289472';
        const dietClanGuild = this.bot.guilds.cache.get(dietClanID);

        // Iterate through the tracked phrases map, then go through the phrase counts.
        // Output something pretty to the channel to display the current leaderboard.
        const embeddedMessage = Object.keys(
            this.phraseLeaderboardTrackingMap
        ).map((phraseKey) => {
            let currentPhrase = `**${phraseKey}**\n`;
            let phraseCountMap = this.phraseLeaderboardTrackingMap[phraseKey];

            let embeddedPhraseCountMessage = Object.keys(phraseCountMap)
                .sort(function (a, b) {
                    return phraseCountMap[b] - phraseCountMap[a];
                })
                .map((id) => {
                    const member = dietClanGuild.members.cache.get(id);
                    return `_${member.displayName}_: ${phraseCountMap[id]}\n`;
                });

            return `${currentPhrase}${embeddedPhraseCountMessage}`;
        });

        const channelEmbed = new Discord.MessageEmbed()
            .setTitle(`(╯°□°)╯ Overall Leaderboard`)
            .setDescription(embeddedMessage);
        message.channel.send(channelEmbed);
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

        const channelEmbed = new Discord.MessageEmbed()
            .setTitle(
                `(╯°□°)╯ ${this.capitalizeFirstLetter(phrase)}  Leaderboard`
            )
            .setDescription(embeddedMessage);
        channel.send(channelEmbed);
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

        storage.setItem(
            'phraseLeaderboardTrackingMap',
            this.phraseLeaderboardTrackingMap
        );

        console.log('\n[Leaderboard Plugin]');
        console.log(
            `User ${sendByUserId} has now said ${phrase} ${phraseCountMap[sendByUserId]} times.`
        );
    }
}

module.exports = PhraseLeaderboard;
