const Participant = require("../../models/participant");
const {
  prefix,
  participantTeamNamePrefix,
  registerChannel,
} = require("../config");

const { allowedInChannel, createMiddlewarePipeline } = require("../util");
const { validateEmail } = require("../validators");

module.exports = {
  name: "register",
  discription: "Lets you register for discord!",
  usage: `${prefix}register`,
  aliases: ["reg"],

  execute: (message, args) =>
    createMiddlewarePipeline(allowedInChannel(registerChannel), execute)(
      message,
      args
    ),
};

//! find person by id on admin

async function execute(message, args) {
  if (!args.length) return message.reply("Email cannot be blank!");
  // return message.reply("You can't keep the team name blank!");

  const { value: email, error } = validateEmail(args[0]);
  if (error) return message.channel.send("Invalid Eamil address");

  const [participant] = await Participant.find({
    email,
  }).select(["email", "registeredOnDiscord", "teamName"]);
  //! check stage ?

  if (!participant)
    return message.channel.send(
      "You are not registered on devfolio{mightt be updated in some time }"
    ); //!

  if (participant.registeredOnDiscord)
    return message.channel.send("Email already registered on discord");

  //role name
  const team = participantTeamNamePrefix + participant.teamName;
  // if role already exist
  if (
    message.member.roles.cache.some((r) =>
      r.name.startsWith(participantTeamNamePrefix)
    )
  )
    return message.channel.send("Participant Already Registered on discord "); //! change

  participant.discordId = message.author.id;
  participant.discordTag = message.author.tag;
  participant.registeredOnDiscord = true;
  await participant.save();

  if (message.guild.roles.cache.find((r) => r.name === team)) {
    const role = message.guild.roles.cache.find((r) => r.name === team);
    return message.member.roles
      .add(role)
      .then((ff) => {
        console.log("rols assigned");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  let ID;
  try {
    message.guild.roles
      .create({
        data: {
          name: team,
          color: "#14c7cc",
          permissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
        },
      })
      .then((role) => {
        // console.log(role);
        message.member.roles
          .add(role)
          .then((ff) => {
            console.log("rols assigned");
          })
          .catch((err) => {
            console.log(err);
          });

        message.guild.channels
          .create(team, {
            name: team,
            type: "category",
            permissionOverwrites: [
              {
                id: message.guild.id,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: role.id,
                allow: ["VIEW_CHANNEL"],
              },
            ],
          })
          .then((channel) => {
            ID = channel.id;
          });

        // creating text channel

        message.guild.channels
          .create(team, {
            name: team,
            type: "text",
            permissionOverwrites: [
              {
                id: message.guild.id,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: role.id,
                allow: ["VIEW_CHANNEL"],
              },
            ],
          })
          .then((channel) => {
            channel.setParent(ID);
          });

        // creating voice channel
        message.guild.channels
          .create(team, {
            name: team,
            type: "voice",
            permissionOverwrites: [
              {
                id: message.guild.id,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: role.id,
                allow: ["VIEW_CHANNEL"],
              },
            ],
          })
          .then((channel) => {
            channel.setParent(ID);
          });
        message.channel.bulkDelete(1, true).catch((err) => {
          console.log("Err", err.message);
          message.reply(
            `There Was An Error Deleing zthe Meassages Reason : ${err.message}`
          );
        });
      });
  } catch (error) {
    console.error(error);
    message.reply("Error: Invalid command or Team can't be created!");
  }
}
