const express = require("express");

const auth = require("../Middlewares/auth");

const {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} = require("../Controllers/contactController");

const router = express.Router();

// ========================================
// PUBLIC CONTACT FORM
// ========================================

// Visitor submits contact form
router.post("/", createContact);

// ========================================
// ADMIN CONTACT ENQUIRIES
// ========================================

// Get all enquiries
router.get("/", auth, getAllContacts);

// Get single enquiry
router.get("/:id", auth, getContactById);

// Update enquiry status
router.put("/:id/status", auth, updateContactStatus);

// Delete enquiry
router.delete("/:id", auth, deleteContact);

module.exports = router;
