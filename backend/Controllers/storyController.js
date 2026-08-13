const Story = require("../Models/StoryModel");
const cloudinary = require("../Utils/cloudinary");

// ========================================
// Create Story
// ========================================
const createStory = async (req, res) => {
  try {
    const { coupleName, weddingDate, location, description } = req.body;

    if (!coupleName || !weddingDate || !location) {
      return res.status(400).json({
        success: false,
        message: "Couple name, wedding date and location are required.",
      });
    }

    if (!req.files || !req.files.coverImage) {
      return res.status(400).json({
        success: false,
        message: "Cover image is required.",
      });
    }

    const cover = req.files.coverImage[0];

    const images = req.files.images
      ? req.files.images.map((img) => ({
          url: img.path,
          public_id: img.filename,
        }))
      : [];

    const videos = req.files.videos
      ? req.files.videos.map((video) => ({
          url: video.path,
          public_id: video.filename,
        }))
      : [];

    const story = await Story.create({
      coupleName,
      weddingDate,
      location,
      description,
      coverImage: {
        url: cover.path,
        public_id: cover.filename,
      },
      images,
      videos,
    });

    res.status(201).json({
      success: true,
      message: "Wedding Story Created Successfully",
      story,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// Get All Stories
// ========================================
const getAllStories = async (req, res) => {
  try {
    console.log("📸 Fetching wedding stories...");
    console.log(
      "MongoDB readyState:",
      require("mongoose").connection.readyState,
    );

    const stories = await Story.find().sort({ createdAt: -1 });

    console.log("✅ Stories found:", stories.length);

    res.status(200).json({
      success: true,
      count: stories.length,
      stories,
    });
  } catch (error) {
    console.error("❌ GET ALL STORIES ERROR:");
    console.error(error);
    console.error("Message:", error.message);
    console.error("Name:", error.name);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ========================================
// Get Story By Id
// ========================================
const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.status(200).json({
      success: true,
      story,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// Update Story
// ========================================
const updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const { coupleName, weddingDate, location, description } = req.body;

    // Update text fields
    if (coupleName) story.coupleName = coupleName;
    if (weddingDate) story.weddingDate = weddingDate;
    if (location) story.location = location;
    if (description) story.description = description;

    // Replace Cover Image
    if (req.files?.coverImage?.length) {
      if (story.coverImage.public_id) {
        try {
          await cloudinary.uploader.destroy(story.coverImage.public_id);
        } catch (err) {
          console.error("Failed to delete cover image:", err.message);
        }
      }

      const cover = req.files.coverImage[0];

      story.coverImage = {
        url: cover.path,
        public_id: cover.filename,
      };
    }

    // Remove Gallery Images
    if (req.body.removeImages) {
      const removeImages = JSON.parse(req.body.removeImages);

      for (const publicId of removeImages) {
        try {
          await cloudinary.uploader.destroy(publicId);

          story.images = story.images.filter(
            (img) => img.public_id !== publicId,
          );
        } catch (err) {
          console.error("Failed to delete image:", err.message);
        }
      }
    }

    // Add Gallery Images
    if (req.files?.images?.length) {
      const newImages = req.files.images.map((img) => ({
        url: img.path,
        public_id: img.filename,
      }));

      story.images.push(...newImages);
    }

    // Remove Videos
    if (req.body.removeVideos) {
      const removeVideos = JSON.parse(req.body.removeVideos);

      for (const publicId of removeVideos) {
        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
          });

          story.videos = story.videos.filter(
            (video) => video.public_id !== publicId,
          );
        } catch (err) {
          console.error("Failed to delete video:", err.message);
        }
      }
    }

    // Add Videos
    if (req.files?.videos?.length) {
      const newVideos = req.files.videos.map((video) => ({
        url: video.path,
        public_id: video.filename,
      }));

      story.videos.push(...newVideos);
    }

    await story.save();

    res.status(200).json({
      success: true,
      message: "Story updated successfully",
      story,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// Delete Story
// ========================================
const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // Delete cover image with error handling
    if (story.coverImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(story.coverImage.public_id);
      } catch (err) {
        console.error("Failed to delete cover image:", err.message);
        // Continue with other deletions
      }
    }

    // Delete gallery images with error handling
    for (const image of story.images) {
      try {
        await cloudinary.uploader.destroy(image.public_id);
      } catch (err) {
        console.error("Failed to delete image:", err.message);
        // Continue with other deletions
      }
    }

    // Delete videos with error handling
    for (const video of story.videos) {
      try {
        await cloudinary.uploader.destroy(video.public_id, {
          resource_type: "video",
        });
      } catch (err) {
        console.error("Failed to delete video:", err.message);
        // Continue with other deletions
      }
    }

    // Finally, delete the story document from MongoDB
    await story.deleteOne();

    res.status(200).json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
};
