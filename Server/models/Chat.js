const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    members: {
      type: Map,
      of: String,
    },
    chatName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
