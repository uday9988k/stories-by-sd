const express = require("express");
const router = express.Router();

const auth = require("../Middlewares/auth");
const upload = require("../Middlewares/uploadStory");

const {
  createStory,
  getAllStories,
  getStoryById,
  deleteStory,
  updateStory,
} = require("../Controllers/storyController");

// ================================
// Create Wedding Story (Admin)
// ================================
router.post(
  "/create",
  auth,
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 20,
    },
    {
      name: "videos",
      maxCount: 4,
    },
  ]),
  createStory,
);

// ================================
// Get All Stories (Public)
// ================================
router.get("/", getAllStories);

// ================================
// Get Single Story (Public)
// ================================
router.get("/:id", getStoryById);

// ================================
// Update Story (Admin)
// ================================
router.put(
  "/:id",
  auth,
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 20,
    },
    {
      name: "videos",
      maxCount: 4,
    },
  ]),
  updateStory,
);

// ================================
// Delete Story (Admin)
// ================================
router.delete("/:id", auth, deleteStory);

module.exports = router;
