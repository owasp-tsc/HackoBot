const mongoose = require("mongoose");
//! add length and stuff
const {eventDB}= require('../init/db');
const teamSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    number: { type: Number, required: true },
    textChannel: {
      type: String,
      default: null,
    },
  },
  {
    timestamp: true,
  }
);

const Team = eventDB.model("Team", teamSchema);

module.exports = Team;
