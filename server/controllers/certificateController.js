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

    // Recalculate the hash from certificate data
    const certificateHash = createCertificateHash({
      certificateId: certificate.certificateId,
      workerName: certificate.workerName,
      employerName: certificate.employerName,
      jobRole: certificate.jobRole,
      salary: certificate.salary,
      startDate: certificate.startDate,
      endDate: certificate.endDate,
    });

    // Compare calculated hash with the stored hash
    const hashMatches =
      Boolean(certificate.blockchainHash) &&
      certificateHash.toLowerCase() ===
      certificate.blockchainHash.toLowerCase();

    if (!hashMatches) {
      return res.status(200).json({
        success: true,
        verified: false,
        message:
          "Certificate data does not match the stored certificate hash",
        certificate,
        hashMatches: false,
        blockchainVerified: false,
      });
    }

    // Check the actual smart contract
    let onChainRecord = null;

    try {
      onChainRecord = await getCertificateFromBlockchain({
        certificateId: certificate.certificateId,
      });
    } catch (error) {
      console.error("Blockchain Verification Error:", error.message);
    }

    const blockchainVerified =
      Boolean(onChainRecord?.exists) &&
      onChainRecord.certificateId === certificate.certificateId &&
      onChainRecord.certificateHash.toLowerCase() ===
      certificateHash.toLowerCase();

    const verified = hashMatches && blockchainVerified;

    return res.status(200).json({
      success: true,
      verified,
      message: verified
        ? "Certificate verified successfully on the blockchain"
        : "Certificate could not be verified on the blockchain",
      certificate,
      hashMatches,
      blockchainVerified,
      transactionHashAvailable: Boolean(
        certificate.blockchainTransactionHash
      ),
      onChainDetails: onChainRecord
        ? {
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