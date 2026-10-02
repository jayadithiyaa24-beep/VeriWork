# VeriWork — Decentralized Work Identity Platform for Informal Domestic Workers
## Complete Architecture & Production Deployment Guide

VeriWork is a blockchain-based digital employment credential and reputation platform designed to provide informal domestic workers (cooks, housekeepers, drivers, caregivers) with verifiable, portable, and tamper-proof work identity credentials anchored to the Ethereum / EVM blockchain.

---

## 🏛️ System Architecture

```text
React 19 + Vite Frontend (Port 5173)
       │
       ▼ (REST API / Axios)
Node.js + Express REST API (Port 5000)
       ├── MongoDB (Local / Atlas - Workers, Employers, Employments, Ratings, Certificates)
       └── Ethers.js v6 Service
             │
             ▼ (JSON-RPC)
Ethereum / EVM Smart Contract (VeriWorkCertificate.sol)
       ▲
       │ (EIP-1193)
MetaMask Wallet (Employer Web3 Signer)
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **MongoDB**: Running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas
- **MetaMask Extension**: Installed in Google Chrome, Brave, or Edge

### 2. Running Local Blockchain (Hardhat)
```bash
cd "d:/Blockchain Project/veriwork/blockchain"
npx hardhat node
```
*Local Node RPC:* `http://127.0.0.1:8545`  
*Chain ID:* `31337` (Hex: `0x7a69`)

### 3. Deploying Smart Contract
```bash
cd "d:/Blockchain Project/veriwork/blockchain"
npx hardhat ignition deploy ignition/modules/VeriWorkCertificate.ts --network localhost
```
*Current Active Deployed Contract:* `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`

### 4. Running Backend Server
```bash
cd "d:/Blockchain Project/veriwork/server"
npm install
npm run dev
```
*Backend runs on:* `http://localhost:5000`

### 5. Running Frontend Client
```bash
cd "d:/Blockchain Project/veriwork"
npm install
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

---

## 🦊 Configuring MetaMask for Local Development

1. Open **MetaMask** ➔ Click Network dropdown (top-left) ➔ **Add network** ➔ **Add a network manually**:
   - **Network Name**: `VeriWork Local`
   - **New RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`
2. **Auto-Faucet**: When an employer connects their MetaMask wallet in VeriWork, our backend automatically tops up the wallet with **50.0 test ETH** for local gas fees.

---

## 🔐 Security & Privacy Guardrails (Zero-Knowledge PII Standard)

| Guardrail | Implementation | Purpose |
| :--- | :--- | :--- |
| **Aadhaar Confidentiality** | `XXXX-XXXX-1099` | 12-digit Aadhaar numbers are never returned in public or profile APIs. |
| **Password Redaction** | `bcrypt` (10 rounds) + `.select("-password")` | Password hashes are never broadcast in JSON payloads. |
| **Anti-IDOR Protection** | Server-side ownership validation | Employers can only complete and issue certificates for their own employees. |
| **Anti-Replay Protection** | Cryptographic hash uniqueness mapping | A transaction hash or certificate hash cannot be claimed by another entity. |
| **Smart Contract Access Control** | `onlyAuthorizedIssuer` modifier | Only pre-authorized employer wallets can register work certificates on-chain. |
| **Tamper Detection** | Real-time SHA-256 digest comparison | Recomputes deterministic hash against contract storage; alerts if data is altered. |
| **OWASP Security Headers** | `nosniff`, `DENY` frames, `XSS` mode | Protects against MIME-sniffing, clickjacking, and script injection. |
| **Brute-Force Rate Limiting** | In-memory sliding window limiter | Mitigates credential stuffing and denial-of-service attacks. |

---

## 🌐 Public Certificate Verification Portal

Prospective employers or background verification agencies can verify any work certificate without logging in:
- **Verification URL**: `http://localhost:5173/verify-certificate?id=VW-CERT-YYYY-XXXXXXXX`
- **Path Routing**: `http://localhost:5173/verify/:certificateId`
- **Proof Display**:
  - Gold-seal credential card with printable PDF styling (`Ctrl+P` / Save as PDF).
  - Multi-layer audit checklist (Role integrity, SHA-256 match, Smart Contract ledger).
  - Smart contract address, authorized issuer wallet, transaction hash, and block timestamp.

---

## 🚢 Deploying to Ethereum Testnets (Sepolia / Polygon Amoy)

To take VeriWork to a public testnet:

1. **Configure Hardhat Network** in `blockchain/hardhat.config.ts`:
```typescript
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
    accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
  },
  amoy: {
    url: "https://rpc-amoy.polygon.technology",
    accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
  }
}
```

2. **Deploy to Testnet**:
```bash
npx hardhat ignition deploy ignition/modules/VeriWorkCertificate.ts --network sepolia
```

3. **Update Environment Variables**:
In `server/.env` and `src/services/blockchainService.js`:
- Set `BLOCKCHAIN_CONTRACT_ADDRESS` to the new testnet contract address.
- Set `BLOCKCHAIN_RPC_URL` to your Infura / Alchemy / public RPC endpoint.
- In `EmployerDashboard.jsx`, update `hardhatChainId` to `11155111` (Sepolia: `0xaa36a7`) or `80002` (Amoy: `0x13882`).

---

## 🧪 Automated Test Suite

Run the master end-to-end pipeline test anytime to verify all 8 platform pillars:
```bash
node scratch/master_e2e_test.js
```
*Validates: Worker Auth ➔ Employer Auth ➔ Employment Lifecycle ➔ Job Completion ➔ Mutual 5-Star Ratings ➔ Certificate Minting ➔ Smart Contract Storage ➔ Public Verification ➔ SHA-256 Tamper Detection.*

---
*Built with ❤️ for Informal Domestic Workers by the VeriWork Team.*
