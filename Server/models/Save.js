const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema(
  {
    commitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commit",
      required: true,
    },
    commit: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

saveSchema.pre("save", function (next) {
  this.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  next();
});

saveSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Save", saveSchema);
