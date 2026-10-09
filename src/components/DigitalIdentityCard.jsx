import React from "react";
import {
  FaCheckCircle,
  FaIdCard,
  FaShieldAlt,
  FaQrcode,
  FaWallet,
  FaTools,
  FaBriefcase,
  FaFingerprint,
} from "react-icons/fa";

function DigitalIdentityCard({ worker }) {
  if (!worker) return null;

  const maskedAadhaar = worker.aadhaar
    ? `XXXX-XXXX-${worker.aadhaar.slice(-4)}`
    : "Verified ID";

  const skillsList = worker.skills
    ? worker.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    : ["Domestic Helper", "VeriWork Verified"];

  return (
    <div className="vw-digital-id-wrapper">
      <div className="vw-digital-id-card">
        {/* =========================
            CARD HEADER
        ========================== */}
        <div className="vw-id-header">
          <div className="vw-id-header-glow vw-id-glow-one"></div>
          <div className="vw-id-header-glow vw-id-glow-two"></div>

          <div className="vw-id-header-top">
            <div className="vw-id-brand">
              <div className="vw-id-logo">V</div>

              <div>
                <div className="vw-id-brand-name">VeriWork</div>
                <div className="vw-id-brand-subtitle">
                  DIGITAL WORK IDENTITY
                </div>
              </div>
            </div>

            <div className="vw-id-verified-badge">
              <FaCheckCircle size={13} />
              <span>VERIFIED</span>
            </div>
          </div>

          {/* Identity */}
          <div className="vw-id-profile">
            <div className="vw-id-avatar">
              {worker.fullName
                ? worker.fullName.charAt(0).toUpperCase()
                : "W"}
            </div>

            <div className="vw-id-profile-info">
              <div className="vw-id-eyebrow">
                VERIFIED WORKER
              </div>

              <h3>
                {worker.fullName || "Registered Worker"}
              </h3>

              <div className="vw-id-number">
                <FaIdCard size={13} />

                <span>ID</span>

                <code>
                  VW-8921-
                  {worker._id
                    ? worker._id.slice(-4).toUpperCase()
                    : "8812"}
                </code>
              </div>
            </div>
          </div>

          <div className="vw-id-header-line"></div>
        </div>

        {/* =========================
            CARD BODY
        ========================== */}
        <div className="vw-id-body">

          {/* Verification information */}
          <div className="vw-id-info-grid">
            <div className="vw-id-info-box">
              <div className="vw-id-info-icon vw-id-green">
                <FaShieldAlt size={15} />
              </div>

              <div>
                <span className="vw-id-info-label">
                  AADHAAR STATUS
                </span>

                <strong>{maskedAadhaar}</strong>
              </div>
            </div>

            <div className="vw-id-info-box">
              <div className="vw-id-info-icon vw-id-ochre">
                <FaBriefcase size={15} />
              </div>

              <div>
                <span className="vw-id-info-label">
                  EXPERIENCE
                </span>

                <strong>
                  {worker.experience || "0"} Years
                </strong>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="vw-id-section">
            <div className="vw-id-section-heading">
              <div className="vw-id-section-icon">
                <FaTools size={13} />
              </div>

              <span>
                VERIFIED SKILLS & QUALIFICATIONS
              </span>
            </div>

            <div className="vw-id-skills">
              {skillsList.map((skill, index) => (
                <span
                  key={index}
                  className="vw-id-skill"
                >
                  <FaCheckCircle size={11} />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Blockchain verification */}
          <div className="vw-id-blockchain">
            <div className="vw-id-blockchain-main">
              <div className="vw-id-blockchain-icon">
                <FaWallet size={16} />
              </div>

              <div className="vw-id-blockchain-content">
                <span className="vw-id-info-label">
                  BLOCKCHAIN LEDGER
                </span>

                <div className="vw-id-wallet">
                  {worker.walletAddress
                    ? `${worker.walletAddress.slice(
                      0,
                      8
                    )}...${worker.walletAddress.slice(-6)}`
                    : "Verified Cryptographic Ledger"}
                </div>
              </div>
            </div>

            <div className="vw-id-qr">
              <FaQrcode size={38} />
              <span>SCAN</span>
            </div>
          </div>

          {/* Security footer */}
          <div className="vw-id-security">
            <div className="vw-id-security-icon">
              <FaFingerprint size={14} />
            </div>

            <div>
              <strong>Cryptographically Verified</strong>
              <span>
                Identity protected with secure blockchain records
              </span>
            </div>
          </div>
        </div>

        {/* =========================
            CARD FOOTER
        ========================== */}
        <div className="vw-id-footer">
          <span>VERIWORK DIGITAL IDENTITY</span>

          <div className="vw-id-footer-status">
            <span className="vw-id-status-dot"></span>
            ACTIVE
          </div>
        </div>
      </div>

      <style>{`
        /* =========================================
           DIGITAL IDENTITY CARD
        ========================================== */

        .vw-digital-id-wrapper {
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
        }

        .vw-digital-id-card {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          background: #ffffff;
          border: 1px solid rgba(43, 38, 37, 0.08);
          box-shadow:
            0 24px 55px rgba(43, 38, 37, 0.12),
            0 6px 18px rgba(43, 38, 37, 0.05);
        }

        /* =========================================
           HEADER
        ========================================== */

        .vw-id-header {
          position: relative;
          overflow: hidden;
          padding: 26px 26px 24px;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(212, 163, 89, 0.25),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #173d31 0%,
              #1f5140 55%,
              #2d6650 100%
            );
        }

        .vw-id-header-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .vw-id-glow-one {
          width: 150px;
          height: 150px;
          right: -65px;
          top: -75px;
          background: rgba(212, 163, 89, 0.14);
        }

        .vw-id-glow-two {
          width: 110px;
          height: 110px;
          left: -70px;
          bottom: -75px;
          background: rgba(255, 255, 255, 0.05);
        }

        .vw-id-header-top {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .vw-id-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vw-id-logo {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.96);
          color: var(--color-forest, #315847);
          font-family: var(--font-serif, Georgia, serif);
          font-size: 20px;
          font-weight: 700;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
        }

        .vw-id-brand-name {
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .vw-id-brand-subtitle {
          margin-top: 3px;
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          opacity: 0.68;
        }

        .vw-id-verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 11px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #ffffff;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          white-space: nowrap;
          backdrop-filter: blur(8px);
        }

        .vw-id-verified-badge svg {
          color: #d9e8d1;
        }

        /* =========================================
           PROFILE
        ========================================== */

        .vw-id-profile {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 27px;
        }

        .vw-id-avatar {
          width: 70px;
          height: 70px;
          flex: 0 0 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 22px;
          background: #f2f0ea;
          color: var(--color-forest, #315847);
          border: 3px solid rgba(255, 255, 255, 0.92);
          font-family: var(--font-serif, Georgia, serif);
          font-size: 2rem;
          font-weight: 700;
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.15);
        }

        .vw-id-profile-info {
          min-width: 0;
        }

        .vw-id-eyebrow {
          margin-bottom: 4px;
          font-size: 0.57rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          opacity: 0.68;
        }

        .vw-id-profile-info h3 {
          margin: 0 0 7px;
          color: #ffffff;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1.45rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          word-break: break-word;
        }

        .vw-id-number {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.72);
        }

        .vw-id-number svg {
          opacity: 0.85;
        }

        .vw-id-number code {
          margin-left: 2px;
          padding: 3px 7px;
          border-radius: 6px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
          font-family: monospace;
          font-size: 0.68rem;
        }

        .vw-id-header-line {
          position: relative;
          z-index: 2;
          height: 1px;
          margin-top: 24px;
          background: rgba(255, 255, 255, 0.12);
        }

        /* =========================================
           BODY
        ========================================== */

        .vw-id-body {
          padding: 23px 24px 20px;
          background: #ffffff;
        }

        .vw-id-info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .vw-id-info-box {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          padding: 13px;
          border-radius: 15px;
          background: #f5f3ed;
          border: 1px solid rgba(43, 38, 37, 0.06);
        }

        .vw-id-info-icon {
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .vw-id-green {
          color: var(--color-forest, #315847);
          background: rgba(49, 88, 71, 0.1);
        }

        .vw-id-ochre {
          color: var(--color-ochre, #d4a359);
          background: rgba(212, 163, 89, 0.14);
        }

        .vw-id-info-box > div:last-child {
          min-width: 0;
        }

        .vw-id-info-label {
          display: block;
          margin-bottom: 3px;
          color: #8a837b;
          font-size: 0.57rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          line-height: 1.2;
        }

        .vw-id-info-box strong {
          display: block;
          overflow: hidden;
          color: #2b2625;
          font-size: 0.76rem;
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* =========================================
           SKILLS
        ========================================== */

        .vw-id-section {
          margin-top: 21px;
        }

        .vw-id-section-heading {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 10px;
          color: #716a63;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.09em;
        }

        .vw-id-section-icon {
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: var(--color-forest, #315847);
          background: rgba(49, 88, 71, 0.1);
        }

        .vw-id-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .vw-id-skill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 10px;
          border-radius: 999px;
          color: var(--color-forest, #315847);
          background: #edf2ed;
          border: 1px solid rgba(49, 88, 71, 0.1);
          font-size: 0.67rem;
          font-weight: 700;
        }

        .vw-id-skill svg {
          opacity: 0.8;
        }

        /* =========================================
           BLOCKCHAIN
        ========================================== */

        .vw-id-blockchain {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 19px;
          padding: 14px;
          border-radius: 16px;
          background: #f8f6f1;
          border: 1px solid rgba(43, 38, 37, 0.07);
        }

        .vw-id-blockchain-main {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .vw-id-blockchain-icon {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #ffffff;
          background: var(--color-forest, #315847);
        }

        .vw-id-blockchain-content {
          min-width: 0;
        }

        .vw-id-wallet {
          max-width: 245px;
          overflow: hidden;
          color: #3b3734;
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vw-id-qr {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          color: #3d3936;
          opacity: 0.72;
        }

        .vw-id-qr span {
          color: #8b847c;
          font-size: 0.48rem;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        /* =========================================
           SECURITY
        ========================================== */

        .vw-id-security {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 15px;
          padding: 10px 11px;
          border-radius: 12px;
          background: rgba(49, 88, 71, 0.055);
          border: 1px solid rgba(49, 88, 71, 0.08);
        }

        .vw-id-security-icon {
          width: 27px;
          height: 27px;
          flex: 0 0 27px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: var(--color-forest, #315847);
          background: rgba(49, 88, 71, 0.1);
        }

        .vw-id-security strong {
          display: block;
          color: #3a3532;
          font-size: 0.65rem;
          font-weight: 800;
        }

        .vw-id-security span {
          display: block;
          margin-top: 2px;
          color: #8b847c;
          font-size: 0.59rem;
        }

        /* =========================================
           FOOTER
        ========================================== */

        .vw-id-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 24px;
          color: #938c84;
          background: #f4f1ea;
          border-top: 1px solid rgba(43, 38, 37, 0.06);
          font-size: 0.53rem;
          font-weight: 800;
          letter-spacing: 0.11em;
        }

        .vw-id-footer-status {
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--color-forest, #315847);
        }

        .vw-id-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #5c8b70;
          box-shadow: 0 0 0 3px rgba(92, 139, 112, 0.12);
        }

        /* =========================================
           RESPONSIVE
        ========================================== */

        @media (max-width: 500px) {
          .vw-digital-id-card {
            border-radius: 22px;
          }

          .vw-id-header {
            padding: 21px 18px 20px;
          }

          .vw-id-body {
            padding: 19px 17px 17px;
          }

          .vw-id-brand-subtitle {
            display: none;
          }

          .vw-id-verified-badge {
            padding: 6px 8px;
            font-size: 0.55rem;
          }

          .vw-id-avatar {
            width: 60px;
            height: 60px;
            flex-basis: 60px;
            border-radius: 18px;
            font-size: 1.7rem;
          }

          .vw-id-profile-info h3 {
            font-size: 1.2rem;
          }

          .vw-id-info-grid {
            grid-template-columns: 1fr;
          }

          .vw-id-wallet {
            max-width: 190px;
          }

          .vw-id-footer {
            padding: 10px 17px;
          }
        }

        @media (max-width: 370px) {
          .vw-id-header-top {
            align-items: flex-start;
          }

          .vw-id-verified-badge span {
            display: none;
          }

          .vw-id-verified-badge {
            width: 30px;
            height: 30px;
            padding: 0;
            justify-content: center;
          }

          .vw-id-profile {
            gap: 11px;
          }

          .vw-id-profile-info h3 {
            font-size: 1.05rem;
          }

          .vw-id-blockchain {
            align-items: flex-start;
          }

          .vw-id-qr {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default DigitalIdentityCard;