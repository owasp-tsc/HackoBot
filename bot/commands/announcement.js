const {
  participantTeamNamePrefix,
  announcementChannel,
  participantsRoleId,
} = require("../config");

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
  message.guild.channels.cache
    .filter((ch) => ch.name.startsWith(participantTeamNamePrefix.toLowerCase()))
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
