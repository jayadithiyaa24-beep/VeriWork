const express = require("express");

const router = express.Router();

const {
  createCertificate,
  confirmBlockchainRegistration,
  registerExistingCertificateOnBlockchain,
  getEmployerCertificates,
  getWorkerCertificates,
  verifyCertificate,
  getCertificateHash,
  syncCertificateWithBlockchain,
  downloadCertificatePdf,
} = require("../controllers/certificateController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");


// =================================
// PUBLIC ROUTES
// =================================

// Verify certificate using Certificate ID
router.get(
  "/verify/:certificateId",
  verifyCertificate
);

// Download Official PDF Certificate with QR Code
router.get(
  "/download-pdf/:certificateId",
  downloadCertificatePdf
);


// =================================
// EMPLOYER ROUTES
// =================================

// Get certificate hash for MetaMask registration
router.get(
  "/hash/:certificateId",
  protect,
  authorize("employer"),
  getCertificateHash
);

// Create work certificate

router.post(
  "/create",
  protect,
  authorize("employer"),
  createCertificate
);


// Confirm MetaMask blockchain registration
router.post(
  "/confirm-blockchain/:certificateId",
  protect,
  authorize("employer"),
  confirmBlockchainRegistration
);

// Sync already registered certificate with blockchain
router.post(
  "/sync/:certificateId",
  protect,
  authorize("employer"),
  syncCertificateWithBlockchain
);


// Register an existing certificate
// on the blockchain

router.post(
  "/register-blockchain/:certificateId",
  protect,
  authorize("employer"),
  registerExistingCertificateOnBlockchain
);


// Get employer's certificates

router.get(
  "/employer",
  protect,
  authorize("employer"),
  getEmployerCertificates
);


// =================================
// WORKER ROUTES
// =================================

// Get worker's certificates

router.get(
  "/worker",
  protect,
  authorize("worker"),
  getWorkerCertificates
);


module.exports = router;