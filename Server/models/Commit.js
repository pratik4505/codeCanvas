const mongoose = require("mongoose");

const commitSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    commit: {
      type: String, // Store as a JSON string
      required: true,
    },
    page: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Commit", commitSchema);
