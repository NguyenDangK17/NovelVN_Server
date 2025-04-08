import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    manga_id: { type: mongoose.Schema.Types.ObjectId, ref: "Manga" },
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    star: { type: Number, required: true }
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", RatingSchema);

export default Rating;
