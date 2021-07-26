const mongoose = require("mongoose");
//! add length and stuff
const {eventDB}= require('../init/db');
const faqSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      // required: true,
      default: null,
    },
    teamName: {
      type: String,
      // required: true,

      // default: null,
    },
    channelId: {
      type: String,
      required: true,
      // default: null,
    },
    authorUsername: {
      type: String,
      required: true,

      // default: null,
    },
    authorId: {
      type: String,
      required: true,

      // default: null,
    },
  },
  {
    timestamp: true,
  }
);

const Faq = eventDB.model("faq", faqSchema);

module.exports = Faq;
