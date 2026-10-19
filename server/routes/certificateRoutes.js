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
  downloadPublicCertificatePdf,
} = require("../controllers/certificateController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// =========================================================
// PUBLIC ENDPOINTS
// =========================================================

// Public verification details (redacted privacy metadata)
router.get("/verify/:certificateId", verifyCertificate);

// Public PDF download for external verifiers and employers
router.get("/download-pdf/:certificateId", downloadPublicCertificatePdf);


// =========================================================
// AUTHENTICATED CERTIFICATE DOWNLOADS (ON-DEMAND STREAMING)
// =========================================================

// Authenticated private PDF download (strictly for associated worker or employer)
router.get(
  "/download/:certificateId",
  protect,
  downloadCertificatePdf
);


// =========================================================
// EMPLOYER WORKFLOW & BLOCKCHAIN INTEGRATION
// =========================================================

router.get(
  "/hash/:certificateId",
  protect,
  authorize("employer"),
  getCertificateHash
);

router.post(
  "/create",
  protect,
  authorize("employer"),
  createCertificate
);

router.post(
  "/confirm-blockchain/:certificateId",
  protect,
  authorize("employer"),
  confirmBlockchainRegistration
);

router.post(
  "/sync/:certificateId",
  protect,
  authorize("employer"),
  syncCertificateWithBlockchain
);

router.post(
  "/register-blockchain/:certificateId",
  protect,
  authorize("employer"),
  registerExistingCertificateOnBlockchain
);

router.get(
  "/employer",
  protect,
  authorize("employer"),
  getEmployerCertificates
);


// =========================================================
// WORKER ENDPOINTS
// =========================================================

router.get(
  "/worker",
  protect,
  authorize("worker"),
  getWorkerCertificates
);

module.exports = router;