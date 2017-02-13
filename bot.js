const Discord = require("discord.js");
const bot = new Discord.Client();
const prefix = "/";
const fs = require("fs");
const filename = "./config_n.json";
const file = require(filename);
const yt = require("ytdl-core");
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Suzumi > '
});

/*const objn = ("./gamble.json");
var obj = require(objn);**/
/*var players = [];
var playerid = [];**/
let queue = {};
let tokens = {
  "prefix" : "/",
  "passes" : 1,
  "speak": 148577578146332672
};

const commands = {"play": (msg) => {
  if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with ${tokens.prefix}add`);
  if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
  if (queue[msg.guild.id].playing) return msg.channel.sendMessage("Already Playing");
  let dispatcher;
  queue[msg.guild.id].playing = true;

  console.log(queue);
  (function play(song) {
    console.log(song);
    if (song === undefined) return msg.channel.sendMessage("Queue is empty").then(() => {
      queue[msg.guild.id].playing = false;
      msg.member.voiceChannel.leave();
    });
    msg.channel.sendMessage(`Playing: **${song.title}** as requested by: **${song.requester}**`);
    dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : tokens.passes });
    let collector = msg.channel.createCollector(m => m);
    collector.on('message', m => {
      if (m.content.startsWith(tokens.prefix + 'pause')) {

msg.channel.sendMessage('It\'s pretty fun; why\'d you pause that..?').then(() => {
  dispatcher.pause();
});
      } else if (m.content.startsWith(tokens.prefix + 'resume')){
msg.channel.sendMessage('owo)').then(() => {
  dispatcher.resume();
});
      } else if (m.content.startsWith(tokens.prefix + 'skip')){
msg.channel.sendMessage('Skipped').then(() => {
  dispatcher.end();
});
      } else if (m.content.startsWith('/volume')){
        // dispatcher volume * 50 : Actaul value

        let args = m.content.split(' ').slice(1);
        if (args[0] < 101){
dispatcher.setVolume(Math.min((args[0])/50));
msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
} else {
  msg.channel.sendMessage("IT'S TOO LOUDDD!! (Please don't go overboard with this command -w-)");
}
      }
       else if (m.content.startsWith(tokens.prefix + 'time')){
msg.channel.sendMessage(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
      }
    });
    dispatcher.on('end', () => {
      collector.stop();
      queue[msg.guild.id].songs.shift();
      play(queue[msg.guild.id].songs[0]);
    });
    dispatcher.on('error', (err) => {
      return msg.channel.sendMessage('error: ' + err).then(() => {
collector.stop();
queue[msg.guild.id].songs.shift();
play(queue[msg.guild.id].songs[0]);
      });
    });
  })(queue[msg.guild.id].songs[0]);
},
'join': (msg) => {
  return new Promise((resolve, reject) => {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('I couldn\'t connect to your voice channel...');
    voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
  });
},
'add': (msg) => {
  try{
  let url = msg.content.split(' ')[1];
  if (url == '' || url === undefined) return msg.channel.sendMessage(`You must add a url, or youtube video id after ${tokens.prefix}add`);
  yt.getInfo(url, (err, info) => {
    if(err) return msg.channel.sendMessage('Invalid YouTube Link: ' + err);
    if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
    queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
    msg.channel.sendMessage(`Added **${info.title}** to the queue. Anything else?`);
  });
}catch(e){
  console.log(e);
  msg.channel.sendMessage("That's an invalid YouTube link. Please try again.");
}
},
'queue': (msg) => {
  if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with ${tokens.prefix}add`);
  let tosend = [];
  queue[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
  msg.channel.sendMessage(`__**${msg.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
},
'help': (msg) => {
  msg.channel.sendMessage(` \`\`\`xl
THE FOLLOWING COMMAND IS FOR THE VOICE CHAT COMMANDS

/join : "Join Voice channel of msg sender"
/add : "Add a valid youtube link to the queue"
/queue : "Shows the current queue, up to 15 songs shown."
/play : "Play the music queue if already joined to a voice channel"

THE FOLLOWING COMMANDS ONLY FUNCTION WHILE THE PLAY COMMAND IS RUNNING:

/pause : "Pauses the music"
/resume : "Resumes the music"
/skip : "Skips the playing song"
/time : "Shows the playtime of the song."
/volume : "Adjust the intensity of the song."

THE FOLLOWING COMMAND IS NOT RELATED TO THE VOICE CHAT COMMANDS:

/color : "Color your name to perfection."
/remove : "Wash away your color on command."
/d : "Pray to RNGsus here."  \`\`\``);
},
'reboot': (msg) => {
  if (msg.author.id == tokens.adminID) process.exit(); //Requires a node module like Forever to work.
},
'color' : (msg) => {
  var args = msg.content.split(" ").slice(1);
  let col = args[0];
  if (col == null) {
    msg.channel.sendMessage("\*grabs paint bucket + brush\*");
    setTimeout(function(){
      msg.channel.sendMessage("If you want to make me paint your name, type [/color] followed by the color you want.");
      setTimeout(function(){
msg.channel.sendMessage(`The list of the paint I got is the following:
  \`\`\`xl
  "red"
  'darkred'
  'salmon'
  "orange"
  "brown"
  'peach'
  "yellow"
  "khaki"
  "viridian"
  "olive"
  "green"
  "darkgreen"
  'lightgreen'
  "turquoise"
  "seagreen"
  'aquamarine'
  "cyan"
  "teal"
  'lightcyan'
  "sky"
  "navy"
  'lightsky'
  "blue"
  "darkblue"
  'lightblue'
  "purple"
  "indigo"
  'lightpurple'
  "pink"
  "darkmagenta"
  'lightpink'
  "magenta"
  "maroon"
  'fuchsia'
  "black"
  'gray/grey'      \`\`\`    `);
      },3000);
    },2000);
  } else {
  try{
  let colre = col.toLowerCase();
let colvar = parseInt((file[colre]["value"]), 16);
  msg.member.roles.filter( (role) => {
    if(role.name.startsWith("c_")){
      msg.member.removeRole(role);
    }});
    console.log(`${msg.author.username}`);
    console.log(col);
    console.log(colre);
    console.log(colvar);
      if(msg.guild.roles.exists('name', `c_${colre}`))
      msg.guild.roles.filter( role => {
if(role.name.startsWith(`c_${colre}`)){
  msg.member.addRole(role).then( () => {msg.channel.sendMessage("Your name is now painted! Fancy, huh?");});
}
      });
      else {
  msg.guild.createRole({
      name : "c_" + colre,
      color : `${colvar}`,
      postition : 1,
      permissions: [
        "CREATE_INSTANT_INVITE",
        "ADD_REACTIONS", // add reactions to messages
        "READ_MESSAGES",
        "SEND_MESSAGES",
        "CONNECT", // connect to voice
        "SPEAK", // speak on voice
        "CHANGE_NICKNAME"
      ]
    }).then(role => msg.member.addRole(role).then( () => msg.channel.sendMessage("Your name is now painted with a fresh batch of color! Fancy, huh?")));
}
} catch (e) {
    if (e != "TypeError: msg.guild.roles.filter(...).then is not a function"){
      msg.channel.sendMessage(`Someone stole my color buckets ;w; So here's the list of the paint I got right now:
\`\`\`xl
"red"
'darkred'
'salmon'
"orange"
"brown"
'peach'
"yellow"
"khaki"
"viridian"
"olive"
"green"
"darkgreen"
'lightgreen'
"turquoise"
"seagreen"
'aquamarine'
"cyan"
"teal"
'lightcyan'
"sky"
"navy"
'lightsky'
"blue"
"darkblue"
'lightblue'
"purple"
"indigo"
'lightpurple'
"pink"
"darkmagenta"
'lightpink'
"magenta"
"maroon"
'fuchsia'
"black"
'gray/grey'\`\`\`    `);
  }
}
}
},
'remove' : (msg) => {
  msg.member.roles.filter( (role) => {
    if(role.name.startsWith("c_")){
      msg.member.removeRole(role);
      let rep = ["That's pretty tricky washing that off. Turns out it needed more than just water...",
    "Let's just say it's sticky. Anyways, it's done",
    "It smells...weird...but anyways!"];
    let i = randomInt(0, (rep.length-1));

      msg.reply(rep[i]);
}});
},
'colour' : (msg) => {
  var args = msg.content.split(" ").slice(1);
  let col = args[0];
  if (col == null) {
    msg.channel.sendMessage("\*grabs paint bucket + brush\*");
    setTimeout(function(){
      msg.channel.sendMessage("If you want to make me paint your name, type [/color] followed by the color you want.");
      setTimeout(function(){
msg.channel.sendMessage(`The list of the paint I got is the following:
  \`\`\`xl
  "red"
  'darkred'
  'salmon'
  "orange"
  "brown"
  'peach'
  "yellow"
  "khaki"
  "viridian"
  "olive"
  "green"
  "darkgreen"
  'lightgreen'
  "turquoise"
  "seagreen"
  'aquamarine'
  "cyan"
  "teal"
  'lightcyan'
  "sky"
  "navy"
  'lightsky'
  "blue"
  "darkblue"
  'lightblue'
  "purple"
  "indigo"
  'lightpurple'
  "pink"
  "darkmagenta"
  'lightpink'
  "magenta"
  "maroon"
  'fuchsia'
  "black"
  'gray/grey'      \`\`\`    `);
      },3000);
    },2000);
  } else {
  try{
  let colre = col.toLowerCase();
let colvar = parseInt((file[colre]["value"]), 16);
  msg.member.roles.filter( (role) => {
    if(role.name.startsWith("c_")){
      msg.member.removeRole(role);
    }});
    console.log(`${msg.author.username}`);
    console.log(col);
    console.log(colre);
    console.log(colvar);
      if(msg.guild.roles.exists('name', `c_${colre}`))
      msg.guild.roles.filter( role => {
if(role.name.startsWith(`c_${colre}`)){
  msg.member.addRole(role).then( () => {msg.channel.sendMessage("Your name is now painted! Fancy, huh?");});
}
      });
      else {
  msg.guild.createRole({
      name : "c_" + colre,
      color : `${colvar}`,
      postition : 1,
      permissions: [
        "CREATE_INSTANT_INVITE",
        "ADD_REACTIONS", // add reactions to messages
        "READ_MESSAGES",
        "SEND_MESSAGES",
        "CONNECT", // connect to voice
        "SPEAK", // speak on voice
        "CHANGE_NICKNAME"
      ]
    }).then(role => msg.member.addRole(role).then( () => msg.channel.sendMessage("Your name is now painted with a fresh batch of color! Fancy, huh?")));
}
} catch (e) {
    if (e != "TypeError: msg.guild.roles.filter(...).then is not a function"){
      msg.channel.sendMessage(`Someone stole my color buckets ;w; So here's the list of the paint I got right now:
\`\`\`xl
"red"
'darkred'
'salmon'
"orange"
"brown"
'peach'
"yellow"
"khaki"
"viridian"
"olive"
"green"
"darkgreen"
'lightgreen'
"turquoise"
"seagreen"
'aquamarine'
"cyan"
"teal"
'lightcyan'
"sky"
"navy"
'lightsky'
"blue"
"darkblue"
'lightblue'
"purple"
"indigo"
'lightpurple'
"pink"
"darkmagenta"
'lightpink'
"magenta"
"maroon"
'fuchsia'
"black"
'gray/grey'\`\`\`    `);
  }
}
}
},

'd' : (msg) => {
  let args = msg.content.split(" ").slice(1);
  let d = args[0];
  let check = isInt(d);
  let ins = ["Is that \*\*really\*\* a \*\*\*REAL\*\*\* number?", "How am I supposed to do that!? B-Baka...",  "Having fun?", "Totally doable.", "Legit 100\%", "I'll stab you if you do it again, I swear."];
  if (d == null){
    msg.channel.sendMessage("Feelin' lucky? Type /d followed by a number and see what happens.");
  } else {
    if (check === true){
  let num = Math.floor(Math.random() * (d - 1) + 1);
  let per = Math.floor((num / d) * 100);
  let lo = ["Xeno a? What have you done?!", "Bless RNG.", "Pathetic.", "Xeno a, stop messing with it!"];
  if (per > 30){

  msg.channel.sendMessage("You rolled a " + num + ". How was it?");
} else if (per <= 30 ) {
  msg.channel.sendMessage("You rolled a " + num + ". Uh...");
  setTimeout(function(){
    let num = Math.floor(Math.random() * (lo.length - 1) + 1);
    msg.channel.sendMessage(lo[num]);
  }, 2000);
}
} else if (d != "Xeno") {
  let num = Math.floor(Math.random() * (ins.length - 1) + 1);
  msg.channel.sendMessage(ins[num]);
} else if ((d == "Xeno") && ((args[1] == "a") || args[1] == "A")){
  msg.channel.sendMessage("Calling out to the god of RNG themselves isn't going to give you any good.");
}
}
},
'eval' : (msg) => {
  if (msg.author.id !== ('197733648403791872')) return msg.channel.sendMessage("I won't let anyone except my master to use this...\n(To prevent unauthorized shutdown, this command is locked to Yuugen only.)");
  let args = msg.content.split(" ").slice(1);
  var arr = [];
  for (let i = 0; i < args.length; i++) arr.push(args[i]);

try{
    let res = eval(arr.join(" "));
    msg.channel.sendMessage(res);
} catch (e) {
msg.reply(e);
}
},

'say' : (msg) => {

  msg.delete();
  let args = msg.content.split(" ").slice(1);

  msg.channel.sendMessage(`${msg.author.username} >> ${args.join(" ")}`);
},
 'math' : (msg) => {
   let π = Math.PI;
   let args = msg.content.split(" ").slice(1);
   var arr = [];
   for (let i = 0; i < args.length; i++) arr.push(args[i]);

 try{
     let res = eval(arr.join(" "));
     msg.channel.sendMessage(res);
 } catch (e) {
 msg.reply(e);
 }
 function sin(i) {
   return Math.sin(i);
 }
 function cos(i) {
   return Math.cos(i);
 }
 function tan(i) {
   return Math.tan(i);
 }
 function cosec(i) {
   return 1 / Math.sin(i);
 }
 function sec(i) {
   return 1 / Math.cos(i);
 }
 function cot(i) {
   return 1 / Math.tan(i);
 }
 function sqrt(i){
   if (i >= 0) return Math.sqrt(i);
   if ((i < 0)&&(i != -1)) return (Math.sqrt(0-i) + "i");
   if (i == -1) return "i";
 }

 },
/*'blackjack' : (msg) => {
  var gameon = false;
  var cards = ['A♠','2♠','3♠','4♠','5♠','6♠','7♠','8♠','9♠','10♠','J♠','Q♠','K♠',
  'A♥','2♥','3♥','4♥','5♥','6♥','7♥','8♥','9♥','10♥','J♥','Q♥','K♥',
  'A♣','2♣','3♣','4♣','5♣','6♣','7♣','8♣','9♣','10♣','J♣','Q♣','K♣',
  'A♦','2♦','3♦','4♦','5♦','6♦','7♦','8♦','9♦','10♦','J♦','Q♦','K♦',
];
if (msg.author.nickname === undefined)
msg.channel.sendMessage(`Game loading...this game will be **${msg.author.username}** against the bot`);
else if (!msg.author.nickname === undefined)
msg.channel.sendMessage(`Game loading...this game will be **${msg.author.username}**(${msg.author.nickname}) against the bot`);
msg.channel.sendMessage("Game not ready yet; sorry!");
}, **/
'send' : (msg) => {
  msg.delete();
  if (msg.author.id !== ('197733648403791872')) return;
  let args = msg.content.split("|").slice(1);
  let ev = args[0];
  msg.channel.sendMessage(ev);
},
/* 'roulette' : (msg) => {
  const table = ['0','00',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,
33,34,35,36];
  const single = ['0','00',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,
33,34,35,36];
	const pair = ['0-00','0-1','0-2','00-2','00-3','1-2','1-4','2-3','2-5','3-6',
	'4-5','4-7','5-6','5-8','6-9', // 4 5 6
	'7-8','7-10','8-9','8-11','9-12', // 7 8 9
	'10-11','10-13','11-12','11-14','12-15', // 10 11 12
	'13-14','13-16','14-15','14-17','15-18', // 13 14 15
	'16-17','16-19','17-18','17-20','18-21', // 16 17 18
	'19-20','19-22','20-21','20-23','21-24', // 19 20 21
	'22-23','22-25','23-24','23-26','24-27', // 22 23 24
	'25-26','25-28','26-27','26-29','27-30',
	'28-29','28-31','29-30','29-32','30-33',
	'31-32','31-34','32-33','32-35','33-36'
	];
	const tri = ['0-1-2','00-2-3'];
	const quart = ['1-2-4-5','2-3-5-6','4-5-7-8','5-6-8-9','7-8-10-11','8-9-11-12',
	'10-11-13-14','14-15-17-18','16-17-19-20','17-18-20-21','19-20-22-23',
	'20-21-23-24','22-23-25-26','23-24-26-27','25-26-28-29','26-27-29-30',
	'28-29-31-32','29-30-32-33','31-32-34-35','32-33-35-36'
	];
	const firsttwelve = [1,2,3,4,5,6,7,8,9,10,11,12];
	const midtwelve = [13,14,15,16,17,18,19,20,21,22,23,24];
	const lasttwelve = [25,26,27,28,29,30,31,32,33,34,35,36];
	const red = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
	const black = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
	const bottomrow =[1,4,7,10,13,16,19,22,25,28,31,34];
	const midrow = [2,5,8,11,14,17,20,23,26,29,32,35];
	const toprow = [3,6,9,12,15,18,21,24,27,30,33,36];
	// END ROULETTE POSSIBILITIES DECLARATION

	/* Steps on executing the command will be:
	 - if not keywords :
	 - check single
	 - check pair
	 - check triple
	 - check quart
	 - else check keywords
	 **/

  /* const rcommands = {
    'help' : (msg) => {
      const helpembed = new Discord.RichEmbed()
      .setAuthor("The gamemaster says...")
      .setTitle("Help commands: ")
      .setColor(0x66d3d3)
	.setImage('http://bwcpublishing.com/ebayphotos/poker/table.jpg')
      .setTimestamp()
      .addField("Field test", "Field Desc. Test");
      msg.channel.sendEmbed(
    helpembed,
  { disableEveryone: true }
);
  },
  'bet' : (msg) => {
	let args = msg.content.split(" ").slice(1);
	let bet = args[0];

  }
  };
// END COMMAND DECLARATION
// STARTING COMMAND EXECUTION SECTOR
  msg.channel.sendMessage(`This round's player will be ${msg.author.username}. Please place your bet. Type /r help for infos on betting.`);
  let collector = msg.channel.createCollector(
    m => m.content.startsWith("/r")
  );
  collector.on('message', m =>{

    if(rcommands[m.content.split("/r ").slice(1)]){
      rcommands[m.content.toLowerCase().split("/r ").slice(1)[0]](m);
    }

});

  },
    'bet' : (msg) => {
    } **/
};


bot.on("message", msg => {
  if(!msg.content.startsWith(prefix)) return;

  if (commands.hasOwnProperty(msg.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0]](msg);

});





bot.on('ready', () =>{
  console.log("ready");
  console.log("/switch 148577578146332672");
  // /switch 148577578146332672
  rl.setPrompt('Suzumi> ');
  rl.prompt();
  rl.on('line', (input) => {
    if (input === 'rs') return;
    if (input.startsWith("/switch")){
      tokens.speak = input.split("/switch ").slice(1)[0];
      console.log("Speaking at " + tokens.speak);
  } else {
    try {
    bot.channels.get(`${tokens['speak']}`).sendMessage(`${input}`);
  } catch(e) {
    console.log(e);
  }
  }

    rl.prompt();

});
});
bot.login("MjY4NzgwODQ1OTg3Mzk3NjQy.C1fxMA.wRDQDEGSFBLRvALnelqnZszg2PU");

function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
}
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
