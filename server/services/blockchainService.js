
const { ethers } = require("ethers");

const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "certificateId", type: "string" },
      { internalType: "bytes32", name: "certificateHash", type: "bytes32" },
    ],
    name: "registerCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "certificateId", type: "string" },
      { internalType: "bytes32", name: "certificateHash", type: "bytes32" },
    ],
    name: "verifyCertificate",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "certificateId", type: "string" },
    ],
    name: "getCertificate",
    outputs: [
      { internalType: "string", name: "", type: "string" },
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "bool", name: "", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "issuer", type: "address" },
    ],
    name: "addIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "issuer", type: "address" },
    ],
    name: "removeIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "isIssuer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];

const getProvider = () => {
  if (!process.env.BLOCKCHAIN_RPC_URL) {
    throw new Error("BLOCKCHAIN_RPC_URL is not configured");
  }

  return new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
};

const getContract = () => {
  if (!process.env.BLOCKCHAIN_PRIVATE_KEY) {
    throw new Error("BLOCKCHAIN_PRIVATE_KEY is not configured");
  }

  if (!process.env.BLOCKCHAIN_CONTRACT_ADDRESS) {
    throw new Error("BLOCKCHAIN_CONTRACT_ADDRESS is not configured");
  }

  const provider = getProvider();
  const wallet = new ethers.Wallet(
    process.env.BLOCKCHAIN_PRIVATE_KEY,
    provider
  );

  return new ethers.Contract(
    process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
    CONTRACT_ABI,
    wallet
  );
};

// =================================
// CREATE CERTIFICATE HASH
// =================================

const createCertificateHash = ({
  certificateId,
  workerName,
  employerName,
  jobRole,
  salary,
  startDate,
  endDate,
}) => {
  const certificateData = JSON.stringify({
    certificateId,
    workerName,
    employerName,
    jobRole,
    salary,
    startDate,
    endDate,
  });

  return ethers.keccak256(ethers.toUtf8Bytes(certificateData));
};

// =================================
// REGISTER CERTIFICATE ON BLOCKCHAIN
// =================================

const registerCertificateOnBlockchain = async ({
  certificateId,
  certificateHash,
}) => {
  const contract = getContract();

  const transaction = await contract.registerCertificate(
    certificateId,
    certificateHash
  );

  const receipt = await transaction.wait();

  if (!receipt || receipt.status !== 1) {
    throw new Error("Certificate registration transaction failed.");
  }

  return {
    transactionHash: receipt.hash,
    certificateHash,
  };
};

// =================================
// VERIFY CERTIFICATE ON BLOCKCHAIN
// =================================

const verifyCertificateOnBlockchain = async ({
  certificateId,
  certificateHash,
}) => {
  const provider = getProvider();

  if (!process.env.BLOCKCHAIN_CONTRACT_ADDRESS) {
    throw new Error("BLOCKCHAIN_CONTRACT_ADDRESS is not configured");
  }

  const contract = new ethers.Contract(
    process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
    CONTRACT_ABI,
    provider
  );

  return contract.verifyCertificate(certificateId, certificateHash);
};

// =================================
// GET CERTIFICATE FROM BLOCKCHAIN
// =================================

const getCertificateFromBlockchain = async ({ certificateId }) => {
  const provider = getProvider();

  if (!process.env.BLOCKCHAIN_CONTRACT_ADDRESS) {
    throw new Error("BLOCKCHAIN_CONTRACT_ADDRESS is not configured");
  }

  const contract = new ethers.Contract(
    process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
    CONTRACT_ABI,
    provider
  );

  try {
    const [id, hash, registeredBy, registeredAt, exists] =
      await contract.getCertificate(certificateId);

    return {
      certificateId: id,
      certificateHash: hash,
      registeredBy,
      registeredAt: Number(registeredAt),
      exists,
    };
  } catch (error) {
    console.error("Get Certificate From Blockchain Error:", error.message);
    return null;
  }
};

// =================================
// HARDENED TRANSACTION VERIFICATION
// =================================

const verifyTransactionDetails = async ({
  transactionHash,
  certificateId,
  certificateHash,
}) => {
  const provider = getProvider();

  if (!process.env.BLOCKCHAIN_CONTRACT_ADDRESS) {
    throw new Error("BLOCKCHAIN_CONTRACT_ADDRESS is not configured");
  }

  const expectedContractAddress =
    process.env.BLOCKCHAIN_CONTRACT_ADDRESS.toLowerCase();

  const tx = await provider.getTransaction(transactionHash);

  if (!tx) {
    return {
      isValid: false,
      reason: "Transaction was not found on the blockchain.",
    };
  }

  const receipt = await provider.getTransactionReceipt(transactionHash);

  if (!receipt) {
    return {
      isValid: false,
      reason: "Transaction receipt was not found (transaction might still be pending).",
    };
  }

  if (receipt.status !== 1) {
    return {
      isValid: false,
      reason: "Blockchain transaction failed or reverted.",
    };
  }

  const destinationAddress = (receipt.to || tx.to || "").toLowerCase();

  if (destinationAddress !== expectedContractAddress) {
    return {
      isValid: false,
      reason: `Transaction target address (${destinationAddress}) does not match the VeriWork contract address (${expectedContractAddress}).`,
    };
  }

  const contractInterface = new ethers.Interface(CONTRACT_ABI);
  let parsedTx;

  try {
    parsedTx = contractInterface.parseTransaction({
      data: tx.data,
      value: tx.value,
    });
  } catch (error) {
    return {
      isValid: false,
      reason: "Failed to decode transaction data against VeriWork ABI.",
    };
  }

  if (!parsedTx || parsedTx.name !== "registerCertificate") {
    return {
      isValid: false,
      reason: `Invalid transaction call. Expected 'registerCertificate', got '${parsedTx?.name || "unknown"}'.`,
    };
  }

  const txCertId = parsedTx.args[0];
  const txCertHash = parsedTx.args[1];

  if (txCertId !== certificateId) {
    return {
      isValid: false,
      reason: `Certificate ID mismatch. Transaction registered '${txCertId}', but expected '${certificateId}'.`,
    };
  }

  if (txCertHash.toLowerCase() !== certificateHash.toLowerCase()) {
    return {
      isValid: false,
      reason: "Certificate hash in the transaction does not match the expected hash.",
    };
  }

  const contract = new ethers.Contract(
    process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
    CONTRACT_ABI,
    provider
  );

  let onChainData;

  try {
    onChainData = await contract.getCertificate(certificateId);
  } catch (error) {
    return {
      isValid: false,
      reason: "Could not read certificate from smart contract storage.",
    };
  }

  const [onChainId, onChainHash, registeredBy, registeredAt, exists] =
    onChainData;

  if (!exists) {
    return {
      isValid: false,
      reason: "Certificate does not exist in smart contract storage.",
    };
  }

  if (onChainId !== certificateId) {
    return {
      isValid: false,
      reason: "Certificate ID in smart contract storage does not match.",
    };
  }

  if (onChainHash.toLowerCase() !== certificateHash.toLowerCase()) {
    return {
      isValid: false,
      reason: "On-chain stored hash does not match the computed certificate hash.",
    };
  }

  return {
    isValid: true,
    senderWallet: tx.from,
    registeredBy,
    registeredAt: Number(registeredAt),
    blockNumber: receipt.blockNumber,
    transactionHash,
  };
};

// =================================
// CHECK IF WALLET IS ISSUER
// =================================

const checkIsIssuerOnBlockchain = async (address) => {
  const provider = getProvider();

  if (!process.env.BLOCKCHAIN_CONTRACT_ADDRESS) {
    throw new Error("BLOCKCHAIN_CONTRACT_ADDRESS is not configured");
  }

  const contract = new ethers.Contract(
    process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
    CONTRACT_ABI,
    provider
  );

  return contract.isIssuer(address);
};

// =================================
// AUTHORIZE ISSUER ON BLOCKCHAIN
// =================================

const authorizeIssuerOnBlockchain = async (issuerAddress) => {
  if (!ethers.isAddress(issuerAddress)) {
    throw new Error("Invalid issuer wallet address.");
  }

  const contract = getContract();

  const isAlreadyIssuer = await contract.isIssuer(issuerAddress);

  if (isAlreadyIssuer) {
    return {
      success: true,
      alreadyAuthorized: true,
      issuerAddress,
    };
  }

  const transaction = await contract.addIssuer(issuerAddress);
  const receipt = await transaction.wait();

  if (!receipt || receipt.status !== 1) {
    throw new Error("Issuer authorization transaction failed.");
  }

  return {
    success: true,
    alreadyAuthorized: false,
    issuerAddress,
    transactionHash: receipt.hash,
  };
};

// =================================
// REVOKE ISSUER ON BLOCKCHAIN
// =================================

const revokeIssuerOnBlockchain = async (issuerAddress) => {
  if (!ethers.isAddress(issuerAddress)) {
    throw new Error("Invalid issuer wallet address.");
  }

  const contract = getContract();

  const isCurrentlyIssuer = await contract.isIssuer(issuerAddress);

  if (!isCurrentlyIssuer) {
    return {
      success: true,
      alreadyRevoked: true,
      issuerAddress,
    };
  }

  const transaction = await contract.removeIssuer(issuerAddress);
  const receipt = await transaction.wait();

  if (!receipt || receipt.status !== 1) {
    throw new Error("Issuer revocation transaction failed.");
  }

  return {
    success: true,
    alreadyRevoked: false,
    issuerAddress,
    transactionHash: receipt.hash,
  };
};

module.exports = {
  createCertificateHash,
  registerCertificateOnBlockchain,
  verifyCertificateOnBlockchain,
  getCertificateFromBlockchain,
  verifyTransactionDetails,
  checkIsIssuerOnBlockchain,
  authorizeIssuerOnBlockchain,
  revokeIssuerOnBlockchain,
};
