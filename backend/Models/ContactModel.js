const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    // Customer name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Event / customer location
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // Customer phone number
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Customer message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Admin can update this later
    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
    },

    // Automatically expire after 30 days
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      expires: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Contact", contactSchema);
