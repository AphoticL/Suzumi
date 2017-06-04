const https = require('https'),
fs = require('fs'),
colors = require('colors');

process.stdout.write('Connecting to GitHub...'.yellow);

var start = new Date();
https.get('https://raw.githubusercontent.com/AphoticL/Suzumi/master/bot.js', (res) => {
	if (res.statusCode == 200) console.log("Done".green);
  else {
    console.log("Error.".red);
    process.exit();
 }
  process.stdout.write("Updating file...".yellow);
  var files = fs.createWriteStream('./bot.js');
    res.on('data', (d) => {
      files.write(d);
    }).on('error', (e) => {
      console.log("File update fail! Refer to the error below!".red);
      console.error(e);
	});
});
var end = new Date();

setTimeout(function(){
  console.log("Done".green);
  console.log("File updated successfully!".green);
  console.log("Took %s ms".cyan, end-start);
}, 1000);
