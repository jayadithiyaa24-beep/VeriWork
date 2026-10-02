const express = require("express");

const router = express.Router();

const {
  registerEmployer,
  loginEmployer,
  getEmployerProfile,
  authorizeEmployerWallet,
} = require("../controllers/employerController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// =================================
// PUBLIC ROUTES
// =================================

// Employer Registration
router.post("/register", registerEmployer);

// Employer Login
router.post("/login", loginEmployer);

// =================================
// PROTECTED ROUTES
// =================================

// Get Logged-in Employer Profile
router.get(
  "/profile",
  protect,
  authorize("employer"),
  getEmployerProfile
);

// Authorize Employer Wallet as Issuer
router.post(
  "/authorize-wallet",
  protect,
  authorize("employer"),
  authorizeEmployerWallet
);

module.exports = router;