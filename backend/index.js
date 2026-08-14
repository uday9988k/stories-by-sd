const express = require("express");
const cors = require("cors");

const connectDB = require("../Models/db");

const adminRoutes = require("../Routes/adminRoutes");
const storyRoutes = require("../Routes/storyRoutes");
const contactRoutes = require("../Routes/contactRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Connect before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Pong! Backend is running successfully.",
  });
});

app.use("/api/admin", adminRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/contact", contactRoutes);

module.exports = app;
