const crypto = require("crypto");

const Certificate = require("../models/Certificate");
const Employment = require("../models/Employment");

const {
  createCertificateHash,
  registerCertificateOnBlockchain,
  verifyCertificateOnBlockchain,
  getCertificateFromBlockchain,
  verifyTransactionDetails,
} = require("../services/blockchainService");


// =================================
// CREATE CERTIFICATE
// =================================

const createCertificate = async (req, res) => {
  try {
    // Only employers can create certificates
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Only employers can create certificates",
      });
    }

    const { employmentId } = req.body;

    // Validate employment ID
    if (!employmentId) {
      return res.status(400).json({
        success: false,
        message: "Employment ID is required",
      });
    }

    // Find employment record
    const employment = await Employment.findById(
      employmentId
    )
      .populate(
        "workerId",
        "fullName email phone"
      )
      .populate(
        "employerId",
        "employerName email phone"
      );

    if (!employment) {
      return res.status(404).json({
        success: false,
        message: "Employment record not found",
      });
    }

    // Make sure this employment belongs to
    // the logged-in employer
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

    // Check whether certificate already exists
    const existingCertificate =
      await Certificate.findOne({
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

    // Generate unique certificate ID
    const certificateId =
      `VW-CERT-${new Date().getFullYear()}-` +
      crypto.randomBytes(4).toString("hex").toUpperCase();

    // =================================
    // CREATE CERTIFICATE IN MONGODB
    // =================================

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

    // =================================
    // CREATE CERTIFICATE HASH
    // =================================

    const certificateHash =
      createCertificateHash({
        certificateId: certificate.certificateId,
        workerName: certificate.workerName,
        employerName: certificate.employerName,
        jobRole: certificate.jobRole,
        salary: certificate.salary,
        startDate: certificate.startDate,
        endDate: certificate.endDate,
      });

    // =================================
    // RESPONSE
    // =================================

    return res.status(201).json({
      success: true,
      message:
        "Work Certificate Created Successfully. Please confirm the blockchain transaction in MetaMask.",
      certificate,
      certificateHash,
    });
  } catch (error) {
    console.error(
      "Create Certificate Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =================================
// CONFIRM BLOCKCHAIN REGISTRATION (HARDENED)
// =================================

const confirmBlockchainRegistration = async (
  req,
  res
) => {
  try {
    // Only employers can confirm certificates
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message:
          "Only employers can confirm blockchain registration",
      });
    }

    const { certificateId } = req.params;
    const { transactionHash } = req.body;

    // =================================
    // VALIDATE INPUT
    // =================================

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: "Certificate ID is required",
      });
    }

    if (!transactionHash) {
      return res.status(400).json({
        success: false,
        message:
          "Blockchain transaction hash is required",
      });
    }

    // =================================
    // ANTI-REPLAY PROTECTION
    // Ensure this transaction hash has not been claimed by another certificate
    // =================================

    const existingTxCert = await Certificate.findOne({
      blockchainTransactionHash: transactionHash.trim(),
      certificateId: { $ne: certificateId.trim().toUpperCase() },
    });

    if (existingTxCert) {
      return res.status(400).json({
        success: false,
        message:
          "This blockchain transaction hash has already been registered for another certificate.",
      });
    }

    // =================================
    // FIND CERTIFICATE
    // =================================

    const certificate = await Certificate.findOne({
      certificateId:
        certificateId.trim().toUpperCase(),
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    // =================================
    // CHECK OWNERSHIP
    // =================================

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

    // =================================
    // CHECK WHETHER ALREADY VERIFIED
    // =================================

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

    // =================================
    // RECREATE CERTIFICATE HASH FROM AUTHENTIC DATA
    // =================================

    const certificateHash =
      createCertificateHash({
        certificateId: certificate.certificateId,
        workerName: certificate.workerName,
        employerName: certificate.employerName,
        jobRole: certificate.jobRole,
        salary: certificate.salary,
        startDate: certificate.startDate,
        endDate: certificate.endDate,
      });

    // =================================
    // HARDENED VERIFICATION:
    // 1. Transaction exists
    // 2. Correct contract
    // 3. Status = success (1)
    // 4. Correct calldata & function ('registerCertificate')
    // 5. Correct certificate ID & certificate hash in calldata
    // 6. Direct smart contract on-chain state verification
    // =================================

    const verificationResult =
      await verifyTransactionDetails({
        transactionHash: transactionHash.trim(),
        certificateId: certificate.certificateId,
        certificateHash,
      });

    if (!verificationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: `Blockchain verification failed: ${verificationResult.reason}`,
      });
    }

    // =================================
    // SAVE BLOCKCHAIN INFORMATION
    // =================================

    certificate.blockchainHash =
      certificateHash;

    certificate.blockchainTransactionHash =
      transactionHash.trim();

    certificate.verificationStatus =
      "Verified";

    await certificate.save();

    // Also update employment verification status
    if (certificate.employmentId) {
      await Employment.findByIdAndUpdate(
        certificate.employmentId,
        {
          verificationStatus: "Verified",
        }
      );
    }

    // =================================
    // RESPONSE
    // =================================

    return res.status(200).json({
      success: true,
      message:
        "Certificate registered and verified on the blockchain successfully",
      certificate,
      blockchainVerified: true,
      blockchainDetails: {
        transactionHash: transactionHash.trim(),
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


// =================================
// REGISTER EXISTING CERTIFICATE
// ON BLOCKCHAIN
// =================================

const registerExistingCertificateOnBlockchain = async (
  req,
  res
) => {
  try {
    // Only employers can register certificates
    // on the blockchain
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message:
          "Only employers can register certificates on the blockchain",
      });
    }

    const { certificateId } = req.params;

    // Validate certificate ID
    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: "Certificate ID is required",
      });
    }

    // Find certificate
    const certificate = await Certificate.findOne({
      certificateId:
        certificateId.trim().toUpperCase(),
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    // Make sure this certificate belongs to
    // the logged-in employer
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

    // Check whether the certificate is already
    // registered on the blockchain
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

    // =================================
    // CREATE HASH FOR EXISTING CERTIFICATE
    // =================================

    const certificateHash =
      createCertificateHash({
        certificateId: certificate.certificateId,
        workerName: certificate.workerName,
        employerName: certificate.employerName,
        jobRole: certificate.jobRole,
        salary: certificate.salary,
        startDate: certificate.startDate,
        endDate: certificate.endDate,
      });

    // =================================
    // REGISTER EXISTING CERTIFICATE
    // ON BLOCKCHAIN
    // =================================

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

    // =================================
    // UPDATE EXISTING MONGODB CERTIFICATE
    // =================================

    certificate.blockchainHash =
      blockchainResult.certificateHash;

    certificate.blockchainTransactionHash =
      blockchainResult.transactionHash;

    certificate.verificationStatus =
      "Verified";

    await certificate.save();

    // =================================
    // RESPONSE
    // =================================

    return res.status(200).json({
      success: true,
      message:
        "Existing Certificate Registered on Blockchain Successfully",
      certificate,
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


// =================================
// GET EMPLOYER CERTIFICATES
// =================================

const getEmployerCertificates = async (req, res) => {
  try {
    // Only employers can access employer certificates
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
      .populate(
        "workerId",
        "fullName email phone"
      )
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


// =================================
// GET WORKER CERTIFICATES
// =================================

const getWorkerCertificates = async (req, res) => {
  try {
    // Only workers can access worker certificates
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
      .populate(
        "employerId",
        "employerName email phone"
      )
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


// =================================
// PUBLIC CERTIFICATE VERIFICATION
// =================================

const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    // Validate certificate ID
    if (!certificateId) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "Certificate ID is required",
      });
    }

    // =================================
    // FIND CERTIFICATE IN MONGODB
    // =================================

    const certificate = await Certificate.findOne({
      certificateId:
        certificateId.trim().toUpperCase(),
    }).select(
      "certificateId workerName employerName jobRole salary startDate endDate issuedAt verificationStatus blockchainHash blockchainTransactionHash"
    );

    // Certificate not found
    if (!certificate) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: "Certificate not found",
      });
    }

    // =================================
    // CHECK BLOCKCHAIN DATA
    // =================================

    if (
      !certificate.blockchainHash ||
      !certificate.blockchainTransactionHash
    ) {
      return res.status(200).json({
        success: true,
        verified: false,
        message:
          "Certificate exists but has not been registered on the blockchain",
        certificate,
      });
    }

    // =================================
    // RECREATE CERTIFICATE HASH
    // =================================

    const certificateHash =
      createCertificateHash({
        certificateId: certificate.certificateId,
        workerName: certificate.workerName,
        employerName: certificate.employerName,
        jobRole: certificate.jobRole,
        salary: certificate.salary,
        startDate: certificate.startDate,
        endDate: certificate.endDate,
      });

    // =================================
    // COMPARE WITH STORED HASH
    // =================================

    const hashMatches =
      certificateHash ===
      certificate.blockchainHash;

    if (!hashMatches) {
      return res.status(200).json({
        success: true,
        verified: false,
        message:
          "Certificate data has been modified and does not match the registered blockchain hash",
        certificate,
      });
    }

    // =================================
    // VERIFY ON BLOCKCHAIN WITH ON-CHAIN DATA
    // =================================

    let onChainRecord = null;
    let blockchainVerified = false;

    try {
      onChainRecord = await getCertificateFromBlockchain({
        certificateId: certificate.certificateId,
      });

      if (
        onChainRecord &&
        onChainRecord.exists &&
        onChainRecord.certificateHash.toLowerCase() ===
          certificateHash.toLowerCase()
      ) {
        blockchainVerified = true;
      }
    } catch (blockchainError) {
      console.error(
        "Blockchain Verification Error:",
        blockchainError
      );
    }

    // =================================
    // FINAL VERIFICATION RESULT
    // =================================

    const verified =
      hashMatches && blockchainVerified;

    return res.status(200).json({
      success: true,
      verified,
      message: verified
        ? "Certificate verified successfully on the blockchain"
        : "Certificate could not be verified on the blockchain",
      certificate,
      blockchainVerified,
      hashMatches,
      onChainDetails: onChainRecord
        ? {
            registeredBy: onChainRecord.registeredBy,
            registeredAt: onChainRecord.registeredAt,
            certificateHash: onChainRecord.certificateHash,
            contractAddress: process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
          }
        : null,
    });
  } catch (error) {
    console.error(
      "Verify Certificate Error:",
      error
    );

    return res.status(500).json({
      success: false,
      verified: false,
      message: error.message,
    });
  }
};


// =================================
// GET CERTIFICATE HASH FOR METAMASK
// =================================

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

    if (certificate.employerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only access hashes for your own certificates",
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


// =================================
// SYNC CERTIFICATE WITH BLOCKCHAIN
// =================================

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

    const onChainRecord = await getCertificateFromBlockchain({
      certificateId: certificate.certificateId,
    });

    if (!onChainRecord || !onChainRecord.exists) {
      return res.status(400).json({
        success: false,
        message: "This certificate is not yet recorded on the blockchain.",
      });
    }

    certificate.blockchainHash = onChainRecord.certificateHash;
    certificate.verificationStatus = "Verified";
    await certificate.save();

    if (certificate.employmentId) {
      await Employment.findByIdAndUpdate(certificate.employmentId, {
        verificationStatus: "Verified",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate state successfully synchronized with the blockchain.",
      certificate,
      onChainDetails: {
        registeredBy: onChainRecord.registeredBy,
        registeredAt: onChainRecord.registeredAt,
        certificateHash: onChainRecord.certificateHash,
        contractAddress: process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
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

// =================================
// DOWNLOAD CERTIFICATE PDF
// =================================
const { generateCertificatePdf } = require("../services/pdfService");

const downloadCertificatePdf = async (req, res) => {
  try {
    const { certificateId } = req.params;
    if (!certificateId) {
      return res.status(400).send("Certificate ID is required");
    }

    const certificate = await Certificate.findOne({ certificateId: certificateId.trim() });
    if (!certificate) {
      return res.status(404).send("Certificate not found");
    }

    // Set standard PDF download headers with explicit filename
    const safeFilename = `${certificate.certificateId}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);

    await generateCertificatePdf(certificate, res);
  } catch (error) {
    console.error("PDF Download Route Error:", error);
    if (!res.headersSent) {
      res.status(500).send("Failed to generate PDF certificate");
    }
  }
};

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
};