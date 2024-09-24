const uuidv4 = require("uuid").v4;

const users = [];
const messages = [];

const findUserById = (id) => users.find((x) => x.id === id);
const findUserBySocketId = (socketId) =>
  users.find((x) => x.socketId === socketId);

const updatedUserStatus = (user, status) => {
  const existingUser = findUserById(user.id);
  if (existingUser) {
    existingUser.online = status;
  }
};

exports.supportHandler = (io, socket) => {
  socket.on("connectUser", async () => {
    try {
      const user = findUserBySocketId(socket.id);

      /**
       * if user connected is `admin` => notify everyone
       * if user connected is `not admin` => notify all admins
       */
      if (user) {
        user.online = true;
        if (user.isAdmin) {
          socket.broadcast.emit("connectUser", user);
        } else {
          const admins = users.filter(
            (x) => x.isAdmin === true && x.online === true
          );
          admins.map((admin) =>
            socket.to(admin.socketId).emit("connectUser", user)
          );
        }
      }
    } catch (err) {
      console.error("socket__connectUser:", err?.message);
    }
  });

  socket.on("getUsers", async () => {
    try {
      const user = findUserBySocketId(socket.id);
      const notMe = users.filter((x) => x.socketId !== socket.id);
      const adminUsers = users.filter((x) => x.isAdmin === true);
      const userDocs = user?.isAdmin ? notMe : adminUsers;
      io.to(socket.id).emit("getUsers", userDocs);
    } catch (err) {
      console.error("socket__getUsers:", err?.message);
    }
  });

  socket.on("getMessages", () => {
    try {
      const user = findUserBySocketId(socket.id);
      const sentMsgs = messages.filter((m) => m.from === user?.id);
      const receivedMsgs = messages.filter((m) => m.to === user?.id);
      io.to(socket.id).emit("getMessages", [...sentMsgs, ...receivedMsgs]);
    } catch (err) {
      console.error("socket__getMessages:", err?.message);
    }
  });

  socket.on("message", (body) => {
    try {
      const { text, to } = body;
      const user = findUserBySocketId(socket.id);
      const userTo = findUserById(to);

      const message = {
        id: uuidv4(),
        value: text,
        time: Date.now(),
        user: user,
        from: user.id,
        to: userTo?.id
      };

      messages.push(message);
      io.to(userTo.socketId).to(user.socketId).emit("message", message);
    } catch (err) {
      console.error("socket__message:", err?.message);
    }
  });

  socket.on("disconnect", async () => {
    try {
      const user = findUserBySocketId(socket.id);
      if (user) {
        updatedUserStatus(user, false);
        user.online = false;
        socket.broadcast.emit("disconnectUser", user);
      }
    } catch (err) {
      console.error("socket__disconnect:", err?.message);
    }
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err?.message}`);
  });
};

exports.users = users;
exports.findUserById = findUserById;
