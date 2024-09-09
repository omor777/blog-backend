import express from "express";
import {
  createBlogController,
  getAllBlogController,
  likeController,
  getSinglePostController,
  addCommentController,
  getAllCommentsController,
} from "../controller/blog.js";
import authentication from "../middleware/authentication.js";

const router = express.Router();

router.get("/", getAllBlogController);

router.get("/:postId", getSinglePostController);

router.post("/", authentication, createBlogController);

router.post("/:postId/likes", authentication, likeController);

router.post("/:postId/comments", authentication, addCommentController);

router.get("/:postId/comments", getAllCommentsController);

export default router;
