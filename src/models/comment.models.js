import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema({
  content: {
    type: String,
    required: [true, "Comment content is required!"],
  },
  blog_post: {
    type: mongoose.Types.ObjectId,
    ref: "Blog",
    required: [true, "Blog post ID is required!"],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required!"],
  },
});

const Comment = model("Comment", commentSchema);

export default Comment;
