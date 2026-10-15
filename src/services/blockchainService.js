import { ethers } from "ethers";

// VeriWork contract deployed on Ethereum Sepolia
const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  "0xe2CC881c9aE8f1C6D1209C6171b84aeDB3134965";

const SEPOLIA_CHAIN_ID = 11155111n;

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
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "isIssuer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

const getMetaMaskProvider = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install or unlock MetaMask.");
  }

  return new ethers.BrowserProvider(window.ethereum);
};

const ensureSepoliaNetwork = async (provider) => {
  let network = await provider.getNetwork();

  if (network.chainId === SEPOLIA_CHAIN_ID) {
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }],
    });
  } catch (error) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xaa36a7",
            chainName: "Ethereum Sepolia",
            nativeCurrency: {
              name: "Sepolia Ether",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.sepolia.org"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });
    } else if (error.code === 4001) {
      throw new Error("Please approve switching MetaMask to Ethereum Sepolia.");
    } else {
      throw error;
    }
  }

  // Re-check after the wallet switches networks.
  network = await provider.getNetwork();

  if (network.chainId !== SEPOLIA_CHAIN_ID) {
    throw new Error("Please switch MetaMask to Ethereum Sepolia and try again.");
  }
};

export const registerCertificateWithMetaMask = async ({
  certificateId,
  certificateHash,
}) => {
  if (!certificateId || !certificateHash) {
    throw new Error("Certificate ID and certificate hash are required.");
  }

  const provider = getMetaMaskProvider();

  // Request wallet access and ensure the correct network.
  await provider.send("eth_requestAccounts", []);
  await ensureSepoliaNetwork(provider);

  const signer = await provider.getSigner();
  const walletAddress = await signer.getAddress();

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  );

  // Check whether this wallet is authorized to register certificates.
  const isAuthorized = await contract.isIssuer(walletAddress);

  if (!isAuthorized) {
    throw new Error(
      "This wallet is not an authorized VeriWork issuer. The contract owner must authorize it first."
    );
  }

  // Submit the registration transaction and wait for confirmation.
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
    certificateId,
    certificateHash,
    walletAddress,
  };
};