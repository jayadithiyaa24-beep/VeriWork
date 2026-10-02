import { Link } from "react-router-dom";
import { FaArrowRight, FaShieldAlt, FaFileAlt, FaRupeeSign, FaCheck } from "react-icons/fa";
import heroWorkerImg from "../assets/hero_worker.jpg";

function Hero() {
  return (
    <section className="vw-hero-section py-5 position-relative overflow-hidden">
      <div className="container">
        <div className="row align-items-center py-3">

          {/* Left Column */}
          <div className="col-lg-6 text-start mb-5 mb-lg-0">
            
            {/* Top Pill Tag */}
            <div className="mb-3">
              <span className="mockup-tag-pill">
                A Safer, Fairer Workforce
              </span>
            </div>

            {/* Headline */}
            <h1 className="vw-hero-headline mb-3">
              Trusted Work.<br />
              Verified Identity.
            </h1>

            {/* Subtitle */}
            <p className="vw-hero-subtitle mb-4 pe-lg-4">
              Building a secure and transparent digital identity for informal domestic workers, powered by blockchain.
            </p>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap gap-3 mb-5">
              <Link to="/register-worker" className="btn-mockup-forest py-3 px-4">
                <span>Register as Worker</span>
                <FaArrowRight size={12} className="ms-1" />
              </Link>

              <Link to="/register-employer" className="btn-mockup-ochre py-3 px-4">
                <span>Hire a Worker</span>
                <FaArrowRight size={12} className="ms-1" />
              </Link>
            </div>

            {/* 3 Trust Badges */}
            <div className="d-flex flex-wrap gap-3 pt-2">
              <div className="mockup-trust-badge">
                <div className="vw-trust-icon-box">
                  <FaShieldAlt size={14} />
                </div>
                <span className="fw-semibold text-dark small">Verified Identities</span>
              </div>

              <div className="mockup-trust-badge">
                <div className="vw-trust-icon-box">
                  <FaFileAlt size={14} />
                </div>
                <span className="fw-semibold text-dark small">Secure Records</span>
              </div>

              <div className="mockup-trust-badge">
                <div className="vw-trust-icon-box">
                  <FaRupeeSign size={14} />
                </div>
                <span className="fw-semibold text-dark small">Transparent Payments</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Photo & Verification Overlay */}
          <div className="col-lg-6 text-center position-relative">
            <div className="vw-hero-portrait-wrapper mx-auto position-relative">
              
              {/* Main Worker Portrait */}
              <div className="vw-hero-portrait-circle overflow-hidden shadow-lg mx-auto">
                <img
                  src={heroWorkerImg}
                  alt="Verified Domestic Worker"
                  className="img-fluid vw-hero-portrait-img"
                />
              </div>

              {/* Floating Verification Checklist Card */}
              <div className="vw-hero-floating-card mockup-card p-3 text-start position-absolute animate-subtle-float">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="vw-check-circle">
                      <FaCheck size={9} />
                    </div>
                    <span className="fw-bold text-dark small">Verified Worker</span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <div className="vw-check-circle">
                      <FaCheck size={9} />
                    </div>
                    <span className="fw-bold text-dark small">ID Verified</span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <div className="vw-check-circle">
                      <FaCheck size={9} />
                    </div>
                    <span className="fw-bold text-dark small">Work History</span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <div className="vw-check-circle">
                      <FaCheck size={9} />
                    </div>
                    <span className="fw-bold text-dark small">Secure Payments</span>
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
          min-height: 80vh;
          display: flex;
          align-items: center;
        }

        .vw-hero-headline {
          font-family: var(--font-serif);
          font-size: 3.8rem;
          line-height: 1.1;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--color-text);
        }

        .vw-hero-subtitle {
          font-size: 1.15rem;
          color: var(--color-text-muted);
          line-height: 1.7;
          max-width: 520px;
        }

        .vw-trust-icon-box {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background-color: var(--color-forest-light);
          color: var(--color-forest);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vw-hero-portrait-wrapper {
          max-width: 460px;
          position: relative;
        }

        .vw-hero-portrait-circle {
          width: 420px;
          height: 420px;
          border-radius: 50%;
          border: 8px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 20px 50px rgba(43, 38, 37, 0.15);
        }

        .vw-hero-portrait-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vw-hero-floating-card {
          bottom: 25px;
          right: -10px;
          width: 190px;
          border-radius: 18px;
          box-shadow: 0 16px 36px rgba(43, 38, 37, 0.15);
          background-color: #FFFFFF;
          border: 1px solid var(--color-border);
          z-index: 3;
        }

        .vw-check-circle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: #2E7D32;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @media (max-width: 991px) {
          .vw-hero-headline {
            font-size: 2.8rem;
          }
          .vw-hero-portrait-circle {
            width: 320px;
            height: 320px;
          }
          .vw-hero-floating-card {
            right: 0;
            bottom: 0;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;