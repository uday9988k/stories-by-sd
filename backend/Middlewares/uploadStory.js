const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../Utils/cloudinary");
const path = require("path");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const imageExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const videoExt = [".mp4", ".mov", ".avi", ".mkv", ".webm"];

    // Images
    if (file.mimetype.startsWith("image/") || imageExt.includes(ext)) {
      return {
        folder: "stories/images",
        resource_type: "image",
      };
    }

    // Videos
    if (file.mimetype.startsWith("video/") || videoExt.includes(ext)) {
      return {
        folder: "stories/videos",
        resource_type: "video",
      };
    }

    throw new Error("Only images and videos are allowed.");
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 100 * 1024 * 1024, //100 MB
  },

  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const allowedExt = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".gif",
      ".mp4",
      ".mov",
      ".avi",
      ".mkv",
      ".webm",
    ];

    console.log("Field :", file.fieldname);
    console.log("Name  :", file.originalname);
    console.log("Mime  :", file.mimetype);

    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/") ||
      (file.mimetype === "application/octet-stream" && allowedExt.includes(ext))
    ) {
      return cb(null, true);
    }

    cb(new Error("Only image and video files are allowed."));
  },
});

module.exports = upload;
