const crypto = require("crypto");

const Certificate = require("../models/Certificate");
const Employment = require("../models/Employment");

const {
  createCertificateHash,
  registerCertificateOnBlockchain,
  getCertificateFromBlockchain,
  verifyTransactionDetails,
} = require("../services/blockchainService");

const {
  uploadCertificatePdfToIPFS,
} = require("../services/certificateIpfsService");

const {
  generateCertificatePdf,
} = require("../services/pdfService");


// =================================
// IPFS CERTIFICATE UPLOAD HELPER
// =================================

const uploadCertificateToIPFS = async (certificate) => {
  if (
    certificate.ipfsStatus === "Uploaded" &&
    certificate.ipfsCid
  ) {
    return true;
  }

  try {
    certificate.ipfsStatus = "Pending";
    await certificate.save();

    const metadata =
      await uploadCertificatePdfToIPFS(certificate);

    certificate.ipfsCid = metadata.ipfsCid;
    certificate.ipfsUrl = metadata.ipfsUrl;
    certificate.ipfsStatus = "Uploaded";
    certificate.ipfsUploadedAt = metadata.ipfsUploadedAt;
    certificate.ipfsEncryptionAlgorithm =
      metadata.ipfsEncryptionAlgorithm;
    certificate.ipfsEncryptionIv =
      metadata.ipfsEncryptionIv;
    certificate.ipfsEncryptionAuthTag =
      metadata.ipfsEncryptionAuthTag;

    await certificate.save();

    return true;
  } catch (error) {
    console.error(
      "Certificate IPFS Upload Error:",
      error
    );

    try {
      certificate.ipfsStatus = "Failed";
      await certificate.save();
    } catch (saveError) {
      console.error(
        "Failed to save IPFS failure status:",
        saveError
      );
    }

    return false;
  }
};


// =================================
// CREATE CERTIFICATE
// =================================

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


// =================================
// CONFIRM BLOCKCHAIN REGISTRATION
// =================================

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

    // Upload only after blockchain verification succeeds.
    // An IPFS failure must not undo blockchain verification.
    const ipfsUploaded =
      await uploadCertificateToIPFS(certificate);

    return res.status(200).json({
      success: true,
      message: ipfsUploaded
        ? "Certificate verified on the blockchain and encrypted PDF uploaded to IPFS."
        : "Certificate verified on the blockchain, but the IPFS upload failed. You can retry the upload.",
      certificate,
      blockchainVerified: true,
      ipfsUploaded,
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


// =================================
// REGISTER EXISTING CERTIFICATE
// ON BLOCKCHAIN
// =================================

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

    const ipfsUploaded =
      await uploadCertificateToIPFS(certificate);

    return res.status(200).json({
      success: true,
      message: ipfsUploaded
        ? "Existing certificate registered on the blockchain and encrypted PDF uploaded to IPFS."
        : "Existing certificate registered on the blockchain, but the IPFS upload failed. You can retry the upload.",
      certificate,
      blockchainVerified: true,
      ipfsUploaded,
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


// =================================
// GET WORKER CERTIFICATES
// =================================

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


// =================================
// PUBLIC CERTIFICATE VERIFICATION
// =================================

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

    // Recreate the hash from the certificate data.
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

    if (
      certificate.blockchainHash &&
      !hashMatches
    ) {
      return res.status(200).json({
        success: true,
        verified: false,
        message:
          "Certificate data has been modified and does not match the stored hash",
        certificate,
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
        await require("../services/blockchainService")
          .getCertificateFromBlockchain({
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
      certificate,
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
      await getCertificateFromBlockchain({
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

    const ipfsUploaded =
      await uploadCertificateToIPFS(certificate);

    return res.status(200).json({
      success: true,
      message: ipfsUploaded
        ? "Certificate synchronized with the blockchain and encrypted PDF uploaded to IPFS."
        : "Certificate synchronized with the blockchain, but the IPFS upload failed. You can retry the upload.",
      certificate,
      ipfsUploaded,
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


// =================================
// RETRY CERTIFICATE IPFS UPLOAD
// =================================

const retryCertificateIpfsUpload = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message:
          "Only employers can retry certificate IPFS uploads",
      });
    }

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

    const certificate = await Certificate.findOne({
      certificateId,
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
          "You can only upload your own certificates to IPFS",
      });
    }

    if (
      certificate.verificationStatus !== "Verified" ||
      !certificate.blockchainHash
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The certificate must be verified on the blockchain before uploading to IPFS",
      });
    }

    if (
      certificate.ipfsStatus === "Uploaded" &&
      certificate.ipfsCid
    ) {
      return res.status(200).json({
        success: true,
        message:
          "The encrypted certificate PDF is already uploaded to IPFS",
        ipfsStatus: certificate.ipfsStatus,
        ipfsCid: certificate.ipfsCid,
        ipfsUrl: certificate.ipfsUrl,
      });
    }

    const uploaded =
      await uploadCertificateToIPFS(certificate);

    if (!uploaded) {
      return res.status(502).json({
        success: false,
        message:
          "The IPFS upload failed. Check the server logs and try again.",
        ipfsStatus: certificate.ipfsStatus,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Encrypted certificate PDF uploaded to IPFS successfully",
      ipfsStatus: certificate.ipfsStatus,
      ipfsCid: certificate.ipfsCid,
      ipfsUrl: certificate.ipfsUrl,
      ipfsUploadedAt: certificate.ipfsUploadedAt,
    });
  } catch (error) {
    console.error(
      "Retry Certificate IPFS Upload Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to retry certificate IPFS upload",
    });
  }
};


// =================================
// DOWNLOAD CERTIFICATE PDF
// =================================

const downloadCertificatePdf = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).send(
        "Certificate ID is required"
      );
    }

    const certificate = await Certificate.findOne({
      certificateId: certificateId.trim(),
    });

    if (!certificate) {
      return res.status(404).send(
        "Certificate not found"
      );
    }

    const safeFilename =
      `${certificate.certificateId}.pdf`;

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFilename}"`
    );

    await generateCertificatePdf(certificate, res);
  } catch (error) {
    console.error("PDF Download Route Error:", error);

    if (!res.headersSent) {
      res.status(500).send(
        "Failed to generate PDF certificate"
      );
    }
  }
};


// =================================
// EXPORT CONTROLLERS
// =================================

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
  retryCertificateIpfsUpload,
};