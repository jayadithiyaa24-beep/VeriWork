const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    employmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employment",
      required: true,
      unique: true,
    },

    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },

    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },

    workerName: {
      type: String,
      required: true,
      trim: true,
    },

    employerName: {
      type: String,
      required: true,
      trim: true,
    },

    jobRole: {
      type: String,
      required: true,
      trim: true,
    },

    salary: {
      type: Number,
      required: true,
      min: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      default: null,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified"],
      default: "Pending",
    },

    blockchainHash: {
      type: String,
      default: null,
    },

    blockchainTransactionHash: {
      type: String,
      default: null,
    },

    // ==============================================================
    // LEGACY / COMPATIBILITY FIELDS (Retained for historical records)
    // Note: Active certificate generation and downloads are streamed
    // directly on-demand from the backend without Pinata/IPFS.
    // ==============================================================

    ipfsCid: {
      type: String,
      default: null,
    },

    ipfsUrl: {
      type: String,
      default: null,
    },

    ipfsStatus: {
      type: String,
      enum: ["Pending", "Uploaded", "Failed"],
      default: "Pending",
    },

    ipfsUploadedAt: {
      type: Date,
      default: null,
    },

    ipfsEncryptionAlgorithm: {
      type: String,
      enum: ["aes-256-gcm", null],
      default: null,
    },

    ipfsEncryptionIv: {
      type: String,
      default: null,
    },

    ipfsEncryptionAuthTag: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Certificate",
  certificateSchema
);