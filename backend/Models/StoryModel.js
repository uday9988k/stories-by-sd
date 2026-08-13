const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    public_id: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const storySchema = new mongoose.Schema(
  {
    coupleName: {
      type: String,
      required: true,
      trim: true,
    },

    weddingDate: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    coverImage: {
      type: mediaSchema,
      required: true,
    },

    images: {
      type: [mediaSchema],
      validate: {
        validator: function (value) {
          return value.length <= 20;
        },
        message: "Maximum 20 images are allowed.",
      },
      default: [],
    },

    videos: {
      type: [mediaSchema],
      validate: {
        validator: function (value) {
          return value.length <= 4;
        },
        message: "Maximum 4 videos are allowed.",
      },
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Story", storySchema);
