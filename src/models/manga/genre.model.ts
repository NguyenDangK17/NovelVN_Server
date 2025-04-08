import mongoose from "mongoose";

const genreSchema = new mongoose.Schema(
  {
    genre_name: { type: String, required: true },
    genre_description: { type: String, required: true },
  }
)

const Genre = mongoose.model("Genre", genreSchema);

export default Genre;