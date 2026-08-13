const express = require("express");
const router = express.Router();
const {
  createDefaultAdmin,
  loginAdmin,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../Controllers/adminController");

router.post("/create-admin", createDefaultAdmin);

router.post("/login", loginAdmin);

router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOTP);

router.put("/reset-password", resetPassword);

module.exports = router;
