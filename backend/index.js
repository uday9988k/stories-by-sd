const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./Models/db");

const adminRoutes = require("./Routes/adminRoutes");
const storyRoutes = require("./Routes/storyRoutes");
const contactRoutes = require("./Routes/contactRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🏓 Pong! Backend is running successfully.",
  });
});

app.use("/api/admin", adminRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/contact", contactRoutes);

// Local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
