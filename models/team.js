const mongoose = require("mongoose");
//! add length and stuff
const teamSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    number: { type: Number, required: true },
  },
  {
    timestamp: true,
  }
);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
