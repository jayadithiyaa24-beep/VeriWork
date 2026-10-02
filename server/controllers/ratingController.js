const Rating = require("../models/Rating");
const Employment = require("../models/Employment");
const Worker = require("../models/Worker");
const Employer = require("../models/Employer");


// =========================================
// CREATE RATING
// =========================================

const createRating = async (req, res) => {
    try {
        const {
            employmentId,
            rating,
            comment,
        } = req.body;

        // Check required fields
        if (
            !employmentId ||
            !rating
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Employment ID and rating are required.",
            });
        }

        // Validate rating
        if (
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Rating must be between 1 and 5.",
            });
        }

        // Find employment
        const employment =
            await Employment.findById(
                employmentId
            );

        if (!employment) {
            return res.status(404).json({
                success: false,
                message:
                    "Employment record not found.",
            });
        }

        // =========================================
        // CHECK WHETHER USER BELONGS TO EMPLOYMENT
        // =========================================

        let reviewedUserId;
        let reviewerName = "";

        if (req.user.role === "employer") {
            // Employer can rate the worker

            if (
                employment.employerId.toString() !==
                req.user.id
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "You are not authorized to rate this employment.",
                });
            }

            reviewedUserId =
                employment.workerId;

            const employerUser = await Employer.findById(req.user.id);
            reviewerName = employerUser?.employerName || "Employer";

        } else if (req.user.role === "worker") {
            // Worker can rate the employer

            if (
                employment.workerId.toString() !==
                req.user.id
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "You are not authorized to rate this employment.",
                });
            }

            reviewedUserId =
                employment.employerId;

            const workerUser = await Worker.findById(req.user.id);
            reviewerName = workerUser?.fullName || "Worker";

        } else {
            return res.status(403).json({
                success: false,
                message:
                    "Only workers and employers can submit ratings.",
            });
        }

        // =========================================
        // CHECK EMPLOYMENT STATUS
        // =========================================

        if (employment.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message:
                    "Rating can only be submitted after employment is completed.",
            });
        }

        // =========================================
        // CHECK DUPLICATE RATING
        // =========================================

        const existingRating =
            await Rating.findOne({
                employmentId,
                reviewerId: req.user.id,
            });

        if (existingRating) {
            return res.status(400).json({
                success: false,
                message:
                    "You have already rated this employment.",
            });
        }

        // =========================================
        // CREATE RATING
        // =========================================

        const newRating =
            await Rating.create({
                employmentId,
                reviewerId: req.user.id,
                reviewerRole: req.user.role,
                reviewerName,
                reviewedUserId,
                rating: Number(rating),
                comment: comment || "",
            });

        return res.status(201).json({
            success: true,
            message:
                "Rating submitted successfully.",
            rating: newRating,
        });

    } catch (error) {
        console.error(
            "Create Rating Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to submit rating.",
        });
    }
};


// =========================================
// GET RATINGS FOR A USER
// =========================================

const getUserRatings = async (req, res) => {
    try {
        const { userId } = req.params;

        const ratings =
            await Rating.find({
                reviewedUserId: userId,
            }).sort({
                createdAt: -1,
            });

        const totalRatings =
            ratings.length;

        const averageRating =
            totalRatings === 0
                ? 0
                : ratings.reduce(
                    (sum, item) =>
                        sum + item.rating,
                    0
                ) / totalRatings;

        return res.status(200).json({
            success: true,
            averageRating:
                Number(averageRating.toFixed(1)),
            totalRatings,
            ratings,
        });

    } catch (error) {
        console.error(
            "Get Ratings Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load ratings.",
        });
    }
};


// =========================================
// GET MY RATINGS FOR AN EMPLOYMENT
// =========================================

const getMyRatingForEmployment =
    async (req, res) => {
        try {
            const { employmentId } =
                req.params;

            const rating =
                await Rating.findOne({
                    employmentId,
                    reviewerId: req.user.id,
                });

            return res.status(200).json({
                success: true,
                rating: rating || null,
            });

        } catch (error) {
            console.error(
                "Get My Rating Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to check rating.",
            });
        }
    };


module.exports = {
    createRating,
    getUserRatings,
    getMyRatingForEmployment,
};