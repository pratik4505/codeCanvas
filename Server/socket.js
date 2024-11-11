const cron = require("node-cron");
const Chat = require("./models/Chat");
const Save = require("./models/Save");
let io;
let updates = {};
exports.init = (httpServer) => {
  io = require("socket.io")(httpServer, {
    cors: {
      origin: `${process.env.CLIENT_URL}`,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
    pingInterval: 1000 * 60,
    pingTimeout: 1000 * 60 * 3,
  });

  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

exports.getUpdates = () => {
  return updates;
};

exports.runIO = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("setup", async (room) => {
      socket.join(room.toString());

      try {
        const chats = await Chat.find({
          [`members.${room}`]: { $exists: true },
        });

        chats.forEach((chat) => {
          socket.join(chat.id.toString());
        });
      } catch (error) {
        console.error("Error searching chat collection:", error);
      }
    });

    socket.on("sendMessage", (data) => {
      socket.to(data.room).emit("receiveMessage", {
        senderId: data.senderId,
        message: data.message,
        senderName: data.userData.name,
        createdAt: data.createdAt,
        room: data.room,
      });
    });

    socket.on("joinChat", (data) => {
      socket.join(data.id);
    });

    socket.on("joinCommit", async ({ commitId }) => {
      console.log("client join commit");
      socket.join(commitId);
    });

    socket.on("disconnect", async () => {
      console.log("Client disconnected");
    });

    socket.on("update", (data) => {
      const { nodeId, nodeData, action, room } = data;

      socket.to(room).emit("update", data);

      if (!updates[room]) {
        updates[room] = {};
      }

      if (action === "delete") {
        if (updates[room][nodeId]) {
          delete updates[room][nodeId];
        }
      } else {
        updates[room][nodeId] = nodeData;
      }
    });
  });
};

// Run a task every minute
cron.schedule("* * * * *", async () => {
  for (const [key, update] of Object.entries(updates)) {
    try {
      const saveDoc = await Save.findOne({ commitId: key });

      if (saveDoc) {
        const parsedCommit = JSON.parse(saveDoc.commit);
        const newCommit = JSON.stringify({ ...parsedCommit, ...update });

        saveDoc.commit = newCommit;

        await saveDoc.save();
        console.log(`Updated commit for commitId: ${key}`);
      } else {
        console.log(`No Save document found for commitId: ${key}`);
      }
    } catch (error) {
      console.error(`Error updating commit for commitId: ${key}`, error);
    }
  }

  updates = {};
});
