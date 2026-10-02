import { ethers } from "ethers";

// =================================
// VERIWORK CONTRACT
// =================================

const CONTRACT_ADDRESS =
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "certificateId",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "certificateHash",
        type: "bytes32",
      },
    ],
    name: "registerCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isIssuer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];


// =================================
// GET METAMASK PROVIDER
// =================================

const getMetaMaskProvider = () => {
  if (!window.ethereum) {
    throw new Error(
      "MetaMask is not installed."
    );
  }

  return new ethers.BrowserProvider(
    window.ethereum
  );
};


// =================================
// REGISTER CERTIFICATE USING METAMASK
// =================================

export const registerCertificateWithMetaMask =
  async ({
    certificateId,
    certificateHash,
  }) => {
    const provider =
      getMetaMaskProvider();

    // Get MetaMask signer
    const signer =
      await provider.getSigner();

    // Create contract instance
    const contract =
      new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

    // Send blockchain transaction
    const transaction =
      await contract.registerCertificate(
        certificateId,
        certificateHash
      );

    // Wait for blockchain confirmation
    const receipt =
      await transaction.wait();

    return {
      transactionHash:
        receipt.hash,

      certificateId,

      certificateHash,

      walletAddress:
        await signer.getAddress(),
    };
  };