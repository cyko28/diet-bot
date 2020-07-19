const fs = require('fs-extra');
const path = require('path');
const { debug } = require('console');

class Bully {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = [];
        this.interval = null;
        this.userMap = {};
    }
    init() {
        this.bot.on('voiceStateUpdate', (oldMember, newMember) => {
            const newUserChannel = newMember.channel;
            const oldUserChannel = oldMember.channel;
            if (
                !this.isDietBot(newMember) &&
                ((!oldUserChannel && newUserChannel) ||
                    (oldUserChannel &&
                        newUserChannel &&
                        oldUserChannel.id != newUserChannel.id))
            ) {
                const timeToCheckChannelStatus =
                    Math.round(Math.random() * 10) + 10;
                console.log('\n[Bully Plugin]');
                console.log(
                    `User has joined a voice channel. Performing bully check in  ` +
                        timeToCheckChannelStatus +
                        ` seconds. `
                );
                clearInterval(this.interval);
                this.interval = setInterval(
                    this.bully,
                    timeToCheckChannelStatus * 1000
                );
            }
        });

        this.bot.on('message', (message) => {
            // Only check messages which are not diet bot
            if (!this.isDietBot(message)) {
                this.handleFoodNetworkMessage(message);
            }
        });
    }
    bully = async () => {
        const loneVoiceUser = this.getLoneVoiceUser();
        if (loneVoiceUser) {
            const lastBulliedTime = this.userMap[loneVoiceUser.id];
            const currDate = new Date().getTime();

            // Check bully user map to ensure the user was not bullied in the last 24 hours
            const generalTextChannel = this.getGeneralChannel();
            const suspciousEmojiId = '381269562139738113';
            const emoji = this.bot.emojis.cache.get(suspciousEmojiId);

            if (lastBulliedTime === undefined) {
                this.userMap[loneVoiceUser.id] = currDate;
                // First time bullying user

                this.triggerMentionToUserInChannel(
                    generalTextChannel,
                    loneVoiceUser,
                    emoji,
                    currDate
                );
            } else {
                const delta = Math.abs(currDate - lastBulliedTime) / 1000;
                const hours = Math.floor(delta / 3600) % 24;
                if (hours >= 24) {
                    this.triggerMentionToUserInChannel(
                        generalTextChannel,
                        loneVoiceUser,
                        emoji,
                        currDate
                    );
                }
            }
        }
        // Clearing the interval so this doesn't run again until someone joins a voice channel
        clearInterval(this.interval);
    };

    handleFoodNetworkMessage(message) {
        if (
            this.isFoodNetworkChannel(message.channel) &&
            this.isHoobsherMessage(message)
        ) {
            //react with gordon emoji
            this.react(message, 'gordon');
        }
    }

    triggerMentionToUserInChannel(
        generalTextChannel,
        userToMention,
        emoji,
        currentDate
    ) {
        const shouldSendMessage = Math.random() < 0.8; // 80% chance to send message
        if (shouldSendMessage) {
            console.log('\n[Bully Plugin]');
            console.log(`Sending message to ${userToMention.displayName}`);
            generalTextChannel.send(`<@${userToMention.id}> ${emoji}`);
        }
        // Update map with current time so that this user wont be bullied for the next 24 hours
        this.userMap[userToMention.id] = currentDate;
    }

    getGeneralChannel() {
        const dietClanID = '169703392749289472';
        const dietClanGuild = this.bot.guilds.cache
            .array()
            .find((el) => el.id === dietClanID);
        const generalChannelId = '169703392749289472';
        return dietClanGuild.channels.cache.get(generalChannelId);
    }

    getLoneVoiceUser() {
        console.log('\n[Bully Plugin]');
        console.log(`Looking for lone voice channel user...`);

        const dietClanID = '169703392749289472';
        const dietClanGuild = this.bot.guilds.cache
            .array()
            .find((el) => el.id === dietClanID);

        const dietVoiceChannelsArray = dietClanGuild.channels.cache.array();
        const afkLandVoiceChannelId = '256289456502341633';

        const voiceChannelsWithMultipleUsers = dietVoiceChannelsArray.filter(
            (channel) =>
                channel.type === 'voice' &&
                channel.members.size > 1 &&
                channel.id != afkLandVoiceChannelId
        );

        const voiceChannelsWithASingleUser = dietVoiceChannelsArray.filter(
            (channel) =>
                channel.type === 'voice' &&
                channel.members.size == 1 &&
                channel.id != afkLandVoiceChannelId
        );

        if (
            voiceChannelsWithASingleUser.length == 1 &&
            voiceChannelsWithMultipleUsers.length >= 1
        ) {
            console.log('\n[Bully Plugin]');
            console.log(`Found lone user in a voice channel.`);
            const singleVoiceUserChannel = voiceChannelsWithASingleUser
                .map((chan) => chan.members.array())
                .flat();
            return singleVoiceUserChannel[0];
        } else {
            console.log('\n[Bully Plugin]');
            console.log(`No lone user found.`);
        }
    }

    react(message, emojiString) {
        if (message?.guild?.emojis) {
            const target = message.guild.emojis.cache.find(
                (emoji) => emoji.name === emojiString
            );
            message.react(target);
        }
    }

    isHoobsherMessage(message) {
        const hoobsherId = '197528955245428737';
        return message.author.id == hoobsherId;
    }

    isFoodNetworkChannel(channel) {
        const foodNetworkChannelId = '715796536445108294';
        return channel.id == foodNetworkChannelId;
    }

    isDietBot(voiceState) {
        const dietBotId = '279879398323257346';
        return voiceState.member.id === dietBotId;
    }
}

module.exports = Bully;
