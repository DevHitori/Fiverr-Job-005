const mongoose = require("mongoose");

const exampleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: {type: String, required: true},
  ign: {type: String, required: true},
  class: {type: String, default: null},
  isHairy: {type: Boolean, required: true},
  paymentDetails:{type: Object, default: null},
  paymentID:{type: String, default: null},
});

module.exports = mongoose.model("example", exampleSchema);
