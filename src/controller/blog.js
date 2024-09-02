import Blog from "../models/blog.models.js";
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
  try {
    const blogs = await Blog.find().populate("author", "-password").exec();

    res.status(200).json(blogs);
  } catch (e) {
    next();
  }
};

export { createBlogController, getAllBlogController };
