import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    group_name: { type: String, required: true },
    group_description: { type: String, required: true },
  },
  { timestamps: true }
)

const Group = mongoose.model("Group", groupSchema);

export default Group;