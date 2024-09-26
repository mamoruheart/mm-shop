const chalk = require("chalk");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
  path: path.resolve(__dirname, "..", ".env.DEV")
});

const keys = require("../config/keys");
const { database } = keys;

const setupDB = async () => {
  try {
    mongoose.set("useCreateIndex", true);
    mongoose
      .connect(database.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      .then(() =>
        console.log(`${chalk.green("✓")} ${chalk.blue("MongoDB Connected!")}`)
      )
      .catch((err) => console.log(err));
  } catch (err) {
    console.error("setupDB:", err?.message);
  }
};

module.exports = setupDB;
