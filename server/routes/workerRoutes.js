const express = require("express");

const router = express.Router();

const {
  registerWorker,
  loginWorker,
  getWorkerProfile,
} = require("../controllers/workerController");

const protect = require("../middleware/authMiddleware");

// =================================
// PUBLIC ROUTES
// =================================

router.post("/register", registerWorker);

router.post("/login", loginWorker);

// =================================
// PROTECTED ROUTES
// =================================

router.get("/profile", protect, getWorkerProfile);

module.exports = router;