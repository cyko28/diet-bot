require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

const { InputCommand, CommandQueue } = require('./services/command.js');

const pluginNames = [
    'airhorn',
    'buttlord',
    'rave',
    'trump',
    'nefariousStatuses',
    'say',
    'insult',
    'bully',
<<<<<<< HEAD
    // 'phraseLeaderboard',
=======
>>>>>>> f05710fc8cf7ffd7c21710278a36c5f58f746c38
    'shutdown',
    'joinBind',
    'joinAudio',
    'AutoMod',
    'stonks',
    'DietLeague',
    'cronSounds',
    'trendingStonks',
];
const commandQueue = new CommandQueue(bot, { pluginNames });

bot.on('ready', () => {
    printLogo();
});

bot.on('message', (msg) => {
    const input = new InputCommand(msg);
    commandQueue.add(input);
});

bot.on('voiceStateUpdate', handleVoiceStateUpdate);

function handleVoiceStateUpdate(before) {
    if (before.member.displayName === 'diet-bot') {
        if (!before.channelID) {
            commandQueue.active = true;
        } else {
            setTimeout(() => {
                commandQueue.active = false;
            }, 100);
        }
    }
}

bot.login(process.env.TOKEN);

function printLogo() {
    const speedGap = 25;
    setTimeout(() => {
        console.log(' ');
        console.log('  ');
        console.log(`                  ,,.─╖▓▓█▓╣░   ░▒▓▓████▄▄╦,`);
    }, 1 * speedGap);
    setTimeout(() => {
        console.log(`               ╫▄,░╓q▓╬╢╢▓▀╙╙ⁿⁿ░╨╝▒░▒▒▓███▀╣`);
    }, 2 * speedGap);
    setTimeout(() => {
        console.log(`               ▄█▓▓▓▓▓╢╢▒▒▒▒▒▒▒▒▒ßßß╢╢▒▒▒@▓▓`);
    }, 3 * speedGap);
    setTimeout(() => {
        console.log(`             ,█▓▓████▓▓▓▓▓╣╢╢╣▒▒▒▒▒▒▓▓╣╢╢╣▓▓▓,`);
    }, 4 * speedGap);
    setTimeout(() => {
        console.log(`            ╒▓▓▓▓▓███▓▓▓▓▓╣╢╢▒╢╢╢╣╣▒▒▓▓▓▓▓▓▓╣╢▓`);
    }, 5 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▓▓▓▓▓▓▓▓▓╣╢╢╢╣▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▒╫▓`);
    }, 6 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▓▓▓▓▓╣╢╣▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▌╫▓`);
    }, 7 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▓▓, ▀▓▓╣▒▒▒▒▒▒▒▒╖╓░ ▒▒▒▒▓▓▓▓▓▓╫▓`);
    }, 8 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▓▓▓""╕ ╟▒╜          ▒▒▒▒▒▓▓▓▓▓▓▓`);
    }, 9 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▓▓▀▌, ^╟▒  ╓╖╖╖╖╖╖╖▒▒▒▒▒▒▓▓▓▓▌▓▓`);
    }, 10 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▓▓▓ⁿ¬, ▓▒╖└╣▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓╣▓▓`);
    }, 11 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▓╓R▓&┐ ╣▒           ▒▒▒▒▒╢▓██╣▓▓`);
    }, 12 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▌▓█- ^▓╘▒,╓╖╖╖╖╖╖╖⌐ ▒▒▒▒▒╢▓██╢▓▓`);
    }, 13 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▓╙█L▐▓æ╔▒╜          ▒▒▒▒▒╢▓█▌╢▓▓`);
    }, 14 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▓▓▄▄▓╣╣╣╢  ,,,,,,  ]▒▒▒▒▒╢██╣╢▓▓`);
    }, 15 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▓▓▓▓▓╣╣╣[ ▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒█▌╣╣▓▓`);
    }, 16 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▓▓▓▓▓╣╣╣╢   ^^^^^   ▒▒▒▒▒██▒╣╢▓▓`);
    }, 17 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▓▓▓▓▓╣╣╣▒╢╖       ,▒▒▒▒▒▒▓█╢╣╣▓▓`);
    }, 18 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▓▓▓▓▓"╙╙╙╙╙╙╙╙""╙╙╙╙▒▒▒▒▓▓▌╢╣╢▓▓`);
    }, 19 * speedGap);
    setTimeout(() => {
        console.log(`            ▓▓▓▓▓▓▓▌               ▒▒▒▓▓▓▒╣╣╣▓▓`);
    }, 20 * speedGap);
    setTimeout(() => {
        console.log(`            ╟▓▓▓▓▓▓▓▓▓╣╢▒▒▒▒▒▒╥,╙▒▒▒▒▒▓▓▓╣╢╣╣▓▓`);
    }, 21 * speedGap);
    setTimeout(() => {
        console.log(`            ╟▓▓▓▓▓▓ ,g╣▒▒▒▒▒▒▒▒▒▒ ╙▒▒▒▓▓▓╢╢╢╢▓▓`);
    }, 22 * speedGap);
    setTimeout(() => {
        console.log(`            ╟▓▓▓▓▓▌j╣╣╣▒▒▒▒▒▒▒▒▒▒▒ ▒▒▓▓▓▓╢╢╢╢╣▓`);
    }, 23 * speedGap);
    setTimeout(() => {
        console.log(`            ╟▓▓▓▓▓▌ ▓╣▒▒▒▒▒▒▒▒▒▒▒^ ▒▒▓▓▓▓╣╢╢╢╢▓`);
    }, 24 * speedGap);
    setTimeout(() => {
        console.log(`            ╟▓▓▓▓▓▓╖  ╙╙╝╝╝╨╨╜╙   ╓▒▒▓▓▓▓▒╢╢╢╢▓`);
    }, 25 * speedGap);
    setTimeout(() => {
        console.log(`            ▐▓▓▓▓▓▓▓▓,          ,╥▒▒▒▓▓▓▓▌╢╢╣╢Γ`);
    }, 26 * speedGap);
    setTimeout(() => {
        console.log(`             ╙▓▓▓▓▓▓▓╢╢╣@@╗╗╥╥╢▒▒▒▒▒▒█▓▓▓▓▒▒▓"`);
    }, 27 * speedGap);
    setTimeout(() => {
        console.log(`                "▓▓▓▓╣╢╣▒▒▒▒▒▒▒▒▒▒▒▒▒▓█▀▀▀^`);
    }, 28 * speedGap);
    setTimeout(() => {
        console.log(`                   '^╜╜░░░^^^'^^^    ^`);
    }, 29 * speedGap);
    setTimeout(() => {
        console.log(
            `\x1b[31m%s\x1b[0m`,
            `

\`7MM"""Yb.     db           mm       \`7MM"""Yp,           mm
  MM    \`Yb.                MM         MM    Yb           MM
  MM     \`Mb \`7MM  .gP"Ya mmMMmm       MM    dP  ,pW"Wq.mmMMmm
  MM      MM   MM ,M'   Yb  MM         MM"""bg. 6W'   \`Wb MM
  MM     ,MP   MM 8M""""""  MM         MM    \`Y 8M     M8 MM
  MM    ,dP'   MM YM.    ,  MM         MM    ,9 YA.   ,A9 MM
.JMMmmmdP'   .JMML.\`Mbmmd'  \`Mbmo    .JMMmmmd9   \`Ybmd9'  \`Mbmo
`
        );
    }, 30 * speedGap);

    setTimeout(() => {
        console.log(`Logged in as ${bot.user.tag}!`);
    }, 31 * speedGap);

    setTimeout(() => {
        commandQueue.init();
    }, 31 * speedGap);
}
