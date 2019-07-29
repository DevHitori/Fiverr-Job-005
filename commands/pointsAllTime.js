const Discord = require("discord.js");
require('dotenv').config();
const fs = require("fs");
date = new Date();

module.exports.run = async (client, message, args, prefix) => {
  let res = await db.collection('Player Stats').findOne({playerID: message.author.id})
  if (!res) {
    var embed = new Discord.RichEmbed()
     .setTitle(`Member is not registered in the database`)
     .setDescription(`Players are registered after their first game`)
     .setColor("#36393F");
   message.channel.send(embed);
   return;
  }

      let e = new Discord.RichEmbed()
      .setTitle(`CoachRiver's Mafia Game | ${client.users.get(message.author.id)} Stats`)
      .addField(`Score:`,`${res.playerScore}`)
      .addField(`Games Played:`,`${res.gamesPlayed}`,true)
      .addField(`Games Created:`,`${res.gamesCreated}`,true)
      .addField(`Games Won As Mafia:`,`${res.gamesWonAsMafia}`,true)
      .setColor('#36393F');
      message.channel.send(e)
}

module.exports.info = {
  name: "pointsalltime",
  aliases: [],
  description: "Can be used to see your points collected from every game ever played.",
  usuage: "pointsalltime"
}
