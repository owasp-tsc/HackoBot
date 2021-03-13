const Discord = require("discord.js");
const fs = require("fs");

const { prefix } = require("./config.json");
const client = new Discord.Client();
const guild = new Discord.Guild(client);

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
