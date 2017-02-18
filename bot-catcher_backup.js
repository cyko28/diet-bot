// Catcher's file
var Discord = require('discord.io');
var fs = require('fs');
var request = require('request');
var http = require('http');
var unirest = require('unirest');
var googleTTS = require('google-tts-api');

var bot = new Discord.Client({
    autorun: true,
    token: "Mjc5ODc5Mzk4MzIzMjU3MzQ2.C4BW3Q.uzwb7aUX467ifmjRh_ZYoXQ9fJM"
});

var voiceChannelID = "169703393277902848";

bot.on('ready', function(event) {
    //log that you're in
    console.log('Logged in as %s - %s\n', bot.username, bot.id); 

    //find all the channels
    channelList = Object.keys(bot.channels);
});

bot.on('message', function(user, userID, channelID, message, event) {
    if (message === "!a") {

		//figure out what channel the user is in
		voiceChannelID = findUserChannel(userID, channelList);
		
		
		

		//Let's join the voice channel, the ID is whatever your voice channel's ID is.
		bot.joinVoiceChannel(voiceChannelID, function(error, events) {
			//Check to see if any errors happen while joining.
			if (error) {
			    bot.leaveVoiceChannel(voiceChannelID);
			    return console.error(error);	
		    }
			
			
			//Then get the audio context
			bot.getAudioContext(voiceChannelID, function(error, stream) {
				//Once again, check to see if any errors exist
				if (error) {
					bot.leaveVoiceChannel(voiceChannelID);
					return console.error(error);	
				}
				googleTTS('Hello World', 'en', 1)
				
				//unirest.post('http://translate.google.com/translate_tts')
				//.headers({'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:19.0) Gecko/20100101 Firefox/19.0', "Accept-Charset": "ISO-8859-1", "Accept": "text/html,application/xhtml+xml,application/xml"})
				//.send({ "ie": "UTF-8", "total": "1", "textlen": "32", "client": "tw-ob", "q": "Butt+Lord", "tl": "En-gb", })
				//.end(function (response) {
			 //	  console.log(response.body);
			//	});
			
			    // request('http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q=Butt+Lord&tl=En-gb').pipe(stream, {end: false});
				
				//Create a stream to your file and pipe it to the stream
				//Without {end: false}, it would close up the stream, so make sure to include that.
				//fs.createReadStream('output.mp3').pipe(stream, {end: false});
				
				console.log(user + " played " + message);
				//The stream fires `done` when it's got nothing else to send to Discord.
				stream.on('done', function() {
				   bot.leaveVoiceChannel(voiceChannelID);
				});
			});
		});
    }
	
	if (message === "!airhorn") {

		//figure out what channel the user is in
		voiceChannelID = findUserChannel(userID, channelList);
		
		//Let's join the voice channel, the ID is whatever your voice channel's ID is.
		bot.joinVoiceChannel(voiceChannelID, function(error, events) {
			//Check to see if any errors happen while joining.
			if (error) {
			    bot.leaveVoiceChannel(voiceChannelID);
			    return console.error(error);	
		    }
			
			//Then get the audio context
			bot.getAudioContext(voiceChannelID, function(error, stream) {
				//Once again, check to see if any errors exist
				if (error) {
					bot.leaveVoiceChannel(voiceChannelID);
					return console.error(error);	
				}

				//Create a stream to your file and pipe it to the stream
				//Without {end: false}, it would close up the stream, so make sure to include that.
				request('https://vaasbox.acapela-box.com/MESSAGES/013099097112101108097066111120095086050/AcaBoX_Listen/sounds/145411564_e2e03d527eac3.mp3').pipe(stream, {end: false});
				console.log(user + " played " + message);
				//The stream fires `done` when it's got nothing else to send to Discord.
				stream.on('done', function() {
				   bot.leaveVoiceChannel(voiceChannelID);
				});
			});
		});
    }
});

//mallardi detector
bot.on('any', function(event) {
// if(userID === "256270969193103360") {
// console.log("found mallardi");
// console.log(event.d);
// }
});

function findUserChannel(userID, array) {
	for(i = 0; i < array.length; i++) {
		if (bot.channels[array[i]].members[userID] !== undefined) {
			return bot.channels[array[i]].members[userID].channel_id;
		}
	}
}



