const chalk = require("chalk");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "..", ".env")
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
