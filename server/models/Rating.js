const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
    {
        employmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employment",
            required: true,
        },

        reviewerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        reviewerRole: {
            type: String,
            enum: ["worker", "employer"],
            required: true,
        },

        reviewerName: {
            type: String,
            default: "",
        },

        reviewedUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

ratingSchema.index(
    {
        employmentId: 1,
        reviewerId: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model(
    "Rating",
    ratingSchema
);