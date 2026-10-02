const { ethers } = require("ethers");
const Worker = require("../models/Worker");
const Employer = require("../models/Employer");
const Employment = require("../models/Employment");
const Certificate = require("../models/Certificate");
const Rating = require("../models/Rating");
const {
  checkIsIssuerOnBlockchain,
  authorizeIssuerOnBlockchain,
  revokeIssuerOnBlockchain,
  getCertificateFromBlockchain,
} = require("../services/blockchainService");

// =================================
// 1. GET SYSTEM OVERVIEW STATS
// =================================
const getAdminOverview = async (req, res) => {
  try {
    const [
      totalWorkers,
      totalEmployers,
      totalEmployments,
      activeEmployments,
      completedEmployments,
      totalCertificates,
      verifiedCertificates,
      pendingCertificates,
      totalRatings,
    ] = await Promise.all([
      Worker.countDocuments(),
      Employer.countDocuments(),
      Employment.countDocuments(),
      Employment.countDocuments({ status: "Active" }),
      Employment.countDocuments({ status: "Completed" }),
      Certificate.countDocuments(),
      Certificate.countDocuments({ verificationStatus: "Verified" }),
      Certificate.countDocuments({ verificationStatus: "Pending" }),
      Rating.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalWorkers,
        totalEmployers,
        totalEmployments,
        activeEmployments,
        completedEmployments,
        totalCertificates,
        verifiedCertificates,
        pendingCertificates,
        totalRatings,
        verificationRate:
          totalCertificates > 0
            ? Math.round((verifiedCertificates / totalCertificates) * 100)
            : 0,
      },
      contractInfo: {
        address: process.env.BLOCKCHAIN_CONTRACT_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        network: "Hardhat Local EVM (Chain ID 31337)",
        rpcUrl: process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545",
        ownerAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      },
    });
  } catch (error) {
    console.error("Admin Overview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load admin overview: " + error.message,
    });
  }
};

// =================================
// 2. GET ALL ISSUERS & STATUS
// =================================
const getAdminIssuers = async (req, res) => {
  try {
    const employers = await Employer.find().select("-password").sort({ createdAt: -1 });

    const issuersWithStatus = await Promise.all(
      employers.map(async (emp) => {
        let isAuthorized = false;
        if (emp.walletAddress && ethers.isAddress(emp.walletAddress)) {
          try {
            isAuthorized = await checkIsIssuerOnBlockchain(emp.walletAddress);
          } catch {
            isAuthorized = false;
          }
        }

        const certCount = await Certificate.countDocuments({ employerId: emp._id });
        const verifiedCount = await Certificate.countDocuments({
          employerId: emp._id,
          verificationStatus: "Verified",
        });

        return {
          _id: emp._id,
          employerName: emp.employerName,
          email: emp.email,
          phone: emp.phone,
          walletAddress: emp.walletAddress || "",
          isAuthorizedOnChain: isAuthorized,
          totalCertificates: certCount,
          verifiedCertificates: verifiedCount,
          createdAt: emp.createdAt,
        };
      })
    );

    return res.status(200).json({
      success: true,
      issuers: issuersWithStatus,
    });
  } catch (error) {
    console.error("Admin Issuers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load issuers: " + error.message,
    });
  }
};

// =================================
// 3. AUTHORIZE ISSUER ON BLOCKCHAIN
// =================================
const authorizeAdminIssuer = async (req, res) => {
  try {
    const { walletAddress, employerId } = req.body;

    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: "A valid Ethereum wallet address is required",
      });
    }

    const cleanAddress = ethers.getAddress(walletAddress);

    // Call smart contract via owner signer
    const result = await authorizeIssuerOnBlockchain(cleanAddress);

    // If an employerId was provided, associate wallet in DB
    if (employerId) {
      await Employer.findByIdAndUpdate(employerId, { walletAddress: cleanAddress });
    }

    return res.status(200).json({
      success: true,
      message: result.alreadyAuthorized
        ? `Wallet ${cleanAddress} is already an authorized issuer on-chain.`
        : `Wallet ${cleanAddress} successfully authorized as certificate issuer on smart contract!`,
      result,
    });
  } catch (error) {
    console.error("Authorize Issuer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Smart contract authorization failed: " + error.message,
    });
  }
};

// =================================
// 4. REVOKE ISSUER ON BLOCKCHAIN
// =================================
const revokeAdminIssuer = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: "A valid Ethereum wallet address is required",
      });
    }

    const cleanAddress = ethers.getAddress(walletAddress);

    // Call smart contract via owner signer
    const result = await revokeIssuerOnBlockchain(cleanAddress);

    return res.status(200).json({
      success: true,
      message: result.alreadyRevoked
        ? `Wallet ${cleanAddress} was not an active issuer.`
        : `Wallet ${cleanAddress} issuer permissions successfully revoked on smart contract!`,
      result,
    });
  } catch (error) {
    console.error("Revoke Issuer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Smart contract revocation failed: " + error.message,
    });
  }
};

// =================================
// 5. GET ALL CERTIFICATES (LEDGER AUDIT)
// =================================
const getAdminCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("workerId", "fullName email")
      .populate("employerId", "employerName email walletAddress")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error("Admin Certificates Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load certificates: " + error.message,
    });
  }
};

// =================================
// 6. INSPECT ON-CHAIN RECORD DIRECTLY
// =================================
const inspectBlockchainCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const dbCert = await Certificate.findOne({ certificateId: certificateId.trim() });
    if (!dbCert) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found in database",
      });
    }

    const onChainRecord = await getCertificateFromBlockchain({ certificateId });

    return res.status(200).json({
      success: true,
      databaseRecord: dbCert,
      onChainRecord,
      registeredOnChain: Boolean(onChainRecord?.exists),
      hashMatches: onChainRecord
        ? onChainRecord.certificateHash.toLowerCase() === (dbCert.blockchainHash || "").toLowerCase()
        : false,
    });
  } catch (error) {
    console.error("Inspect Blockchain Error:", error);
    return res.status(500).json({
      success: false,
      message: "Inspection failed: " + error.message,
    });
  }
};

module.exports = {
  getAdminOverview,
  getAdminIssuers,
  authorizeAdminIssuer,
  revokeAdminIssuer,
  getAdminCertificates,
  inspectBlockchainCertificate,
};
