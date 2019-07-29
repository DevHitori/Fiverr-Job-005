const Discord = require("discord.js");
const fs = require("fs");
date = new Date();

module.exports.run = async (client, message, args, prefix) => {
  let res = await db.collection('Player Stats').find( { playerScore: { $gt: -1} } ,{$orderby:{'playerScore':1}})

  if (!res) {
    let e = new Discord.RichEmbed()
    .setTitle('Overall LeaderBoard is Empty, try playing a few games so we can get some data.')
    .setColor("#36393F");
    message.channel.send(e);
    return;
  }else{
    let e = new Discord.RichEmbed()
    .setTitle(`CoachRiver's Mafia Bot | Overall LeaderBoard`)
    .setColor("#36393F");

    let str='';
    for (var i = 0; i < res.length; i++) {
      let memeber = client.users.get(res.playerID) || 'unknown'
      str+=`\n${memeber} - ${res.playerScore}`
    }

    e.addField(`Player - Score`,`${str}`);


    message.channel.send(e);
    return;
  }




}

module.exports.info = {
  name: "leaderboardalltime",
  aliases: [],
  description: "Shows the overall leaderboard of everyone in the server",
  usuage: "leaderboardalltime",
}
