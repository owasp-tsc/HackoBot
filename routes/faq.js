const router = require("express").Router();

// * Models

const Faq = require("../models/faq");

// * Middleware

//* Validation

router.get("/", async (req, res) => {
  console.log("a");
  res.send({ data: "faqs " });
});

module.exports = router;
