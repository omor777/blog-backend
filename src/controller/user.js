import User from "../models/user.models.js";
import error from "../utils/error.js";

import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Blog from "../models/blog.models.js";
import mongoose from "mongoose";
import Comment from "../models/comment.models.js";
import AggregationPipeline from "../helpers/aggregation.js";

const registerController = async (req, res, next) => {
  const { name, email, password, bio, address, image, date_of_birth } =
    req.body;

  try {
    if (!name || !name.trim()) throw error("Name filed is required!", 400);

    if (!email || !email.trim()) throw error("Email filed is required!", 400);

    if (!password || !password.trim())
      throw error("Password field is required!", 400);

    if (password.length < 6) throw error("Password at least 6 character", 400);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const isUserExist = await User.findOne({ email });

    if (isUserExist) throw error("User already exist with this email", 400);

    const user = new User({
      name,
      email,
      password: hash,
      bio,
      address,
      date_of_birth,
      image,
    });

    await user.save();

    res.status(201).json({ message: "Registration successful", success: true });
  } catch (e) {
    next(e);
  }
};

const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !email.trim()) throw error("Email is required!");

    if (!password || !password.trim()) throw error("Password is required!");

    const user = await User.findOne({ email });

    if (!user) throw error("User not found!", 404);

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) throw error("Invalid credentials");

    const payload = { email: user.email, id: user._id };

    const token = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "30d",
    });

    delete user.password;

    res
      .status(200)
      .json({ message: "Login successful", token, success: true, user });
  } catch (e) {
    next(e);
  }
};

const getUserProfileController = async (req, res, next) => {
  const userId = req?.user?.id;
  try {
    const userDetails = await User.findById(userId, ["-password", "-__v", "-following_users",'-followers','-bookmarks']);


    const allBlogPosts = await Blog.aggregate(
      AggregationPipeline.getUserPublishedBlog(userId)
    );

    const totalComments = await Comment.countDocuments({
      userId,
    });

    res.status(200).json({
      success: true,
      userDetails,
      allBlogPosts,
      totalPosts: allBlogPosts?.length,
      totalComments,
    });
  } catch (e) {
    next(e);
  }
};

export { registerController, loginController, getUserProfileController };
