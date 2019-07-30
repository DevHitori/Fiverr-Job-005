const Discord = require("discord.js");
const fs = require("fs");
date = new Date();

module.exports.run = async (client, message, args, prefix) => {
  // let res = await db.collection('Player Stats').find( { playerScore: { $gt: -1} } ,{$orderby:{'playerScore':1}})
  let res = await db.collection('Player Stats').find( { playerScore: { $gt: -1} } ,{$orderby:{'playerScore':1}}).map(x => x).toArray();

  if (!res) {
    let e = new Discord.RichEmbed()
    .setTitle('Overall LeaderBoard is Empty, try playing a few games so we can get some data.')
    .setColor("#36393F");
    message.channel.send(e);
    return;
  }

   let lastPage = (res.length%10 == 0) ? parseInt(res.length/10) : parseInt(res.length/10 + 1);

   let i=0
   let leaderboards = [];

   for (var p = 0; p < lastPage; p++) {
    let e = await new Discord.RichEmbed()
    .setTitle(`CoachRiver's Mafia Bot | Overall LeaderBoard`)
    .setThumbnail(client.user.avatarURL)
    .setColor("#36393F");

      for(let r = 0; r < 10; r++){
        i++;
        let z = i-1;
        if (res[z]){
          let player = json[z];
          let pname = client.users.get(player.playerID); || 'unknown'
           e.addField(`**${i}.**\t${pname.username} - ${player.playerScore}\n`,'\u200b');
        }
      }
      e.setFooter(`${i-9} - ${i} of ${res.length} Players`)
    leaderboards[p]=e;
    }


    let leaderboardMSG = await message.channel.send(leaderboards[0]);

    if (lastPage>1) {
      await leaderboardMSG.react('➡');
    }

    let filter = (reaction, user) => {
    return ['➡','⬅'].includes(reaction.emoji.name) && user.id == message.author.id
  };
  let page = 0;
  let rc = await new Discord.ReactionCollector(leaderboardMSG,filter,{max: 50,});

  rc.on('collect', async r =>{
    leaderboardMSG.clearReactions();
    if (r._emoji.name == '➡') {
      await page++;
      await leaderboardMSG.edit(leaderboards[page])
    }
    if (r._emoji.name == '⬅') {
      await page--;
      await leaderboardMSG.edit(leaderboards[page])
    }
    if (page>0) {
      await leaderboardMSG.react('⬅');
    }
    if (page<(lastPage-1)) {
      await leaderboardMSG.react('➡');
    }
  });

}

module.exports.info = {
  name: "leaderboardalltime",
  aliases: [],
  description: "Shows the overall leaderboard of everyone in the server",
  usuage: "leaderboardalltime",
}
