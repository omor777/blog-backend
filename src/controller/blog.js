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
    });
    await blog.save();

    res.status(201).json({ success: true });
  } catch (e) {
    next(e);
  }
};

export { createBlogController };
