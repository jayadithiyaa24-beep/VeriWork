import { Link } from "react-router-dom";
import {
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaArrowUp,
  FaShieldAlt,
} from "react-icons/fa";

function Footer() {
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

            {/* Social */}
            <div className="vw-footer-socials">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="vw-footer-social"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={13} />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="vw-footer-social"
                aria-label="Twitter"
              >
                <FaTwitter size={13} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="vw-footer-social"
                aria-label="Instagram"
              >
                <FaInstagram size={13} />
              </a>
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

          {/* Company */}
          <div className="vw-footer-column">
            <h6>Company</h6>

            <ul>
              <li>
                <Link to="/about">About</Link>
              </li>

              <li>
                <Link to="/about">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="vw-footer-column">
            <h6>Legal</h6>

            <ul>
              <li>
                <Link to="/about">Privacy Policy</Link>
              </li>

              <li>
                <Link to="/about">Terms of Service</Link>
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
            minmax(280px, 2.3fr)
            repeat(3, minmax(100px, 0.75fr));
          gap: 55px;
          padding: 68px 0 54px;
        }

        /* =========================================
           BRAND
        ========================================== */

        .vw-footer-brand-column {
          max-width: 410px;
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
          max-width: 365px;
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
          margin-bottom: 22px;
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
           SOCIAL
        ========================================== */

        .vw-footer-socials {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .vw-footer-social {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #aebbb0 !important;
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.07);
          text-decoration: none;
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            color 0.2s ease;
        }

        .vw-footer-social svg {
          color: inherit !important;
        }

        .vw-footer-social:hover {
          color: #ffffff !important;
          background: var(--color-ochre, #d4a359);
          border-color: var(--color-ochre, #d4a359);
          transform: translateY(-2px);
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

        .vw-footer-column a {
          display: inline-block;
          color: #94a398 !important;
          text-decoration: none;
          font-size: 0.77rem;
          line-height: 1.4;
          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .vw-footer-column a:hover {
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
           LARGE TABLET
        ========================================== */

        @media (max-width: 991.98px) {
          .vw-footer-main {
            grid-template-columns:
              minmax(250px, 2fr)
              repeat(3, 1fr);
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

          .vw-footer-column a {
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
          .vw-footer-social,
          .vw-footer-column a,
          .vw-footer-top {
            transition: none !important;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;