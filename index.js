import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

dotenv.config();

const mongoDBUri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;
const app = express();

mongoose
  .connect(mongoDBUri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Database not connected", err);
  });

app.use(bodyParser.json());
app.use(cors());

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

app.listen(port, "localhost", () => {
  console.log(`Server is listening on ${port}`);
});
