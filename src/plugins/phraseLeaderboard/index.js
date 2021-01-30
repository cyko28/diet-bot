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
        this.multiCommandMap = {}; // Used to hold a map of multipe bot commands to one master command.
        this.customTrackedPhrases = []; // Include custom phrases to be tracked here
        this.trackedPhrases = {};
        this.phraseLeaderboardTrackingMap = {};
    }
    async init() {
        // init storage
        await storage.init({
            dir: 'src/.storage',
            stringify: JSON.stringify,
            parse: JSON.parse,
            encoding: 'utf8',
            logging: false,
            ttl: false,
            expiredInterval: 2 * 60 * 1000,
            forgiveParseErrors: true,
        });

        setTimeout(
            async function () {
                const trumpPlugin = this.commandQueue.plugins.get('trump');
                const trumpAudioNames = trumpPlugin.audioFiles.map(
                    (fileName) => {
                        return fileName.split('.mp3')[0].split('_').join(' ');
                    }
                );

                const airhornPlugin = this.commandQueue.plugins.get('airhorn');
                const airhornAudioNames = airhornPlugin.audioFiles.map(
                    (fileName) => {
                        if (!fileName.split('airhorn-')[1]) {
                            return 'airhorn';
                        }
                        return fileName
                            .split('airhorn-')[1]
                            .split('.mp3')[0]
                            .split('_')
                            .join(' ');
                    }
                );

                // Populate all commands from each plugins into the multi command map
                // The trackedPhrases map will only use the first command of each plugin as the lookup
                airhornPlugin.commands.forEach(
                    function (entry) {
                        this.multiCommandMap[
                            `${entry}`
                        ] = `${airhornPlugin.commands[0]}`;
                    }.bind(this)
                );

                this.trackedPhrases[
                    `${airhornPlugin.commands[0]}`
                ] = airhornAudioNames;

                trumpPlugin.commands.forEach(
                    function (entry) {
                        this.multiCommandMap[
                            `${entry}`
                        ] = `${trumpPlugin.commands[0]}`;
                    }.bind(this)
                );

                this.trackedPhrases[
                    `${trumpPlugin.commands[0]}`
                ] = trumpAudioNames;

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
        const embeddedMessage = Object.keys(this.phraseLeaderboardTrackingMap)
            .filter((el) => {
                const map = this.phraseLeaderboardTrackingMap;
                const threshold = 5;
                const val = Object.values(map[el])
                    .map((el) => parseInt(el))
                    .reduce((acc, el) => acc + el, 0);
                return val >= threshold;
            })
            .sort((a, b) => {
                const map = this.phraseLeaderboardTrackingMap;
                const maxA = Object.values(map[a])
                    .map((el) => parseInt(el))
                    .reduce((acc, el) => acc + el, 0);
                const maxB = Object.values(map[b])
                    .map((el) => parseInt(el))
                    .reduce((acc, el) => acc + el, 0);

                return maxB - maxA;
            })
            .map((phraseKey) => {
                const currentPhrase = `**${phraseKey}**\n`;
                const phraseCountMap = this.phraseLeaderboardTrackingMap[
                    phraseKey
                ];
                const firstPlaceEmoji = ':first_place:';

                const embeddedPhraseCountMessage = Object.keys(phraseCountMap)
                    .sort(function (a, b) {
                        return phraseCountMap[b] - phraseCountMap[a];
                    })
                    .map((id, index) => {
                        const selectedEmoji = index == 0 ? firstPlaceEmoji : ``;
                        const member = dietClanGuild.members.cache.get(id);
                        return `_${member.displayName}_: ${phraseCountMap[id]} ${selectedEmoji}\n `;
                    })
                    .join('');

                return `${currentPhrase}${embeddedPhraseCountMessage}`;
            });

        // while loop to process large amounts of leaderboards
        const startLength = embeddedMessage.length;
        while (embeddedMessage.length) {
            const title =
                startLength === embeddedMessage.length
                    ? `(╯°□°)╯ Overall Leaderboard`
                    : '';
            const subMessage = embeddedMessage.splice(0, 10);

            const channelEmbed = new Discord.MessageEmbed()
                .setTitle(title)
                .setDescription(subMessage);
            message.channel.send(channelEmbed);
        }
    }

    leaderboard = async () => {
        this.bot.on('message', (message) => {
            let messageContent = message.content.toLowerCase().trim();

            const trackedPhrasesList = this.getTrackedPhrasesListToUse(
                messageContent
            );

            if (trackedPhrasesList.length != 0) {
                // strip any potential commands from the original message
                messageContent = this.stripPotentialCommand(messageContent);

                // we find the best match in the array of choices
                const matches = stringSimilarity.findBestMatch(
                    messageContent,
                    trackedPhrasesList
                );
                if (matches.bestMatch.rating > 0.5) {
                    console.log('\n[Leaderboard Plugin]');
                    console.log(
                        `${messageContent} is a tracked phrase in the leaderboard.`
                    );

                    this.updatePhraseCountForUser(
                        message,
                        this.phraseLeaderboardTrackingMap,
                        matches.bestMatch.target
                    );
                    this.outputStatsToChannel(
                        message.channel,
                        matches.bestMatch.target,
                        this.phraseLeaderboardTrackingMap[
                            matches.bestMatch.target
                        ]
                    );
                }
            }
        });
    };

    stripPotentialCommand(messageContent) {
        if (messageContent.indexOf('!') == 0) {
            return messageContent.substring(messageContent.indexOf(' ') + 1);
        }
        return messageContent;
    }

    getTrackedPhrasesListToUse(messageContent) {
        if (this.customTrackedPhrases.indexOf(messageContent) > -1) {
            return this.customTrackedPhrases;
        }
        const potentialCommand = messageContent.substring(1).split(' ')[0];
        if (
            potentialCommand &&
            this.multiCommandMap[potentialCommand] != undefined
        ) {
            return this.trackedPhrases[this.multiCommandMap[potentialCommand]];
        }

        return [];
    }

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

    updatePhraseCountForUser(message, phraseLeaderboardTrackingMap, phrase) {
        const sendByUserId = message.author.id;
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
            `User ${message.member.displayName} has now said ${phrase} ${phraseCountMap[sendByUserId]} times.`
        );
    }
}

module.exports = PhraseLeaderboard;
