const mongoose = require("mongoose");
const { commonDB } = require("../init/db");
const BaseTeam = require("./BaseTeam");

const participantSchema = new mongoose.Schema(
  {},
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
participantSchema.virtual("teams", {
  ref: BaseTeam,
  localField: "_id",
  foreignField: "members",
});

module.exports = commonDB.model("Participant", participantSchema);