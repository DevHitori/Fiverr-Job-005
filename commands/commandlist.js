const Discord = require("discord.js");
const fs = require("fs");
date = new Date();

module.exports.run = async (client, message, args, prefix) => {

  var embed = new Discord.RichEmbed()
   .setTitle(`Mafia Commands`)
   .addField(`!newgame`,`Creates a new mafia game`)
   .addField(`!stopgame`,`Stops and deletes your mafia game`)
   .addField(`!addpoints`,`Used by Admins to manually add points to a player's stats`)
   .addField(`!removepoints`,`Used by Admins to manually remove points from a player's stats`)
   .addField(`!points`,`Shows how the points system works.`)
   .addField(`!pointsAllTime`,`Can be used to see your points collected from every game ever played.`)
   .addField(`!gameinfo`,`Usage: !gameinfo [Game Code]`)
   .addField(`!leaderboard`,`Shows the leaderboard of the selected game`)
   .addField(`!leaderboardAllTime`,`Shows the overall leaderboard of everyone in the server`)
   .addField(`!whois`,`Useage !whois [userID]`)
   .addField(`!ping`,`Shows both Discord's ping and Bot's ping`)
   .addField(`!commandlist`,`Shows these commands`)
   .setColor("#36393F");
 message.channel.send(embed);
 return;
}

module.exports.info = {
  name: "commandlist",
  aliases: [],
  description: "To see all available commands",
  usuage: "commandlist",
}
