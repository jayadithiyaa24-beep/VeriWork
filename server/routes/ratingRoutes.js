const express = require("express");

const router = express.Router();

const {
    createRating,
    getUserRatings,
    getMyRatingForEmployment,
} = require("../controllers/ratingController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

// =========================================
// CREATE RATING
// Worker or Employer
// =========================================

router.post(
    "/create",
    protect,
    authorize("worker", "employer"),
    createRating
);


// =========================================
// GET RATINGS OF A USER
// Public
// =========================================

router.get(
    "/user/:userId",
    getUserRatings
);


// =========================================
// CHECK MY RATING FOR AN EMPLOYMENT
// Worker or Employer
// =========================================

router.get(
    "/employment/:employmentId",
    protect,
    authorize("worker", "employer"),
    getMyRatingForEmployment
);


module.exports = router;