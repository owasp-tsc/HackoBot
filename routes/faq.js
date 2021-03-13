const router = require("express").Router();

// * Models

const Faq = require("../models/faq");

// * Middleware

//* Validation

// router.get("/", async (req, res) => {
//   console.log("a");
//   const faqs = await Faq.find();
//   //   const faq = new Faq({
//   //     question: "question2",
//   //     answer: "ans2",
//   //   });
//   //   await faq.save();
//   res.send({ data: faqs });
// });

module.exports = router;
