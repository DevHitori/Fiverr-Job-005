const Discord = require("discord.js");
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const Nextphase = new MyEmitter();
const mongoose = require('mongoose');





module.exports.run = async (client, message, args, prefix, db) => {

  var emoji1 = await client.emojis.get('RockectLeague')
  var emoji2 = await client.emojis.get('426406049491320832')
  console.log(emoji2);
  if (!emoji1) emoji1 ={name:'🇷',id:'🇷'}
  if (!emoji2) emoji2={name:'🇱',id:'🇱'}


  let res = await db.collection('Active Games').findOne({'creador.user.id':message.author.id})
  if (res) {
    let embed = new Discord.RichEmbed()
    .addField(`You already have a game running!`)
    .setColor('#36393F')
    message.channel.send(embed);
    return;
  }


  var globalErr = false;
  var estado = 'starting';

  let embed = new Discord.RichEmbed()
  .addField(`Welcome to CoachRiver's Mafia Bot!`,`Choose the game you would like to start`)
  .addField(`Rocket League`,`🇷`)
  .addField(`League of Legends`,`🇱`,true)
  .setColor('#36393F')
  let emdMsg = await message.channel.send(embed);

    await emdMsg.react(emoji1.id)
    await emdMsg.react(emoji2.id)

  let filter = (reaction, user) => {
    return [emoji1.name, emoji2.name].includes(reaction.emoji.name) && user.id === message.author.id; }

  let reaction = await emdMsg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] }).catch( error=>{
    globalErr = true;
    let embed2 = new Discord.RichEmbed()
    .setTitle(`Timeout`)
    .setColor('#36393F')
    emdMsg.edit(embed2);
  })
  let mongoID = await mongoose.Types.ObjectId()
  let uid = JSON.stringify(mongoID).slice(-7).slice(0, -1)
  let gameType;

  if (reaction.first()._emoji.name == emoji1.name ) {
    gameType = 'Rocket League'
  }
  if (reaction.first()._emoji.name == emoji2.name ) {
    gameType = 'League of Legends'
  }
  await emdMsg.clearReactions()
  let embed3 = new Discord.RichEmbed()
  .addField(`Creating a ${gameType} Mafia Game | #${uid}`,`**Please Select The Team Size**`)
  .setColor('#36393F')
  emdMsg.edit(embed3);

  await emdMsg.react('3⃣')
  await emdMsg.react('4⃣')
  await emdMsg.react('5⃣')

  let filter2 = (reaction, user) => {
    return ['3⃣', '4⃣','5⃣'].includes(reaction.emoji.name) && user.id === message.author.id; }

  reaction = await emdMsg.awaitReactions(filter2, { max: 1, time: 60000, errors: ['time'] }).catch( error=>{
    globalErr = true;
    let embed2 = new Discord.RichEmbed()
    .setTitle(`Timeout`)
    .setColor('#36393F')
    emdMsg.edit(embed2);
  })
  if(globalErr) return;

  let teamSize = (reaction.first()._emoji.name == '5⃣') ? 5 : (reaction.first()._emoji.name == '4⃣') ? 4 : 3

  let objArr = [{
    player: message.author.id,
    playerScore: 0
  }];

  let dbRes = await db.collection('Active Games').insertOne({
    _id: mongoID,
    code: uid,
    embed: emdMsg.id,
    type: gameType,
    teamSize: teamSize,
    creador: message.author.id,
    estado: 'starting',
    participantes: objArr,
    teamRed : [],
    teamBlue: [],
    mafia: []
  })
  await emdMsg.clearReactions();








  let embed4 = new Discord.RichEmbed()
  .addField(`${gameType} Mafia Game Created | #${uid}`,`Hit ⬆ to join the game!`)
  .setColor('#36393F')
  emdMsg.edit(embed4);

  await emdMsg.react('⬆');
  await emdMsg.react('⬇');

  let filter3 = (reaction, user) => {
    return ['⬆','⬇'].includes(reaction.emoji.name) && user.id != client.user.id
  };
  let gameLobby = emdMsg.createReactionCollector(filter3,{time: 300000})

  var cancelEnd = false;

  gameLobby.on('end', async coll=>{
    if (cancelEnd) return;
    if (estado!='generating') {
      globalErr = true;
      let embed5 = new Discord.RichEmbed()
      .setTitle(`Sorry, Not enough players joined in time.`)
      .setColor('#36393F')
      emdMsg.edit(embed5);
    }else{
      var mafia = []
      var redTeam = []
      var blueTeam = []
      while(redTeam.length!=teamSize){
        let rand = players[Math.floor(Math.random() * myArray.length)];
        (redTeam.includes(rand)) ? null : redTeam.push(rand)
      }
      blueTeam = players.filter(d => !redTeam.includes(d));
      if(gameType=='League of Legends'){
        mafia.push(redTeam[Math.floor(Math.random() * myArray.length)])
        mafia.push(blueTeam[Math.floor(Math.random() * myArray.length)])
      }else{
        mafia.push(players[Math.floor(Math.random() * myArray.length)])
      }
      db.collection('Active Games').findOneandUpdate({_id:mongoID},{$set:{teamRed:redTeam,teamBlue:blueTeam,mafia:mafia,estado:'in progress'}});
      let checkForPlayer = await db.collection('Player Stats').findOne({playerID: message.author.id});
      if (checkForPlayer){
        let dbRes2 = await db.collection('Player Stats').findOneAndUpdate({playerID: message.author.id},{$inc:{"gamesCreated":1}})
      }else{
        let dbRes2 = await db.collection('Player Stats').insertOne({
          playerID: message.author.id,
          playerScore: 0,
          gamesCreated: 1,
          gamesPlayed: 0,
          gamesWon: 0
        })
      }
      Nextphase.emit('start',mongoID,emdMsg);
    }
  })

  let players = [message.author.id]

  gameLobby.on('collect', async r =>{
    let reactor = await r.users.last();
    if (estado!='starting') return;



    if (r._emoji.name == '⬇') {
          if(players.includes(reactor.id)){
            players = players.filter((ele)=>{
              return ele != reactor.id;
            });
            let embed6 = new Discord.RichEmbed()
            .setTitle(`${client.users.get(reactor.id).username} left Mafia Game #${uid}'s Lobby`)
            .setColor('#36393F');
            let mstoDel = await emdMsg.channel.send(embed6)
            mstoDel.delete(2000)

            let embed7 = new Discord.RichEmbed()
            .addField(`${gameType} Mafia Game Created | #${uid}`,`Hit ⬆ to join the game!`)
            .setColor('#36393F');
            let joinedStr = ''
            for(let playerID of players){
              joinedStr += `\n ${client.users.get(reactor.id).username } joined lobby!`
            }
            if (players.length > 0) {
              embed6.addField(`__Players Joined:__`,`${joinedStr}`);
            }
            emdMsg.edit(embed7)

          }else{
            let embed6 = new Discord.RichEmbed()
            .setTitle(`You haven't joined Mafia Game #${uid}`)
            .setColor('#36393F');
            let mstoDel = await emdMsg.channel.send(embed6)
            mstoDel.delete(2000)
          }
      }


      if (r._emoji.name == '⬆') {
      if(!players.includes(reactor.id)){
        players.push(reactor.id)
        let embed6 = new Discord.RichEmbed()
        .addField(`${gameType} Mafia Game Created | #${uid}`,`Hit ⬆ to join the game!`)
        .setColor('#36393F');
        let joinedStr = ''
        for(let playerID of players){
          joinedStr += `\n ${client.users.get(reactor.id).username } joined lobby!`
        }
        embed6.addField(`__Players Joined:__`,`${joinedStr}`);
        emdMsg.edit(embed6)

        if(players.length >= teamSize*2){
          estado = 'generating';
          cancelEnd = true;
          gameLobby.emit('end');
        }

      }else{
        let embed6 = new Discord.RichEmbed()
        .setTitle(`You are already in Mafia Game #${uid}`)
        .setColor('#36393F');
        let mstoDel = await emdMsg.channel.send(embed6)
        mstoDel.delete(2000)
      }
    }

  })

//nextphase

Nextphase.on('start', async (mongoID,embedMsg,database) => {
  let gameData = await db.collection('Active Games').findOne({_id:mongoID});
  var globalErr2 = false;
  let e1 = new Discord.RichEmbed()
  .setTitle(`Pssst! You are the **MAFIA**, throw some games bruh!`)
  .setColor('#36393F');
  let e2 = new Discord.RichEmbed()
  .addField(`Unable to DM the mafia, Game #${gameData.code} Cancelled!`,`Next time please ensure all players are still in the server and that you have not blocked the bot...`)
  .setColor('#36393F');

  for(let mafia of gameData.mafia){
    try{
      client.users.get(mafia).send(e1)
    }catch{
      globalErr2 = true;
      embedMsg.edit(e2)
    }
  }

  if(globalErr2) return;


  let res = await db.collection('Active Games').findOne({'creador':message.author.id});
  if(!res){
    console.log('Error Game not found!');
    return;
  }
  let redStr = '';
  let blueStr = '';
  for(let user of res.teamRed){
    redStr+=`\n${user.username}|${user.id}`
  }
  for(let user of res.teamBlue){
    blueStr+=`\n${user.username}|${user.id}`
  }

  let embed = new Discord.RichEmbed()
  .addField(`Your ${res.type} Mafia Game | #${res.code} Has Started!`,`*When the game is over the game creator will click ☑ to begin the next phase*`)
  .addField(`__Game Creator:__`,`${client.users.get(res.creador).username || res.creador}`)
  .addField(`__Red Team:__`,`${redStr}`)
  .addField(`__Blue Team:__`,`${blueStr}`,true)
  .setColor('#36393F')
  let emdMsg = await message.channel.send(embed);

  let filter = (reaction, user) => {
    return ['☑'].includes(reaction.emoji.name) && user.id === message.author.id; }

  let reaction = await emdMsg.awaitReactions(filter, { max: 1, time: 7200000, errors: ['time'] }).catch( error=>{
    globalErr = true;
    try{
      let embed2 = new Discord.RichEmbed()
      .setTitle(`Timeout | 2 hours passed without a response`)
      .setColor('#36393F')
      emdMsg.edit(embed2);
  }catch{}
  })

  if(globalErr2) return;


  let fembed2 = new Discord.RichEmbed()
  .setTitle(`**GAME FINISHED**\n\n ${message.author} tell me which team won\n\n**Red Team** or **Blue Team**?`)
  .setColor('#36393F')
  emdMsg.edit(fembed2);

  await emdMsg.react('🔴');
  await emdMsg.react('🔵');

  let filter2 = (reaction, user) => {
    return ['🔴','🔵'].includes(reaction.emoji.name) && user.id == message.author.id;
  };

  let reaction2 = await emdMsg.awaitReactions(filter2, {max: 1,time: 3600000,errors: ['time']}).catch( error=>{
    globalErr = true;
    try{
      let embed2 = new Discord.RichEmbed()
      .setTitle(`Timeout | 1 hours passed without a response`)
      .setColor('#36393F')
      emdMsg.edit(embed2);
  }catch{}
  })

  if(globalErr2) return;

  if(gameData.type == 'League of Legends'){
    if (reaction2.first().name == '🔴'){


    }
    if (reaction2.first().name == '🔵'){


    }
    let embed4 = new Discord.RichEmbed()
    .addField(`${gameType} Mafia Game Created | #${uid}`,`Hit ⬆ to join the game!`)
    .setColor('#36393F')
    emdMsg.edit(embed4);
  }else{

  }


});






















}

module.exports.info = {
  name: "newgame",
  aliases: [],
  description: "To create a new mafia game",
  usuage: "newgame",
}
