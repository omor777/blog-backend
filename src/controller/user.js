import User from "../models/user.models.js";
import error from "../utils/error.js";

import bcrypt from "bcryptjs";

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

    const isExist = await User.findOne({ email });

    if (isExist) throw error("User already exist with this email", 400);

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

    res.status(201).json({ message: "Registration successful" });
  } catch (e) {
    next(e);
  }
};

export { registerController };
