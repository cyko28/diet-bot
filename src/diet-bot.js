require('dotenv').config();

const Discord = require('discord.js');
const diet = new Discord.Client();

const Airhorn = require('./commands/airhorn/airhorn');
const airhorn = new Airhorn();

diet.login(process.env.API_KEY);

diet.on('ready', () => {
    console.log(`Logged in as ${diet.user.tag}!`);
});

diet.on('message', message => airhorn.playAirhorn(message));
