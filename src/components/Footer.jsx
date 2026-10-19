import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowUp, FaShieldAlt, FaTimes } from "react-icons/fa";

function Footer() {
  const [activeLegalModal, setActiveLegalModal] = useState(null);

  return (
    <footer className="vw-footer">
      <div className="container">

        {/* =========================================
            MAIN FOOTER
        ========================================== */}

        <div className="vw-footer-main">

          {/* Brand */}
          <div className="vw-footer-brand-column">

            <Link to="/" className="vw-footer-brand">
              <div className="vw-footer-brand-mark">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M14 2C14 2 13 8 7 10C13 12 14 18 14 18C14 18 15 12 21 10C15 8 14 2 14 2Z"
                    fill="currentColor"
                  />
                  <path
                    d="M7 16C7 16 10 18 10 22C10 22 14 19 14 19"
                    stroke="#D4A359"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M21 16C21 16 18 18 18 22C18 22 14 19 14 19"
                    stroke="#D4A359"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 18V26"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span>VeriWork</span>
            </Link>

            <p className="vw-footer-description">
              Verifiable work identity for informal domestic workers.
              Building trust through secure records, transparent work
              histories, and verified credentials.
            </p>

            {/* Trust indicator */}
            <div className="vw-footer-trust">
              <div className="vw-footer-trust-icon">
                <FaShieldAlt size={12} />
              </div>

              <div>
                <strong>Built for Trust</strong>
                <span>Secure · Verified · Transparent</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div className="vw-footer-column">
            <h6>Product</h6>

            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/#features">Features</Link>
              </li>

              <li>
                <Link to="/#how-it-works">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="vw-footer-column">
            <h6>Legal</h6>

            <ul>
              <li>
                <button
                  type="button"
                  className="vw-footer-legal-link"
                  onClick={() => setActiveLegalModal("privacy")}
                >
                  Privacy Policy
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="vw-footer-legal-link"
                  onClick={() => setActiveLegalModal("terms")}
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* =========================================
            DIVIDER
        ========================================== */}

        <div className="vw-footer-divider"></div>

        {/* =========================================
            BOTTOM BAR
        ========================================== */}

        <div className="vw-footer-bottom">

          <div className="vw-footer-copyright">
            © 2026 VeriWork. All rights reserved.
          </div>

          <div className="vw-footer-developer">
            Developed by{" "}
            <strong>A. Jayadithiyaa (25BCE5375)</strong>
          </div>

          <Link
            to="/"
            className="vw-footer-top"
            aria-label="Back to home"
          >
            <FaArrowUp size={11} />
          </Link>

        </div>
      </div>

      {/* =========================================
          LEGAL MODAL (PRIVACY & TERMS)
      ========================================== */}
      {activeLegalModal && (
        <div
          className="vw-legal-backdrop"
          onClick={() => setActiveLegalModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="vw-legal-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vw-legal-header">
              <div className="vw-legal-title-wrap">
                <FaShieldAlt className="vw-legal-shield" size={19} />
                <h3>
                  {activeLegalModal === "privacy"
                    ? "VeriWork Privacy Policy"
                    : "VeriWork Terms of Service"}
                </h3>
              </div>

              <button
                type="button"
                className="vw-legal-close"
                onClick={() => setActiveLegalModal(null)}
                aria-label="Close modal"
              >
                <FaTimes size={15} />
              </button>
            </div>

            <div className="vw-legal-body">
              {activeLegalModal === "privacy" ? (
                <>
                  <p className="vw-legal-meta">
                    <strong>Standard:</strong> Zero-Knowledge Work Identity & Confidentiality Standard<br />
                    <strong>Effective Date:</strong> January 2026 · VeriWork Protocol v2.0
                  </p>

                  <h4>1. Executive Summary & Privacy Principles</h4>
                  <p>
                    VeriWork provides decentralized, portable work identity credentials for informal domestic workers (cooks, housekeepers, drivers, and caregivers). We prioritize maximum privacy and dignity for informal workers by anchoring credentials to the Ethereum EVM blockchain using privacy-preserving zero-knowledge and cryptographic hashing principles.
                  </p>

                  <h4>2. Information We Collect & Zero-Knowledge Masking</h4>
                  <ul>
                    <li><strong>Aadhaar Numbers:</strong> 12-digit government identity numbers are strictly masked on both the client and server (e.g., <code>XXXX-XXXX-6940</code>) and are never exposed in public profiles or API responses.</li>
                    <li><strong>Salary & Financial Confidentiality:</strong> Monthly salary figures are strictly confidential. Public certificate verification portals and publicly exported PDFs redact salary amounts by default to protect worker and employer privacy.</li>
                    <li><strong>Authentication & Passwords:</strong> Passwords are cryptographically salted and hashed using <code>bcrypt</code> (10 rounds) and are never stored or transmitted in plaintext.</li>
                  </ul>

                  <h4>3. On-Chain Ledger & Blockchain Immutability</h4>
                  <p>
                    Sensitive personal information is <strong>never</strong> recorded directly on the public Ethereum blockchain. The deployed smart contract (<code>VeriWorkCertificate.sol</code>) only stores:
                  </p>
                  <ul>
                    <li>Deterministic cryptographic hashes (Keccak-256 digests) of verified tenure.</li>
                    <li>Anonymous certificate IDs and issuer wallet addresses.</li>
                    <li>Block registration timestamps.</li>
                  </ul>

                  <h4>4. Session Security & Ephemeral Storage</h4>
                  <p>
                    All active authentication sessions are tab-scoped and stored ephemerally. To prevent session hijacking on shared or domestic devices, sessions are automatically terminated upon page reload, when navigating to the public homepage, or after 5 minutes of continuous inactivity.
                  </p>

                  <h4>5. No Commercial Data Monetization</h4>
                  <p>
                    VeriWork never sells, trades, rents, or monetizes worker or employer personal data with third-party advertising networks or commercial brokers.
                  </p>
                </>
              ) : (
                <>
                  <p className="vw-legal-meta">
                    <strong>Protocol:</strong> VeriWork Decentralized Credential Protocol<br />
                    <strong>Effective Date:</strong> January 2026 · VeriWork Protocol v2.0
                  </p>

                  <h4>1. Acceptance of Terms</h4>
                  <p>
                    By accessing or using the VeriWork platform, connecting a Web3 wallet (MetaMask), issuing credentials, or verifying domestic work history, you agree to be bound by these Terms of Service.
                  </p>

                  <h4>2. Purpose of the Platform</h4>
                  <p>
                    VeriWork is designed to bridge the trust gap in informal domestic labor by providing tamper-evident, verifiable work identity credentials. The platform empowers informal workers with verifiable career reputation while enabling prospective employers to independently audit credentials on-chain.
                  </p>

                  <h4>3. Employer Responsibilities & Conduct</h4>
                  <ul>
                    <li><strong>Accurate Attestation:</strong> Employers may only issue certificates for domestic workers who have genuinely rendered service under their employment.</li>
                    <li><strong>Anti-Fraud Prohibition:</strong> Submitting fabricated employment periods, counterfeit wage claims, or false ratings is strictly prohibited.</li>
                    <li><strong>Authorized Issuance:</strong> Only authorized employer wallets vetted through governance or smart contract access controls may register credential digests on-chain.</li>
                  </ul>

                  <h4>4. Worker Ownership & Self-Sovereignty</h4>
                  <p>
                    Domestic workers retain complete self-sovereign ownership of their verified work identity. Credentials issued under the VeriWork standard are permanently portable and can be presented to any prospective employer without platform exclusivity or lock-in.
                  </p>

                  <h4>5. Blockchain Anchoring & Irrevocability</h4>
                  <p>
                    Users acknowledge that once an employment credential digest is anchored to the Ethereum EVM blockchain, the cryptographic record is immutable and cannot be deleted, modified, or censored by any single party, including VeriWork protocol administrators.
                  </p>

                  <h4>6. Limitation of Liability</h4>
                  <p>
                    VeriWork provides the decentralized verification infrastructure and smart contract auditing framework. Independent employers remain responsible for their individual hiring, compensation, and safety agreements with domestic personnel.
                  </p>
                </>
              )}
            </div>

            <div className="vw-legal-footer">
              <button
                type="button"
                className="vw-legal-btn"
                onClick={() => setActiveLegalModal(null)}
              >
                I Understand & Accept
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* =========================================
           FOOTER
        ========================================== */

        .vw-footer {
          position: relative;
          overflow: hidden;
          margin-top: auto;
          color: #e8e3db;
          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(212, 163, 89, 0.08),
              transparent 28%
            ),
            radial-gradient(
              circle at 92% 100%,
              rgba(255, 255, 255, 0.035),
              transparent 28%
            ),
            #1d3026;
        }

        .vw-footer::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(212, 163, 89, 0.45),
            transparent
          );
        }

        .vw-footer .container {
          position: relative;
          z-index: 2;
        }

        /* =========================================
           MAIN AREA
        ========================================== */

        .vw-footer-main {
          display: grid;
          grid-template-columns:
            minmax(280px, 2.5fr)
            repeat(2, minmax(130px, 1fr));
          gap: 55px;
          padding: 68px 0 54px;
        }

        /* =========================================
           BRAND
        ========================================== */

        .vw-footer-brand-column {
          max-width: 440px;
        }

        .vw-footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #ffffff !important;
          text-decoration: none;
        }

        .vw-footer-brand-mark {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #dce7dc;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .vw-footer-brand > span {
          color: #ffffff !important;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.025em;
        }

        .vw-footer-description {
          max-width: 380px;
          margin: 17px 0 21px;
          color: #aebbb0 !important;
          font-size: 0.82rem;
          line-height: 1.7;
        }

        /* =========================================
           TRUST
        ========================================== */

        .vw-footer-trust {
          display: inline-flex;
          align-items: center;
          gap: 9px;
        }

        .vw-footer-trust-icon {
          width: 29px;
          height: 29px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          color: #d4a359;
          background: rgba(212, 163, 89, 0.1);
          border: 1px solid rgba(212, 163, 89, 0.12);
        }

        .vw-footer-trust strong {
          display: block;
          color: #e9eee9 !important;
          font-size: 0.67rem;
          font-weight: 700;
        }

        .vw-footer-trust span {
          display: block;
          margin-top: 2px;
          color: #89998c !important;
          font-size: 0.56rem;
          letter-spacing: 0.04em;
        }

        /* =========================================
           FOOTER COLUMNS
        ========================================== */

        .vw-footer-column {
          padding-top: 4px;
        }

        .vw-footer-column h6 {
          margin: 0 0 18px;
          color: #ffffff !important;
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .vw-footer-column ul {
          display: flex;
          flex-direction: column;
          gap: 11px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .vw-footer-column li {
          margin: 0;
          padding: 0;
        }

        .vw-footer-column a,
        .vw-footer-legal-link {
          display: inline-block;
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          text-align: left;
          cursor: pointer;
          color: #94a398 !important;
          text-decoration: none;
          font-family: inherit;
          font-size: 0.77rem;
          line-height: 1.4;
          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .vw-footer-column a:hover,
        .vw-footer-legal-link:hover {
          color: #ffffff !important;
          transform: translateX(3px);
        }

        /* =========================================
           DIVIDER
        ========================================== */

        .vw-footer-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.09);
        }

        /* =========================================
           BOTTOM
        ========================================== */

        .vw-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 67px;
          padding: 14px 0;
        }

        .vw-footer-copyright,
        .vw-footer-developer {
          color: #77887b !important;
          font-size: 0.63rem;
          line-height: 1.5;
        }

        .vw-footer-developer {
          text-align: center;
        }

        .vw-footer-developer strong {
          color: #a9b6aa !important;
          font-weight: 700;
        }

        .vw-footer-top {
          width: 31px;
          height: 31px;
          flex: 0 0 31px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #b7c3b9 !important;
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.07);
          text-decoration: none;
          transition:
            transform 0.2s ease,
            color 0.2s ease,
            background 0.2s ease;
        }

        .vw-footer-top svg {
          color: inherit !important;
        }

        .vw-footer-top:hover {
          color: #ffffff !important;
          background: var(--color-ochre, #d4a359);
          transform: translateY(-2px);
        }

        /* =========================================
           LEGAL MODAL
        ========================================== */

        .vw-legal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(10, 19, 14, 0.75);
          backdrop-filter: blur(8px);
          animation: vw-modal-fade 0.2s ease;
        }

        .vw-legal-modal {
          width: 100%;
          max-width: 660px;
          max-height: 84vh;
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          background: #1d3026;
          border: 1px solid rgba(212, 163, 89, 0.35);
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          color: #e8e3db;
          overflow: hidden;
          animation: vw-modal-scale 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vw-legal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.15);
        }

        .vw-legal-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vw-legal-shield {
          color: #d4a359;
        }

        .vw-legal-header h3 {
          margin: 0;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.015em;
        }

        .vw-legal-close {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #b7c3b9;
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease;
        }

        .vw-legal-close:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }

        .vw-legal-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          font-size: 0.85rem;
          line-height: 1.7;
          color: #cbd5cb;
        }

        .vw-legal-meta {
          padding: 12px 14px;
          margin-bottom: 20px;
          border-radius: 10px;
          background: rgba(212, 163, 89, 0.1);
          border: 1px solid rgba(212, 163, 89, 0.22);
          color: #e5ded2;
          font-size: 0.78rem;
          line-height: 1.6;
        }

        .vw-legal-body h4 {
          margin: 20px 0 8px;
          font-family: var(--font-sans);
          font-size: 0.92rem;
          font-weight: 700;
          color: #ffffff;
        }

        .vw-legal-body h4:first-of-type {
          margin-top: 0;
        }

        .vw-legal-body p {
          margin: 0 0 12px;
        }

        .vw-legal-body ul {
          margin: 0 0 16px 20px;
          padding: 0;
        }

        .vw-legal-body li {
          margin-bottom: 7px;
        }

        .vw-legal-body code {
          padding: 2px 5px;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.35);
          color: #d4a359;
          font-size: 0.8em;
        }

        .vw-legal-footer {
          display: flex;
          justify-content: flex-end;
          padding: 16px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.15);
        }

        .vw-legal-btn {
          padding: 9px 20px;
          border-radius: 999px;
          border: none;
          background: #d4a359;
          color: #1d3026;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.18s ease, filter 0.18s ease;
        }

        .vw-legal-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.08);
        }

        @keyframes vw-modal-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes vw-modal-scale {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        /* =========================================
           LARGE TABLET
        ========================================== */

        @media (max-width: 991.98px) {
          .vw-footer-main {
            grid-template-columns:
              minmax(250px, 2fr)
              repeat(2, 1fr);
            gap: 30px;
            padding: 55px 0 45px;
          }

          .vw-footer-description {
            max-width: 320px;
          }
        }

        /* =========================================
           TABLET / MOBILE
        ========================================== */

        @media (max-width: 767.98px) {
          .vw-footer-main {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px 25px;
            padding: 48px 0 40px;
          }

          .vw-footer-brand-column {
            grid-column: 1 / -1;
            max-width: 500px;
          }

          .vw-footer-bottom {
            flex-wrap: wrap;
            justify-content: space-between;
          }

          .vw-footer-developer {
            order: 3;
            width: 100%;
            text-align: left;
          }
        }

        /* =========================================
           SMALL MOBILE
        ========================================== */

        @media (max-width: 480px) {
          .vw-footer-main {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px 20px;
            padding: 42px 0 34px;
          }

          .vw-footer-brand > span {
            font-size: 1.35rem;
          }

          .vw-footer-description {
            font-size: 0.76rem;
          }

          .vw-footer-column h6 {
            margin-bottom: 14px;
            font-size: 0.65rem;
          }

          .vw-footer-column a,
          .vw-footer-legal-link {
            font-size: 0.72rem;
          }

          .vw-footer-bottom {
            align-items: flex-start;
          }

          .vw-footer-copyright {
            max-width: 200px;
          }

          .vw-footer-developer {
            font-size: 0.58rem;
          }
        }

        /* =========================================
           REDUCED MOTION
        ========================================== */

        @media (prefers-reduced-motion: reduce) {
          .vw-footer-column a,
          .vw-footer-legal-link,
          .vw-footer-top {
            transition: none !important;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;