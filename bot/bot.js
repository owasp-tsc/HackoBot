const Discord = require("discord.js");
const fs = require("fs");

const { prefix } = require("./config.json");
const client = new Discord.Client();
const guild = new Discord.Guild(client);
const AntiSpam = require('./antispam');

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./bot/commands")
  .filter((file) => file.endsWith(".js"));

for (commandFile of commandFiles) {
  const command = require(`./commands/${commandFile}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Connected as " + client.user.tag);
});

const antiSpam = new AntiSpam({
	warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
	kickThreshold: 5, // Amount of messages sent in a row that will cause a kick.
	banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
	maxInterval: 5000, // Amount of time (in milliseconds) in which messages are considered spam.
	warnMessage: '{@user}, Please stop spamming.', // Message that will be sent in chat upon warning a user.
	kickMessage: '**{user_tag}** has been kicked for spamming.', // Message that will be sent in chat upon kicking a user.
	banMessage: '**{user_tag}** has been banned for spamming.', // Message that will be sent in chat upon banning a user.
	maxDuplicatesWarning: 4, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesKick: 6, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesBan: 8, // Amount of duplicate messages that trigger a warning.
	exemptPermissions: ['ADMINISTRATOR'], // Bypass users with any of these permissions.
	ignoreBots: true, // Ignore bot messages.
	verbose: true, // Extended Logs from module.
	ignoredMembers: [], // Array of User IDs that get ignored.
	removeMessages: true, // If the bot should remove all the spam messages when taking action on a user!
});

client.on('message', (message) => {
	antiSpam.message(message);
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (!client.commands.has(command)) return;
  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

client.login(process.env.BOT_SECRET_TOKEN);
