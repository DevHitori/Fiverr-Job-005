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

  let user = client.users.get(message.author.id).username || res.gamesPlayed
  let played = res.gamesPlayed || 0
  let created = res.gamesCreated || 0
  let wonasMaf = res.gamesWonAsMafia || 0


      let e = new Discord.RichEmbed()
      .setTitle(`CoachRiver's Mafia Game | ${user} Stats`)
      .addField(`Score:`,`${res.playerScore}`)
      .addField(`Games Played:`,`${played}`,true)
      .addField(`Games Created:`,`${created}`,true)
      .addField(`Games Won As Mafia:`,`${wonasMaf}`,true)
      .setThumbnail(client.user.avatarURL)
      .setColor('#36393F');
      message.channel.send(e)
}

module.exports.info = {
  name: "pointsalltime",
  aliases: [],
  description: "Can be used to see your points collected from every game ever played.",
  usuage: "pointsalltime"
}
