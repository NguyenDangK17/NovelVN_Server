import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isGroupAdmin: { type: Boolean, required: true },
  },
  { timestamps: true }
)

const Member = mongoose.model("Member", memberSchema);

export default Member;