const mongoose = require("mongoose");

const faqSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      //! add length and stuff
    },
    answer: {
      type: String,
      required: true,
      //! add length and stuff
    },
  },
  {
    timestamp: true,
  }
);

const Faq = mongoose.model("faq", faqSchema);

module.exports = Faq;
