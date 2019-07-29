const Discord = require("discord.js");
const fs = require("fs");
date = new Date();

module.exports.run = async (client, message, args, prefix) => {

let res = await db.collection('active_games').findOne({'creador.user.id':message.author.id})
  if (!res){
    let e = new Discord.RichEmbed()
    .setTitle(`You have no active mafia games running!`)
    .setColor("#36393F")
    message.channel.send(e)
  }else{

    try{
      res.embed.delete();
    }catch{}

    let coll2 = await db.collection('old_games').insert(res)
    let coll = await db.collection('active_games').deleteOne({_id:res._id})

    let e = new Discord.RichEmbed()
    .setTitle(`You have successfully stopped your current game.`)
    .setColor("#36393F")
    message.channel.send(e)

  }
}

module.exports.info = {
  name: "stopgame",
  aliases: [],
  description: "To stop the game you started",
  usuage: "stopgame",
}
