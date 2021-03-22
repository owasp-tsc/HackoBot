const {
  participantTeamNamePrefix,
  adminChannel,
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
  execute: (message, args) =>
    createMiddlewarePipeline(allowedInChannel(adminChannel), execute)(
      message,
      args
    ),
};
async function execute(message, args) {
  if (!args[1]) return message.channel.send("Announcement cannot be empty");
  const announcement = args.splice(0).join(" ");
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
