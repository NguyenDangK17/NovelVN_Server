import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    chapter_id: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", required: true },
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastReadAt: { type: Date, default: Date.now }, // Auto-update when a user reads
  },
  { timestamps: true }
);

// historySchema.index({ user: 1, novel: 1 }, { unique: true }); // Prevent duplicate history

export default mongoose.model("History", historySchema);
