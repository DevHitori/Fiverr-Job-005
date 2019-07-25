const Discord = require("discord.js");
const fs = require("fs");
date = new Date();

module.exports.run = async (client, message, args, prefix) => {

  const m = await message.channel.send("Pinging...");
  m.edit(`Pong! \nLatency is ${((m.createdTimestamp - message.createdTimestamp)*0.001).toFixed(3)}s \nAPI Latency is ${Math.round(client.ping)}ms`);

}

module.exports.info = {
  name: "ping",
  aliases: [],
  description: "Get the Response time of the bot. (used for lag check).",
  usuage: "ping",
}
