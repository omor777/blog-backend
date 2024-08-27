import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import connectDb from "./db.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.status(200).json({ success: true });
});

app.listen(port, () => {
  console.log(`App listen on port ${port}`);
});

connectDb("mongodb://localhost:27017/BlogsDB").then(() => {
  console.log("DB is connect successfully");
});

// global middleware for error handling
app.use((err, _req, res, _next) => {
  const message = err.message ? err.message : "Server Error Occurred";
  const status = err.status ? err.status : 500;
  res.status(status).json({ message });
});
