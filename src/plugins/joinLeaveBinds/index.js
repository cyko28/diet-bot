const fs = require('fs-extra');
const path = require('path');
const storage = require('node-persist');
const { InputCommand } = require('../../services/command');

class JoinLeaveBinds {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = ['bind', 'unbind'];
        this.userBindsMap = {}; //Map to userId to command string. Ex: 12312321 -> ['!a eueue']
    }
    init() {
        // init storage
        storage.init({
            dir: 'src/.storage/joinLeaveBinds',
            stringify: JSON.stringify,
            parse: JSON.parse,
            encoding: 'utf8',
            logging: false,
            expiredInterval: 2 * 60 * 1000,
            forgiveParseErrors: false,
        });
        this.joinLeaveBinds();
    }

    joinLeaveBinds = async () => {
        this.bot.on('voiceStateUpdate', (oldMember, newMember) => {
            debugger;
            // pull user id from map
            const newUserChannel = newMember.channel;
            const oldUserChannel = oldMember.channel;
            if (
                !this.isDietBot(newMember) &&
                this.userJoinedChannel(newUserChannel, oldUserChannel)
            ) {
                // Extract bind, if exists
                const params = this.userBindsMap[`${newMember.id}`];
                if (params != undefined && params.length > 0) {
                    this.runCommand(params.join(' '));
                }
            }
        });
    };

    userJoinedChannel(oldUserChannel, newUserChannel) {
        return (
            (!oldUserChannel && newUserChannel) ||
            (oldUserChannel &&
                newUserChannel &&
                oldUserChannel.id != newUserChannel.id)
        );
    }

    run(message, params = [], token) {
        debugger;
        if (token === 'bind') {
            this.handleBind(message, params);
        } else if (token === 'unbind') {
            this.handleUnbind(message);
        }
    }

    //!bind !a skat
    handleBind(message, params) {
        debugger;
        if (this.isValidCommand(params)) {
            const userId = message.id;
            this.userBindsMap[`${userId}`] = params;
        }
    }

    handleUnbind(message) {
        const userId = message.id;
        this.userBindsMap[`${userId}`] = {};
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
        ];
        const isOnWhitelist = whitelist.includes(params[0]);
        const tooLong = params.length > threshold;
        return isOnWhitelist && !tooLong;
    }

    runCommand(commandString) {
        const cmd = new InputCommand(commandString);
        if (cmd.isValid) {
            this.commandQueue.add(cmd);
        }
    }

    isDietBot(voiceState) {
        const dietBotId = '279879398323257346';
        return voiceState.member.id === dietBotId;
    }
}

module.exports = JoinLeaveBinds;
