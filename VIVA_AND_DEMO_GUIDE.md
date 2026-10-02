# VeriWork — Final Viva & Project Demonstration Guide
**Project Title:** VERIWORK: Blockchain-Based Verifiable Work Identity for Informal Domestic Workers  
**Presenter:** A. Jayadithiyaa (Reg No: 25BCE5375)  
**Department:** School of Computer Science and Engineering  
**Platform Version:** VeriWork Enterprise v2.0 (Steps 1–13 Complete)  

---

## 📋 Executive Overview

VeriWork is a decentralized digital employment credential and reputation platform designed to solve the lack of standardized, portable, and verifiable work history for informal domestic workers (cooks, housekeepers, drivers, caregivers).

By pairing **off-chain privacy-preserving storage (MongoDB)** with **on-chain immutable cryptographic anchoring (Ethereum EVM Smart Contracts via Ethers.js v6)**, VeriWork ensures:
1. Domestic workers own an unalterable, portable proof of work experience.
2. Prospective employers and background verification agencies can independently verify claims without third-party intermediaries.
3. Sensitive personal data (Aadhaar numbers, residential addresses, passwords) is protected under Zero-Knowledge Privacy Standards.

---

## ⏱️ 3-Minute Live Examiner Demonstration Script

Follow this exact sequence during your live demo to showcase every layer of the technology stack:

### Step 1: Platform Overview & System Health (30 Seconds)
1. Open the browser to **`http://localhost:5173`** (VeriWork Homepage).
2. Point out the hero section, key platform features, and navigation bar.
3. Open **`http://localhost:5173/admin`** (**Admin & Governance Dashboard**):
   - *Key Talking Point:* "Here is our protocol governance dashboard. We monitor total enrolled workers, registered employers, active employment contracts, and on-chain verified credentials in real-time."
   - Show the Smart Contract address: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` on the local EVM node.
   - Show the **Issuer Governance** table: Explain that only approved employer wallets can register credentials on-chain (`onlyAuthorizedIssuer` modifier).

### Step 2: Domestic Worker Privacy & Dashboard (45 Seconds)
1. Open a new tab and navigate to **`http://localhost:5173/login`**.
2. Log in with a Worker account (e.g., `kumar@gmail.com` / `kumar123` or your test worker).
3. Showcase:
   - **Zero-Knowledge Privacy Shield:** The worker's 12-digit Aadhaar number is masked as `XXXX-XXXX-6940`.
   - **MetaMask Web3 Wallet:** Worker can connect their personal Web3 wallet to claim decentralized identity ownership.
   - **Mutual Ratings & Reputation:** Aggregate 5.0 rating with authentic feedback from previous employers.
   - **Tab-Scoped Session Privacy:** Copy the URL (`http://localhost:5173/worker-dashboard`) into a fresh incognito window/tab. Show that it immediately redirects to `/login` to prevent session leakage!

### Step 3: Employer Workflow & Smart Contract Minting (45 Seconds)
1. Navigate to **`http://localhost:5173/employer-login`**.
2. Log in as Employer (e.g., `rajesh@gmail.com` / `rajesh123`).
3. Showcase:
   - **Contract Management:** Active and completed domestic employment records.
   - **Job Completion & Mutual Rating:** Employers mark a job as completed and rate the worker with 1–5 stars and comments.
   - **Blockchain Registration:** Click **"🔗 Register Blockchain"** — MetaMask pops up and signs the transaction to execute `registerCertificate(certificateId, certificateHash)`.
   - **Auto-Faucet:** Highlight that our backend automatically funds any connected employer wallet with 50 test ETH for gas fees!

### Step 4: Public Independent Verification & Scannable QR Code (60 Seconds)
1. Navigate to **`http://localhost:5173/verify-certificate?id=VW-CERT-2026-EB643FEA`**.
2. Showcase the **Gold-Seal Credential Card**:
   - Status: **"Authentic & Blockchain Verified (100% Ledger Match)"**.
   - Dual-border Guilloche styling with Gold Seal (`★ VERIFIED LEDGER`).
   - Dynamic **Scannable QR Code** linking directly to the live smart contract portal.
   - **Instant PDF Export:** Click **"👁️ Open PDF"** to view the native vector PDF directly in the browser, or **"📥 Download PDF & QR"** to save the crisp 5.2 KB official certificate to your machine.
3. Showcase **Tamper Detection**:
   - Explain how any unauthorized modification in MongoDB triggers a cryptographic SHA-256 hash mismatch alert on the portal.

---

## 🏛️ System Architecture Breakdown

```text
┌─────────────────────────────────────────────────────────────┐
│                 React 19 + Vite Frontend                    │
│   (Worker Dashboard, Employer Dashboard, Admin, Portal)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST / Axios
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Node.js + Express.js API Layer                 │
│  - JWT & Tab-Scoped Sessions   - OWASP Security Headers     │
│  - Sliding Window Rate Limiter - PDFKit Vector Generator    │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼ Mongoose                     ▼ Ethers.js v6 (JSON-RPC)
┌──────────────────────────────┐ ┌────────────────────────────┐
│      MongoDB Database        │ │  Ethereum / EVM Blockchain │
│  - Off-Chain Worker Details  │ │  (VeriWorkCertificate.sol) │
│  - Masked Aadhaar Storage    │ │  - Immutable Record Hashes │
│  - Employment & Reviews      │ │  - Issuer Access Control   │
└──────────────────────────────┘ └────────────────────────────┘
```

### Storage Segregation Principle (Why Hybrid Architecture?)
| Data Category | Storage Location | Rationale |
| :--- | :--- | :--- |
| **Worker PII & Names** | MongoDB (Off-Chain) | Complies with data protection laws (DPDP Act, GDPR). Personal data can be corrected and is never permanently exposed on a public ledger. |
| **Masked Aadhaar Number** | MongoDB (Off-Chain) | Only last 4 digits stored; 12-digit number is never broadcast in public payloads. |
| **Passwords** | MongoDB (Off-Chain) | Hashed with `bcrypt` (10 salt rounds); completely redacted (`.select("-password")`). |
| **Deterministic SHA-256 Hashes** | Smart Contract (On-Chain) | Irreversible 32-byte cryptographic fingerprints guaranteeing that off-chain data has never been tampered with. |
| **Issuer Wallet Address** | Smart Contract (On-Chain) | Authorizes who has legal signing authority to issue credentials. |
| **Block Timestamp** | Smart Contract (On-Chain) | Provides non-repudiable proof of exactly when the certificate was issued. |

---

## 🎓 Slide-by-Slide Alignment with Presentation PPT

| Slide # | Slide Title | Technical Demonstration in VeriWork |
| :---: | :--- | :--- |
| **1** | Title & Introduction | Developed by A. Jayadithiyaa (25BCE5375), SCOPE. |
| **2–4** | Problem Statement & Target Group | Solves informal worker vulnerability, lack of references, and verification friction. |
| **5–6** | Objectives & Proposed Solution | Hybrid off-chain MongoDB + on-chain EVM cryptographic proof pipeline. |
| **7–8** | Tech Stack & Architecture | React 19, Node/Express, Ethers.js v6, Hardhat, Bootstrap 5, MongoDB. |
| **9** | 6-Step Methodology | Register ➔ Auth ➔ Contract ➔ Complete ➔ Rate ➔ Mint On-Chain. |
| **10–12**| Smart Contract Architecture | `registerCertificate()`, `verifyCertificate()`, `addIssuer()`, `removeIssuer()`, `onlyAuthorizedIssuer`. |
| **13** | Putting It Together | Full end-to-end integration: Employer creates job ➔ Backend hashes ➔ On-chain anchor ➔ Public audit. |
| **14** | Research Gap Analysis | Compares VeriWork with LinkedIn/centralized job portals that exclude informal domestic labor. |
| **15–16**| Outcomes & Conclusion | Portable digital identity, tamper-evident verification, zero-knowledge privacy. |

---

## 💡 Anticipated Viva Questions & High-Scoring Answers

### Q1: Why do you need Blockchain? Why not just use a standard centralized SQL/MongoDB database?
> **Answer:**  
> "A centralized database has a single point of failure and a single point of trust. An employer, database administrator, or attacker with database access can alter employment records, falsify work experience, or delete negative ratings without leaving a trace.  
> In VeriWork, the employment record's deterministic SHA-256 digest is anchored onto the Ethereum blockchain smart contract. Once mined into a block, it is cryptographically impossible to alter or forge retroactively. If anyone tampers with a record in MongoDB, our public portal recalculates the hash and immediately triggers a **Tamper Detected** warning."

### Q2: How does VeriWork protect worker privacy under the DPDP Act / GDPR?
> **Answer:**  
> "We implement a strict **Zero-Knowledge Privacy Standard**:
> 1. **Off-Chain PII:** Sensitive personal details (Aadhaar, home address, phone numbers) are never committed to the public blockchain because blockchain transactions are permanent and publicly viewable.
> 2. **Masked Aadhaar:** The database and UI only expose masked Aadhaar values (`XXXX-XXXX-1099`), preventing identity theft.
> 3. **Deterministic Hashes:** Only a 32-byte cryptographic keccak256/SHA-256 hash is stored on-chain. It is a one-way mathematical function; no one can reverse-engineer personal worker details from the hash alone."

### Q3: How do you prevent unauthorized employers from creating fake certificates?
> **Answer:**  
> "We enforce smart contract-level **Role-Based Access Control (RBAC)** via the `onlyAuthorizedIssuer` modifier in `VeriWorkCertificate.sol`.  
> An employer cannot simply write to the contract. The protocol administrator must first authorize the employer's wallet (`addIssuer(walletAddress)`). If an unauthorized wallet attempts to call `registerCertificate()`, the Ethereum Virtual Machine reverts the transaction with: `'Unauthorized: Only authorized issuers can register certificates'`."

### Q4: How does the SHA-256 Tamper Detection algorithm work?
> **Answer:**  
> "When a certificate is verified on `/verify-certificate?id=VW-CERT-...`:
> 1. The server loads the authentic database record attributes (Worker Name, Employer, Role, Salary, Start Date, End Date).
> 2. It deterministically re-computes `keccak256(JSON.stringify(attributes))`.
> 3. It queries the smart contract via `getCertificate(certificateId)` to fetch the immutable on-chain hash stored at mining time.
> 4. If `recomputedHash === onChainHash`, status is **100% Cryptographic Match**. If even a single character or salary rupee is changed in MongoDB, the hashes diverge and verification fails."

### Q5: What happens if Ethereum gas fees are high or the network is congested?
> **Answer:**  
> "1. In production, VeriWork is designed to deploy on EVM-compatible Layer-2 rollups or sidechains like **Polygon (Amoy)**, **Arbitrum**, or **Base**, where transaction fees are less than a fraction of a cent ($0.001) and finality is under 2 seconds.  
> 2. For local testing, we run a local Hardhat node with an automatic gas faucet that provisions 50 test ETH to any connected employer wallet."

### Q6: How does tab-scoped session privacy work, and why was it necessary?
> **Answer:**  
> "Previously, credentials stored in standard `localStorage` were accessible across all tabs in the same browser, meaning opening a copied dashboard URL in a new tab opened the account without prompting for credentials.  
> We migrated authentication to tab-isolated `sessionStorage`. Each browser tab maintains its own isolated credential context. If a user copies a protected dashboard URL into a new tab or window, `sessionStorage` is empty, and `ProtectedRoute.jsx` immediately redirects them to the login page."

### Q7: How does the Scannable QR Code and PDF Certificate engine work?
> **Answer:**  
> "Each issued certificate contains a dynamic QR code generated using `qrcode` encoding the permanent public verification URL. When printed or exported as a PDF, anyone (such as a prospective employer, apartment security, or bank loan officer) can scan the QR code with their mobile phone to immediately see the live smart contract ledger proof.  
> The PDF is streamed directly from our server (`/api/certificates/download-pdf/:id`) using `pdfkit`, producing a lightweight (~5.2 KB), high-resolution vector PDF with exact `.pdf` filename headers for instant offline access."

---

## 🛠️ Verification & Test Suite Reference

To demonstrate automated testing to your examiner, run:
```powershell
# 1. Run Master E2E Pipeline Audit (All 8 Modules)
$env:NODE_PATH="d:\Blockchain Project\veriwork\server\node_modules;d:\Blockchain Project\veriwork\node_modules"; node "C:\Users\jayad\.gemini\antigravity-ide\brain\942bf4a2-8b31-44e7-85bf-9d2117ff9d5c\scratch\master_e2e_test.js"

# 2. Run Admin Governance Audit (Step 13)
$env:NODE_PATH="d:\Blockchain Project\veriwork\server\node_modules;d:\Blockchain Project\veriwork\node_modules"; node "C:\Users\jayad\.gemini\antigravity-ide\brain\942bf4a2-8b31-44e7-85bf-9d2117ff9d5c\scratch\test_step13_admin.js"

# 3. Run PDF & QR Code Verification Audit (Step 12)
$env:NODE_PATH="d:\Blockchain Project\veriwork\server\node_modules;d:\Blockchain Project\veriwork\node_modules"; node "C:\Users\jayad\.gemini\antigravity-ide\brain\942bf4a2-8b31-44e7-85bf-9d2117ff9d5c\scratch\test_step12_pdf_qr.js"
```

---

## 🌟 Summary of Built Features (Steps 1–13)
- [x] **Step 1:** Worker & Employer Authentication with JWT
- [x] **Step 2:** Employment Creation & Role Tracking
- [x] **Step 3:** Employment Lifecycle Management & Completion Transitions
- [x] **Step 4:** Bidirectional Mutual 5-Star Ratings & Reviews Engine
- [x] **Step 5:** Reputation Aggregation & Score Calculation
- [x] **Step 6:** Certificate Generation with Unique Cryptographic Hashes
- [x] **Step 7:** Smart Contract Deployment & MetaMask Integration
- [x] **Step 8:** Automatic Gas Faucet (50 test ETH for local employers)
- [x] **Step 9:** Hardened Blockchain State Verification & Anti-Replay Protections
- [x] **Step 10:** Public Verification Portal with Gold Seal Credential Card
- [x] **Step 11:** Zero-Knowledge Privacy Standard, Aadhaar Masking & Tab-Scoped Privacy
- [x] **Step 12:** High-Resolution Vector PDF Certificate with Dynamic Scannable QR Code
- [x] **Step 13:** Admin & Issuer Governance Dashboard with Direct Storage Inspector

---
*Prepared with excellence for A. Jayadithiyaa (25BCE5375), School of Computer Science and Engineering.*
