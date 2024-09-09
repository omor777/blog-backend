import express from "express";
import {
  getUserProfileController,
  loginController,
  registerController,
} from "../controller/user.js";
import authentication from "../middleware/authentication.js";
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

router.get("/profile", authentication, getUserProfileController);

export default router;
