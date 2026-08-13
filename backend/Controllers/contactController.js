const Contact = require("../Models/ContactModel");

const sendContactEmail = require("../Utils/sendContactEmail");

// ========================================
// Create Contact Enquiry
// ========================================

const createContact = async (req, res) => {
  try {
    const { name, location, phone, message } = req.body;

    // ----------------------------------------
    // Validate required fields
    // ----------------------------------------

    if (!name || !location || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // ----------------------------------------
    // Validate phone number
    // ----------------------------------------

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number.",
      });
    }

    // ----------------------------------------
    // Create contact enquiry
    // ----------------------------------------

    const contact = await Contact.create({
      name: name.trim(),
      location: location.trim(),
      phone: phone.trim(),
      message: message.trim(),
    });

    // ----------------------------------------
    // Send email notification
    // ----------------------------------------

    try {
      await sendContactEmail(contact);

      console.log("Contact email sent successfully.");
    } catch (emailError) {
      console.error("Contact email failed:", emailError.message);
    }

    // ----------------------------------------
    // Success response
    // ----------------------------------------

    res.status(201).json({
      success: true,
      message: "Thank you for contacting Satyadeva Photography!",
      contact,
    });
  } catch (error) {
    console.error("Create Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// Get All Contact Enquiries
// ========================================

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Get Contacts Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// Get Contact By ID
// ========================================

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact enquiry not found.",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error("Get Contact By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// Update Contact Status
// ========================================

const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // ----------------------------------------
    // Validate status
    // ----------------------------------------

    if (!["New", "Contacted", "Closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact status.",
      });
    }

    // ----------------------------------------
    // Update status
    // ----------------------------------------

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact enquiry not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact status updated successfully.",
      contact,
    });
  } catch (error) {
    console.error("Update Contact Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// Delete Contact
// ========================================

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact enquiry not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact enquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// Export
// ========================================

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
};
