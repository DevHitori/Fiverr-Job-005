const Discord = require("discord.js");
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const Nextphase = new MyEmitter();




module.exports.run = async (client, message, args, prefix, db) => {


  let res = await db.collection('active_games').findOne({'creador.user.id':message.author.id})
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

  await emdMsg.react('🇷')
  await emdMsg.react('🇱')

  let filter = (reaction, user) => {
    return ['🇷', '🇱'].includes(reaction.emoji.name) && user.id === message.author.id; }

  let reaction = await emdMsg.awaitReactions(filter, { max: 1, time: 1000, errors: ['time'] }).catch( error=>{
    globalErr = true;
    let embed2 = new Discord.RichEmbed()
    .setTitle(`Timeout`)
    .setColor('#36393F')
    emdMsg.edit(embed2);
  })
  let mongoID = mongoose.Types.ObjectId()
  let uid = mongoID.slice(-6)

  let gameType;

  if (reaction.first().name == '🇷' ) {
    gameType = 'Rocket League'
  }
  if (reaction.first().name == '🇱' ) {
    gameType = 'League of Legends'
  }
  emdMsg.clearReactions()
  let embed3 = new Discord.RichEmbed()
  .addField(`Creating a ${gameType} Mafia Game | #${uid}`,`**Please Select The Team Size**`)
  .setColor('#36393F')
  emdMsg.edit(embed3);

  await emdMsg.react('three')
  await emdMsg.react('four')
  await emdMsg.react('five')

  let filter2 = (reaction, user) => {
    return ['three', 'four','five'].includes(reaction.emoji.name) && user.id === message.author.id; }

  reaction = await emdMsg.awaitReactions(filter2, { max: 1, time: 60000, errors: ['time'] }).catch( error=>{
    globalErr = true;
    let embed2 = new Discord.RichEmbed()
    .setTitle(`Timeout`)
    .setColor('#36393F')
    emdMsg.edit(embed2);
  })
  if(globalErr) return;

  let teamSize = (reaction.first().name == 'five') ? 5 : (reaction.first().name == 'four') ? 4 : 3

  let objArr = [{
    player: message.author.id,
    playerScore: 0
  }];

  let dbRes = db.collection('active_games').insertOne({
    _id: mongoID,
    code: uid,
    embed: emdMsg,
    type: gameType,
    teamSize: teamSize,
    creador: message.author,
    estado: 'starting',
    participantes: objArr,
    teamRed : [],
    teamBlue: [],
    mafia: []
  })
  emdMsg.clearReactions();

  let dbRes2 = await db.collection('Player Stats').findOneandUpdate({playerID: message.author.id},{$inc:{"games_created":1}})
  //   _id: mongoose.Types.ObjectId(),
  //   playerName: uid,
  //   playerID: gameType,
  //   g: teamSize,
  //   creador: message.author,
  //   estado: 'starting',
  //   participantes: [message.author.id],
  //   teamRed : [],
  //   teamBlue: [],
  //   mafia: []
  // })



  console.log('Checkinsicistion - ',dbRes);
  console.log('UpdateNone - ',dbRes2);

  let embed4 = new Discord.RichEmbed()
  .addField(`${gameType} Mafia Game Created | #${uid}`,`Hit ⬆ to join the game!`)
  .setColor('#36393F')
  emdMsg.edit(embed4);

  await emdMsg.react('⬆');
  await emdMsg.react('⬇');

  let filter3 = (reaction, user) => {
    return ['⬆','⬇'].includes(reaction.emoji.name) && user.id != client.user.id
  };
  let gameLobby = await new emdMsg.Discord.ReactionCollector(filter3,{time: 300000})

  var cancelEnd = false;

  gameLobby.on('end', coll=>{
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
      db.collection('active_games').findOneandUpdate({_id:mongoID},{$set:{teamRed:redTeam,teamBlue:blueTeam,mafia:mafia,estado:'in progress'}});
      Nextphase.emit('start',mongoID,emdMsg,dbRes);
    }
  })

  let players = []

  gameLobby.on('collect', async r =>{
    let reactor = await r.users.last();
    if (estado!='starting') return;



    if (r._emoji.name == '⬇') {
          if(players.includes(reactor)){
            players = players.filter((ele)=>{
              return ele != reactor;
            });
            let embed6 = new Discord.RichEmbed()
            .setTitle(`You left Mafia Game #${uid}'s Lobby`)
            .setColor('#36393F');
            emdMsg.channel.send(embed6).delete(2000)
          }else{
            let embed6 = new Discord.RichEmbed()
            .setTitle(`You haven't joined Mafia Game #${uid}`)
            .setColor('#36393F');
            emdMsg.channel.send(embed6).delete(2000)
          }
      }


      if (r._emoji.name == '⬆') {
        players.push(reactor)
        let embed6 = new Discord.RichEmbed()
        .addField(`${gameType} Mafia Game Created | #${uid}`,`Hit ⬆ to join the game!`)
        .setColor('#36393F');
        let joinedStr = ''
        for(let player of players){
          joinedStr += `\n ${player.username} joined lobby!`
        }
        embed6.addField(`__Players Joined:__`,`${joinedStr}`);
        emdMsg.edit(embed6)

        if(players.length == teamSize*2){
          estado = 'generating';
          cancelEnd = true;
          gameLobby.emit('end');
        }

      }

  })

//nextphase

Nextphase.on('start', async (mongoID,embedMsg,database) => {
  let gameData = await db.collection('active_games').findOne({_id:mongoID});
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


  let res = await db.collection('active_games').findOne({'creador.user.id':message.author.id});
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
  .addField(`Your ${database.type} Mafia Game | #${database.code} Has Started!`,`*When the game is over the game creator will click ☑ to begin the next phase*`)
  .addField(`__Game Creator:__`,`${database.creador}`)
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
