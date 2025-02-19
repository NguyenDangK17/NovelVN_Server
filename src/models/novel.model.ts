import mongoose from "mongoose";

const novelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  viewCount: { type: Number, default: 0 },
  content: { type: String, required: true }
});

const Novel = mongoose.model("Comic", novelSchema);

export default Novel;
