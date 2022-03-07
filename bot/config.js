module.exports = {
  prefix: "-",

  adminChannel: {
    name: "bot-admin",
    id: "824254161998446622",
  },
  registerChannel: {
    name: "team-registration",
    id: "950410066044022864",
  },
  helpChannel: {
    name: "❓-faqs",
    id: "939543549735759892",
  },
  announcementChannel: {
    name: "📌-announcements",
    id: "936536465515642920",
  },
  participantsRoleId: "785088756070744065",
  teamsEvaluateRoleid: "822145050410352690",

  participantTeamNamePrefix: "Team-",
  participantsCSVPath: "./hack-p.csv",

  antiSpamConfig: {
    warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
    kickThreshold: 5, // Amount of messages sent in a row that will cause a kick.
    banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
    maxInterval: 5000, // Amount of time (in milliseconds) in which messages are considered spam.
    warnMessage: "{@user}, Please stop spamming. ", // Message that will be sent in chat upon warning a user.
    kickMessage: "**{user_tag}** has been kicked for spamming .", // Message that will be sent in chat upon kicking a user.
    banMessage: "**{user_tag}** has been banned for spamming.", // Message that will be sent in chat upon banning a user.
    maxDuplicatesWarning: 4, // Amount of duplicate messages that trigger a warning.
    maxDuplicatesKick: 6, // Amount of duplicate messages that trigger a warning.
    maxDuplicatesBan: 8, // Amount of duplicate messages that trigger a warning.
    exemptPermissions: ["ADMINISTRATOR"], // Bypass users with any of these permissions.
    ignoreBots: true, // Ignore bot messages.
    verbose: false, // Extended Logs from module.
    ignoredMembers: [], // Array of User IDs that get ignored.
    removeMessages: true, // If the bot should remove all the spam messages when taking action on a user!
  },
};
