// Catcher's file
var Discord = require('discord.io');
var fs = require('fs');
var path = require('path');
var request = require('request');
var http = require('http');
var https = require('https');
var googleTTS = require('google-tts-api');
var urlParse  = require('url').parse;
var latestTweets = require('latest-tweets');


var bot = new Discord.Client({
    autorun: true,
    token: "Mjc5ODc5Mzk4MzIzMjU3MzQ2.C4BW3Q.uzwb7aUX467ifmjRh_ZYoXQ9fJM"
});

var voiceChannelID = "169703393277902848";

bot.on('ready', function(event) {
    //log that you're in
    console.log('Logged in as %s - %s\n', bot.username, bot.id);

	//find all users
	 userList = Object.keys(bot.users);

    //find all the channels
    channelList = Object.keys(bot.channels);

	bot.setPresence({
		game:{
			name:"Bigly Wigly"
		}
	});
});

// Init Command Queue Object
var commandQueue = {
  queue: [],
  amount: {
    current: 0,
    previous: 0
  }
};

bot.on('message', function(user, userID, channelID, message, event) {
    commandQueue.queue.push({user, userID, channelID, message, event});
    console.log('New Message:',message);
	});

function checkQueue() {
  // If Queue is not empty
  if (commandQueue.queue.length > 0) {
    // Track Previous amout to prevent redundant console.logs
    commandQueue.amount.current = commandQueue.queue.length;

    // If theres a change, log it to console
    if (commandQueue.amount.current !== commandQueue.amount.previous) {
      // Log CQ Length
      console.log('\nCommand Queue Backlog:', commandQueue.queue.length);

      // Log out each item in the CQ
      for (i=0; i<commandQueue.queue.length; i++) console.log(commandQueue.queue[i].message);

      // Set new previous amount
      commandQueue.amount.previous = commandQueue.amount.current;
    }
  }
}

setInterval(checkQueue, 500);
