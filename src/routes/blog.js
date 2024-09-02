import express from "express";
import { createBlogController } from "../controller/blog.js";
import authentication from "../middleware/authentication.js";

const router = express.Router();

router.post("/", authentication, createBlogController);

export default router;
