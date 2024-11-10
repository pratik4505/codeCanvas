const Chat = require("./models/Chat");
let io;

exports.init = (httpServer) => {
  io = require("socket.io")(httpServer, {
    cors: {
      origin: `${process.env.CLIENT_URL}`, // Allow this origin
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
    pingInterval: 1000 * 60, // 1 minute
    pingTimeout: 1000 * 60 * 3, // 3 minutes
  });

  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
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
  });
};
