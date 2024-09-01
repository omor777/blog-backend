import express from "express";
import { createBlogController } from "../controller/blog.js";

const router = express.Router();

router.post("/", createBlogController);

export default router;
