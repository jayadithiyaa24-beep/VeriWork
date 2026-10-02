import { Link } from "react-router-dom";
import { FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="vw-mockup-footer mt-auto py-5 text-start">
      <div className="container">
        
        <div className="row g-4 mb-5">
          
          {/* Brand Info */}
          <div className="col-lg-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2C14 2 13 8 7 10C13 12 14 18 14 18C14 18 15 12 21 10C15 8 14 2 14 2Z" fill="#7A8B7B" />
                <path d="M7 16C7 16 10 18 10 22C10 22 14 19 14 19" stroke="#C98A41" strokeWidth="2" strokeLinecap="round" />
                <path d="M21 16C21 16 18 18 18 22C18 22 14 19 14 19" stroke="#C98A41" strokeWidth="2" strokeLinecap="round" />
                <path d="M14 18V26" stroke="#7A8B7B" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="vw-mockup-footer-logo">VeriWork</span>
            </div>
            
            <p className="vw-mockup-footer-desc mb-4 pe-lg-4">
              Verifiable work identity for informal domestic workers.
            </p>

            {/* Social Icons */}
            <div className="d-flex align-items-center gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="vw-social-icon" aria-label="LinkedIn">
                <FaLinkedinIn size={14} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="vw-social-icon" aria-label="Twitter">
                <FaTwitter size={14} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="vw-social-icon" aria-label="Instagram">
                <FaInstagram size={14} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="col-4 col-lg-2">
            <h6 className="vw-footer-col-header mb-3">Product</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/" className="vw-footer-col-link">Home</Link>
              </li>
              <li>
                <Link to="/#features" className="vw-footer-col-link">Features</Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="vw-footer-col-link">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-4 col-lg-2">
            <h6 className="vw-footer-col-header mb-3">Company</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/about" className="vw-footer-col-link">About</Link>
              </li>
              <li>
                <Link to="/about" className="vw-footer-col-link">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-4 col-lg-3">
            <h6 className="vw-footer-col-header mb-3">Legal</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/about" className="vw-footer-col-link">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/about" className="vw-footer-col-link">Terms of Service</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 border-top border-secondary border-opacity-25 d-flex flex-wrap justify-content-between align-items-center gap-2 small text-muted">
          <div>
            © 2026 VeriWork. All rights reserved.
          </div>
          <div>
            Developed by <strong>A. Jayadithiyaa (25BCE5375)</strong>
          </div>
        </div>

      </div>

      <style>{`
        .vw-mockup-footer {
          background-color: var(--color-forest-dark, #1A281D);
          color: #E2DDD5;
        }

        .vw-mockup-footer-logo {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.5rem;
          color: #FFFFFF;
        }

        .vw-mockup-footer-desc {
          color: #9EAA9F;
          font-size: 0.95rem;
          max-width: 320px;
        }

        .vw-social-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.08);
          color: #E2DDD5;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .vw-social-icon:hover {
          background-color: var(--color-ochre);
          color: #FFFFFF;
        }

        .vw-footer-col-header {
          font-size: 0.95rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .vw-footer-col-link {
          color: #9EAA9F;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .vw-footer-col-link:hover {
          color: #FFFFFF;
        }
      `}</style>
    </footer>
  );
}

export default Footer;