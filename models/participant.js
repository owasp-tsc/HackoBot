const mongoose = require("mongoose");
//! add length and stuff
const {eventDB}= require('../init/db');
const participantSchema = mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "Team",
      default: null,

      // required: true,
    },
    teamName: {
      type: String,
      required: true,
      // unique: true,
    },
    teamNumber: {
      type: Number,
      // required: true,
      default: null,
    },
    discordId: {
      type: String,
      default: null,
    },
    discordTag: {
      type: String,
      default: null,
    },
    registeredOnDiscord: {
      type: Boolean,
      default: false,
    },
    profilePicLink : String,
    phoneNo : Number,
    rollNo : Number,
    year : String,
    name: {
      type: String,
      required: true,
    },
    college: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    stage: {
      type: String,
    },
  },
  {
    timestamp: true,
  }
);

const Participant = eventDB.model("participant", participantSchema);

module.exports = Participant;
