const mongoose = require("mongoose");
//! add length and stuff
const participantSchema = mongoose.Schema(
  {
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
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    T_ShirtSize: {
      type: String,
    },
    gender: {
      type: String,
    },
    college: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    teamName: {
      type: String,
      required: true,
    },
    devfolio: {
      type: String,
    },
    project: {
      type: String,
    },
    projectTracks: {
      type: String,
    },
    winner: {
      type: String,
    },
    field12: {
      type: String,
    },
    stage: {
      type: String,
    },
  },
  {
    timestamp: true,
  }
);

const Participant = mongoose.model("participant", participantSchema);

module.exports = Participant;
