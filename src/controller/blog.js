import mongoose from "mongoose";
import Blog from "../models/blog.models.js";
import Comment from "../models/comment.models.js";
import Like from "../models/like.models.js";
import error from "../utils/error.js";
import { generateSlug } from "../utils/slug.js";
import AggregationPipeline from "../helpers/aggregation.js";

const createBlogController = async (req, res, next) => {
  const { title, content, image } = req.body;
  try {
    if (!title || !title.trim()) throw error("title is required!", 400);
    const slug = generateSlug(title);

    const blog = new Blog({
      title,
      content,
      image,
      slug,
      author: req.user.id,
    });
    await blog.save();

    res.status(201).json({ success: true });
  } catch (e) {
    next(e);
  }
};

const getAllBlogController = async (req, res, next) => {
  // TODO: search filter sort
  const page = parseInt(req.query?.page) || 1;
  const limit = 5;

  try {
    const totalBlogs = await Blog.countDocuments();

    const blogs = await Blog.aggregate([
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "blog_post",
          as: "likes",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
        },
      },
    ]);

    const hasMore = page * limit < totalBlogs;

    res.status(200).json({
      success: true,
      data: blogs,
      hasMore,
    });
  } catch (e) {
    next(e);
  }
};

const getSinglePostController = async (req, res, next) => {
  const postId = new mongoose.Types.ObjectId(req.params.postId);

  console.log(postId);
  try {
    const post = await Blog.aggregate(
      AggregationPipeline.getSingleBlogDetails(postId)
    );

    res.status(200).json({ success: true, data: post[0] });
  } catch (e) {
    next(e);
  }
};

const likeController = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const likedPost = await Blog.findById(postId);

    if (!likedPost) throw error("Post is not exist", 404);
    const isAlreadyLiked = await Like.findOne({
      $and: [{ user: req.user.id }, { blog_post: likedPost._id }],
    });

    if (isAlreadyLiked) {
      await Like.deleteOne({ user: req.user.id });
      return res
        .status(200)
        .json({ success: true, message: "Delete successful" });
    } else {
      const like = new Like({
        blog_post: likedPost._id,
        user: req.user.id,
      });
      await like.save();

      res.status(201).json({ success: true, message: "Like successful" });
    }
  } catch (e) {
    next(e);
  }
};

const addCommentController = async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;
  try {
    if (!content || !content.trim()) {
      throw error("comment content is required!");
    }

    const post = await Blog.findOne({ _id: postId });

    if (!post) throw error("Post not found", 404);

    const comment = new Comment({
      postId,
      userId: req.user.id,
      content,
    });

    await comment.save();

    res.status(201).json({ success: true, message: "comment have commented" });

    console.log("ok");
  } catch (e) {
    next(e);
  }
};

export {
  createBlogController,
  getAllBlogController,
  likeController,
  getSinglePostController,
  addCommentController,
};
