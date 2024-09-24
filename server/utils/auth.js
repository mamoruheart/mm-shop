const jwt = require("jsonwebtoken");

const keys = require("../config/keys");
const { secret, myBearerPrefix } = keys.jwt;

const checkAuth = (req) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith(`${myBearerPrefix} `)
    ) {
      return null;
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.error("checkAuth:", error);
    return null;
  }
};

module.exports = checkAuth;
