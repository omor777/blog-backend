import Blog from "../models/blog.models.js";
import Like from "../models/like.models.js";
import error from "../utils/error.js";
import { generateSlug } from "../utils/slug.js";

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

    const blogs = await Blog.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "-password")
      .exec();

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

const likeController = async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;

  try {
    if (!content || !content.trim())
      throw error("Comment content is required!", 400);

    const likedPost = await Blog.findById(postId);

    if (!likedPost) throw error("Post is not exist", 404);
    console.log(req.user.id);
    const isAlreadyLiked = await Like.findOne({ user: req.user.id });

    if (isAlreadyLiked) {
      await Like.deleteOne({ user: req.user.id });
      return res.status(204).json();
    } else {
      const like = new Like({
        blog_post: likedPost._id,
        user: req.user.id,
        content,
      });
      await like.save();

      res.status(201).json({ success: true, message: "Like successful" });
    }
  } catch (e) {
    next(e);
  }
};

export { createBlogController, getAllBlogController, likeController };
