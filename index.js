require('dotenv').config();
const Discord = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const client = new Discord.Client();
const TOKEN = process.env.token;
const PREFIX = process.env.prefix;
const DB = process.env.db;


client.commands = new Discord.Collection();

mongoose.connect(DB, {useNewUrlParser: true});


client.on('error', console.error);
client.on('warn', console.warn);
// client.on('debug', console.log);

let commandsFolder = fs.readdirSync('./commands');
let jsfiles = commandsFolder.filter(f => f.split(".").pop() === "js");
for (let file of jsfiles){
  let prop = require(`./commands/${file}`);
  client.commands.set(prop.info.name, prop);
}


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {

  if (message.author.bot) return;

  if (!message.content.startsWith(PREFIX)) return;

  let args = message.content.slice(process.env.prefix.length).split(/ +/);
  let cmd = args.shift().toLowerCase();

  if (!client.commands.has(cmd)) return;

  let commandfile = client.commands.get(cmd);
  commandfile.run(client, message, args, process.env.prefix);


});

client.login(TOKEN);
