import dotenv from "dotenv";
dotenv.config();
import error from "../utils/error.js";
import jwt from "jsonwebtoken";

const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader) throw error("Unauthorized access", 401);

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        throw error("Forbidden access", 403);
      }
      req.user = decoded;
      next();
    });
  } catch (e) {
    next(e);
  }
};

export default authentication;
