const express = require("express");

const router = express.Router();

const {
  createEmployment,
  getEmployerEmployments,
  getWorkerEmployments,
  completeEmployment,
} = require("../controllers/employmentController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// =================================
// EMPLOYER ROUTES
// =================================

// Create employment record
router.post(
  "/create",
  protect,
  authorize("employer"),
  createEmployment
);

// Complete employment record
router.put(
  "/complete/:id",
  protect,
  authorize("employer"),
  completeEmployment
);

// Get employer's employees
router.get(
  "/employer",
  protect,
  authorize("employer"),
  getEmployerEmployments
);

// =================================
// WORKER ROUTES
// =================================

// Get worker employment history
router.get(
  "/worker",
  protect,
  authorize("worker"),
  getWorkerEmployments
);

module.exports = router;