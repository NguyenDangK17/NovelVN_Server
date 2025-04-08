import mongoose from "mongoose";

const volumeSchema = new mongoose.Schema(
  {
    manga_id: { type: mongoose.Schema.Types.ObjectId, ref: "Manga" },
    volume_title: { type: String, required: true },
    volume_cover: { type: String, default: "" },
  },
  { timestamps: true }
)

const Volume = mongoose.model("Volume", volumeSchema);

export default Volume;