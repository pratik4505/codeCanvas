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

// Middleware to update `expiresAt` on save or update
saveSchema.pre("save", function (next) {
  this.expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Set expiration 1 hour from now
  next();
});

// Create a TTL index on the `expiresAt` field
saveSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Save", saveSchema);
