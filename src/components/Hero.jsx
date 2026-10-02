import { Link } from "react-router-dom";
import { FaCheckCircle, FaShieldAlt, FaUserCheck, FaArrowRight, FaLock, FaFileContract, FaRupeeSign, FaHistory } from "react-icons/fa";
import heroImg from "../assets/hero.png";

function Hero() {
  return (
    <section className="vw-hero-section py-5 position-relative overflow-hidden">
      <div className="container">
        <div className="row align-items-center py-4">

          {/* Left Column: Headline & Value Proposition */}
          <div className="col-lg-6 text-start mb-5 mb-lg-0">
            
            {/* Tagline */}
            <div className="mb-3">
              <span className="veriwork-pill-badge">
                <FaShieldAlt size={12} className="text-warning" />
                <span>A Safer, Fairer Workforce</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="vw-hero-title mb-3">
              Trusted Work.<br />
              <span className="text-primary-dark">Verified Identity.</span>
            </h1>

            {/* Subtitle */}
            <p className="vw-hero-lead mb-4 pe-lg-3">
              Building a secure and transparent digital identity for informal domestic workers, 
              powered by trusted technology. Portable work history, verified wages, and mutual trust.
            </p>

            {/* CTAs */}
            <div className="d-flex flex-wrap gap-3 mb-5">
              <Link to="/register-worker" className="btn-veriwork-primary py-3 px-4">
                <FaUserCheck className="me-1" />
                <span>Register as Worker</span>
              </Link>

              <Link to="/register-employer" className="btn-veriwork-accent py-3 px-4">
                <span>Hire a Worker</span>
                <FaArrowRight size={12} className="ms-1" />
              </Link>
            </div>

            {/* Hero Trust Indicators */}
            <div className="row g-3 pt-3 border-top border-secondary border-opacity-10 vw-hero-trust-indicators">
              <div className="col-6 col-sm-3 d-flex align-items-center gap-2">
                <FaCheckCircle className="text-sage" size={14} />
                <span className="small fw-semibold text-dark">Verified Identities</span>
              </div>
              <div className="col-6 col-sm-3 d-flex align-items-center gap-2">
                <FaCheckCircle className="text-sage" size={14} />
                <span className="small fw-semibold text-dark">Secure Records</span>
              </div>
              <div className="col-6 col-sm-3 d-flex align-items-center gap-2">
                <FaCheckCircle className="text-sage" size={14} />
                <span className="small fw-semibold text-dark">Transparent Payments</span>
              </div>
              <div className="col-6 col-sm-3 d-flex align-items-center gap-2">
                <FaCheckCircle className="text-sage" size={14} />
                <span className="small fw-semibold text-dark">Trusted Work History</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual with Overlaid Verification Trust Card */}
          <div className="col-lg-6 text-center position-relative">
            <div className="vw-hero-image-wrapper mx-auto position-relative">
              
              {/* Background organic shape */}
              <div className="vw-hero-blob"></div>

              {/* Existing Hero Image */}
              <img
                src={heroImg}
                alt="Domestic Worker Digital Identity and Verification"
                className="img-fluid vw-hero-img position-relative"
                style={{ zIndex: 2, maxHeight: "440px", objectFit: "contain" }}
              />

              {/* Floating Verification Badge Card */}
              <div className="vw-floating-trust-card veriwork-card p-3 text-start position-absolute animate-subtle-float">
                <div className="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom border-secondary border-opacity-10">
                  <div className="vw-badge-avatar">
                    <FaShieldAlt size={14} />
                  </div>
                  <div>
                    <div className="fw-bold text-dark small" style={{ lineHeight: "1.2" }}>VeriWork Trust Seal</div>
                    <div className="text-muted" style={{ fontSize: "0.7rem" }}>Cryptographically Anchored</div>
                  </div>
                </div>

                <div className="d-flex flex-column gap-1 small">
                  <div className="d-flex align-items-center gap-2">
                    <FaCheckCircle className="text-sage" size={12} />
                    <span className="fw-semibold text-dark" style={{ fontSize: "0.8rem" }}>Verified Worker</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <FaCheckCircle className="text-sage" size={12} />
                    <span className="fw-semibold text-dark" style={{ fontSize: "0.8rem" }}>ID Verified (Aadhaar Hashed)</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <FaCheckCircle className="text-sage" size={12} />
                    <span className="fw-semibold text-dark" style={{ fontSize: "0.8rem" }}>Work History Recorded</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <FaCheckCircle className="text-sage" size={12} />
                    <span className="fw-semibold text-dark" style={{ fontSize: "0.8rem" }}>Secure Payments</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        .vw-hero-section {
          background-color: var(--color-bg);
        }

        .vw-hero-title {
          font-size: 3.5rem;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: var(--color-text);
        }

        .text-primary-dark {
          color: var(--color-primary-dark);
        }

        .vw-hero-lead {
          font-size: 1.15rem;
          color: var(--color-text-muted);
          line-height: 1.7;
          max-width: 540px;
        }

        .text-sage {
          color: var(--color-primary);
        }

        .vw-hero-image-wrapper {
          max-width: 500px;
        }

        .vw-hero-blob {
          position: absolute;
          top: 10%;
          left: 10%;
          width: 80%;
          height: 80%;
          background-color: #E6E1D7;
          border-radius: 60% 40% 70% 30% / 40% 50% 60% 50%;
          z-index: 1;
        }

        .vw-floating-trust-card {
          bottom: 10px;
          left: -15px;
          z-index: 3;
          width: 250px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--color-border);
        }

        .vw-badge-avatar {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          background-color: var(--color-primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .vw-hero-title {
            font-size: 2.5rem;
          }
          .vw-floating-trust-card {
            position: relative;
            left: 0;
            bottom: 0;
            margin: 20px auto 0;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;