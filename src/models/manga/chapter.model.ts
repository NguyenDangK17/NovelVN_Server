import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    volume_id: { type: mongoose.Schema.Types.ObjectId, ref: "Volume" },
    chapter_title: { type: String, required: true },
    chapter_content: [{ type: String, required: true }],
  },
  { timestamps: true }
)

const Chapter = mongoose.model("Chapter", chapterSchema);

export default Chapter;