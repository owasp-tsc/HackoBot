const {
  participantTeamNamePrefix,
  announcementChannel,
  participantsRoleId,
} = require("../config");

const Team = require("../../models/team");

const {
  embeds,
  createMiddlewarePipeline,
  allowedInChannel,
} = require("../util");

module.exports = {
  name: "announcement",
  description: "announcement!",
  aliases: ["anc"],
  ignoreInHelp: true,
  execute: (message, args) =>
    createMiddlewarePipeline(allowedInChannel(announcementChannel), execute)(
      message,
      args
    ),
};
async function execute(message, args) {
  console.log(args);
  if (!args[0]) return message.channel.send("Announcement cannot be empty");
  const announcement = args.join(" ");
  const ts = await Team.find();
  console.log(ts);
  const teams = ts.reduce((acc, t) => {
    acc[t.textChannel] = t;
  }, {});

  message.guild.channels.cache
    .filter((ch) => teams[ch.id] !== undefined)
    .forEach((ch) => {
      ch.send({
        embed: embeds(
          "New Announcement",
          `<@&${participantsRoleId}> ${announcement}`
        ),
      });
    });

  message.channel.send({ embed: embeds(null, "Announcement Done") });
}
