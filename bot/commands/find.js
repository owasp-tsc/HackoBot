const { participantTeamNamePrefix, adminChannel } = require("../config");

const {
  embeds,
  createMiddlewarePipeline,
  allowedInChannel,
} = require("../util");

module.exports = {
  name: "find",
  description: "find user!",
  aliases: ["anc"],
  execute: (message, args) =>
    createMiddlewarePipeline(allowedInChannel(adminChannel), execute)(
      message,
      args
    ),
};
async function execute(message, args) {
  //   console.log(args[0]);
  //   const m = message.guild.members.find((m) => m.id === args[0]);
  //   const m = await message.guild.fetchMembers();
  //   const m = message.guild.fetchMembers.cache.forEach((c) => console.log(c.nickname));
  //   const m = message.guild.members.cache.forEach((c) => console.log(c.id));
  //   message.guild.members
  //     .fetch()
  //     .then((d) => console.log(d))
  //     .catch((error) => console.log(error));
  // const m = await message.guild.members.cache();
  //   console.log(m);
  //   message.channel.send({ embed: embeds(null, `Member found: ${m.nickname}`) });
}
