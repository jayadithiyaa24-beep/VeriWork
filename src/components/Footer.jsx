import { Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="vw-footer mt-auto py-5 text-start">
      <div className="container">
        
        <div className="row g-4 mb-5">
          
          {/* Brand Info */}
          <div className="col-lg-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="vw-footer-logo-mark">
                <FaShieldAlt size={16} />
              </div>
              <span className="vw-footer-brand-name">VeriWork</span>
            </div>
            <p className="vw-footer-desc mb-3 pe-lg-4">
              Verifiable work identity for informal workers. Empowering domestic professionals with tamper-proof records, portable credentials, and financial inclusion.
            </p>
            <div className="vw-footer-badge">
              <span>Zero-Knowledge Aadhaar SHA-256 Protected</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="col-6 col-lg-2">
            <h6 className="vw-footer-col-title mb-3">Product</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/" className="vw-footer-link">Home</Link>
              </li>
              <li>
                <Link to="/#features" className="vw-footer-link">Features</Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="vw-footer-link">How It Works</Link>
              </li>
              <li>
                <Link to="/verify-certificate" className="vw-footer-link">Verify Credential</Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-6 col-lg-2">
            <h6 className="vw-footer-col-title mb-3">Company</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/about" className="vw-footer-link">About</Link>
              </li>
              <li>
                <Link to="/get-started" className="vw-footer-link">Get Started</Link>
              </li>
              <li>
                <Link to="/login" className="vw-footer-link">Worker Portal</Link>
              </li>
              <li>
                <Link to="/employer-login" className="vw-footer-link">Employer Portal</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Protocol Links */}
          <div className="col-12 col-lg-3">
            <h6 className="vw-footer-col-title mb-3">Legal & Governance</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/about" className="vw-footer-link">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/about" className="vw-footer-link">Terms of Service</Link>
              </li>
              <li>
                <Link to="/admin" className="vw-footer-link">Admin & Governance</Link>
              </li>
            </ul>
            <div className="mt-3 font-monospace small" style={{ color: "#9EAA9F", fontSize: "0.75rem" }}>
              Smart Contract: 0x9fE4...a6e0
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-4 border-top border-secondary border-opacity-25 d-flex flex-wrap justify-content-between align-items-center gap-2 small" style={{ color: "#9EAA9F" }}>
          <div>
            © 2026 VeriWork. All rights reserved.
          </div>
          <div>
            Developed by <strong>A. Jayadithiyaa (25BCE5375)</strong>
          </div>
        </div>

      </div>

      <style>{`
        .vw-footer {
          background-color: var(--color-primary-darker);
          color: #E2DDD5;
        }

        .vw-footer-logo-mark {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background-color: var(--color-primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vw-footer-brand-name {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.4rem;
          color: #FFFFFF;
        }

        .vw-footer-desc {
          color: #A8B5A9;
          font-size: 0.92rem;
          line-height: 1.6;
        }

        .vw-footer-badge {
          display: inline-block;
          background-color: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-pill);
          padding: 4px 12px;
          font-size: 0.75rem;
          color: #D4A359;
        }

        .vw-footer-col-title {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #FFFFFF;
        }

        .vw-footer-link {
          color: #A8B5A9;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .vw-footer-link:hover {
          color: #FFFFFF;
        }
      `}</style>
    </footer>
  );
}

export default Footer;