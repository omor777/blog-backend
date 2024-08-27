import mongoose, { Schema, model } from "mongoose";

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
    },
    bio: String,
    address: String,
    date_of_birth: Date,
    image: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
    },
    following_users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Types.ObjectId, ref: "Blog" }],
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
