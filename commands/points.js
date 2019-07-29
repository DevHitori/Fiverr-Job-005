const Discord = require("discord.js");
require('dotenv').config();
const fs = require("fs");
date = new Date();

module.exports.run = async (client, message, args, prefix) => {
    db.collection('Active Games').findOne({participantes:{$elemMatch:{playerID:message.author.id}}})
}

module.exports.info = {
  name: "points",
  aliases: [],
  description: "Used by Admins to manually add points to a player's stats",
  usuage: "points"
}
