import express from "express";
const router = express.Router();
import userRoutes from "./user.js";

router.use("/api/users", userRoutes);

export default router;
