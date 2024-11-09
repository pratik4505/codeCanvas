const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const textSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

textSchema.index({ Id: 1 });

const Text = mongoose.model("Text", textSchema);

module.exports = Text;
