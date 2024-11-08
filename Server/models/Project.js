// Project Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  collaborators: {
    type: Map,
    of: String,
  },
  creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // To store the project creator
  pages: {
    type: Map,
    of: [
      {
        commitId: {
          type: Schema.Types.ObjectId,
          ref: "Commit",
        },
        commitMessage: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
});

module.exports = mongoose.model("Project", ProjectSchema);
