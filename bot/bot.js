const Discord = require("discord.js");
const fs = require("fs");

const {
  prefix,
  participantsCSVPath,
  antiSpamConfig,
  adminChannel,
} = require("./config");
const client = new Discord.Client();
const AntiSpam = require("./util/antispam");

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./bot/commands")
  .filter((file) => file.endsWith(".js"));

for (commandFile of commandFiles) {
  const command = require(`./commands/${commandFile}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  client.user.setActivity("-help", { type: "LISTENING" });
  console.log("Ready!");
});

const antiSpam = new AntiSpam(antiSpamConfig);
const count = {};

client.on("message", (message) => {
  if (
    !(
      (
        message.channel.id === "789744750957428778" ||
        message.channel.id === "821813318775472179"
      )
      // ||
      // message.channel.id === adminChannel.id
    )
  )
    return;
  const OP_LOG = [
    {
      id: "729683555520610356",
      line: "ARYAMAN SIR KHATRA DESIGNER",
    },
    {
      id: "718111655753416765",
      line: "SUSHI KO REDBULL DEDO PLSSSS",
    },
    {
      id: "693474602864738366",
      line: "SUBHAM BHAI ZEHER ",
    },
    {
      id: "700442565278957639",
      line: "AKSHAT BHAIYA JSON AA GAYI ",
    },
    {
      id: "693157266416992277",
      line: "FABHIL OOOOOOOOOO NICEEE",
    },
    {
      id: "694529909032222832",
      line: "HELOOOOOOOOOOOOOOOOOOOOOOOOO TANVEEEEEEEEEEEEEEEERRRRRRR",
    },
    {
      id: "756448363968331798",
      line: "YOSHNA IS ALWAYS WILD",
    },
    {
      id: "241079970368192512",
      line: "Rish Sir OP",
    },
    {
      id: "714412271023161405",
      line: "Akshay jingle bell geniusboii",
    },
    {
      id: "693477263458566194",
      line: "PALAK KO FIRSE FOMO HO REHA",
    },
    {
      id: "710061073889493104",
      line: "Kritik Bhai Party Dede ",
    },
    {
      id: "647148724958658579",
      line: "ROHAN BHAIYA NE TOH FUNNY KARDIYA ",
    },
    {
      id: "482505313539457027",
      line: "PRATEEK 9.34 wala",
    },
    {
      id: "755271249072095282",
      line: "PRAJIT - BRO TAGLINE DELETE NAHI HOGI",
    },
    {
      id: "631891628948324372",
      line: "HIYA the professional slayer",
    },
    {
      id: "755436589097812034",
      line: "shutup naman xd",
    },
    {
      id: "755284373703491654",
      line: "Palak is without paneer",
    },
    {
      id: "756387257065144390",
      line: "Devanshi ULTRA MODEST",
    },
    {
      id: "551046575074574336",
      line: "Lavish- Chill karo",
    },
    {
      id: "726146289594531871",
      line: "Aastik loneliness OP",
    },
    {
      id: "762026111134728194",
      line: "Arshia - Main cute hoon mujhe maaf kardo",
    },
    {
      id: "748962228316799042",
      line: "Nipun - udte teer wala caption OP",
    },
    {
      id: "634420937671835679",
      line: "GOVIND BHAIYA ANGUR KHA RAHE HAIN",
    },
    {
      id: "755289888907198516",
      line: "Gullu  OP",
    },
  ];

  const OP = OP_LOG.find((op) => op.id === message.author.id);
  if (!OP) return;
  if (!count[OP.id]) count[OP.id] = 0;
  count[OP.id]++;
  if (count[OP.id] >= 1) {
    message.channel.send(OP.line);
    count[OP.id] = 0;
  }
});

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

// require("./util/initParticipantsFromCSV")(participantsCSVPath);

client.login(process.env.BOT_SECRET_TOKEN);
