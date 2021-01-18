const fetch = require('node-fetch');

class DietLeague {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = ['dl', 'dietleague'];
        this.ready = false;
        this.status = null;
        this.userIdsWithPermissionsToAdmin = ['120436529725308930', '130511627027087360'];
        this.categoryName = 'Diet League Season 3';
        this.categoryId = null;
        this.dietLeagueChannelNames = ['❄️ The Ice Age', '🦖 Dinosaurs'];
        this.createdChannelIds = [];
        this.inGamePlayers = [];
    }

    init() {
    }

    async run(message, params = []) {
        // Execute commands, but only for allowed discord users
        if (this.userIdsWithPermissionsToAdmin.includes (message.member.id)) {
            const command = `${params[0]}`;
            if('move' === command) {
                const gameNumber = `${params[1]}`;
                if(gameNumber !== 'undefined') {
                    this.hitAPIForMatchInfo(gameNumber);
                }
            } else if ('gather' === command) {
                // move players from inGamePlayers array back to the rocket league channnel
                this.gatherInGamePlayersToMainChannel()
            }
        } else {
            console.log('\n[Diet League Plugin]');
            console.log(
                `Ignoring unauthorized user command. `
            );
        }
    }

    hitAPIForMatchInfo(gameNumber) {
        const url = `http://dietleague.gg/_callbacks/get-match.php?match=${gameNumber}`;
        fetch(url, { timeout: 60000 })
            .then((res) => {
                this.status = res.status;
                return res.json();
            })
            .then((data) => {
                console.log('\n[Diet League Plugin]');
                console.log(
                    `Moving players into their own voice channel for game ${gameNumber} . `
                );

                this.inGamePlayers = [];
                this.prepPlayersForMatch(data, this);
            });
    }

    prepPlayersForMatch(data, that) {
        const team1 = [data.player_a, data.player_b];
        const team2 = [data.player_c, data.player_d];
        const matchTeams = [team1, team2];

        that.createVoiceCategory().then(result => {
            this.categoryId = result.id;
   
            that.dietLeagueChannelNames.forEach((entry, index, arr) => {
                let createdChannel = that.createVoiceChannelForMatch(entry, this.categoryId).then(result => {
                    this.createdChannelIds.push(result.id);
                    setTimeout(() => {
                        const teamMembers = matchTeams[index];
                        
                        if(teamMembers[0] != null) {
                            const player = this.getDiscordUser(teamMembers[0]);
                            if(player) {
                                player.voice.setChannel(result).catch(err => console.log(err));
                                this.inGamePlayers.push(player.id);
                            }
                        }
    
                        if(teamMembers[1] != null) {
                            const player = this.getDiscordUser(teamMembers[1]);
                            if(player) {
                                player.voice.setChannel(result).catch(err => console.log(err));
                                this.inGamePlayers.push(player.id);
                            }
                        }
                    }, 1000);
                });           
            });
        });
    };


    async createVoiceCategory() {
        const dietClanID = '169703392749289472';
        const dietClanGuild = this.bot.guilds.cache
            .array()
            .find((el) => el.id === dietClanID);

        // Create diet league category
        let createdCategory = await dietClanGuild.channels.create(this.categoryName, {
            type: 'category',
        });
        createdCategory.edit({
            position: 2
        });
        return createdCategory;
    }

    async createVoiceChannelForMatch(channelName, categoryId) {
        const dietClanID = '169703392749289472';
        const dietClanGuild = this.bot.guilds.cache
            .array()
            .find((el) => el.id === dietClanID);

        let newChannel = await dietClanGuild.channels.create(channelName, {
                type: 'voice',
                bitrate: '128000',
        });

        newChannel.setParent(categoryId);
        newChannel.edit({
            position: 0
        });
        return newChannel;
    }

    gatherInGamePlayersToMainChannel() {
        console.log('\n[Diet League Plugin]');
        console.log(
            `Moving players back to main channel. `
        );
        const destinationChannel = this.getRocketLeagueVoiceChannel();
        debugger;
        this.inGamePlayers.forEach((entry, index, arr) => {
            const player = this.getDiscordUser(entry);
            player.voice.setChannel(destinationChannel).catch(err => console.log(err));
        });
        this.inGamePlayers = [];


        // Delete channels after 5 seconds
        setTimeout(() => {
            let channelId = null;
            // Clean up ... remove temp voice channels
            while((channelId=this.createdChannelIds.pop()) != null){ 
                const channel = this.getDiscordChannel(channelId);
                if(channel) {
                    if(channel.members.size === 0) {
                        channel.delete();
                    }
                }
            }

            // Clear the category after 500ms. The reason for this is sometimes discords bugs out if you remove the category too quick after deleting the channel
            setTimeout(() => {
                const category = this.getDiscordChannel(this.categoryId);
                category.delete();
                this.categoryId = null;
            }, 500);
       
            
        }, 5000);
    }

    getDiscordChannel(channelId) {
        const dietClanID = '169703392749289472';
        const dietClanGuild = this.bot.guilds.cache
            .array()
            .find((el) => el.id === dietClanID);
        const channelToReturn = dietClanGuild.channels.cache.get(channelId);
        return channelToReturn;
    }

    getDiscordUser(userId) {
        const dietClanID = '169703392749289472';
        const dietClanGuild = this.bot.guilds.cache
            .array()
            .find((el) => el.id === dietClanID);
        const voiceChannelsWithUsers = dietClanGuild.channels.cache
            .array()
            .filter(
                (channel) =>
                    channel.type === 'voice' && channel.members.size > 0
            );
        const voiceUser = voiceChannelsWithUsers
            .map((chan) => chan.members.array())
            .flat().find( (el) => el.id === userId);

        return voiceUser;
    }

    getGeneralVoiceChannel() {
        const dietClanID = '169703392749289472';
        const dietClanGuild = this.bot.guilds.cache
            .array()
            .find((el) => el.id === dietClanID);
        const generalChannelVoiceId = '169703393277902848';
        return dietClanGuild.channels.cache.get(generalChannelVoiceId);
    }

    getRocketLeagueVoiceChannel() {
        const dietClanID = '169703392749289472';
        const dietClanGuild = this.bot.guilds.cache
            .array()
            .find((el) => el.id === dietClanID);
        const rocketLeagueChannelVoiceId = '546768661944336394';
        return dietClanGuild.channels.cache.get(rocketLeagueChannelVoiceId);
    }

    getEmptyVoiceChannel() {
        const dietClanID = '169703392749289472';
        const dietClanGuild = this.bot.guilds.cache
            .array()
            .find((el) => el.id === dietClanID);
        const voiceChannelsWithoutUsers = dietClanGuild.channels.cache
            .array()
            .filter(
                (channel) =>
                    channel.type === 'voice' && channel.members.size === 0 
                    && channel.parentID === '462311657859842048'  // voice chanenls not archived
                    && channel.id !== '256289456502341633'        // not the AFK channel
            );
        return voiceChannelsWithoutUsers[0];
    }
}

module.exports = DietLeague;
