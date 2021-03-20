const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors({ origin: `${process.env.CLIENT_URL}`, credentials: true }));

// * DB
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.log("Connection to MongoDB failed.\n", err);
    console.log("Connected to MongoDB");
  }
);

// * Route imports
const faq = require("./routes/faq");

// * Routes
app.use("/api/faq", faq);

// * Server
const port = process.env.PORT || 5000;
const server = app.listen(port, console.log(`Server started on port ${port}`));

// * Discord Bot
require("./bot/bot.js");

// * Production setup
// if (process.env.NODE_ENV === "production") {
//   // * Handle unhandled promise exceptions
//   process.on("uncaughtException", (err, promise) => {
//     console.log(`Error: ${err.message}`);
//   });
//   // * Handle unhandled promise rejections
//   process.on("unhandledRejection", (err, promise) => {
//     console.log(`Error: ${err.message}`);
//   });
// }
