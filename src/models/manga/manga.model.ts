import mongoose from "mongoose";

const mangaSchema = new mongoose.Schema(
  {
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    title: { type: String, required: true },
    alternative_title: [{ type: String, required: false }],
    language: { type: String, required: true, default: 'jp', enum: ['jp', 'kr', 'cn'] },
    author: { type: String, required: true },
    artist: { type: String, required: false },
    description: { type: String, required: true },
    manga_cover: { type: String, required: true },
    viewCount: { type: Number, default: 0 },
    genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
    status: {
      type: String, required: true, default: 'draft', enum: [
        'ongoing',
        'hiatus',
        'completed',
        'draft',
        'deleted'
      ]
    }
  },
  { timestamps: true }
);

const Manga = mongoose.model("Manga", mangaSchema);

export default Manga;
