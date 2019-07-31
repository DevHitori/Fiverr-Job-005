const Discord = require("discord.js");
const mongoose = require("mongoose");

module.exports.run = async (bot, message, args, prefix, filename) => {

  let found = bot.users.get(args[0]);
  if(!found) message.channel.send(`User with id ${args[0]} not found.`);

  let e = new Discord.RichEmbed()
  .setTitle(`Current username: ${found.username}`)
  .setColor('Black');
  message.channel.send(e);


}

module.exports.info = {
  name: "whois"
}
