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
var cQ = {
  queue: [],
  ready: true,
  amount: {
    current: 0,
    previous: 0
  },
  makeReady: function() {
    setTimeout(function() {this.ready = true;},1000);
  }
};

bot.on('message', function(user, userID, channelID, message, event) {
    cQ.queue.push({user, userID, channelID, message, event});
    console.log('New Message:',message);
    checkQueue();
	});

// bot.on('any', function(event) {
//   console.log(event);
// });

// setInterval(function() {console.log(cQ.queue); console.log('Ready:', cQ.ready);}, 100);

function checkQueue() {
  // If not ready, try again in 250ms
  if (cQ.ready) {
    console.log('cq was ready');

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

      // Do a command
      readCommandQueue(cQ.queue);
      cQ.queue.shift();
    }
  } else {
    // If cQ not ready
    console.log(cQ.queue);
  }
}

function readCommandQueue(CQARRAY) {
  var user = CQARRAY[0].user;
  var userID = CQARRAY[0].userID;
  var channelID = CQARRAY[0].channelID;
  var message = CQARRAY[0].message;
  var event = CQARRAY[0].event;
	var command = parseCommand(message);
	if(command != null && command.length > 0) {
		voiceChannelID = findUserChannel(userID, channelList);
		switch(command[0]) {
			case "!help":
				showHelpInfo(channelID, command[1]);
			break;
			case "!buttlord":
			case "!b":
				triggerButtlordCommand(voiceChannelID);
			break;
			case "!airhorn":
			case "!audio":
			case "!a":
				parseAirhorn(channelID, voiceChannelID, command);
			break;
			case "!say":
			case "!s":
				say(voiceChannelID, command);
			break;
			case "!join":
			case "!j":
				joinChannel(voiceChannelID);
			break;
			case "!kick":
			case "!k":
				bot.leaveVoiceChannel(voiceChannelID);
			break;
			case "!insult":
			case "!i":
				insultUserDirectly(userList, channelList, command);
			break;
			case "!rave":
			case "!r":
				playRaveMusic(voiceChannelID);
			break;
			case "!trump":
			case "!t":
				playTrump(voiceChannelID);
			break;
			case "!trumptweet":
			case "!tt":
				showDonaldTrumpTweet(channelID);
			break;
			default:
			    botType(channelID, "That is not a valid command.");
			break;
		}
	}
}

function showDonaldTrumpTweet(channelID) {
	latestTweets('realDonaldTrump', function (err, tweets) {
	  var result = Math.floor(Math.random()*tweets.length);
	  var tweetContent = tweets[result].content;
	  botType(channelID, tweetContent);
	  console.log(tweets);
	})
}

function playRaveMusic(voiceChannelParam) {
	var randomInt = Math.floor(Math.random()*5);
	joinChannelPlayAudioAndLeave(voiceChannelParam, 'audio/rave/'+randomInt+'.mp3');
}

function playTrump(voiceChannelParam) {
	var randomInt = Math.floor(Math.random()*9);
	console.log('Playing trump clip', 'audio/trump/'+randomInt+'.mp3');
	joinChannelPlayAudioAndLeave(voiceChannelParam, 'audio/trump/'+randomInt+'.mp3');
}

function showHelpInfo(channelID, command) {
	if(command === "!a") {
		showAirhornCommands(channelID);
	}
}

function botType(channelID, messageToType) {
	bot.sendMessage({
		to: channelID,
		message: messageToType
	});
}

function showAirhornCommands(channelID) {
    var commands = "Available commands: \n";
	fs.readdir("./audio", (err, files) => {
	  files.forEach(file => {
		if(file.startsWith("airhorn-")) {
		  try {
			commands = commands.concat("!a ").concat(file.split('.')[0].substring(8)).concat("\n");
		  }catch(err) {}
		}
	  });
	});

	setTimeout(function() {
	try {
		botType(channelID, commands);
	}catch (e) {}
	}, 1000);

}

function say(voiceChannelID, command) {
    var whatToSay = "";
    for(var i=1; i<command.length; i++) {
		whatToSay+=command[i] + " ";
	}
	joinChannelAndSpeak(voiceChannelID, whatToSay, true, null);
}

function parseAirhorn(channelID, voiceChannelID, command) {
	filePath = "audio/airhorn" + ((command[1] !== undefined)? "-" + command[1] : "") + ".mp3";
	joinChannelPlayAudioAndLeave(voiceChannelID, filePath);
}

function triggerButtlordCommand(voiceChannelParam) {
	var randomInt = Math.floor(Math.random()*9);
	if(randomInt >= 8) {
	    joinChannelAndSpeak(voiceChannelParam, "I will not say Butt Lord anymore. I'm too sophisticated.", true, null);
	} else {
		joinChannelPlayAudioAndLeave(voiceChannelParam, 'audio/buttlord.mp3');
	}
}

function insultUserDirectly(userList, channelList, command) {
    if(command.length > 1) {
		var username = command[1];
		var userData = findUserId(username, userList);
		if(userData != null && userData.length > 0) {
			var userVoiceChannelId = findUserChannel(userData[0], channelList);
			joinChannelInsult(userData[1], userVoiceChannelId);
		} else {
		  console.log("could not find user " + username);
		}
	}
}

function joinChannelInsult(username, voiceChannelParam) {
    if(username === "Awod") {
        username = "eh whod";
    }

    var sayInsult = true;

    if(username === "catcherfreeman") {
	    var result = Math.floor(Math.random()*9);
		// give a complement 10% of the time
		if(result === 0) {
		    sayInsult = false;
		}
    }

    var prefixText = username + ", you are a ";

    if(sayInsult) {
	  var selectedCombo = Math.floor(Math.random()*4);
	  var insult;
	  switch(selectedCombo) {
		  case 0:
			insult = prefixText + insultA[Math.floor(Math.random()*insultA.length)] + " " + insultB[Math.floor(Math.random()*insultB.length)] + " " + insultC[Math.floor(Math.random()*insultC.length)] + " " + includeGetWrecked();
			break;
		  case 1:
			insult = prefixText + insultA[Math.floor(Math.random()*insultA.length)] + " " + insultB[Math.floor(Math.random()*insultB.length)] + " " + insultD[Math.floor(Math.random()*insultD.length)] + " " + includeGetWrecked();
			break;
		  case 2:
			insult = prefixText + insultA[Math.floor(Math.random()*insultA.length)] + " " + insultB[Math.floor(Math.random()*insultB.length)] + " " + includeGetWrecked();
			break;
		  case 3:
			insult = prefixText + insultB[Math.floor(Math.random()*insultB.length)] + " " + insultD[Math.floor(Math.random()*insultD.length)] + " " + includeGetWrecked();
			break;
		  default:
			break;
	  }
	  joinChannelAndSpeak(voiceChannelParam, insult, true, null);
    } else {
	  var selectedCombo = Math.floor(Math.random()*2);

	  var complement;
	  switch(selectedCombo) {
	    case 0:
		  complement = prefixText + complementA[Math.floor(Math.random()*complementA.length)] + " " + complementB[Math.floor(Math.random()*complementB.length)] + " " + complementC[Math.floor(Math.random()*complementC.length)] + " " + includeGetWrecked();
		  break;
		case 1:
		  complement = prefixText + complementA[Math.floor(Math.random()*complementA.length)] + " " + complementC[Math.floor(Math.random()*complementC.length)] + " " + includeGetWrecked();
		  break;
		default:
		  break;
	  }
	  joinChannelAndSpeak(voiceChannelParam, complement, true, null);
	}

}

function includeGetWrecked(){
    var randomInt = Math.floor(Math.random()*9);
	if(randomInt == 8) {
	    return ". Get wrecked.";
	} else {
	    return "";
	}
}

function findUserChannel(userID, array) {
	for(i = 0; i < array.length; i++) {
		if (bot.channels[array[i]].members[userID] !== undefined) {
			return bot.channels[array[i]].members[userID].channel_id;
		}
	}
}

function findUserId(username, array) {
    var usernameToSearch = username.toLowerCase();
	for(i = 0; i < array.length; i++) {
	   if(bot.users[array[i]].username.toLowerCase().startsWith(usernameToSearch)) {
	       return [bot.users[array[i]].id, bot.users[array[i]].username];
	   }
	}
	return [];
}

function joinChannel(voiceChannelParam) {
    bot.joinVoiceChannel(voiceChannelParam);
}

function joinChannelPlayAudioAndLeave(voiceChannelParam, audioFileLocation) {
  cQ.ready = false;
	fs.stat(audioFileLocation, function(err, stat) {
	  if (err == null) {
		//Let's join the voice channel, the ID is whatever your voice channel's ID is.
		bot.joinVoiceChannel(voiceChannelParam, function(error, events) {
			//Check to see if any errors happen while joining.
			if (error) {
				bot.leaveVoiceChannel(voiceChannelParam, checkQueue);
				return console.error(error);
			}

			//Then get the audio context
			bot.getAudioContext(voiceChannelParam, function(error, stream) {
				//Once again, check to see if any errors exist
				if (error) {
					bot.leaveVoiceChannel(voiceChannelParam, checkQueue);
					return console.error(error);
				}

				 fs.createReadStream(audioFileLocation).pipe(stream, {end: false});

				//The stream fires `done` when it's got nothing else to send to Discord.
				stream.on('done', function() {
				   bot.leaveVoiceChannel(voiceChannelParam, checkQueue);
           setTimeout(function() {cQ.ready=true;},100);
           console.log('bot left');
				});
			});
		});
	  } else if(err.code == 'ENOENT') {
        // file does not exist
	  }
	});
}

function joinChannelAndSpeak(voiceChannelParam, text, leaveAfter, soundToPlayFollowingText) {
	//Let's join the voice channel, the ID is whatever your voice channel's ID is.
	bot.joinVoiceChannel(voiceChannelParam, function(error, events) {
		//Check to see if any errors happen while joining.
		if (error) {
			bot.leaveVoiceChannel(voiceChannelParam);
			return console.error(error);
		}

		//Then get the audio context
		bot.getAudioContext(voiceChannelParam, function(error, stream) {
			//Once again, check to see if any errors exist
			if (error) {
				bot.leaveVoiceChannel(voiceChannelParam, checkQueue);
				return console.error(error);
			}

			if(text.length <= 12) {
				text = "You haven't given me enough to say.";
			}

			var audioFileName = speakToStream(text, stream, voiceChannelParam, soundToPlayFollowingText);

			//The stream fires `done` when it's got nothing else to send to Discord.
			stream.on('done', function() {
			   if(leaveAfter) {
			       bot.leaveVoiceChannel(voiceChannelParam, checkQueue);
             setTimeout(function() {cQ.ready=true;},100);
			   }

			  // Delete the file after 1 second
			  setTimeout(function() {
			  try {
				  fs.unlinkSync(audioFileName);
			  }catch (e) {/* For some reason an error throws after a file deletes, ignore it */ }
			  }, 1000);
			});
		});
	});
}

/**
This function creates the Google translate URL, downloads the MP3 and outputs it to the stream object.
**/
function speakToStream(text, stream, voiceChannelParam, soundToPlayFollowingText) {
	var fileName = getVoiceFilepath();		      // Generate a unique file name
	var dest = path.resolve(__dirname, fileName); // file destination

	googleTTS(text, 'En-gb', 0.9)   // speed normal = 1 (default), slow = 0.24. Create the URL via Google TTS API
	.then(function (url) {
	  // Download the file, but wait 500 milliseconds before executing the voice stream to ensure the file is written (flaky but it works for now)
	  downloadFile(url, dest);
	  setTimeout(function() {
		  fs.createReadStream(fileName).pipe(stream, {end: false});
		  if(soundToPlayFollowingText != null) {
			fs.createReadStream(soundToPlayFollowingText).pipe(stream, {end: false});
		  }
	  }, 500);
	})
	.catch(function (err) {
	  console.error(err.stack);
	  bot.leaveVoiceChannel(voiceChannelParam, checkQueue);
	});
	return fileName;
}

function downloadFile (url, dest) {
  return new Promise((resolve, reject) => {
    const info = urlParse(url);
    const httpClient = info.protocol === 'https:' ? https : http;
    const options = {
      host: info.host,
      path: info.path,
      headers: {
        'user-agent': 'Windows NT 6.2; WOW64; rv:19.0) Gecko/20100101 Firefox/19.0'
      }
    };

    httpClient.get(options, function(res) {
      // check status code
      if (res.statusCode !== 200) {
        reject(new Error(`request to ${url} failed, status code = ${res.statusCode} (${res.statusMessage})`));
        return;
      }

      const file = fs.createWriteStream(dest);
      file.on('finish', function() {
        // close() is async, call resolve after close completes.
        file.close(resolve);
      });
      file.on('error', function (err) {
        // Delete the file async. (But we don't check the result)
        fs.unlink(dest);
        reject(err);
      });

      res.pipe(file);
    })
    .on('error', function(err) {
      reject(err);
    })
    .end();
  });
}

function getVoiceFilepath() {
  return "audio/" + new Date().getTime() + ".mp3";
}

function parseCommand(string) {
	if (string.substring(0,1) === "!") {
		//split on space
		string = string.split(" ");

		var c = 0; //counts how many array items there are
		var theArray = []; //the output array

		for (i = 0; i < string.length; i++) {
			// if has !, put into own array
			if (string[i].substring(0,1) === "!") {
				theArray[c++] = string[i];
			} else {
				//if undefined, make string
				if(theArray[c] === undefined) {
					theArray[c++] = string[i];
				} else {
					theArray[c++] += " " + string[i];
				}
				//rebuild string
			}
		}
		return(theArray);
	}
}


var complementA = 'beautiful,lovely,hard-working,wonderful,voluptuous'.split(',');
var complementB = 'life-giving,flower-like,'.split(',');
var complementC = 'person,angel,individual'.split(',');

var insultA = 'tossing,bloody,shitting,wanking,frothy,stinky,raging,dementing,dumb,fucking,dipping,holy,maiming,cocking,ranting,hairy,girthy,spunking,flipping,slapping,one-direction loving,trump loving,sodding,blooming,frigging,guzzling,glistering,cock wielding,failed,artist formally known as,unborn,pulsating,naked,throbbing,lonely,failed,stale,spastic,senile,strangely shaped,virgin,bottled,twin-headed,fat,gigantic,sticky,prodigal,bald,bearded,horse-loving,spotty,spitting,dandy,fritzl-admiring,friend of a,indeterminable,overrated,fingerlicking,diaper-wearing,leg-humping,gold-digging,mong loving,trout-faced,cunt rotting,flip-flopping,rotting,inbred,badly drawn,undead,annoying,whoring,leaking,dripping,racist,slutty,cross-eyed,irrelevant,mental,rotating,scurvy looking,rambling,gag sacking,cunting,wrinkled old,dried out,sodding,funky,silly,unhuman,bloated,wanktastic,bum-banging,cockmunching,animal-fondling,stillborn,scruffy-looking,hard-rubbing,rectal,glorious,eye-less,constipated,bastardized,utter,hitler\'s personal,irredeemable,complete,enormous,go suck a,fuckfaced,broadfaced,titless,son of a,demonizing,pigfaced,treacherous,retarded'.split(',');
var insultB = 'cock,tit,cunt,wank,piss,crap,shit,ass,sperm,nipple,anus,colon,shaft,dick,poop,semen,slut,suck,earwax,fart,scrotum,cock-tip,tea-bag,jizz,cockstorm,bunghole,food trough,bum,butt,shitface,ass,nut,ginger,llama,tramp,fudge,vomit,cum,lard,puke,sphincter,nerf,turd,cocksplurt,cockthistle,dickwhistle,gloryhole,gaylord,spazz,nutsack,fuck,spunk,shitshark,shithawk,fuckwit,dipstick,asswad,chesticle,clusterfuck,douchewaffle,retard'.split(',');
var insultC = 'force,bottom,hole,goatse,testicle,balls,bucket,biscuit,stain,boy,flaps,erection,mange,brony,weeaboo,twat,twunt,mong,spack,diarrhea,sod,excrement,faggot,pirate,asswipe,sock,sack,barrel,thunder cunt,head,zombie,alien,minge,candle,torch,pipe,bint,jockey,udder,pig,dog,cockroach,worm,MILF,sample,infidel,spunk-bubble,stack,handle,badger,wagon,bandit,lord,bogle,bollock,tranny,knob,nugget,king,hole,kid,trailer,lorry,whale,rag,foot'.split(',');
var insultD = 'licker,raper,lover,shiner,blender,fucker,assjacker,butler,turd-burglar,packer,rider,wanker,sucker,wiper,experiment,wiper,bender,dictator,basher,piper,slapper,fondler,bastard,handler,herder,fan,amputee,extractor,professor,graduate'.split(',');
