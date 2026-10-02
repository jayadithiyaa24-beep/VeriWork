import { FaIdCard, FaLightbulb, FaShieldAlt, FaUsers, FaBuilding, FaCheckCircle, FaStar } from "react-icons/fa";
import heroWorkerImg from "../assets/hero_worker.jpg";

function About() {
  return (
    <div className="vw-about-page py-5">
      <div className="container py-3">

        {/* Top Hero Mission Row */}
        <div className="row g-4 align-items-center mb-5 pb-3">
          <div className="col-lg-7 text-start">
            <span className="mockup-tag-pill mb-3">
              About VeriWork
            </span>
            <h1 className="display-4 fw-bold text-dark mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              Our Mission
            </h1>
            <p className="lead text-muted" style={{ fontSize: "1.2rem", lineHeight: "1.8" }}>
              To create a safer, more transparent, and more dignified work environment for informal domestic workers through verified digital identities and blockchain technology.
            </p>
          </div>

          <div className="col-lg-5 text-center">
            <div className="vw-about-portrait mx-auto shadow-md">
              <img
                src={heroWorkerImg}
                alt="Domestic Worker"
                className="img-fluid vw-about-img"
              />
            </div>
          </div>
        </div>

        {/* 3 Process / Solution Rows */}
        <div className="row g-4 justify-content-center mb-5">
          <div className="col-lg-10">
            <div className="d-flex flex-column gap-4">
              
              {/* The Problem */}
              <div className="mockup-card p-4 d-flex align-items-start gap-4 text-start">
                <div className="vw-about-icon-circle flex-shrink-0">
                  <FaIdCard size={22} />
                </div>
                <div>
                  <h4 className="fw-bold text-dark mb-1 fs-5">
                    The Problem
                  </h4>
                  <p className="text-muted mb-0 small" style={{ lineHeight: "1.7", fontSize: "0.95rem" }}>
                    Informal domestic workers often lack verifiable identity, trusted work history, and secure payment systems, leading to low trust and lack of opportunities.
                  </p>
                </div>
              </div>

              {/* Our Solution */}
              <div className="mockup-card p-4 d-flex align-items-start gap-4 text-start">
                <div className="vw-about-icon-circle flex-shrink-0">
                  <FaLightbulb size={22} />
                </div>
                <div>
                  <h4 className="fw-bold text-dark mb-1 fs-5">
                    Our Solution
                  </h4>
                  <p className="text-muted mb-0 small" style={{ lineHeight: "1.7", fontSize: "0.95rem" }}>
                    VeriWork provides a blockchain-based digital identity, secure verification, transparent payments, and employer ratings to build trust and create better opportunities.
                  </p>
                </div>
              </div>

              {/* How Blockchain Helps */}
              <div className="mockup-card p-4 d-flex align-items-start gap-4 text-start">
                <div className="vw-about-icon-circle flex-shrink-0">
                  <FaShieldAlt size={22} />
                </div>
                <div>
                  <h4 className="fw-bold text-dark mb-1 fs-5">
                    How Blockchain Helps
                  </h4>
                  <p className="text-muted mb-0 small" style={{ lineHeight: "1.7", fontSize: "0.95rem" }}>
                    All records are stored securely and cannot be tampered with, ensuring transparency and trust for both workers and employers.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom 4 Statistics Bar */}
        <div className="mockup-card-cream p-4 p-md-5 mx-auto max-w-1000">
          <div className="row g-4 text-center">
            
            <div className="col-6 col-md-3">
              <div className="d-flex flex-column align-items-center">
                <div className="vw-stat-icon mb-2">
                  <FaUsers size={20} />
                </div>
                <div className="display-6 fw-bold text-dark mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                  1000+
                </div>
                <div className="small text-muted fw-semibold">
                  Workers Empowered
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="d-flex flex-column align-items-center">
                <div className="vw-stat-icon mb-2">
                  <FaBuilding size={20} />
                </div>
                <div className="display-6 fw-bold text-dark mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                  500+
                </div>
                <div className="small text-muted fw-semibold">
                  Verified Employers
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="d-flex flex-column align-items-center">
                <div className="vw-stat-icon mb-2">
                  <FaCheckCircle size={20} />
                </div>
                <div className="display-6 fw-bold text-dark mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                  100%
                </div>
                <div className="small text-muted fw-semibold">
                  Secure Records
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="d-flex flex-column align-items-center">
                <div className="vw-stat-icon mb-2">
                  <FaStar size={20} />
                </div>
                <div className="display-6 fw-bold text-dark mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                  4.8/5
                </div>
                <div className="small text-muted fw-semibold">
                  Average Rating
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        .vw-about-portrait {
          width: 320px;
          height: 320px;
          border-radius: 50%;
          overflow: hidden;
          border: 6px solid #FFFFFF;
        }

        .vw-about-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vw-about-icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: var(--color-ochre-light, #FBF2E6);
          color: var(--color-ochre, #C98A41);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vw-stat-icon {
          color: var(--color-forest);
        }

        .max-w-1000 {
          max-width: 1000px;
        }
      `}</style>
    </div>
  );
}

export default About;