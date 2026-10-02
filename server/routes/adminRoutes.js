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
