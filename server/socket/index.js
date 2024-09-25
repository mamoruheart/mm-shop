const socketio = require("socket.io");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = mongoose.model("User");

const keys = require("../config/keys");
const { ROLES } = require("../constants");
const support = require("./support");

const authHandler = async (socket, next) => {
  try {
    const { token = null } = socket.handshake.auth;
    if (token) {
      const { jwtSecret, myBearerPrefix } = keys.jwt;

      const [authType, tokenValue] = token.trim().split(" ");
      if (authType !== myBearerPrefix || !tokenValue) {
        return next(new Error("no token"));
      }

      const payload = jwt.verify(tokenValue, jwtSecret);
      const id = payload.id.toString();
      const user = await User.findById(id);
      if (!user) {
        return next(new Error("no user found"));
      }

      const u = {
        id,
        role: user?.role,
        isAdmin: user.role === ROLES.Admin,
        name: `${user?.firstName} ${user?.lastName}`,
        socketId: socket.id,
        messages: []
      };

      const existingUser = support.findUserById(id);
      if (!existingUser) {
        support.users.push(u);
      } else {
        existingUser.socketId = socket.id;
      }
    } else {
      return next(new Error("no token"));
    }

    next();
  } catch (err) {
    console.error("authHandler:", err?.message);
    next(err);
  }
};

const socket = (server) => {
  try {
    const io = socketio(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.use(authHandler);

    const onConnection = (socket) => {
      support.supportHandler(io, socket);
    };

    io.on("connection", onConnection);
  } catch (err) {
    console.error("socket server error:", err?.message);
  }
};

module.exports = socket;
