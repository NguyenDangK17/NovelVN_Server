import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg" },
    role: {
      type: String,
      enum: [
        'admin',
        'moderator',
        'user'
      ],
      default: 'user',
    },
    tag: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    }],
    status: {
      type: String, required: true, enum: [
        'active',
        'banned'
      ],
      default: 'active'
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
