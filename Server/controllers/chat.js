const Chat = require("../models/Chat");

const Text = require("../models/Text");

const getChats = async (req, res) => {
  const userId = req.userId;

  try {
    const chats = await Chat.find({ [`members.${userId}`]: { $exists: true } });

    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const createdAt = req.query.createdAt
      ? new Date(req.query.createdAt)
      : new Date();
    const id = req.query.id;

    const messages = await Text.find({
      id: id,
    }).sort({ createdAt: -1 });

    const revMessages = messages.reverse();

    res.status(200).json(revMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const postMessage = async (req, res) => {
  try {
    const { senderId, id, message } = req.body;

    const newMessage = new Text({
      senderId,
      id,
      message,
    });

    await newMessage.save();

    res.status(201).json({ message: "Message saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const createChat = async (req, res) => {
  const { userData, id } = req.body;

  try {
    let chat = await Chat.findOne({ id: id });

    chat.members.set(userData.userId, userData.name);

    await chat.save();

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error updating chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getChats,
  getMessages,
  postMessage,
  createChat,
};
