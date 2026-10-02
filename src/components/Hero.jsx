import { Link } from "react-router-dom";
import { FaShieldAlt, FaUserCheck, FaLock, FaEthereum, FaSearch } from "react-icons/fa";

function Hero() {
  return (
    <section className="vw-hero-section position-relative overflow-hidden py-5">
      {/* Background Ambient Glows */}
      <div className="vw-glow-orb vw-glow-orb-1"></div>
      <div className="vw-glow-orb vw-glow-orb-2"></div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center min-vh-75 py-4">

          {/* Left Column: Headline & Value Proposition */}
          <div className="col-lg-7 text-start">
            
            {/* Top Pill Badge */}
            <div className="mb-4">
              <span className="badge-web3">
                <span className="pulse-dot"></span>
                <span>EVM Smart Contract Live • Hardhat / Ethereum Localnet</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="vw-hero-title">
              Verifiable Work <br />
              <span className="text-gradient-primary">Digital Identity</span>
            </h1>

            <h2 className="vw-hero-subtitle mt-2">
              For Informal <span className="text-gradient-cyan">Domestic Workers</span>
            </h2>

            {/* Description */}
            <p className="vw-hero-lead mt-3 pe-lg-4">
              Empowering India’s domestic workforce with portable digital identities, 
              verifiable salary records, and cryptographic employment certificates anchored 
              immutably onto the Ethereum blockchain.
            </p>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap gap-3 mt-4 pt-2">
              <Link to="/register-worker" className="btn-web3-primary px-4 py-3">
                <FaUserCheck className="me-2" />
                Register Worker
              </Link>

              <Link to="/register-employer" className="btn-web3-cyan px-4 py-3">
                <FaShieldAlt className="me-2" />
                Register Employer
              </Link>

              <Link to="/verify-certificate" className="btn-web3-outline px-4 py-3">
                <FaSearch className="me-2" />
                Verify Credential
              </Link>
            </div>

            {/* Trust Proof Metrics */}
            <div className="d-flex flex-wrap gap-4 mt-5 pt-3 border-top border-secondary border-opacity-25">
              <div className="d-flex align-items-center gap-2">
                <div className="vw-mini-icon">
                  <FaLock className="text-cyan" />
                </div>
                <div>
                  <div className="fw-bold text-white small">Zero-Knowledge PII</div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>Aadhaar SHA-256 Masked</div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <div className="vw-mini-icon">
                  <FaEthereum className="text-purple" />
                </div>
                <div>
                  <div className="fw-bold text-white small">On-Chain Anchoring</div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>Immutable EVM Ledger</div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <div className="vw-mini-icon">
                  <FaShieldAlt className="text-emerald" />
                </div>
                <div>
                  <div className="fw-bold text-white small">Dual Hash Check</div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>Instant Tamper Detection</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Web3 Interactive Card Mockup */}
          <div className="col-lg-5 mt-5 mt-lg-0 text-center">
            <div className="vw-hero-card-container">
              
              {/* Floating Web3 Credential Card */}
              <div className="glass-card p-4 text-start position-relative animate-float">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="vw-card-chip"></div>
                    <span className="fw-bold text-white small letter-spacing-1">VERIWORK PASSPORT</span>
                  </div>
                  <span className="badge-web3-cyan py-1 px-2" style={{ fontSize: "0.7rem" }}>
                    EVM VERIFIED
                  </span>
                </div>

                <div className="my-3 py-2 border-top border-bottom border-white border-opacity-10">
                  <div className="text-muted small">Decentralized Identifier (DID)</div>
                  <div className="font-monospace text-cyan small fw-semibold">
                    did:veriwork:0x7d00...b48c
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>HOLDER NAME</div>
                    <div className="text-white fw-bold small">Sunita Sharma</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>ROLE / OCCUPATION</div>
                    <div className="text-white fw-bold small">Elder Caregiver & Chef</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>REPUTATION SCORE</div>
                    <div className="text-warning fw-bold small">⭐ 4.95 / 5.0 (42 Jobs)</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>ON-CHAIN STATE</div>
                    <div className="text-emerald fw-bold small">✓ Cryptographically Intact</div>
                  </div>
                </div>

                <div className="p-2 rounded-3 bg-black bg-opacity-40 border border-white border-opacity-10 font-monospace text-muted" style={{ fontSize: "0.7rem" }}>
                  <span>SHA-256: 0xb24a55f8...17bd5895204</span>
                </div>
              </div>

              {/* Floating Ambient Badge */}
              <div className="vw-floating-badge glass-card py-2 px-3 d-flex align-items-center gap-2">
                <span className="pulse-dot"></span>
                <span className="text-white small fw-semibold">Hardhat Block #2847 Mined</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        .vw-hero-section {
          min-height: 85vh;
          display: flex;
          align-items: center;
          padding-top: 4rem;
          padding-bottom: 4rem;
        }

        .vw-glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 1;
        }

        .vw-glow-orb-1 {
          width: 450px;
          height: 450px;
          background: rgba(99, 102, 241, 0.18);
          top: -100px;
          left: -100px;
        }

        .vw-glow-orb-2 {
          width: 500px;
          height: 500px;
          background: rgba(6, 182, 212, 0.15);
          bottom: -150px;
          right: -100px;
        }

        .vw-hero-title {
          font-size: 3.5rem;
          line-height: 1.15;
          letter-spacing: -0.03em;
        }

        .vw-hero-subtitle {
          font-size: 1.75rem;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .vw-hero-lead {
          font-size: 1.15rem;
          color: #94a3b8;
          line-height: 1.7;
          max-width: 640px;
        }

        .vw-mini-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
        }

        .vw-card-chip {
          width: 28px;
          height: 20px;
          border-radius: 4px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
        }

        .vw-hero-card-container {
          position: relative;
          max-width: 440px;
          margin: 0 auto;
        }

        .vw-floating-badge {
          position: absolute;
          bottom: -20px;
          left: -20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          animation: floatSlow 4s ease-in-out infinite alternate;
        }

        .text-cyan { color: #06b6d4; }
        .text-purple { color: #a855f7; }
        .text-emerald { color: #10b981; }

        @media (max-width: 768px) {
          .vw-hero-title {
            font-size: 2.5rem;
          }
          .vw-hero-subtitle {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;