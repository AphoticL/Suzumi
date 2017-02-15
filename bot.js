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
var path = require('path');

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
/d : "Pray to RNGsus here."
/event: "New: Make your own sub-event!"  \`\`\``);
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
'event' : (msg) => {

  let test = msg.content.split(" ").slice(1);
  try{
  var Canvas = require('canvas')
    , Image = Canvas.Image
    , canvas = new Canvas(300, 40)
    , ctx = canvas.getContext('2d');

  var img;


  img = new Image;
  img.src = (__dirname + '/image/sub_event_waku_001.png');
  ctx.drawImage(img, 0, 0);


  ctx.fillStyle = 'white';
  ctx.font = '25px Impact';
  ctx.textAlign = "center";
  ctx.fillText(test.join(" "), (canvas.width / 2), ((canvas.height / 2)+10));
  //let ntest = test.join(" ");

/*  let size = ctx.measureText('fuk dis');


  ctx.fillRect(canvas.width - (2.62 * size.width), canvas.height - 75, (size.width), 30);
**/
  var f = canvas.toBuffer();
  msg.channel.sendFile(f);
} catch (e) {
  console.log(e);
}
}

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
