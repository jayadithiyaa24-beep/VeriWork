const express = require("express");

const router = express.Router();

const {
  registerWorker,
  loginWorker,
  getWorkerProfile,
  connectWorkerWallet,
} = require("../controllers/workerController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// =================================
// PUBLIC ROUTES
// =================================

// Worker Registration
router.post("/register", registerWorker);

// Worker Login
router.post("/login", loginWorker);

// =================================
// PROTECTED ROUTES
// =================================

// Get Logged-in Worker Profile
router.get(
  "/profile",
  protect,
  authorize("worker"),
  getWorkerProfile
);

// Connect Worker Wallet
router.post(
  "/connect-wallet",
  protect,
  authorize("worker"),
  connectWorkerWallet
);

module.exports = router;