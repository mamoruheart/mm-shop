const express = require("express");
const cors = require("cors");
const chalk = require("chalk");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
  /**
   * @value .env.DEV | .env.TEST
   * @desc Toggle value by Git branch
   */
  path: path.resolve(__dirname, ".env.TEST")
});

const keys = require("./config/keys");
const routes = require("./routes");
const socket = require("./socket");
const setupDB = require("./utils/db");
const myPassport = require("./config/passport");

const { port } = keys;
const { sessSecret } = keys.jwt;
const { clientURL } = keys.app;

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

if (clientURL.indexOf("localhost") === -1) {
  app.use(express.static(path.resolve(__dirname, "..", "client", "dist")));
  app.get("/*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "client", "dist", "index.html"));
  });
}

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
