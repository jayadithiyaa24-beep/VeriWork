const crypto = require("crypto");

const Certificate = require("../models/Certificate");
const Employment = require("../models/Employment");

const blockchainService = require("../services/blockchainService");
const {
  createCertificateHash,
  registerCertificateOnBlockchain,
  getCertificateFromBlockchain,
  verifyTransactionDetails,
} = blockchainService;

const {
  generateCertificatePdf,
} = require("../services/pdfService");


// =========================================================
// 1. CREATE CERTIFICATE
// =========================================================

const createCertificate = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Only employers can create certificates",
      });
    }

    const { employmentId } = req.body;

    if (!employmentId) {
      return res.status(400).json({
        success: false,
        message: "Employment ID is required",
      });
    }

    const employment = await Employment.findById(employmentId)
      .populate("workerId", "fullName email phone")
      .populate("employerId", "employerName email phone");

    if (!employment) {
      return res.status(404).json({
        success: false,
        message: "Employment record not found",
      });
    }

    if (
      employment.employerId._id.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only create certificates for your own employees",
      });
    }

    const existingCertificate = await Certificate.findOne({
      employmentId: employment._id,
    });

    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message:
          "A certificate already exists for this employment record",
        certificate: existingCertificate,
      });
    }

    const certificateId =
      `VW-CERT-${new Date().getFullYear()}-` +
      crypto.randomBytes(4).toString("hex").toUpperCase();

    const certificate = await Certificate.create({
      certificateId,
      employmentId: employment._id,
      workerId: employment.workerId._id,
      employerId: employment.employerId._id,
      workerName: employment.workerId.fullName,
      employerName: employment.employerId.employerName,
      jobRole: employment.jobRole,
      salary: employment.salary,
      startDate: employment.startDate,
      endDate: employment.endDate,
      verificationStatus: "Pending",
      blockchainHash: null,
      blockchainTransactionHash: null,
    });

    const certificateHash = createCertificateHash({
      certificateId: certificate.certificateId,
      workerName: certificate.workerName,
      employerName: certificate.employerName,
      jobRole: certificate.jobRole,
      salary: certificate.salary,
      startDate: certificate.startDate,
      endDate: certificate.endDate,
    });

    return res.status(201).json({
      success: true,
      message:
        "Work Certificate Created Successfully. Please confirm the blockchain transaction in MetaMask.",
      certificate,
      certificateHash,
    });
  } catch (error) {
    console.error("Create Certificate Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================================
// 2. CONFIRM BLOCKCHAIN REGISTRATION
// =========================================================

const confirmBlockchainRegistration = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message:
          "Only employers can confirm blockchain registration",
      });
    }

    const { certificateId } = req.params;
    const { transactionHash } = req.body;

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: "Certificate ID is required",
      });
    }

    if (
      typeof transactionHash !== "string" ||
      !transactionHash.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Blockchain transaction hash is required",
      });
    }

    const normalizedCertificateId =
      certificateId.trim().toUpperCase();

    const normalizedTransactionHash =
      transactionHash.trim();

    const existingTxCert = await Certificate.findOne({
      blockchainTransactionHash: normalizedTransactionHash,
      certificateId: { $ne: normalizedCertificateId },
    });

    if (existingTxCert) {
      return res.status(400).json({
        success: false,
        message:
          "This blockchain transaction hash has already been registered for another certificate.",
      });
    }

    const certificate = await Certificate.findOne({
      certificateId: normalizedCertificateId,
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    if (
      certificate.employerId.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only confirm your own certificates",
      });
    }

    if (
      certificate.verificationStatus === "Verified" &&
      certificate.blockchainHash &&
      certificate.blockchainTransactionHash
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This certificate is already registered and verified on the blockchain",
        certificate,
      });
    }

    const certificateHash = createCertificateHash({
      certificateId: certificate.certificateId,
      workerName: certificate.workerName,
      employerName: certificate.employerName,
      jobRole: certificate.jobRole,
      salary: certificate.salary,
      startDate: certificate.startDate,
      endDate: certificate.endDate,
    });

    const verificationResult =
      await verifyTransactionDetails({
        transactionHash: normalizedTransactionHash,
        certificateId: certificate.certificateId,
        certificateHash,
      });

    if (!verificationResult.isValid) {
      return res.status(400).json({
        success: false,
        message:
          `Blockchain verification failed: ${verificationResult.reason}`,
      });
    }

    certificate.blockchainHash = certificateHash;
    certificate.blockchainTransactionHash =
      normalizedTransactionHash;
    certificate.verificationStatus = "Verified";

    await certificate.save();

    if (certificate.employmentId) {
      await Employment.findByIdAndUpdate(
        certificate.employmentId,
        { verificationStatus: "Verified" }
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Certificate verified and permanently anchored to the Ethereum Sepolia blockchain.",
      certificate,
      blockchainVerified: true,
      blockchainDetails: {
        transactionHash: normalizedTransactionHash,
        blockNumber: verificationResult.blockNumber,
        senderWallet: verificationResult.senderWallet,
        registeredBy: verificationResult.registeredBy,
        registeredAt: verificationResult.registeredAt,
      },
    });
  } catch (error) {
    console.error(
      "Confirm Blockchain Registration Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================================
// 3. REGISTER EXISTING CERTIFICATE ON BLOCKCHAIN
// =========================================================

const registerExistingCertificateOnBlockchain = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message:
          "Only employers can register certificates on the blockchain",
      });
    }

    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: "Certificate ID is required",
      });
    }

    const certificate = await Certificate.findOne({
      certificateId: certificateId.trim().toUpperCase(),
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    if (
      certificate.employerId.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only register your own certificates on the blockchain",
      });
    }

    if (
      certificate.blockchainHash &&
      certificate.blockchainTransactionHash
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This certificate is already registered on the blockchain",
        certificate,
      });
    }

    const certificateHash = createCertificateHash({
      certificateId: certificate.certificateId,
      workerName: certificate.workerName,
      employerName: certificate.employerName,
      jobRole: certificate.jobRole,
      salary: certificate.salary,
      startDate: certificate.startDate,
      endDate: certificate.endDate,
    });

    let blockchainResult;

    try {
      blockchainResult =
        await registerCertificateOnBlockchain({
          certificateId: certificate.certificateId,
          certificateHash,
        });
    } catch (blockchainError) {
      console.error(
        "Existing Certificate Blockchain Registration Error:",
        blockchainError
      );

      return res.status(500).json({
        success: false,
        message:
          "Existing certificate could not be registered on the blockchain.",
        error: blockchainError.message,
      });
    }

    certificate.blockchainHash =
      blockchainResult.certificateHash;

    certificate.blockchainTransactionHash =
      blockchainResult.transactionHash;

    certificate.verificationStatus = "Verified";

    await certificate.save();

    return res.status(200).json({
      success: true,
      message:
        "Existing certificate registered on the blockchain successfully.",
      certificate,
      blockchainVerified: true,
    });
  } catch (error) {
    console.error(
      "Register Existing Certificate Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================================
// 4. GET EMPLOYER CERTIFICATES
// =========================================================

const getEmployerCertificates = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message:
          "Only employers can access these certificates",
      });
    }

    const certificates = await Certificate.find({
      employerId: req.user.id,
    })
      .populate("workerId", "fullName email phone")
      .populate(
        "employmentId",
        "jobRole salary startDate endDate status"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error(
      "Get Employer Certificates Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================================
// 5. GET WORKER CERTIFICATES
// =========================================================

const getWorkerCertificates = async (req, res) => {
  try {
    if (req.user.role !== "worker") {
      return res.status(403).json({
        success: false,
        message:
          "Only workers can access these certificates",
      });
    }

    const certificates = await Certificate.find({
      workerId: req.user.id,
    })
      .populate("employerId", "employerName email phone")
      .populate(
        "employmentId",
        "jobRole salary startDate endDate status"
      )
      .sort({ issuedAt: -1 });

    return res.status(200).json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error(
      "Get Worker Certificates Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================================
// 6. PUBLIC CERTIFICATE VERIFICATION (SAFE METADATA)
// =========================================================

const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "Certificate ID is required",
      });
    }

    const certificate = await Certificate.findOne({
      certificateId: certificateId.trim().toUpperCase(),
    }).select(
      "certificateId workerName employerName jobRole salary startDate endDate issuedAt verificationStatus blockchainHash blockchainTransactionHash"
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: "Certificate not found",
      });
    }

    // Recreate deterministic hash from certificate data
    const certificateHash = createCertificateHash({
      certificateId: certificate.certificateId,
      workerName: certificate.workerName,
      employerName: certificate.employerName,
      jobRole: certificate.jobRole,
      salary: certificate.salary,
      startDate: certificate.startDate,
      endDate: certificate.endDate,
    });

    const hashMatches =
      Boolean(certificate.blockchainHash) &&
      certificateHash.toLowerCase() ===
      String(certificate.blockchainHash).toLowerCase();

    // Redact salary from public verification responses to protect worker financial privacy
    const certRaw = certificate.toObject ? certificate.toObject() : { ...certificate };
    const { salary: _redactedSalary, ...publicCertificate } = certRaw;

    if (
      certificate.blockchainHash &&
      !hashMatches
    ) {
      return res.status(200).json({
        success: true,
        verified: false,
        message:
          "Certificate data has been modified and does not match the stored hash",
        certificate: publicCertificate,
        hashMatches: false,
        blockchainVerified: false,
        transactionHashAvailable: Boolean(
          certificate.blockchainTransactionHash
        ),
      });
    }

    let onChainRecord = null;

    try {
      onChainRecord =
        await blockchainService.getCertificateFromBlockchain({
          certificateId: certificate.certificateId,
        });
    } catch (blockchainError) {
      console.error(
        "Blockchain Verification Error:",
        blockchainError
      );
    }

    const onChainIdMatches =
      Boolean(onChainRecord?.exists) &&
      onChainRecord.certificateId ===
      certificate.certificateId;

    const onChainHashMatches =
      onChainIdMatches &&
      typeof onChainRecord.certificateHash === "string" &&
      onChainRecord.certificateHash.toLowerCase() ===
      certificateHash.toLowerCase();

    const blockchainVerified =
      Boolean(onChainHashMatches);

    const verified =
      blockchainVerified &&
      (!certificate.blockchainHash || hashMatches);

    return res.status(200).json({
      success: true,
      verified,
      message: verified
        ? "Certificate verified successfully on the blockchain"
        : !onChainRecord || !onChainRecord.exists
          ? "Certificate exists in the database but was not found on the blockchain"
          : "Certificate could not be verified because the on-chain data does not match",
      certificate: publicCertificate,
      blockchainVerified,
      hashMatches: certificate.blockchainHash
        ? hashMatches
        : null,
      transactionHashAvailable: Boolean(
        certificate.blockchainTransactionHash
      ),
      onChainDetails: onChainRecord?.exists
        ? {
          certificateId: onChainRecord.certificateId,
          registeredBy: onChainRecord.registeredBy,
          registeredAt: onChainRecord.registeredAt,
          certificateHash: onChainRecord.certificateHash,
          contractAddress:
            process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
        }
        : null,
    });
  } catch (error) {
    console.error("Verify Certificate Error:", error);

    return res.status(500).json({
      success: false,
      verified: false,
      message: error.message,
    });
  }
};


// =========================================================
// 7. GET CERTIFICATE HASH FOR METAMASK SIGNING
// =========================================================

const getCertificateHash = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: "Certificate ID is required",
      });
    }

    const certificate = await Certificate.findOne({
      certificateId: certificateId.trim().toUpperCase(),
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    if (
      certificate.employerId.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only access hashes for your own certificates",
      });
    }

    const certificateHash = createCertificateHash({
      certificateId: certificate.certificateId,
      workerName: certificate.workerName,
      employerName: certificate.employerName,
      jobRole: certificate.jobRole,
      salary: certificate.salary,
      startDate: certificate.startDate,
      endDate: certificate.endDate,
    });

    return res.status(200).json({
      success: true,
      certificateId: certificate.certificateId,
      certificateHash,
      verificationStatus: certificate.verificationStatus,
    });
  } catch (error) {
    console.error("Get Certificate Hash Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================================
// 8. SYNC CERTIFICATE WITH BLOCKCHAIN
// =========================================================

const syncCertificateWithBlockchain = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: "Certificate ID is required",
      });
    }

    const certificate = await Certificate.findOne({
      certificateId: certificateId.trim().toUpperCase(),
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    if (
      req.user.role !== "employer" ||
      certificate.employerId.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only sync your own certificates",
      });
    }

    const onChainRecord =
      await blockchainService.getCertificateFromBlockchain({
        certificateId: certificate.certificateId,
      });

    if (!onChainRecord || !onChainRecord.exists) {
      return res.status(400).json({
        success: false,
        message:
          "This certificate is not yet recorded on the blockchain.",
      });
    }

    const calculatedHash = createCertificateHash({
      certificateId: certificate.certificateId,
      workerName: certificate.workerName,
      employerName: certificate.employerName,
      jobRole: certificate.jobRole,
      salary: certificate.salary,
      startDate: certificate.startDate,
      endDate: certificate.endDate,
    });

    if (
      onChainRecord.certificateId !==
      certificate.certificateId ||
      typeof onChainRecord.certificateHash !== "string" ||
      onChainRecord.certificateHash.toLowerCase() !==
      calculatedHash.toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The on-chain certificate data does not match the database certificate.",
      });
    }

    certificate.blockchainHash =
      onChainRecord.certificateHash;

    certificate.verificationStatus = "Verified";

    await certificate.save();

    if (certificate.employmentId) {
      await Employment.findByIdAndUpdate(
        certificate.employmentId,
        { verificationStatus: "Verified" }
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Certificate synchronized with the blockchain.",
      certificate,
      onChainDetails: {
        registeredBy: onChainRecord.registeredBy,
        registeredAt: onChainRecord.registeredAt,
        certificateHash: onChainRecord.certificateHash,
        contractAddress:
          process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
      },
    });
  } catch (error) {
    console.error("Sync Certificate Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================================
// 9. AUTHENTICATED CERTIFICATE PDF DOWNLOAD (STRICT RBAC)
// =========================================================

const downloadCertificatePdf = async (req, res) => {
  try {
    const certificateId = String(
      req.params.certificateId || ""
    )
      .trim()
      .toUpperCase();

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: "Certificate ID is required",
      });
    }

    // Extract caller ID and role from verified JWT
    const userId = String(req.user?.id || req.user?._id || "").trim();
    const userRole = String(req.user?.role || "").toLowerCase().trim();

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to download certificate",
      });
    }

    const certificate = await Certificate.findOne({
      certificateId,
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    // Extract associated worker & employer IDs
    const certWorkerId = String(
      certificate.workerId?._id || certificate.workerId || ""
    );
    const certEmployerId = String(
      certificate.employerId?._id || certificate.employerId || ""
    );

    // Strict ownership verification
    const isAuthorizedWorker =
      userRole === "worker" && certWorkerId === userId;
    const isAuthorizedEmployer =
      userRole === "employer" && certEmployerId === userId;

    if (!isAuthorizedWorker && !isAuthorizedEmployer) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to download this certificate. Only the worker or employer associated with this certificate may download it.",
      });
    }

    const safeFilename = `${certificate.certificateId}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFilename}"`
    );
    res.setHeader("Cache-Control", "private, no-store");

    // Fast in-memory PDF generation and streaming (~50ms)
    await generateCertificatePdf(certificate, res, { isPublic: false });
  } catch (error) {
    console.error(
      "Authenticated Certificate PDF Download Error:",
      error.message
    );

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate certificate PDF",
      });
    }
  }
};


// =========================================================
// 10. PUBLIC CERTIFICATE PDF DOWNLOAD (PUBLIC VERIFICATION)
// =========================================================

const downloadPublicCertificatePdf = async (req, res) => {
  try {
    const certificateId = String(
      req.params.certificateId || ""
    )
      .trim()
      .toUpperCase();

    if (!certificateId) {
      return res.status(400).send("Certificate ID is required");
    }

    const certificate = await Certificate.findOne({
      certificateId,
    });

    if (!certificate) {
      return res.status(404).send("Certificate not found");
    }

    // 1. Recalculate deterministic hash using exact same canonical fields as verifyCertificate()
    const recalculatedHash = createCertificateHash({
      certificateId: certificate.certificateId,
      workerName: certificate.workerName,
      employerName: certificate.employerName,
      jobRole: certificate.jobRole,
      salary: certificate.salary,
      startDate: certificate.startDate,
      endDate: certificate.endDate,
    });

    // 2. Check stored database hash matches recalculated hash
    const hasStoredHash = Boolean(certificate.blockchainHash);
    const dbHashMatches =
      hasStoredHash &&
      recalculatedHash.toLowerCase() ===
        String(certificate.blockchainHash).toLowerCase();

    // 3. Query on-chain record independently
    let onChainRecord = null;
    let rpcError = null;

    try {
      onChainRecord = await blockchainService.getCertificateFromBlockchain({
        certificateId: certificate.certificateId,
      });
    } catch (err) {
      rpcError = err;
      console.error(
        "Public PDF Blockchain Query Error:",
        err.message
      );
    }

    // If getCertificateFromBlockchain returned null and no exception was caught,
    // probe RPC provider availability using verifyCertificateOnBlockchain.
    // If the certificate is merely missing, the smart contract returns false cleanly.
    // If the RPC provider is unavailable, verifyCertificateOnBlockchain throws.
    if (!onChainRecord && !rpcError) {
      try {
        await blockchainService.verifyCertificateOnBlockchain({
          certificateId: certificate.certificateId,
          certificateHash: recalculatedHash,
        });
      } catch (probeError) {
        rpcError = probeError;
        console.error(
          "Public PDF Blockchain RPC Probe Error:",
          probeError.message
        );
      }
    }

    // 4. Determine verified status fail-closed
    let verificationStatus = "Not Verified";
    let isVerified = false;

    if (rpcError) {
      // Blockchain RPC or provider failure - verification cannot be completed
      verificationStatus = "Verification Unavailable";
      isVerified = false;
    } else if (
      dbHashMatches &&
      onChainRecord &&
      onChainRecord.exists === true &&
      onChainRecord.certificateId === certificate.certificateId &&
      typeof onChainRecord.certificateHash === "string" &&
      onChainRecord.certificateHash.toLowerCase() === recalculatedHash.toLowerCase()
    ) {
      // All 5 checks passed: DB exists, hash matches DB, on-chain exists, ID matches, on-chain hash matches
      verificationStatus = "Verified On-Chain";
      isVerified = true;
    } else {
      // Definite mismatch, missing from on-chain, or not registered
      verificationStatus = "Not Verified";
      isVerified = false;
    }

    const safeFilename = `${certificate.certificateId}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFilename}"`
    );

    // Stream sanitized public PDF credential with independent verification claims
    await generateCertificatePdf(certificate, res, {
      isPublic: true,
      verificationStatus,
      isVerified,
    });
  } catch (error) {
    console.error("Public PDF Download Error:", error);

    if (!res.headersSent) {
      res.status(500).send("Failed to generate PDF certificate");
    }
  }
};


// =========================================================
// EXPORT CONTROLLERS
// =========================================================

module.exports = {
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
};