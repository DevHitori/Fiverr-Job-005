const Discord = require("discord.js");
const fs = require("fs");
date = new Date();

module.exports.run = async (client, message, args, prefix) => {

  if (!args[0]) {
    let e = new Discord.RichEmbed()
    .setTitle('Proper Usuage: !gameinfo [CODE]')
    .setColor("#36393F");
    message.channel.send(e);
    return;
  }

  if (args[0].startsWith('#')) {
    args[0] = args[0].slice(1)
  }
  let active =true;
  let res = await db.collection('Active Games').findOne({code: args[0]})
  if (!res) {
    res = await db.collection('Old Games').findOne({code: args[0]})
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
    .addField('Code:', res.code,)
    .addField('Creator:', res.creador,true)
    .addField('State:', res.estado,true)

    .setColor("#36393F");

    if (res.estado != 'starting'){
      e.addField('Players:', res.participantes.map(d => `\n${client.users.get(d)}`))
      e.addField('Red Team:', res.teamRed.map(d => `\n${client.users.get(d)}`),true)
      e.addField('Blue Team:', res.teamBlue.map(d => `\n${client.users.get(d)}`),true)
    }
    if (res.estado == 'finished'){e.addField(`Mafia:`),res.mafia.map(d => `\n${client.users.get(d)}`)}
    message.channel.send(e);
    return;
  }




}

module.exports.info = {
  name: "gameinfo",
  aliases: [],
  description: "Usage: !gameinfo [Game Code]",
  usuage: "gameinfo",
}
