/*jshint esversion: 6 */

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

// Pretty ASCII boot screen
fs.readFile('dietbot-ascii.txt', function(data) {console.log(data);});

// Init Command Queue Object
var cQ = {
  queue: [],
  ready: true,
  amount: {
    current: 0,
    previous: 0
  }
};

bot.on('ready', function(event) {
  //log that you're in
  console.log('Logged in as %s - %s\n', bot.username, bot.id);

	//find all users
	userList = Object.keys(bot.users);

  //find all the channels
  channelList = Object.keys(bot.channels);

	this.setPresence({
		game:{
			name:"Bigly Wigly"
		}
	});
});

bot.on('message', function(user, userID, channelID, message, event) {
    cQ.queue.push({user, userID, channelID, message, event});
    console.log('New Message:',message);
	});

function checkQueue() {
  // If Queue is not empty
  if (cQ.queue.length > 0) {
    // Track Previous amout to prevent redundant console.logs
    cQ.amount.current = cQ.queue.length;

    // If theres a change, log it to console
    if (cQ.amount.current !== cQ.amount.previous) {
      // Log CQ Length
      console.log('\nCommand Queue Backlog:', cQ.queue.length);

      // Log out each item in the CQ
      for (i=0; i<cQ.queue.length; i++) console.log(cQ.queue[i].message);

      // Set new previous amount
      cQ.amount.previous = cQ.amount.current;
    }
    if (cQ.ready) {
      let userChannel = findUserChannel(cQ.queue[0].userID, channelList);
      joinChannelPlayAudioAndLeave(userChannel, 'audio/buttlord.mp3');
      cQ.queue.shift();
    }
  }
}

setInterval(checkQueue, 500);

function findUserChannel(userID, channelList) {
	for(i = 0; i < channelList.length; i++) {
		if (bot.channels[channelList[i]].members[userID] !== undefined) {
			return bot.channels[channelList[i]].members[userID].channel_id;
		}
	}
}

function joinChannelPlayAudioAndLeave(voiceChannel, audioFileLocation) {
  cQ.ready = false;
	fs.stat(audioFileLocation, function(err, stat) {
	  if (err == null) {

    //Let's join the voice channel, the ID is whatever your voice channel's ID is.
		bot.joinVoiceChannel(voiceChannel, function(error, events) {
			//Check to see if any errors happen while joining.
			if (error) {
				bot.leaveVoiceChannel(voiceChannel, checkQueue);
				return console.error(error);
			}

			//Then get the audio context
			bot.getAudioContext(voiceChannel, function(error, stream) {
				//Once again, check to see if any errors exist
				if (error) {
					bot.leaveVoiceChannel(voiceChannel, checkQueue);
					return console.error(error);
				}

				fs.createReadStream(audioFileLocation).pipe(stream, {end: false});

				//The stream fires `done` when it's got nothing else to send to Discord.
				stream.on('done', function() {
				   bot.leaveVoiceChannel(voiceChannel, checkQueue);
           setTimeout(function(){cQ.ready = true;},750);
           console.log('Bot Left Voice Channel');
				});
			});
		});
	  } else if(err.code == 'ENOENT') {
        // file does not exist
	  }
	});
}
