const express = require("express");
const router = express.Router();

const {
  getAdminOverview,
  getAdminIssuers,
  authorizeAdminIssuer,
  revokeAdminIssuer,
  getAdminCertificates,
  inspectBlockchainCertificate,
} = require("../controllers/adminController");
const { adminProtect } = require("../middleware/adminAuth");

// Require admin authorization for all administrative endpoints
router.use(adminProtect);

// System Metrics Overview
router.get("/overview", getAdminOverview);

// Issuer Governance
router.get("/issuers", getAdminIssuers);
router.post("/authorize-issuer", authorizeAdminIssuer);
router.post("/revoke-issuer", revokeAdminIssuer);

// Blockchain Audit Ledger
router.get("/certificates", getAdminCertificates);
router.get("/inspect/:certificateId", inspectBlockchainCertificate);

module.exports = router;
