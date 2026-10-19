# VeriWork — Verifiable Work Identity for Informal Domestic Workers

VeriWork is a decentralized platform that helps informal domestic workers (housekeepers, cooks, caregivers, drivers) build tamper-proof, cryptographically verifiable employment credentials, ratings, and digital certificates anchored on the Ethereum Sepolia blockchain.

---

## 🌟 Architecture Overview

```
               ┌────────────────────────────────────────────────────────┐
               │         Frontend: React 19 + Vite (Netlify)            │
               │        https://veriworkblockchain.netlify.app          │
               └──────────────────────────┬─────────────────────────────┘
                                          │ REST API & Auth Bearer
                                          ▼
               ┌────────────────────────────────────────────────────────┐
               │          Backend: Node.js + Express (Render)           │
               │            https://veriwork-e4th.onrender.com          │
               └──────────────┬───────────────────┬─────────────────────┘
                              │                   │
               ┌──────────────▼──────┐     ┌──────▼─────────────────────┐
               │    MongoDB Atlas    │     │   On-Demand PDF Engine     │
               │   User Profiles,    │     │   PDFKit In-Memory Stream  │
               │   Jobs & Ratings    │     │   Role-Based Authorization │
               └─────────────────────┘     └────────────────────────────┘
                              │
               ┌──────────────▼─────────────────────────────────────────┐
               │       Ethereum Sepolia Testnet (Chain ID 11155111)     │
               │   Smart Contract: 0xe2CC881c9aE8F1C6D1209C6171b84aeDB3134965 │
               │     SHA-256 / Keccak-256 On-Chain Certificate Hashes   │
               └────────────────────────────────────────────────────────┘
```

---

## 🔐 Security & Cryptography

1. **On-Demand Fast PDF Streaming**:
   - Certificate PDFs are generated dynamically in server memory using PDFKit (~50ms) and streamed directly to clients.
   - Eliminates third-party storage latency, gateway downtime, and external rate limits.

2. **Strict Authenticated Access Control**:
   - The backend endpoint `/api/certificates/download/:certificateId` enforces strict JWT authentication (`protect` middleware).
   - Only the worker who earned the certificate or the issuing employer can download the official private certificate with salary details.
   - Public verification downloads (`/api/certificates/download-pdf/:certificateId`) deliver a sanitized document that conceals private compensation data.

3. **Tamper-Proof Blockchain Anchoring**:
   - The cryptographic SHA-256 hash of each certificate is registered on the Ethereum Sepolia smart contract.
   - Anyone can verify the authenticity of a certificate using its ID without revealing private personal data.

4. **Administrative Governance Protection**:
   - Administrative routes (`/api/admin/*`) are protected by `adminProtect` middleware.
   - Requires an authenticated `x-admin-key` header matching `ADMIN_API_KEY` or an authenticated admin JWT bearer token.

---

## 🚀 Live Deployments & Smart Contracts

| Component | Target / Environment | URL / Address |
| :--- | :--- | :--- |
| **Frontend** | Netlify Production | `https://veriworkblockchain.netlify.app` |
| **Backend API** | Render Web Service | `https://veriwork-e4th.onrender.com` |
| **Network** | Ethereum Sepolia Testnet | Chain ID: `11155111` |
| **Smart Contract** | VeriWorkCertificate.sol | [`0xe2CC881c9aE8F1C6D1209C6171b84aeDB3134965`](https://sepolia.etherscan.io/address/0xe2CC881c9aE8F1C6D1209C6171b84aeDB3134965) |

---

## 📦 Project Structure

```
veriwork/
├── blockchain/                 # Solidity smart contracts & Hardhat config
│   ├── contracts/              # VeriWorkCertificate.sol
│   └── scripts/                # Deploy & test scripts
├── server/                     # Express Node.js backend
│   ├── controllers/            # Controller logic (auth, certificates, admin)
│   ├── middleware/             # Auth, admin, rate-limiting & security headers
│   ├── models/                 # Mongoose models (Worker, Employer, Certificate, Rating)
│   ├── routes/                 # Express API routes
│   ├── services/               # IPFS, PDF, blockchain, encryption services
│   ├── tests/                  # Automated unit and integration test suites
│   ├── app.js                  # Express application setup
│   └── server.js               # HTTP listener & database connection
├── src/                        # Vite + React frontend application
│   ├── components/             # Reusable UI components (Navbar, WorkCertificate, etc.)
│   ├── pages/                  # Page views (WorkerDashboard, AdminDashboard, VerifyCertificate)
│   ├── services/               # Axios API clients & Web3 integrations
│   └── App.jsx                 # Client routing & layout
├── package.json                # Root package configuration
└── README.md                   # Project documentation
```

---

## ⚙️ Environment Variables

### Backend Configuration (`server/.env`)

```env
PORT=5000
FRONTEND_URL=https://veriworkblockchain.netlify.app
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/veriwork?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_secure_jwt_secret
ADMIN_API_KEY=your_secure_admin_passkey_for_governance

# Blockchain (Ethereum Sepolia - Chain ID 11155111)
BLOCKCHAIN_RPC_URL=https://rpc.sepolia.org
BLOCKCHAIN_PRIVATE_KEY=your_relayer_or_owner_private_key
BLOCKCHAIN_CONTRACT_ADDRESS=0xe2CC881c9aE8F1C6D1209C6171b84aeDB3134965
```

### Frontend Configuration (`.env`)

```env
VITE_API_URL=https://veriwork-e4th.onrender.com/api
VITE_CONTRACT_ADDRESS=0xe2CC881c9aE8F1C6D1209C6171b84aeDB3134965
```

---

## 🛠️ Local Development & Testing

### 1. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 2. Run Automated Test Suites

```bash
# Run server test suites (covering on-demand streaming, RBAC ownership, and admin security)
cd server
npm test
```

### 3. Run Development Servers

```bash
# In terminal 1: Start backend
cd server
npm run dev

# In terminal 2: Start frontend
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

---

## 📜 License

Licensed under the MIT License.
