import express from "express";
const router = express.Router();
import userRoutes from "./user.js";
import blogRoutes from "./blog.js";

router.use("/api/users", userRoutes);
router.use("/api/blogs", blogRoutes);
export default router;
