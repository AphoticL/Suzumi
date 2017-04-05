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
const exec = require('child_process').exec;
var path = require('path');
var colstr = (`"red"
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
'gray/grey'`);
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

// STARTUP
var date = new Date();
var bdname = "./json/bd.json";
var bd = require(bdname);
var bdarr = [];
var d = new Date(2017,0,24);
var curtime = d.getTime();

bot.on('ready', () =>{

  console.log("ready");
  var day = date.getDate(),
		month = date.getMonth() + 1;
	console.log(`Today is ${day}\/${month}!`);
	for (let key in bd){
		if (bd.hasOwnProperty(key)){
			console.log("Logged " + bd[key]['name']);
			if ((bd[key]['day'] == day)&&(bd[key]['month'] == month)){
			console.log(bd[key]['name'] + "'s birthday is today!");
			bdarr.push(bd[key]['name']);
			}
		}
	}
  console.log(bdarr.join("\n"));
  console.log("/switch 234586311191822336");  // /switch 148577578146332672
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
// COMMANDS
const commands = {"ping": (msg) => {
  var start = new Date();
  msg.channel.sendMessage(`Pong.`);
  var end = new Date() - start;
  msg.channel.sendMessage(`\`Took: ${end}ms\``);
},
"rs": (msg) => {
  exec('cd C:\\Users\\Administrator\\Documents\\GitHub\\Suzumi', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
  exec('forever restartall', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
exec('pause', (error, stdout, stderr) => {
if (error) {
  console.error(`exec error: ${error}`);
  return;
}
console.log(`stdout: ${stdout}`);
console.log(`stderr: ${stderr}`);
});
},
"stopall": (msg) => {
  if (msg.author.id != '197733648403791872') return msg.channel.sendMessage("Forbidden.");
  exec('cd C:\\Users\\Administrator\\Documents\\GitHub\\Suzumi', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
  exec('forever stopall', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
exec('pause', (error, stdout, stderr) => {
if (error) {
  console.error(`exec error: ${error}`);
  return;
}
console.log(`stdout: ${stdout}`);
console.log(`stderr: ${stderr}`);
});
},
  "play": (msg) => {
    if (msg.author == bot.user) return;
  if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with ${tokens.prefix}add`);
  if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
  if (queue[msg.guild.id].playing) return msg.channel.sendMessage("Already Playing");
  let dispatcher;
  queue[msg.guild.id].playing = true;

  console.log(queue);
  (function play(song) {

    let arr = msg.member.voiceChannel.members.array();
    console.log(arr.length-1);
    if (arr.length-1 < 1) msg.member.voiceChannel.leave();

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
        if (arr.length-1 < 1) msg.member.voiceChannel.leave();
        if (msg.author == bot.user) return;
msg.channel.sendMessage('It\'s pretty fun; why\'d you pause that..?').then(() => {
  dispatcher.pause();
});
      } else if (m.content.startsWith(tokens.prefix + 'resume')){
        if (arr.length-1 < 1) msg.member.voiceChannel.leave();
        if (msg.author == bot.user) return;
msg.channel.sendMessage('owo)').then(() => {
  dispatcher.resume();
});
      } else if (m.content.startsWith(tokens.prefix + 'skip')){
        if (arr.length-1 < 1) msg.member.voiceChannel.leave();
        if (msg.author == bot.user) return;
msg.channel.sendMessage('Skipped').then(() => {
  dispatcher.end();
});
      } else if (m.content.startsWith('/volume')){
        if (arr.length-1 < 1) msg.member.voiceChannel.leave();
        if (msg.author == bot.user) return;
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
         if (arr.length-1 < 1) msg.member.voiceChannel.leave();
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
  if (msg.author == bot.user) return;
  return new Promise((resolve, reject) => {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('I couldn\'t connect to your voice channel...');
    voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
  });
},
'add': (msg) => {
  if (msg.author == bot.user) return;
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
  let args = msg.content.split(" ").slice(1),
  resstr;
  if (!args[0]) return msg.channel.sendMessage(`\`\`\`xl
==VOICE CHAT COMMANDS==
/join
/add
/queue
/play
/pause
/resume
/skip
/time
/volume

==NON VC COMMANDS==
/color or /colour
/d
/event
/spell
/bd
(Type /help followed by the command's name for extra data)\`\`\``);
  // BEGINNING SWITCH SEQ
  switch(args[0].toLowerCase()){
    case 'voice':
      resstr = (`\`\`\`xl
/join : "Join Voice channel of msg sender"
/add : "Add a valid youtube link to the queue"
/queue : "Shows the current queue, up to 15 songs shown."
/play : "Play the music queue if already joined to a voice channel"
/pause : "Pauses the music"
/resume : "Resumes the music"
/skip : "Skips the playing song"
/time : "Shows the playtime of the song."
/volume : "Adjust the intensity of the song."\`\`\``);
      break;
    case 'color':
    case 'colour':
      resstr = "Type /color or /colour followed by the color you want to change your name's color. I'll inform you if the color you want is not in my store. Type /remove if you desire to wash your color off.";
      break;
    case 'd':
      resstr = "Pray to RNGsus here. Type a certain character's name and see what happens";
      break;
    case 'event':
      resstr = "Make your own sub-event! Syntax: /event [color] [text(,text2,text3,text4)";
      break;
    case 'spell':
      resstr = "Make your own spellcard! Type the name after this command and see what happens!";
      break;
    case 'bd':
      resstr = "Do you want Suzumi to remind you of your birthday? Use this command. Syntax will be listed inside.";
      break;
  }
    msg.channel.sendMessage(resstr);
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
  ${colstr}
    \`\`\`  `);
      },3000);
    },2000);
  } else {
  try{
  let colre = col.toLowerCase();
  if (colre === 'grey') colre = 'gray';
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
${colstr}\`\`\`    `);
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

  ${colstr}
  \`\`\`    `);
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

${colstr}
\`\`\`    `);
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
} else if ((d.toLowerCase() == "xeno") && ((args[1] == "a") || args[1] == "A")){
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
'event' : (msg) => {
 // One line contains 23 letters w/o an i
 /*

 **/
    var Canvas = require('canvas')
      , Image = Canvas.Image;
    if (msg.channel.name != 'bot-spam') return msg.channel.sendMessage("You're not allowed to use it here! Go to bot-spam instead.");
    let check = msg.content.split(" ").slice(1)[0];
    if (!check) return msg.channel.sendMessage("Want to make a sub-event of your own? Use this command followed by the color, then your texts. Be sure to add a comma to separate your words if you want to make a new line!");

  if (!msg.content.includes(",")){
      try{
        var imgdir;
          let test = msg.content.split(" ").slice(1);
          let col = test[0];
          switch(col.toLowerCase()){
            case 'red':
              imgdir = '1';
              break;
            case 'yellow':
            imgdir = '11';
            break;
            case 'purple':
            imgdir = '21';
            break;
            default:
            return msg.channel.sendMessage("Invalid Color.");
          }
          test = msg.content.split(" ").slice(2);
          var canvas = new Canvas(300, 40);
          var ctx = canvas.getContext('2d');
          var img;
          img = new Image;
          console.log(`${msg.author.username} sent ${test.join(" ").trim()}`);
          img.src = (__dirname + '/image/' + imgdir + '.png');
          ctx.drawImage(img, 0, 0);

          ctx.fillStyle = 'white';
          ctx.font = '25px Impact';
          ctx.textAlign = "center";
          ctx.fillText(test.join(" ").trim(), (canvas.width / 2), ((canvas.height / 2)+10));

          var f = canvas.toBuffer();
          msg.channel.sendFile(f);
      } catch (e) {
          console.log(e);
      }
  }
  else {
      let args = msg.content.split(" ").slice(1);
      var col = args[0];
      if ((col.toLowerCase() !== 'red')&&(col.toLowerCase() !== 'yellow')&&(col.toLowerCase() !== 'purple')) return msg.channel.sendMessage("Invalid Color. You can only use Red, Yellow or Purple.");
      let targs = msg.content.split(" ").slice(2).join(" ").split(",");
      img = new Image;
      let l = targs.length;
      canvas = new Canvas(300, (40 * l));
      ctx = canvas.getContext('2d');
      ctx.textAlign = "center";
      ctx.font = '25px Impact';
      ctx.fillStyle = 'white';
      if (l.length > 4) return msg.channel.sendMessage("Too much text!");
      if (col.toLowerCase() == 'red'){
      switch(l){
          case 2:
              img.src = (__dirname + '/image/2.png');
              ctx.drawImage(img, 0, 0);
              ctx.fillText(targs[0].trim(), 150, 30);
              ctx.fillText(targs[1].trim(), 150, 70);
              console.log(`${msg.author.username} sent ${targs.join(",").trim()}`);
              break;
          case 3:
              img.src = (__dirname + '/image/3.png');
              ctx.drawImage(img, 0, 0);
              ctx.fillText(targs[0].trim(), 150, 30);
              ctx.fillText(targs[1].trim(), 150, 70);
              ctx.fillText(targs[2].trim(), 150, 110);
              console.log(`${msg.author.username} sent ${targs.join(",").trim()}`);
              break;

          case 4:
              img.src = (__dirname + '/image/4.png');
              ctx.drawImage(img, 0, 0);
              ctx.fillText(targs[0].trim(), 150, 30);
              ctx.fillText(targs[1].trim(), 150, 70);
              ctx.fillText(targs[2].trim(), 150, 110);
              ctx.fillText(targs[3].trim(), 150, 150);
              console.log(`${msg.author.username} sent ${targs.join(",").trim()}`);
              break;
          default:
              return msg.channel.sendMessage('Invalid Syntax!');
      }
      f = canvas.toBuffer();
      msg.channel.sendFile(f);
    } else if (col.toLowerCase() == 'yellow'){
    switch(l){
        case 2:
            img.src = (__dirname + '/image/12.png');
            ctx.drawImage(img, 0, 0);
            ctx.fillText(targs[0].trim(), 150, 30);
            ctx.fillText(targs[1].trim(), 150, 70);
            console.log(`${msg.author.username} sent ${targs.join(",").trim()}`);
            break;
        case 3:
            img.src = (__dirname + '/image/13.png');
            ctx.drawImage(img, 0, 0);
            ctx.fillText(targs[0].trim(), 150, 30);
            ctx.fillText(targs[1].trim(), 150, 70);
            ctx.fillText(targs[2].trim(), 150, 110);
            console.log(`${msg.author.username} sent ${targs.join(",").trim()}`);
            break;

        case 4:
            img.src = (__dirname + '/image/14.png');
            ctx.drawImage(img, 0, 0);
            ctx.fillText(targs[0].trim(), 150, 30);
            ctx.fillText(targs[1].trim(), 150, 70);
            ctx.fillText(targs[2].trim(), 150, 110);
            ctx.fillText(targs[3].trim(), 150, 150);
            console.log(`${msg.author.username} sent ${targs.join(",").trim()}`);
            break;
        default:
            return msg.channel.sendMessage('Invalid Syntax!');

  }
  f = canvas.toBuffer();
  msg.channel.sendFile(f);
}
   else if (col.toLowerCase() == 'purple'){
  switch(l){
      case 2:
          img.src = (__dirname + '/image/22.png');
          ctx.drawImage(img, 0, 0);
          ctx.fillText(targs[0].trim(), 150, 30);
          ctx.fillText(targs[1].trim(), 150, 70);
          console.log(`${msg.author.username} sent ${targs.join(",").trim()}`);
          break;
      case 3:
          img.src = (__dirname + '/image/23.png');
          ctx.drawImage(img, 0, 0);
          ctx.fillText(targs[0].trim(), 150, 30);
          ctx.fillText(targs[1].trim(), 150, 70);
          ctx.fillText(targs[2].trim(), 150, 110);
          console.log(`${msg.author.username} sent ${targs.join(",").trim()}`);
          break;

      case 4:
          img.src = (__dirname + '/image/24.png');
          ctx.drawImage(img, 0, 0);
          ctx.fillText(targs[0].trim(), 150, 30);
          ctx.fillText(targs[1].trim(), 150, 70);
          ctx.fillText(targs[2].trim(), 150, 110);
          ctx.fillText(targs[3].trim(), 150, 150);
          console.log(`${msg.author.username} sent ${targs.join(",").trim()}`);
          break;
      default:
          return msg.channel.sendMessage('Invalid Syntax!');
  }
  f = canvas.toBuffer();
  msg.channel.sendFile(f);
}
}
},
 'spell' : (msg) => {
   var Canvas = require('canvas')
  , image = new Canvas.Image;

   if (msg.channel.name != 'bot-spam') return msg.channel.sendMessage("You're not allowed to use it here! Go to bot-spam instead.");

   let check = msg.content.split(" ").slice(1)[0];
   let args = msg.content.split(" ").slice(1);
   if (!check) return msg.channel.sendMessage(`Want to make a card of your own, ${msg.author}? use [/spell] follow by the name you want! Use sparingly.`);
   var canvas = new Canvas(255,44);
   var ctx = canvas.getContext('2d');
   image.src = (__dirname + '/image/spell.png');
   ctx.drawImage(image, 0, 0);
   ctx.textAlign = 'end';
   ctx.fillStyle = 'white';
   ctx.font = '12px Arial';
   // fillText(text, x, y)
   ctx.fillText(args.join(" "), 238, 29);
   let f = canvas.toBuffer();
   msg.channel.sendFile(f);
 },
 'bd': (msg) => {
   var date = new Date();
   console.log("Command");
   var day = date.getDate(), month = date.getMonth() + 1;
   let args = msg.content.split(" ").slice(1);
   if (args[0] === undefined) return msg.channel.sendMessage(`\`\`\`xl
LIST OF BIRTHDAY COMMANDS:
add: "Add your birthday to make Suzumi remind you of your birthday."
Syntax: /bd add dd/mm
check: "Check if anyone got a birthday today!"
Syntax: /bd check \`\`\``);
  if (args[0] == 'add'){
    console.log(args[1]);
    if (!args[1]) return msg.channel.sendMessage("Please include your date in dd/mm format");
    let date = args[1].split("/");
    console.log(msg.author.username);
    let name = msg.author.username;
    var bd = require(bdname);
    Object.defineProperty(bd, name, {
  value: {
    'name' : name,
    'day': date[0],
    'month': date[1]
  },
  writable: true,
  enumerable: true,
  configurable: true
});
    fs.writeFile(bdname, JSON.stringify(bd, null, 2), (err) => {
      if (err) throw err;
      console.log(JSON.stringify(bd, null, 2));
      msg.channel.sendMessage("Added!");
    });
  }else if (args[0] == 'check'){
    var arr = [];
    var arr2 = [], arr3 = [];
    let date = new Date();
    let day = getDayAmount(date.getUTCDate(),date.getUTCMonth(),date.getUTCFullYear());
    bd = require(bdname);
    for (let key in bd){
      if (bd.hasOwnProperty(key)){
        let userday = getDayAmount(parseInt(bd[key]['day']), parseInt(bd[key]['month'])-1, date.getUTCFullYear());
        console.log(bd[key]['name'] + " : " + userday + "\n");
        if (userday - day <= 7 && userday - day > 0) arr.push(`'${bd[key]['name']}'s birthday will arrive in ${Math.abs(userday - day)} days.`);
        if (userday - day >= -7 && userday - day < 0) arr3.push(`'${bd[key]['name']}'s birthday has already passed for ${Math.abs(userday - day)} days.`);
        if (userday - day === 0) arr2.push(`Today is '${bd[key]['name']}'s birthday.`);
    }
  }
  let hour = date.getUTCHours();
  hour = (date.getUTCHours() < 10) ? (`0${hour}`) : hour;
  let min = date.getUTCMinutes();
  min = (date.getUTCMinutes() < 10) ? (`0${min}`) : min;
  day = date.getUTCDate();
msg.channel.sendMessage("\`\`\`xl\n" + arr2.join("\n") + "\n\n" + arr.join("\n") + "\n\n" + arr3.join("\n") + "\n\n" + "The current UTC time is: " + (`${day}\/${month}, ${hour}\:${min}`) + "\`\`\`");
}
}
};


bot.on("message", msg => {
  //if (msg.channel.type != 'text') return;
  // if (msg.author.id != '197733648403791872') return msg.channel.sendMessage("Maintenance in progress!");
  // if (msg.author.id === 188698737785307145) return msg.channel.sendMessage("Error: Usage blocked.");
  if(!msg.content.startsWith(prefix)) return;
  if (msg.channel.id == tokens.speak) console.log(`${msg.author.username} : ${msg.content}`);
  if (commands.hasOwnProperty(msg.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0]](msg);

});
bot.login("MjY4NzgwODQ1OTg3Mzk3NjQy.C1fxMA.wRDQDEGSFBLRvALnelqnZszg2PU");

function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
}
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
function sort (arr){
for (let i = (arr.length - 1); i >= 0; i--){
  for (let j = 1; j <= i; j++){
    if (arr[j-1]['day'] > arr[j]['day'])
         {
              let temp = arr[j-1];
              arr[j-1] = arr[j];
              arr[j] = temp;
  }
}
}
}
function list (obj, arr){
  for (let key in obj){
    if (obj.hasOwnProperty(key)){
    console.log(key);
    arr.push(obj[key]);
    }
  }
  sort(arr);
  //resort(arr);
for (let i = 0; i<arr.length; i++){
  console.log(arr[i]['name'] + " " + arr[i]['day']);
}
}
function checkLeapYear(year){
  let ret;
  if ((year % 4 === 0)&&(year % 100 !== 0) || (year % 400 === 0)) ret = true;
  else ret = false;
  return ret;
}
function getDayAmount(day, month, year){
  let array = [0,31,59,90,120,151,181,212,243,273,304,334];
  day = array[month] + day;
  if ((checkLeapYear(year) === true) && ((month + 1) > 2)) day + 1;
  return day;
}
