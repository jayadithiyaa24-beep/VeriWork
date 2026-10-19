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
  downloadEncryptedCertificatePdf,
  retryCertificateIpfsUpload,
} = require("../controllers/certificateController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// PUBLIC
router.get("/verify/:certificateId", verifyCertificate);
router.get("/download-pdf/:certificateId", downloadCertificatePdf);

// AUTHENTICATED IPFS DOWNLOAD
// The controller checks whether the logged-in user
// is the employer or worker associated with the certificate.
router.get(
  "/download-ipfs/:certificateId",
  protect,
  downloadEncryptedCertificatePdf
);

// EMPLOYER
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

router.post(
  "/retry-ipfs/:certificateId",
  protect,
  authorize("employer"),
  retryCertificateIpfsUpload
);

router.get(
  "/employer",
  protect,
  authorize("employer"),
  getEmployerCertificates
);

// WORKER
router.get(
  "/worker",
  protect,
  authorize("worker"),
  getWorkerCertificates
);

module.exports = router;