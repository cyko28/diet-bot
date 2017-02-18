// Catcher's file
var Discord = require('discord.io');
var fs = require('fs');
var path = require('path');
var request = require('request');
var http = require('http');
var https = require('https');
var googleTTS = require('google-tts-api');
var urlParse  = require('url').parse;

var bot = new Discord.Client({
    autorun: true,
    token: "Mjc5ODc5Mzk4MzIzMjU3MzQ2.C4Q2eg.Ukfw9WowdfOL3q23UkpZgJ-XEBo"
});

var voiceChannelID = "169703393277902848";

bot.on('ready', function(event) {
    //log that you're in
    console.log('Logged in as %s - %s\n', bot.username, bot.id); 

	//find all users
	 userList = Object.keys(bot.users); 
	 
    //find all the channels
    channelList = Object.keys(bot.channels);
});

bot.on('message', function(user, userID, channelID, message, event) {
	var command = parseCommand(message);
	
	if(command != null && command.length > 0) {
	    voiceChannelID = findUserChannel(userID, channelList);
	    switch(command[0]) {
			case "!buttlord":
			    triggerButtlordCommand(voiceChannelID);
			break;
			case "!airhorn":
				parseAirhorn(voiceChannelID, command);
		    break;
			case "!join":
				joinChannel(voiceChannelID);
			break;
			case "!kick":
				bot.leaveVoiceChannel(voiceChannelID);
			break;
			case "!insult":
			    insultUserDirectly(userList, channelList, command);
			break;
			default:
				joinChannelSpeakAndLeave(voiceChannelID, "That is not a valid command.");
			break;
		}
	}
});

function parseAirhorn(voiceChannelID, command) {
	filePath = "audio/airhorn" + ((command[1] !== undefined)? "-" + command[1] : "") + ".mp3";
	joinChannelPlayAudioAndLeave(voiceChannelID, filePath);
}

function triggerButtlordCommand(voiceChannelParam) {
	var randomInt = Math.floor(Math.random()*9);
	if(randomInt >= 8) {
	    joinChannelSpeakAndLeave(voiceChannelParam, "I will not say Butt Lord anymore. I'm too sophisticated.");
	} else {
		joinChannelPlayAudioAndLeave(voiceChannelParam, 'audio/buttlord.mp3');
	}
}

function insultUserDirectly(userList, channelList, command) {
	var username = command[1];
	var userData = findUserId(username, userList);
	if(userData != null && userData.length > 0) {
		var userVoiceChannelId = findUserChannel(userData[0], channelList);
		joinChannelInsult(userData[1], userVoiceChannelId);
	} else {
	  console.log("could not find user " + username);
	}
}

function joinChannelInsult(username, voiceChannelParam) {
  var selectedCombo = Math.floor(Math.random()*4);
  var prefixText = username + ", you are a ";
  
  switch(selectedCombo) {
      case 0:
	    var insult = prefixText + insultA[Math.floor(Math.random()*insultA.length)] + " " + insultB[Math.floor(Math.random()*insultB.length)] + " " + insultC[Math.floor(Math.random()*insultC.length)];
		joinChannelSpeakAndLeave(voiceChannelParam, insult);
		break;
	  case 1:
	    var insult = prefixText + insultA[Math.floor(Math.random()*insultA.length)] + " " + insultB[Math.floor(Math.random()*insultB.length)] + " " + insultD[Math.floor(Math.random()*insultD.length)];
		joinChannelSpeakAndLeave(voiceChannelParam, insult);
		break;
	  case 2:
	    var insult = prefixText + insultA[Math.floor(Math.random()*insultA.length)] + " " + insultB[Math.floor(Math.random()*insultB.length)];
		joinChannelSpeakAndLeave(voiceChannelParam, insult);
		break;
	  case 3:
	    var insult = prefixText + insultB[Math.floor(Math.random()*insultB.length)] + " " + insultD[Math.floor(Math.random()*insultD.length)];
		joinChannelSpeakAndLeave(voiceChannelParam, insult);
		break;
	  default:
		break;
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
	fs.stat(audioFileLocation, function(err, stat) { 
	  if (err == null) { 
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
					bot.leaveVoiceChannel(voiceChannelParam);
					return console.error(error);	
				}
				
				 fs.createReadStream(audioFileLocation).pipe(stream, {end: false});
				
				//The stream fires `done` when it's got nothing else to send to Discord.
				stream.on('done', function() {
				   bot.leaveVoiceChannel(voiceChannelParam);
				});
			});
		});
	  } else if(err.code == 'ENOENT') {
        // file does not exist
	  }
	}); 
}

function joinChannelSpeakAndLeave(voiceChannelParam, text) {
    if(text.length <= 12) {
	    console.log(text + " cannot be spoken because it is too short.");
		return;
	}

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
				bot.leaveVoiceChannel(voiceChannelParam);
				return console.error(error);	
			}
			
			var audioFileName = speakToStream(text, stream, voiceChannelParam);
			
			//The stream fires `done` when it's got nothing else to send to Discord.
			stream.on('done', function() {
			   bot.leaveVoiceChannel(voiceChannelParam);

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
function speakToStream(text, stream, voiceChannelParam) {
	var fileName = getVoiceFilepath();		      // Generate a unique file name
	var dest = path.resolve(__dirname, fileName); // file destination
	
	googleTTS(text, 'En-gb', 0.9)   // speed normal = 1 (default), slow = 0.24. Create the URL via Google TTS API
	.then(function (url) {	
	  // Download the file, but wait 500 milliseconds before executing the voice stream to ensure the file is written (flaky but it works for now)
	  downloadFile(url, dest);
	  setTimeout(function() {
		  fs.createReadStream(fileName).pipe(stream, {end: false});
	  }, 500);
	})
	.catch(function (err) {
	  console.error(err.stack);
	  bot.leaveVoiceChannel(voiceChannelParam);
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


var insultA = 'tossing,bloody,shitting,wanking,stinky,raging,dementing,dumb,dipping,fucking,dipping,holy,maiming,cocking,ranting,twunting,hairy,spunking,flipping,slapping,sodding,blooming,frigging,sponglicking,guzzling,glistering,cock wielding,failed,artist formally known as,unborn,pulsating,naked,throbbing,lonely,failed,stale,spastic,senile,strangely shaped,virgin,bottled,twin-headed,fat,gigantic,sticky,prodigal,bald,bearded,horse-loving,spotty,spitting,dandy,fritzl-admiring,friend of a,indeterminable,overrated,fingerlicking,diaper-wearing,leg-humping,gold-digging,mong loving,trout-faced,cunt rotting,flip-flopping,rotting,inbred,badly drawn,undead,annoying,whoring,leaking,dripping,racist,slutty,cross-eyed,irrelevant,mental,rotating,scurvy looking,rambling,gag sacking,cunting,wrinkled old,dried out,sodding,funky,silly,unhuman,bloated,wanktastic,bum-banging,cockmunching,animal-fondling,stillborn,scruffy-looking,hard-rubbing,rectal,glorious,eye-less,constipated,bastardized,utter,hitler\'s personal,irredeemable,complete,enormous,go suck a,fuckfaced,broadfaced,titless,son of a,demonizing,pigfaced,treacherous,retarded'.split(',');
var insultB = 'cock,tit,cunt,wank,piss,crap,shit,arse,sperm,nipple,anus,colon,shaft,dick,poop,semen,slut,suck,earwax,fart,scrotum,cock-tip,tea-bag,jizz,cockstorm,bunghole,food trough,bum,butt,shitface,ass,nut,ginger,llama,tramp,fudge,vomit,cum,lard,puke,sphincter,nerf,turd,cocksplurt,cockthistle,dickwhistle,gloryhole,gaylord,spazz,nutsack,fuck,spunk,shitshark,shitehawk,fuckwit,dipstick,asswad,chesticle,clusterfuck,douchewaffle,retard'.split(',');
var insultC = 'force,bottom,hole,goatse,testicle,balls,bucket,biscuit,stain,boy,flaps,erection,mange,twat,twunt,mong,spack,diarrhea,sod,excrement,faggot,pirate,asswipe,sock,sack,barrel,head,zombie,alien,minge,candle,torch,pipe,bint,jockey,udder,pig,dog,cockroach,worm,MILF,sample,infidel,spunk-bubble,stack,handle,badger,wagon,bandit,lord,bogle,bollock,tranny,knob,nugget,king,hole,kid,trailer,lorry,whale,rag,foot'.split(',');
var insultD = 'licker,raper,lover,shiner,blender,fucker,assjacker,butler,packer,rider,wanker,sucker,felcher,wiper,experiment,wiper,bender,dictator,basher,piper,slapper,fondler,plonker,bastard,handler,herder,fan,amputee,extractor,professor,graduate,voyeur'.split(',');