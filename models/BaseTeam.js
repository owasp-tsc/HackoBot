const mongoose = require("mongoose");
const { commonDB } = require("../init/db");

const baseTemaSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
      },
    ],
  },
  {
    toObject: {
      virtuals: true,
    },
  }
);

const BaseTeam = commonDB.model("Team", baseTemaSchema);
module.exports = BaseTeam;