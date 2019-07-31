const Discord = require("discord.js");
const fs = require("fs");
date = new Date();

module.exports.run = async (client, message, args, prefix) => {

  if (!args[0]) {
    let e = new Discord.RichEmbed()
    .setTitle('Proper Usuage: !leaderboard [CODE]')
    .setColor("#36393F");
    message.channel.send(e);
    return;
  }

  if (args[0].startsWith('#')) {
    args[0] = args[0].slice(1)
  }
  let active =true;
  let res = await db.collection('Active Games').findOne({code: args[0]},{$orderby:{'participantes.playerScore':1}})
  if (!res) {
    res = await db.collection('Old Games').findOne({code: args[0]},{$orderby:{'participantes.playerScore':1}})
    active = false
  }
  if (!res) {
    let e = new Discord.RichEmbed()
    .setTitle('A game with that code could not be found.')
    .setColor("#36393F");
    message.channel.send(e);
    return;
  }else{
    let e = new Discord.RichEmbed()
    .setTitle(`CoachRiver's Mafia Bot | Game #${res.code} LeaderBoard`)
    .setThumbnail(client.user.avatarURL)
    .setColor("#36393F");

    let players = res.participantes;

    res = players.sort(function(a, b){
     return b.playerScore - a.playerScore;
   });


    let str='';
    for (var i = 0; i < players.length; i++) {
      let memeber = client.users.get(players[i].playerID).username || 'unknown'
      str+=`\n${memeber} - ${players[i].playerScore}`
    }

    e.addField(`Player - Score`,`${str}`);


    message.channel.send(e);
    return;
  }




}

module.exports.info = {
  name: "leaderboard",
  aliases: [],
  description: "Shows the leaderboard of the selected game",
  usuage: "leaderboard",
}
