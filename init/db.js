const mongoose = require("mongoose");

const eventDB = mongoose.createConnection(
  process.env.MONGO_URI_EVENT,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) console.error("Connection to Event DB failed.");
    return console.log("Connected to Event DB.");
  }
);

const commonDB = mongoose.createConnection(
  process.env.MONGO_URI_COMMON,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) console.error("Connection to Common DB failed.");
    return console.log("Connected to Common DB.");
  }
);

module.exports = {
  eventDB,
  commonDB,
};