import { Link } from "react-router-dom";
import { FaShieldAlt, FaGithub, FaEthereum, FaSearch, FaCogs } from "react-icons/fa";

function Footer() {
  return (
    <footer className="vw-web3-footer mt-auto py-5 border-top border-white border-opacity-10">
      <div className="container">
        
        {/* Top Network Status Pill */}
        <div className="d-flex flex-wrap align-items-center justify-content-between pb-4 mb-4 border-bottom border-white border-opacity-10 gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="pulse-dot"></span>
            <span className="text-white small fw-semibold">Ethereum EVM Localnet Active</span>
            <span className="text-muted small font-monospace d-none d-sm-inline">(Chain ID: 31337)</span>
          </div>

          <div className="font-monospace text-muted small">
            Contract: <span className="text-cyan">0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0</span>
          </div>
        </div>

        {/* Middle Footer Grid */}
        <div className="row g-4 mb-4">
          
          {/* Brand Info */}
          <div className="col-lg-5 text-start">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="vw-brand-icon-sm">
                <FaShieldAlt />
              </div>
              <span className="vw-brand-name">VeriWork</span>
              <span className="badge-web3-cyan py-0 px-2" style={{ fontSize: "0.65rem" }}>
                ENTERPRISE v2.0
              </span>
            </div>
            <p className="text-muted small pe-lg-4" style={{ lineHeight: "1.7" }}>
              Decentralized, privacy-preserving digital employment credential and reputation protocol for informal domestic workers. Cryptographically anchored on Ethereum.
            </p>
            <div className="text-muted small">
              Developed by <strong className="text-white">A. Jayadithiyaa (25BCE5375)</strong>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-lg-3 text-start">
            <h6 className="text-white fw-bold mb-3 small text-uppercase letter-spacing-1">
              Platform Links
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/" className="text-muted hover-white">Home Landing</Link>
              </li>
              <li>
                <Link to="/#features" className="text-muted hover-white">Core Features</Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-muted hover-white">How It Works</Link>
              </li>
              <li>
                <Link to="/about" className="text-muted hover-white">About Protocol</Link>
              </li>
            </ul>
          </div>

          {/* Verification & Governance */}
          <div className="col-6 col-lg-4 text-start">
            <h6 className="text-white fw-bold mb-3 small text-uppercase letter-spacing-1">
              Trust & Governance
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/verify-certificate" className="text-cyan hover-white d-flex align-items-center gap-1">
                  <FaSearch size={12} />
                  <span>Public Certificate Verifier</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-purple hover-white d-flex align-items-center gap-1">
                  <FaCogs size={12} />
                  <span>Admin & Issuer Governance</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted hover-white">Worker Identity Portal</Link>
              </li>
              <li>
                <Link to="/employer-login" className="text-muted hover-white">Employer Issuer Portal</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Zero-Knowledge Note */}
        <div className="pt-3 border-top border-white border-opacity-10 d-flex flex-wrap justify-content-between align-items-center gap-2 small text-muted">
          <div>
            © 2026 VeriWork Protocol. All Rights Reserved. Zero-Knowledge Aadhaar SHA-256 Protected.
          </div>
          <div className="d-flex align-items-center gap-3">
            <span>Hardhat EVM</span>
            <span>•</span>
            <span>Ethers.js v6</span>
            <span>•</span>
            <span>MongoDB Ledger</span>
          </div>
        </div>

      </div>

      <style>{`
        .vw-web3-footer {
          background: rgba(6, 8, 18, 0.95);
          position: relative;
          z-index: 10;
        }

        .vw-brand-icon-sm {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 0.85rem;
        }

        .hover-white:hover {
          color: #ffffff !important;
        }

        .text-cyan { color: #06b6d4 !important; }
        .text-purple { color: #a855f7 !important; }
      `}</style>
    </footer>
  );
}

export default Footer;