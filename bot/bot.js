const Discord = require("discord.js");
const fs = require("fs");

const { prefix, participantsCSVPath, antiSpamConfig } = require("./config");
const client = new Discord.Client();
const guild = new Discord.Guild(client);
const AntiSpam = require("./util/antispam");

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./bot/commands")
  .filter((file) => file.endsWith(".js"));

for (commandFile of commandFiles) {
  const command = require(`./commands/${commandFile}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  client.user.setActivity('-help',{type:"LISTENING"});
console.log('Ready!');
});


const antiSpam = new AntiSpam(antiSpamConfig);

// client.on("message", (message) => {
//   if (message.author.id === "729683555520610356") {
//     message.channel.send("ARYAMAN SIR KHATRA");
//   } else if (message.author.id === "718111655753416765") {
//     message.channel.send("SUSHI MA'AM ZINDABAAD");
//   } else if (message.author.id === "693474602864738366") {
//     message.channel.send("SUBHAM BHAI ZEHER ");
//   }
// });
client.on("message", (message) => {
  antiSpam.message(message);
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // if (!client.commands.has(commandName)) return;
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return;
  if (command.args && !args.length) {
    return message.channel.send(
      `You didn't provide any arguments, ${message.author}!`
    );
  }
  try {
    command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

require("./util/initParticipantsFromCSV")(participantsCSVPath);

client.login(process.env.BOT_SECRET_TOKEN);
