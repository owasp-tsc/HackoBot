const mongoose = require("mongoose");
//! add length and stuff
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
      required: true,

      // default: null,
    },
    authorUsername: {
      type: String,
      required: true,

      // default: null,
    },
  },
  {
    timestamp: true,
  }
);

const Faq = mongoose.model("faq", faqSchema);

module.exports = Faq;
