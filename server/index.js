const express = require("express");
const cors = require("cors");
const chalk = require("chalk");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({
  path: path.resolve(__dirname, ".env")
});

const keys = require("./config/keys");
const routes = require("./routes");
const socket = require("./socket");
const setupDB = require("./utils/db");
const myPassport = require("./config/passport");

const { port } = keys;
const { sessSecret } = keys.jwt;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: sessSecret,
    resave: false,
    saveUninitialized: false
  })
);

setupDB();
myPassport(app);

app.use(routes);

const server = app.listen(port, () => {
  console.log(
    `${chalk.green("✓")} ${chalk.blue(
      `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
    )}`
  );
});

/**
 * socket is used for `auth` and `support chat`
 */
socket(server);
