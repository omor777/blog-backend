import mongoose, { Schema, model } from "mongoose";

const likeSchema = new Schema(
  {
    blog_post: {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
      required: [true, "Blog post ID required!"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User ID required!"],
    },
  },
  { timestamps: true }
);

const Like = model("Like", likeSchema);

export default Like;
