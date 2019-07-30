const Discord = require("discord.js");
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const Nextphase = new MyEmitter();
const mongoose = require('mongoose');
const num0 = '../src/0-Number-PNG.png'
const num1 = '../src/1-Number-PNG.png'
const num2 = '../src/2-Number-PNG.png'
const num3 = '../src/3-Number-PNG.png'
const num4 = '../src/4-Number-PNG.png'
const num5 = '../src/5-Number-PNG.png'
const num6 = '../src/6-Number-PNG.png'
const num7 = '../src/7-Number-PNG.png'
const num8 = '../src/8-Number-PNG.png'
const num9 = '../src/9-Number-PNG.png'




module.exports.run = async (client, message, args, prefix, db) => {
  if(message.channel.type=='dm')return;

  let cusEm1=true;
  let cusEm2=true;

  var emoji1 = await client.emojis.get(process.env.rocket_league_emoji_id)
  var emoji2 = await client.emojis.get(process.env.league_of_legends_emoji_id)
  if (!emoji1){emoji1={name:'🇷',id:'🇷'};cusEm1=false;}
  if (!emoji2){emoji2={name:'🇱',id:'🇱'};cusEm2=false;}

  let emojiRep1 = (!cusEm1) ? emoji1.name : emoji1
  let emojiRep2 = (!cusEm2) ? emoji2.name : emoji2

  let res = await db.collection('Active Games').findOne({'creador':message.author.id})
  if (res) {
    let embed = new Discord.RichEmbed()
    .setTitle(`You already have a game running!`)
    .setColor('#36393F')
    .setThumbnail(client.user.avatarURL)
    message.channel.send(embed);
    return;
  }else{
    let check2 = await db.collection('Active Games').findOne({'participantes':{ $elemMatch: {playerID: message.author.id}}});
    if (check2) {
      let embed = new Discord.RichEmbed()
      .setTitle(`You already in a game!`)
      .setColor('#36393F')
      .setThumbnail(client.user.avatarURL)
      message.channel.send(embed);
      return;
    }
}


  var globalErr = false;
  var estado = 'starting';

  let embed = new Discord.RichEmbed()
  .addField(`Welcome to CoachRiver's Mafia Bot!`,`Choose the game you would like to start`)
  .addField(`Rocket League`,`${emojiRep1}`,true)
  .addField(`League of Legends`,`${emojiRep2}`,true)
  .setColor('#36393F')
  .setThumbnail(client.user.avatarURL)
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
  .setThumbnail(client.user.avatarURL)
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

  let teamSize = (reaction.first()._emoji.name == '5⃣') ? 5 : (reaction.first()._emoji.name == '4⃣') ? 4 : 2

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
    participantes: [],
    gameVotes: [],
    voteCounter: 0,
    teamRed : [],
    teamBlue: [],
    mafia: []
  })
  await emdMsg.clearReactions();




  let numPics = ['https://cdn.discordapp.com/attachments/605555031508385918/605555049363669007/0-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556442866384907/1-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556445055942679/2-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556447862063104/3-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556449958952970/4-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556452052172800/5-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556456288288768/6-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556458490429470/7-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556461266796569/8-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556463292645378/9-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556465322950675/10-Number-PNG.png']



  let embed4 = new Discord.RichEmbed()
  .addField(`${gameType} Mafia Game Created | #${uid}`,`Hit ⬆ to join the game!`)
  .setColor('#36393F')
  .setThumbnail(client.user.avatarURL)
  .setFooter(`/${2*teamSize} have joined the game!`, `${numPics[1]}`);
  emdMsg.edit(embed4);

  await emdMsg.react('⬆');
  await emdMsg.react('⬇');

  let filter3 = (reaction, user) => {
    return ['⬆','⬇'].includes(reaction.emoji.name) && user.id != client.user.id
  };
  let gameLobby = emdMsg.createReactionCollector(filter3,{time: 300000})

  var cancelEnd = false;

  let players = [message.author.id]

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
        let rand = players[Math.floor(Math.random() * players.length)];
        (redTeam.includes(rand)) ? null : redTeam.push(rand)
      }
      blueTeam = players.filter(d => !redTeam.includes(d));
      if(gameType=='League of Legends'){
        mafia.push(redTeam[Math.floor(Math.random() * redTeam.length)])
        mafia.push(blueTeam[Math.floor(Math.random() * blueTeam.length)])
      }else{
        mafia.push(players[Math.floor(Math.random() * players.length)])
      }

      let partics = []
      for(let p of players){
        newObj ={
          playerID: p,
          playerScore: 0
        }
        partics.push(newObj)
      }


      db.collection('Active Games').findOneAndUpdate({_id:mongoID},{$set: {participantes: partics,teamRed: redTeam, teamBlue: blueTeam, mafia:mafia, estado:'in progress'}});
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
            .setFooter(`/${2*teamSize} have joined the game!`, `${numPics[players.length]}`)
            .setColor('#36393F');
            let joinedStr = ''
            for(let playerID of players){
              joinedStr += `\n ${client.users.get(playerID).username } joined lobby!`
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
        .setFooter(`/${2*teamSize} have joined the game!`, `${numPics[players.length]}`)
        .setThumbnail(client.user.avatarURL)
        .setColor('#36393F');
        let joinedStr = ''
        for(let playerID of players){
          joinedStr += `\n ${client.users.get(playerID).username } joined lobby!`
        }
        embed6.addField(`__Players Joined:__`,`${joinedStr}`);
        emdMsg.edit(embed6)

        if(players.length >= teamSize*2){
          estado = 'generating';
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
  await embedMsg.clearReactions();
  let gameData = await db.collection('Active Games').findOne({_id:mongoID});
  var globalErr2 = false;
  let e1 = new Discord.RichEmbed()
  .setTitle(`Pssst! You are the **MAFIA**, throw some games bruh!`)
  .setThumbnail(client.user.avatarURL)
  .setColor('#36393F');

  for(let mafia of gameData.mafia){
    try{
      client.users.get(mafia).send(e1)
    }catch{
      let name = client.users.get(mafia).username || 'unknown'
      let e2 = new Discord.RichEmbed()
      .addField(`Unable to DM the mafia ${name} id ${mafia}, Game #${gameData.code} Cancelled!`,`Next time please ensure all players are still in the server and that you have not blocked the bot...`)
      .setThumbnail(client.user.avatarURL)
      .setColor('#36393F');
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
    redStr+=`\n${client.users.get(user).username}`
  }
  for(let user of res.teamBlue){
    blueStr+=`\n${client.users.get(user).username}`
  }

  let embed = new Discord.RichEmbed()
  .addField(`Your ${res.type} Mafia Game | #${res.code} Has Started!`,`*When the game is over the game creator will click ☑ to begin the next phase*`)
  .addField(`__Game Creator:__`,`${client.users.get(res.creador).username || res.creador}`)
  .addField(`__Red Team:__`,`${redStr}`)
  .addField(`__Blue Team:__`,`${blueStr}`,true)
  .setThumbnail(client.user.avatarURL)
  .setColor('#36393F')
  embedMsg.edit(embed);


  let emdMsg = embedMsg;

  let filter = (reaction, user) => {
    return ['☑'].includes(reaction.emoji.name) && user.id === message.author.id; }

  await embedMsg.react('☑')
  let reaction = await emdMsg.awaitReactions(filter, { max: 1, time: 7200000, errors: ['time'] }).catch( error=>{
    globalErr = true;
    try{
      let embed2 = new Discord.RichEmbed()
      .setTitle(`Timeout | 2 hours passed without a response`)
      .setThumbnail(client.user.avatarURL)
      .setColor('#36393F')
      emdMsg.edit(embed2);
  }catch{}
  })


  await embedMsg.clearReactions();
  if(globalErr2) return;


  let fembed2 = new Discord.RichEmbed()
  .setTitle(`Your ${res.type} Mafia Game | #${res.code} Is **FINISHED**\n\n${message.author.username} tell me which team won\n\n**Red Team** or **Blue Team**?`)
  .setThumbnail(client.user.avatarURL)
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
      .setThumbnail(client.user.avatarURL)
      .setColor('#36393F')
      emdMsg.edit(embed2);
  }catch{}
  })

  if(globalErr2) return;

  let opts ={
    Red: gameData.teamRed,
    Blue: gameData.teamBlue,
  }

  let numbers = {1: '1⃣', 2: '2⃣', 3: '3⃣', 4: '4⃣', 5: '5⃣', 6: '6⃣', 7: '7⃣', 8: '8⃣', 9: '9⃣', 10: '🔟'}
  let color;

  var allRedButMaf = gameData.teamRed
  var allBlueButMaf = gameData.teamBlue

  votesReady(gameData,emdMsg);

  for(let duid of gameData.mafia){
    allRedButMaf = allRedButMaf.filter( (m) => m!=duid )
    allBlueButMaf = allBlueButMaf.filter( (m) => m!=duid )
  }

  db.collection('Active Games').findOneAndUpdate({_id:mongoID},{$set: {estado:'ending'}});

  if(gameData.type == 'League of Legends'){
    if (reaction2.first().name == '🔴'){
      color='Red'
    }
    if (reaction2.first().name == '🔵'){
      color='Blue'
    }

    await emdMsg.clearReactions();
    let fembed3 = new Discord.RichEmbed()
    .setTitle(`Your ${res.type} Mafia Game | #${res.code} Is **FINISHED**\n\n Check your DMs Each member has to vote now!`)
    .setThumbnail(client.user.avatarURL)
    .setColor('#36393F')
    emdMsg.edit(fembed3);


    for(let duid of allRedButMaf){
    let forRedTeam = new Discord.RichEmbed()
    .addField(`Time to Vote!`,`Who do you think the mafia on your team was?`)
    .addField(`Select an option:`,`${ opts[`Red`].map( (id,i) => `\n ${numbers[`${++i}`]} ${ client.users.get(`${id}`).username }`)}` )
    .setFooter(`You have 30 seconds to choose`)
    .setThumbnail(client.user.avatarURL)
    .setColor('#36393F')
    let msgToPlayer = await client.users.get(duid).send(forRedTeam);
    for(var p=1;p<=gameData.teamRed.length;p++){
      await msgToPlayer.react(`${numbers[`${p}`]}`)
    }

    let filterChoice = (reaction, user) => {
      return ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣','🔟'].includes(reaction.emoji.name) && user.id != client.user.id
    };
    let playerChoice = msgToPlayer.createReactionCollector(filterChoice,{max:1,time: 30000}).catch(async e=>{
      let awaited2 = await db.collection('Active Games').findOneAndUpdate({_id:gameData._id},{$inc:{voteCounter:1}})
    })

    playerChoice.on('collect', async r=>{
        let choiceMade = (r._emoji.name=='1⃣') ? 1 : (r._emoji.name=='2⃣') ? 2 : (r._emoji.name=='3⃣') ? 3 : (r._emoji.name=='4⃣') ? 4 : (r._emoji.name=='5⃣') ? 5 : (r._emoji.name=='6⃣') ? 6 : (r._emoji.name=='7⃣') ? 7 : (r._emoji.name=='8⃣') ? 8 : (r._emoji.name=='9⃣') ? 9 : (r._emoji.name=='🔟') ? 10 : 11
        let awaited1 = await db.collection('Active Games').findOneAndUpdate({_id:gameData._id},{$push: {gameVotes:{$each: [ { playerID: duid, score: choiceMade }]}}})
        let awaited2 = await db.collection('Active Games').findOneAndUpdate({_id:gameData._id},{$inc:{voteCounter:1}})
    })
  }

    for(let duid of allBlueButMaf){
    let forBlueTeam = new Discord.RichEmbed()
    .addField(`Time to Vote!`,`Who do you think the mafia on your team was?`)
    .addField(`Select an option:`,`${ opts[`Blue`].map( (id,i) => `\n ${numbers[`${++i}`]} ${client.users.get(id).username}`)}`)
    .setFooter(`You have 30 seconds to choose`)
    .setThumbnail(client.user.avatarURL)
    .setColor('#36393F')
    let msgToPlayer = await client.users.get(duid).send(forBlueTeam);
    for(var p=1;p<=gameData.teamBlue.length;p++){
      await msgToPlayer.react(`${numbers[`${p}`]}`)
    }
    let filterChoice = (reaction, user) => {
      return ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣','🔟'].includes(reaction.emoji.name) && user.id != client.user.id
    };
    let playerChoice = msgToPlayer.createReactionCollector(filterChoice,{max:1,time: 30000}).catch(async e=>{
      let awaited2 = await db.collection('Active Games').findOneAndUpdate({_id:gameData._id},{$inc:{voteCounter:1}})
    })

    playerChoice.on('collect', async r=>{
        let choiceMade = (r._emoji.name=='1⃣') ? 1 : (r._emoji.name=='2⃣') ? 2 : (r._emoji.name=='3⃣') ? 3 : (r._emoji.name=='4⃣') ? 4 : (r._emoji.name=='5⃣') ? 5 : (r._emoji.name=='6⃣') ? 6 : (r._emoji.name=='7⃣') ? 7 : (r._emoji.name=='8⃣') ? 8 : (r._emoji.name=='9⃣') ? 9 : (r._emoji.name=='🔟') ? 10 : 11
        let awaited1 = await db.collection('Active Games').findOneAndUpdate({_id:gameData._id},{$push: {gameVotes:{$each: [ { playerID: duid, score: choiceMade }]}}})
        let awaited2 = await db.collection('Active Games').findOneAndUpdate({_id:gameData._id},{$inc:{voteCounter:1}})
    })
  }
    // let embed4 = new Discord.RichEmbed()
    // .addField(`${gameType} Mafia Game Created | #${uid}`,`Hit ⬆ to join the game!`)
    // .setThumbnail(client.user.avatarURL)
    // .setColor('#36393F')
    // emdMsg.edit(embed4);





  }else{

  }





});








async function votesReady(gameData,embMsg){
    const changeStream = collection.watch();
    changeStream.on('change', async (next) => {
      if(next.fullDocument['estado']=='ending' && next.fullDocument['_id']==gameData._id){
          if ((next.fullDocument['teamSize']-2)==next.fullDocument['voteCounter']) {

            

          }else{
            let numPics = ['https://cdn.discordapp.com/attachments/605555031508385918/605555049363669007/0-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556442866384907/1-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556445055942679/2-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556447862063104/3-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556449958952970/4-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556452052172800/5-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556456288288768/6-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556458490429470/7-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556461266796569/8-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556463292645378/9-Number-PNG.png','https://cdn.discordapp.com/attachments/605555031508385918/605556465322950675/10-Number-PNG.png']

            let e = new Discord.RichEmbed()
            .setTitle(`Your ${res.type} Mafia Game | #${res.code} Is **FINISHED**\n\n Check your DMs Each member has to vote now!`)
            .setThumbnail(client.user.avatarURL)
            .serFooter(`/${2*teamSize-2} have joined the game!`, `${numPics[`${next.fullDocument['voteCounter']}`]}`)
            .setColor('#36393F')
            embMsg.edit(e)
          }
      }
      // let oldGames = await db.collection('Old Games');
      // next.fullDocument['timeStamps']['confirmed'] = new Date().toISOString();
      // oldGames.insertOne(next.fullDocument);
      // collection.deleteOne({_id:next.fullDocument._id});
      //
      // let e = new Discord.RichEmbed()
      // .setTitle('Thank you for using Lucille\'s Shop')
      // .addField(`Your Transaction ID #${next.fullDocument._id}`,'Your payment has been successful! Please wait patiently while we process your order. We will contact you upon completion.')
      // .setColor('Black');
      //
      // bot.users.get(next.fullDocument.discordID).send(e)

    });
}













}

module.exports.info = {
  name: "newgame",
  aliases: [],
  description: "To create a new mafia game",
  usuage: "newgame",
}
