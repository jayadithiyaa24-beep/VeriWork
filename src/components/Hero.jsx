import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaShieldAlt,
  FaFileAlt,
  FaRupeeSign,
  FaCheck,
  FaIdCard,
  FaLock,
  FaCube,
  FaQrcode,
} from "react-icons/fa";

function Hero() {
  return (
    <section className="vw-hero">
      <div className="vw-hero-container container">
        <div className="vw-hero-grid">

          {/* ================= LEFT COLUMN: HERO CONTENT ================= */}
          <div className="vw-hero-content">
            <div className="vw-hero-eyebrow">
              <span className="vw-eyebrow-dot" />
              <span className="vw-eyebrow-text">
                A Safer, Fairer Workforce
              </span>
            </div>

            <h1 className="vw-hero-title">
              <span className="vw-title-line">Trusted Work.</span>
              <span className="vw-title-highlight">Verified Identity.</span>
            </h1>

            <p className="vw-hero-description">
              Building a secure and transparent digital identity for
              informal domestic workers, powered by blockchain.
            </p>

            <div className="vw-hero-actions">
              <Link
                to="/register-worker"
                className="vw-hero-primary-btn"
                id="hero-register-worker-btn"
              >
                <span className="vw-hero-button-text">
                  Register as Worker
                </span>
                <span className="vw-hero-btn-arrow">
                  <FaArrowRight size={11} />
                </span>
              </Link>

              <Link
                to="/register-employer"
                className="vw-hero-secondary-btn"
                id="hero-hire-worker-btn"
              >
                <span className="vw-hero-button-text">
                  Hire a Worker
                </span>
                <span className="vw-hero-btn-arrow">
                  <FaArrowRight size={11} />
                </span>
              </Link>
            </div>

            {/* TRUST INDICATORS */}
            <div className="vw-hero-trust">
              <div className="vw-trust-item">
                <div className="vw-trust-icon">
                  <FaShieldAlt size={13} />
                </div>
                <div className="vw-trust-content">
                  <span className="vw-trust-label">Verified</span>
                  <span className="vw-trust-description">Identities</span>
                </div>
              </div>

              <div className="vw-trust-divider" />

              <div className="vw-trust-item">
                <div className="vw-trust-icon">
                  <FaFileAlt size={13} />
                </div>
                <div className="vw-trust-content">
                  <span className="vw-trust-label">Secure</span>
                  <span className="vw-trust-description">Records</span>
                </div>
              </div>

              <div className="vw-trust-divider" />

              <div className="vw-trust-item">
                <div className="vw-trust-icon">
                  <FaRupeeSign size={13} />
                </div>
                <div className="vw-trust-content">
                  <span className="vw-trust-label">Transparent</span>
                  <span className="vw-trust-description">Payments</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PRODUCT UI INTERFACE ================= */}
          <div className="vw-hero-visual">
            <div className="vw-credential-card">

              {/* CARD TOP BAR */}
              <div className="vw-credential-topbar">
                <div className="vw-credential-protocol">
                  <FaCube size={12} className="vw-protocol-icon" />
                  <span className="vw-protocol-name">VERIWORK PROTOCOL</span>
                  <span className="vw-protocol-sep">•</span>
                  <span className="vw-protocol-badge">ON-CHAIN LEDGER</span>
                </div>
                <div className="vw-status-pill">
                  <span className="vw-status-dot" />
                  <span>ACTIVE</span>
                </div>
              </div>

              {/* CREDENTIAL HEADER & PROFILE SUMMARY */}
              <div className="vw-credential-header">
                <div className="vw-worker-avatar-box">
                  <div className="vw-worker-monogram">
                    <FaIdCard size={22} />
                  </div>
                  <div className="vw-worker-verified-badge" title="Identity Verified">
                    <FaCheck size={9} />
                  </div>
                </div>

                <div className="vw-worker-info">
                  <div className="vw-worker-role-tag">DOMESTIC WORK CREDENTIAL</div>
                  <h3 className="vw-worker-name">Sunita Kumari</h3>
                  <div className="vw-worker-meta">
                    <span className="vw-worker-id">ID: VW-2026-IND-0842</span>
                    <span className="vw-meta-divider">|</span>
                    <span className="vw-worker-spec">Housekeeper & Cook</span>
                  </div>
                </div>
              </div>

              {/* CRYPTOGRAPHIC HASH BADGE */}
              <div className="vw-hash-strip">
                <div className="vw-hash-left">
                  <FaLock size={10} className="vw-hash-icon" />
                  <span className="vw-hash-label">CONTRACT:</span>
                  <span className="vw-hash-value">0x71a9...c4e2b8</span>
                </div>
                <span className="vw-hash-tag">Polygon POS</span>
              </div>

              {/* VERIFICATION PILLARS */}
              <div className="vw-verification-pillars">
                {/* PILLAR 1: IDENTITY */}
                <div className="vw-pillar-item">
                  <div className="vw-pillar-icon-wrap vw-icon-forest">
                    <FaShieldAlt size={14} />
                  </div>
                  <div className="vw-pillar-details">
                    <div className="vw-pillar-header">
                      <span className="vw-pillar-title">Identity & KYC</span>
                      <span className="vw-pillar-badge">
                        <FaCheck size={7} /> Verified
                      </span>
                    </div>
                    <p className="vw-pillar-desc">
                      Aadhaar verified • Background checked • Tamper-proof
                    </p>
                  </div>
                </div>

                {/* PILLAR 2: WORK HISTORY */}
                <div className="vw-pillar-item">
                  <div className="vw-pillar-icon-wrap vw-icon-ochre">
                    <FaFileAlt size={14} />
                  </div>
                  <div className="vw-pillar-details">
                    <div className="vw-pillar-header">
                      <span className="vw-pillar-title">Employment History</span>
                      <span className="vw-pillar-badge">
                        <FaCheck size={7} /> Immutable
                      </span>
                    </div>
                    <p className="vw-pillar-desc">
                      3+ years recorded • 4 employer endorsements • 4.9★ rating
                    </p>
                  </div>
                </div>

                {/* PILLAR 3: ESCROW & PAYMENTS */}
                <div className="vw-pillar-item">
                  <div className="vw-pillar-icon-wrap vw-icon-forest">
                    <FaRupeeSign size={14} />
                  </div>
                  <div className="vw-pillar-details">
                    <div className="vw-pillar-header">
                      <span className="vw-pillar-title">Direct Payment History</span>
                      <span className="vw-pillar-badge">
                        <FaCheck size={7} /> Transparent
                      </span>
                    </div>
                    <p className="vw-pillar-desc">
                      100% on-time settlement • Zero wage deductions recorded
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="vw-credential-footer">
                <div className="vw-footer-cert">
                  <FaQrcode size={15} className="vw-qr-icon" />
                  <div className="vw-cert-text">
                    <span className="vw-cert-primary">Public QR Verification</span>
                    <span className="vw-cert-secondary">Scan to inspect immutable on-chain record</span>
                  </div>
                </div>
                <div className="vw-tamper-pill">
                  <span className="vw-tamper-dot" />
                  <span>Tamper-Proof</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        /* =====================================================
           HERO SECTION BASE
        ===================================================== */
        .vw-hero {
          position: relative;
          width: 100%;
          min-height: calc(100vh - 74px);
          display: flex;
          align-items: center;
          background:
            radial-gradient(
              circle at 82% 38%,
              rgba(53, 74, 54, 0.05) 0%,
              rgba(239, 236, 230, 0) 45%
            ),
            radial-gradient(
              circle at 18% 75%,
              rgba(201, 138, 65, 0.04) 0%,
              rgba(239, 236, 230, 0) 50%
            ),
            var(--color-bg, #EFECE6);
          overflow: hidden;
        }

        .vw-hero-container {
          width: 100%;
          padding-top: 60px;
          padding-bottom: 68px;
          position: relative;
          z-index: 2;
        }

        .vw-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(380px, 0.95fr);
          align-items: center;
          gap: 52px;
        }

        /* =====================================================
           LEFT COLUMN: HERO CONTENT
        ===================================================== */
        .vw-hero-content {
          position: relative;
          max-width: 620px;
        }

        .vw-hero-eyebrow {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 24px;
          padding: 7px 15px 7px 11px;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(43, 38, 37, 0.08);
          border-radius: var(--radius-pill, 999px);
          box-shadow: 0 2px 8px rgba(43, 38, 37, 0.04);
        }

        .vw-eyebrow-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-ochre, #C98A41);
          box-shadow: 0 0 0 3px rgba(201, 138, 65, 0.2);
        }

        .vw-eyebrow-text {
          color: #5C554D !important;
          font-family: var(--font-sans, "Plus Jakarta Sans", sans-serif);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .vw-hero-title {
          max-width: 650px;
          margin: 0 0 22px;
          font-family: var(--font-serif, "Fraunces", Georgia, serif);
          font-size: clamp(3.2rem, 4.6vw, 4.75rem);
          font-weight: 700;
          line-height: 1.02;
          letter-spacing: -0.04em;
          color: var(--color-text, #2B2625) !important;
        }

        .vw-title-line {
          display: block;
          color: var(--color-text, #2B2625);
        }

        .vw-title-highlight {
          display: inline-block;
          color: var(--color-forest, #354A36) !important;
        }

        .vw-hero-description {
          max-width: 530px;
          margin: 0 0 32px;
          color: var(--color-text-muted, #756E67) !important;
          font-family: var(--font-sans, "Plus Jakarta Sans", sans-serif);
          font-size: 1.05rem;
          line-height: 1.7;
          font-weight: 450;
        }

        /* =====================================================
           BUTTONS
        ===================================================== */
        .vw-hero-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 13px;
          margin-bottom: 38px;
        }

        .vw-hero-primary-btn,
        .vw-hero-secondary-btn {
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          padding: 0 24px;
          border-radius: var(--radius-pill, 999px);
          font-family: var(--font-sans, "Plus Jakarta Sans", sans-serif);
          font-size: 0.88rem;
          font-weight: 700;
          text-decoration: none !important;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }

        .vw-hero-primary-btn {
          color: #FFFFFF !important;
          background: var(--color-forest, #354A36);
          border: 1px solid var(--color-forest, #354A36);
          box-shadow: 0 6px 18px rgba(53, 74, 54, 0.22);
        }

        .vw-hero-secondary-btn {
          color: #FFFFFF !important;
          background: var(--color-ochre, #C98A41);
          border: 1px solid var(--color-ochre, #C98A41);
          box-shadow: 0 6px 18px rgba(201, 138, 65, 0.20);
        }

        .vw-hero-primary-btn:hover {
          color: #FFFFFF !important;
          background: #2b3d2c;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(53, 74, 54, 0.28);
        }

        .vw-hero-secondary-btn:hover {
          color: #FFFFFF !important;
          background: #b57a35;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(201, 138, 65, 0.26);
        }

        .vw-hero-button-text {
          color: #FFFFFF !important;
        }

        .vw-hero-btn-arrow {
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF !important;
          transition: transform 0.2s ease;
        }

        .vw-hero-btn-arrow svg {
          color: #FFFFFF !important;
        }

        .vw-hero-primary-btn:hover .vw-hero-btn-arrow,
        .vw-hero-secondary-btn:hover .vw-hero-btn-arrow {
          transform: translateX(3px);
        }

        /* =====================================================
           TRUST NETWORK STRIP
        ===================================================== */
        .vw-hero-trust {
          display: inline-flex;
          align-items: center;
          padding: 12px 18px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(43, 38, 37, 0.08);
          border-radius: 14px;
          box-shadow: 0 4px 14px rgba(43, 38, 37, 0.03);
        }

        .vw-trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vw-trust-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-forest, #354A36) !important;
          background: rgba(53, 74, 54, 0.08);
          border-radius: 8px;
        }

        .vw-trust-content {
          display: flex;
          flex-direction: column;
        }

        .vw-trust-label {
          color: var(--color-text, #2B2625) !important;
          font-size: 0.74rem;
          font-weight: 750;
          line-height: 1.2;
        }

        .vw-trust-description {
          color: var(--color-text-muted, #756E67) !important;
          font-size: 0.68rem;
          font-weight: 500;
          line-height: 1.2;
        }

        .vw-trust-divider {
          width: 1px;
          height: 28px;
          margin: 0 16px;
          background: rgba(43, 38, 37, 0.1);
        }

        /* =====================================================
           RIGHT COLUMN: AUTHENTIC PRODUCT UI CARD
        ===================================================== */
        .vw-hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .vw-credential-card {
          width: 100%;
          max-width: 480px;
          background: #FFFFFF;
          border: 1px solid rgba(43, 38, 37, 0.11);
          border-radius: 20px;
          box-shadow:
            0 18px 45px rgba(43, 38, 37, 0.08),
            0 2px 6px rgba(43, 38, 37, 0.04);
          padding: 24px 26px;
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .vw-credential-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 22px 55px rgba(43, 38, 37, 0.10),
            0 4px 10px rgba(43, 38, 37, 0.05);
        }

        /* TOP PROTOCOL BAR */
        .vw-credential-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(43, 38, 37, 0.07);
        }

        .vw-credential-protocol {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.68rem;
          font-weight: 700;
          color: #756E67;
          letter-spacing: 0.04em;
        }

        .vw-protocol-icon {
          color: var(--color-forest, #354A36);
        }

        .vw-protocol-name {
          color: var(--color-text, #2B2625);
          font-weight: 800;
        }

        .vw-protocol-sep {
          color: rgba(43, 38, 37, 0.25);
        }

        .vw-protocol-badge {
          color: var(--color-forest, #354A36);
          font-weight: 700;
          font-size: 0.64rem;
        }

        .vw-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 9px;
          background: rgba(53, 74, 54, 0.08);
          border-radius: 999px;
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--color-forest, #354A36);
          letter-spacing: 0.04em;
        }

        .vw-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2E7D32;
          box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
        }

        /* HEADER: WORKER DETAILS */
        .vw-credential-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 18px;
          margin-bottom: 16px;
        }

        .vw-worker-avatar-box {
          position: relative;
          flex-shrink: 0;
        }

        .vw-worker-monogram {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(53, 74, 54, 0.12), rgba(53, 74, 54, 0.05));
          border: 1px solid rgba(53, 74, 54, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-forest, #354A36);
        }

        .vw-worker-verified-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--color-forest, #354A36);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #FFFFFF;
        }

        .vw-worker-info {
          flex: 1;
          min-width: 0;
        }

        .vw-worker-role-tag {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--color-ochre, #C98A41);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .vw-worker-name {
          font-family: var(--font-serif, "Fraunces", Georgia, serif);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--color-text, #2B2625);
          margin: 2px 0 3px;
          letter-spacing: -0.02em;
        }

        .vw-worker-meta {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.72rem;
          color: #756E67;
        }

        .vw-worker-id {
          font-family: var(--font-mono, "JetBrains Mono", monospace);
          font-weight: 600;
          color: #5C554D;
        }

        .vw-meta-divider {
          color: rgba(43, 38, 37, 0.2);
        }

        .vw-worker-spec {
          font-weight: 500;
        }

        /* HASH STRIP */
        .vw-hash-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: #F7F5F0;
          border-radius: 9px;
          border: 1px dashed rgba(43, 38, 37, 0.12);
          margin-bottom: 18px;
          font-size: 0.68rem;
        }

        .vw-hash-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .vw-hash-icon {
          color: var(--color-forest, #354A36);
        }

        .vw-hash-label {
          font-weight: 700;
          color: #756E67;
        }

        .vw-hash-value {
          font-family: var(--font-mono, "JetBrains Mono", monospace);
          color: #2B2625;
          font-weight: 600;
        }

        .vw-hash-tag {
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--color-forest, #354A36);
          background: rgba(53, 74, 54, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* VERIFICATION PILLARS */
        .vw-verification-pillars {
          display: flex;
          flex-direction: column;
          gap: 11px;
          margin-bottom: 20px;
        }

        .vw-pillar-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 11px 13px;
          background: #FAFAF8;
          border: 1px solid rgba(43, 38, 37, 0.06);
          border-radius: 12px;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .vw-pillar-item:hover {
          background: #F5F3EC;
          border-color: rgba(43, 38, 37, 0.12);
        }

        .vw-pillar-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .vw-icon-forest {
          background: rgba(53, 74, 54, 0.09);
          color: var(--color-forest, #354A36);
        }

        .vw-icon-ochre {
          background: rgba(201, 138, 65, 0.10);
          color: var(--color-ochre, #C98A41);
        }

        .vw-pillar-details {
          flex: 1;
          min-width: 0;
        }

        .vw-pillar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }

        .vw-pillar-title {
          font-size: 0.78rem;
          font-weight: 750;
          color: var(--color-text, #2B2625);
        }

        .vw-pillar-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.63rem;
          font-weight: 700;
          color: var(--color-forest, #354A36);
          background: rgba(53, 74, 54, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .vw-pillar-desc {
          margin: 0;
          font-size: 0.69rem;
          color: var(--color-text-muted, #756E67);
          line-height: 1.4;
        }

        /* CARD FOOTER */
        .vw-credential-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 15px;
          border-top: 1px solid rgba(43, 38, 37, 0.07);
        }

        .vw-footer-cert {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vw-qr-icon {
          color: var(--color-forest, #354A36);
        }

        .vw-cert-text {
          display: flex;
          flex-direction: column;
        }

        .vw-cert-primary {
          font-size: 0.73rem;
          font-weight: 750;
          color: var(--color-text, #2B2625);
        }

        .vw-cert-secondary {
          font-size: 0.63rem;
          color: #8C847A;
        }

        .vw-tamper-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          background: #F2EFE8;
          border-radius: 6px;
          font-size: 0.62rem;
          font-weight: 700;
          color: #5C554D;
        }

        .vw-tamper-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color-ochre, #C98A41);
        }

        /* =====================================================
           RESPONSIVE BREAKPOINTS
        ===================================================== */
        @media (max-width: 991.98px) {
          .vw-hero {
            min-height: auto;
            padding: 40px 0;
          }

          .vw-hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .vw-hero-content {
            max-width: 100%;
            text-align: left;
          }

          .vw-hero-title {
            font-size: clamp(2.8rem, 6vw, 3.8rem);
          }

          .vw-hero-visual {
            justify-content: flex-start;
          }

          .vw-credential-card {
            max-width: 100%;
          }
        }

        @media (max-width: 575.98px) {
          .vw-hero-container {
            padding-top: 30px;
            padding-bottom: 40px;
          }

          .vw-hero-title {
            font-size: 2.45rem;
          }

          .vw-hero-actions {
            flex-direction: column;
            width: 100%;
          }

          .vw-hero-primary-btn,
          .vw-hero-secondary-btn {
            width: 100%;
          }

          .vw-hero-trust {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .vw-trust-divider {
            display: none;
          }

          .vw-credential-card {
            padding: 18px 16px;
          }

          .vw-credential-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;