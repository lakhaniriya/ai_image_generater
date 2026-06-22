import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import PostRouter from "./routes/Posts.js";
import GenerateImageRouter from "./routes/GenerateImage.js";

dotenv.config();

const app = express();

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ai-image-frontend-virid.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false,
  })
);

app.options("*", cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/post", PostRouter);
app.use("/api/generateimage", GenerateImageRouter);

// Default route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});

// Error handler - ALWAYS after routes
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  console.error("Error middleware:", message);

  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Mongo connect
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 8080;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT|| 8080, () => {
      console.log("Server started on port 8080");
    });
  } catch (error) {
    console.error("Server start error:", error);
  }
};

startServer();