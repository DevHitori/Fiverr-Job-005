const Discord = require("discord.js");
require('dotenv').config();
const fs = require("fs");
date = new Date();

module.exports.run = async (client, message, args, prefix) => {
  if (message.channel.type=='dm') {
    var embed = new Discord.RichEmbed()
     .setTitle(`This command must be used in a server`)
     .setColor("#36393F");
   message.channel.send(embed);
    return;
  }
  if(!message.member.roles.get(process.env.admin_role)){
    var embed = new Discord.RichEmbed()
     .setTitle(`You do not have permissions to use this command`)
     .setColor("#36393F");
   message.channel.send(embed);
    return;
  }

  let member = message.mentions.members.first();
  let points = args[1]
  if(!member || !points){
    var embed = new Discord.RichEmbed()
     .setTitle(`Proper usage !addpoints [@member] [number of points to add]`)
     .setColor("#36393F");
   message.channel.send(embed);
    return;
  }

  if(isNaN(points) || points < 0){
    var embed = new Discord.RichEmbed()
     .setTitle(`A number was expected for points not ${points}`)
     .setColor("#36393F");
   message.channel.send(embed);
  return;
}
points = parseInt(points)

let res = await db.collection('Player Stats').findOne({playerID: member.user.id})


  if (!res) {
    var embed = new Discord.RichEmbed()
     .setTitle(`Member is not registered in the database`)
     .setDescription(`Players are registered after their first game`)
     .setColor("#36393F");
   message.channel.send(embed);
 }else{
   let res2 = await db.collection('Player Stats').findOneAndUpdate({playerID: member.user.id},{$inc:{score:points}})
 }

}

module.exports.info = {
  name: "addpoints",
  aliases: [],
  description: "Used by Admins to manually add points to a player's stats",
  usuage: "addpoints"
}
