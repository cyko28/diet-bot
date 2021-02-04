const fs = require('fs-extra');
const path = require('path');
const { InputCommand } = require('../../services/command');

class JoinBind {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.storage = commandQueue.botStorage;
        this.commands = ['bind', 'unbind'];
        this.userBindsMap = {}; //Map to userId to command string. Ex: 12312321 -> ['!a eueue']
        this.localStorageKey = 'userBindsMap';
    }
    async init() {
        this.joinLeaveBinds();
    }

    joinLeaveBinds = async () => {
        const savedStorageMap = await this.storage.getItem(this.localStorageKey);
        if (savedStorageMap) {
            this.userBindsMap = savedStorageMap;
        }

        this.bot.on('voiceStateUpdate', (oldMember, newMember) => {
            // pull user id from map
            const newUserChannel = newMember.channel;
            const oldUserChannel = oldMember.channel;
            if (
                !this.isDietBot(newMember) &&
                this.userJoinedChannelNonEmptyChannel(
                    oldUserChannel,
                    newUserChannel
                )
            ) {
                // Extract bind, if exists
                const params = this.userBindsMap[`${newMember.member.id}`];
                if (params?.length) {
                    console.log(
                        `\n[JoinBind Plugin]\n ${
                            newMember.member.displayName
                        } joined a channel (Discord ID: ${newMember.member.id}). Running the command "${params.join(' ')}"`
                    );
                    this.runCommand(
                        newUserChannel,
                        newMember.member,
                        params.join(' ')
                    );
                }
            }
        });
    };

    userJoinedChannelNonEmptyChannel(oldUserChannel, newUserChannel) {
        return (
            !oldUserChannel &&
            newUserChannel &&
            newUserChannel.members.size != 1
        );
    }

    run(message, params = [], token) {
        if ((token === 'bind' || token === 'unbind') && params[0] === 'help') {
            message.reply(
                `!bind [command to run on join] || !unbind\n!bind binds a command for when first join discord, !unbind clears it`
            );
        } else if (token === 'bind') {
            this.handleBind(message, params);
        } else if (token === 'unbind') {
            this.handleUnbind(message);
        }
    }

    async handleBind(message, params) {
        if (this.isValidCommand(params)) {
            const userId = message.author.id;
            this.userBindsMap[`${userId}`] = params;
            await this.storage.setItem(this.localStorageKey, this.userBindsMap);
            this.react(message, 'success');
            message.react('🚪');
            console.log(
                `\n[JoinBind Plugin]\n ${
                    message.member.displayName
                } set a new bind of: ${params.join(' ')}`
            );
        } else {
            this.react(message, 'fail');
            message.react('🚪');
            console.log(
                `\n[JoinBind Plugin]\n ${
                    message.member.displayName
                } tried to set an invalid command of: ${params.join(' ')}`
            );
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

    async handleUnbind(message) {
        const userId = message.author.id;
        this.userBindsMap[`${userId}`] = {};
        await this.storage.setItem(this.localStorageKey, this.userBindsMap);
        this.react(message, 'success');
        message.react('🚪');
        console.log(
            `\n[JoinBind Plugin]\n ${message.member.displayName} unbound their commands. `
        );
    }

    isValidCommand(params) {
        const threshold = 20;
        const whitelist = [
            '!a',
            '!airhorn',
            '!audio',
            '!s',
            '!say',
            '!t',
            '!trump',
            '!b',
            '!buttlord',
            '!i',
            '!insult',
            '!r',
            '!rave',
            '!ja',
        ];
        const isOnWhitelist = whitelist.includes(params[0]);
        const tooLong = params.length > threshold;
        return isOnWhitelist && !tooLong;
    }

    runCommand(runOnChannel, member, commandString) {
        const fakeMessage = {
            content: commandString,
            author: { id: member.id },
            guild: true,
            member: { voice: { channel: runOnChannel } },
        };
        const cmd = new InputCommand(fakeMessage);
        if (cmd.isValid) {
            this.commandQueue.add(cmd);
        }
    }

    isDietBot(voiceState) {
        const dietBotId = '279879398323257346';
        return voiceState.member.id === dietBotId;
    }
}

module.exports = JoinBind;
