import express from "express";
import { createBlogController,getAllBlogController } from "../controller/blog.js";
import authentication from "../middleware/authentication.js";

const router = express.Router();

router.post("/", authentication, createBlogController);
router.get('/',getAllBlogController)

export default router;
