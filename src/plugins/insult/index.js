const fs = require('fs-extra');
const path = require('path');
const say = require('say');

class Insult {
    constructor(bot) {
        this.bot = bot;
        this.commands = ['i', 'insult'];
        this.audioFiles = new Map();
        this.pathToFile = path.join(__dirname, 'audio', 'say.wav');
    }
    init() {
        // this.getVoiceUsers();
        this.generateInsult();
    }
    async run(message, params = []) {
        const insult = `${params[0]}, ${this.generateInsult()}`;
        this.generateSpeech(insult);
        // Voice only works in guilds, if the message does not come from a guild,
        // we ignore it
        if (!message.guild) return;

        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();

            const dispatcher = connection.play(this.pathToFile);
            dispatcher.on('finish', () => {
                connection.disconnect();
            });
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
    generateSpeech(phrase) {
        say.export(
            phrase,
            'Microsoft Zira Desktop',
            1,
            this.pathToFile,
            (err) => {
                if (err) {
                    return console.error(err);
                }

                console.log(`\n[Insult Plugin]\n"${phrase}" saved to say.mp3`);
            }
        );
    }
    findAudioFiles() {
        return fs.readdir(path.join(__dirname, 'audio'));
    }
    getVoiceUsers() {
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
        const voiceUsers = voiceChannelsWithUsers
            .map((chan) => chan.members.array())
            .flat();
        return voiceUsers;
    }
    generateInsult() {
        var complementA = [
            'beautiful',
            'lovely',
            'hard-working',
            'wonderful',
            'voluptuous',
        ];
        var complementB = ['life-giving', 'flower-like'];
        var complementC = ['person', 'angel', 'individual'];

        var insultA = [
            'tossing',
            'bloody',
            'shitting',
            'wanking',
            'frothy',
            'stinky',
            'raging',
            'dementing',
            'dumb',
            'fucking',
            'dipping',
            'holy',
            'maiming',
            'cocking',
            'ranting',
            'hairy',
            'girthy',
            'spunking',
            'flipping',
            'slapping',
            'one-direction loving',
            'trump loving',
            'sodding',
            'blooming',
            'frigging',
            'guzzling',
            'glistering',
            'cock wielding',
            'failed',
            'artist formally known as',
            'unborn',
            'pulsating',
            'naked',
            'throbbing',
            'lonely',
            'failed',
            'stale',
            'spastic',
            'senile',
            'strangely shaped',
            'virgin',
            'bottled',
            'twin-headed',
            'fat',
            'gigantic',
            'sticky',
            'prodigal',
            'bald',
            'bearded',
            'horse-loving',
            'spotty',
            'spitting',
            'dandy',
            'fritzl-admiring',
            'friend of a',
            'indeterminable',
            'overrated',
            'fingerlicking',
            'diaper-wearing',
            'leg-humping',
            'gold-digging',
            'mong loving',
            'trout-faced',
            'cunt rotting',
            'flip-flopping',
            'rotting',
            'inbred',
            'badly drawn',
            'undead',
            'annoying',
            'whoring',
            'leaking',
            'dripping',
            'racist',
            'slutty',
            'cross-eyed',
            'irrelevant',
            'mental',
            'rotating',
            'scurvy looking',
            'rambling',
            'gag sacking',
            'cunting',
            'wrinkled old',
            'dried out',
            'sodding',
            'funky',
            'silly',
            'unhuman',
            'bloated',
            'wanktastic',
            'bum-banging',
            'cockmunching',
            'animal-fondling',
            'stillborn',
            'scruffy-looking',
            'hard-rubbing',
            'rectal',
            'glorious',
            'eye-less',
            'constipated',
            'bastardized',
            'utter',
            'hitlers personal',
            'irredeemable',
            'complete',
            'enormous',
            'go suck a',
            'fuckfaced',
            'broadfaced',
            'titless',
            'son of a',
            'demonizing',
            'pigfaced',
            'treacherous',
            'retarded',
        ];
        var insultB = [
            'cock',
            'tit',
            'cunt',
            'wank',
            'piss',
            'crap',
            'shit',
            'ass',
            'sperm',
            'nipple',
            'anus',
            'colon',
            'shaft',
            'dick',
            'poop',
            'semen',
            'slut',
            'suck',
            'earwax',
            'fart',
            'scrotum',
            'cock-tip',
            'tea-bag',
            'jizz',
            'cockstorm',
            'bunghole',
            'food trough',
            'bum',
            'butt',
            'shitface',
            'ass',
            'nut',
            'ginger',
            'llama',
            'tramp',
            'fudge',
            'vomit',
            'cum',
            'lard',
            'puke',
            'sphincter',
            'nerf',
            'turd',
            'cocksplurt',
            'cockthistle',
            'dickwhistle',
            'gloryhole',
            'spazz',
            'nutsack',
            'fuck',
            'spunk',
            'shitshark',
            'shithawk',
            'fuckwit',
            'dipstick',
            'asswad',
            'chesticle',
            'clusterfuck',
            'douchewaffle',
            'retard',
        ];
        var insultC = [
            'force',
            'bottom',
            'hole',
            'goatse',
            'testicle',
            'balls',
            'bucket',
            'biscuit',
            'stain',
            'boy',
            'rat bastard',
            'flaps',
            'erection',
            'mange',
            'brony',
            'weeaboo',
            'twat',
            'diarrhea',
            'sod',
            'excrement',
            'pirate',
            'asswipe',
            'sock',
            'sack',
            'barrel',
            'thunder cunt',
            'head',
            'zombie',
            'alien',
            'minge',
            'candle',
            'torch',
            'pipe',
            'jockey',
            'udder',
            'pig',
            'dog',
            'cockroach',
            'worm',
            'MILF',
            'sample',
            'infidel',
            'spunk-bubble',
            'stack',
            'handle',
            'badger',
            'wagon',
            'bandit',
            'lord',
            'bogle',
            'bollock',
            'knob',
            'nugget',
            'king',
            'hole',
            'kid',
            'trailer',
            'whale',
            'rag',
            'foot',
        ];
        var insultD = [
            'licker',
            'lover',
            'shiner',
            'blender',
            'fucker',
            'ass jacker',
            'butler',
            'goomba',
            'turd-burglar',
            'packer',
            'rider',
            'wanker',
            'sucker',
            'wiper',
            'experiment',
            'wiper',
            'cum farter',
            'bender',
            'dictator',
            'basher',
            'piper',
            'slapper',
            'fondler',
            'bastard',
            'handler',
            'herder',
            'fan',
            'son of a bitch',
            'amputee',
            'extractor',
            'professor',
            'graduate',
        ];

        const _randomFromArray = (arr) => {
            const len = arr.length;
            const index = Math.floor(Math.random() * len);
            return arr[index];
        };

        const choices = ['ABC', 'ABD', 'AB', 'BD'];

        const words = _randomFromArray(choices)
            .split('')
            .map((el) => {
                return _randomFromArray(eval(`insult${el}`));
            });

        const getWrecked = Math.random() < 0.1 ? ' Get Wrecked!' : '';

        return `You are a ${words.join(' ')}!${getWrecked}`;
    }
}

module.exports = Insult;
