require('dotenv').config();

const Discord = require('discord.js');
const diet = new Discord.Client();

const CommandRunner = require('./services/command-runner.js');
const command = new CommandRunner({ path: './src/plugins/' });

const CommandParser = require('./services/command-parser');
const commandParser = new CommandParser(command);

diet.login(process.env.API_KEY);

diet.on('ready', () => init());

diet.on('message', message => commandParser.handle(message));

const init = () => {
    console.log(`Logged in as ${diet.user.tag}!`);
    command.addPlugins('airhorn');
};
