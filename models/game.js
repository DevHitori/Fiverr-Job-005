const mongoose = require("mongoose");

const gamesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  creatorID: {type: String, required: true},
  creatorUsername: {type: String, required: true},
  playerAmt: {type: String, default: null},
  type: {type: String, default: null},
  redTeam: {type: Array},
  blueTeam:{type: Array},
  mafia:{type: Array},
});

module.exports = mongoose.model("games", gamesSchema);
